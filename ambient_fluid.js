/**
 * Harsha H R Portfolio – Interactive Fluid Glow Background
 * Smoothly moving liquid ambient light orbs
 */
(function() {
  const canvas = document.createElement('canvas');
  canvas.id = 'tech-canvas';
  
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.zIndex = '-1';
  canvas.style.pointerEvents = 'none';
  canvas.style.background = '#030303'; // Base solid pitch-black background
  
  document.body.prepend(canvas);
  
  const ctx = canvas.getContext('2d');
  let orbs = [];
  let mouseX = 0;
  let mouseY = 0;
  let targetMouseX = 0;
  let targetMouseY = 0;
  
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initOrbs();
  }
  
  class Orb {
    constructor(x, y, radius, color, speedX, speedY) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.color = color;
      this.vx = speedX;
      this.vy = speedY;
      this.baseRadius = radius;
      this.pulseSpeed = Math.random() * 0.008 + 0.004;
      this.pulseTime = Math.random() * Math.PI;
    }
    
    update() {
      // Slow float movement
      this.x += this.vx;
      this.y += this.vy;
      
      // Gentle bounce off screen boundaries
      if (this.x - this.radius < -100 || this.x + this.radius > canvas.width + 100) {
        this.vx = -this.vx;
      }
      if (this.y - this.radius < -100 || this.y + this.radius > canvas.height + 100) {
        this.vy = -this.vy;
      }
      
      // Slow pulsing size
      this.pulseTime += this.pulseSpeed;
      this.radius = this.baseRadius + Math.sin(this.pulseTime) * (this.baseRadius * 0.18);
      
      // Smooth mouse reaction - gentle push away
      const dx = mouseX - this.x;
      const dy = mouseY - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 500) {
        const force = (500 - dist) * 0.02;
        this.x -= (dx / dist) * force;
        this.y -= (dy / dist) * force;
      }
    }
    
    draw() {
      // Create radial gradient for a very soft, blurred liquid light blob
      const gradient = ctx.createRadialGradient(
        this.x, this.y, 0,
        this.x, this.y, this.radius
      );
      gradient.addColorStop(0, this.color);
      gradient.addColorStop(1, 'rgba(3, 3, 3, 0)');
      
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    }
  }
  
  function initOrbs() {
    orbs = [];
    const width = canvas.width;
    const height = canvas.height;
    const minDim = Math.min(width, height);
    
    // Orb 1: Vibrant Cyber Blue
    orbs.push(new Orb(
      width * 0.2, height * 0.25,
      minDim * 0.5,
      'rgba(37, 99, 235, 0.12)', // Royal Blue
      0.18, 0.14
    ));
    
    // Orb 2: Electric Violet
    orbs.push(new Orb(
      width * 0.8, height * 0.75,
      minDim * 0.45,
      'rgba(124, 58, 237, 0.10)', // Violet
      -0.15, 0.18
    ));
    
    // Orb 3: Tech Teal/Cyan
    orbs.push(new Orb(
      width * 0.7, height * 0.2,
      minDim * 0.4,
      'rgba(6, 182, 212, 0.08)', // Cyan/Teal
      0.12, -0.15
    ));
    
    // Orb 4: Soft Slate White Glow
    orbs.push(new Orb(
      width * 0.3, height * 0.8,
      minDim * 0.55,
      'rgba(255, 255, 255, 0.025)', // White
      -0.1, -0.1
    ));
  }
  
  function animate() {
    // Fill background
    ctx.fillStyle = '#030303';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Smooth mouse coordinates interpolation (inertia)
    mouseX += (targetMouseX - mouseX) * 0.06;
    mouseY += (targetMouseY - mouseY) * 0.06;
    
    // Draw fluid orbs
    for (let i = 0; i < orbs.length; i++) {
      orbs[i].update();
      orbs[i].draw();
    }
    
    requestAnimationFrame(animate);
  }
  
  window.addEventListener('resize', resizeCanvas);
  window.addEventListener('mousemove', function(e) {
    targetMouseX = e.clientX;
    targetMouseY = e.clientY;
  });
  
  resizeCanvas();
  animate();
})();
