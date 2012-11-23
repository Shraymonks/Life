(function (d, w) {
	'use strict';



	function Cell(alive) {
		this.isAlive = !!alive;
	}

	Cell.prototype.aliveNeighbours = function (x, y) {
		var xMin = Math.max(x - 1, 0),
			yMin = Math.max(y - 1, 0),
			xMax = Math.min(x + 1, Life.width - 1),
			yMax = Math.min(y + 1, Life.height - 1),
			alive = 0,
			i,
			j;

		for (i = xMin; i <= xMax; ++i)
			for (j = yMin; j <= yMax; ++j) {
				if (alive > 3)
					return 4;
				if (!(i === x && j === y))
					alive += Life.board[i][j].isAlive ? 1 : 0;
			}

		return alive;
	};

	Cell.prototype.nextState = function (x, y) {
		var neighbours = this.aliveNeighbours(x, y);

		if (this.isAlive) {
			if (neighbours < 2 || neighbours > 3)
				return false;
			else
				return true;
		}
		else if (neighbours === 3)
			return true;
	};

	var requestAnimFrame = (function() {
		return  window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			function(callback,  element){
				window.setTimeout(callback, 1000 / 60);
			};
	})(),
	Life = {
		init: function (options) {
			var x, y;

			options = options || {};

			this.canvas = document.getElementsByTagName('canvas')[0];
			this.ctx = this.canvas.getContext('2d');
			this.canvas.width = d.documentElement.clientWidth;
			this.canvas.height = d.documentElement.clientHeight;

			this.pixelSize = options.pixelSize || 1;

			this.width = Math.floor(this.canvas.width / this.pixelSize);
			this.height = Math.floor(this.canvas.height / this.pixelSize);

			this.board = [];
			for (x = 0; x < this.width; ++x) {
				this.board[x] = [];
				for (y = 0; y < this.height; ++y)
					this.board[x][y] = new Cell(Math.floor(Math.random() * 2));
			}

			this.setHandlers();
			this.draw();
		},
		step: function () {
			var newBoard = [], x, y;

			for (x = 0; x < this.width; ++x) {
				newBoard[x] = [];
				for (y = 0; y < this.height; ++y) {
					newBoard[x][y] = new Cell(this.board[x][y].nextState(x, y));
				}
			}
			this.board = newBoard;
		},
		draw: function () {
			var x, y, xPixels;
			requestAnimFrame(Life.draw);
			Life.ctx.fillStyle = 'white';
			Life.ctx.clearRect(0, 0, Life.canvas.width, Life.canvas.height);
			for (x = 0; x < Life.width; ++x) {
				xPixels = x * Life.pixelSize;
				for (y = 0; y < Life.height; ++y)
					if (Life.board[x][y].isAlive) {
						Life.ctx.fillStyle = 'black';
						Life.ctx.fillRect(xPixels, y * Life.pixelSize, Life.pixelSize, Life.pixelSize);
					}
			}

			Life.step();
		},
		setHandlers: function () {
			w.addEventListener('resize', function () {
				Life.canvas.width = d.documentElement.clientWidth;
				Life.canvas.height = d.documentElement.clientHeight;
				Life.width = Math.floor(Life.canvas.width / Life.pixelSize);
				Life.height = Math.floor(Life.canvas.height / Life.pixelSize);
			});
		}
	};

	Life.init({pixelSize: 2});

}).call(this, document, window);