import { Options, PolicyOptions } from '../types';
import { Ecosystem, ScanResult, TestResult } from './types';
import { FileHashes, Attributes } from './unmanaged/types';
export declare function resolveAndTestFacts(ecosystem: Ecosystem, scans: {
    [dir: string]: ScanResult[];
}, options: Options & PolicyOptions): Promise<[TestResult[], string[]]>;
export declare function submitHashes(hashes: FileHashes, orgId: string): Promise<string>;
export declare function pollDepGraphAttributes(id: string, orgId: string): Promise<Attributes>;
export declare function resolveAndTestFactsUnmanagedDeps(scans: {
    [dir: string]: ScanResult[];
}, options: Options & PolicyOptions): Promise<[TestResult[], string[]]>;
export declare function resolveAndTestFactsRegistry(ecosystem: Ecosystem, scans: {
    [dir: string]: ScanResult[];
}, options: Options & PolicyOptions): Promise<[TestResult[], string[]]>;
