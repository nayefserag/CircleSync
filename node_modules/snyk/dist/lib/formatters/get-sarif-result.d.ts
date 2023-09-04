import * as sarif from 'sarif';
import { AnnotatedIssue } from '../snyk-test/legacy';
export declare function getResults(testResult: any): sarif.Result[];
export declare function getLevel(vuln: AnnotatedIssue): "error" | "warning" | "note";
