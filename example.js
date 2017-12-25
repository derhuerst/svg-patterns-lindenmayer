'use strict'

const generate = require('.')

const svg = generate(5, 'A', {
	A: 'B',
	B: 'F++OB'
})

process.stdout.write(svg + '\n')
