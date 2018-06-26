'use strict'

/*
* gh-copy-labels
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

import fs from 'fs-extra'
import { Repo, Org, Label, UserFile } from './Contracts'

class OctoLocal {
  constructor (private fileName: string) {
  }

  /**
   * Returns an array of orgs or null
   */
  public async getOrgs (): Promise<Org[] | null> {
    const fileContents = await this._getFileContents()
    return fileContents.orgs || null
  }

  /**
   * Save orgs to the cache
   */
  public async saveOrgs (orgs: Org[]): Promise<Org[]> {
    const fileContents = await this._getFileContents()

    fileContents.orgs = orgs.map((org) => this._pickValues(org, ['id', 'login', 'avatar_url']))
    await fs.outputJSON(this.fileName, fileContents)

    return fileContents.orgs
  }

  /**
   * Returns an array of repos for a given org or returns
   * null.
   */
  public async getRepos (orgName: string): Promise<Repo[] | null> {
    const fileContents = await this._getFileContents()

    if (!fileContents.repos) {
      return null
    }

    return fileContents.repos[orgName] || null
  }

  /**
   * Saves repos to the file cache and returns a reduced version
   * of objects back.
   */
  public async saveRepos (orgName: string, repos: Repo[]): Promise<Repo[]> {
    const fileContents = await this._getFileContents()
    fileContents.repos = fileContents.repos || {}

    fileContents.repos[orgName] = repos.map((repo) => {
      return this._pickValues(repo, ['name', 'full_name', 'private', 'fork', 'archived', 'id'])
    })

    await fs.outputJSON(this.fileName, fileContents)
    return fileContents.repos[orgName]
  }

  /**
   * Returns labels from the cache or null if nothing exists
   */
  public async getLabels (repoName: string): Promise<Label[] | null> {
    const fileContents = await this._getFileContents()
    if (!fileContents.labels) {
      return null
    }

    return fileContents.labels[repoName] || null
  }

  /**
   * Saves labels for a given repo to the file cache and
   * returns a reduced version of labels back.
   */
  public async saveLabels (repoName: string, labels: Label[]): Promise<Label[]> {
    const fileContents = await this._getFileContents()
    fileContents.labels = fileContents.labels || {}

    fileContents.labels[repoName] = labels.map((repo) => {
      return this._pickValues(repo, ['name', 'color', 'id'])
    })

    await fs.outputJSON(this.fileName, fileContents)
    return fileContents.labels[repoName]
  }

  /**
   * Returns the contents for the cache file for a given
   * user.
   */
  private async _getFileContents (): Promise<UserFile> {
    try {
      const contents = await fs.readJSON(this.fileName)
      return contents
    } catch (error) {
      return {}
    }
  }

  /**
   * Pick value for given keys from the source object.
   */
  private _pickValues <T> (source: T, keys: string[]): T {
    return keys.reduce((r, k) => {
      r[k] = source[k]
      return r
    }, {} as T)
  }
}

export default OctoLocal
