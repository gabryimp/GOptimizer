/**
 * G OPTIMIZER 2.0 • INTERACTIVE SUITE JAVASCRIPT
 * Handles comparison slider, dynamic calculator, checkout modal, FAQ accordion, and navigation.
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. Mobile Menu Navigation
       ========================================================================== */
    const mobileToggle = document.getElementById('mobileToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const navbar = document.querySelector('.navbar');

    if (mobileToggle && mobileMenu) {
        mobileToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('open');
            const icon = mobileToggle.querySelector('i');
            if (mobileMenu.classList.contains('open')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });

        // Close mobile menu when clicking any nav link
        document.querySelectorAll('.mob-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('open');
                const icon = mobileToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }

    // Add navbar background enhancement on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });


    /* ==========================================================================
       2. Interactive Before / After Comparison Slider
       ========================================================================== */
    const slider = document.getElementById('compareSlider');
    const afterOverlay = document.getElementById('afterOverlay');
    const sliderHandle = document.getElementById('sliderHandle');

    if (slider && afterOverlay && sliderHandle) {
        let isSliding = false;

        const updateSliderPosition = (clientX) => {
            const rect = slider.getBoundingClientRect();
            let offsetX = clientX - rect.left;
            let percentage = (offsetX / rect.width) * 100;

            // Clamp between 5% and 95%
            percentage = Math.max(5, Math.min(percentage, 95));

            afterOverlay.style.width = `${percentage}%`;
            sliderHandle.style.left = `${percentage}%`;
        };

        // Mouse events
        slider.addEventListener('mousedown', (e) => {
            isSliding = true;
            updateSliderPosition(e.clientX);
        });

        window.addEventListener('mousemove', (e) => {
            if (!isSliding) return;
            updateSliderPosition(e.clientX);
        });

        window.addEventListener('mouseup', () => {
            isSliding = false;
        });

        // Touch events for mobile
        slider.addEventListener('touchstart', (e) => {
            isSliding = true;
            if (e.touches[0]) updateSliderPosition(e.touches[0].clientX);
        }, { passive: true });

        window.addEventListener('touchmove', (e) => {
            if (!isSliding) return;
            if (e.touches[0]) updateSliderPosition(e.touches[0].clientX);
        }, { passive: true });

        window.addEventListener('touchend', () => {
            isSliding = false;
        });
    }


    /* ==========================================================================
       3. Dynamic Latency & FPS Calculator
       ========================================================================== */
    const calcGame = document.getElementById('calcGame');
    const calcGpu = document.getElementById('calcGpu');
    const resFps = document.getElementById('resFps');
    const resDelay = document.getElementById('resDelay');
    const resStability = document.getElementById('resStability');

    // Matrix of estimated benefits based on game + hardware tier
    const benchmarkData = {
        fivem: {
            rtx40: { fps: '+45 - 65 FPS', delay: '-72% Delay', stab: '99.8% Flat', note: 'Zero cali su Legion Square & sparatorie' },
            rtx30: { fps: '+35 - 55 FPS', delay: '-68% Delay', stab: '99.4% Flat', note: 'Texture streaming fluido a 60 FPS+' },
            rtx20: { fps: '+30 - 45 FPS', delay: '-65% Delay', stab: '98.9% Flat', note: 'Nessun crash di memoria DirectX' },
            amd:   { fps: '+35 - 50 FPS', delay: '-66% Delay', stab: '99.1% Flat', note: 'Shader cache caricata all\'avvio' },
            gtx:   { fps: '+25 - 40 FPS', delay: '-60% Delay', stab: '98.5% Flat', note: 'Recupero massimo di memoria VRAM' }
        },
        fortnite: {
            rtx40: { fps: '+60 - 85 FPS', delay: '-76% Delay', stab: '99.9% Flat', note: 'Zero frame drop in Endgame 50 player' },
            rtx30: { fps: '+50 - 70 FPS', delay: '-74% Delay', stab: '99.7% Flat', note: 'Input mouse istantaneo nei build fight' },
            rtx20: { fps: '+40 - 55 FPS', delay: '-70% Delay', stab: '99.2% Flat', note: 'Frametime stabilizzato a 144/240Hz' },
            amd:   { fps: '+45 - 65 FPS', delay: '-71% Delay', stab: '99.3% Flat', note: 'Eliminazione stuttering Unreal Engine' },
            gtx:   { fps: '+30 - 45 FPS', delay: '-65% Delay', stab: '98.7% Flat', note: 'Risoluzione 100% 3D senza lag' }
        },
        cs2: {
            rtx40: { fps: '+50 - 70 FPS', delay: '-80% Delay', stab: '99.9% Flat', note: 'Sub-tick registration 1:1 assoluta' },
            rtx30: { fps: '+40 - 60 FPS', delay: '-77% Delay', stab: '99.9% Flat', note: 'Framerate sbloccato senza micro-freeze' },
            rtx20: { fps: '+35 - 50 FPS', delay: '-72% Delay', stab: '99.5% Flat', note: 'MSI Mode attivo su audio e mouse' },
            amd:   { fps: '+40 - 55 FPS', delay: '-75% Delay', stab: '99.6% Flat', note: 'Priorità thread CPU dedicata' },
            gtx:   { fps: '+25 - 40 FPS', delay: '-68% Delay', stab: '99.0% Flat', note: 'Timer 0.500 ms costante' }
        },
        valorant: {
            rtx40: { fps: '+55 - 80 FPS', delay: '-75% Delay', stab: '99.9% Flat', note: 'Zero interferenze con Vanguard Riot' },
            rtx30: { fps: '+45 - 65 FPS', delay: '-72% Delay', stab: '99.8% Flat', note: 'Flick rapidi e pixel-perfect' },
            rtx20: { fps: '+35 - 50 FPS', delay: '-68% Delay', stab: '99.4% Flat', note: 'Priorità I/O processo a High' },
            amd:   { fps: '+40 - 60 FPS', delay: '-70% Delay', stab: '99.5% Flat', note: 'Latenza driver azzerata' },
            gtx:   { fps: '+30 - 45 FPS', delay: '-65% Delay', stab: '99.1% Flat', note: 'Frame pacing impeccabile' }
        },
        warzone: {
            rtx40: { fps: '+35 - 50 FPS', delay: '-68% Delay', stab: '99.3% Flat', note: 'Caricamento rapido delle texture Verdansk' },
            rtx30: { fps: '+30 - 45 FPS', delay: '-64% Delay', stab: '99.0% Flat', note: 'Memoria Standby ripulita ogni partita' },
            rtx20: { fps: '+25 - 38 FPS', delay: '-60% Delay', stab: '98.5% Flat', note: 'Buffer TCP/IP snellito per il gulag' },
            amd:   { fps: '+28 - 42 FPS', delay: '-62% Delay', stab: '98.8% Flat', note: 'Nessun drop con esplosioni multiple' },
            gtx:   { fps: '+20 - 32 FPS', delay: '-55% Delay', stab: '98.0% Flat', note: 'VRAM ottimizzata al limite' }
        }
    };

    function updateCalculator() {
        if (!calcGame || !calcGpu || !resFps || !resDelay || !resStability) return;
        const game = calcGame.value;
        const gpu = calcGpu.value;
        const data = benchmarkData[game] && benchmarkData[game][gpu] 
            ? benchmarkData[game][gpu] 
            : { fps: '+35 FPS', delay: '-65% Delay', stab: '99.4% Flat', note: 'Prestazioni massime garantite' };

        // Subtle animation transition
        [resFps, resDelay, resStability].forEach(el => {
            el.style.opacity = '0.4';
            el.style.transform = 'scale(0.96)';
        });

        setTimeout(() => {
            resFps.textContent = data.fps;
            resDelay.textContent = data.delay;
            resStability.textContent = data.stab;

            const noteEl = resFps.parentElement.querySelector('.res-note');
            if (noteEl) noteEl.textContent = data.note;

            [resFps, resDelay, resStability].forEach(el => {
                el.style.opacity = '1';
                el.style.transform = 'scale(1)';
                el.style.transition = 'all 0.25s ease';
            });
        }, 150);
    }

    if (calcGame && calcGpu) {
        calcGame.addEventListener('change', updateCalculator);
        calcGpu.addEventListener('change', updateCalculator);
    }


    /* ==========================================================================
       4. FAQ Accordion
       ========================================================================== */
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        if (questionBtn) {
            questionBtn.addEventListener('click', () => {
                const isOpen = item.classList.contains('open');

                // Close other items
                faqItems.forEach(other => {
                    if (other !== item) other.classList.remove('open');
                });

                // Toggle selected item
                if (isOpen) {
                    item.classList.remove('open');
                } else {
                    item.classList.add('open');
                }
            });
        }
    });

    /* ==========================================================================
       5. 14-Day Launch Countdown Timer
       ========================================================================== */
    function initCountdown() {
        const cdDays = document.getElementById('cd-days');
        const cdHours = document.getElementById('cd-hours');
        const cdMins = document.getElementById('cd-mins');
        const cdSecs = document.getElementById('cd-secs');

        if (!cdDays || !cdHours || !cdMins || !cdSecs) return;

        // Target: 14 days from current date (persisted in localStorage or 14 days ahead)
        const FOURTEEN_DAYS_MS = 14 * 24 * 60 * 60 * 1000;
        let targetTime = localStorage.getItem('goptimizer_launch_target');
        
        if (!targetTime || isNaN(targetTime) || parseInt(targetTime) < Date.now()) {
            targetTime = Date.now() + FOURTEEN_DAYS_MS;
            localStorage.setItem('goptimizer_launch_target', targetTime);
        } else {
            targetTime = parseInt(targetTime);
        }

        function updateClock() {
            const now = Date.now();
            let distance = targetTime - now;

            if (distance <= 0) {
                cdDays.textContent = '00';
                cdHours.textContent = '00';
                cdMins.textContent = '00';
                cdSecs.textContent = '00';
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            cdDays.textContent = String(days).padStart(2, '0');
            cdHours.textContent = String(hours).padStart(2, '0');
            cdMins.textContent = String(minutes).padStart(2, '0');
            cdSecs.textContent = String(seconds).padStart(2, '0');
        }

        updateClock();
        setInterval(updateClock, 1000);
    }
    initCountdown();


    /* ==========================================================================
       6. Interactive Tweaks Explorer (130+ Tweaks Catalog)
       ========================================================================== */
    const tweaksData = [
        {
            category: 'cpu',
            catName: 'CPU & Latenza',
            title: 'Kernel Timer Lock 0.500 ms',
            desc: 'Forza la risoluzione del clock di sistema tramite chiamata Kernel NtSetTimerResolution, azzerando l\'input lag del puntatore del mouse.',
            impact: '⚡ Latenza: -68%',
            badge: 'KERNEL NATIVO'
        },
        {
            category: 'cpu',
            catName: 'CPU & Latenza',
            title: 'Win32PrioritySeparation 26 Hex',
            desc: 'Configura il quantum di tempo dello scheduler di Windows a favore dell\'applicazione in primo piano, eliminando i cali di frame improvvisi.',
            impact: '⚡ Priorità Foreground: Max',
            badge: 'SCHEDULER TWEAK'
        },
        {
            category: 'cpu',
            catName: 'CPU & Latenza',
            title: 'Disable CPU Core Parking',
            desc: 'Impedisce a Windows di mandare i core logici in sospensione energetica C-State durante i giochi competitivi.',
            impact: '⚡ 100% Core Attivi',
            badge: 'CPU UNPARK'
        },
        {
            category: 'cpu',
            catName: 'CPU & Latenza',
            title: 'Thread Affinity & MMCSS Audio',
            desc: 'Assegna un thread isolato alla gestione dell\'audio e del sottosistema di input, prevenendo i disturbi di latenza DPC.',
            impact: '⚡ DPC Spikes: 0 ms',
            badge: 'AUDIO LATENCY'
        },
        {
            category: 'gpu',
            catName: 'GPU & Display',
            title: 'MSI Mode High Priority on GPU',
            desc: 'Abilita il Message Signaled Interrupts sul bus PCI-Express della scheda grafica, azzerando i ritardi hardware dei frame.',
            impact: '🎮 Interrupt: Lineare',
            badge: 'PCIE INTERRUPT'
        },
        {
            category: 'gpu',
            catName: 'GPU & Display',
            title: 'DirectX 11/12 Shader Preload',
            desc: 'Aumenta la dimensione massima della cache degli shader su disco a 10 GB, azzerando i micro-stutter al primo avvio della mappa.',
            impact: '🎮 Shader Cache: 10GB',
            badge: 'DIRECTX PIPELINE'
        },
        {
            category: 'gpu',
            catName: 'GPU & Display',
            title: 'Hardware GPU Scheduling (HAGS)',
            desc: 'Passa la gestione della memoria VRAM direttamente al processore grafico senza passare per il thread di Windows.',
            impact: '🎮 +15-25 FPS Medi',
            badge: 'HAGS DRIVER'
        },
        {
            category: 'gpu',
            catName: 'GPU & Display',
            title: 'DWM Double-Buffer Optimization',
            desc: 'Riduce la coda di composizione di Windows Desktop Window Manager per giochi eseguiti in finestra senza bordi.',
            impact: '🎮 Input Delay: Minimo',
            badge: 'BORDERLESS FIX'
        },
        {
            category: 'net',
            catName: 'Rete & Ping',
            title: 'TCP NoDelay (Disable Nagle Algorithm)',
            desc: 'Elimina l\'attesa di aggregazione dei pacchetti di rete TCP, inviando ogni comando e colpo istantaneamente al server.',
            impact: '🌐 Hit-Reg: Istantanea',
            badge: 'SUB-TICK PING'
        },
        {
            category: 'net',
            catName: 'Rete & Ping',
            title: 'DNS Benchmark Cloudflare & Google',
            desc: 'Misura la latenza reale verso i server DNS più vicini e applica automaticamente il resolver con risposta più rapida.',
            impact: '🌐 -10-18ms Ping',
            badge: 'NETSH AUTO'
        },
        {
            category: 'net',
            catName: 'Rete & Ping',
            title: 'NetworkThrottlingIndex 0xFFFFFFFF',
            desc: 'Rimuove la limitazione di banda che Windows impone ai pacchetti di rete quando ci sono applicazioni multimediali attive.',
            impact: '🌐 Throughput: 100%',
            badge: 'UNTHROTTLED'
        },
        {
            category: 'net',
            catName: 'Rete & Ping',
            title: 'MTU Packet Size Optimizer',
            desc: 'Ottimizza la dimensione massima del pacchetto TCP/UDP evitando la frammentazione dati durante gli scontri online.',
            impact: '🌐 0% Packet Loss',
            badge: 'MTU MSS FIX'
        },
        {
            category: 'ram',
            catName: 'RAM & Pulizia',
            title: 'Standby List Memory Auto-Flush',
            desc: 'Svuota la cache di memoria Standby occupata da file chiusi, liberando fino a 4 GB di RAM senza riavviare il computer.',
            impact: '🧹 RAM Liberata: +3-4 GB',
            badge: 'RAM CLEANER'
        },
        {
            category: 'ram',
            catName: 'RAM & Pulizia',
            title: 'Disable Power Throttling',
            desc: 'Impedisce a Windows di abbassare la velocità di clock della RAM e della CPU quando rileva carichi di lavoro costanti.',
            impact: '🧹 Frequenza: 100% Lock',
            badge: 'ENERGY OPTIMIZE'
        },
        {
            category: 'ram',
            catName: 'RAM & Pulizia',
            title: 'Telemetry & Diagnostic Stripper',
            desc: 'Disattiva i processi di telemetria in background che inviano periodicamente dati diagnostici ai server remoti.',
            impact: '🧹 CPU Background: 0.1%',
            badge: 'PRIVACY & SPEED'
        },
        {
            category: 'ram',
            catName: 'RAM & Pulizia',
            title: 'Xbox GameDVR & Background Capture Off',
            desc: 'Disabilita la registrazione continua di clip video in background, liberando memoria video e cicli di rendering.',
            impact: '🧹 +8-15 FPS Stabili',
            badge: 'GAMEDVR OFF'
        },
        {
            category: 'fivem',
            catName: 'FiveM & Anti-Cheat',
            title: 'FiveM Texture Memory Pool x2',
            desc: 'Aumenta il pool di allocazione delle texture per FiveM, evitando lo streaming mancante (strade trasparenti) e crash di memoria.',
            impact: '🚓 Zero Strade Invisibili',
            badge: 'RP TEXTURES'
        },
        {
            category: 'fivem',
            catName: 'FiveM & Anti-Cheat',
            title: 'FiveM Server Cache & Crash Purge',
            desc: 'Elimina le cartelle di cache server pesanti e i crash dump accumulati, preservando impostazioni grafiche e tasti assegnati.',
            impact: '🚓 Avvio Server: 2x Rapido',
            badge: '1-CLICK CLEAN'
        },
        {
            category: 'fivem',
            catName: 'FiveM & Anti-Cheat',
            title: 'Echo & Devour Screenshare Safe-Lock',
            desc: 'Preserva i 10 servizi obbligatori Windows (DPS, BAM, SysMain, EventLog). Supera i controlli screenshare degli staffer al 100%.',
            impact: '🚓 0 Ban PC-Check',
            badge: 'STAFFER COMPLIANT'
        }
    ];

    function initTweaksExplorer() {
        const grid = document.getElementById('tweakGrid');
        const searchInput = document.getElementById('tweakSearchInput');
        const pills = document.querySelectorAll('#tweakPills .filter-pill');

        if (!grid) return;

        let currentCategory = 'all';
        let searchQuery = '';

        function renderTweaks() {
            grid.innerHTML = '';

            const filtered = tweaksData.filter(item => {
                const matchesCat = currentCategory === 'all' || item.category === currentCategory;
                const matchesSearch = searchQuery === '' || 
                    item.title.toLowerCase().includes(searchQuery) || 
                    item.desc.toLowerCase().includes(searchQuery) ||
                    item.catName.toLowerCase().includes(searchQuery);
                return matchesCat && matchesSearch;
            });

            if (filtered.length === 0) {
                grid.innerHTML = `
                    <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-secondary);">
                        <i class="fa-solid fa-filter-circle-xmark" style="font-size: 2.5rem; margin-bottom: 12px; color: var(--purple-light);"></i>
                        <p style="font-size: 1.1rem; font-weight: 600;">Nessun tweak trovato per "${searchQuery}"</p>
                        <p style="font-size: 0.85rem;">Prova a cercare con un altro termine come "MSI", "Timer", "RAM" o seleziona "Tutti".</p>
                    </div>
                `;
                return;
            }

            filtered.forEach(tweak => {
                const card = document.createElement('div');
                card.className = 'tweak-item-card';

                const catClass = `cat-${tweak.category}`;

                card.innerHTML = `
                    <div>
                        <div class="tweak-head">
                            <span class="tweak-cat-badge ${catClass}">${tweak.catName}</span>
                            <span style="font-family: var(--font-mono); font-size: 0.72rem; color: #94A3B8;">${tweak.badge}</span>
                        </div>
                        <h4 class="tweak-title">${tweak.title}</h4>
                        <p class="tweak-desc">${tweak.desc}</p>
                    </div>
                    <div class="tweak-foot">
                        <span class="tweak-impact">${tweak.impact}</span>
                        <span style="color: #34D399; font-weight: 600;"><i class="fa-solid fa-circle-check"></i> Sicuro al 100%</span>
                    </div>
                `;
                grid.appendChild(card);
            });
        }

        pills.forEach(pill => {
            pill.addEventListener('click', () => {
                pills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                currentCategory = pill.getAttribute('data-cat') || 'all';
                renderTweaks();
            });
        });

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                searchQuery = e.target.value.toLowerCase().trim();
                renderTweaks();
            });
        }

        renderTweaks();
    }
    initTweaksExplorer();


    /* ==========================================================================
       7. Smartphone Mockup Live Stats Simulation
       ========================================================================== */
    function initPhoneMockup() {
        const phoneFps = document.getElementById('phoneFps');
        const phoneTemp = document.getElementById('phoneTemp');

        if (!phoneFps || !phoneTemp) return;

        setInterval(() => {
            // Subtle natural FPS variation around 164-168
            const randomFps = 163 + Math.floor(Math.random() * 6);
            phoneFps.textContent = `${randomFps} FPS`;

            // Subtle temperature variation around 58-61°C
            const randomTemp = 58 + Math.floor(Math.random() * 4);
            phoneTemp.textContent = `${randomTemp}°C`;
        }, 2500);
    }
    initPhoneMockup();

});


