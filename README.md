# Github copy labels
> Copy labels across multiple Github repos from a source repo.

[![travis-image]][travis-url]
[![npm-image]][npm-url]
![](https://img.shields.io/badge/Uses-Typescript-294E80.svg?style=flat-square&colorA=ddd)

**Github copy labels** is a node CLI module to copy labels across multiple repos. I created this module, because I was not able to find any app that lemme copy to multiple repos at once.

### Features
1. Copy to multiple repos within an organizations.
2. Avoids duplicate labels.
3. Caches organizations and repos data to avoid hitting Github API every time.

## Demo's
![](https://res.cloudinary.com/adonisjs/image/upload/v1530034643/labels-copied_lme74k.gif)

If labels already exists, they will be skipped.

![](https://res.cloudinary.com/adonisjs/image/upload/v1530034638/labels-exists_rgs76y.gif)

## Installation
Install it from npm as a global dependency, so that you can run the command from anywhere.

```shell
npm i -g gh-copy-labels
```

## Copying labels
1. Run `cp-labels` command to start the process.
2. You will need a Github Personal Token. Grab it from your [Developer settings](https://github.com/settings/developers).
3. Then just follow the prompts.
4. Pass `--re-auth` flag to define a token (since tokens are stored and re-used).
5. Pass `--force` flag to re-fetch orgs and repos (since they are cached to avoid hitting Github API).

## Change log

The change log can be found in the [CHANGELOG.md](https://github.com/thetutlage/gh-copy-labels/CHANGELOG.md) file.

## Contributing

Everyone is welcome to contribute. Please take a moment to review the [contributing guidelines](CONTRIBUTING.md).

## Authors & License
[thetutlage](https://github.com/thetutlage) and [contributors](https://github.com/thetutlage/gh-copy-labels/graphs/contributors).

MIT License, see the included [MIT](LICENSE.md) file.

[travis-image]: https://img.shields.io/travis/thetutlage/gh-copy-labels/master.svg?style=flat-square&logo=travis
[travis-url]: https://travis-ci.org/thetutlage/gh-copy-labels "travis"

[npm-image]: https://img.shields.io/npm/v/gh-copy-labels.svg?style=flat-square&logo=npm
[npm-url]: https://npmjs.org/package/gh-copy-labels "npm"
