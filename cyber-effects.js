(function() {
  // Determine relative path prefix to the cursor icon from the script tag's src attribute
  let relativeCursorUrl = 'hacker-mask-icon.png';
  const currentScript = document.currentScript;
  if (currentScript) {
    const srcAttr = currentScript.getAttribute('src') || '';
    const lastSlash = srcAttr.lastIndexOf('/');
    if (lastSlash !== -1) {
      relativeCursorUrl = srcAttr.substring(0, lastSlash + 1) + 'hacker-mask-icon.png';
    }
  } else {
    // Fallback if currentScript is not supported
    const isSubdir = window.location.pathname.includes('/projects/');
    relativeCursorUrl = isSubdir ? '../hacker-mask-icon.png' : 'hacker-mask-icon.png';
  }

  // Inject Styles for Custom Cursor and Canvas
  const style = document.createElement('style');
  style.textContent = `
    /* Custom Cursor Styles */
    html, body {
      cursor: url('${relativeCursorUrl}') 16 16, auto !important;
    }
    
    /* Interactive elements */
    a, button, input[type="submit"], input[type="button"], .btn-cyber, [role="button"], 
    #toggleMode, #menuToggle, .nav-link, .logo, .resume-actions button, .project-link {
      cursor: url('${relativeCursorUrl}') 16 16, pointer !important;
    }
    
    /* Maintain default text input cursor for usability */
    input[type="text"], input[type="number"], input[type="email"], input[type="password"], textarea, .terminal-input {
      cursor: text !important;
    }

    /* Binary canvas styles */
    #binaryCanvas {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 99998;
    }
  `;
  document.head.appendChild(style);

  // Initialize canvas and mouse trail
  function initTrail() {
    let canvas = document.getElementById('binaryCanvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'binaryCanvas';
      document.body.appendChild(canvas);
    }

    const ctx = canvas.getContext('2d');
    let particles = [];
    let lastMousePos = { x: 0, y: 0 };
    let initialized = false;

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    window.addEventListener('mousemove', (e) => {
      if (!initialized) {
        lastMousePos = { x: e.clientX, y: e.clientY };
        initialized = true;
        spawnParticle(e.clientX, e.clientY);
        return;
      }

      // Calculate distance from last particle to throttle creation
      const dist = Math.hypot(e.clientX - lastMousePos.x, e.clientY - lastMousePos.y);

      if (dist > 15) { // Spawn every 15 pixels of movement
        spawnParticle(e.clientX, e.clientY);
        lastMousePos = { x: e.clientX, y: e.clientY };
      }
    });

    function spawnParticle(x, y) {
      const char = Math.random() > 0.5 ? '1' : '0';
      particles.push({
        x: x,
        y: y,
        char: char,
        opacity: 1.0,
        size: Math.floor(Math.random() * 6) + 12, // 12px to 18px
        vx: (Math.random() - 0.5) * 0.5, // subtle sideways drift
        vy: Math.random() * 0.3 + 0.3,   // slow downward drift
        decay: Math.random() * 0.015 + 0.01 // fade speed
      });
    }

    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Resolve text color from body variables with fallbacks
      let colorText = getComputedStyle(document.body).getPropertyValue('--text').trim();
      if (!colorText) {
        colorText = getComputedStyle(document.documentElement).getPropertyValue('--text').trim();
      }
      if (!colorText) {
        colorText = document.body.classList.contains('light-theme') ? '#0f5b3f' : '#00ff66';
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.opacity -= p.decay;

        if (p.opacity <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.fillStyle = colorText;
        ctx.globalAlpha = p.opacity;
        ctx.font = `${p.size}px 'Share Tech Mono', monospace`;
        ctx.fillText(p.char, p.x, p.y);
      }

      ctx.globalAlpha = 1.0;
      requestAnimationFrame(drawParticles);
    }

    requestAnimationFrame(drawParticles);
  }

  // Ensure DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTrail);
  } else {
    initTrail();
  }
})();