/* ==========================================================================
   5. Checkout Modal & Actions (Global functions called from HTML onclick)
   ========================================================================== */
const tierDetails = {
    '1M': {
        badge: 'PIANO STARTER • 1 MESE',
        title: 'Licenza G Optimizer 2.0 (30 Giorni)',
        price: '5.99€'
    },
    '3M': {
        badge: 'PIANO PRO • 3 MESI (MIGLIOR RAPPORTO)',
        title: 'Licenza G Optimizer 2.0 (90 Giorni)',
        price: '15.00€'
    },
    'LIFE': {
        badge: '👑 ACCESSO ILLIMITATO • LIFETIME',
        title: 'Licenza G Optimizer 2.0 (A Vita)',
        price: '25.00€'
    }
};

function openCheckout(tier, price) {
    const modal = document.getElementById('checkoutModal');
    const badgeEl = document.getElementById('modalPlanBadge');
    const titleEl = document.getElementById('modalPlanTitle');
    const priceEl = document.getElementById('modalPlanPrice');

    if (!modal) return;

    const info = tierDetails[tier] || {
        badge: 'LICENZA UFFICIALE',
        title: 'Licenza G Optimizer 2.0',
        price: price || '25.00€'
    };

    if (badgeEl) badgeEl.textContent = info.badge;
    if (titleEl) titleEl.textContent = info.title;
    if (priceEl) priceEl.textContent = info.price;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Lock background scroll
}

