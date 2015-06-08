Room = function() {
	this.type = Room.RT_UNKNOWN;
	this.roomName = 'none';
	this.messagesloaded = 0;
	this.messages = 0;
	this.messageloading = false;
};

Room.RS_UNKNOWN = 0;
//Room.RS_SETUP = 1;
Room.RS_INVITE = 2;
Room.RS_START = 4;
Room.RS_DISTRIBUTION = 8;
Room.RS_PRESENT = 16;
Room.RS_BET = 32;
Room.RS_VOTE = 64;
Room.RS_COUNT = 128;
Room.RS_FINISH = 256;
Room.RS_CLOSED = 512;
Room.RS_GAME = 508;

Room.RT_UNKNOWN = 0;
Room.RT_LOBBY = 1;
Room.RT_TABLE = 2;

Room.RA_NEW = 1;
Room.RA_JOIN = 2;
Room.RA_LEAVE = 3;
Room.RA_CLOSE = 4;
Room.RA_MESSAGE = 5;
Room.RA_GETMESSAGES = 6;
Room.RA_INVITE = 7;
Room.RA_INFO = 8;
Room.RA_START = 9;

Room.StateToString = function(state) {
	switch(state) {
		case Room.RS_INVITE:
			return 'Invite players';
		case Room.RS_UNKNOWN:
		default:
	}
	return 'Unknown state';
};

Room.prototype.stateToString = function() {
	return Room.StateToString(this.state);
}

Room.prototype.update = function(roomInfo) {
	this.type = roomInfo.type;
	this.state = roomInfo.state;
	this.roomName = roomInfo.name;
	this.owner = roomInfo.owner;
	this.messages = roomInfo.messages;
};

Room.prototype.loadMessageParams = function() {
	var self = this;
	if(!this.messageloading) {
		this.messageloading = true;
		this.timeout = setTimeout(function () { self.messageloading = false;}, 3000);
		return {'from': this.messagesloaded, 'to': this.messages};
	}
}

Room.prototype.updateMessage = function(message) {
	clearTimeout(this.timeout);
	this.messageloading = false;
}