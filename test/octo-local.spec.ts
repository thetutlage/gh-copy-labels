'use strict'

import test from 'japa'
import fs from 'fs-extra'
import { join } from 'path'
import OctoLocal from '../src/OctoLocal'

const filePath = join(__dirname, 'cache', 'thetutlage.json')

test.group('Octo Local', (group) => {
  group.afterEach(async () => {
    await fs.remove(join(__dirname, 'cache'))
  })

  test('return null when orgs are missing', async (assert) => {
    const octo = new OctoLocal(filePath)
    const orgs = await octo.getOrgs()
    assert.isNull(orgs)
  })

  test('return orgs when they exists inside the local file', async (assert) => {
    const userOrgs = [
      {
        id: 1,
        login: 'adonisjs',
      },
    ]

    await fs.outputJSON(filePath, { orgs: userOrgs })

    const octo = new OctoLocal(filePath)
    const orgs = await octo.getOrgs()
    assert.deepEqual(orgs, userOrgs)
  })

  test('save orgs for a given user', async (assert) => {
    const octo = new OctoLocal(filePath)
    await octo.saveOrgs([
      {
        id: 1,
        login: 'adonisjs',
      },
    ])

    const userFile = await fs.readJSON(filePath)
    assert.deepEqual(userFile, {
      orgs: [{ id: 1, login: 'adonisjs' }],
    })
  })

  test('return null when there are no repos', async (assert) => {
    const octo = new OctoLocal(filePath)
    const repos = await octo.getRepos('adonisjs')
    assert.isNull(repos)
  })

  test('return repos array when they exists', async (assert) => {
    const userRepos = {
      adonisjs: [
        {
          name: 'adonis-framework',
          full_name: 'adonis-framework',
          id: 1,
          private: false,
          fork: false,
          archived: false,
        },
      ],
    }

    await fs.outputJSON(filePath, { repos: userRepos })

    const octo = new OctoLocal(filePath)
    const repos = await octo.getRepos('adonisjs')
    assert.deepEqual(repos, userRepos.adonisjs)
  })

  test('save empty array of repos', async (assert) => {
    const octo = new OctoLocal(filePath)
    await octo.saveRepos('adonisjs', [])

    const userFile = await fs.readJSON(filePath)
    assert.deepEqual(userFile, {
      repos: {
        adonisjs: [],
      },
    })
  })

  test('filter properties before saving repos', async (assert) => {
    const octo = new OctoLocal(filePath)
    const repo = {
      id: 1,
      name: 'adonis-framework',
      full_name: 'adonisjs/adonis-framework',
      private: false,
      fork: false,
      archived: false,
    }
    await octo.saveRepos('adonisjs', [ repo ])

    const userFile = await fs.readJSON(filePath)
    assert.deepEqual(userFile, {
      repos: {
        adonisjs: [ repo ],
      },
    })
  })

  test('return null when there are no labels', async (assert) => {
    const octo = new OctoLocal(filePath)
    const labels = await octo.getRepos('adonisjs')
    assert.isNull(labels)
  })

  test('return labels array when they exists', async (assert) => {
    const userLabels = {
      adonisjs: [
        {
          name: 'PR Needed',
          color: '#fff',
          id: 1,
        },
      ],
    }

    await fs.outputJSON(filePath, { labels: userLabels })

    const octo = new OctoLocal(filePath)
    const labels = await octo.getLabels('adonisjs')
    assert.deepEqual(labels, userLabels.adonisjs)
  })

  test('save empty array of labels', async (assert) => {
    const octo = new OctoLocal(filePath)
    await octo.saveLabels('adonisjs', [])

    const userFile = await fs.readJSON(filePath)
    assert.deepEqual(userFile, {
      labels: {
        adonisjs: [],
      },
    })
  })

  test('filter properties before saving labels', async (assert) => {
    const octo = new OctoLocal(filePath)
    await octo.saveLabels('adonisjs', [
      {
        id: 1,
        name: 'adonis-framework',
        color: '#fff',
      },
    ])

    const userFile = await fs.readJSON(filePath)
    assert.deepEqual(userFile, {
      labels: {
        adonisjs: [
          {
            id: 1,
            name: 'adonis-framework',
            color: '#fff',
          },
        ],
      },
    })
  })
})
