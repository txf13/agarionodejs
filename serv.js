
const WebSocket=require ('ws');

var WebSocketServer = new require('ws');

// подключенные клиенты
var clients = {};

var width=600;
var height=600;
var PLAYER_DEFAULT_RADIUS=15;
var CHIP_DEFAULT_RADIUS=5;
var SIZE=100;

function getRandomColor() {

    var r = Math.floor(Math.random() * (256));
    var g = Math.floor(Math.random() * (256));
    var b = Math.floor(Math.random() * (256));
    var c = '#' + r.toString(16) + g.toString(16) + b.toString(16);
    return c;
}

function Player(id, uid, radius, color ){
    this.id=id;
    this.uid=uid;
    this.type='playerobj';
    //this.socket=socket;
    this.x = Math.random() * (width - 5) + 5;
    this.y = Math.random() * (height - 5);
    this.radius = radius;
    this.color = color;
    this.score = 0;
}

function Chip(color,x,y, radius){       // класс фишка на поле

    this.type='chipobj';
    this.color=color;
    this.x =x;
    this.y =y;
    this.radius=radius;
}

function init_array_chips() { // генерация координат фишек на поле

    for (var i = 0; i < SIZE; i++) {
        var new_chip=new Chip(getRandomColor(), Math.random() * (width - 5) + 5,Math.random() * (height - 5) + 5, CHIP_DEFAULT_RADIUS);
        array_chips.push(new_chip);
    }
}

// WebSocket-сервер на порту 3000
var webSocketServer = new WebSocketServer.Server({
    port: 3000
});
console.log('server started');

var massiv_players = []; // массив игроков на поле, наполняется по мере подключения новых игроков, вначале пустой
var array_chips=[]; // массив фишек на поле, в самом начале тут 100 элементов, которые пересылаются каждому новому подключившемуся

var id=0;   // порядковый номер подключившегося игрока, начинается с 0

init_array_chips(); // сгенерируем сразу фишки 100 шт. на поле

webSocketServer.on('connection', function(ws) {

    var uid=Math.random();
    clients[uid] = ws;      // случайно сгенерированное число - уникальный идентификатор подключившегося клиента

    var player=new Player(id,uid, PLAYER_DEFAULT_RADIUS,getRandomColor());
    id++;   // увеличиваем счетчик подключившихся (эта цифра всегда автоинкремент, даже при отключении игрока!)

    massiv_players.push(player);
    id++;

    for (var key in clients) {
        clients[key].send(JSON.stringify(massiv_players)); //отправляем массив данных об игроках новому игроку
        clients[key].send(JSON.stringify(array_chips)); //отправляем массив данных об игроках новому игроку
    }

    ws.on('message', function(message) {
        console.log('получено сообщение ' + message);
    });

    ws.on('close', function() {
            console.log('соединение закрыто uid player:' + uid);
            delete clients[uid];
            for (var i = 0; i < massiv_players.length; i++) {

                if (massiv_players[i].uid == uid) {
                    console.log('DELETED i:'+i);
                    massiv_players.splice(i, 1);
                    break;
                }
            }
            var j = 0;
            for (var key in clients) {
                console.log(j + ')обновленный массив:' + key+', ' + massiv_players.length);
                j++;
                clients[key].send(JSON.stringify(massiv_players));
            }
        }
    );

});





