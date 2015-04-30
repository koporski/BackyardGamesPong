/** Tworzenie Canvas **/
var canvas = document.createElement("canvas");
document.body.appendChild(canvas);

/** Obsługa klawiszy **/
upKey = false;
downKey = false;
wKey = false;
sKey = false;

function onKeyDown(evt) {
    if (evt.keyCode == 87) wKey = true;
    else if (evt.keyCode == 83) sKey = true;
    else if (evt.keyCode == 38) upKey = true;
    else if (evt.keyCode == 40) downKey = true;
}

function onKeyUp(evt) {
    if (evt.keyCode == 87) wKey = false;
    else if (evt.keyCode == 83) sKey = false;
    else if (evt.keyCode == 38) upKey = false;
    else if (evt.keyCode == 40) downKey = false;
}

/** Nasłuchiwanie klawiszy **/
$(document).keydown(onKeyDown);
$(document).keyup(onKeyUp);

/** zimienne globalne  :< **/
var W = window.innerWidth; // dodano 'var'
var H = window.innerHeight; // dodano 'var'

canvas.width = W;
canvas.height = H;

// zmienne przechowujace punktacje
var leftScore = 0;
var rightScore = 0;
var pallet_height = H/6; //wysokość paletki
var pallet_width = 10; //szerrokość paletki
//pozycje paletek
var player1_position_x = 20;
var player2_position_x = W-pallet_width-20;
var player1_position_y = H/2 - pallet_height/2;
var player2_position_y = H/2 - pallet_height/2;

var pallet_hit_sound = new Howl({urls: ['http://vorb.pl/GameProjects/Pong/includes/sounds/pallet_hit.wav']});
var wall_hit_sound = new Howl({urls: ['http://vorb.pl/GameProjects/Pong/includes/sounds/wall_hit.wav']});
var ctx;

var ball = new Ball(W/2, H/2, pallet_height/8, 8); 

function init() {
    ctx = $('canvas')[0].getContext("2d");
    return setInterval(draw, 10);
}

