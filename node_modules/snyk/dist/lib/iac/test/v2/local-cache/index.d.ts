import { TestConfig } from '../types';
interface LocalCache {
    policyEnginePath: string;
    rulesBundlePath: string;
    rulesClientURL: string;
}
export declare function initLocalCache(testConfig: TestConfig): Promise<LocalCache>;
export {};
