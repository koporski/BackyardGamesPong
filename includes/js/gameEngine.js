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

// zmienilem pallet na paddle - M
var paddle_height = H/6; //wysokość paletki
var paddle_width = 10; //szerrokość paletki

var paddle_hit_sound = new Howl({urls: ['http://vorb.pl/GameProjects/Pong/includes/sounds/paddle_hit.wav']});
var wall_hit_sound = new Howl({urls: ['http://vorb.pl/GameProjects/Pong/includes/sounds/wall_hit.wav']});
var ctx;

//wywolania obiektow
var ball = new Ball(W/2, H/2, paddle_height/8, 8);
var leftPaddle = new Paddle(20, H/2 - paddle_height/2, paddle_width, paddle_height);
var rightPaddle = new Paddle(W-paddle_width-20, H/2 - paddle_height/2, paddle_width, paddle_height);

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
    drawScore();
    leftPaddle.draw();
    rightPaddle.draw();


    if (wKey && leftPaddle.position_y > 0)leftPaddle.position_y -= 10;
    if (sKey && leftPaddle.position_y < H-paddle_height ) leftPaddle.position_y += 10;


    if (upKey && rightPaddle.position_y > 0) rightPaddle.position_y -= 10;
    if (downKey && rightPaddle.position_y < H-paddle_height) rightPaddle.position_y += 10;

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
    if(ball.position_y >= leftPaddle.position_y && ball.position_y  <= leftPaddle.position_y + paddle_height && ball.position_x > leftPaddle.position_x + paddle_width) {
        if(Math.abs(ball.position_x -(leftPaddle.position_x + paddle_width)) <= ball.radius) {
            ball.position_x = leftPaddle.position_x + paddle_width + ball.radius;
            ball.speed_x = -ball.speed_x;
            paddle_hit_sound.play();
        }
    }
    if(ball.position_y >= rightPaddle.position_y && ball.position_y  <= rightPaddle.position_y + paddle_height && ball.position_x < rightPaddle.position_x) {
        if(Math.abs((rightPaddle.position_x - ball.position_x)) <= ball.radius) {
            ball.speed_x = -ball.speed_x;
            ball.position_x = rightPaddle.position_x - ball.radius;
            paddle_hit_sound.play();
        }
    }
    //odbicie od dolnych krawędzi paletek
    if(ball.position_x - ball.radius <= leftPaddle.position_x + paddle_width && ball.position_x >= leftPaddle.position_x && ball.position_y > leftPaddle.position_y + paddle_height) {
        if(Math.abs(ball.position_y - (leftPaddle.position_y + paddle_height)) <= ball.radius) {
            ball.speed_y = -ball.speed_y;
            ball.speed_x = -ball.speed_x;
            ball.position_y = leftPaddle.position_y + paddle_height + ball.radius;
            paddle_hit_sound.play();
        }
    }
    if(ball.position_x + ball.radius >= rightPaddle.position_x && ball.position_x <= rightPaddle.position_x + paddle_width && ball.position_y > rightPaddle.position_y + paddle_height ) {
        if(Math.abs(ball.position_y - (rightPaddle.position_y + paddle_height)) <= ball.radius) {
            ball.speed_y = -ball.speed_y;
            ball.speed_x = -ball.speed_x;
            ball.position_y = rightPaddle.position_y + paddle_height + ball.radius;
            paddle_hit_sound.play();
        }
    }
    if(ball.position_x - ball.radius <= leftPaddle.position_x + paddle_width && ball.position_x < leftPaddle.position_x && ball.position_y > leftPaddle.position_y + paddle_height) {
        if(Math.abs(ball.position_y - (leftPaddle.position_y + paddle_height)) <= ball.radius) {
            ball.speed_y = -ball.speed_y;
            ball.position_y = leftPaddle.position_y + paddle_height + ball.radius;
            paddle_hit_sound.play();
        }
    }
    if(ball.position_x + ball.radius >= rightPaddle.position_x + paddle_width && ball.position_x > rightPaddle.position_x && ball.position_y > rightPaddle.position_y + paddle_height ) {
        if(Math.abs(ball.position_y - (rightPaddle.position_y + paddle_height)) <= ball.radius) {
            ball.speed_y = -ball.speed_y;
            ball.position_y = rightPaddle.position_y + paddle_height + ball.radius;
            paddle_hit_sound.play();
        }
    }


    //odbicie od górnych krawędzi paletek
    if(ball.position_x - ball.radius <= leftPaddle.position_x + paddle_width && ball.position_x >= leftPaddle.position_x  && ball.position_y < leftPaddle.position_y) {
        if(Math.abs(leftPaddle.position_y - ball.position_y) <= ball.radius) {
            ball.speed_y = -ball.speed_y;
            ball.speed_x = -ball.speed_x;
            ball.position_y = leftPaddle.position_y - ball.radius;
            paddle_hit_sound.play();
        }
    }
    if(ball.position_x + ball.radius >= rightPaddle.position_x && ball.position_x <= rightPaddle.position_x + paddle_width && ball.position_y < rightPaddle.position_y) {
        if(Math.abs(rightPaddle.position_y - ball.position_y) <= ball.radius) {
            ball.speed_y = -ball.speed_y;
            ball.speed_x = -ball.speed_x;
            ball.position_y = rightPaddle.position_y - ball.radius;
            paddle_hit_sound.play();
        }
    }
    if(ball.position_x - ball.radius <= leftPaddle.position_x + paddle_width && ball.position_x < leftPaddle.position_x  && ball.position_y < leftPaddle.position_y) {
        if(Math.abs(leftPaddle.position_y - ball.position_y) <= ball.radius) {
            ball.speed_y = -ball.speed_y;
            ball.position_y = leftPaddle.position_y - ball.radius;
            paddle_hit_sound.play();
        }
    }
    if(ball.position_x + ball.radius >= rightPaddle.position_x + paddle_width && ball.position_x > rightPaddle.position_x && ball.position_y < rightPaddle.position_y) {
        if(Math.abs(rightPaddle.position_y - ball.position_y) <= ball.radius) {
            ball.speed_y = -ball.speed_y;
            ball.position_y = rightPaddle.position_y - ball.radius;
            paddle_hit_sound.play();
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

  function Paddle(initial_position_x, initial_position_y, paddle_width, paddle_height) {
    this.position_x = initial_position_x;
    this.position_y = initial_position_y;
    this.width = paddle_width;
    this.height = paddle_height;

    this.draw = function() {
        ctx.beginPath();
        ctx.fillStyle = "rgb(230,230,230)";
        ctx.fillRect(this.position_x,this.position_y, this.width ,this.height);

    }
  }

function Ball(initial_position_x, initial_position_y, radius, initial_speed) {
    this.position_x = initial_position_x - radius;
    this.position_y = initial_position_y - radius;
    this.radius = radius;
    
    var img = new Image();
    img.src = "includes/img/volleyball.png";

    var kat = Math.random()*180/Math.PI;
    this.speed_x = initial_speed * Math.cos(kat);
    this.speed_y = initial_speed * Math.sin(kat);
    
    // zmienilem kat na angle - M
    var angle = Math.random()*180/Math.PI;
    this.speed_x = initial_speed * Math.cos(angle);
    this.speed_y = initial_speed * Math.sin(angle);

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
        angle = Math.random()*180/Math.PI;
        this.speed_x = initial_speed * Math.cos(angle);
        this.speed_y = initial_speed * Math.sin(angle);
    }

}
$('.start_button').click(function(){
    $(this).fadeOut();
    $('img.logo').fadeOut();
    init();
});

