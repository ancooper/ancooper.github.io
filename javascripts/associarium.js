// Создаем текст сообщений для событий
/*
strings = {
    'connected': '[sys][time]%time%[/time]: Вы успешно соединились к сервером как [user]%name%[/user].[/sys]',
    'userJoined': '[sys][time]%time%[/time]: Пользователь [user]%name%[/user] присоединился к чату.[/sys]',
    'messageSent': '[out][time]%time%[/time]: [user]%name%[/user]: %text%[/out]',
    'messageReceived': '[in][time]%time%[/time]: [user]%name%[/user]: %text%[/in]',
    'userSplit': '[sys][time]%time%[/time]: Пользователь [user]%name%[/user] покинул чат.[/sys]'
};

document.querySelector('#log').innerHTML += strings[msg.event].replace(/\[([a-z]+)\]/g, '<span class="$1">').replace(/\[\/[a-z]+\]/g, '</span>').replace(/\%time\%/, msg.time).replace(/\%name\%/, msg.name).replace(/\%text\%/, unescape(msg.text).replace('<', '&lt;').replace('>', '&gt;')) + '<br>';
document.querySelector('#log').scrollTop = document.querySelector('#log').scrollHeight;

*/

window.onload = function() {
    client = new Client();
    pages = new Pages(client, 'splash');
    room = new Room();
    player = new Player(client);

    client.connect();
};



window.onload_old = function() {


    socket.on('connect', function () {
        

        logoutPlayer = function(){
            Player.nickname = undefined;
            document.querySelector('#inputnick').value = '';
            Player.save();
            socket.emit('logout');
        };
        document.querySelector('#logout').onclick = function(){
            logoutPlayer();
        };

    });
};
