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
        	case 'newRoom':
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
    	var page = message.type == Room.RT_TABLE ? 'room' : 'lobby';
    	room.update(message);
		pages.set(page);
    	pages.update(page);
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
    	this.socket.emit('iam', {'player': player.iam()});
    else
    	pages.set('login');
};

Client.prototype.enterLogin = function(nickName, pass) {
    if (!this.connected())
    	pages.set('noconnection');

    player.nickName = nickName;
    this.socket.emit('login', {'name': nickName, 'pass': pass}); //TODO:hash
};

Client.prototype.getRoomInfo = function() {
	this.socket.emit(room.type == Room.RT_TABLE ? 'room' : 'lobby', {
		'player': player.iam(),
		'action': Room.RA_INFO
	});
};

Client.prototype.sendMessage = function(text) {
	this.socket.emit('room', {
		'player': player.iam(),
		'action': Room.RA_MESSAGE,
		'text': text
	});	
};

Client.prototype.createRoom = function(settings) {
	this.socket.emit('lobby', {
		'player': player.iam(),
		'action': Room.RA_NEW,
		'settings': settings
	});
};

Client.prototype.joinRoom = function(roomName) {
	this.socket.emit('lobby', {
		'player': player.iam(),
		'action': Room.RA_JOIN,
		'name': roomName
	});
};

Client.prototype.startGame = function() {
	this.socket.emit('room', {
		'player': player.iam(),
		'action': Room.RA_START
	});
};

Client.prototype.exitRoom = function() {
	this.socket.emit('room', {
		'player': player.iam(),
		'action': room.owner == player.nickName ? Room.RA_CLOSE : Room.RA_LEAVE
	});
};

Client.prototype.loadMessage = function() {
	this.socket.emit('room', {
		'player': player.iam(),
		'action': Room.RA_GETMESSAGES,
		'params': room.loadMessageParams()
	});
};

Client.prototype.logout = function() {
	this.socket.emit('logout', { 'player': player.iam() });	
	console.log('logout');
	location.reload(true);
};