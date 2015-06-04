Player = {
	nickname: null,

	load: function() {
		this.nickname = Cookie.get('nickname');
		if (this.refresh != undefined){
			this.refresh();
		}
	},

	save: function() {
		Cookie.set('nickname', this.nickname, 24*30);
		console.log('save '+this.nickname);
		if (this.refresh != undefined){
			this.refresh();
		}		
	}
};