function closeCheckout() {
    const modal = document.getElementById('checkoutModal');
    if (!modal) return;

    modal.classList.remove('active');
    document.body.style.overflow = ''; // Unlock background scroll
}

// Close modal on click outside card
window.addEventListener('click', (e) => {
    const modal = document.getElementById('checkoutModal');
    if (modal && e.target === modal) {
        closeCheckout();
    }
});

// Close modal on Escape key
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeCheckout();
    }
});

// One-click Copy Helper
function copyText(elementId, btn) {
    const textEl = document.getElementById(elementId);
    if (!textEl) return;

    const textToCopy = textEl.textContent || textEl.innerText;

    navigator.clipboard.writeText(textToCopy).then(() => {
        const originalHtml = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-check"></i> Copiato!';
        btn.style.background = '#10B981';
        btn.style.color = '#ffffff';
        btn.style.borderColor = '#10B981';

        setTimeout(() => {
            btn.innerHTML = originalHtml;
            btn.style.background = '';
            btn.style.color = '';
            btn.style.borderColor = '';
        }, 2200);
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}

/* ==========================================================================
   6. Remote Phone Mockup RAM Clean Simulation
   ========================================================================== */
function simulatePhoneClean() {
    const btn = document.getElementById('phoneCleanBtn');
    const textSpan = document.getElementById('phoneCleanText');
    const ramSpan = document.getElementById('phoneRam');

    if (!btn || !textSpan || !ramSpan) return;

    btn.disabled = true;
    textSpan.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Pulizia Standby...';
    btn.style.opacity = '0.7';

    setTimeout(() => {
        ramSpan.textContent = '22%';
        ramSpan.className = 'phone-stat-num text-green';
        textSpan.innerHTML = '<i class="fa-solid fa-check"></i> RAM Flush: +2.8 GB!';
        btn.style.background = 'linear-gradient(135deg, #10B981 0%, #059669 100%)';
        btn.style.opacity = '1';

        setTimeout(() => {
            btn.disabled = false;
            textSpan.textContent = 'Pulisci RAM Standby Ora';
            btn.style.background = '';
            ramSpan.className = 'phone-stat-num text-gold';
            ramSpan.textContent = '38%';
        }, 3200);
    }, 900);
}

