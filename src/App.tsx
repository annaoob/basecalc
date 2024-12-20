import React, { ChangeEvent, Component, MouseEvent } from "react";
import { Natural, stringToNatural, naturalToString, add, mul, changeBase } from './natural';
import { List, compact, compactList, cons, explode, nil, rev, removeLeading } from "./list";


// Enum that records our knowledge about parsing some input string.
type ParseState<A> =
    {kind: "unknown"}
  | {kind: "valid", value: A}
  | {kind: "invalid", error: string};


type AppState = {
  stack: List<Natural>;  // Inv: stack[i].base = base for all i

  baseStr: string;
  baseState: ParseState<number>;

  digitsStr: string;
  digitsState: ParseState<string>;
};


/**
 * Displays a stack of natural numbers and UI that allows the user to push a new
 * number, pop the top-most number, or add or multiply the top two numbers.
 */
export class App extends Component<{}, AppState> {

  constructor(props: {}) {
    super(props);

    this.state = {
        stack: nil,
        baseStr: "10", baseState: {kind: "valid", value: 10},
        digitsStr: "", digitsState: {kind: "valid", value: ""},
      };
  }
  
  render = (): JSX.Element => {
    return <div>
        {this.renderBase()}
        {this.renderDigits()}
        {this.renderStack()}
        {this.renderStackOps()}
      </div>;
  };

  renderBase = (): JSX.Element => {
    return <div>
        <label style={{marginLeft: '10px'}} htmlFor="base">Base:</label>{' '}
        <input type="number" min={2} max={36} id="base"
            value={this.state.baseStr}
            onChange={this.doBaseChange}></input>

        <button style={{marginLeft: '10px'}}
            onClick={this.doUpdateClick}>Update</button>

        {this.renderBadBase()}
      </div>
  };

  renderBadBase = (): JSX.Element => {
    if (this.state.baseState.kind === "invalid") {
      return <span style={{color: 'red', marginLeft: '10px'}}>
          {this.state.baseState.error}
        </span>;
    } else {
      return <span></span>;  // nothing
    }
  };

  renderDigits = (): JSX.Element => {
    return <div style={{marginTop: '10px'}}>
        <label htmlFor="digits">Digits:</label>{' '}
        <input type="text" value={this.state.digitsStr} id="digits"
            onChange={this.doDigitsChange}></input>

        <button style={{marginLeft: '10px'}}
            onClick={this.doPushClick}>Push</button>

        {this.renderBadDigits()}
      </div>
  };

  renderBadDigits = (): JSX.Element => {
    if (this.state.digitsState.kind === "invalid") {
      return <span style={{color: 'red', marginLeft: '10px'}}>
          {this.state.digitsState.error}
        </span>;
    } else {
      return <span></span>;  // nothing
    }
  };

  renderStack = (): JSX.Element => {
    if (this.state.stack.kind === "nil") {
      return <p style={{marginLeft: '10px'}}>
          <em>The stack is empty... </em>
          Push a number to get started.
        </p>;
    }

    let elems: List<JSX.Element> = nil;
    let stack: List<Natural> = this.state.stack;
    let key: number = 1;

    // Inv: rev(renderStack(this.state.stack)) = rev(renderStack(stack)) ++ elems
    while (stack.kind !== "nil") {
      const digits = compact(naturalToString(stack.hd));
      elems = cons(<li key={key}>{digits}</li>, elems);
      stack = stack.tl;
      key = key + 1;
    }

    return <ul>{compactList(rev(elems))}</ul>;
  };

  renderStackOps = (): JSX.Element => {
    // TODO: render buttons that allow the user to pop, add, and multiply
    //       numbers on the stack
    if (this.state.stack.kind !== "nil" && this.state.stack.tl.kind !== "nil") {
      return <div>
        <button style={{marginLeft: '10px'}}
          onClick={this.doPopClick}>Pop</button>
        <button style={{marginLeft: '10px'}}
          onClick={this.doAddClick}>Add</button>
        <button style={{marginLeft: '10px'}}
          onClick={this.doMulClick}>Multiply</button>
      </div>;
    }
    if (this.state.stack.kind !== "nil") {
      return <div>
        <button style = {{marginLeft: '10px'}}
          onClick={this.doPopClick}>Pop</button>
      </div>
    }
    return<span></span>
  };

  doBaseChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    this.setState({
        baseStr: evt.target.value, baseState: {kind: "unknown"},
        digitsState: {kind: "unknown"}
      });
  };

  doUpdateClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
    const base = parseInt(this.state.baseStr, 10);
    if (isNaN(base) || base !== Math.floor(base)) {
      this.setState({baseState: {kind: "invalid", error: "not an integer"}})

    } else if (base < 2 || 36 < base) {
      this.setState({baseState: {kind: "invalid", error: "not in 2 .. 36"}})

    } else {
      let newStack: List<Natural> = nil;
      let stack = this.state.stack;

      // Inv: rev(update(this.state.stack)) = rev(update(stack)) ++ newStack
      // where update(nil) = nil and
      //       update(nat :: nats) = changeBase(nat, base) :: update(nats)
      while (stack.kind !== "nil") {
        newStack = cons(changeBase(stack.hd, base), newStack);
        stack = stack.tl;
      }

      // newStack = rev(update(this.state.stack)),
      // so rev(newStack) = update(this.state.stack)
      this.setState({
          baseState: {kind: "valid", value: base},
          stack: rev(newStack)
        });
    }
  };

  doDigitsChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    this.setState(
        {digitsStr: evt.target.value, digitsState: {kind: "unknown"}});
  };

  doPushClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
    if (this.state.baseState.kind === "invalid") {
      // let the user fix this first...

    } else if (this.state.baseState.kind === "unknown") {
      this.setState({digitsState: {
          kind: "invalid",
          error: "finish updating the base first"
        }});

    } else {
      const base = this.state.baseState.value;
      try {
        const digits = removeLeading("0", explode(this.state.digitsStr));
        const nat = stringToNatural(digits, base);
        this.setState({
            stack: cons(nat, this.state.stack),
            digitsStr: "",
            digitsState: {kind: "valid", value: ""}
          });
      } catch (e: unknown) {
        this.setState({digitsState: {
            kind: "invalid",
            error: `not valid base-${base} digits`,
          }});
      }
    }
  };

  doPopClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
    if (this.state.stack.kind === "nil") {
      throw new Error("Nothing in stack");

    } else {
      this.setState({
        stack: this.state.stack.tl,
        digitsStr: this.state.digitsStr,
        digitsState: this.state.digitsState
      });
    }
  };

  doAddClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
    if (this.state.stack.kind === "nil" || this.state.stack.tl.kind === "nil") {
      throw new Error("Fewer than 2 items in stack");

    } else {
      const num1 = this.state.stack.hd;
      const num2 = this.state.stack.tl.hd;
      // const base = add(num1, num2).base;
      // const digits = removeLeading("0", naturalToString(add(num1, num2)));
      // const result = stringToNatural(digits, base);
      const result = add(num1, num2);
      this.setState({
        stack: cons(result, this.state.stack.tl.tl),
        digitsStr: this.state.digitsStr,
        digitsState: this.state.digitsState
      });
    }
  };

  doMulClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
    if (this.state.stack.kind === "nil" || this.state.stack.tl.kind === "nil") {
      throw new Error("Fewer than 2 items in stack");

    } else {
      const num1 = this.state.stack.hd;
      const num2 = this.state.stack.tl.hd;
      // const base = mul(num1, num2).base;
      // const digits = removeLeading("0", naturalToString(mul(num1, num2)));
      // const result = stringToNatural(digits, base);
      const result = mul(num1, num2);
      this.setState({
        stack: cons(result, this.state.stack.tl.tl),
        digitsStr: this.state.digitsStr,
        digitsState: this.state.digitsState
      });
    }
  };


}
