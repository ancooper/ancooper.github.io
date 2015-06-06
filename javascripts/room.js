Room = function() {
	this.type = Room.RT_UNKNOWN;
	this.roomName = 'none';
};

Room.RT_UNKNOWN = 0;
Room.RT_LOBBY = 1;
Room.RT_TABLE = 2;

Room.RA_INFO = 0;
Room.RA_NEW = 1;
Room.RA_JOIN = 2;
Room.RA_LEAVE = 3;
Room.RA_CLOSE = 4;

Room.prototype.update = function(roomInfo) {
	this.type = roomInfo.type;
	this.roomName = roomInfo.name;
	this.owner = roomInfo.owner;
};