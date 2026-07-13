/**
 * XENITH Official Website - Core Script
 * Version: 1.0.0
 * Architecture: Modular Vanilla ES6+
 * Philosophy: Minimalism, Precision, Visual Silence
 */

// --- CONFIGURAÇÕES GERAIS E ESTADOS DA APLICAÇÃO ---
const XenithConfig = {
    scrollThreshold: 100,
    parallaxSpeed: 0.15,
    cursorDelay: 0.1,
    observerOptions: {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    }
};

// --- INICIALIZAÇÃO DO SISTEMA ---
document.addEventListener('DOMContentLoaded', () => {
    XenithLoader.init();
    XenithHeader.init();
    XenithNavigation.init();
    XenithScrollEffects.init();
    XenithInteractiveComponents.init();
    XenithPremiumCursor.init();
    XenithDynamicData.init();
});

// =========================================================================
// 1. LOADER (TELA DE CARREGAMENTO)
// =========================================================================
const XenithLoader = {
    init() {
        const loader = document.querySelector('[data-xenith-loader]');
        if (!loader) return;

        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.style.transition = 'opacity 1s cubic-bezier(0.25, 1, 0.5, 1), visibility 1s';
                loader.style.opacity = '0';
                loader.style.visibility = 'hidden';
            }, 800); // Tempo sutil para apreciação da marca
        });
    }
};

// =========================================================================
// 2. HEADER INTELIGENTE & MENU MOBILE
// =========================================================================
const XenithHeader = {
    init() {
        this.header = document.querySelector('[data-xenith-header]');
        this.menuToggle = document.querySelector('[data-menu-toggle]');
        this.navMenu = document.querySelector('[data-nav-menu]');
        this.backToTopBtn = document.querySelector('[data-back-top]');
        
        if (this.header) {
            window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
            this.handleScroll(); // Check inicial
        }
        
        if (this.menuToggle && this.navMenu) {
            this.menuToggle.addEventListener('click', () => this.toggleMenu());
        }

        if (this.backToTopBtn) {
            this.backToTopBtn.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
    },

    handleScroll() {
        const scrollTop = window.scrollY;

        // Header Glassmorphism
        if (scrollTop > XenithConfig.scrollThreshold) {
            this.header.classList.add('header-glass');
        } else {
            this.header.classList.remove('header-glass');
        }

        // Botão Voltar ao Topo
        if (this.backToTopBtn) {
            if (scrollTop > window.innerHeight) {
                this.backToTopBtn.classList.add('btn-top-visible');
            } else {
                this.backToTopBtn.classList.remove('btn-top-visible');
            }
        }
    },

    toggleMenu() {
        const isOpen = this.navMenu.classList.toggle('menu-active');
        this.menuToggle.classList.toggle('toggle-active');
        this.menuToggle.setAttribute('aria-expanded', isOpen);
        
        // Bloqueia o scroll do body em mobile para manter o silêncio visual
        document.body.style.overflow = isOpen ? 'hidden' : '';
    }
};

// =========================================================================
// 3. NAVEGAÇÃO, SCROLL SUAVE E HIGHLIGHT DE LINKS
// =========================================================================
const XenithNavigation = {
    init() {
        this.links = document.querySelectorAll('[data-scroll-link]');
        this.sections = document.querySelectorAll('section[id]');
        
        this.links.forEach(link => {
            link.addEventListener('click', (e) => this.smoothScroll(e));
        });

        if (this.sections.length > 0) {
            this.initSectionHighlighter();
        }
    },

    smoothScroll(e) {
        e.preventDefault();
        const targetId = e.currentTarget.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (!targetSection) return;

        // Fecha menu mobile se estiver aberto
        if (XenithHeader.navMenu?.classList.contains('menu-active')) {
            XenithHeader.toggleMenu();
        }

        const headerOffset = XenithHeader.header?.offsetHeight || 0;
        const elementPosition = targetSection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    },

    initSectionHighlighter() {
        const options = { rootMargin: '-40% 0px -50% 0px' };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    this.links.forEach(link => {
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('nav-link-active');
                        } else {
                            link.classList.remove('nav-link-active');
                        }
                    });
                }
            });
        }, options);

        this.sections.forEach(section => observer.observe(section));
    }
};

