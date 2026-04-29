// Simple Hero Slider - Auto changes every 3 seconds
const slider = document.querySelector('.hero-slider');
const container = document.querySelector('.hero-image-container');
if (slider && container) {
    const imgs = slider.querySelectorAll('img');
    let idx = 0;
    
    // Init images
    imgs.forEach((img, i) => {
        img.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;transition:opacity 0.5s ease;opacity:' + (i === 0 ? 1 : 0) + ';z-index:' + (i === 0 ? 2 : 1);
    });
    
    // Add dots
    const dots = document.createElement('div');
    dots.style.cssText = 'position:absolute;bottom:20px;left:50%;transform:translateX(-50%);display:flex;gap:8px;z-index:10;';
    imgs.forEach((_, i) => {
        const d = document.createElement('button');
        d.style.cssText = 'width:10px;height:10px;border-radius:50%;border:2px solid #fff;background:' + (i === 0 ? '#1e3a8a' : 'transparent') + ';cursor:pointer;';
        d.onclick = () => go(i);
        dots.appendChild(d);
    });
    container.appendChild(dots);
    
    const dotEls = dots.querySelectorAll('button');
    
    function go(n) {
        if (n === idx) return;
        imgs[idx].style.opacity = 0;
        imgs[idx].style.zIndex = 1;
        idx = n;
        imgs[idx].style.opacity = 1;
        imgs[idx].style.zIndex = 2;
        dotEls.forEach((d, i) => d.style.background = i === idx ? '#1e3a8a' : 'transparent');
    }
    
    // Auto slide every 3 seconds
    setInterval(() => go((idx + 1) % imgs.length), 3000);
}
