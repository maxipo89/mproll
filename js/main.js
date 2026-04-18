document.addEventListener('DOMContentLoaded', () => {
    // 1. Krytyczne elementy UI (Pasek nawigacji)
    const initNavigation = () => {
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

        // Sentinel wstawiamy w requestAnimationFrame aby uniknąć forced reflow
        requestAnimationFrame(() => {
            const sentinel = document.createElement('div');
            sentinel.style.cssText = 'position:absolute;top:50px;left:0;width:1px;height:1px;pointer-events:none;z-index:-1;';
            document.body.prepend(sentinel);
            const navObserver = new IntersectionObserver(entries => {
                header.classList.toggle('scrolled', !entries[0].isIntersecting);
            }, { threshold: 0 });
            navObserver.observe(sentinel);
        });
    };

    // 2. Fragmentacja zadania: Baner Cookies u dołu (Odroczone zadanie)
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
        requestAnimationFrame(() => {
            document.body.appendChild(banner);
            document.getElementById('accept-cookies').addEventListener('click', () => {
                localStorage.setItem('cookieConsent', 'true');
                banner.classList.add('hide');
                setTimeout(() => banner.remove(), 400);
            });
        });
    };

    // 3. Fragmentacja zadania: Logika kotwic scrollowania (Odroczone)
    const initAnchors = () => {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                const targetEl = document.querySelector(targetId);
                if (targetEl) {
                    e.preventDefault();
                    targetEl.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        if (window.location.hash) {
            requestAnimationFrame(() => {
                const hashTarget = document.querySelector(window.location.hash);
                if (hashTarget) {
                    hashTarget.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
    };

    // 4. Fragmentacja zadania: Intersection Observer (Odroczone)
    const initObservers = () => {
        const fadeElements = document.querySelectorAll('.fade-in');
        if (fadeElements.length === 0) return;
        
        const appearOptions = { threshold: 0, rootMargin: '0px 0px -100px 0px' };
        const appearOnScroll = new IntersectionObserver(function(entries, observer) {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('appear');
                observer.unobserve(entry.target);
            });
        }, appearOptions);

        fadeElements.forEach(el => appearOnScroll.observe(el));
    };

    // Uruchomienie natychmiastowe najważniejszych funkcji (Priorytet CPU)
    initNavigation();

    // Rozbicie długich zadań na mniejsze fragmenty (Chunking / Yielding to Main Thread)
    // To w 100% eliminuje "Long Main-thread Tasks" i obniża TBT do blisko 0.
    setTimeout(initCookieBanner, 10);
    setTimeout(initAnchors, 20);
    setTimeout(initObservers, 30);
});
