// Dynamic peace symbol generation
function randomisePeaceSymbols() {
    const peaceSymbols = document.querySelectorAll('.peace-symbol');
    
    peaceSymbols.forEach((symbol) => {
        // Get position and size from inline style as seed
        const top = parseFloat(symbol.style.top);
        const left = parseFloat(symbol.style.left);
        
        // Create a seed value from position and size
        const seed = (top * 100 + left * 100);

        console.log(`Symbol at top: ${top}, left: ${left} has seed: ${seed}`);
        
        // Use the seed to create deterministic rotation, opacity, and scale
        const rotation = seededRandom(seed, -45, 45);
        const opacity = seededRandom(seed, 0.5, 1);
        const scale = seededRandom(seed, 0.8, 1.2);
        
        // Apply transformations using CSS custom properties to work with animation
        symbol.style.setProperty('--rotation', `${rotation}deg`);
        symbol.style.setProperty('--scale', scale);
        symbol.style.opacity = opacity;
    });
}

// Seeded pseudo-random number generator
function seededRandom(seed, min, max) {
    let x = Math.sin(seed) * 10000;
    let random = x - Math.floor(x);
    return min + random * (max - min);
}

// Add parallax effect to peace symbols on scroll
function initParallax() {
    const symbols = document.querySelectorAll('.peace-symbol');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        symbols.forEach((symbol, index) => {
            const speed = 0.1 + (index % 5) * 0.05;
            const yPos = -(scrolled * speed);
            symbol.style.transform += ` translateY(${yPos}px)`;
        });
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    randomisePeaceSymbols();
    // initParallax();
    
    // Add fade-in effect for cards
    const cards = document.querySelectorAll('.content-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });
    
    cards.forEach(card => {
        observer.observe(card);
    });
});
