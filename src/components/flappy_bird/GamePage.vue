<template>
    <div class="h-full w-full flex flex-row justify-center items-center">
        <div class="h-[414px] w-[276px]">
            <canvas id="canvas"></canvas>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import bird_b_0 from "@/assets/img/flappy_bird/bird/b0.png"
import bird_b_1 from "@/assets/img/flappy_bird/bird/b1.png"
import bird_b_2 from "@/assets/img/flappy_bird/bird/b2.png"
import img_bg from "@/assets/img/flappy_bird/BG.png"
import img_botpipe from "@/assets/img/flappy_bird/botpipe.png"
import img_ground from "@/assets/img/flappy_bird/ground.png"
import img_toppipe from "@/assets/img/flappy_bird/toppipe.png"
import Swal from 'sweetalert2';


const emit = defineEmits(['to_next']);
const score = ref(0);

watch(score, async (newValue, oldValue)=>{
  if(newValue > 10) {
    paused = true;
    await Swal.fire({
      icon:"success",
      text: "已通关，可进入下一关",
      confirmButtonText: "下一关",
    })
    emit("to_next");
  }
})

let c;
let ctx;
const RAD = Math.PI / 180;
let frames = 0;
let dx = 2;
const state = {
  curr: 0,
  getReady: 0,
  play: 1,
  gameOver: 2,
};
const gnd = {
  sprite: new Image(),
  x: 0,
  y: 0,
  draw: function () {
    this.y = parseFloat(c.height - this.sprite.height);
    ctx.drawImage(this.sprite, this.x, this.y);
  },
  update: function () {
    if (state.curr != state.play) return;
    this.x -= dx;
    this.x = this.x % (this.sprite.width / 2);
  },
};
const bg = {
  sprite: new Image(),
  x: 0,
  y: 0,
  draw: function () {
    this.y = parseFloat(c.height - this.sprite.height);
    ctx.drawImage(this.sprite, this.x, this.y);
  },
};
const pipe = {
  top: { sprite: new Image() },
  bot: { sprite: new Image() },
  gap: 85,
  moved: true,
  pipes: [],
  draw: function () {
    for (let i = 0; i < this.pipes.length; i++) {
      let p = this.pipes[i];
      ctx.drawImage(this.top.sprite, p.x, p.y);
      ctx.drawImage(
        this.bot.sprite,
        p.x,
        p.y + parseFloat(this.top.sprite.height) + this.gap
      );
    }
  },
  update: function () {
    if (state.curr != state.play) return;
    if (frames % 100 == 0) {
      this.pipes.push({
        x: parseFloat(c.width),
        y: -210 * Math.min(Math.random() + 1, 1.8),
      });
    }
    this.pipes.forEach((pipe) => {
      pipe.x -= dx;
    });

    if (this.pipes.length && this.pipes[0].x < -this.top.sprite.width) {
      this.pipes.shift();
      this.moved = true;
    }
  },
};
const bird = {
  animations: [
    { sprite: new Image() },
    { sprite: new Image() },
    { sprite: new Image() },
    { sprite: new Image() },
  ],
  rotatation: 0,
  x: 50,
  y: 100,
  speed: 0,
  gravity: 0.125,
  thrust: 3.6,
  frame: 0,
  draw: function () {
    let h = this.animations[this.frame].sprite.height;
    let w = this.animations[this.frame].sprite.width;
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotatation * RAD);
    ctx.drawImage(this.animations[this.frame].sprite, -w / 2, -h / 2);
    ctx.restore();
  },
  update: function () {
    let r = parseFloat(this.animations[0].sprite.width) / 2;
    switch (state.curr) {
      case state.getReady:
        this.rotatation = 0;
        this.y += frames % 10 == 0 ? Math.sin(frames * RAD) : 0;
        this.frame += frames % 10 == 0 ? 1 : 0;
        break;
      case state.play:
        this.frame += frames % 5 == 0 ? 1 : 0;
        this.y += this.speed;
        this.setRotation();
        this.speed += this.gravity;
        if (this.y + r >= gnd.y || this.collisioned()) {
          state.curr = state.gameOver;
        }

        break;
      case state.gameOver:
        this.frame = 1;
        if (this.y + r < gnd.y) {
          this.y += this.speed;
          this.setRotation();
          this.speed += this.gravity * 2;
        } else {
          this.speed = 0;
          this.y = gnd.y - r;
          this.rotatation = 90;
        }

        break;
    }
    this.frame = this.frame % this.animations.length;
  },
  flap: function () {
    if (this.y > 0) {
      this.speed = -this.thrust;
    }
  },
  setRotation: function () {
    if (this.speed <= 0) {
      this.rotatation = Math.max(-25, (-25 * this.speed) / (-1 * this.thrust));
    } else if (this.speed > 0) {
      this.rotatation = Math.min(90, (90 * this.speed) / (this.thrust * 2));
    }
  },
  collisioned: function () {
    if (!pipe.pipes.length) return;
    let bird = this.animations[0].sprite;
    let x = pipe.pipes[0].x;
    let y = pipe.pipes[0].y;
    let r = bird.height / 4 + bird.width / 4;
    let roof = y + parseFloat(pipe.top.sprite.height);
    let floor = roof + pipe.gap;
    let w = parseFloat(pipe.top.sprite.width);
    if (this.x + r >= x) {
      if (this.x + r < x + w) {
        if (this.y - r <= roof || this.y + r >= floor) {
          return true;
        }
      } else if (pipe.moved) {
        score.value++;
        pipe.moved = false;
      }
    }
  },
};

