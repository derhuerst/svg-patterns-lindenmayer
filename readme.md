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


## API

```js
generate(iterations, axiom, rules, [opt])
```

`iterations` should be an integer `>0`. It determines how often rule identifiers in `axiom` will be evaluated.

`axiom` must be a string of multiple rule identifiers (e.g. `'AA[B+]'`) or an array of individual identifiers (e.g. `['A'. 'A', '[', 'B', '+', ']']`).

`rules` must be an object. Each key is a rule identifier, each value must be a string of rule identifiers (e.g. `AB`) or an array of rule identifiers (e.g. `['A', 'B']`), which will be used during evaluation.

`opt` is optional and must be an object. It may have the following keys:

- `colors`: An array of colors to be used.
- `distance`: The distance to move forward. Used by e.g. `F`, `M`.
- `atoms`: An object of atoms. Each key is the identifier of the atom. Each value must be a function which executes a rendering operation. See the source code for details.


## Contributing

If you have a question or have difficulties using `svg-patterns-lindenmayer`, please double-check your code and setup first. If you think you have found a bug or want to propose a feature, refer to [the issues page](https://github.com/derhuerst/svg-patterns-lindenmayer/issues).
