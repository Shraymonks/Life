(function (d, w) {
	'use strict';



	function Cell(alive) {
		this.isAlive = !!alive;
	}

	Cell.prototype.aliveNeighbours = function (x, y) {
		var xMin = x - 1,
			yMin = y - 1,
			xMax = x + 1,
			yMax = y + 1,
			alive = 0,
			i,
			j;

		for (i = xMin; i <= xMax; ++i)
			for (j = yMin; j <= yMax; ++j)
				if (i >= 0 && j >= 0 && i < Life.canvas.width && j < Life.canvas.height && !(i === x && j === y))
					alive += Life.board[i][j].isAlive ? 1 : 0;

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
		init: function () {
			var x, y;

			this.canvas = document.getElementsByTagName('canvas')[0];
			this.ctx = this.canvas.getContext('2d');
			this.canvas.width = d.documentElement.clientWidth;
			this.canvas.height = d.documentElement.clientHeight;

			this.board = [];
			for (x = 0; x < this.canvas.width; ++x) {
				this.board.push([]);
				for (y = 0; y < this.canvas.height; ++y)
					this.board[x][y] = new Cell(Math.floor(Math.random() * 2));
			}

			this.setHandlers();
			this.draw();
		},
		step: function () {
			var newBoard = [], x, y;

			for (x = 0; x < this.canvas.width; ++x) {
				newBoard.push([]);
				for (y = 0; y < this.canvas.height; ++y) {
					newBoard[x][y] = new Cell(this.board[x][y].nextState(x, y));
				}
			}
			this.board = newBoard;
		},
		draw: function () {
			var x, y;
			requestAnimFrame(Life.draw);
			for (x = 0; x < Life.canvas.width; ++x)
				for (y = 0; y < Life.canvas.height; ++y) {
					Life.ctx.fillStyle = Life.board[x][y].isAlive ? 'black' : 'white';
					Life.ctx.fillRect(x, y, 1, 1);
				}

			Life.step();
		},
		setHandlers: function () {
			w.addEventListener('resize', function () {
				this.canvas.width = d.documentElement.clientWidth;
				this.canvas.height = d.documentElement.clientHeight;
			});
		}
	};

	Life.init();

}).call(this, document, window);