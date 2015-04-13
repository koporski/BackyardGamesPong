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
var ball_radius = pallet_height/8; //promień piłki

//pozycje początkowe piłki
var ball_position_x = W/2;
var ball_position_y = H/2;
//prędkość piłki
var predkosc = 8;
var kat = Math.random()*180/Math.PI;
var ball_speed_x = predkosc * Math.cos(kat);
var ball_speed_y = predkosc * Math.sin(kat);


var pallet_hit_sound = new Howl({urls: ['http://vorb.pl/GameProjects/Pong/includes/sounds/pallet_hit.wav']});
var wall_hit_sound = new Howl({urls: ['http://vorb.pl/GameProjects/Pong/includes/sounds/wall_hit.wav']});
var ctx;

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

    ctx.beginPath();
    ctx.fillStyle = 'rgb(240,240,240)';
    ctx.arc(ball_position_x, ball_position_y,ball_radius, 0, Math.PI*2, false);
    ctx.fill();


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
    ball_position_x +=  ball_speed_x;
    ball_position_y +=  ball_speed_y;

    //odbicie od ścian
    if(ball_position_y + ball_radius > H) {
        ball_speed_y = -ball_speed_y;
        ball_position_y = H - ball_radius;
        wall_hit_sound.play();
    }
    else if(ball_position_y - ball_radius < 0) {
        ball_speed_y = -ball_speed_y;
        ball_position_y = ball_radius;
        wall_hit_sound.play();
    }
// zmienilem to! -M
    if(ball_position_x - ball_radius < 0){
        resetBall();
        rightScore ++;
        chlosta();
    }
    if(ball_position_x - ball_radius > W) {
      resetBall();
      leftScore ++;
      chlosta();
    }

    //odbicia od zewnętrzych krawędzi paletek
    if(ball_position_y >= player1_position_y && ball_position_y  <= player1_position_y + pallet_height && ball_position_x > player1_position_x + pallet_width) {
        if(Math.abs(ball_position_x -(player1_position_x + pallet_width)) <= ball_radius) {
            ball_position_x = player1_position_x + pallet_width + ball_radius;
            ball_speed_x = -ball_speed_x;
            pallet_hit_sound.play();
        }
    }
    if(ball_position_y >= player2_position_y && ball_position_y  <= player2_position_y + pallet_height && ball_position_x < player2_position_x) {
        if(Math.abs((player2_position_x - ball_position_x)) <= ball_radius) {
            ball_speed_x = -ball_speed_x;
            ball_position_x = player2_position_x - ball_radius;
            pallet_hit_sound.play();
        }
    }
    //odbicie od dolnych krawędzi paletek
    if(ball_position_x - ball_radius <= player1_position_x + pallet_width && ball_position_x >= player1_position_x && ball_position_y > player1_position_y + pallet_height) {
        if(Math.abs(ball_position_y - (player1_position_y + pallet_height)) <= ball_radius) {
            ball_speed_y = -ball_speed_y;
            ball_speed_x = -ball_speed_x;
            ball_position_y = player1_position_y + pallet_height + ball_radius;
            pallet_hit_sound.play();
        }
    }
    if(ball_position_x + ball_radius >= player2_position_x && ball_position_x <= player2_position_x + pallet_width && ball_position_y > player2_position_y + pallet_height ) {
        if(Math.abs(ball_position_y - (player2_position_y + pallet_height)) <= ball_radius) {
            ball_speed_y = -ball_speed_y;
            ball_speed_x = -ball_speed_x;
            ball_position_y = player2_position_y + pallet_height + ball_radius;
            pallet_hit_sound.play();
        }
    }
    if(ball_position_x - ball_radius <= player1_position_x + pallet_width && ball_position_x < player1_position_x && ball_position_y > player1_position_y + pallet_height) {
        if(Math.abs(ball_position_y - (player1_position_y + pallet_height)) <= ball_radius) {
            ball_speed_y = -ball_speed_y;
            ball_position_y = player1_position_y + pallet_height + ball_radius;
            pallet_hit_sound.play();
        }
    }
    if(ball_position_x + ball_radius >= player2_position_x + pallet_width && ball_position_x > player2_position_x && ball_position_y > player2_position_y + pallet_height ) {
        if(Math.abs(ball_position_y - (player2_position_y + pallet_height)) <= ball_radius) {
            ball_speed_y = -ball_speed_y;
            ball_position_y = player2_position_y + pallet_height + ball_radius;
            pallet_hit_sound.play();
        }
    }


    //odbicie od górnych krawędzi paletek
    if(ball_position_x - ball_radius <= player1_position_x + pallet_width && ball_position_x >= player1_position_x  && ball_position_y < player1_position_y) {
        if(Math.abs(player1_position_y - ball_position_y) <= ball_radius) {
            ball_speed_y = -ball_speed_y;
            ball_speed_x = -ball_speed_x;
            ball_position_y = player1_position_y - ball_radius;
            pallet_hit_sound.play();
        }
    }
    if(ball_position_x + ball_radius >= player2_position_x && ball_position_x <= player2_position_x + pallet_width && ball_position_y < player2_position_y) {
        if(Math.abs(player2_position_y - ball_position_y) <= ball_radius) {
            ball_speed_y = -ball_speed_y;
            ball_speed_x = -ball_speed_x;
            ball_position_y = player2_position_y - ball_radius;
            pallet_hit_sound.play();
        }
    }
    if(ball_position_x - ball_radius <= player1_position_x + pallet_width && ball_position_x < player1_position_x  && ball_position_y < player1_position_y) {
        if(Math.abs(player1_position_y - ball_position_y) <= ball_radius) {
            ball_speed_y = -ball_speed_y;
            ball_position_y = player1_position_y - ball_radius;
            pallet_hit_sound.play();
        }
    }
    if(ball_position_x + ball_radius >= player2_position_x + pallet_width && ball_position_x > player2_position_x && ball_position_y < player2_position_y) {
        if(Math.abs(player2_position_y - ball_position_y) <= ball_radius) {
            ball_speed_y = -ball_speed_y;
            ball_position_y = player2_position_y - ball_radius;
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
function resetBall() {
  ball_position_x = W/2;
  ball_position_y = H/2;
}

function chlosta() {
    if(rightScore > 3 || leftScore >3){
      alert('Scierwisz');
      resetBall();
      leftScore = 0;
      rightScore = 0;
    }
  }


$('.start_button').click(function(){
    $(this).fadeOut();
    $('img.logo').fadeOut();
    init();
});