/** o Hipolicie, stoję przy funkcji, czy przy monolicie? **/
function draw() {
    ctx.clearRect(0,0,W,H);

    ctx.beginPath();
    ctx.moveTo(W/2,0);
    ctx.lineTo(W/2,H);
    ctx.strokeStyle = "white";
    ctx.stroke();

    ball.draw();

    ctx.fillStyle = "rgb(230,230,230)";
    ctx.fillRect(player1_position_x,player1_position_y,pallet_width,pallet_height);

    ctx.fillStyle = 'rgb(230,230,230)';
    ctx.fillRect(player2_position_x, player2_position_y,pallet_width,pallet_height);

    drawScore();

    if (wKey && player1_position_y > 0) player1_position_y -= 10;
    if (sKey && player1_position_y < H-pallet_height ) player1_position_y += 10;


    if (upKey && player2_position_y > 0) player2_position_y -= 10;
    if (downKey && player2_position_y < H-pallet_height) player2_position_y += 10;

    //ruch piłki
    ball.move();

    //odbicie od ścian
    if(ball.position_y + ball.radius > H) {
        ball.speed_y = - ball.speed_y;
        ball.position_y = H - ball.radius;
        wall_hit_sound.play();
    }
    else if(ball.position_y - ball.radius < 0) {
        ball.speed_y = - ball.speed_y;
        ball.position_y = ball.radius;
        wall_hit_sound.play();
    }
// zmienilem to! -M
    if(ball.position_x - ball.radius < 0){
        ball.reset();
        rightScore ++;
        chlosta();
    }
    if(ball.position_x - ball.radius > W) {
      ball.reset();
      leftScore ++;
      chlosta();
    }

    //odbicia od zewnętrzych krawędzi paletek
    if(ball.position_y >= player1_position_y && ball.position_y  <= player1_position_y + pallet_height && ball.position_x > player1_position_x + pallet_width) {
        if(Math.abs(ball.position_x -(player1_position_x + pallet_width)) <= ball.radius) {
            ball.position_x = player1_position_x + pallet_width + ball.radius;
            ball.speed_x = -ball.speed_x;
            pallet_hit_sound.play();
        }
    }
    if(ball.position_y >= player2_position_y && ball.position_y  <= player2_position_y + pallet_height && ball.position_x < player2_position_x) {
        if(Math.abs((player2_position_x - ball.position_x)) <= ball.radius) {
            ball.speed_x = -ball.speed_x;
            ball.position_x = player2_position_x - ball.radius;
            pallet_hit_sound.play();
        }
    }
    //odbicie od dolnych krawędzi paletek
    if(ball.position_x - ball.radius <= player1_position_x + pallet_width && ball.position_x >= player1_position_x && ball.position_y > player1_position_y + pallet_height) {
        if(Math.abs(ball.position_y - (player1_position_y + pallet_height)) <= ball.radius) {
            ball.speed_y = -ball.speed_y;
            ball.speed_x = -ball.speed_x;
            ball.position_y = player1_position_y + pallet_height + ball.radius;
            pallet_hit_sound.play();
        }
    }
    if(ball.position_x + ball.radius >= player2_position_x && ball.position_x <= player2_position_x + pallet_width && ball.position_y > player2_position_y + pallet_height ) {
        if(Math.abs(ball.position_y - (player2_position_y + pallet_height)) <= ball.radius) {
            ball.speed_y = -ball.speed_y;
            ball.speed_x = -ball.speed_x;
            ball.position_y = player2_position_y + pallet_height + ball.radius;
            pallet_hit_sound.play();
        }
    }
    if(ball.position_x - ball.radius <= player1_position_x + pallet_width && ball.position_x < player1_position_x && ball.position_y > player1_position_y + pallet_height) {
        if(Math.abs(ball.position_y - (player1_position_y + pallet_height)) <= ball.radius) {
            ball.speed_y = -ball.speed_y;
            ball.position_y = player1_position_y + pallet_height + ball.radius;
            pallet_hit_sound.play();
        }
    }
    if(ball.position_x + ball.radius >= player2_position_x + pallet_width && ball.position_x > player2_position_x && ball.position_y > player2_position_y + pallet_height ) {
        if(Math.abs(ball.position_y - (player2_position_y + pallet_height)) <= ball.radius) {
            ball.speed_y = -ball.speed_y;
            ball.position_y = player2_position_y + pallet_height + ball.radius;
            pallet_hit_sound.play();
        }
    }


    //odbicie od górnych krawędzi paletek
    if(ball.position_x - ball.radius <= player1_position_x + pallet_width && ball.position_x >= player1_position_x  && ball.position_y < player1_position_y) {
        if(Math.abs(player1_position_y - ball.position_y) <= ball.radius) {
            ball.speed_y = -ball.speed_y;
            ball.speed_x = -ball.speed_x;
            ball.position_y = player1_position_y - ball.radius;
            pallet_hit_sound.play();
        }
    }
    if(ball.position_x + ball.radius >= player2_position_x && ball.position_x <= player2_position_x + pallet_width && ball.position_y < player2_position_y) {
        if(Math.abs(player2_position_y - ball.position_y) <= ball.radius) {
            ball.speed_y = -ball.speed_y;
            ball.speed_x = -ball.speed_x;
            ball.position_y = player2_position_y - ball.radius;
            pallet_hit_sound.play();
        }
    }
    if(ball.position_x - ball.radius <= player1_position_x + pallet_width && ball.position_x < player1_position_x  && ball.position_y < player1_position_y) {
        if(Math.abs(player1_position_y - ball.position_y) <= ball.radius) {
            ball.speed_y = -ball.speed_y;
            ball.position_y = player1_position_y - ball.radius;
            pallet_hit_sound.play();
        }
    }
    if(ball.position_x + ball.radius >= player2_position_x + pallet_width && ball.position_x > player2_position_x && ball.position_y < player2_position_y) {
        if(Math.abs(player2_position_y - ball.position_y) <= ball.radius) {
            ball.speed_y = -ball.speed_y;
            ball.position_y = player2_position_y - ball.radius;
            pallet_hit_sound.play();
        }
    }

}

/** Moj kod - M **/
//zamknięte do refaktoryzacji
function computeScore () {

}

function drawScore () {
  ctx.font = 'bold 24px sans-serif';
  ctx.fillStyle = 'white';
  //dobry Boże, niech ktoś to naprawi - M
  ctx.fillText(leftScore, W/50, H/20);
  ctx.fillText(rightScore, W-W/45, H/20);
}
function chlosta() {
    if(rightScore > 3 || leftScore >3){
      alert('Scierwisz');
      ball.reset();
      leftScore = 0;
      rightScore = 0;
    }
  }

function Ball(initial_position_x, initial_position_y, radius, initial_speed) {
    this.position_x = initial_position_x - radius;
    this.position_y = initial_position_y - radius;
    this.radius = radius;
    var kat = Math.random()*180/Math.PI;
    this.speed_x = initial_speed * Math.cos(kat);
    this.speed_y = initial_speed * Math.sin(kat);
    
    var img = new Image();
    img.src = "includes/img/volleyball.png";

    this.draw = function() {
        ctx.drawImage(img, this.position_x - radius, this.position_y - radius, 2*radius, 2*radius);
    }

    this.move = function() {
         this.position_x +=  this.speed_x;
         this.position_y +=  this.speed_y;
    }

    this.reset = function() {
        this.position_x = initial_position_x - radius;
        this.position_y = initial_position_y - radius;
        kat = Math.random()*180/Math.PI;
        this.speed_x = initial_speed * Math.cos(kat);
        this.speed_y = initial_speed * Math.sin(kat);
    }    

}
$('.start_button').click(function(){
    $(this).fadeOut();
    $('img.logo').fadeOut();
    init();
});


