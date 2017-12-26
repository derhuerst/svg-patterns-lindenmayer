'use strict'

const h = require('h2ml')

const lindenmayer = require('./lib/lindenmayer')









const round = v => Math.round(v * 1000) / 1000

const _moveTo = (ctx, nX, nY) => {
	ctx.x = nX
	ctx.y = nY
	if (nX < ctx.minX) ctx.minX = nX
	else if (nX > ctx.maxX) ctx.maxX = nX
	if (nY < ctx.minY) ctx.minY = nY
	else if (nY > ctx.maxY) ctx.maxY = nY
}

const _finishLine = (ctx, opt) => {
	if (ctx.d) {
		ctx.items.push(h('path', {
			d: ctx.d,
			stroke: opt.colors[ctx.color],
			'stroke-width': '' + round(Math.sqrt(Math.abs(ctx.scaleX)))
		}))
		ctx.d = null
	}
}
const _continueLine = (ctx, l) => {
	const dX = Math.cos(ctx.angle) * l * ctx.scaleX
	const dY = Math.sin(ctx.angle) * l * ctx.scaleY

	if (!ctx.d) ctx.d = `M ${round(ctx.x)} ${round(ctx.y)}`
	ctx.d += `l ${round(dX)} ${round(dY)}`
	_moveTo(ctx, ctx.x + dX, ctx.y + dY)
}

const drawLine = (ctx, opt) => _continueLine(ctx, opt.distance)
const drawLineHalf = (ctx, opt) => _continueLine(ctx, opt.distance * .5)

const _moveBy = (ctx, opt, l) => {
	_finishLine(ctx, opt)
	const dX = Math.cos(ctx.angle) * l * ctx.scaleX
	const dY = Math.sin(ctx.angle) * l * ctx.scaleY
	_moveTo(ctx, ctx.x + dX, ctx.y + dY)
}
const move = (ctx, opt) => _moveBy(ctx, opt, opt.distance)
const moveHalf = (ctx, opt) => _moveBy(ctx, opt, opt.distance * .5)

const turnClockwise = (ctx, opt) => {
	ctx.angle += opt.angle
}
const turnCounterclockwise = (ctx, opt) => {
	ctx.angle -= opt.angle
}

const switchColor = (ctx, opt) => {
	_finishLine(ctx, opt)
	ctx.color = (ctx.color + 1) % opt.colors.length
}

const savePositionAngle = (ctx, opt) => {
	ctx.xStack.push(ctx.x)
	ctx.yStack.push(ctx.y)
	ctx.angleStack.push(ctx.angle)
}
const restorePositionAngle = (ctx, opt) => {
	_finishLine(ctx, opt)
	ctx.x = ctx.xStack.pop()
	ctx.y = ctx.yStack.pop()
	ctx.angle = ctx.angleStack.pop()
}

const saveColor = (ctx, opt) => {
	ctx.colorStack.push(ctx.color)
}
const restoreColor = (ctx, opt) => {
	_finishLine(ctx, opt)
	ctx.color = ctx.colorStack.pop()
}

const scaleUp = (ctx, opt) => {
	_finishLine(ctx, opt)
	ctx.scaleX /= .8
	ctx.scaleY /= .8
}
const scaleDown = (ctx, opt) => {
	_finishLine(ctx, opt)
	ctx.scaleX *= .8
	ctx.scaleY *= .8
}

const flipHorizontally = (ctx, opt) => {
	_finishLine(ctx, opt)
	ctx.scaleX *= -1
	ctx.x *= -1
}
const flipVertically = (ctx, opt) => {
	_finishLine(ctx, opt)
	ctx.scaleY *= -1
	ctx.y *= -1
}

const hump = (ctx, opt) => {
	ctx.items.push(h('circle', {
		cx: '' + round(ctx.x),
		cy: '' + round(ctx.y),
		r: '' + round(1.5 * Math.abs(ctx.scaleX)),
		stroke: opt.colors[ctx.color],
		'stroke-width': '' + round(.7 * Math.sqrt(Math.abs(ctx.scaleX)))
	}))
}













const defaultOpts = {
	angle: Math.PI / 4,
	distance: 10,
	colors: ['red', 'black', 'blue']
}

const defaultAtoms = {
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
}

const generate = (iterations, axiom, rules, opt = {}) => {
	opt = Object.assign({}, defaultOpts, opt)
	const atoms = Object.assign({}, defaultAtoms, opt.atoms)

	const ctx = {
		items: [
			h('style', {}, `
path {
	stroke-linecap: round;
	stroke-linejoin: round;
	fill: none;
}
circle {
	fill: none;
}`)
		],
		minX: 0, minY: 0, maxX: 0, maxY: 0, // bbox
		scaleX: 1, scaleY: 1, // scale, flip axes
		x: 0, y: 0,
		xStack: [],
		yStack: [],
		angle: 0,
		angleStack: [],
		color: 0,
		colorStack: [],
		d: null // "d" attribute of the current path, used by _finishLine
	}

	const atomsWrapped = Object.entries(atoms).reduce((acc, [atomName, atom]) => {
		acc[atomName] = () => atom(ctx, opt)
		return acc
	}, Object.create(null))

	const penetrate = lindenmayer(rules, atomsWrapped)
	penetrate(axiom, iterations)
	_finishLine(ctx, opt)

	const width = Math.abs(ctx.maxX - ctx.minX)
	const height = Math.abs(ctx.maxY - ctx.minY)
	return h('svg', {
		viewBox: [
			round(ctx.minX) - 10, round(ctx.minY) - 10,
			round(width) + 20, round(height) + 20
		].join(' '),
		xmlns: 'http://www.w3.org/2000/svg'
	}, ctx.items)
}

module.exports = generate
