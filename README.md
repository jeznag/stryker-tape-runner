[![Build Status](https://travis-ci.org/stryker-mutator/stryker-tape-runner.svg?branch=master)](https://travis-ci.org/stryker-mutator/stryker-tape-runner)
[![NPM](https://img.shields.io/npm/dm/stryker-tape-runner.svg)](https://www.npmjs.com/package/stryker-tape-runner)
[![Node version](https://img.shields.io/node/v/stryker-tape-runner.svg)](https://img.shields.io/node/v/stryker-tape-runner.svg)
[![Gitter](https://badges.gitter.im/stryker-mutator/stryker.svg)](https://gitter.im/stryker-mutator/stryker?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)
# stryker-tape-runner
The Stryker TestRunner for Tape

## Known issues:
1. You must use tape-catch otherwise uncaught exceptions will blow up the test runner
2. If you choose a lot of files to mutate, chances are you'll eventually hit a V8 out of memory error

## Instructions:
Add stryker-tape-runner as a plugin and set tape as the test runner + reporter.

## Sample config:

```
module.exports = function (config) {
  config.set({
    files: [
      'test/tape/**/*.js',
      { pattern: 'src/**/*.js!analyseSentiment.js', included: false, mutated: false },
      { pattern: 'src/analyseSentiment.js', included: false, mutated: true },
    ],
    testFramework: 'tape',
    maxConcurrentTestRunners: 3,
    testRunner: 'tape',
    coverageAnalysis: 'off',
    reporter: ['progress', 'clear-text'],
    logLevel: 'info',
    plugins: ['stryker-tape-runner']
  });
};
```
