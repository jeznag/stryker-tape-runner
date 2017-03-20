var test = require('tape-catch');
var MyMath = require('../src/MyMath');

var myMath;

function beforeEach() {
  try {
    myMath = new MyMath();
  } catch (err) {
    console.log(err);
  }
}

test('should be able to add two numbers', function (t) {
  beforeEach();
  var num1 = 2;
  var num2 = 5;
  var expected = num1 + num2;

  var actual = myMath.add(num1, num2);

  t.equal(actual, expected);
  t.end();
});

test('should be able 1 to a number', function (t) {
  beforeEach();
  var number = 2;
  var expected = 3;

  var actual = myMath.addOne(number);

  t.equal(actual, expected);
  t.end();
});

test('should be able negate a number', function (t) {
  beforeEach();
  var number = 2;
  var expected = -2;

  var actual = myMath.negate(number);

  t.equal(actual, expected);
  t.end();
});

test('should be able to recognize a negative number', function (t) {
  beforeEach();
  var number = -2;

  var isNegative = myMath.isNegativeNumber(number);

  t.equal(isNegative, true);
  t.end();
});

test('should be able to recognize that 0 is not a negative number', function (t) {
  beforeEach();
  var number = 0;

  var isNegative = myMath.isNegativeNumber(number);

  t.equal(isNegative, false);
  t.end();
});