// =========================================================================
// 4. ANIMAÇÕES DE SCROLL (REVELAÇÃO), HERO PARALLAX E CONTADORES
// =========================================================================
const XenithScrollEffects = {
    init() {
        this.revealElements = document.querySelectorAll('[data-xenith-reveal], [data-xenith-card]');
        this.counters = document.querySelectorAll('[data-xenith-counter]');
        this.heroImage = document.querySelector('[data-parallax-hero]');

        if (this.revealElements.length > 0) this.initRevealObserver();
        if (this.counters.length > 0) this.initCounterObserver();
        if (this.heroImage) this.initHeroParallax();
    },

    initRevealObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    // Desobserva para otimizar performance após a primeira animação suave
                    observer.unobserve(entry.target);
                }
            });
        }, XenithConfig.observerOptions);

        this.revealElements.forEach(el => el.classList.add('reveal-init'));
        this.revealElements.forEach(el => observer.observe(el));
    },

    initCounterObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        this.counters.forEach(counter => observer.observe(counter));
    },

    animateCounter(counter) {
        const target = +counter.dataset.xenithCounter;
        const duration = 2000; // 2 segundos de transição refinada
        const startTime = performance.now();

        const updateNumber = (currentTime) => {
            const elapsedTime = currentTime - startTime;
            if (elapsedTime < duration) {
                const progress = elapsedTime / duration;
                // Easing outQuad para desaceleração premium no final
                const easeProgress = progress * (2 - progress);
                counter.innerText = Math.floor(easeProgress * target);
                requestAnimationFrame(updateNumber);
            } else {
                counter.innerText = target;
            }
        };

        requestAnimationFrame(updateNumber);
    },

    initHeroParallax() {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            // requestAnimationFrame implícito pelo motor do navegador usando transform3d para aceleração por hardware
            this.heroImage.style.transform = `translate3d(0, ${scrolled * XenithConfig.parallaxSpeed}px, 0)`;
        }, { passive: true });
    }
};

// =========================================================================
// 5. COMPONENTES INTERATIVOS (RIPPLE EFFECT & GALERIA PREMIUM)
// =========================================================================
const XenithInteractiveComponents = {
    init() {
        this.buttons = document.querySelectorAll('[data-xenith-btn]');
        this.galleryItems = document.querySelectorAll('[data-gallery-item]');
        
        if (this.buttons.length > 0) this.initRipple();
        if (this.galleryItems.length > 0) this.initGallery();
    },

    initRipple() {
        this.buttons.forEach(button => {
            button.addEventListener('click', function(e) {
                const x = e.clientX - e.target.getBoundingClientRect().left;
                const y = e.clientY - e.target.getBoundingClientRect().top;
                
                const ripple = document.createElement('span');
                ripple.classList.add('xenith-ripple');
                ripple.style.left = `${x}px`;
                ripple.style.top = `${y}px`;
                
                this.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 600);
            });
        });
    },

    initGallery() {
        // Cria estrutura do Lightbox Dinamicamente para manter o HTML limpo
        const lightbox = document.createElement('div');
        lightbox.id = 'xenith-lightbox';
        lightbox.classList.add('lightbox-hidden');
        lightbox.innerHTML = `
            <button class="lightbox-close" aria-label="Fechar">&times;</button>
            <button class="lightbox-nav prev" aria-label="Anterior">&#8249;</button>
            <div class="lightbox-content">
                <img src="" alt="Xenith Luxury Vehicle">
            </div>
            <button class="lightbox-nav next" aria-label="Próximo">&#8250;</button>
        `;
        document.body.appendChild(lightbox);

        const imgContainer = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.prev');
        const nextBtn = lightbox.querySelector('.next');
        let currentImgArray = [];
        let currentIndex = 0;

        this.galleryItems.forEach((item) => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                // Coleta imagens do mesmo grupo/galeria se houver via dataset
                const group = item.dataset.galleryGroup;
                currentImgArray = group 
                    ? Array.from(document.querySelectorAll(`[data-gallery-group="${group}"]`))
                    : Array.from(this.galleryItems);
                
                currentIndex = currentImgArray.indexOf(item);
                openImage(item.getAttribute('href') || item.dataset.src);
            });
        });

        const openImage = (src) => {
            imgContainer.style.opacity = '0';
            imgContainer.src = src;
            lightbox.classList.remove('lightbox-hidden');
            document.body.style.overflow = 'hidden';
            
            imgContainer.onload = () => {
                imgContainer.style.transition = 'opacity 0.5s ease';
                imgContainer.style.opacity = '1';
            };
        };

        const closeLightbox = () => {
            lightbox.classList.add('lightbox-hidden');
            document.body.style.overflow = '';
        };

        const navigate = (direction) => {
            currentIndex = (currentIndex + direction + currentImgArray.length) % currentImgArray.length;
            const nextTarget = currentImgArray[currentIndex];
            openImage(nextTarget.getAttribute('href') || nextTarget.dataset.src);
        };

        closeBtn.addEventListener('click', closeLightbox);
        prevBtn.addEventListener('click', () => navigate(-1));
        nextBtn.addEventListener('click', () => navigate(1));
        
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
                closeLightbox();
            }
        });

        // Atalhos de teclado premium
        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('lightbox-hidden')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') navigate(1);
            if (e.key === 'ArrowLeft') navigate(-1);
        });
    }
};

