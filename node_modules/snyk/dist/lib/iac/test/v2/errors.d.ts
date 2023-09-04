import { CustomError } from '../../../errors';
import { ScanError } from './scan/results';
export declare function getErrorUserMessage(code: number, error: string): string;
export declare class SnykIacTestError extends CustomError {
    fields: {
        path: string;
        [key: string]: any;
    };
    constructor(scanError: ScanError);
    get path(): string;
    set path(path1: string);
}
