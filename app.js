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

    // 3. Scroll-Driven Background Video Scrubbing (Using Window Scroll)
    const video = document.getElementById('bg-video');
    const scrollIndicator = document.querySelector('.scroll-indicator');

    // Ensure video is paused and ready for manual scrubbing
    video.pause();

    const updateVideoPlayhead = () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;

        // Toggle scroll indicator visibility based on scroll position
        if (scrollTop > 50) {
            scrollIndicator.style.opacity = '0';
            scrollIndicator.style.pointerEvents = 'none';
        } else {
            scrollIndicator.style.opacity = '0.8';
            scrollIndicator.style.pointerEvents = 'auto';
        }

        // Calculate scroll fraction and update video currentTime instantly
        if (video.duration) {
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            if (maxScroll > 0) {
                const scrollFraction = scrollTop / maxScroll;
                const targetTime = video.duration * scrollFraction;
                video.currentTime = Math.max(0, Math.min(video.duration - 0.01, targetTime));
            }
        }
    };

    // Listen to standard window scroll events
    window.addEventListener('scroll', updateVideoPlayhead);

    // Initialize once video metadata has loaded
    if (video.readyState >= 1) {
        updateVideoPlayhead();
    } else {
        video.addEventListener('loadedmetadata', updateVideoPlayhead);
    }

    // Handle fallbacks for mobile browsers locking video loads until interaction
    const initVideoOnInteraction = () => {
        if (video.paused) {
            video.play().then(() => {
                video.pause();
            }).catch(err => {
                console.log("Video playback pre-warm rejected: ", err);
            });
        }
        document.removeEventListener('touchstart', initVideoOnInteraction);
        document.removeEventListener('click', initVideoOnInteraction);
    };

    document.addEventListener('touchstart', initVideoOnInteraction);
    document.addEventListener('click', initVideoOnInteraction);
});
