let currentPaletteColors = [];

function generateRandomColor() {
    const chars = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += chars[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Generate designer colors matching a base color to avoid random brown/gray clashes!
function generateMatchingShades(baseHex, arrangement) {
    // Basic HEX parse
    let hex = baseHex.replace('#', '');
    if (hex.length === 3) {
        hex = hex.split('').map(c => c + c).join('');
    }
    if (hex.length !== 6) hex = '3498db'; // fallback
    
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    
    const shades = [];
    
    for (let i = 0; i < 5; i++) {
        let nr = r, ng = g, nb = b;
        
        if (arrangement === 'Monochromatic') {
            // Adjust brightness sharding
            const factor = 0.4 + (i * 0.25); // 0.4 to 1.4
            nr = Math.min(255, Math.max(0, Math.round(r * factor)));
            ng = Math.min(255, Math.max(0, Math.round(g * factor)));
            nb = Math.min(255, Math.max(0, Math.round(b * factor)));
        } else if (arrangement === 'Analogous') {
            // Adjust hue rotation offsets
            const offset = (i - 2) * 25;
            nr = Math.min(255, Math.max(0, r + offset));
            ng = Math.min(255, Math.max(0, g - offset));
            nb = Math.min(255, Math.max(0, b + (offset * 1.2)));
        } else if (arrangement === 'Contrasting') {
            // Flip components for contrast
            if (i === 1) { nr = 255 - r; ng = 255 - g; }
            if (i === 3) { ng = 255 - g; nb = 255 - b; }
            if (i === 4) { nr = 255 - r; nb = 255 - b; }
        } else {
            // Harmonious/default
            const offset = (i - 2) * 15;
            nr = Math.min(255, Math.max(0, r + offset));
            ng = Math.min(255, Math.max(0, g + offset));
            nb = Math.min(255, Math.max(0, b + offset));
        }
        
        const shHex = '#' + [nr, ng, nb].map(x => {
            const hexStr = x.toString(16);
            return hexStr.length === 1 ? '0' + hexStr : hexStr;
        }).join('').toUpperCase();
        
        shades.push(shHex);
    }
    
    return shades;
}

function createPalette(colorsOverride = null) {
    const container = document.getElementById('palette-container');
    if (!container) return;

    container.innerHTML = '';
    
    const colors = colorsOverride || [];
    if (colors.length === 0) {
        for (let i = 0; i < 5; i++) {
            colors.push(generateRandomColor());
        }
    }
    
    currentPaletteColors = colors;

    colors.forEach(color => {
        const swatch = document.createElement('div');
        swatch.className = 'color-swatch';
        swatch.style.backgroundColor = color;
        swatch.innerHTML = `<span>${color}</span>`;
        
        swatch.addEventListener('click', (e) => {
            e.stopPropagation();
            navigator.clipboard.writeText(color);
            const label = swatch.querySelector('span');
            if (label) {
                label.innerText = 'COPIED!';
                setTimeout(() => label.innerText = color, 800);
            }
        });
        
        container.appendChild(swatch);
    });
}

const DESIGN_CAMPAIGNS = [
    {
        title: 'Adobe Creative Cloud Suite',
        desc: 'Get all your favorite design tools in one place. Limited time offer for students.',
        promo: 'CODE "CREATIVECO" FOR 60% STUDENT DISCOUNT',
        img: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=200&h=200&q=80'
    },
    {
        title: 'Figma Professional Edition',
        desc: 'Co-create in real-time with advanced auto-layouts, variables, and dev modes.',
        promo: 'CODE "FIGMAPRO20" FOR 20% DISCOUNT',
        img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&h=200&q=80'
    },
    {
        title: 'Creative Classrooms Live',
        desc: 'Learn editorial grids, spacing parameters, and branding layouts from elite agency heads.',
        promo: 'CLAIM RESERVED ACCESS: CLASSROOM',
        img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=200&h=200&q=80'
    },
    {
        title: 'Keychron Q1 Pro Keyboard',
        desc: 'Fully customizable mechanical keyboards with double-gasket designs. 15% off.',
        promo: 'CLAIM 15% KEYBOARD: KEYCHRON15',
        img: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=200&h=200&q=80'
    },
    {
        title: 'Shutterstock Asset Vault',
        desc: 'Claim 15 free vector templates, photos, and soundtrack elements this month.',
        promo: 'GET 15 FREE ASSETS: SHUTTERVAULT',
        img: 'https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&w=200&h=200&q=80'
    },
    {
        title: 'Aura Luxury Figma UI Kit',
        desc: '400+ sharded dark-mode components and layouts to ship micro-apps in record time.',
        promo: 'GET FIGMA ACCESS CODE: AURAKIT26',
        img: 'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?auto=format&fit=crop&w=200&h=200&q=80'
    }
];

let adsDisabled = false;
let interactionCount = 0;

// Inspect palette details analysis modal popup
function openDetail(colors) {
    const modal = document.getElementById('detailModal');
    const body = document.getElementById('modalBody');
    if (!modal || !body) return;

    body.innerHTML = `
        <div class="modal-hero" style="display:flex; height:200px; border-radius:16px; overflow:hidden; margin-bottom:2rem; box-shadow:0 10px 25px rgba(0,0,0,0.15);">
            ${colors.map(c => `<div style="flex:1; background:${c}"></div>`).join('')}
        </div>
        <h2 style="font-size:2.2rem; font-family: 'Space Grotesk', sans-serif; font-weight:700; margin:1rem 0; color:#0b0b0f; letter-spacing:-0.5px;">Palette Harmony Analysis</h2>
        <p style="font-size:1.05rem; color:#444; line-height:1.6; margin-bottom:2rem;">This palette uses a ${['Harmonious', 'Contrasting', 'Monochromatic', 'Analogous'][Math.floor(Math.random()*4)]} arrangement, ideal for ${['Modern UI', 'Corporate Branding', 'Digital Illustrations', 'Minimal Editorial Prototyping'][Math.floor(Math.random()*4)]}.</p>
        
        <div class="extensive-info" style="background:#fafafa; border:1px solid rgba(0,0,0,0.06); padding:2rem; border-radius:16px; margin-bottom:2rem;">
            <h3 style="margin-bottom:1.5rem; font-family:'Space Grotesk',sans-serif; font-size:1.15rem; font-weight:700;">Color Specifications</h3>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:2rem;">
                ${colors.map(c => `
                    <div style="display:flex; align-items:center; gap:1rem;">
                        <div style="width:40px; height:40px; background:${c}; border-radius:8px; border:1px solid rgba(0,0,0,0.1);"></div>
                        <div>
                            <strong>HEX:</strong> ${c}<br>
                            <span style="font-size:0.8rem; color:#888;">RGB: ${hexToRgb(c)}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    // Choose sponsored asset inside details popup
    const detailCampaign = DESIGN_CAMPAIGNS[Math.floor(Math.random() * DESIGN_CAMPAIGNS.length)];
    const detailImg = document.getElementById('detail-ad-img');
    const detailTitle = document.getElementById('detail-ad-title');
    const detailDesc = document.getElementById('detail-ad-desc');
    
    if (detailImg) detailImg.src = detailCampaign.img;
    if (detailTitle) detailTitle.innerText = detailCampaign.title;
    if (detailDesc) detailDesc.innerText = detailCampaign.desc;

    modal.style.display = 'flex';
}

function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r}, ${g}, ${b}`;
}

document.querySelector('.close-modal')?.addEventListener('click', () => {
    document.getElementById('detailModal').style.display = 'none';
});

window.onclick = (event) => {
    const modal = document.getElementById('detailModal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}


// --- 2. Custom HEX Palette Creator System ---
const paletteModal = document.getElementById('paletteModal');
const btnOpenPaletteCreator = document.getElementById('btn-open-palette-creator');
const btnClosePaletteModal = document.getElementById('btn-close-palette-modal');

if (btnOpenPaletteCreator) {
    btnOpenPaletteCreator.addEventListener('click', () => {
        if (paletteModal) paletteModal.style.display = 'flex';
    });
}

if (btnClosePaletteModal) {
    btnClosePaletteModal.addEventListener('click', () => {
        if (paletteModal) paletteModal.style.display = 'none';
    });
}

function submitCustomPalette() {
    let baseHex = document.getElementById('palette-base-hex').value.trim();
    const arrangement = document.getElementById('palette-arrangement').value;

    if (!baseHex) {
        alert('❌ Please specify a base color hex code.');
        return;
    }
    if (!baseHex.startsWith('#')) {
        baseHex = '#' + baseHex;
    }

    // Generate shades
    const generated = generateMatchingShades(baseHex, arrangement);

    if (paletteModal) paletteModal.style.display = 'none';
    document.getElementById('custom-palette-form').reset();

    // Trigger interstitial countdown ad before updating
    showSessionInterstitialAd(() => {
        createPalette(generated);
    });
}

// Hook details inspector trigger
document.getElementById('btn-expand-details')?.addEventListener('click', () => {
    showSessionInterstitialAd(() => {
        openDetail(currentPaletteColors);
    });
});


// --- 3. Programmatic Rotating Sponsor Banner ---
let bannerIndex = 0;
function startRotatingBanner() {
    const banner = document.getElementById('floating-ad-banner');
    if (!banner || adsDisabled) return;

    const campaign = DESIGN_CAMPAIGNS[bannerIndex];
    bannerIndex = (bannerIndex + 1) % DESIGN_CAMPAIGNS.length;

    banner.innerHTML = `
        <div class="ad-sponsor-container">
            <img src="${campaign.img}" alt="${campaign.title}">
            <div class="banner-content">
                <p>Curated Design Sponsor</p>
                <strong>${campaign.title}</strong>
            </div>
        </div>
        <div class="banner-actions">
            <button class="btn-banner-action" id="btn-banner-claim">Claim Discount</button>
            <button class="btn-banner-close" id="btn-banner-close">×</button>
        </div>
    `;

    banner.style.display = 'flex';

    // Hook listeners
    document.getElementById('btn-banner-claim')?.addEventListener('click', () => {
        alert(`🎉 Copied discount code: "${campaign.promo.split('"')[1] || 'HUEPRO26'}" to clipboard!`);
        window.open('#', '_blank');
    });

    document.getElementById('btn-banner-close')?.addEventListener('click', () => {
        banner.style.display = 'none';
    });
}

