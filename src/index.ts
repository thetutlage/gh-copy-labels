'use strict'

/*
* gh-copy-labels
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

import OctoLocal from './OctoLocal'
import OctoGh from './OctoGh'
import pLimit from 'p-limit'
import Emitter from 'events'
import { join } from 'path'
import { Repo, Org, Label } from './Contracts'

class Octo extends Emitter {
  private local: OctoLocal
  private gh: OctoGh

  constructor (ghToken) {
    super()

    this.local = new OctoLocal(join(__dirname, '..', 'cache', `${ghToken}.json`))
    this.gh = new OctoGh(ghToken)
  }

  /**
   * Returns a list of orgs from the cache (if exists) or fetches
   * from Github. Cache will be skipped, when `force=true`.
   */
  public async listOrgs (force: boolean = false): Promise<Org[]> {
    let localOrgs: Org[] | null = null

    if (!force) {
      localOrgs = await this.local.getOrgs()
    }

    if (localOrgs) {
      return localOrgs
    }

    const orgs: Org[] = await this.gh.getOrgs()
    return this.local.saveOrgs(orgs)
  }

  /**
   * Returns a list of repos from the cache (if exists) or fetches
   * from Github. Cache will be skipped, when `force=true`.
   */
  public async listRepos (orgName: string, force: boolean = false): Promise<Repo[]> {
    let localRepos: Repo[] | null = null

    if (!force) {
      localRepos = await this.local.getRepos(orgName)
    }

    if (localRepos) {
      return localRepos
    }

    const repos: Repo[] = await this.gh.getRepos(orgName)
    return this.local.saveRepos(orgName, repos)
  }

  /**
   * Returns a list of labels from the cache (if exists) or fetches
   * from Github. Cache will be skipped, when `force=true`.
   */
  public async listLabels (repoName: string, force: boolean = false): Promise<Label[]> {
    let localLabels: Label[] | null = null

    if (!force) {
      localLabels = await this.local.getLabels(repoName)
    }

    if (localLabels) {
      return localLabels
    }

    const labels: Label[] = await this.gh.getLabels(repoName)
    return this.local.saveLabels(repoName, labels)
  }

  /**
   * Creates a new label inside a given repo.
   */
  public async createLabel (repoName: string, label: Label): Promise<void> {
    try {
      await this.gh.createLabel(repoName, label)
      this.emit('label:copied', label)
    } catch (error) {
      const message = error.message === 'Validation Failed' ? 'Already exists' : error.message
      this.emit('label:error', label, message)
    }
  }

  /**
   * Copies an array of labels to an array of repos. Processes for one
   * repo at a time with concurrency of 6 labels at a time.
   */
  public async copyLabels (labels: Label[], destRepos: string[]): Promise<void> {
    for (let repo of destRepos) {
      this.emit('repo:start', repo)

      const limit = pLimit(6)
      await Promise.all(labels.map((label) => {
        return limit(() => this.createLabel(repo, label))
      }))

      this.emit('repo:end', repo)
    }
  }
}

export default Octo
