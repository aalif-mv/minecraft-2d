class Game {
  constructor(blockPixle = 32) {
    this.world = {};
    this.tileMap = {};
    this.waterHight = 416;
    this.hoverBlock = [];
    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.ctx.lineWidth = 1;
    this.blockPixle = parseInt(blockPixle);
    this.image = new Image();
    this.image.src = "texture.png";
  }
  setWave(wave) {
    this.world = this.floor(wave);
    this.createTileMap(this.world);
  }
  get getWorldCanvas() {
    return this.canvas;
  }
  floor(wave) {
    let i = 0;
    let obj = {x:[], y:{}};
    for (i; i < wave.y.length; i += this.blockPixle) {
      obj.y[i] = Math.floor(wave.y[i] / this.blockPixle) * this.blockPixle;
      obj.x[i] = i;
    }
    return obj;
  }
  placeBlock(x,y) {
    this.tileMap[x +":"+ y] = player.block;
    // console.log(this.tileMap);
  }
  breakBlock(x,y) {
    this.tileMap[x +":"+ y] = "0";
    // console.log(this.tileMap);
  }
  createTileMap(world) {
    let y = 0;
    for (y; y < this.canvas.height; y += this.blockPixle) {
      for (let i = 0; i < this.canvas.width; i += this.blockPixle) {
        let gap = this.blockPixle * random(3,6);
        if (world.y[""+i] == y && this.waterHight > y) {
            this.tileMap[i +":"+ y] = "1";
        } else if (world.y[""+i] + gap -1 < y && this.canvas.height > y) {
          this.tileMap[i +":"+ y] = "3";
        } else if (world.y[""+i] <= y && this.waterHight < y && this.waterHight < world.y[""+i]) {
            this.tileMap[i +":"+ y] = "6";
        } else if (world.y[""+i] < y && world.y[""+i] + gap > y) {
          this.tileMap[i +":"+ y] = "2";
        } else {
          if (y >= this.waterHight) {
            this.tileMap[i +":"+ y] = "5";
          } else {
            this.tileMap[i +":"+ y] = "0";
          }
        }
        // console.log(this.tileMap[i + this.blockPixle +":"+ (y - this.blockPixle)])
      }
    }
    // console.log(this.tileMap);
  }
  drawImage(i, d) {
    if (i != "0") {
      this.ctx.drawImage(this.image, texture[i][0], texture[i][1], pixles, pixles, d[0], d[1], this.blockPixle, this.blockPixle);
    }
    this.ctx.strokeRect(this.hoverBlock[0], this.hoverBlock[1], this.blockPixle, this.blockPixle);
  }
  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (let i in this.tileMap) {
      this.drawImage(this.tileMap[i], [i.split(":")[0], i.split(":")[1]]);
    }
  }
}

class SinWave {
  constructor() {
    this.x = [];
    this.y = [];
    this.canvas = game.getWorldCanvas;
    this.chunks = [];
    this.spawn = 0;
    this.randnum = 0;
    this.above = true;
  }
  get getWave() {
    return {x: this.x, y: this.y};
  }
  push(x, y) {
    this.x.push(x);
    this.y.push(y);
  }
  pushChunk() {
    this.chunks.push([this.x, this.y])
  }
  add(sinW) {
    for (var i = 0; i < this.y.length; i++) {
      this.y[i] = (this.y[i] + sinW.y[i]) / 2;
    }
  }
  reset() {
    this.x = [];
    this.y = [];
  }
  generate(wave2, wave3, r = random(0, 300)) {
    for (let i = r; i < this.canvas.width + r; i++) {
      this.push(i - r, (this.canvas.height / 1.5) + Math.sin(i * 0.006) * this.ran(100, 800));
      wave2.push(i - r, (this.canvas.height / 1.5) + Math.sin((i + 6) * 0.03) * wave2.ran(15, 35));
      wave3.push(i - r, (this.canvas.height / 1.5) + Math.sin((i + 4) * 0.1) * wave3.ran(4, 8));
    }
  }
  ran(min, max, y = this.y[this.y.length - 1]) {
    if (y <= this.canvas.height / 2 && this.above == false) {
      this.above = true;
      this.randnum = random(min, max);
    } else if (y >= this.canvas.height / 2 && this.above == true) {
      this.above = false;
      this.randnum = random(min, max);
    } else {
      return this.randnum;
    }
    return this.randnum;
  }
  scroll(current, direction) {

  }
}

