window.onload=function() {

    var SIZE=100;
    var chip_radius=5;
    var PLAYER_DEFAULT_RADIUS=30;
    var PLAYER_PLUS_RADIUS=1;
    var STEP_PLUS=0.5;
    var STEP_MINUS=-0.5;

    var width = window.innerWidth;
    var height = window.innerHeight;

    var canvas = document.getElementById('canvas');
    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);

    var ctx = canvas.getContext('2d');

    var mouseX = 0;
    var mouseY = 0;

    function setMousePosition(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        //console.log(mouseX);
        //console.log(mouseY);
    }

    var Chip=function(color,x,y, radius){       // класс фишка на поле

        this.color=color;
        this.x =x;
        this.y =y;
        this.radius=radius;
    }
    var array_chips=[]; // массив фишек на поле
    var array_ball_player=[];
    var player1;        // объявление переменной, объект шара игрока (в 1 версии он только 1)

    function init_array_chips() { // генерация координат фишек на поле

        for (var i = 0; i < SIZE; i++) {
            var r = Math.floor(Math.random() * (256));
            var g = Math.floor(Math.random() * (256));
            var b = Math.floor(Math.random() * (256));
            var c = '#' + r.toString(16) + g.toString(16) + b.toString(16);
            var new_chip=new Chip(c,Math.random() * (width - 5) + 5,Math.random() * (height - 5) + 5, chip_radius);
            array_chips.push(new_chip);
        }
    }

    function init_ball_player() {       // создание объекта шара игрока
        player1 = new BallPlayer(1, 1, PLAYER_DEFAULT_RADIUS, 'green', 'Rinat');
    }


    function BallPlayer(x, y, radius, color, nickname) { // класс шар игрока

        this.x = Math.random() * (width - 5) + 5;
        this.y = Math.random() * (height - 5);
        this.radius = radius;
        this.score=0;
        this.nickname = nickname;
        this.color = color;

        this.appear = function () {     // метод отобразить шар игрока на поле
            ctx.fillStyle = this.color;
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
            ctx.fill();

        };

        /*this.disappear = function () {
            ctx.fillStyle = '#00ffffff';
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
            ctx.fill();

        };*/

        this.movement = function (deltaX, deltaY) { // метод движения шара по полю, дельта может быть как положительной так и отрицательной, смотря куда двигаться надо

            this.x=this.x+deltaX;
            this.y=this.y+deltaY;

        };

        this.checkmass=function(){     // метод проверки пересечения шара игрока с фишками на поле

            for(var i=0;i<array_chips.length;i++){
                var katetX=array_chips[i].x-this.x;
                var katetY=array_chips[i].y-this.y;
                var result=Math.sqrt(Math.pow(katetX,2)+Math.pow(katetY,2));
                //console.log(result);
                if(result<this.radius){
                    array_chips.splice(i,1);            // если игрок съел фишку, то ее объект УДАЛЯЕТСЯ из массива фишек
                    this.score++;                       // увеличиваем количес очков игрока
                    this.radius+=PLAYER_PLUS_RADIUS;    // увеличиваем радиус шара игрока
                    //console.log(this.score);
                }
            }
        }

    };

    /*function moveObject(key){
        switch(key.keyCode){
            case 37:
                player1.movement(STEP_MINUS, 0);
                //console.log(player1.x+','+player1.y);
                //alert('vlevo!');
                break;
            case 38:
                //alert('vverh!');
                player1.movement(0, STEP_MINUS);
                break;
            case 39:
                player1.movement(STEP_PLUS, 0);
                //alert('vpravo!');
                break;
            case 40:
                //alert('vniz!');
                player1.movement(0, STEP_PLUS);
                break;
            default:
                //alert('unknown!');
                break;
        }

    };*/

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

    function moveToMousePosition() {    // перемещаем шар игрока ближе к координатам мыши
        //console.log(mouseX);
        //console.log(mouseY);
        if(player1.x<mouseX){player1.movement(STEP_PLUS, 0); /* vpravo */ }
        if(player1.y<mouseY){player1.movement(0, STEP_PLUS); /* vverh */ }
        if(player1.x>mouseX){player1.movement(STEP_MINUS, 0); /* vlevo */ }
        if(player1.y>mouseY){player1.movement(0, STEP_MINUS); /* vniz */ }
    }

    function draw() {

        fill_array_chips();
        player1.appear();
        //player1.score=0;
        player1.checkmass();
        moveToMousePosition();
        requestAnimationFrame(draw);    // частота смены кадров 60 fps (бывает 309 fps, зависит от браузера)
    }

    init_array_chips();
    init_ball_player();
    //addEventListener("keydown", moveObject);  // можно перемещать не за мышкой, а по стрелкам на клавиатуре
    canvas.addEventListener("mousemove", setMousePosition, false);
    draw();
}