// Initial banner launch and rotate every 10 seconds
setTimeout(() => {
    startRotatingBanner();
    setInterval(startRotatingBanner, 10000);
}, 2000);


// --- 4. Decoupled Timed Interstitial Countdown System ---
let interstitialCallback = null;
let interstitialTimer = null;
const interstitialModal = document.getElementById('interstitialModal');
const btnSkipAd = document.getElementById('btn-skip-ad');
const btnClaimAd = document.getElementById('btn-claim-ad');

function showSessionInterstitialAd(onClosed) {
    if (adsDisabled || !interstitialModal) {
        onClosed();
        return;
    }
    
    interstitialCallback = onClosed;
    
    // Choose a random campaign
    const campaign = DESIGN_CAMPAIGNS[Math.floor(Math.random() * DESIGN_CAMPAIGNS.length)];
    const imgEl = document.getElementById('interstitial-ad-img');
    const titleEl = document.getElementById('interstitial-ad-title');
    const descEl = document.getElementById('interstitial-ad-desc');
    const promoEl = document.getElementById('interstitial-ad-promo');
    
    if (imgEl) imgEl.src = campaign.img;
    if (titleEl) titleEl.innerText = campaign.title;
    if (descEl) descEl.innerText = campaign.desc;
    if (promoEl) promoEl.innerText = campaign.promo;

    interstitialModal.style.display = 'flex';
    
    btnSkipAd.disabled = true;
    btnSkipAd.style.opacity = '0.4';
    btnSkipAd.style.cursor = 'not-allowed';
    btnSkipAd.innerText = 'Skip Ad in 5s';
    
    let count = 5;
    if (interstitialTimer) clearInterval(interstitialTimer);
    
    interstitialTimer = setInterval(() => {
        count--;
        if (count > 0) {
            btnSkipAd.innerText = `Skip Ad in ${count}s`;
        } else {
            clearInterval(interstitialTimer);
            btnSkipAd.innerText = 'Skip Ad';
            btnSkipAd.disabled = false;
            btnSkipAd.style.opacity = '1';
            btnSkipAd.style.cursor = 'pointer';
        }
    }, 1000);
}

