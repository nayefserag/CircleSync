"use strict";
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAnalyticsEnabled = exports.logError = exports.downloadExecutable = exports.formatErrorMessage = exports.getWarningMessage = exports.runWrapper = exports.debugEnabled = exports.getCliArguments = exports.getCurrentConfiguration = exports.getCurrentSha256sum = exports.getCurrentVersion = exports.determineBinaryName = exports.WrapperConfiguration = exports.shasumFile = exports.versionFile = void 0;
// must be set before we import 'global-agent/bootstrap'
process.env.GLOBAL_AGENT_ENVIRONMENT_VARIABLE_NAMESPACE = '';
process.env.HTTPS_PROXY = (_b = (_a = process.env.HTTPS_PROXY) !== null && _a !== void 0 ? _a : process.env.https_proxy) !== null && _b !== void 0 ? _b : '';
process.env.HTTP_PROXY = (_d = (_c = process.env.HTTP_PROXY) !== null && _c !== void 0 ? _c : process.env.http_proxy) !== null && _d !== void 0 ? _d : '';
process.env.NO_PROXY = (_f = (_e = process.env.NO_PROXY) !== null && _e !== void 0 ? _e : process.env.no_proxy) !== null && _f !== void 0 ? _f : '';
require("global-agent/bootstrap");
const path = require("path");
const os = require("os");
const fs = require("fs");
const child_process_1 = require("child_process");
const https = require("https");
const crypto_1 = require("crypto");
const Sentry = require("@sentry/node");
exports.versionFile = path.join(__dirname, 'generated', 'version');
exports.shasumFile = path.join(__dirname, 'generated', 'sha256sums.txt');
const binaryDeploymentsFilePath = path.join(__dirname, 'generated', 'binary-deployments.json');
class WrapperConfiguration {
    constructor(version, binaryName, expectedSha256sum) {
        this.version = version;
        this.binaryName = binaryName;
        this.expectedSha256sum = expectedSha256sum;
    }
    getVersion() {
        return this.version;
    }
    getBinaryName() {
        return this.binaryName;
    }
    getDownloadLocation() {
        const baseUrl = 'https://static.snyk.io/cli/v';
        return baseUrl + this.version + '/' + this.binaryName;
    }
    getLocalLocation() {
        const currentFolder = __dirname;
        return path.join(currentFolder, this.binaryName);
    }
    getShasumFile() {
        return this.expectedSha256sum;
    }
}
exports.WrapperConfiguration = WrapperConfiguration;
function determineBinaryName(platform, arch) {
    let osname = platform;
    let archname = arch;
    switch (osname) {
        case 'win32':
            osname = 'windows';
            break;
        case 'linux': {
            let isAlpine = false;
            try {
                const result = child_process_1.spawnSync('cat /etc/os-release', { shell: true });
                isAlpine = result.stdout
                    .toString()
                    .toLowerCase()
                    .includes('id=alpine');
            }
            catch {
                isAlpine = false;
            }
            if (isAlpine) {
                osname = 'alpine';
            }
            break;
        }
    }
    switch (arch) {
        case 'x64':
        case 'amd64':
            archname = 'amd64';
            break;
    }
    const supportedPlatforms = require(binaryDeploymentsFilePath);
    const binaryName = supportedPlatforms[osname][archname];
    if (binaryName === undefined) {
        const defaultErrorMsg = ' The current platform (' +
            osname +
            ' ' +
            archname +
            ') is not supported by Snyk.\n' +
            ' You may want to consider using Docker to run Snyk, for details see: https://docs.snyk.io/snyk-cli/install-the-snyk-cli#snyk-cli-in-a-docker-image\n' +
            ' If you experience errors please check http://support.snyk.io/.';
        throw Error(getWarningMessage(defaultErrorMsg));
    }
    return binaryName;
}
exports.determineBinaryName = determineBinaryName;
function getCurrentVersion(filename) {
    try {
        const version = fs.readFileSync(filename);
        return version.toString().trim();
    }
    catch {
        return '';
    }
}
exports.getCurrentVersion = getCurrentVersion;
function getCurrentSha256sum(binaryName, filename) {
    try {
        const allsums = fs.readFileSync(filename).toString();
        const re = new RegExp('^([a-zA-Z0-9]+)[\\s\\*]+' + binaryName + '$', 'mig');
        const result = re.exec(allsums);
        if (result) {
            return result[1];
        }
    }
    catch {
        //
    }
    return 'unknown-shasum-' + binaryName;
}
exports.getCurrentSha256sum = getCurrentSha256sum;
function getCurrentConfiguration() {
    const binaryName = determineBinaryName(os.platform(), os.arch());
    const version = getCurrentVersion(exports.versionFile);
    const expectedSha256sum = getCurrentSha256sum(binaryName, exports.shasumFile);
    return new WrapperConfiguration(version, binaryName, expectedSha256sum);
}
exports.getCurrentConfiguration = getCurrentConfiguration;
function getCliArguments(inputArgv) {
    const cliArguments = inputArgv.slice(2);
    return cliArguments;
}
exports.getCliArguments = getCliArguments;
function debugEnabled(cliArguments) {
    let debugIndex = cliArguments.indexOf('--debug');
    if (debugIndex < 0) {
        debugIndex = cliArguments.indexOf('-d');
    }
    return debugIndex >= 0;
}
exports.debugEnabled = debugEnabled;
function runWrapper(executable, cliArguments) {
    const debug = debugEnabled(cliArguments);
    if (debug) {
        console.error('Executing: ' + executable + ' ' + cliArguments.join(' '));
    }
    const res = child_process_1.spawnSync(executable, cliArguments, {
        shell: false,
        stdio: 'inherit',
    });
    if (res.status !== null) {
        if (debug) {
            console.error(res);
        }
        return res.status;
    }
    else {
        console.error(res);
        if (!formatErrorMessage(res.error.code)) {
            console.error('Failed to spawn child process. (' + executable + ')');
        }
        return 2;
    }
}
exports.runWrapper = runWrapper;
function getWarningMessage(message) {
    return `\n------------------------------- Warning -------------------------------\n${message}\n------------------------------- Warning -------------------------------\n`;
}
exports.getWarningMessage = getWarningMessage;
function formatErrorMessage(message) {
    const eaccesWarning = "You don't have the permissions to install Snyk. Please try the following options:\n" +
        '* If you are installing with increased privileges (for example sudo), try adding --unsafe-perm as a parameter to npm install\n' +
        '* If you run NPM <= 6, please upgrade to a later version.\n' +
        'If the problems persist please check http://support.snyk.io/.';
    const certificateError = 'If you are running Snyk in an environment that intercepts SSL traffic, please specify\n' +
        'your custom CA certificates via the NODE_EXTRA_CA_CERTS environment variable.\n' +
        'See https://nodejs.org/api/cli.html#node_extra_ca_certsfile for additional information.';
    const degradedCLIWarning = 'You are currently running a degraded version of the Snyk CLI.\n' +
        'As a result, some features of the CLI will be unavailable.\n' +
        'For information on how to resolve this, please see this article: https://docs.snyk.io/snyk-cli/installing-snyk-cli-as-a-binary-via-npm\n' +
        'For any assistance, please check http://support.snyk.io/.';
    let warning = '';
    if (message.includes('EACCES')) {
        warning = eaccesWarning;
    }
    else if (message.includes('certificate')) {
        warning = certificateError;
    }
    else if (message.includes('legacy-cli')) {
        warning = degradedCLIWarning;
    }
    else {
        return false;
    }
    console.error(getWarningMessage(warning));
    return true;
}
exports.formatErrorMessage = formatErrorMessage;
function downloadExecutable(downloadUrl, filename, filenameShasum) {
    return new Promise(function (resolve) {
        const options = new URL(downloadUrl);
        const temp = path.join(__dirname, Date.now().toString());
        const fileStream = fs.createWriteStream(temp);
        const shasum = crypto_1.createHash('sha256').setEncoding('hex');
        const cleanupAfterError = (error) => {
            try {
                fs.unlinkSync(temp);
            }
            catch (e) {
                // ignoring any error during cleaning up after an error
            }
            resolve(error);
        };
        // shasum events
        shasum.on('error', cleanupAfterError);
        // filestream events
        fileStream.on('error', cleanupAfterError).on('close', () => {
            const actualShasum = shasum.read();
            const debugMessage = 'Shasums:\n- actual:   ' +
                actualShasum +
                '\n- expected: ' +
                filenameShasum;
            if (filenameShasum && actualShasum != filenameShasum) {
                cleanupAfterError(Error('Shasum comparison failed!\n' + debugMessage));
            }
            else {
                console.error(debugMessage);
                // finally rename the file and change permissions
                fs.renameSync(temp, filename);
                fs.chmodSync(filename, 0o755);
                console.error('Downloaded successfull! ');
            }
            resolve(undefined);
        });
        console.error("Downloading from '" + downloadUrl + "' to '" + filename + "'");
        const req = https.get(options, (res) => {
            // response events
            res.on('error', cleanupAfterError).on('end', () => {
                shasum.end();
                fileStream.end();
            });
            // pipe data
            res.pipe(fileStream);
            res.pipe(shasum);
        });
        req.on('error', cleanupAfterError).on('response', (incoming) => {
            if (incoming.statusCode &&
                !(200 <= incoming.statusCode && incoming.statusCode < 300)) {
                req.destroy();
                cleanupAfterError(Error('Download failed! Server Response: ' +
                    incoming.statusCode +
                    ' ' +
                    incoming.statusMessage +
                    ' (' +
                    downloadUrl +
                    ')'));
            }
        });
        req.end();
    });
}
exports.downloadExecutable = downloadExecutable;
async function logError(context, err, printToConsole = true) {
    if (isAnalyticsEnabled()) {
        // init error reporting
        const version = getCurrentVersion(exports.versionFile);
        Sentry.init({
            dsn: 'https://3e845233db8c4f43b4c4b9245f1d7bd6@o30291.ingest.sentry.io/4504599528079360',
            release: version,
        });
        // report error
        const sentryError = new Error('[' + context + '] ' + err.message);
        sentryError.stack = err.stack;
        Sentry.captureException(sentryError);
        await Sentry.close();
    }
    // finally log the error to the console as well
    if (printToConsole) {
        console.error('\n' + err);
        formatErrorMessage(err.message);
    }
}
exports.logError = logError;
function isAnalyticsEnabled() {
    if (process.env.snyk_disable_analytics == '1' ||
        process.env.SNYK_DISABLE_ANALYTICS == '1') {
        return false;
    }
    return true;
}
exports.isAnalyticsEnabled = isAnalyticsEnabled;
//# sourceMappingURL=common.js.map