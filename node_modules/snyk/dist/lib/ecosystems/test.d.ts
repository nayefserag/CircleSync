import { Options, PolicyOptions } from '../types';
import { TestCommandResult } from '../../cli/commands/types';
import { Ecosystem, ScanResult, TestResult } from './types';
declare type ScanResultsByPath = {
    [dir: string]: ScanResult[];
};
export declare function testEcosystem(ecosystem: Ecosystem, paths: string[], options: Options & PolicyOptions): Promise<TestCommandResult>;
export declare function selectAndExecuteTestStrategy(ecosystem: Ecosystem, scanResultsByPath: {
    [dir: string]: ScanResult[];
}, options: Options & PolicyOptions): Promise<[TestResult[], string[]]>;
export declare function formatUnmanagedResults(results: ScanResultsByPath, target: string): Promise<TestCommandResult>;
export {};
