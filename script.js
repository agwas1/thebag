document.addEventListener('DOMContentLoaded', () => {
    const pageLoader = document.getElementById('pageLoader');
    const scrollProgress = document.getElementById('scrollProgress');
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const nowPlaying = document.getElementById('nowPlaying');
    const trackName = document.getElementById('trackName');
    const trackDj = document.getElementById('trackDj');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const closePlayer = document.getElementById('closePlayer');
    const progress = document.getElementById('progress');
    const contactForm = document.getElementById('contactForm');
    const statNumbers = document.querySelectorAll('.stat-number');
    const backToTop = document.getElementById('backToTop');

    let isPlaying = false;
    let progressInterval;

    setTimeout(() => {
        pageLoader.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }, 2000);

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        scrollProgress.style.width = scrollPercent + '%';

        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        if (scrollTop > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }

        updateActiveNavLink();
    });

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    const animateOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                animateOnScroll.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        animateOnScroll.observe(el);
    });

    let statsAnimated = false;
    const animateStats = () => {
        if (statsAnimated) return;

        const heroStats = document.querySelector('.hero-stats');
        if (!heroStats) return;

        const rect = heroStats.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
            statsAnimated = true;
            statNumbers.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-target'));
                const duration = 2000;
                const increment = target / (duration / 16);
                let current = 0;

                const updateCount = () => {
                    current += increment;
                    if (current < target) {
                        stat.textContent = Math.ceil(current);
                        requestAnimationFrame(updateCount);
                    } else {
                        stat.textContent = target;
                    }
                };
                updateCount();
            });
        }
    };

    window.addEventListener('scroll', animateStats);
    animateStats();

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const offsetTop = target.offsetTop - 70;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                document.querySelectorAll('.nav-links a').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    const playlistData = {
        'gengetone-madness-23': { name: 'Gengetone Madness Vol. 23', dj: 'DJ Kanyonga' },
        'amapiano-takeover-8': { name: 'Amapiano Takeover Vol. 8', dj: 'DJ Mura' },
        'afrobeats-dancehall-fusion': { name: 'Afrobeats & Dancehall Fusion', dj: 'DJ Pierra' },
        'kenyan-drill-sessions': { name: 'Kenyan Drill Sessions', dj: 'DJ Viper' },
        'benga-blast-classics': { name: 'Benga Blast Classics', dj: 'DJ Otis' },
        'club-bangers-2026': { name: 'Club Bangers 2026', dj: 'DJ Njoo' }
    };

    window.playPlaylist = (id) => {
        const playlist = playlistData[id];
        if (!playlist) return;

        trackName.textContent = playlist.name;
        trackDj.textContent = playlist.dj;
        nowPlaying.classList.add('active');
        isPlaying = true;
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        startProgress();
    };

    const startProgress = () => {
        clearInterval(progressInterval);
        let width = 0;
        progressInterval = setInterval(() => {
            if (width >= 100) {
                clearInterval(progressInterval);
                return;
            }
            width += 0.2;
            progress.style.width = width + '%';
        }, 50);
    };

    playPauseBtn.addEventListener('click', () => {
        isPlaying = !isPlaying;
        if (isPlaying) {
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            startProgress();
        } else {
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            clearInterval(progressInterval);
        }
    });

    closePlayer.addEventListener('click', () => {
        nowPlaying.classList.remove('active');
        isPlaying = false;
        clearInterval(progressInterval);
        progress.style.width = '0%';
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    });

    document.getElementById('prevBtn').addEventListener('click', () => {
        progress.style.width = '0%';
        startProgress();
    });

    document.getElementById('nextBtn').addEventListener('click', () => {
        progress.style.width = '0%';
        startProgress();
    });

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i> Sent!';
            btn.style.background = '#22c55e';
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '';
                contactForm.reset();
            }, 2000);
        });
    }

    document.querySelectorAll('.newsletter-form').forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = form.querySelector('input');
            const button = form.querySelector('button');
            input.value = '';
            button.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(() => {
                button.innerHTML = '<i class="fas fa-arrow-right"></i>';
            }, 2000);
        });
    });

    const hero = document.querySelector('.hero');
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    
    if (!isMobile && hero) {
        window.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * 20;
            
            const particles = document.querySelectorAll('.particle');
            particles.forEach((particle, index) => {
                const speed = (index + 1) * 0.5;
                particle.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
            });
        });
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReducedMotion.matches) {
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            el.classList.add('animated');
        });
    }

    const lazyImages = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
});

window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});