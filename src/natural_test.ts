import * as assert from 'assert';
import { nil, cons, explode } from './list';
import {
    naturalToString, numberToNatural, stringToNatural,
    add, mul, scale, changeBase
} from './natural';

// Note: the tests provided here exceed the minimum number required by our
// course guidelines

describe('natural', function() {

  // NOTE: check out the provided functions compact() and explode() in list.ts
  //    - compact() takes a list of characters (length 0 strings) and turns
  //      them into a string
  //    - explode() takes a string and turns them into a list of individual 
  //      characters
  // These functions may be helpful for writing test cases for naturalToString
  // as it can be easier to think about what these functions are doing in terms
  // of strings instead of lists (i.e. if a function returns a list, call
  // compact() to make it a string to compare to a string expected value).
  // Using these are not required. See stringToNatural tests for an example.

  it('naturalToString', function() {
    // TODO: write your tests here
    // Statement coverage: ({digits: nil, base: 10}) executes 1st return and
    // ({digits: cons(0, nil), base: 10}) executes 2nd return
    assert.deepStrictEqual(
        naturalToString({digits: nil, base: 10}), 
        cons("0", nil));
    assert.deepStrictEqual(
        naturalToString({digits: cons(0, nil), base: 10}), 
        cons("0", nil));

    // The next test is applying naturalToString to the output of
    // stringToNatural to see if we get the same number we passed in.
    assert.deepStrictEqual(
        naturalToString(stringToNatural(cons("0", nil), 10)), 
        cons("0", nil));

    // Branch coverage, covered above, ({digits: nil, base: 10}) executes 1st branch
    // ({digits: cons(0, nil), base: 10}) executes 2nd branch

    // Loop/recursion coverage, 0 case: covered above by ({digits: nil, base: 10})
    // Loop/recursion coverage, 1 case: covered above by ({digits: cons(0, nil), base: 10})

    // Loop/recursion coverage, many case: covered by 1 :: 2 :: 0 :: 1 :: 2 :: 0 :: nil
    assert.deepStrictEqual(
        naturalToString({digits: cons(0, cons(2, cons(1, nil))), base: 10}), 
        cons("1", cons("2", cons("0", nil))));
    assert.deepStrictEqual(
        naturalToString({digits: cons(0, cons(2, cons(1, nil))), base: 3}), 
        cons("1", cons("2", cons("0", nil))));
    assert.deepStrictEqual(
        naturalToString({digits: cons(0, cons(10, cons(35, nil))), base: 36}), 
        cons("Z", cons("A", cons("0", nil))));
    assert.deepStrictEqual(
        naturalToString({digits: cons(0, cons(1, cons(1, nil))), base: 2}), 
        cons("1", cons("1", cons("0", nil))));

    // The next 4 tests are applying naturalToString to the output of
    // stringToNatural to see if we get the same number we passed in.
    assert.deepStrictEqual(
        naturalToString(stringToNatural(cons("1", cons("2", cons("0", nil))), 10)), 
        cons("1", cons("2", cons("0", nil))));
    assert.deepStrictEqual(
        naturalToString(stringToNatural(cons("1", cons("2", cons("0", nil))), 3)), 
        cons("1", cons("2", cons("0", nil))));
    assert.deepStrictEqual(
        naturalToString(stringToNatural(cons("Z", cons("A", cons("0", nil))), 36)), 
        cons("Z", cons("A", cons("0", nil))));
    assert.deepStrictEqual(
        naturalToString(stringToNatural(cons("1", cons("1", cons("0", nil))), 2)), 
        cons("1", cons("1", cons("0", nil))));
  });

  it('stringToNatural', function() {
    assert.deepStrictEqual(
        stringToNatural(explode(""), 2),
        {digits: nil, base: 2});
    assert.deepStrictEqual(
        stringToNatural(explode(""), 3),
        {digits: nil, base: 3});

    assert.deepStrictEqual(
        stringToNatural(explode("0"), 2),
        {digits: nil, base: 2});
    assert.deepStrictEqual(
        stringToNatural(explode("0"), 5),
        {digits: nil, base: 5});

    assert.deepStrictEqual(
        stringToNatural(explode("1"), 2),
        {digits: cons(1, nil), base: 2});
    assert.deepStrictEqual(
        stringToNatural(explode("F"), 16),
        {digits: cons(15, nil), base: 16});

    assert.deepStrictEqual(
        stringToNatural(explode("10"), 2),
        {digits: cons(0, cons(1, nil)), base: 2});
    assert.deepStrictEqual(
        stringToNatural(explode("11"), 2),
        {digits: cons(1, cons(1, nil)), base: 2});
    assert.deepStrictEqual(
        stringToNatural(explode("10"), 16),
        {digits: cons(0, cons(1, nil)), base: 16});
    assert.deepStrictEqual(
        stringToNatural(explode("3A"), 16),
        {digits: cons(10, cons(3, nil)), base: 16});
    assert.deepStrictEqual(
        stringToNatural(explode("5ZA"), 36),
        {digits: cons(10, cons(35, cons(5, nil))), base: 36});
  });

  it('add', function() {
    // TODO: write your tests here
    // Statement coverage: ({digits: nil, base: 10}, {digits: nil, base: 10}) executes 1st and only return
    assert.deepStrictEqual(
        add({digits: nil, base: 10}, {digits: nil, base: 10}), 
        {digits: nil, base: 10});

    // Branch coverage, 1st branch, first if branch in while loop: covered by ({digits: cons(5, nil), base: 10}, {digits: cons(5, nil), base: 10})
    // Statement coverage: covers the statements inside the 1st branch, first if branch in while loop
    assert.deepStrictEqual(
        add({digits: cons(5, nil), base: 10}, {digits: cons(5, nil), base: 10}), 
        {digits: cons(0, cons(1, nil)), base: 10});

    // Branch coverage, 2nd branch, first else if branch in while loop: covered by ({digits: cons(1, nil), base: 10}, {digits: cons(1, nil), base: 10})
    // Statement coverage: covers the statements inside the 2nd branch, first else if branch in while loop
    assert.deepStrictEqual(
        add({digits: cons(1, nil), base: 10}, {digits: cons(1, nil), base: 10}), 
        {digits: cons(2, nil), base: 10});
    
    // Branch coverage, 3rd branch, second else if branch in while loop: covered by ({digits: cons(9, cons(9, nil)), base: 10}, {digits: cons(1, nil), base: 10})
    // Statement coverage: covers the statements inside the 3rd branch, second else if branch in while loop
    assert.deepStrictEqual(
        add({digits: cons(9, cons(9, nil)), base: 10}, {digits: cons(1, nil), base: 10}), 
        {digits: cons(0, cons(0, cons(1, nil))), base: 10});

    // Branch coverage, 4th branch, third else if branch in while loop: covered by ({digits: cons(1, nil), base: 10}, {digits: cons(9, cons(9, nil)), base: 10})
    // Statement coverage: covers the statements inside the 4th branch, third else if branch in while loop
    assert.deepStrictEqual(
        add({digits: cons(1, nil), base: 10}, {digits: cons(9, cons(9, nil)), base: 10}), 
        {digits: cons(0, cons(0, cons(1, nil))), base: 10});
    
    // Branch coverage, 5th branch, first if branch after while loop: covered by ({digits: cons(5, nil), base: 10}, {digits: cons(5, nil), base: 10})
    // Statement coverage: covers the statements inside the 5th branch, first if branch after while loop
    assert.deepStrictEqual(
        add({digits: cons(5, nil), base: 10}, {digits: cons(5, nil), base: 10}), 
        {digits: cons(0, cons(1, nil)), base: 10});

    // Branch coverage, 6th branch, first else if branch after while loop: covered by ({digits: nil, base: 10}, {digits: cons(1, nil), base: 10})
    // Statement coverage: covers the statements inside the 6th branch, first else if branch after while loop
    assert.deepStrictEqual(
        add({digits: nil, base: 10}, {digits: cons(1, nil), base: 10}), 
        {digits: cons(1, nil), base: 10});

    // Branch coverage, 7th branch, second else if branch after while loop: covered by ({digits: cons(1, nil), base: 10}, {digits: nil, base: 10})
    // Statement coverage: covers the statements inside the 7th branch, second else if branch after while loop
    assert.deepStrictEqual(
        add({digits: cons(1, nil), base: 10}, {digits: nil, base: 10}), 
        {digits: cons(1, nil), base: 10});

    // Branch coverage, 8th branch, doesn't enter loop and doesn't do any of the conditionals after the loop: covered above by ({digits: nil, base: 10}, {digits: nil, base: 10})
    // Conditionals inside the loop take care of all possible cases, so can't test branch coverage for executing the loop and not executing any of the conditionals inside of it   

    // Loop/recursion coverage, 0 case: covered above by ({digits: nil, base: 10}, {digits: nil, base: 10})
    // Loop/recursion coverage, 1 case: when we first enter the loop, could only be either the if or first else if statement because c=0 first time
    // However, I will also be including doing the other else if branches in the while loop only once here as well
    // Loop/recursion coverage, 1 case, first if branch in while loop: covered above by ({digits: cons(5, nil), base: 10}, {digits: cons(5, nil), base: 10})
    // Loop/recursion coverage, 1 case, first else if branch in while loop: covered above by ({digits: cons(1, nil), base: 10}, {digits: cons(1, nil), base: 10})
    // Loop/recursion coverage, 1 case, second else if branch in while loop: covered above by ({digits: cons(9, cons(9, nil)), base: 10}, {digits: cons(1, nil), base: 10})
    // Loop/recursion coverage, 1 case, third else if branch in while loop: covered by ({digits: cons(1, nil), base: 10}, {digits: cons(9, cons(9, nil)), base: 10})

    // Loop/recursion coverage, many case, first if branch in while loop: covered by ({digits: cons(5, cons(5, nil)), base: 10}, {digits: cons(5, cons(5, nil)), base: 10})
    assert.deepStrictEqual(
        add({digits: cons(5, cons(5, nil)), base: 10}, {digits: cons(5, cons(5, nil)), base: 10}), 
        {digits: cons(0, cons(1, cons(1, nil))), base: 10});
    
    // Loop/recursion coverage, many case, first else if branch in while loop: covered by ({digits: cons(1, cons(1, nil)), base: 10}, {digits: cons(1, cons(1, nil)), base: 10})
    assert.deepStrictEqual(
        add({digits: cons(1, cons(1, nil)), base: 10}, {digits: cons(1, cons(1, nil)), base: 10}), 
        {digits: cons(2, cons(2, nil)), base: 10});
    
    // Loop/recursion coverage, many case, second else if branch in while loop: covered by ({digits: cons(9, cons(9, cons(9, nil))), base: 10}, {digits: cons(1, nil), base: 10})
    assert.deepStrictEqual(
        add({digits: cons(9, cons(9, cons(9, nil))), base: 10}, {digits: cons(1, nil), base: 10}), 
        {digits: cons(0, cons(0, cons(0, cons(1, nil)))), base: 10});
    
    // Loop/recursion coverage, many case, third else if branch in while loop: covered by ({digits: cons(1, nil), base: 10}, {digits: cons(9, cons(9, cons(9, nil))), base: 10})
    assert.deepStrictEqual(
        add({digits: cons(1, nil), base: 10}, {digits: cons(9, cons(9, cons(9, nil))), base: 10}), 
        {digits: cons(0, cons(0, cons(0, cons(1, nil)))), base: 10});
    
    // Additional tests
    assert.deepStrictEqual(
        add({digits: cons(1, nil), base: 2}, {digits: cons(1, cons(1, cons(1, nil))), base: 2}), 
        {digits: cons(0, cons(0, cons(0, cons(1, nil)))), base: 2});
    assert.deepStrictEqual(
        add({digits: cons(1, cons(1, nil)), base: 2}, {digits: cons(1, cons(1, cons(1, nil))), base: 2}), 
        {digits: cons(0, cons(1, cons(0, cons(1, nil)))), base: 2});
    assert.deepStrictEqual(
        add({digits: cons(35, cons(35, nil)), base: 36}, {digits: cons(10, cons(10, cons(10, nil))), base: 36}), 
        {digits: cons(9, cons(10, cons(11, nil))), base: 36});
    assert.deepStrictEqual(
        add({digits: cons(4, nil), base: 5}, {digits: cons(1, nil), base: 5}), 
        {digits: cons(0, cons(1, nil)), base: 5});
  });
  
  it('numberToNatural', function() {
    assert.deepStrictEqual(numberToNatural(0, 2),
        {digits: nil, base: 2});
    assert.deepStrictEqual(numberToNatural(0, 10),
        {digits: nil, base: 10});

    assert.deepStrictEqual(numberToNatural(1, 2),
        {digits: cons(1, nil), base: 2});
    assert.deepStrictEqual(numberToNatural(15, 16),
        {digits: cons(15, nil), base: 16});

    assert.deepStrictEqual(numberToNatural(2, 2),
        {digits: cons(0, cons(1, nil)), base: 2});
    assert.deepStrictEqual(numberToNatural(3, 2),
        {digits: cons(1, cons(1, nil)), base: 2});
    assert.deepStrictEqual(numberToNatural(12, 10),
        {digits: cons(2, cons(1, nil)), base: 10});
    assert.deepStrictEqual(numberToNatural(21, 10),
        {digits: cons(1, cons(2, nil)), base: 10});

    assert.deepStrictEqual(numberToNatural(6, 2),
        {digits: cons(0, cons(1, cons(1, nil))), base: 2});
    assert.deepStrictEqual(numberToNatural(31, 2),
        {digits: cons(1, cons(1, cons(1, cons(1, cons(1, nil))))), base: 2});
    assert.deepStrictEqual(numberToNatural(32, 2),
        {digits: cons(0, cons(0, cons(0, cons(0, cons(0, cons(1, nil)))))), base: 2});
    assert.deepStrictEqual(numberToNatural(321, 10),
        {digits: cons(1, cons(2, cons(3, nil))), base: 10});
    assert.deepStrictEqual(numberToNatural(123, 10),
        {digits: cons(3, cons(2, cons(1, nil))), base: 10});
    assert.deepStrictEqual(numberToNatural(1010, 10),
        {digits: cons(0, cons(1, cons(0, cons(1, nil)))), base: 10});
  });

  it('scale', function() {
    assert.deepStrictEqual(scale({digits: nil, base: 10}, 5),
        {digits: nil, base: 10});
    assert.deepStrictEqual(scale({digits: nil, base: 3}, 2),
        {digits: nil, base: 3});

    assert.deepStrictEqual(scale({digits: cons(1, nil), base: 10}, 5),
        {digits: cons(5, nil), base: 10});
    assert.deepStrictEqual(scale({digits: cons(2, nil), base: 10}, 5),
        {digits: cons(0, cons(1, nil)), base: 10});
    assert.deepStrictEqual(scale({digits: cons(1, nil), base: 3}, 2),
        {digits: cons(2, nil), base: 3});
    assert.deepStrictEqual(scale({digits: cons(2, nil), base: 3}, 2),
        {digits: cons(1, cons(1, nil)), base: 3});

    assert.deepStrictEqual(scale({digits: cons(0, cons(2, nil)), base: 10}, 3),
        {digits: cons(0, cons(6, nil)), base: 10});
    assert.deepStrictEqual(scale({digits: cons(3, cons(0, cons(1, nil))), base: 10}, 3),
        {digits: cons(9, cons(0, cons(3, nil))), base: 10});
    assert.deepStrictEqual(scale({digits: cons(3, cons(0, cons(1, nil))), base: 10}, 9),
        {digits: cons(7, cons(2, cons(9, nil))), base: 10});
    assert.deepStrictEqual(scale({digits: cons(0, cons(1, nil)), base: 3}, 2),
        {digits: cons(0, cons(2, nil)), base: 3});
    assert.deepStrictEqual(scale({digits: cons(0, cons(1, cons(1, nil))), base: 3}, 2),
        {digits: cons(0, cons(2, cons(2, nil))), base: 3});
    assert.deepStrictEqual(scale({digits: cons(0, cons(2, cons(1, nil))), base: 3}, 2),
        {digits: cons(0, cons(1, cons(0, cons(1, nil)))), base: 3});
  });

  it('mul', function() {
    assert.deepStrictEqual(mul(
        {digits: cons(1, cons(2, cons(3, nil))), base: 10},
        {digits: nil, base: 10}),
        {digits: nil, base: 10});
    assert.deepStrictEqual(mul(
        {digits: cons(0, cons(2, cons(1, nil))), base: 3},
        {digits: nil, base: 3}),
        {digits: nil, base: 3});

    assert.deepStrictEqual(mul(
        {digits: cons(1, cons(2, cons(3, nil))), base: 10},
        {digits: cons(3, nil), base: 10}),
        {digits: cons(3, cons(6, cons(9, nil))), base: 10});
    assert.deepStrictEqual(mul(
        {digits: cons(1, cons(2, cons(3, nil))), base: 10},
        {digits: cons(4, nil), base: 10}),
        {digits: cons(4, cons(8, cons(2, cons(1, nil)))), base: 10});
    assert.deepStrictEqual(mul(
        {digits: cons(1, cons(0, cons(1, nil))), base: 3},
        {digits: cons(2, nil), base: 3}),
        {digits: cons(2, cons(0, cons(2, nil))), base: 3});
    assert.deepStrictEqual(mul(
        {digits: cons(1, cons(2, cons(1, nil))), base: 3},
        {digits: cons(2, nil), base: 3}),
        {digits: cons(2, cons(1, cons(0, cons(1, nil)))), base: 3});

    assert.deepStrictEqual(mul(
        {digits: cons(1, cons(2, cons(3, nil))), base: 10},
        {digits: cons(3, cons(4, nil)), base: 10}),
        {digits: cons(3, cons(0, cons(8, cons(3, cons(1, nil))))), base: 10});
    assert.deepStrictEqual(mul(
        {digits: cons(1, cons(2, cons(1, nil))), base: 3},
        {digits: cons(2, cons(1, nil)), base: 3}),
        {digits: cons(2, cons(2, cons(2, cons(2, nil)))), base: 3});
  });

  it('changeBase', function() {
    assert.deepStrictEqual(changeBase({digits: nil, base: 3}, 10),
        {digits: nil, base: 10});
    assert.deepStrictEqual(changeBase({digits: nil, base: 10}, 3),
        {digits: nil, base: 3});

    assert.deepStrictEqual(changeBase({digits: cons(2, nil), base: 3}, 10),
        {digits: cons(2, nil), base: 10});
    assert.deepStrictEqual(changeBase({digits: cons(8, nil), base: 10}, 3),
        {digits: cons(2, cons(2, nil)), base: 3});

    assert.deepStrictEqual(changeBase({digits: cons(2, cons(2, nil)), base: 3}, 10),
        {digits: cons(8, nil), base: 10});
    assert.deepStrictEqual(changeBase({digits: cons(8, cons(5, cons(1, nil))), base: 10}, 3),
        {digits: cons(2, cons(1, cons(2, cons(2, cons(1, nil))))), base: 3});
  });

});
