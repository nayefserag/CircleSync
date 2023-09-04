import { MultiProjectResultCustom } from '../get-multi-plugin-result';
export declare function processNpmWorkspaces(root: string, settings: {
    strictOutOfSync?: boolean;
    dev?: boolean;
    yarnWorkspaces?: boolean;
}, targetFiles: string[]): Promise<MultiProjectResultCustom>;
interface NpmWorkspacesMap {
    [packageJsonName: string]: {
        workspaces: string[];
    };
}
export declare function getWorkspacesMap(file: {
    content: string;
    fileName: string;
}): NpmWorkspacesMap;
export declare function packageJsonBelongsToWorkspace(packageJsonFileName: string, workspacesMap: NpmWorkspacesMap, workspaceRoot: string): boolean;
export {};
