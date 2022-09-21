"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinuxInstaller = void 0;
const os = require("os");
const path = require("path");
const child_process = require("child_process");
const fs = require("fs-extra");
const base_platform_1 = require("../base-platform");
class LinuxInstaller extends base_platform_1.BasePlatform {
    constructor(hbService) {
        super(hbService);
    }
    get rcServiceName() {
        return this.hbService.serviceName.toLowerCase();
    }
    get rcServicePath() {
        return path.resolve('/opt/etc/init.d', 'S98' + this.rcServiceName);
    }
    get runPartsPath() {
        return path.resolve('/opt/etc/hb-service', this.hbService.serviceName.toLowerCase(), 'prestart.d');
    }
    async install() {
        this.checkForRoot();
        await this.checkUser();
        await this.hbService.portCheck();
        await this.hbService.storagePathCheck();
        await this.hbService.configCheck();
        try {
            await this.createRunPartsPath();
            await this.hbService.printPostInstallInstructions();
        }
        catch (e) {
            console.error(e.toString());
            this.hbService.logger('ERROR: Failed Operation', 'fail');
        }
    }
    async uninstall() {
        this.checkForRoot();
        await this.stop();
    }
    async start() {
        this.checkForRoot();
        try {
            this.hbService.logger(`Starting ${this.rcServiceName} Service...`);
            child_process.execSync(`${this.rcServicePath} start`);
            this.hbService.logger(`${this.rcServiceName} Started`, 'succeed');
        }
        catch (e) {
            this.hbService.logger(`Failed to start ${this.rcServiceName}`, 'fail');
        }
    }
    async stop() {
        this.checkForRoot();
        try {
            this.hbService.logger(`Stopping ${this.rcServiceName} Service...`);
            child_process.execSync(`${this.rcServicePath} stop`);
            this.hbService.logger(`${this.rcServiceName} Stopped`, 'succeed');
        }
        catch (e) {
            this.hbService.logger(`Failed to stop ${this.rcServiceName}`, 'fail');
        }
    }
    async restart() {
        this.checkForRoot();
        try {
            this.hbService.logger(`Restarting ${this.rcServiceName} Service...`);
            child_process.execSync(`${this.rcServicePath} restart`);
            this.hbService.logger(`${this.rcServiceName} Restarted`, 'succeed');
        }
        catch (e) {
            this.hbService.logger(`Failed to restart ${this.rcServiceName}`, 'fail');
        }
    }
    async rebuild(all = false) {
        this.hbService.logger('INFO: You cannot rebuild in the Entware.', 'info');
    }
    async getId() {
        if (process.getuid() === 0 && this.hbService.asUser) {
            const uid = child_process.execSync(`id -u ${this.hbService.asUser}`).toString('utf8');
            const gid = child_process.execSync(`id -g ${this.hbService.asUser}`).toString('utf8');
            return {
                uid: parseInt(uid, 10),
                gid: parseInt(gid, 10),
            };
        }
        else {
            return {
                uid: os.userInfo().uid,
                gid: os.userInfo().gid,
            };
        }
    }
    getPidOfPort(port) {
        try {
            return child_process.execSync(`pidof ${this.rcServiceName}`).toString('utf8').trim();
        }
        catch (e) {
            return null;
        }
    }
    async updateNodejs(job) {
        this.hbService.logger('INFO: You cannot update Nodejs in the Entware.', 'info');
    }
    async updateNodeFromTarball(job, targetPath) {
        this.hbService.logger('INFO: You cannot update Nodejs in the Entware.', 'info');
    }
    async updateNodeFromNodesource(job) {
        this.hbService.logger('INFO: You cannot update Nodejs in the Entware.', 'info');
    }
    checkForRoot() {
        if (process.getuid() !== 0) {
            this.hbService.logger('ERROR: This command must be executed using sudo on Linux', 'fail');
            this.hbService.logger(`EXAMPLE: sudo hb-service ${this.hbService.action}`, 'fail');
            process.exit(1);
        }
        if (this.hbService.action === 'install' && !this.hbService.asUser) {
            this.hbService.logger('ERROR: User parameter missing. Pass in the user you want to run Homebridge as using the --user flag eg.', 'fail');
            this.hbService.logger(`EXAMPLE: sudo hb-service ${this.hbService.action} --user your-user`, 'fail');
            process.exit(1);
        }
    }
    async checkUser() {
        try {
            child_process.execSync(`id ${this.hbService.asUser} 2> /dev/null`);
        }
        catch (e) {
            this.hbService.logger(`WARNING: The ${this.hbService.asUser} user does not exist.`);
        }
    }
    async createRunPartsPath() {
        await fs.mkdirp(this.runPartsPath);
        const permissionScriptPath = path.resolve(this.runPartsPath, '10-fix-permissions');
        const permissionScript = [
            '#!/bin/sh',
            '',
            '# Ensure the storage path permissions are correct',
            'if [ -n "$UIX_STORAGE_PATH" ] && [ -n "$USER" ]; then',
            '  echo "Ensuring $UIX_STORAGE_PATH is owned by $USER"',
            '  [ -d $UIX_STORAGE_PATH ] || mkdir -p $UIX_STORAGE_PATH',
            '  chown -R $USER: $UIX_STORAGE_PATH',
            'fi',
            '',
        ].filter(x => x !== null).join('\n');
        await fs.writeFile(permissionScriptPath, permissionScript);
        await fs.chmod(permissionScriptPath, '755');
    }
}
exports.LinuxInstaller = LinuxInstaller;
//# sourceMappingURL=linux.js.map
