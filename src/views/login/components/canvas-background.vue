<template>
  <canvas ref="canvas" class="h-full"></canvas>
</template>

<script lang="ts" setup>
import Perlin from 'perlin.js';
import type { Ref } from 'vue';
import { ref, onMounted, onUnmounted } from 'vue';

defineOptions({
  name: 'LoginCanvasBackground',
});

interface Vector {
  x: number;
  y: number;
}

class V2 {
  x: number;
  y: number;
  constructor(x?: number, y?: number) {
    this.x = x || 0;
    this.y = y || 0;
  }
  add(vector: Vector) {
    this.x += vector.x;
    this.y += vector.y;
  }
  reset(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  lerp(vector: Vector, n: number) {
    this.x += (vector.x - this.x) * n;
    this.y += (vector.y - this.y) * n;
  }
}

class Particle {
  position: V2;
  velocity: V2;
  acceleration: V2;
  alpha: number;
  color: string;
  points: V2[];

  constructor() {
    this.position = new V2(-100, -100);
    this.velocity = new V2();
    this.acceleration = new V2();
    this.alpha = 0;
    this.color = '#000000';
    this.points = [
      new V2(-10 + Math.random() * 20, -10 + Math.random() * 20),
      new V2(-10 + Math.random() * 20, -10 + Math.random() * 20),
      new V2(-10 + Math.random() * 20, -10 + Math.random() * 20),
    ];
  }

  update() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.reset(0, 0);
    this.alpha -= 0.008;
    if (this.alpha < 0) this.alpha = 0;
  }

  follow(height: number, forces: V2[]) {
    var x = Math.floor(this.position.x / 20);
    var y = Math.floor(this.position.y / 20);
    var index = x * Math.floor(height / 20) + y;
    var force = forces[index];
    if (force) this.applyForce(force);
  }

  applyForce(force: V2) {
    this.acceleration.add(force);
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.moveTo(this.position.x + this.points[0].x, this.position.y + this.points[0].y);
    ctx.lineTo(this.position.x + this.points[1].x, this.position.y + this.points[1].y);
    ctx.lineTo(this.position.x + this.points[2].x, this.position.y + this.points[2].y);
    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

function isCanvas(canvas: Ref<HTMLCanvasElement | undefined>): canvas is Ref<HTMLCanvasElement> {
  return !!canvas.value;
}

function isCtx(ctx: CanvasRenderingContext2D | null): ctx is CanvasRenderingContext2D {
  return !!ctx;
}

const canvas = ref<HTMLCanvasElement>();

/** 动画帧 Id */
let frameIndex: number;

let resizeBackup: () => void;
let moveBackup: (e: MouseEvent) => void;
// let touchMoveBackup: (e: TouchEvent) => void;

function init() {
  if (!isCanvas(canvas)) return;
  const ctx = canvas.value.getContext('2d');
  if (!isCtx(ctx)) return;
  let width: number, height: number;
  let forces: V2[] = [],
    particles: Particle[] = [];
  let nParticles = 250;
  let p = 0;

  Perlin.seed(Math.random());

  const resize = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.value.width = width;
    canvas.value.height = height;
    initForces();
  };

  const initForces = () => {
    var i = 0;
    for (var x = 0; x < width; x += 20) {
      for (var y = 0; y < height; y += 20) {
        if (!forces[i]) forces[i] = new V2();
        i++;
      }
    }

    if (i < forces.length) {
      forces.splice(i + 1);
    }
  };

  const updateForces = (t: number) => {
    var i = 0;
    var xOff = 0,
      yOff = 0;
    for (var x = 0; x < width; x += 20) {
      xOff += 0.1;
      for (var y = 0; y < height; y += 20) {
        yOff += 0.1;
        let a = Perlin.perlin3(xOff, yOff, t * 0.00005) * Math.PI * 4;
        if (forces[i]) forces[i].reset(Math.cos(a) * 0.1, Math.sin(a) * 0.1);
        i++;
      }
    }
  };

  const initParticles = () => {
    for (var i = 0; i < nParticles; i++) {
      particles.push(new Particle());
      particles[i].velocity.y = 0.1;
    }
  };

  const drawParticles = () => {
    for (var i = 0; i < nParticles; i++) {
      particles[i].update();
      particles[i].follow(height, forces);
      particles[i].draw(ctx);
    }
  };

  const launchParticle = () => {
    particles[p].position.reset(emitter.x, emitter.y);
    particles[p].velocity.reset(-1 + Math.random() * 2, -1 + Math.random() * 2);
    particles[p].color = `hsl(${Math.floor((emitter.x / width) * 256)},40%,${
      60 + Math.random() * 20
    }%)`;
    particles[p].alpha = 1;
    p++;
    if (p === nParticles) p = 0;
  };

  const updateEmitter = () => {
    emitter.lerp(mouse, 0.2);
  };

  const animate = (t: number) => {
    ctx.clearRect(0, 0, width, height);
    updateEmitter();
    launchParticle();
    launchParticle();
    updateForces(t);
    drawParticles();
    frameIndex = requestAnimationFrame(animate);
  };

  const pointerMove = (e: MouseEvent) => {
    mouse.x = e.pageX;
    mouse.y = e.pageY;
  };
  // const pointerTouchMove = (e: TouchEvent) => {
  //   mouse.x = e.touches[0].pageX;
  //   mouse.y = e.touches[0].pageY;
  // };

  let mouse = new V2(window.innerWidth / 2, window.innerHeight / 2);
  let emitter = new V2(window.innerWidth / 2, window.innerHeight / 2);
  resize();
  initParticles();
  frameIndex = requestAnimationFrame(animate);

  window.addEventListener('resize', resize);

  // if (!app.isInMobile) {
  window.addEventListener('mousemove', pointerMove);
  moveBackup = pointerMove;
  // } else {
  //   window.addEventListener('touchmove', pointerTouchMove);
  //   touchMoveBackup = pointerTouchMove;
  // }
  resizeBackup = resize;
}

onMounted(() => {
  init();
});

onUnmounted(() => {
  cancelAnimationFrame(frameIndex);
  window.removeEventListener('resize', resizeBackup);
  // if (!app.isInMobile) {
  window.removeEventListener('mousemove', moveBackup);
  // } else {
  //   window.removeEventListener('touchmove', touchMoveBackup);
  // }
});
</script>

<style lang="scss" scoped></style>
