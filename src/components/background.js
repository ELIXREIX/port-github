export function initCosmosBackground() {
  const canvas = document.getElementById('cosmos-bg');
  const ctx = canvas.getContext('2d');

  let width, height;
  let stars = [];
  const starCount = 200;

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    createStars();
  }

  function createStars() {
    stars = [];
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2,
        speed: Math.random() * 0.5 + 0.1,
        opacity: Math.random(),
        direction: Math.random() > 0.5 ? 1 : -1
      });
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    
    // Draw background gradient (optional, if CSS fails or for more complex effects)
    // ctx.fillStyle = '#050510';
    // ctx.fillRect(0, 0, width, height);

    stars.forEach(star => {
      ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();

      // Move stars
      star.y -= star.speed; // Move upwards for "anti-gravity" feel
      
      // Reset if out of bounds
      if (star.y < 0) {
        star.y = height;
        star.x = Math.random() * width;
      }
      
      // Twinkle effect
      star.opacity += (Math.random() - 0.5) * 0.05;
      if (star.opacity < 0.1) star.opacity = 0.1;
      if (star.opacity > 1) star.opacity = 1;
    });

    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', resize);
  resize();
  animate();
}
