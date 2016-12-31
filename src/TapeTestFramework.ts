import { TestFramework, TestFrameworkSettings } from 'stryker-api/test_framework';

export default class TapeTestFramework implements TestFramework {
  constructor(private settings: TestFrameworkSettings) { }

  beforeEach(codeFragment: string): string {
    throw new Error('beforeEach is not really supported in tape. Please use redtape if you want this feature.');
  }

  afterEach(codeFragment: string): string {
    throw new Error('afterEach is not really supported in tape. Please use redtape if you want this feature.');
  }

  filter(testIds: number[]): string {
    throw new Error('Filtering tests not supported yet. Please log an issue if you want this feature');
  }
}
