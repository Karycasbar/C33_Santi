const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;
var ground;
var rope;
var fruit;
var fruit_con;
var bg_img, food, rabbit;
var bunny;
var button;
var blink, sad, eat;
var bk_song, cut_song, sad_song, eating_song, air_song;
var air, blower;
var mute_btn;

function preload(){
  bg_img = loadImage("background.png");
  food = loadImage("melon.png");
  rabbit = loadImage("Rabbit-01.png");
  blink = loadAnimation("blink_1.png", "blink_2.png", "blink_3.png");
  eat = loadAnimation("eat_0.png", "eat_1.png", "eat_2.png", "eat_3.png", "eat_4.png");
  sad = loadAnimation("sad_1.png", "sad_2.png", "sad_3.png");

  bk_song = loadSound("sound1.mp3");
  sad_song = loadSound("sad.wav");
  cut_song = loadSound("rope_cut.mp3");
  eating_song = loadSound("eating_sound.mp3");
  air_song = loadSound("air.wav");



  blink.playing = true;
  eat.playing = true;
  sad.playing = true;
  sad.looping = false;
  eat.looping = false;
}
function setup() {
  createCanvas(500,700);
  frameRate(80);
  
  bk_song.play();
  bk_song.setVolume(0.1);

  engine = Engine.create();
  world = engine.world;

  blink.frameDelay = 20;
  eat.frameDelay = 20;
  sad.frameDelay = 20;
  
  //btn 1
  button = createImg('cut_btn.png');
  button.position(220,30);
  button.size(50,50);
  button.mouseClicked(drop);

  bunny = createSprite(420,620,100,100);
  bunny.addImage(rabbit);
  bunny.scale = 0.2;

  bunny.addAnimation("blinking", blink);
  bunny.addAnimation("eating", eat);
  bunny.addAnimation("crying", sad);
  bunny.changeAnimation("blinking");

  blower = createImg("balloon.png");
  blower.position(10, 250);
  blower.size(150,100);
  blower.mouseClicked(airblow);

  mute_btn = createImg("mute.png");
  mute_btn.position(450, 20);
  mute_btn.size(50,50);
  mute_btn.mouseClicked(mute);

  ground = new Ground(200,690,600,20);
  rope = new Rope(6, {x:245, y:30}); //longitud de 6 y posición x: 245 y y:30

  var fruit_options={
    density: 0.001
  }
  fruit = Bodies.circle(300,300,15,fruit_options);
  Matter.Composite.add(rope.body, fruit);

  fruit_con = new Link(rope, fruit);
 
  rectMode(CENTER);
  ellipseMode(RADIUS);
  textSize(50);
  imageMode(CENTER);
}

function draw() {
  background(51);
  image(bg_img,width/2,height/2,490,690);  
  rope.show();
  if(fruit !=null){ 
  image(food, fruit.position.x,fruit.position.y,70,70);
  }
  ground.show();

  if(collide(fruit, bunny)==true){
    bunny.changeAnimation("eating");
    eating_song.play();
  }

  /*if(collide(fruit, ground.body)==true){
    bunny.changeAnimation("crying");
  }*/

  if(fruit != null && fruit.position.y >=650){
    bunny.changeAnimation("crying");
    bk_song.stop();
    sad_song.play();
    fruit = null;
  }

  Engine.update(engine);
  drawSprites();
   
}
function drop() {
  rope.break();
  fruit_con.detach();
  fruit_con = null; 
  cut_song.play();
}

function collide(body, sprite){
  if(body != null){
    var d = dist(body.position.x, body.position.y, sprite.position.x, sprite.position.y);
    if(d<=80){
      World.remove(world, fruit);
      fruit = null;
      return true;
    }else{
      return false;
    }
  }
}

function airblow(){
  Matter.Body.applyForce(fruit, {x:0, y:0}, {x:0.01, y:0});
  air_song.play();
}


function mute(){
  if(bk_song.isPlaying()){
    bk_song.stop();
  }
  else{
    bk_song.play();
  }
}

