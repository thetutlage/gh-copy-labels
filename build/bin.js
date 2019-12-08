#!/usr/bin/env node
"use strict";
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
async function setup(token, reAuth) {
    if (token && !reAuth) {
        return token;
    }
    const { ghToken } = await inquirer_1.default.prompt([
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
}
async function handle(octo, force) {
    const orgs = await octo.listOrgs(force);
    const { baseRepo, destRepos } = await inquirer_1.default.prompt([
        {
            name: 'baseOrg',
            message: 'Select base github organisation',
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
            async choices(answers) {
                const repos = await octo.listRepos(answers.baseOrg, force);
                return repos.map((repo) => {
                    return { name: repo.name, value: repo.full_name };
                });
            },
        },
        {
            name: 'destOrg',
            message: 'Select organisation in which to copy labels',
            validate(input) {
                return !!input;
            },
            type: 'list',
            choices: orgs.map((org) => org.login),
        },
        {
            name: 'destRepos',
            message: 'Select repos in which to copy labels',
            type: 'checkbox',
            async choices(answers) {
                const repos = await octo.listRepos(answers.destOrg, force);
                return repos.map((repo) => {
                    return { name: repo.name, value: repo.full_name };
                });
            },
        },
    ]);
    const labels = await octo.listLabels(baseRepo, force);
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
    await octo.copyLabels(labels, destRepos);
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
