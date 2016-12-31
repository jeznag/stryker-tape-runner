import { TestFramework, TestFrameworkSettings } from 'stryker-api/test_framework';

export default class TapeTestFramework implements TestFramework {
  constructor(private settings: TestFrameworkSettings) { }

  beforeEach(codeFragment: string): string {
    // beforeEach not really supported in tape. Need to use redtape for this feature
    return `${codeFragment}`;
  }

  afterEach(codeFragment: string): string {
    // afterEach not really supported in tape. Need to use redtape for this feature
    return `${codeFragment}`;
  }

  filter(testIds: number[]): string {
    throw new Error('Filtering tests not supported yet. Please log an issue if you want this feature');
  }
}
