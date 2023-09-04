import { CustomError } from '../../../errors/custom-error';
export declare class CodeClientError extends CustomError {
    constructor(statusCode: number, statusText: string, additionalUserHelp?: string);
}
