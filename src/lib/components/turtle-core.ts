import Color from 'color'

class Turtle {
	private _dir = 0
	private _x = 0
	private _y = 0
	private _draw = true
	private _color = Color('#000')
	private _lineWidth = 1
	private _height: number
	private _width: number
	private _origin = {
		x: 0,
		y: 0,
	}

	private paths = [
		{
			path: new Path2D(),
			color: this.color,
			lineWidth: this.lineWidth,
		},
	]

	private states = [] as {
		x: number
		y: number
		dir: number
		color: string
		lineWidth: number
	}[]

	private _ctx: CanvasRenderingContext2D

	constructor(canvas: HTMLCanvasElement) {
		this._ctx = canvas.getContext('2d') as CanvasRenderingContext2D

		this.x = 0
		this.y = 0
		this.dir = 0

		this._height = canvas.height
		this._width = canvas.width

		this._origin = {
			x: 0,
			y: 0,
		}

		this._ctx.translate(0.5 * this.width, 0.5 * this.height)
		this.currentPath.moveTo(0, 0)
	}

	setCurrentPath() {
		this.paths.push({
			path: new Path2D(),
			color: this.color,
			lineWidth: this.lineWidth,
		})
	}

	set size(size: { width: number; height: number }) {
		this._ctx.translate(
			(this._origin.x - 0.5) * this.width,
			(this._origin.y - 0.5) * this.height
		)

		this._width = size.width
		this._height = size.height

		this._ctx.translate(
			(this._origin.x + 0.5) * this.width,
			(this._origin.y + 0.5) * this.height
		)
	}

	set origin(point: { x: number; y: number }) {
		this._ctx.translate(
			(this._origin.x - 0.5) * this.width,
			(this._origin.y - 0.5) * this.height
		)

		this._origin = point

		this._ctx.translate(
			(this._origin.x + 0.5) * this.width,
			(this._origin.y + 0.5) * this.height
		)
	}
	get origin() {
		return this._origin
	}

	get current() {
		return this.paths[this.paths.length - 1]
	}

	get currentPath() {
		return this.current.path
	}

	penup() {
		this.draw = false
		return this
	}

	pendown() {
		if (!this.draw) {
			this.draw = true
			this.setCurrentPath()
		}
		return this
	}

	moveTo(x: number, y: number) {
		this.x = x
		this.y = y

		if (!this.draw) {
			this.currentPath.moveTo(this.x, this.y)
		} else {
			this.currentPath.lineTo(this.x, this.y)
		}

		return this
	}

	jump(x: number, y: number) {
		const drawing = this.draw
		this.penup()
		this.x = x
		this.y = y
		if (drawing) {
			this.pendown()
		}
	}

	forward(dist: number) {
		// vector transformation
		const x = this.x + dist * Math.cos(this.dir)
		const y = this.y + dist * Math.sin(this.dir)

		return this.moveTo(x, y)
	}

	back(dist: number) {
		const x = this.x + dist * Math.cos(this.dir - Math.PI)
		const y = dist * Math.sin(this.dir - Math.PI)

		return this.moveTo(x, y)
	}

	left(angle = 90) {
		this.dir -= angle * (Math.PI / 180)
		return this
	}

	right(angle = 90) {
		this.dir += angle * (Math.PI / 180)
		return this
	}

	save() {
		this.states.push({
			x: this.x,
			y: this.y,
			dir: this.dir,
			color: this.color.hex(),
			lineWidth: this.lineWidth,
		})
		return this
	}

	restore() {
		const state = this.states.pop()
		if (state !== undefined) {
			this.setcolor(state.color)
			this.setx(state.x)
			this.sety(state.y)
			this.setheading(state.dir)
			this.setlinewidth(state.lineWidth)
		}
		return this
	}

	fill() {
		this._ctx.fill(this.currentPath)
		return this
	}

	stroke() {
		this.clear()
		for (let path of this.paths) {
			this._ctx.strokeStyle = path.color.hex()
			this._ctx.lineWidth = path.lineWidth
			this._ctx.stroke(path.path)
		}
		return this
	}

	setcolor(color: string) {
		this._color = Color(color)
		this.current.color = Color(color)
		return this
	}

	setlinewidth(width: number) {
		this.lineWidth = width
		this.current.lineWidth = width
		return this
	}

	setx(x: number) {
		this.x = x
		return this
	}

	sety(y: number) {
		this.y = y
		return this
	}

	get heading() {
		return this.dir
	}

	set heading(angle: number) {
		this.dir = angle
	}

	get color() {
		return this._color
	}

	transformColor(callback: (color: Color) => Color) {
		this.setcolor(callback(this.color).hex())
		return this
	}

	setheading(angle: number) {
		this.dir = angle
		return this
	}

	clearPaths() {
		this.paths = [this.paths[this.paths.length - 1]]
		return this
	}

	clear(x = 0, y = 0, width = this.width, height = this.height) {
		this._ctx.translate(
			-(this._origin.x + 0.5) * this.width,
			-(this._origin.y + 0.5) * this.height
		)

		this._ctx.clearRect(x, y, width, height)

		this._ctx.translate(
			(this._origin.x + 0.5) * this.width,
			(this._origin.y + 0.5) * this.height
		)

		return this
	}

	home() {
		this.x = this.width / 2
		this.y = this.height / 2
		this.dir = 0
		return this
	}

	toradians(angle: number) {
		return angle * ((Math.PI * 2) / 360)
	}

	circle(radius: number, extent = 360, steps: number) {
		if (!extent) {
			extent = 360
		}
		extent = this.toradians(extent)
		if (!steps) {
			steps = Math.round(Math.abs(radius * extent * 8)) | 0
			steps = Math.max(steps, 4)
		}
		const cx = this.x + radius * Math.cos(this.dir + Math.PI / 2)
		const cy = this.y + radius * Math.sin(this.dir + Math.PI / 2)
		const a1 = Math.atan2(this.y - cy, this.x - cx)
		const a2 = radius >= 0 ? a1 + extent : a1 - extent
		for (let i = 0; i < steps; i++) {
			const p = i / (steps - 1)
			const a = a1 + (a2 - a1) * p
			const x = cx + Math.abs(radius) * Math.cos(a)
			const y = cy + Math.abs(radius) * Math.sin(a)
			this.goto(x, y)
		}
		if (radius >= 0) {
			this.dir += extent
		} else {
			this.dir -= extent
		}
		return this
	}

	get width() {
		return this._width
	}

	get height() {
		return this._height
	}

	set dir(dir: number) {
		this._dir = dir
	}

	get dir() {
		return this._dir
	}

	set lineWidth(lineWidth: number) {
		this._lineWidth = lineWidth
	}

	get lineWidth() {
		return this._lineWidth
	}

	set draw(draw: boolean) {
		this._draw = draw
	}

	get draw() {
		return this._draw
	}

	set x(x: number) {
		this._x = x
	}

	get x() {
		return this._x
	}

	set y(y: number) {
		this._y = y
	}

	get y() {
		return this._y
	}

	goto = this.moveTo
	moveto = this.moveTo
	setpos = this.moveTo
	setPosition = this.moveTo
	f = this.forward
	fd = this.forward
	b = this.back
	bk = this.back
	backward = this.back
	lt = this.left
	rt = this.right
	pd = this.pendown
	down = this.pendown
	pu = this.penup
	up = this.penup
	jmp = this.jump
	seth = this.setheading
}

export default Turtle
