Pages = function(client, startPage) {
	this.client = client;
    this.current = undefined;
    this.hideAll();
    this.set(startPage);

    document.querySelector('#reload').onclick = function() { location.reload(true) };
};

Pages.prototype.set = function(page) {
    this.hide(this.current);
    this.current = page;
    this.show(this.current);
};

Pages.prototype.hide = function(page) {
    if (page)
        document.querySelector('#page'+page).style.display = 'none';
};

Pages.prototype.show = function(page) {
    if (page)
        document.querySelector('#page'+page).style.display = 'block';
    if (this.onShow)
        this.onShow(page);
};

Pages.prototype.hideAll = function() {
    var pages = document.querySelectorAll('div.page');
    for(i=0; i<pages.length; i++)
        pages[i].style.display = 'none';
};

Pages.prototype.onShow = function(page) {
	var self = this;
    switch(page){
        case 'splash':
            splash = setTimeout(function(){
                self.skipSplash();
            }, 5000);
            document.querySelector('#skip').onclick = function(){
                clearTimeout(splash);
                self.skipSplash();
            };
            break;

        case 'login':
        	document.querySelector('#inputnick').value = '';
			document.querySelector('#inputnick').onkeypress = function(e) { if (e.which == '13') self.enterLogin() };
			document.querySelector('#login').onclick = function(){ self.enterLogin() };
            break;

        case 'lobby':
            if (player.nickName)
                document.querySelector('#nickname').innerHTML = player.nickName;
            document.querySelector('#newroom').onclick = function(){ self.newRoom() };
            break;

    	case 'room':
    		document.querySelector('#exitroom').onclick = function(){ self.exitRoom() };
    		break;
    }
};

Pages.prototype.skipSplash = function() {
	client.enter();
};

Pages.prototype.enterLogin = function() {
	var nickName = escape(document.querySelector('#inputnick').value);
	var pass = escape(''); // <--hash;
	client.enterLogin(nickName, pass);
};

Pages.prototype.newRoom = function() {
	client.createRoom();
};

Pages.prototype.joinRoom = function(roomName) {
	client.joinRoom(roomName);
};

Pages.prototype.exitRoom = function() {
	client.exitRoom();
};