class Player {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.speed = {x:0, y:0};
    this.ySpeed = 0;
    this.xSpeed = 0;
    this.width = width;
    this.height = height;
    this.friction = 0.9;
    this.ground = false;
    this.water = false;
    this.gravity = 0.2;
    this.drag = 0.985;
    this.block = "4";
    this.canvas = document.getElementById("playerCanvas");
    this.canvas.width = document.documentElement.clientWidth;
    this.ctx = this.canvas.getContext("2d");
  }
  update() {
    if (keyMap['d']) {
      player.xSpeed = 2;
    }
    if (keyMap["a"]) {
      player.xSpeed = -2;
    }
    if (keyMap["w"] && (this.ground || this.water)) {
      player.ySpeed = -4;
      this.ground = false;
    }
    if (this.water) {this.drag = 0.8} else {this.drag = 0.985}
    this.ySpeed *= this.drag;
    this.ySpeed += this.gravity;
    this.xSpeed *= this.friction;
    this.x += this.xSpeed;
    this.y += this.ySpeed;
    this.collide();
  }
  equals(e, c) {
    for (let i = 0; i < c.length; i++) {
      if (e == "5") {
        this.water = true;
      }
      if (e == "0") {
        this.water = false;
      } 
      if (e != "0" && e != "5") {
        this.ground = true;
        this.water = false;
        // console.log(this.ground)
      }
      if (e == c[i]) {
        return false;
      }
      // console.log(this.water)
    }
    return true;
  }
  collide() {
    // bottom left
    if (this.equals(game.tileMap[floor(this.x, game.blockPixle) +":"+floor(this.y + this.height, game.blockPixle)], ["0", "5"])) {
      this.ySpeed = 0;
      this.y = floor(this.y, game.blockPixle) + (game.blockPixle - this.height);
    }
    // bottom right
    if (this.equals(game.tileMap[floor(this.x + this.width, game.blockPixle) +":"+floor(this.y + this.height, game.blockPixle)], ["0","5"])) {
      this.ySpeed = 0;
      this.y = floor(this.y, game.blockPixle) + (game.blockPixle - this.height);
    }
    // top
    if (this.equals(game.tileMap[floor(this.x + this.width, game.blockPixle) +":"+floor(this.y, game.blockPixle)], ["0","5"])) {
      this.ySpeed = 0;
    }
    // left
    if (this.equals(game.tileMap[floor(this.x, game.blockPixle) +":"+floor(this.y , game.blockPixle)], ["0","5"])) {
      this.xSpeed = 0;
      this.x = (floor(this.x, game.blockPixle) + game.blockPixle) + 0.01;
    }
    // right
    if (this.equals(game.tileMap[floor(this.x + this.width, game.blockPixle) +":"+floor(this.y , game.blockPixle)], ["0","5"])) {
      this.xSpeed = 0;
      this.x = (floor(this.x, game.blockPixle) + (game.blockPixle - this.width)) - 0.01;
    }
  }
  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.fillStyle = "blue";
    this.ctx.fillRect(this.x, this.y, this.width, this.height);
    if (debug) {
      this.ctx.beginPath();
      this.ctx.lineTo(this.x, this.y + this.height);
      this.ctx.lineTo(this.x + this.width, this.y + this.height);
      this.ctx.lineTo(this.x + this.width, noise.y[this.x + this.width]);
      this.ctx.lineTo(this.x, this.y + this.height);
      this.ctx.strokeStyle = "blue"
      this.ctx.stroke();
      this.ctx.closePath();
    }
  }
}


var update = function() {
  player.update();
  // console.log("hi");
}

var render = function() {
  player.draw();
  game.draw();
}


const keyMap = {};
const game = new Game(prompt("enter pixle width (above 15 unless you have a fast computer) 16 or 32 recommended") || 32);
const player = new Player(200, 50, game.blockPixle - 5, game.blockPixle);
const engine = new Engine(1000/30, render, update);
const noise = new SinWave();
const v2 = new SinWave();
const v3 = new SinWave();
const con = document.getElementById("console");
var debug = false;


game.canvas.width = document.documentElement.clientWidth;
player.canvas.width = document.documentElement.clientWidth;
game.canvas.height = document.documentElement.clientHeight;
player.canvas.height = document.documentElement.clientHeight;
game.ctx.fillStyle = "blue";

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function floor(val, nearest) {
  return Math.floor(val / nearest) * nearest;
}

function run() {
  noise.generate(v2, v3)
  noise.add(v2);
  noise.add(v3);
  game.setWave(noise.getWave);
  game.draw();
}

function reset() {
  game.ctx.clearRect(0, 0, canvas.width, canvas.height);
  noise.reset();
  game.ctx.beginPath();
  player.y = 0;
  player.x = 20;
  run();
}
window.addEventListener("resize", function() {
  game.canvas.width = document.documentElement.clientWidth;
  player.canvas.width = document.documentElement.clientWidth;
  game.canvas.height = document.documentElement.clientHeight;
  player.canvas.height = document.documentElement.clientHeight;
  // reset();
});
window.addEventListener("click", function(e) {
  let x = floor(e.clientX, game.blockPixle);
  let y = floor(e.clientY, game.blockPixle);
  game.breakBlock(x, y);
});
window.addEventListener("mousemove", function(e){
  let x = floor(e.clientX, game.blockPixle);
  let y = floor(e.clientY, game.blockPixle);
  game.hoverBlock = [x,y];
});
player.canvas.addEventListener('contextmenu', function(e) {
  let x = Math.floor(e.clientX / game.blockPixle) * game.blockPixle;
  let y = Math.floor(e.clientY / game.blockPixle) * game.blockPixle;
  e.preventDefault();
  game.placeBlock(x, y);
});
onkeydown = onkeyup = function(e){
  keyMap[e.key] = e.type == 'keydown';
  if (e.key == "1" || e.key == "2" || e.key == "3" || e.key == "4" || e.key == "5" || e.key == "6") {
    player.block = e.key;
  }
}
game.image.onload = function() {
  run();
  engine.start();
}