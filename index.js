'use strict'

const h = require('h2ml')

const lindenmayer = require('./lib/lindenmayer')

const defaults = {
	angle: Math.PI / 4,
	distance: 10,
	colors: ['red', 'black', 'blue']
}

const round = v => Math.round(v * 1000) / 1000

const generate = (iterations, axiom, rules, opt = {}) => {
	opt = Object.assign({}, defaults, opt)
	const ANGLE = opt.angle
	const DISTANCE = opt.distance
	const COLORS = opt.colors

	const items = [
		h('style', {}, `
path {
	stroke-linecap: round;
	stroke-linejoin: round;
	fill: none;
}
circle {
	fill: none;
}`)
	]

	let minX = 0, minY = 0, maxX = 0, maxY = 0 // bbox
	let scaleX = 1, scaleY = 1 // flip axes

	let x = 0, y = 0
	const xStack = []
	const yStack = []
	let angle = 0
	const angleStack = []
	let color = 0
	const colorStack = []

	const _moveTo = (nX, nY) => {
		x = nX
		y = nY
		if (nX < minX) minX = nX
		else if (nX > maxX) maxX = nX
		if (nY < minY) minY = nY
		else if (nY > maxY) maxY = nY
	}

	let d = null
	const _finishLine = (l) => {
		if (d) {
			items.push(h('path', {
				d,
				stroke: COLORS[color],
				'stroke-width': '' + round(Math.sqrt(Math.abs(scaleX)))
			}))
			d = null
		}
	}
	const _continueLine = (l) => {
		const dX = Math.cos(angle) * l * scaleX
		const dY = Math.sin(angle) * l * scaleY

		if (!d) d = `M ${round(x)} ${round(y)}`
		d += `l ${round(dX)} ${round(dY)}`
		_moveTo(x + dX, y + dY)
	}

	const drawLine = () => _continueLine(DISTANCE)
	const drawLineHalf = () => _continueLine(DISTANCE * .5)

	const _moveBy = (l) => {
		_finishLine()
		const dX = Math.cos(angle) * l * scaleX
		const dY = Math.sin(angle) * l * scaleY
		_moveTo(x + dX, y + dY)
	}
	const move = () => _moveBy(DISTANCE)
	const moveHalf = () => _moveBy(DISTANCE * .5)

	const turnClockwise = () => {
		angle += ANGLE
	}
	const turnCounterclockwise = () => {
		angle -= ANGLE
	}

	const switchColor = () => {
		_finishLine()
		color = (color + 1) % COLORS.length
	}

	const savePositionAngle = () => {
		xStack.push(x)
		yStack.push(y)
		angleStack.push(angle)
	}
	const restorePositionAngle = () => {
		_finishLine()
		x = xStack.pop()
		y = yStack.pop()
		angle = angleStack.pop()
	}

	const saveColor = () => {
		colorStack.push(color)
	}
	const restoreColor = () => {
		_finishLine()
		color = colorStack.pop()
	}

	const scaleUp = () => {
		_finishLine()
		scaleX /= .8
		scaleY /= .8
	}
	const scaleDown = () => {
		_finishLine()
		scaleX *= .8
		scaleY *= .8
	}

	const flipHorizontally = () => {
		_finishLine()
		scaleX *= -1
		x *= -1
	}
	const flipVertically = () => {
		_finishLine()
		scaleY *= -1
		y *= -1
	}

	const hump = () => {
		items.push(h('circle', {
			cx: '' + round(x),
			cy: '' + round(y),
			r: '' + round(1.5 * Math.abs(scaleX)),
			stroke: COLORS[color],
			'stroke-width': '' + round(.7 * Math.sqrt(Math.abs(scaleX)))
		}))
	}

	const generate = lindenmayer(rules, {
		F: drawLine,
		f: drawLineHalf,
		M: move,
		m: moveHalf,
		'+': turnClockwise,
		'-': turnCounterclockwise,
		'[': savePositionAngle,
		']': restorePositionAngle,
		'{': saveColor,
		'}': restoreColor,
		S: switchColor,
		O: scaleUp,
		Z: scaleDown,
		'=': flipHorizontally,
		'|': flipVertically,
		'$': hump
	})
	generate(axiom, iterations)
	_finishLine()

	const width = Math.abs(maxX - minX)
	const height = Math.abs(maxY - minY)
	return h('svg', {
		viewBox: [
			round(minX) - 10, round(minY) - 10,
			round(width) + 20, round(height) + 20
		].join(' '),
		xmlns: 'http://www.w3.org/2000/svg'
	}, items)
}

module.exports = generate
