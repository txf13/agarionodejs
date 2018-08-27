window.onload=function() {

    /*function getRandomColor() {

        var r = Math.floor(Math.random() * (256));
        var g = Math.floor(Math.random() * (256));
        var b = Math.floor(Math.random() * (256));
        var c = '#' + r.toString(16) + g.toString(16) + b.toString(16);
        return c;
    }*/

    function Player(id, uid, radius, color,x,y){
        this.id=id;
        this.uid=uid;
        this.x=x;
        this.y=y;
        this.radius = radius;
        this.color = color;
        this.score = 0;
        this.appear = function () {     // метод отобразить шар игрока на поле
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
            ctx.fill();
        };
    };

    function Chip(color,x,y, radius){       // класс фишка на поле

        this.type='chipobj';
        this.color=color;
        this.x =x;
        this.y =y;
        this.radius=radius;
    };

    function fill_array_chips(){

        ctx.clearRect(0, 0, canvas.width, canvas.height); // вначале очищаем весь холст канвас

        for(var i=0;i<array_chips.length;i++){  // отрисовываем все фишки на поле
            var current_chip=array_chips[i];
            ctx.fillStyle = current_chip.color;
            ctx.beginPath();
            ctx.arc(current_chip.x,current_chip.y, current_chip.radius, 0, Math.PI * 2, true);
            ctx.fill();
        }

    }

    var width = window.innerWidth;
    var height = window.innerHeight;
    console.log('width:'+width+', height:'+height);
    width=600;
    height=600;

    var canvas = document.getElementById('canvas');
    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);

    var ctx = canvas.getContext('2d');

    const ws = new WebSocket('ws://localhost:3000');

    ws.onopen = () => {
        console.log('ONLINE!');
    }

    ws.onclose = () => console.log('DISCONNECTED!');

    var player;
    var massiv_players=[];
    var array_chips=[];

    ws.onmessage = response => {
        //console.log(response.data);
        console.log('получено сообщение от сервера');
        var objects=JSON.parse(response.data);
        if (objects[0].type=='playerobj') {
            massiv_players=[];
            for(var i=0;i<objects.length;i++){
                player=new Player(objects[i].id, objects[i].uid, objects[i].radius,objects[i].color,objects[i].x,objects[i].y);
                massiv_players.push(player);
            }
        }

        if (objects[0].type=='chipobj') {
            array_chips=[];
            for(var i=0;i<objects.length;i++){
                var chip=new Chip(objects[i].color, objects[i].x, objects[i].y,objects[i].radius);
                array_chips.push(chip);
            }
        }

        draw();
    };

    function draw(){
        ctx.fillStyle = 'rgba(0,0,0,0)'; // or 'transparent'
        ctx.fillStroke= 'rgba(0,0,0,0)'; // or 'transparent'
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        fill_array_chips();

        for(var i=0;i<massiv_players.length;i++) {
            console.log(i+') krasim color:'+massiv_players[i].color);
            massiv_players[i].appear();
        }
    }
}



//this.socket=socket;
//this.x = Math.random() * (width - 5) + 5;
//this.y = Math.random() * (height - 5);

//fill_array_players();

/*var pid=objects.length-1;
          player=new Player(objects[pid].id,objects[pid].radius,objects[pid].color);
          massiv_players.push(player);*/

//player = JSON.parse(response.data);
//player=new Player(object.id,object.radius,object.color);


//ctx.fillStyle = 'rgba(0,0,0,0)'; // or 'transparent'
//ctx.clearRect(0, 0, canvas.width, canvas.height);


//ctx.fillStroke = this.color;
// ctx.beginPath !!!!!!
//ctx.stroke();

//ctx.arc(this.x, this.y, this.radius, 1, Math.PI * 2, true);
//ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);

//console.log(this.id+') QQQQQQQQ:'+this.color);