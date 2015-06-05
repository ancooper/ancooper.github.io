Player = {
	nickname: null,

	load: function() {
		this.nickname = Cookie.get('nickname');
		if (this.refresh != undefined){
			this.refresh();
		}
	},

	save: function() {
		if (this.nickname)
			Cookie.set('nickname', this.nickname, 24*30)
		else
			Cookie.unset('nickname');
		if (this.refresh != undefined){
			this.refresh();
		}		
	}
};