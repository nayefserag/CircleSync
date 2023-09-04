import * as sarif from 'sarif';
import { TestResult } from '../snyk-test/legacy';
export declare function createSarifOutputForOpenSource(testResults: TestResult[]): sarif.Log;
export declare function getRules(testResult: TestResult): sarif.ReportingDescriptor[];
