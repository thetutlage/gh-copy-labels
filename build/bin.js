#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = __importDefault(require("."));
const conf_1 = __importDefault(require("conf"));
const inquirer_1 = __importDefault(require("inquirer"));
const chalk_1 = __importDefault(require("chalk"));
const mri_1 = __importDefault(require("mri"));
const config = new conf_1.default();
function largestLabelName(labels) {
    return Math.max(...labels.map(({ name }) => name.length));
}
function getSpaces(labelName, minMidth) {
    const diff = minMidth - labelName.length;
    return (diff === 0 ? new Array(4) : new Array(diff + 4)).join(' ');
}
function setup(token, reAuth) {
    return __awaiter(this, void 0, void 0, function* () {
        if (token && !reAuth) {
            return token;
        }
        const { ghToken } = yield inquirer_1.default.prompt([
            {
                name: 'ghToken',
                type: 'password',
                message: 'Enter Github token',
                suffix: chalk_1.default.dim(' Required to fetch your repos'),
                validate(input) {
                    return !!input;
                },
            },
        ]);
        return ghToken;
    });
}
function handle(octo, force) {
    return __awaiter(this, void 0, void 0, function* () {
        const orgs = yield octo.listOrgs(force);
        const { baseRepo, destRepos } = yield inquirer_1.default.prompt([
            {
                name: 'org',
                message: 'Select github organisation',
                validate(input) {
                    return !!input;
                },
                type: 'list',
                choices: orgs.map((org) => org.login),
            },
            {
                name: 'baseRepo',
                message: 'Select base repo',
                suffix: chalk_1.default.dim(' Used for copying labels'),
                type: 'list',
                choices(answers) {
                    return __awaiter(this, void 0, void 0, function* () {
                        const repos = yield octo.listRepos(answers.org, force);
                        return repos.map((repo) => {
                            return { name: repo.name, value: repo.full_name };
                        });
                    });
                },
            },
            {
                name: 'destRepos',
                message: 'Select repos in which to copy labels',
                type: 'checkbox',
                choices(answers) {
                    return __awaiter(this, void 0, void 0, function* () {
                        const repos = yield octo.listRepos(answers.org);
                        return repos.map((repo) => {
                            return { name: repo.name, value: repo.full_name };
                        });
                    });
                },
            },
        ]);
        const labels = yield octo.listLabels(baseRepo, force);
        const minWidth = largestLabelName(labels);
        octo.on('repo:start', (repoName) => {
            console.log('');
            console.log(chalk_1.default.dim(`Copying to ${repoName} repo`));
            console.log('=============================================');
        });
        octo.on('label:copied', ({ name }) => {
            console.log('✅', chalk_1.default.dim(name), getSpaces(name, minWidth), chalk_1.default.green('Copied'));
        });
        octo.on('label:error', ({ name }, error) => {
            console.log('❌', chalk_1.default.dim(name), getSpaces(name, minWidth), chalk_1.default.red(error));
        });
        yield octo.copyLabels(labels, destRepos);
    });
}
const args = mri_1.default(process.argv.slice(2));
setup(config.get('token'), args.reAuth)
    .then((ghToken) => {
    config.set('token', ghToken);
    const octo = new _1.default(ghToken);
    return handle(octo, args.force);
})
    .catch((error) => {
    console.log(chalk_1.default.red('  Operation failed. Received following response from github'));
    console.log(chalk_1.default.red(`  ${error.message}`));
});
