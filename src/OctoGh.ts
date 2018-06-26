'use strict'

/*
* gh-copy-labels
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

import github from 'octonode'
import { Repo, Org, Label } from './Contracts'

class OctoGh {
  private client: any

  constructor (ghToken: string) {
    this.client = github.client(ghToken)
  }

  /**
   * Returns an array of organisations from Github. The API errors are forwaded
   * if occurred.
   */
  public async getOrgs (): Promise<Org[]> {
    const user = this.client.me()
    const [ orgs ] = await user.orgsAsync()
    return orgs
  }

  /**
   * Returns an array of repos for a given org. The API errors are forwaded
   * if occurred.
   */
  public async getRepos (orgName: string): Promise<Repo[]> {
    const org = this.client.org(orgName)
    return this._paginate<Repo>(1, org.reposAsync.bind(org))
  }

  /**
   * Returns an array of labels for a given repo. The API errors are forwaded
   * if occurred.
   */
  public async getLabels (repoName: string): Promise<Label[]> {
    const repo = this.client.repo(repoName)
    const [ labels ] = await repo.labelsAsync()
    return labels
  }

  /**
   * Create a new label inside a given repo. The API errors are forwaded
   * if occurred.
   */
  public async createLabel (repoName: string, label: Label): Promise<void> {
    const repo = this.client.repo(repoName)
    await repo.labelAsync(label)
  }

  /**
   * Paginates over the github api results, until we are on the last page.
   * The API errors are forwaded if occurred.
   */
  private async _paginate <T> (page: number, fn: Function, oldResults: T[] = []): Promise<T[]> {
    const [ result, headers ] = await fn({ page, per_page: 100 })
    oldResults = oldResults.concat(result)

    /**
     * Find if we have more results to query. The headers from the
     * Gh API will not have `last` string when we are on last
     * page.
     */
    const isOver = headers.link ? !headers.link.includes('rel="last"') : true
    if (isOver) {
      return oldResults
    }

    return this._paginate(page + 1, fn, oldResults)
  }
}

export default OctoGh
