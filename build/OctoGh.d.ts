import { Repo, Org, Label } from './Contracts';
declare class OctoGh {
    private client;
    constructor(ghToken: string);
    /**
     * Returns an array of organisations from Github. The API errors are forwaded
     * if occurred.
     */
    getOrgs(): Promise<Org[]>;
    /**
     * Returns an array of repos for a given org. The API errors are forwaded
     * if occurred.
     */
    getRepos(orgName: string): Promise<Repo[]>;
    /**
     * Returns an array of labels for a given repo. The API errors are forwaded
     * if occurred.
     */
    getLabels(repoName: string): Promise<Label[]>;
    /**
     * Create a new label inside a given repo. The API errors are forwaded
     * if occurred.
     */
    createLabel(repoName: string, label: Label): Promise<void>;
    /**
     * Paginates over the github api results, until we are on the last page.
     * The API errors are forwaded if occurred.
     */
    private _paginate;
}
export default OctoGh;
