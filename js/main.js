document.addEventListener('DOMContentLoaded', () => {
    // Cookie Banner Logic
    const initCookieBanner = () => {
        if (localStorage.getItem('cookieConsent')) return;

        const banner = document.createElement('div');
        banner.id = 'cookie-banner';
        banner.innerHTML = `
            <div class="cookie-content">
                <p>Nasza strona używa plików cookies, aby zapewnić Ci najlepsze wrażenia. Korzystając ze strony, zgadzasz się na ich użycie zgodnie z <a href="/polityka-prywatnosci.html">Polityką Prywatności</a>.</p>
                <button id="accept-cookies" class="btn btn-primary">Akceptuję</button>
            </div>
        `;
        document.body.appendChild(banner);

        document.getElementById('accept-cookies').addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            banner.classList.add('hide');
            setTimeout(() => banner.remove(), 400);
        });
    };
    initCookieBanner();

    const header = document.querySelector('.site-header');
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navCta = document.querySelector('.nav-cta');
    const links = document.querySelectorAll('.nav-links a');

    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            mobileBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
            if (navCta) navCta.classList.toggle('active');
        });
    }

    links.forEach(link => {
        link.addEventListener('click', () => {
            mobileBtn?.classList.remove('active');
            navLinks?.classList.remove('active');
            navCta?.classList.remove('active');
        });
    });

    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                setTimeout(() => {
                    targetEl.scrollIntoView({ behavior: 'smooth' });
                    setTimeout(() => {
                        targetEl.scrollIntoView({ behavior: 'smooth' });
                    }, 600);
                }, 300);
            }
        });
    });

    if (window.location.hash) {
        setTimeout(() => {
            const hashTarget = document.querySelector(window.location.hash);
            if (hashTarget) {
                hashTarget.scrollIntoView({ behavior: 'smooth' });
            }
        }, 500);
    }

    const fadeElements = document.querySelectorAll('.fade-in');
    const appearOptions = { threshold: 0, rootMargin: '0px 0px -100px 0px' };
    const appearOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('appear');
            observer.unobserve(entry.target);
        });
    }, appearOptions);

    fadeElements.forEach(el => appearOnScroll.observe(el));
});
