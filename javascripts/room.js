Room = function() {
	this.type = Room.RT_UNKNOWN;
	this.roomName = 'none';
	this.messagesloaded = 0;
	this.messages = 0;
	this.messageloading = false;
};

Room.RT_UNKNOWN = 0;
Room.RT_LOBBY = 1;
Room.RT_TABLE = 2;

Room.RA_INFO = 0;
Room.RA_NEW = 1;
Room.RA_JOIN = 2;
Room.RA_LEAVE = 3;
Room.RA_CLOSE = 4;
Room.RA_MESSAGE = 5;
Room.RA_GETMESSAGES = 6;

Room.prototype.update = function(roomInfo) {
	this.type = roomInfo.type;
	this.roomName = roomInfo.name;
	this.owner = roomInfo.owner;
	this.messages = roomInfo.messages;
};

Room.prototype.loadMessage = function(message) {
	var self = this;
	if(!this.messageloading) {
		this.messageloading = true;
		this.timeout = setTimeout(function () { self.messageloading = false;}, 3000);
		message.action = Room.RA_GETMESSAGES;
		message.from = this.messagesloaded;
		message.to = this.messages;
	}
}

Room.prototype.updateMessage = function(message) {
	clearTimeout(this.timeout);
	this.messageloading = false;
}