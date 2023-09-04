import 'global-agent/bootstrap';
export declare const versionFile: string;
export declare const shasumFile: string;
export declare class WrapperConfiguration {
    private version;
    private binaryName;
    private expectedSha256sum;
    constructor(version: string, binaryName: string, expectedSha256sum: string);
    getVersion(): string;
    getBinaryName(): string;
    getDownloadLocation(): string;
    getLocalLocation(): string;
    getShasumFile(): string;
}
export declare function determineBinaryName(platform: string, arch: string): string;
export declare function getCurrentVersion(filename: string): string;
export declare function getCurrentSha256sum(binaryName: string, filename: string): string;
export declare function getCurrentConfiguration(): WrapperConfiguration;
export declare function getCliArguments(inputArgv: string[]): string[];
export declare function debugEnabled(cliArguments: string[]): boolean;
export declare function runWrapper(executable: string, cliArguments: string[]): number;
export declare function getWarningMessage(message: string): string;
export declare function formatErrorMessage(message: string): boolean;
export declare function downloadExecutable(downloadUrl: string, filename: string, filenameShasum: string): Promise<Error | undefined>;
export declare function logError(context: string, err: any, printToConsole?: boolean): Promise<void>;
export declare function isAnalyticsEnabled(): boolean;
