/**
 * Harsha H R Portfolio – Interactive Canvas Tech Background
 * Animated Cyber Circuit Board & Traces (No circles/dots)
 */
(function() {
  const canvas = document.createElement('canvas');
  canvas.id = 'tech-canvas';
  
  // Style the canvas to stay in background
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.zIndex = '-1';
  canvas.style.pointerEvents = 'none';
  canvas.style.background = '#060913'; // Deep space dark background
  
  document.body.prepend(canvas);
  
  const ctx = canvas.getContext('2d');
  const gridSize = 45; // Alignment grid
  let traces = [];
  let signals = [];
  const maxTraces = 35;
  
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initCircuit();
  }
  
  class Trace {
    constructor() {
      this.points = [];
      this.generatePath();
    }
    
    generatePath() {
      const cols = Math.floor(canvas.width / gridSize);
      const rows = Math.floor(canvas.height / gridSize);
      
      // Start at a random grid point
      let x = Math.floor(Math.random() * cols) * gridSize;
      let y = Math.floor(Math.random() * rows) * gridSize;
      this.points.push({x, y});
      
      const length = Math.floor(Math.random() * 4) + 3; // 3 to 6 segments
      let lastDx = 0;
      let lastDy = 0;
      
      for (let i = 0; i < length; i++) {
        // Choose a grid-aligned direction (H, V, or 45-deg diagonal)
        const dirs = [
          {dx: 1, dy: 0},   {dx: -1, dy: 0},  {dx: 0, dy: 1},   {dx: 0, dy: -1},
          {dx: 1, dy: 1},   {dx: -1, dy: 1},  {dx: 1, dy: -1},  {dx: -1, dy: -1}
        ];
        
        // Filter out direct backward moves
        const validDirs = dirs.filter(d => !(d.dx === -lastDx && d.dy === -lastDy));
        const dir = validDirs[Math.floor(Math.random() * validDirs.length)];
        
        const steps = Math.floor(Math.random() * 3) + 2; // 2 to 4 grid units per segment
        x += dir.dx * steps * gridSize;
        y += dir.dy * steps * gridSize;
        
        // Keep within bounds
        if (x < 0 || x > canvas.width || y < 0 || y > canvas.height) {
          break;
        }
        
        this.points.push({x, y});
        lastDx = dir.dx;
        lastDy = dir.dy;
      }
    }
    
    draw() {
      if (this.points.length < 2) return;
      
      ctx.beginPath();
      ctx.moveTo(this.points[0].x, this.points[0].y);
      for (let i = 1; i < this.points.length; i++) {
        ctx.lineTo(this.points[i].x, this.points[i].y);
      }
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.08)'; // Very faint blue trace line
      ctx.lineWidth = 1.5;
      ctx.stroke();
      
      // Draw small square terminal pads at the start and end points (strictly technical, no dots)
      const start = this.points[0];
      const end = this.points[this.points.length - 1];
      
      ctx.fillStyle = 'rgba(59, 130, 246, 0.2)';
      ctx.fillRect(start.x - 3, start.y - 3, 6, 6);
      ctx.fillRect(end.x - 3, end.y - 3, 6, 6);
    }
  }
  
  class Signal {
    constructor(trace) {
      this.trace = trace;
      this.segmentIndex = 0;
      this.t = 0; // Progress along current segment (0 to 1)
      this.speed = Math.random() * 0.02 + 0.015; // Speed multiplier
      this.active = true;
    }
    
    update() {
      if (!this.active || this.trace.points.length < 2) return;
      
      this.t += this.speed;
      if (this.t >= 1) {
        this.t = 0;
        this.segmentIndex++;
        if (this.segmentIndex >= this.trace.points.length - 1) {
          this.active = false; // Finished path
        }
      }
    }
    
    draw() {
      if (!this.active || this.trace.points.length < 2) return;
      
      const p1 = this.trace.points[this.segmentIndex];
      const p2 = this.trace.points[this.segmentIndex + 1];
      
      if (!p1 || !p2) return;
      
      // Interpolate current position
      const currX = p1.x + (p2.x - p1.x) * this.t;
      const currY = p1.y + (p2.y - p1.y) * this.t;
      
      // Draw a glowing data square/pulse packet
      ctx.fillStyle = '#60a5fa';
      ctx.shadowColor = '#3b82f6';
      ctx.shadowBlur = 6;
      ctx.fillRect(currX - 2.5, currY - 2.5, 5, 5);
      ctx.shadowBlur = 0; // Reset shadow
      
      // Draw a short trailing glow segment
      const trailLength = 0.25;
      const startT = Math.max(0, this.t - trailLength);
      const trailX = p1.x + (p2.x - p1.x) * startT;
      const trailY = p1.y + (p2.y - p1.y) * startT;
      
      ctx.beginPath();
      ctx.moveTo(trailX, trailY);
      ctx.lineTo(currX, currY);
      ctx.strokeStyle = 'rgba(96, 165, 250, 0.4)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }
  
  function initCircuit() {
    traces = [];
    signals = [];
    
    // Generate trace grid paths
    for (let i = 0; i < maxTraces; i++) {
      const trace = new Trace();
      if (trace.points.length >= 2) {
        traces.push(trace);
      }
    }
  }
  
  function spawnSignal() {
    if (traces.length === 0) return;
    
    // Keep active signal count bounded
    const activeSignals = signals.filter(s => s.active);
    if (activeSignals.length < 15 && Math.random() < 0.08) {
      const randomTrace = traces[Math.floor(Math.random() * traces.length)];
      signals.push(new Signal(randomTrace));
    }
  }
  
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw all motherboard trace paths
    for (let i = 0; i < traces.length; i++) {
      traces[i].draw();
    }
    
    // Update and draw signal pulses
    spawnSignal();
    for (let i = 0; i < signals.length; i++) {
      signals[i].update();
      signals[i].draw();
    }
    
    // Cleanup inactive signals
    signals = signals.filter(s => s.active);
    
    requestAnimationFrame(animate);
  }
  
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
  animate();
})();
