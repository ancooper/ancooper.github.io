Client = function() {
    this.host = 'http://192.168.1.128:80/'; //http://ancooper.ddns.net:80/
    this.options = {
        'force new connection': true,
        'resource': 'path/to/socket.io'};

};

Client.prototype.connect = function() {
    this.socket = io.connect(this.host, this.options);
    this.setup()
};

Client.prototype.connected = function() {
	return !!this.socket && this.socket.connected;
};

Client.prototype.setup = function() {
	var self = this;

    this.socket.on('connect', function() { console.log('connection ok') });

    this.socket.on('ok', function(message) {
    	console.log('ok', message);
    	switch(message.request){
        	case 'login':
        		player.setToken(message.token);
        		self.enter();
        		break;
        	case 'iam':
        		self.getRoomInfo();
        		break;
    	};
    });

    this.socket.on('bad', function(message) {
        console.log('bad', message);
        switch(message.request){
        	case 'iam':
        	case 'login':
        		pages.set('login');
        		break;
        };
    });

    this.socket.on('roomInfo', function(message) {
    	console.log('roomInfo', message);
    	room.update(message);
    	switch(message.type){
    		case Room.RT_LOBBY:
    			pages.set('lobby');
    			break;
    		case Room.RT_TABLE:
    			pages.set('room');
    			break;
    	};
    	if (room.messages>room.messagesloaded) {
    		self.loadMessage();
    	}
    });

    this.socket.on('roomMessages', function(message) {
    	console.log(message);
    	room.messagesloaded = message.to;
    	room.messageloading = false;
    	for (i in message.texts)
			document.querySelector('#log').innerHTML += '<span class="in"><span class="time">'+(new Date(message.texts[i].time)).toLocaleTimeString()+'</span><span class="user">'+message.texts[i].name+'</span>: '+message.texts[i].text+'</span><br>';
		document.querySelector('#log').scrollTop = document.querySelector('#log').scrollHeight;
    });
};

Client.prototype.time = function() { return (new Date).toLocaleTimeString() };


Client.prototype.enter = function() {
    if (!this.connected())
    	pages.set('noconnection');

    if (player.exist())
    	this.socket.emit('iam', player.iam());
    else
    	pages.set('login');
};

Client.prototype.enterLogin = function(nickName, pass) {
    if (!this.connected())
    	pages.set('noconnection');

    player.nickName = nickName;
    this.socket.emit('login', {'name': nickName, 'pass': pass});
};

Client.prototype.sendMessage = function(text) {
	var message = player.iam();
	message.action = Room.RA_MESSAGE;
	message.text = text;
	this.socket.emit('room', message);	
};

Client.prototype.getRoomInfo = function() {
	var message = player.iam();
	message.action = Room.RA_INFO;
	this.socket.emit('room', message);
};

Client.prototype.createRoom = function() {
	var message = player.iam();
	message.action = Room.RA_NEW;
	this.socket.emit('room', message);
};

Client.prototype.joinRoom = function(roomName) {
	var message = player.iam();
	message.name = roomName;
	message.action = Room.RA_JOIN;
	this.socket.emit('room', message);
};

Client.prototype.exitRoom = function() {
	var message = player.iam();
	if (room.owner == player.nickName)
		message.action = Room.RA_CLOSE
	else
		message.action = Room.RA_LEAVE;
	this.socket.emit('room', message);
};

Client.prototype.loadMessage = function() {
	var message = player.iam();
	room.loadMessage(message);
	this.socket.emit('room', message);
};

Client.prototype.logout = function() {
	console.log('logout');
	location.reload(true);
};