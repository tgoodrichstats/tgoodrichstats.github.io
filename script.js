// ===== SCROLL REVEAL =====
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('in');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealElements.forEach(el => revealObserver.observe(el));


// ===== STATS ANIMATION =====
const statFills = document.querySelectorAll('.stat-fill');
const statNumbers = document.querySelectorAll('.stat-meta strong');

const statsObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      const fill = entry.target.querySelector('.stat-fill');
      const numberEl = entry.target.querySelector('.stat-meta strong');
      const target = parseInt(numberEl.dataset.value);

      // Animate fill
      fill.style.width = fill.style.getPropertyValue('--fill');

      // Animate number
      let current = 0;
      const step = Math.ceil(target / 60);
      const interval = setInterval(() => {
        current += step;
        if(current >= target){
          current = target;
          clearInterval(interval);
        }
        numberEl.textContent = current;
      }, 20);

      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat').forEach(stat => statsObserver.observe(stat));


// ===== BACKGROUND CANVAS ANIMATION =====
const canvas = document.getElementById('court-bg');
const ctx = canvas.getContext('2d');
let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

class CourtLine {
  constructor(){
    this.x = Math.random()*width;
    this.y = Math.random()*height;
    this.vx = (Math.random()-0.5)*0.3;
    this.vy = (Math.random()-0.5)*0.3;
    this.length = 80 + Math.random()*40;
    this.alpha = 0.05 + Math.random()*0.1;
  }
  move(){
    this.x += this.vx;
    this.y += this.vy;
    if(this.x<0 || this.x>width) this.vx*=-1;
    if(this.y<0 || this.y>height) this.vy*=-1;
  }
  draw(){
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x+this.length, this.y);
    ctx.strokeStyle = `rgba(37,99,235,${this.alpha})`;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

class Ball {
  constructor(){
    this.x = Math.random()*width;
    this.y = Math.random()*height;
    this.vx = (Math.random()-0.5)*1;
    this.vy = (Math.random()-0.5)*1;
    this.radius = 6 + Math.random()*6;
    this.color = `rgba(237,125,49,0.7)`;
  }
  move(){
    this.x += this.vx;
    this.y += this.vy;
    if(this.x<0 || this.x>width) this.vx*=-1;
    if(this.y<0 || this.y>height) this.vy*=-1;
  }
  draw(){
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.radius,0,Math.PI*2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

const lines = [], balls = [];
for(let i=0;i<40;i++) lines.push(new CourtLine());
for(let i=0;i<20;i++) balls.push(new Ball());

function animate(){
  ctx.clearRect(0,0,width,height);
  lines.forEach(l=>{ l.move(); l.draw(); });
  balls.forEach(b=>{ b.move(); b.draw(); });
  requestAnimationFrame(animate);
}
animate();

window.addEventListener('resize', ()=>{
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
});
