'use strict'

const lindenmayer = (_rules, atoms) => {
	const rules = Object.create(null)
	for (let token in _rules) {
		if (!Object.hasOwnProperty.call(_rules, token)) continue

		if (token.length !== 1) throw new Error('token must have length 1')

		// if (atoms[token]) throw new Error(token + ' is an atom and a rule')

		const rule = _rules[token]
		if ('string' === typeof rule) rules[token] = rule.split('')
		else if ('function' === typeof rule) rules[token] = rule
		else throw new Error(token + ' rule must be a string or a function')
	}

	const evaluate = (tokens, maxIterations) => {
		if ('string' === typeof tokens) tokens = tokens.split('')
		else if (Array.isArray(tokens)) tokens = Array.from(tokens)
		else throw new Error('tokens must be a string or an array')

		for (let i = 0; i < maxIterations; i++) {
			for (let t = 0; t < tokens.length; t++) {
				const token = tokens[t]

				if (rules[token]) {
					const newTokens = rules[token]
					tokens.splice(t, 1, ...newTokens)
					t += newTokens.length - 1
				} else if (!atoms[token]) {
					throw new Error(`cannot evaluate ${token}`)
				}
			}
		}

		for (let token of tokens) {
			if (atoms[token]) {
				const atom = atoms[token]
				atom()
			}
		}
	}
	return evaluate
}

module.exports = lindenmayer
