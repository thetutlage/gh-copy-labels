#!/usr/bin/env node

import Octo from '.'
import Conf from 'conf'
import inquirer from 'inquirer'
import chalk from 'chalk'
import { Label } from './Contracts'
import mri from 'mri'

const config = new Conf()

function largestLabelName (labels: Label[]): number {
  return Math.max(...labels.map(({ name }) => name.length))
}

function getSpaces (labelName: string, minMidth: number): string {
  const diff = minMidth - labelName.length
  return (diff === 0 ? new Array(4) : new Array(diff + 4)).join(' ')
}

async function setup (token: string, reAuth: boolean): Promise<string> {
  if (token && !reAuth) {
    return token
  }

  const { ghToken } = await inquirer.prompt([
    {
      name: 'ghToken',
      type: 'password',
      message: 'Enter Github token',
      suffix: chalk.dim(' Required to fetch your repos'),
      validate (input) {
        return !!input
      },
    },
  ])

  return ghToken
}

async function handle (octo: Octo, force: boolean): Promise<void> {
  const orgs = await octo.listOrgs(force)

  const { baseRepo, destRepos } = await inquirer.prompt([
    {
      name: 'baseOrg',
      message: 'Select base github organisation',
      validate (input) {
        return !!input
      },
      type: 'list',
      choices: orgs.map((org) => org.login),
    },
    {
      name: 'baseRepo',
      message: 'Select base repo',
      suffix: chalk.dim(' Used for copying labels'),
      type: 'list',
      async choices (answers) {
        const repos = await octo.listRepos(answers.baseOrg, force)
        return repos.map((repo) => {
          return { name: repo.name, value: repo.full_name }
        })
      },
    },
    {
      name: 'destOrg',
      message: 'Select organisation in which to copy labels',
      validate (input) {
        return !!input
      },
      type: 'list',
      choices: orgs.map((org) => org.login),
    },
    {
      name: 'destRepos',
      message: 'Select repos in which to copy labels',
      type: 'checkbox',
      async choices (answers) {
        const repos = await octo.listRepos(answers.destOrg, force)
        return repos.map((repo) => {
          return { name: repo.name, value: repo.full_name }
        })
      },
    },
  ])

  const labels = await octo.listLabels(baseRepo, force)
  const minWidth = largestLabelName(labels)

  octo.on('repo:start', (repoName) => {
    console.log('')
    console.log(chalk.dim(`Copying to ${repoName} repo`))
    console.log('=============================================')
  })

  octo.on('label:copied', ({ name }) => {
    console.log('✅', chalk.dim(name), getSpaces(name, minWidth), chalk.green('Copied'))
  })

  octo.on('label:error', ({ name }, error) => {
    console.log('❌', chalk.dim(name), getSpaces(name, minWidth), chalk.red(error))
  })

  await octo.copyLabels(labels, destRepos)
}

const args: { reAuth: boolean, force: boolean } = mri(process.argv.slice(2))

setup(config.get('token'), args.reAuth)
  .then((ghToken) => {
    config.set('token', ghToken)
    const octo = new Octo(ghToken)
    return handle(octo, args.force)
  })
  .catch((error) => {
    console.log(chalk.red('  Operation failed. Received following response from github'))
    console.log(chalk.red(`  ${error.message}`))
  })
