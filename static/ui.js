document.addEventListener('DOMContentLoaded', () => {
    const scene = document.querySelector('.scene-grid');
    if (scene) {
        for (let i = 0; i < 28; i += 1) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            particle.style.opacity = `${0.2 + Math.random() * 0.4}`;
            particle.style.animationDuration = `${10 + Math.random() * 14}s`;
            particle.style.animationDelay = `${-Math.random() * 14}s`;
            particle.style.width = `${2 + Math.random() * 4}px`;
            particle.style.height = particle.style.width;
            scene.appendChild(particle);
        }
    }

    document.querySelectorAll('.neon-button').forEach(btn => {
        btn.addEventListener('pointerdown', () => btn.classList.add('pressing'));
        btn.addEventListener('pointerup', () => btn.classList.remove('pressing'));
        btn.addEventListener('pointerleave', () => btn.classList.remove('pressing'));
    });
});