onMounted(() => {
    c = document.getElementById('canvas');
    ctx = c.getContext('2d');
    c.style.width = "100%";
    c.style.height = "100%";
    c.width = canvas.offsetWidth;
    c.height = canvas.offsetHeight;

    c.onclick = () => {
        switch (state.curr) {
            case state.getReady:
                state.curr = state.play;
                break;
            case state.play:
                bird.flap();
                break;
            case state.gameOver:
                state.curr = state.getReady;
                bird.speed = 0;
                bird.y = 100;
                pipe.pipes = [];
                break;
        }
    };

    window.onkeydown = e=> {
      if (e.key === ' ' || e.key === 'Spacebar') {
          switch (state.curr) {
              case state.getReady:
                  state.curr = state.play;
                  break;
              case state.play:
                  bird.flap();
                  break;
              case state.gameOver:
                  state.curr = state.getReady;
                  bird.speed = 0;
                  bird.y = 100;
                  pipe.pipes = [];
                  break;
          }
      }

      c.ontouchstart = e=>{
        switch (state.curr) {
              case state.getReady:
                  state.curr = state.play;
                  break;
              case state.play:
                  bird.flap();
                  break;
              case state.gameOver:
                  state.curr = state.getReady;
                  bird.speed = 0;
                  bird.y = 100;
                  pipe.pipes = [];
                  break;
          }
      }
    };

    gnd.sprite.src = img_ground;
    bg.sprite.src = img_bg;
    pipe.top.sprite.src = img_toppipe;
    pipe.bot.sprite.src = img_botpipe;
    bird.animations[0].sprite.src = bird_b_0;
    bird.animations[1].sprite.src = bird_b_1;
    bird.animations[2].sprite.src = bird_b_2;
    bird.animations[3].sprite.src = bird_b_0;

    setInterval(gameLoop, 20);
});

let paused = false;

function gameLoop() {
  if(paused){
    return;
  }
  update();
  draw();
  frames++;
}

function update() {
  bird.update();
  gnd.update();
  pipe.update();
}

function draw() {
  ctx.fillStyle = "#30c0df";
  ctx.fillRect(0, 0, c.width, c.height);
  bg.draw();
  pipe.draw();

  bird.draw();
  gnd.draw();
}
</script>

<style scoped></style>