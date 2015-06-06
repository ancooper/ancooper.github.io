Player = function(client) {
	this.client = client;
	this.load();
	/*/debug
	if (!this.exist() && location.protocol == 'file:') {
		this.nickName = 'ancooper';
		this.token = '29849FDS93428APR3948';
	}
	*/
};

Player.prototype.load = function() {
	this.nickName = Cookie.get('nickName');
	this.token = Cookie.get('token');
};

Player.prototype.save = function() {
	Cookie.save('nickName', this.nickName, 24*30)
	Cookie.save('token', this.token, 24*30)
};

Player.prototype.clear = function() {
	this.nickName = undefined;
	this.token = undefined;
};

Player.prototype.unsave = function() {
	this.clear();
	this.save();
};

Player.prototype.exist = function() {
	return this.nickName != null && this.token != null;
};

Player.prototype.iam = function() {
	return {'nickName': this.nickName, 'token': this.token};
};

Player.prototype.setToken = function(token) {
	this.token = token;
	if (this.exist())
		this.save();
};