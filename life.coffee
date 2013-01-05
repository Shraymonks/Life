'use strict'

requestAnimFrame = window.requestAnimationFrame or
	window.webkitRequestAnimationFrame or
	window.mozRequestAnimationFrame or
	window.oRequestAnimationFrame or
	window.msRequestAnimationFrame or
	(callback, element) -> window.setTimeout(callback, 1000 / 60)

class Cell
	constructor: (@isAlive) ->

	aliveNeighbours: (xMid, yMid) ->
		xMin = xMid - 1
		yMin = yMid - 1
		xMax = xMid + 1
		yMax = yMid + 1

		alive = 0

		for x in [xMin..xMax]
			for y in [yMin..yMax]
				if x < 0 then x = Life.width - 1
				if x is Life.width then x = 0

				if y < 0 then y = Life.height - 1
				if y is Life.height then y = 0

				if (x isnt xMid or y isnt yMid) and Life.board[x][y].isAlive
					if alive is 3 then return 4
					else ++alive

		alive

	nextState: (x, y) ->
		neighbours = @aliveNeighbours x, y

		neighbours is 3 or (@isAlive and neighbours is 2)

Life =
	init: (options) ->
		options or= {}

		@canvas = (document.getElementsByTagName 'canvas')[0]
		@ctx = @canvas.getContext '2d'
		@canvas.width = document.documentElement.clientWidth
		@canvas.height = document.documentElement.clientHeight

		@pixelSize = options.pixelSize or 1

		@width = Math.floor @canvas.width / @pixelSize
		@height = Math.floor @canvas.height / @pixelSize

		@board = []
		for x in [0...@width]
			@board[x] = []
			for y in [0...@height]
				@board[x][y] = new Cell (Math.floor (Math.random() * 2))

		do @setHandlers
		do @draw

	step: ->
		newBoard = []

		for x in [0...@width]
			newBoard[x] = []

			for y in [0...@height]
				newBoard[x][y] = new Cell (@board[x][y].nextState x, y)

		@board = newBoard


	draw: ->
		requestAnimFrame => do @draw
		imageData = @ctx.createImageData @canvas.width, @canvas.height
		canvasPixelWidth = imageData.width * 4
		for x in [0...@width]
			xPixels = x * @pixelSize
			for y in [0...@height]
				yPixels = y * @pixelSize

				# Cell pixel loop
				for pixelX in [0...@pixelSize]
					imageDataColAlpha = (xPixels + pixelX) * 4 + 3
					for pixelY in [0...@pixelSize]
						imageData.data[(yPixels + pixelY) * canvasPixelWidth + imageDataColAlpha] = 255 if @board[x][y].isAlive

		@ctx.putImageData imageData, 0, 0

		do @step

	setHandlers: ->
		window.addEventListener 'resize', =>
			@canvas.width = document.documentElement.clientWidth
			@canvas.height = document.documentElement.clientHeight
			@width = Math.floor @canvas.width / @pixelSize
			@height = Math.floor @canvas.height / @pixelSize


Life.init pixelSize: 2