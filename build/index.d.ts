/// <reference types="node" />
import Emitter from 'events';
import { Repo, Org, Label } from './Contracts';
declare class Octo extends Emitter {
    private local;
    private gh;
    constructor(ghToken: any);
    /**
     * Returns a list of orgs from the cache (if exists) or fetches
     * from Github. Cache will be skipped, when `force=true`.
     */
    listOrgs(force?: boolean): Promise<Org[]>;
    /**
     * Returns a list of repos from the cache (if exists) or fetches
     * from Github. Cache will be skipped, when `force=true`.
     */
    listRepos(orgName: string, force?: boolean): Promise<Repo[]>;
    /**
     * Returns a list of labels from the cache (if exists) or fetches
     * from Github. Cache will be skipped, when `force=true`.
     */
    listLabels(repoName: string, force?: boolean): Promise<Label[]>;
    /**
     * Creates a new label inside a given repo.
     */
    createLabel(repoName: string, label: Label): Promise<void>;
    /**
     * Copies an array of labels to an array of repos. Processes for one
     * repo at a time with concurrency of 6 labels at a time.
     */
    copyLabels(labels: Label[], destRepos: string[]): Promise<void>;
}
export default Octo;
