document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Dynamic WhatsApp QR Code
    const qrImage = document.getElementById('whatsapp-qr');
    const waNumber = '4916091903033';
    const waText = encodeURIComponent('Hallo! Ich interessiere mich für ein kostenloses Angebot für Handwerker-Leistungen.');
    const waUrl = `https://wa.me/${waNumber}?text=${waText}`;
    
    if (qrImage) {
        // Use qrserver.com API to generate WhatsApp link QR code
        qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(waUrl)}`;
    }

    // 2. Interactive Accordion for Services
    const serviceItems = document.querySelectorAll('.service-item');
    serviceItems.forEach(item => {
        const header = item.querySelector('.service-header');
        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all active items
            serviceItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });
            
            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // Open the first service by default to invite user interaction
    if (serviceItems.length > 0) {
        serviceItems[0].classList.add('active');
    }

    // 3. Canvas Image-Sequence Scroll Scrubbing
    const canvas = document.getElementById('bg-canvas');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    if (canvas) {
        const context = canvas.getContext('2d');
        const frameCount = 120;
        const images = [];

        // Set canvas coordinate dimensions matching the image aspect ratio
        canvas.width = 540;
        canvas.height = 1200;

        // Generate file paths
        const currentFrame = index => (
            `frames/frame_${index.toString().padStart(3, '0')}.jpg`
        );

        // Preload images
        let loadedCount = 0;
        const preloadImages = () => {
            for (let i = 1; i <= frameCount; i++) {
                const img = new Image();
                img.onload = () => {
                    loadedCount++;
                    // Draw first frame as soon as it loads to prevent blank screen
                    if (i === 1) {
                        drawFrame(0);
                    }
                };
                img.src = currentFrame(i);
                images.push(img);
            }
        };

        // Render current image onto canvas
        const drawFrame = index => {
            const img = images[index];
            if (img && img.complete) {
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.drawImage(img, 0, 0, canvas.width, canvas.height);
            }
        };

        // Scroll listener mapping scroll depth directly to frame index
        const updatePlayhead = () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;

            // Toggle scroll indicator
            if (scrollTop > 50) {
                scrollIndicator.style.opacity = '0';
                scrollIndicator.style.pointerEvents = 'none';
            } else {
                scrollIndicator.style.opacity = '0.8';
                scrollIndicator.style.pointerEvents = 'auto';
            }

            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            if (maxScroll > 0) {
                const scrollFraction = scrollTop / maxScroll;
                const frameIndex = Math.min(
                    frameCount - 1,
                    Math.max(0, Math.floor(scrollFraction * frameCount))
                );
                requestAnimationFrame(() => drawFrame(frameIndex));
            }
        };

        window.addEventListener('scroll', updatePlayhead);
        window.addEventListener('resize', updatePlayhead);

        // Start preloading
        preloadImages();
    }
});
