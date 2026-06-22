document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Dynamic WhatsApp QR Code
    const qrImage = document.getElementById('whatsapp-qr');
    const waNumber = '4916091903033';
    const waText = encodeURIComponent('Hallo! Ich interessiere mich für ein kostenloses Angebot für Handwerker-Leistungen.');
    const waUrl = `https://wa.me/${waNumber}?text=${waText}`;
    
    if (qrImage) {
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

    // 3. Floating WhatsApp CTA visibility toggle
    const floatingCta = document.getElementById('floating-whatsapp');

    // 4. Canvas Image-Sequence Scroll Scrubbing (Optimized Progressive Load)
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

        // Render current image (or nearest loaded fallback) onto canvas
        const drawFrame = index => {
            let imgToDraw = images[index];
            
            // Fallback logic: if the target frame isn't loaded yet, find the closest loaded one
            if (!imgToDraw || !imgToDraw.complete) {
                for (let i = index; i >= 0; i--) {
                    if (images[i] && images[i].complete) {
                        imgToDraw = images[i];
                        break;
                    }
                }
            }

            // Draw
            if (imgToDraw && imgToDraw.complete) {
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.drawImage(imgToDraw, 0, 0, canvas.width, canvas.height);
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

            // Toggle floating WhatsApp CTA visibility
            if (floatingCta) {
                if (scrollTop > 300) {
                    floatingCta.classList.add('visible');
                } else {
                    floatingCta.classList.remove('visible');
                }
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

        // Preload first frame immediately to make site background display instantly
        const firstFrameImg = new Image();
        firstFrameImg.onload = () => {
            images[0] = firstFrameImg;
            drawFrame(0);
            
            // Load the remaining 119 frames asynchronously in the background
            preloadRemainingFrames();
        };
        firstFrameImg.src = currentFrame(1);

        const preloadRemainingFrames = () => {
            for (let i = 2; i <= frameCount; i++) {
                const img = new Image();
                img.src = currentFrame(i);
                images[i - 1] = img; // Offset by 1 since array is 0-indexed
            }
        };

        window.addEventListener('scroll', updatePlayhead);
        window.addEventListener('resize', updatePlayhead);
    }

    // 5. Scroll Reveal Animation (Subtle entry animation for cards)
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Unobserve once revealed to keep scrolling performant
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.05,
        rootMargin: '0px 0px -40px 0px' // triggers slightly before entering viewport
    });

    document.querySelectorAll('.glass-card, .area-card').forEach(card => {
        card.classList.add('reveal-element');
        revealObserver.observe(card);
    });
});
