// Создаем текст сообщений для событий
strings = {
    'connected': '[sys][time]%time%[/time]: Вы успешно соединились к сервером как [user]%name%[/user].[/sys]',
    'userJoined': '[sys][time]%time%[/time]: Пользователь [user]%name%[/user] присоединился к чату.[/sys]',
    'messageSent': '[out][time]%time%[/time]: [user]%name%[/user]: %text%[/out]',
    'messageReceived': '[in][time]%time%[/time]: [user]%name%[/user]: %text%[/in]',
    'userSplit': '[sys][time]%time%[/time]: Пользователь [user]%name%[/user] покинул чат.[/sys]'
};

window.onload = function() {
    Cookie.dump();
    Player.refresh = function() {
        if (this.nickname){
            document.querySelector('#nickname').innerHTML = this.nickname;
            document.querySelector('#nickname').style.display = '';
            document.querySelector('#logout').style.display = '';

            document.querySelector('#inputnick').style.display = 'none';
            document.querySelector('#login').style.display = 'none';
        } else {
            document.querySelector('#nickname').style.display = 'none';
            document.querySelector('#logout').style.display = 'none';

            document.querySelector('#inputnick').style.display = '';
            document.querySelector('#login').style.display = '';            
        }
    }
    Player.load();

    socket = io.connect('http://ancooper.ddns.net:80/', {
            'force new connection': true,
            'resource': 'path/to/socket.io'});

    socket.on('connect', function () {
        socket.on('message', function (msg) {
            // Добавляем в лог сообщение, заменив время, имя и текст на полученные
            document.querySelector('#log').innerHTML += strings[msg.event].replace(/\[([a-z]+)\]/g, '<span class="$1">').replace(/\[\/[a-z]+\]/g, '</span>').replace(/\%time\%/, msg.time).replace(/\%name\%/, msg.name).replace(/\%text\%/, unescape(msg.text).replace('<', '&lt;').replace('>', '&gt;')) + '<br>';
            // Прокручиваем лог в конец
            document.querySelector('#log').scrollTop = document.querySelector('#log').scrollHeight;
        });
        // При нажатии <Enter> или кнопки отправляем текст
        document.querySelector('#input').onkeypress = function(e) {
            if (e.which == '13') {
                socket.send(escape(document.querySelector('#input').value));
                document.querySelector('#input').value = '';
            }
        };
        document.querySelector('#send').onclick = function() {
            socket.send(escape(document.querySelector('#input').value));
            document.querySelector('#input').value = '';
        };
        document.querySelector('#inputnick').onkeypress = function(e) {
            if (e.which == '13') {
                var nick = escape(document.querySelector('#inputnick').value);
                Player.nickname = nick;
                Player.save();
            }
        };
        document.querySelector('#login').onclick = function(){
            var nick = escape(document.querySelector('#inputnick').value);
            Player.nickname = nick;
            Player.save();
        };
        document.querySelector('#logout').onclick = function(){
            Player.nickname = undefined;
            Player.save();
        };
    });
};