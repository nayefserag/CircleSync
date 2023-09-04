import { Options } from '../../../types';
import { CodeTestResults } from '../types';
export declare function getCodeDisplayedOutput(args: {
    testResults: CodeTestResults;
    meta: string;
    prefix: string;
    shouldFilterIgnored: boolean;
}): string;
export declare function getMeta(options: Options, path: string): string;
export declare function getPrefix(path: string): string;
export declare function getCodeReportDisplayedOutput(reportUrl: string): string;