if (btnSkipAd) {
    btnSkipAd.addEventListener('click', () => {
        interstitialModal.style.display = 'none';
        
        // Trigger success synchronization celebration modal!
        const celebrationModal = document.getElementById('celebrationModal');
        if (celebrationModal) {
            celebrationModal.style.display = 'flex';
        } else if (interstitialCallback) {
            interstitialCallback();
        }
    });
}

if (btnClaimAd) {
    btnClaimAd.addEventListener('click', () => {
        alert('🎉 Design discount loaded to checkout session!');
        interstitialModal.style.display = 'none';
        
        const celebrationModal = document.getElementById('celebrationModal');
        if (celebrationModal) {
            celebrationModal.style.display = 'flex';
        } else if (interstitialCallback) {
            interstitialCallback();
        }
    });
}

// Celebration close handler
const btnCloseCelebrationModal = document.getElementById('btn-close-celebration');
if (btnCloseCelebrationModal) {
    btnCloseCelebrationModal.addEventListener('click', () => {
        document.getElementById('celebrationModal').style.display = 'none';
        if (interstitialCallback) {
            interstitialCallback();
            interstitialCallback = null;
        }
    });
}


// --- 5. Scarcity Upgrade Tier & Timer Engine ---
let upgradeTimer = null;
const premiumUpgradeModal = document.getElementById('premiumUpgradeModal');

