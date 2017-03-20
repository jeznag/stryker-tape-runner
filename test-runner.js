const exec = require('child_process').exec;
exec('mocha \"test/**/*.js\"', (error, stdout, stderr) => {
  if (stdout.match(/AssertionError|failing/)) {
    console.log(stdout);
    throw new Error('Tests failed');
  }
});
