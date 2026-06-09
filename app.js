/* -------------------------------------------------------------
 * THREE.JS - DYNAMIC 3D DATA PARTICLE BACKGROUND
 * ------------------------------------------------------------- */
const initThreeJS = () => {
    const canvas = document.getElementById('three-canvas');
    if (!canvas) return;

    const scene = new THREE.Scene();
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 6;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Particle field 1 (Teal Data Nodes)
    const particleCount1 = 250;
    const geometry1 = new THREE.BufferGeometry();
    const positions1 = new Float32Array(particleCount1 * 3);
    
    for (let i = 0; i < particleCount1 * 3; i += 3) {
        positions1[i] = (Math.random() - 0.5) * 15;     // X spread
        positions1[i + 1] = (Math.random() - 0.5) * 45; // Wide Y spread for scroll parallax
        positions1[i + 2] = (Math.random() - 0.5) * 12; // Z spread
    }
    geometry1.setAttribute('position', new THREE.BufferAttribute(positions1, 3));

    const material1 = new THREE.PointsMaterial({
        size: 0.065,
        color: 0x00e5ff, // Teal
        transparent: true,
        opacity: 0.55,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });
    const particles1 = new THREE.Points(geometry1, material1);
    scene.add(particles1);

    // Particle field 2 (Purple AI Nodes)
    const particleCount2 = 200;
    const geometry2 = new THREE.BufferGeometry();
    const positions2 = new Float32Array(particleCount2 * 3);
    
    for (let i = 0; i < particleCount2 * 3; i += 3) {
        positions2[i] = (Math.random() - 0.5) * 18;
        positions2[i + 1] = (Math.random() - 0.5) * 45;
        positions2[i + 2] = (Math.random() - 0.5) * 12;
    }
    geometry2.setAttribute('position', new THREE.BufferAttribute(positions2, 3));

    const material2 = new THREE.PointsMaterial({
        size: 0.075,
        color: 0x9d4edd, // Purple
        transparent: true,
        opacity: 0.45,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });
    const particles2 = new THREE.Points(geometry2, material2);
    scene.add(particles2);

    // Mouse Tracking
    let mouseX = 0, mouseY = 0;
    let targetX = 0, targetY = 0;

    window.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
        mouseY = -(event.clientY / window.innerHeight - 0.5) * 2;
    });

    // Handle Window Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

    // Animation Loop
    const clock = new THREE.Clock();

    const animate = () => {
        requestAnimationFrame(animate);

        const elapsedTime = clock.getElapsedTime();

        // Smoothly interpolate mouse movement (lagging/inertia)
        targetX += (mouseX - targetX) * 0.05;
        targetY += (mouseY - targetY) * 0.05;

        // Rotate scene based on mouse
        particles1.rotation.y = targetX * 0.35 + (elapsedTime * 0.015);
        particles1.rotation.x = -targetY * 0.25;

        particles2.rotation.y = -targetX * 0.25 - (elapsedTime * 0.02);
        particles2.rotation.x = targetY * 0.35;

        // Subtle overall drift
        particles1.position.y = Math.sin(elapsedTime * 0.2) * 0.15;
        particles2.position.y = Math.cos(elapsedTime * 0.2) * 0.15;

        // Camera Scroll Parallax (camera scrolls through vertical particles)
        // Map window scroll value to 3D coordinate systems
        const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
        camera.position.y = -scrollPercent * 25; // Drifts from 0 to -25 vertically

        renderer.render(scene, camera);
    };

    animate();
};


/* -------------------------------------------------------------
 * HERO SECTION TYPEWRITER EFFECT
 * ------------------------------------------------------------- */
const initTypewriter = () => {
    const targetElement = document.getElementById('typewriter');
    if (!targetElement) return;

    const phrases = [
        "Data Analyst",
        "BI Developer",
        "Business Analytics & AI Graduate",
        "Generative AI & RAG Builder"
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 80;

    const type = () => {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            targetElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 40; // delete faster
        } else {
            targetElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100; // standard typing speed
        }

        // Handle phrase completed / deleting finished states
        if (!isDeleting && charIndex === currentPhrase.length) {
            isDeleting = true;
            typingSpeed = 1500; // hold display
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 500; // pause before typing next word
        }

        setTimeout(type, typingSpeed);
    };

    type();
};


/* -------------------------------------------------------------
 * DYNAMIC 3D TILT EFFECT FOR PROJECT CARDS
 * ------------------------------------------------------------- */
const init3DTilt = () => {
    const tiltCards = document.querySelectorAll('.tilt-element');
    
    tiltCards.forEach(card => {
        const innerCard = card.querySelector('.project-card-inner');
        if (!innerCard) return;

        // Mouse Move inside Card
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            
            // Mouse coordinates relative to card
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Normalized values (-0.5 to 0.5)
            const normalizedX = (x / rect.width) - 0.5;
            const normalizedY = (y / rect.height) - 0.5;
            
            // Calculate tilt degrees (Max 12 degrees)
            const rotateX = normalizedY * -12;
            const rotateY = normalizedX * 12;
            
            // Apply 3D transform style
            innerCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.04, 1.04, 1.04)`;
        });

        // Mouse Enter (Disable transition to prevent lag on initial tilt movement)
        card.addEventListener('mouseenter', () => {
            innerCard.style.transition = 'none';
        });

        // Mouse Leave (Reset card values with smooth transition return)
        card.addEventListener('mouseleave', () => {
            innerCard.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)';
            innerCard.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        });
    });
};


/* -------------------------------------------------------------
 * INTERSECTION OBSERVER - SCROLL REVEALS
 * ------------------------------------------------------------- */
const initScrollReveals = () => {
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    const observerOptions = {
        threshold: 0.12,
        rootMargin: "0px 0px -50px 0px" // triggers slightly before center viewport
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal');
                observer.unobserve(entry.target); // trigger animation only once
            }
        });
    }, observerOptions);

    revealElements.forEach(el => observer.observe(el));
};


/* -------------------------------------------------------------
 * NAVIGATION & SCROLL EVENTS
 * ------------------------------------------------------------- */
const initNavigation = () => {
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Mobile Drawer Toggle
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close drawer when menu item is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // Scroll listeners
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        // Shrink navbar style on scroll
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active Section Indicator Link Update
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        if (currentSectionId) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
};


/* -------------------------------------------------------------
 * INTERACTIVE PROJECT DETAILS MODAL
 * ------------------------------------------------------------- */
const initProjectModals = () => {
    const overlay = document.getElementById('modal-overlay');
    const openBtns = document.querySelectorAll('.open-modal-btn');
    const closeBtns = document.querySelectorAll('.modal-close');
    const modals = document.querySelectorAll('.modal');

    // Open Modal Function
    openBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const projectId = btn.dataset.project;
            const targetModal = document.getElementById(`modal-${projectId}`);
            
            if (targetModal && overlay) {
                overlay.classList.add('active');
                targetModal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Lock background scrolling
            }
        });
    });

    // Close Modal Function
    const closeModal = () => {
        if (overlay) {
            overlay.classList.remove('active');
            modals.forEach(modal => modal.classList.remove('active'));
            document.body.style.overflow = 'auto'; // Re-enable background scrolling
        }
    };

    closeBtns.forEach(btn => btn.addEventListener('click', closeModal));
    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeModal();
        });
    }

    // Escape Key Close
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('active')) {
            closeModal();
        }
    });
};


/* -------------------------------------------------------------
 * APP INITIALIZATION
 * ------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
    initThreeJS();
    initTypewriter();
    init3DTilt();
    initScrollReveals();
    initNavigation();
    initProjectModals();
});
