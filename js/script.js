const canvas = document.getElementById('lanterna');
    const ctx = canvas.getContext('2d');
 
    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);
 
    // Guarda os últimos pontos por onde o mouse passou.
    // Cada ponto tem posição e o momento (timestamp) em que foi criado.
    const pontos = [];
    const VIDA_MS = 400; // quanto tempo (em milissegundos) cada ponto demora pra sumir
 
    document.addEventListener('mousemove', (e) => {
      if (!sobreLink) {
        pontos.push({ x: e.clientX, y: e.clientY, criadoEm: performance.now() });
      }
    });
 
    // Partículas da explosão (separado do rastro do meteoro)
    let particulas = [];
    let sobreLink = false; // controla se o mouse está em cima de algum link
 
    function explodir(x, y) {
      const QTD = 30; // quantas partículas saem na explosão
      for (let i = 0; i < QTD; i++) {
        const angulo = Math.random() * Math.PI * 2; // direção aleatória (360°)
        const velocidade = 2 + Math.random() * 4;    // velocidade aleatória
 
        particulas.push({
          x, y,
          vx: Math.cos(angulo) * velocidade,
          vy: Math.sin(angulo) * velocidade,
          criadoEm: performance.now(),
          vidaMs: 500 + Math.random() * 300, // cada partícula dura um pouco diferente
          raio: 1.5 + Math.random() * 2.5
        });
      }
      // some com o rastro normal no momento da explosão, pra ficar mais nítido
      pontos.length = 0;
    }
 
    // dispara a explosão quando o mouse entra em cima de qualquer link,
    // e liga/desliga o "sobreLink" pra pausar o rastro nesse período
    document.querySelectorAll('a').forEach((link) => {
      link.addEventListener('mouseenter', (e) => {
        sobreLink = true;
        explodir(e.clientX, e.clientY);
      });
      link.addEventListener('mouseleave', () => {
        sobreLink = false;
      });
    });
 
    function draw() {
      // Limpa TUDO a cada frame — por isso não fica "pintando" o fundo,
      // só o que a gente desenhar de novo aparece.
      ctx.clearRect(0, 0, canvas.width, canvas.height);
 
      const agora = performance.now();
 
      // remove do início da lista os pontos que já passaram da vida útil,
      // mesmo que o mouse esteja parado (isso é o que resolve o "travar")
      while (pontos.length && agora - pontos[0].criadoEm > VIDA_MS) {
        pontos.shift();
      }
 
      for (let i = 0; i < pontos.length; i++) {
        const p = pontos[i];
        const idade = (agora - p.criadoEm) / VIDA_MS; // 0 = acabou de nascer, 1 = vai sumir
 
        // progresso vai de 1 (recém criado) até 0 (prestes a sumir)
        const progresso = 1 - idade;
 
        const raio = 2 + progresso * 8;        // cauda fina, cabeça maior
        const alpha = progresso * 0.8;          // cauda apagada, cabeça mais forte
 
        ctx.beginPath();
        ctx.arc(p.x, p.y, raio, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(120, 170, 255, ${alpha})`;
        ctx.shadowColor = 'rgba(80, 150, 255, 0.8)';
        ctx.shadowBlur = 15; // dá aquele brilho de meteoro
        ctx.fill();
      }
 
      // atualiza e desenha as partículas da explosão
      particulas = particulas.filter((part) => {
        const idade = (agora - part.criadoEm) / part.vidaMs;
        return idade < 1; // remove quando a vida acabar
      });
 
      for (const part of particulas) {
        const idade = (agora - part.criadoEm) / part.vidaMs;
        const progresso = 1 - idade; // 1 = recém-nascida, 0 = sumindo
 
        // move a partícula de acordo com sua velocidade
        part.x += part.vx;
        part.y += part.vy;
        part.vy += 0.05; // uma gravidade levinha, puxando pra baixo
 
        ctx.beginPath();
        ctx.arc(part.x, part.y, part.raio * progresso, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(150, 190, 255, ${progresso})`;
        ctx.shadowColor = 'rgba(120, 170, 255, 0.9)';
        ctx.shadowBlur = 12;
        ctx.fill();
      }
 
      requestAnimationFrame(draw);
    }
    draw();