import { Repo, Org, Label } from './Contracts';
declare class OctoLocal {
    private fileName;
    constructor(fileName: string);
    /**
     * Returns an array of orgs or null
     */
    getOrgs(): Promise<Org[] | null>;
    /**
     * Save orgs to the cache
     */
    saveOrgs(orgs: Org[]): Promise<Org[]>;
    /**
     * Returns an array of repos for a given org or returns
     * null.
     */
    getRepos(orgName: string): Promise<Repo[] | null>;
    /**
     * Saves repos to the file cache and returns a reduced version
     * of objects back.
     */
    saveRepos(orgName: string, repos: Repo[]): Promise<Repo[]>;
    /**
     * Returns labels from the cache or null if nothing exists
     */
    getLabels(repoName: string): Promise<Label[] | null>;
    /**
     * Saves labels for a given repo to the file cache and
     * returns a reduced version of labels back.
     */
    saveLabels(repoName: string, labels: Label[]): Promise<Label[]>;
    /**
     * Returns the contents for the cache file for a given
     * user.
     */
    private _getFileContents;
    /**
     * Pick value for given keys from the source object.
     */
    private _pickValues;
}
export default OctoLocal;