// =========================================================================
// 6. CURSOR PREMIUM PERSONALIZADO (DISCRETO E OPCIONAL)
// =========================================================================
const XenithPremiumCursor = {
    init() {
        // Desativado em dispositivos móveis/touch por padrão de usabilidade
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

        const cursor = document.createElement('div');
        cursor.id = 'xenith-premium-cursor';
        document.body.appendChild(cursor);

        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Render Loop com interpolação linear (LERP) para suavidade extrema
        const render = () => {
            cursorX += (mouseX - cursorX) * XenithConfig.cursorDelay;
            cursorY += (mouseY - cursorY) * XenithConfig.cursorDelay;
            
            cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
            requestAnimationFrame(render);
        };
        requestAnimationFrame(render);

        // Feedback sutil em interações
        const interactiveElements = document.querySelectorAll('a, button, [data-xenith-card], .gallery-item');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
        });
    }
};

// =========================================================================
// 7. SISTEMA ESCALÁVEL DE DADOS DINÂMICOS (VEÍCULOS E NOTÍCIAS)
// =========================================================================
const XenithDynamicData = {
    init() {
        // Expondo métodos na janela para permitir injeção de dados de forma assíncrona futuramente (via CMS ou APIs)
        window.XenithAPI = {
            loadNews: this.loadNews,
            openVehicleProfile: this.openVehicleProfile
        };
    },

    /**
     * Prepara o carregamento modular de notícias futuras
     * @param {Array} newsArray - Vetor de objetos contendo os metadados da notícia
     * @param {string} targetContainerSelector - ID ou Classe do container onde o feed será renderizado
     */
    loadNews(newsArray, targetContainerSelector) {
        const container = document.querySelector(targetContainerSelector);
        if (!container || !newsArray) return;

        container.innerHTML = newsArray.map(item => `
            <article class="news-card reveal-init" data-xenith-reveal>
                <div class="news-img-wrapper">
                    <img src="${item.image}" alt="${item.title}" loading="lazy">
                </div>
                <div class="news-meta">
                    <span class="news-date">${item.date}</span>
                    <span class="news-category">${item.category}</span>
                </div>
                <h3>${item.title}</h3>
                <p>${item.excerpt}</p>
                <a href="${item.link}" class="xenith-link-subtle" data-xenith-btn>Read Architecture</a>
            </article>
        `).join('');

        // Reinicializa o observer de scroll para aplicar o fade-in nos novos elementos adicionados
        XenithScrollEffects.initRevealObserver();
    },

    /**
     * Redireciona ou abre o modal de especificação técnica de um veículo
     * @param {string} vehicleId - ID único do modelo (ex: 'xenith-quadra', 'xenith-apex')
     */
    openVehicleProfile(vehicleId) {
        if (!vehicleId) return;
        
        // Exemplo de transição elegante pré-redirecionamento ou abertura assíncrona
        const transitionOverlay = document.querySelector('[data-xenith-loader]');
        if (transitionOverlay) {
            transitionOverlay.style.visibility = 'visible';
            transitionOverlay.style.opacity = '1';
        }
        
        setTimeout(() => {
            window.location.href = `/models/${vehicleId}`;
        }, 600); // Aguarda o fade out da interface atual de maneira suave
    }
};
                  
