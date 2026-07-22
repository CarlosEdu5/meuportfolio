const canvas = document.getElementById('lanterna');
const ctx = canvas.getContext('2d');

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

const pontos = [];
const VIDA_MS = 400;

let particulas = [];
let sobreElementoClicavel = false;
let elementoClicavelAtual = null;

const seletorClicavel = 'a, button, input, textarea, select, summary, [role="button"], [onclick], [tabindex]:not([tabindex="-1"])';

function getElementoClicavelAlvo(target) {
  if (!(target instanceof Element)) return null;
  return target.closest(seletorClicavel);
}

document.addEventListener('mousemove', (e) => {
  if (!sobreElementoClicavel) {
    pontos.push({ x: e.clientX, y: e.clientY, criadoEm: performance.now() });
  }
});

function explodir(x, y) {
  const QTD = 30;
  for (let i = 0; i < QTD; i++) {
    const angulo = Math.random() * Math.PI * 2;
    const velocidade = 2 + Math.random() * 4;

    particulas.push({
      x,
      y,
      vx: Math.cos(angulo) * velocidade,
      vy: Math.sin(angulo) * velocidade,
      criadoEm: performance.now(),
      vidaMs: 500 + Math.random() * 300,
      raio: 1.5 + Math.random() * 2.5
    });
  }

  pontos.length = 0;
}

function entrarElementoClicavel(event) {
  const elemento = getElementoClicavelAlvo(event.target);
  if (!elemento || elemento === elementoClicavelAtual) return;

  elementoClicavelAtual = elemento;
  sobreElementoClicavel = true;
  explodir(event.clientX, event.clientY);
}

function sairElementoClicavel(event) {
  const proximo = event.relatedTarget;
  const proximoElemento = getElementoClicavelAlvo(proximo);

  if (proximoElemento && proximoElemento === elementoClicavelAtual) return;

  elementoClicavelAtual = null;
  sobreElementoClicavel = false;
}

document.addEventListener('mouseover', entrarElementoClicavel);
document.addEventListener('mouseout', sairElementoClicavel);

function draw() {

      ctx.clearRect(0, 0, canvas.width, canvas.height);
 
      const agora = performance.now();

      while (pontos.length && agora - pontos[0].criadoEm > VIDA_MS) {
        pontos.shift();
      }
 
      for (let i = 0; i < pontos.length; i++) {
        const p = pontos[i];
        const idade = (agora - p.criadoEm) / VIDA_MS;
 
        const progresso = 1 - idade;
 
        const raio = 2 + progresso * 8;
        const alpha = progresso * 0.8;
 
        ctx.beginPath();
        ctx.arc(p.x, p.y, raio, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(120, 170, 255, ${alpha})`;
        ctx.shadowColor = 'rgb(255, 255, 255)';
        ctx.shadowBlur = 15;
        ctx.fill();
      }
 
      particulas = particulas.filter((part) => {
        const idade = (agora - part.criadoEm) / part.vidaMs;
        return idade < 1;
      });
 
      for (const part of particulas) {
        const idade = (agora - part.criadoEm) / part.vidaMs;
        const progresso = 1 - idade;
 
        part.x += part.vx;
        part.y += part.vy;
        part.vy += 0.05;
 
        ctx.beginPath();
        ctx.arc(part.x, part.y, part.raio * progresso, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(150, 190, 255, ${progresso})`;
        ctx.shadowColor = 'rgb(255, 255, 255)';
        ctx.shadowBlur = 12;
        ctx.fill();
      }
 
      requestAnimationFrame(draw);
    }
    draw();