function triggerUpgradeModal() {
    if (adsDisabled || !premiumUpgradeModal) return;
    
    premiumUpgradeModal.style.display = 'flex';
    let duration = 600; // 10 minutes
    const countdownEl = document.getElementById('scarcity-countdown');

    if (upgradeTimer) clearInterval(upgradeTimer);

    upgradeTimer = setInterval(() => {
        duration--;
        const minutes = Math.floor(duration / 60);
        const seconds = duration % 60;
        if (countdownEl) {
            countdownEl.innerText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        if (duration <= 0) {
            clearInterval(upgradeTimer);
            premiumUpgradeModal.style.display = 'none';
        }
    }, 1000);
}

// Trigger upgrade modal after 40 seconds of active color generation
setTimeout(triggerUpgradeModal, 40000);

document.getElementById('btn-skip-upgrade')?.addEventListener('click', () => {
    premiumUpgradeModal.style.display = 'none';
    clearInterval(upgradeTimer);
});

// Acknowledge upgrade purchase (disable ads)
document.getElementById('btn-upgrade-now')?.addEventListener('click', () => {
    alert('🏆 Welcome to HueFlow Pro! Premium Figma tools unlocked, sponsor cells silenced.');
    adsDisabled = true;
    premiumUpgradeModal.style.display = 'none';
    const banner = document.getElementById('floating-ad-banner');
    if (banner) banner.style.display = 'none';
    clearInterval(upgradeTimer);
});


// --- 6. Exit Intent & Mock Ad-Blocker Overlays ---
let exitIntentShown = false;
document.addEventListener("mouseout", (e) => {
    if (e.clientY < 0 && !exitIntentShown && !adsDisabled) {
        exitIntentShown = true;
        const exitModal = document.getElementById("exitIntentModal");
        if (exitModal) exitModal.style.display = "flex";
    }
});

document.getElementById("closeExitIntent")?.addEventListener("click", () => {
    document.getElementById("exitIntentModal").style.display = "none";
});
document.getElementById("declineExitIntent")?.addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("exitIntentModal").style.display = "none";
});

// Trigger Mock ad blocker Whitelist popups after 5 seconds
setTimeout(() => {
    if (adsDisabled) return;
    const isAdBlockerActive = Math.random() < 0.15; // 15% simulation chance
    if (isAdBlockerActive) {
        const adBlockModal = document.getElementById("adBlockModal");
        if (adBlockModal) adBlockModal.style.display = "flex";
    }
}, 5000);

document.getElementById('btn-adblock-premium')?.addEventListener('click', () => {
    alert('🏆 Pro Activated! Ad overlays disabled.');
    adsDisabled = true;
    document.getElementById("adBlockModal").style.display = "none";
    const banner = document.getElementById('floating-ad-banner');
    if (banner) banner.style.display = 'none';
});

// Generator triggers
document.getElementById('generate-btn')?.addEventListener('click', () => {
    createPalette();
});

window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        createPalette();
    }
});

// Initial load
window.onload = () => {
    createPalette();
};
