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
const octonode_1 = __importDefault(require("octonode"));
class OctoGh {
    constructor(ghToken) {
        this.client = octonode_1.default.client(ghToken);
    }
    /**
     * Returns an array of organisations from Github. The API errors are forwaded
     * if occurred.
     */
    getOrgs() {
        return __awaiter(this, void 0, void 0, function* () {
            const user = this.client.me();
            const [orgs] = yield user.orgsAsync();
            return orgs;
        });
    }
    /**
     * Returns an array of repos for a given org. The API errors are forwaded
     * if occurred.
     */
    getRepos(orgName) {
        return __awaiter(this, void 0, void 0, function* () {
            const org = this.client.org(orgName);
            return this._paginate(1, org.reposAsync.bind(org));
        });
    }
    /**
     * Returns an array of labels for a given repo. The API errors are forwaded
     * if occurred.
     */
    getLabels(repoName) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = this.client.repo(repoName);
            const [labels] = yield repo.labelsAsync();
            return labels;
        });
    }
    /**
     * Create a new label inside a given repo. The API errors are forwaded
     * if occurred.
     */
    createLabel(repoName, label) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = this.client.repo(repoName);
            yield repo.labelAsync(label);
        });
    }
    /**
     * Paginates over the github api results, until we are on the last page.
     * The API errors are forwaded if occurred.
     */
    _paginate(page, fn, oldResults = []) {
        return __awaiter(this, void 0, void 0, function* () {
            const [result, headers] = yield fn({ page, per_page: 100 });
            oldResults = oldResults.concat(result);
            /**
             * Find if we have more results to query. The headers from the
             * Gh API will not have `last` string when we are on last
             * page.
             */
            const isOver = headers.link ? !headers.link.includes('rel="last"') : true;
            if (isOver) {
                return oldResults;
            }
            return this._paginate(page + 1, fn, oldResults);
        });
    }
}
exports.default = OctoGh;
