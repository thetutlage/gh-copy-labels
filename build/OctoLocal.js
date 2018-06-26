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
const fs_extra_1 = __importDefault(require("fs-extra"));
class OctoLocal {
    constructor(fileName) {
        this.fileName = fileName;
    }
    /**
     * Returns an array of orgs or null
     */
    getOrgs() {
        return __awaiter(this, void 0, void 0, function* () {
            const fileContents = yield this._getFileContents();
            return fileContents.orgs || null;
        });
    }
    /**
     * Save orgs to the cache
     */
    saveOrgs(orgs) {
        return __awaiter(this, void 0, void 0, function* () {
            const fileContents = yield this._getFileContents();
            fileContents.orgs = orgs.map((org) => this._pickValues(org, ['id', 'login', 'avatar_url']));
            yield fs_extra_1.default.outputJSON(this.fileName, fileContents);
            return fileContents.orgs;
        });
    }
    /**
     * Returns an array of repos for a given org or returns
     * null.
     */
    getRepos(orgName) {
        return __awaiter(this, void 0, void 0, function* () {
            const fileContents = yield this._getFileContents();
            if (!fileContents.repos) {
                return null;
            }
            return fileContents.repos[orgName] || null;
        });
    }
    /**
     * Saves repos to the file cache and returns a reduced version
     * of objects back.
     */
    saveRepos(orgName, repos) {
        return __awaiter(this, void 0, void 0, function* () {
            const fileContents = yield this._getFileContents();
            fileContents.repos = fileContents.repos || {};
            fileContents.repos[orgName] = repos.map((repo) => {
                return this._pickValues(repo, ['name', 'full_name', 'private', 'fork', 'archived', 'id']);
            });
            yield fs_extra_1.default.outputJSON(this.fileName, fileContents);
            return fileContents.repos[orgName];
        });
    }
    /**
     * Returns labels from the cache or null if nothing exists
     */
    getLabels(repoName) {
        return __awaiter(this, void 0, void 0, function* () {
            const fileContents = yield this._getFileContents();
            if (!fileContents.labels) {
                return null;
            }
            return fileContents.labels[repoName] || null;
        });
    }
    /**
     * Saves labels for a given repo to the file cache and
     * returns a reduced version of labels back.
     */
    saveLabels(repoName, labels) {
        return __awaiter(this, void 0, void 0, function* () {
            const fileContents = yield this._getFileContents();
            fileContents.labels = fileContents.labels || {};
            fileContents.labels[repoName] = labels.map((repo) => {
                return this._pickValues(repo, ['name', 'color', 'id']);
            });
            yield fs_extra_1.default.outputJSON(this.fileName, fileContents);
            return fileContents.labels[repoName];
        });
    }
    /**
     * Returns the contents for the cache file for a given
     * user.
     */
    _getFileContents() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const contents = yield fs_extra_1.default.readJSON(this.fileName);
                return contents;
            }
            catch (error) {
                return {};
            }
        });
    }
    /**
     * Pick value for given keys from the source object.
     */
    _pickValues(source, keys) {
        return keys.reduce((r, k) => {
            r[k] = source[k];
            return r;
        }, {});
    }
}
exports.default = OctoLocal;
