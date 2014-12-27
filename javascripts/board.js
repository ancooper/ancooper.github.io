	function Board(id, bgImg) {
		this.canvas = document.getElementById(id);
		this.ctx = this.canvas.getContext('2d');
		this.bgImg = bgImg;
		this.dim = {m: 10, n: 10};
		this.mn = 4;
		this.components = [];

		this.draw = function() {
			var self = this;
			var img = new Image();
			img.onload = function(){
				self.ctx.drawImage(img, 0, 0, self.size.width, self.size.height);
				for (var i = 0; i < self.components.length; i++) {
					self.components[i].draw();
				};
			}
			img.src = this.bgImg;
		}

		this.resize = function() {
			this.size = {width: window.innerWidth, height: window.innerHeight};
			this.canvas.width = this.size.width;
			this.canvas.height = this.size.height;
			this.useSize = {width: this.size.width-2*this.mn, height: 0.8*this.size.height-4*this.mn};
			this.cellSize = Math.floor(Math.min(this.useSize.width/this.dim.m, this.useSize.height/(this.dim.n+1)));		
			for (var i = 0; i < this.components.length; i++) {
				this.components[i].resize();
			};
			this.draw();
		}

		this.resize();
	}

	function Field(board, m, n) {
		var self = this;
		this.board = board;
		this.ctx = board.ctx;
		this.offset = {left: this.ctx.canvas.offsetLeft, top: this.ctx.canvas.offsetTop};
		this.pd = Math.floor(0.06*this.board.cellSize);
		this.dim = {m: m, n: n};
		this.ctx.canvas.addEventListener("click", function(e) {
			self.click.apply(self, [e.pageX-self.offset.left-self.pos.x, e.pageY-self.offset.top-self.pos.y]);
		});
		this.data = new Array(Math.ceil(n*m));
		this.board.components.push(this);

		this.click = function(x, y) {
			var 
				i = Math.floor(x*this.dim.m/this.size.w), 
				j = Math.floor(y*this.dim.n/this.size.h);
			if (i<0 || j<0 || i>=this.dim.m || j>=this.dim.n) return;
			if (this.onclick != null) this.onclick(i, j);
		}

		this.resize = function() {

		}

		this.draw = function() {
			this.field();
			if (this.onpaint != null) this.onpaint();
		}

	}

	Field.prototype.WHITE =   {main: '#eee', light: '#fff', dark: '#888'};
	Field.prototype.BLACK =   {main: '#333', light: '#666', dark: '#000'};
	Field.prototype.RED =     {main: '#933', light: '#fff', dark: '#311'};
	Field.prototype.YELLOW =  {main: '#993', light: '#fff', dark: '#331'};
	Field.prototype.GREEN =   {main: '#393', light: '#fff', dark: '#131'};
	Field.prototype.CYAN =    {main: '#399', light: '#fff', dark: '#133'};
	Field.prototype.BLUE =    {main: '#339', light: '#fff', dark: '#113'};
	Field.prototype.MAGENTA = {main: '#939', light: '#fff', dark: '#313'};
	Field.prototype.GRAY =    {main: '#999', light: '#ddd', dark: '#333'};

	Field.prototype.COLORS = [
		null,
		Field.prototype.WHITE,
		Field.prototype.BLACK,
		Field.prototype.RED,
		Field.prototype.YELLOW,
		Field.prototype.GREEN,
		Field.prototype.CYAN,
		Field.prototype.BLUE,
		Field.prototype.MAGENTA,
		Field.prototype.GRAY];




	Field.prototype.field = function() {
		var 
			fx = this.pos.left, 
			fy = this.pos.top, 
			fw = this.size.width, 
			fh = this.size.height,
			cx = fx, 
			cy = fy, 
			cs = this.board.cellSize;

		this.rrect(fx+3, fy+3, fw, fh, 4, "rgba(0, 0, 0, 0.25)");
		this.rrect(fx, fy, fw, fh, 4, 'rgba(200, 200, 200, 0.25)');

		for (var i = 0; i < this.dim.m; i++) 
			for (var j = 0; j < this.dim.n; j++) {
				this.rrect(cx+i*cs+this.pd, cy+j*cs+this.pd, cs-2*this.pd, cs-2*this.pd, this.pd, 'rgba(50, 50, 50, 0.25)');
				this.rrect(cx+i*cs+this.pd+1, cy+j*cs+this.pd+1, cs-2*this.pd-1, cs-2*this.pd-1, this.pd, 'rgba(220, 220, 220, 0.25)');
				this.ball(cx+i*cs+0.5*cs, cy+j*cs+0.5*cs, 0.45*(cs-2*this.pd), this.data[Math.floor(i+j*this.dim.m)]);
		}
	}

	Field.prototype.rrect = function(x, y, w, h, r, c) {
		var qu = 0.5*Math.PI;
		this.ctx.beginPath();
		this.ctx.arc(x+r, y+h-r-1, r, qu, 2*qu);
		this.ctx.lineTo(x, y+r);
		this.ctx.arc(x+r, y+r, r, 2*qu, 3*qu);
		this.ctx.lineTo(x+w-r-1, y);
		this.ctx.arc(x+w-r-1, y+r, r, 3*qu, 0);
		this.ctx.lineTo(x+w-1, y+h-r-1);
		this.ctx.arc(x+w-r-1, y+h-r-1, r, 0, qu);
		this.ctx.fillStyle = c;
		this.ctx.fill();
		this.ctx.closePath();	
	}

	Field.prototype.ball = function(x, y, r, cs) {
		var pi2 = 2*Math.PI;
		if (cs == null) return;
		this.ballShadow(x, y, r);
		this.ctx.beginPath();
		this.ctx.arc(x, y, r, 0, Math.PI*2, true);
		var gradient = this.ctx.createRadialGradient(x-r/2, y-r/2, 0, x, y, r);
		gradient.addColorStop(0, cs.main);
		gradient.addColorStop(1, cs.dark);
		this.ctx.fillStyle = gradient;
		this.ctx.fill();
		this.ctx.closePath();

		this.ctx.beginPath();
		this.ctx.arc(x, y, r*0.7, Math.PI/180*270, Math.PI/180*180, true);
		this.ctx.lineTo(x-r, y-r);
		gradient = this.ctx.createRadialGradient(x-r*.5, y-r*.5, 0, x, y, r);
		gradient.addColorStop(0, cs.light);
		gradient.addColorStop(0.5, 'transparent');
		this.ctx.fillStyle = gradient;
		this.ctx.fill();
		this.ctx.closePath();
	}

	Field.prototype.ballShadow = function(x, y, r) {
		this.ctx.beginPath();
		this.ctx.arc(x+r*.125, y+r*.25, r*1.5, 0, Math.PI*2, true);
		var gradient = this.ctx.createRadialGradient(x+r*.125, y+r*.25, 0, x+r*.25, y+r*.5, r*1.3);
		gradient.addColorStop(0, '#000000');
		gradient.addColorStop(1, 'transparent');
		this.ctx.fillStyle = gradient;
		this.ctx.fill();
		this.ctx.closePath();
	}

	window.addEventListener('resize', function() {
		window.board.resize();
	});

	function FieldFactory(board) {
		this.board = board;


		this.getField = function() {
			var field = new Field(board, 10, 10);
			field.resize = function() {
				this.pd = Math.ceil(0.06*this.board.cellSize);
				this.size = {width: Math.floor(this.board.cellSize*this.dim.m), height: Math.floor(this.board.cellSize*this.dim.m)};
				this.pos = {left: Math.floor(0.5*(this.board.size.width-this.size.width)), top: Math.floor(this.board.size.height-this.size.height-this.board.cellSize-3*this.board.mn)};
			}
			field.onclick = function(i, j) {
				this.data[Math.floor(i+j*this.dim.m)] = this.selectedTool;
				this.board.draw();
			}
			return field;
		};

		this.getTools = function() {
			var tools = new Field(board, 10, 1);
			tools.data = tools.COLORS.slice(0);
			tools.resize = function() {
				this.size = {width: Math.floor(this.board.cellSize*this.dim.m), height: Math.floor(this.board.cellSize)};
				this.pos = {left: Math.floor(0.5*(this.board.size.width-this.size.width)), top: Math.floor(this.board.size.height-this.size.height-this.board.mn)};
			}
			tools.onclick = function(i, j) {
				this.selectedTool = Math.floor(i);
				window.field.selectedTool = this.data[this.selectedTool];
				this.board.draw();
			}
			tools.onpaint = function() {
				var 
					fx = this.pos.x, 
					fy = this.pos.y, 
					fw = this.size.w, 
					fh = this.size.h,
					cx = fx+this.pd, 
					cy = fy+this.pd, 
					cw = Math.floor((fw-this.pd)/this.dim.m)-this.pd, 
					ch = Math.floor((fh-this.pd)/this.dim.n)-this.pd, 
					sx = Math.floor((fw-this.pd)/this.dim.m), 
					sy = Math.floor((fh-this.pd)/this.dim.n);

				var i = this.selectedTool;
				this.ctx.beginPath();
				this.ctx.arc(cx+i*sx+0.5*cw, cy+0.5*ch, 15, 0, 2*Math.PI);
				this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
				this.ctx.stroke();
				this.ctx.closePath();
			}
			tools.onclick(1, 0);
			return tools;
		}
	}

	window.addEventListener('load', function() {
		window.board = new Board('board', 'images/backboard.jpg');

		var fieldFactory = new FieldFactory(board);
		window.field = fieldFactory.getField();
		window.tools = fieldFactory.getTools();

		window.board.resize();
	});