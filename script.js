/* ═══════════════════════════════════════════
   PARTICLE ANIMATION
   ═══════════════════════════════════════════ */
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let animationId;

function resizeCanvas() {
    const section = canvas.parentElement;
    canvas.width = section.offsetWidth;
    canvas.height = section.offsetHeight;
}

class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.opacity = Math.random() * 0.4 + 0.1;
        this.fadeSpeed = Math.random() * 0.005 + 0.002;
        this.fadeDir = 1;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Pulse opacity
        this.opacity += this.fadeSpeed * this.fadeDir;
        if (this.opacity >= 0.5) this.fadeDir = -1;
        if (this.opacity <= 0.05) this.fadeDir = 1;

        // Wrap around edges
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 168, 83, ${this.opacity})`;
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }
}

function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 120) {
                const opacity = (1 - dist / 120) * 0.08;
                ctx.beginPath();
                ctx.strokeStyle = `rgba(212, 168, 83, ${opacity})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    drawConnections();
    animationId = requestAnimationFrame(animateParticles);
}

// Init particles
resizeCanvas();
initParticles();
animateParticles();

window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles();
});

/* ═══════════════════════════════════════════
   NAVBAR — Toggle & Active Link
   ═══════════════════════════════════════════ */
const menuIcon = document.querySelector('#menu-icon');
const navbar = document.querySelector('.navbar');
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('header nav a');

menuIcon.onclick = () => {
    menuIcon.classList.toggle('bx-x');
    navbar.classList.toggle('active');
};

// Close menu when a nav link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        menuIcon.classList.remove('bx-x');
        navbar.classList.remove('active');
    });
});

/* ═══════════════════════════════════════════
   SCROLL — Active Section & Sticky Header
   ═══════════════════════════════════════════ */
window.onscroll = () => {
    const top = window.scrollY;

    sections.forEach(sec => {
        const offset = sec.offsetTop - 150;
        const height = sec.offsetHeight;
        const id = sec.getAttribute('id');

        if (top >= offset && top < offset + height) {
            navLinks.forEach(link => link.classList.remove('active'));
            const activeLink = document.querySelector(`header nav a[href="#${id}"]`);
            if (activeLink) activeLink.classList.add('active');
        }
    });

    const header = document.querySelector('header');
    header.classList.toggle('sticky', window.scrollY > 100);
};

/* ═══════════════════════════════════════════
   SCROLL REVEAL
   ═══════════════════════════════════════════ */
ScrollReveal({
    distance: '60px',
    duration: 1800,
    delay: 100,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
});

ScrollReveal().reveal('.home-content, .heading', { origin: 'top' });
ScrollReveal().reveal('.home-img, .services-container, .portfolio-box, .contact form', { origin: 'bottom', interval: 100 });
ScrollReveal().reveal('.home-content h1, .about-img', { origin: 'left' });
ScrollReveal().reveal('.home-content p, .about-content', { origin: 'right' });
ScrollReveal().reveal('.achievement-item', { origin: 'bottom', interval: 80 });

/* ═══════════════════════════════════════════
   TYPED JS
   ═══════════════════════════════════════════ */
const typed = new Typed('.multiple-text', {
    strings: ['Writer  كاتب', 'Novelist  روائي', 'Author  مؤلف'],
    typeSpeed: 80,
    backSpeed: 60,
    backDelay: 1500,
    loop: true,
});

/* ═══════════════════════════════════════════
   EMAILJS — Contact Form
   ═══════════════════════════════════════════ */
emailjs.init('8eakICxPhUTan-vnt');

const form = document.getElementById('contact-form');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;

    if (!name || !email || !phone || !subject || !message) {
        alert('يرجى ملء جميع الحقول');
        return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        alert('الرجاء إدخال بريد إلكتروني صحيح.');
        return;
    }

    const phonePattern = /^\d{10,}$/;
    if (!phonePattern.test(phone)) {
        alert('الرجاء إدخال رقم هاتف صحيح (10 أرقام على الأقل).');
        return;
    }

    const templateParams = {
        from_name: name,
        from_email: email,
        phone: phone,
        subject: subject,
        message: message,
    };

    emailjs.send('service_uz2xdka', 'template_jtfo0um', templateParams)
        .then(() => {
            alert('تم إرسال الرسالة بنجاح!');
            form.reset();
        })
        .catch((err) => {
            let errorMessage = 'حدث خطأ أثناء إرسال الرسالة. الرجاء المحاولة مرة أخرى.';
            if (err && err.text) {
                errorMessage = err.text;
            } else if (err && err.message) {
                errorMessage = err.message;
            }
            alert(errorMessage);
        });
});
