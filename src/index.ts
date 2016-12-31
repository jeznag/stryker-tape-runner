import { TestRunnerFactory } from 'stryker-api/test_runner';
import { TestFrameworkFactory } from 'stryker-api/test_framework';

import TapeTestRunner from './TapeTestRunner';
import TapeTestFramework from './TapeTestFramework';

TestRunnerFactory.instance().register('tape', TapeTestRunner);
TestFrameworkFactory.instance().register('tape', TapeTestFramework);
