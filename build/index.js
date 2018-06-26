'use strict';
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
/*
* gh-copy-labels
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
const OctoLocal_1 = __importDefault(require("./OctoLocal"));
const OctoGh_1 = __importDefault(require("./OctoGh"));
const p_limit_1 = __importDefault(require("p-limit"));
const events_1 = __importDefault(require("events"));
const path_1 = require("path");
class Octo extends events_1.default {
    constructor(ghToken) {
        super();
        this.local = new OctoLocal_1.default(path_1.join(__dirname, '..', 'cache', `${ghToken}.json`));
        this.gh = new OctoGh_1.default(ghToken);
    }
    /**
     * Returns a list of orgs from the cache (if exists) or fetches
     * from Github. Cache will be skipped, when `force=true`.
     */
    listOrgs(force = false) {
        return __awaiter(this, void 0, void 0, function* () {
            let localOrgs = null;
            if (!force) {
                localOrgs = yield this.local.getOrgs();
            }
            if (localOrgs) {
                return localOrgs;
            }
            const orgs = yield this.gh.getOrgs();
            return this.local.saveOrgs(orgs);
        });
    }
    /**
     * Returns a list of repos from the cache (if exists) or fetches
     * from Github. Cache will be skipped, when `force=true`.
     */
    listRepos(orgName, force = false) {
        return __awaiter(this, void 0, void 0, function* () {
            let localRepos = null;
            if (!force) {
                localRepos = yield this.local.getRepos(orgName);
            }
            if (localRepos) {
                return localRepos;
            }
            const repos = yield this.gh.getRepos(orgName);
            return this.local.saveRepos(orgName, repos);
        });
    }
    /**
     * Returns a list of labels from the cache (if exists) or fetches
     * from Github. Cache will be skipped, when `force=true`.
     */
    listLabels(repoName, force = false) {
        return __awaiter(this, void 0, void 0, function* () {
            let localLabels = null;
            if (!force) {
                localLabels = yield this.local.getLabels(repoName);
            }
            if (localLabels) {
                return localLabels;
            }
            const labels = yield this.gh.getLabels(repoName);
            return this.local.saveLabels(repoName, labels);
        });
    }
    /**
     * Creates a new label inside a given repo.
     */
    createLabel(repoName, label) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.gh.createLabel(repoName, label);
                this.emit('label:copied', label);
            }
            catch (error) {
                const message = error.message === 'Validation Failed' ? 'Already exists' : error.message;
                this.emit('label:error', label, message);
            }
        });
    }
    /**
     * Copies an array of labels to an array of repos. Processes for one
     * repo at a time with concurrency of 6 labels at a time.
     */
    copyLabels(labels, destRepos) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let repo of destRepos) {
                this.emit('repo:start', repo);
                const limit = p_limit_1.default(6);
                yield Promise.all(labels.map((label) => {
                    return limit(() => this.createLabel(repo, label));
                }));
                this.emit('repo:end', repo);
            }
        });
    }
}
exports.default = Octo;
