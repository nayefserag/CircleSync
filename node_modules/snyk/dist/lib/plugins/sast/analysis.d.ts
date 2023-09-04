import { Options } from '../../types';
import { SastSettings, CodeTestResults } from './types';
/**
 * Bootstrap and trigger a Code test, then return the results.
 */
export declare function getCodeTestResults(root: string, options: Options, sastSettings: SastSettings, requestId: string): Promise<CodeTestResults | null>;
