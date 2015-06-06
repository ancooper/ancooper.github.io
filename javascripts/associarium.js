// Создаем текст сообщений для событий
/*
strings = {
    'connected': '[sys][time]%time%[/time]: Вы успешно соединились к сервером как [user]%name%[/user].[/sys]',
    'userJoined': '[sys][time]%time%[/time]: Пользователь [user]%name%[/user] присоединился к чату.[/sys]',
    'messageSent': '[out][time]%time%[/time]: [user]%name%[/user]: %text%[/out]',
    'messageReceived': '[in][time]%time%[/time]: [user]%name%[/user]: %text%[/in]',
    'userSplit': '[sys][time]%time%[/time]: Пользователь [user]%name%[/user] покинул чат.[/sys]'
};
*/

window.onload = function() {
    time = function() { return (new Date).toLocaleTimeString() };
    client = new Client();
    pages = new Pages(client, 'splash');
    room = new Room();
    player = new Player(client);

    client.connect();
};








window.onload_old = function() {
    sendLogin = function(nick){
        socket.emit('login', {'value': nick});
    };

    Pages.hideall();
    Pages.onshow = function(page) {

    }
    Pages.set('splash');

    Player.load();

    socket = io.connect('http://ancooper.ddns.net:80/', {
            'force new connection': true,
            'resource': 'path/to/socket.io'});

    socket.on('connect', function () {
        

        socket.on('message', function (msg) {
            document.querySelector('#log').innerHTML += strings[msg.event].replace(/\[([a-z]+)\]/g, '<span class="$1">').replace(/\[\/[a-z]+\]/g, '</span>').replace(/\%time\%/, msg.time).replace(/\%name\%/, msg.name).replace(/\%text\%/, unescape(msg.text).replace('<', '&lt;').replace('>', '&gt;')) + '<br>';
            document.querySelector('#log').scrollTop = document.querySelector('#log').scrollHeight;
        });

        socket.on('loginOk', function(msg) {
            Player.token = msg.token;
            Pages.set('lobby');
        });

        socket.on('logoutOk', function() {
            location.reload(true);
        });

        socket.on('log', function(msg) {
            console.log(time(), msg);
        })

        sendMessage = function(){
            socket.send(escape(document.querySelector('#input').value));
            document.querySelector('#input').value = '';
        };
        document.querySelector('#input').onkeypress = function(e) {
            if (e.which == '13') sendMessage();
        };
        document.querySelector('#send').onclick = function() {
            sendMessage();
        };

        loginPlayer = function(){
            var nick = escape(document.querySelector('#inputnick').value);
            Player.nickname = nick;
            Player.save();
            sendLogin(Player.nickname);
        };
        document.querySelector('#inputnick').onkeypress = function(e) {
            if (e.which == '13') loginPlayer();
        };
        document.querySelector('#login').onclick = function(){
            loginPlayer();
        };

        logoutPlayer = function(){
            Player.nickname = undefined;
            document.querySelector('#inputnick').value = '';
            Player.save();
            socket.emit('logout');
        };
        document.querySelector('#logout').onclick = function(){
            logoutPlayer();
        };

        createRoom = function(){
            socket.emit('newRoom');
            Pages.set('Room');
        };
        document.querySelector('#newroom').onclick = function(){
            createRoom();
        };


    });
};
