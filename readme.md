# svg-patterns-lindenmayer

**Use [Lindenmayer systems](https://en.wikipedia.org/wiki/L-system) as SVG patterns.** Work in progess. In particular, the following is missing:

- tests
- helpful example code that yields a nice-looking pattern
- publishing to npm
- compatibility with [`svg-patterns`](https://github.com/derhuerst/svg-patterns#svg-patterns)

[![npm version](https://img.shields.io/npm/v/svg-patterns-lindenmayer.svg)](https://www.npmjs.com/package/svg-patterns-lindenmayer)
[![build status](https://api.travis-ci.org/derhuerst/svg-patterns-lindenmayer.svg?branch=master)](https://travis-ci.org/derhuerst/svg-patterns-lindenmayer)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/svg-patterns-lindenmayer.svg)
[![chat on gitter](https://badges.gitter.im/derhuerst.svg)](https://gitter.im/derhuerst)


## Installing

```shell
npm install svg-patterns-lindenmayer
```


## Usage

```js
const generate = require('svg-patterns-lindenmayer')

const svg = generate(5, 'A', {
	A: 'B',
	B: 'F++OB'
})

console.log(svg)
```


## Contributing

If you have a question or have difficulties using `svg-patterns-lindenmayer`, please double-check your code and setup first. If you think you have found a bug or want to propose a feature, refer to [the issues page](https://github.com/derhuerst/svg-patterns-lindenmayer/issues).
