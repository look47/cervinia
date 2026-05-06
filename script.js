let offset = 0, checkIn = null, checkOut = null, ad = 2, ch = 0, currentIndex = 0;
let currentLang = localStorage.getItem('cervinia_lang') || 'it';
let bookedDates = [];
const photos = Array.from({length: 20}, (_, i) => `foto${i+1}.webp`);

const reviewsData = [
    { date: "Gennaio 2024", stars: 5, it: "Posizione da sogno, esci di casa con gli sci ai piedi. Casa caldissima e moderna.", en: "Dream location, ski-out directly from the door. Very warm and modern house." },
    { date: "Febbraio 2024", stars: 5, it: "Ristrutturazione incredibile. Il garage privato a Cervinia è un vero lusso.", en: "Incredible renovation. Having a private garage in Cervinia is a true luxury." },
    { date: "Marzo 2024", stars: 5, it: "Vista Cervino pazzesca. Tutto perfetto per la nostra famiglia di 5 persone.", en: "Amazing Matterhorn view. Everything was perfect for our family of 5." },
    { date: "Dicembre 2024", stars: 5, it: "Il miglior ski-in ski-out mai provato. Pulizia impeccabile.", en: "The best ski-in ski-out we've ever tried. Impeccable cleanliness." },
    { date: "Gennaio 2025", stars: 5, it: "Host disponibilissimo. La Pista 16 è letteralmente sotto il balcone.", en: "Very helpful host. Slope 16 is literally below the balcony." },
    { date: "Febbraio 2025", stars: 5, it: "Moderno, funzionale e accogliente. Torneremo sicuramente l'anno prossimo.", en: "Modern, functional, and cozy. We will definitely be back next year." }
];

function renderReviews() {
    const container = document.getElementById("reviews-grid");
    if(!container) return;
    container.innerHTML = "";
    reviewsData.forEach(r => {
        let stars = ""; for(let i=0; i<r.stars; i++) stars += '<i class="fas fa-snowflake snowflake-gold"></i>';
        container.innerHTML += `<div class="rev-card"><div style="display:flex; justify-content:space-between; margin-bottom:10px;"><span>${stars}</span><span style="font-size:11px; opacity:0.5;">${r.date}</span></div><div style="font-size:14px; font-style:italic;">"${currentLang==='it'?r.it:r.en}"</div></div>`;
    });
}

function renderCalendar() {
    const container = document.getElementById("calendar-render");
    if(!container) return;
    container.innerHTML = "";
    const now = new Date();
    for(let m=0; m<2; m++) {
        const date = new Date(now.getFullYear(), now.getMonth() + offset + m, 1);
        const name = date.toLocaleString(currentLang==='it'?'it-IT':'en-US', {month:'long', year:'numeric'});
        let html = `<div class="cal-month-box"><div style="text-align:center; color:var(--accent); font-weight:800; margin-bottom:10px;">${name.toUpperCase()}</div><div class="cal-grid">`;
        const heads = currentLang==='it'?["L","M","M","G","V","S","D"]:["M","T","W","T","F","S","S"];
        heads.forEach(h => html += `<div style="text-align:center; font-size:11px; opacity:0.5; padding-bottom:5px;">${h}</div>`);
        let startShift = (new Date(date.getFullYear(), date.getMonth(), 1).getDay() + 6) % 7; 
        for(let i=0; i<startShift; i++) html += `<div></div>`;
        const total = new Date(date.getFullYear(), date.getMonth()+1, 0).getDate();
        for(let d=1; d<=total; d++) {
            const dayStr = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
            const isB = bookedDates.includes(dayStr), isS = (checkIn===dayStr || checkOut===dayStr), inR = (checkIn && checkOut && dayStr > checkIn && dayStr < checkOut);
            html += `<div class="cal-day ${isB?'booked':''} ${isS?'selected':''} ${inR?'range':''}" onclick="handleDate('${dayStr}', ${isB})">${d}</div>`;
        }
        container.innerHTML += html + `</div></div>`;
    }
}

async function syncBookedDates() {
    renderCalendar();
    try {
        const res = await fetch(APP_CONFIG.googleSheetUrl); //
        const csv = await res.text();
        const rows = csv.split(/\r?\n/);
        let blocked = [];
        rows.forEach(row => {
            const cols = row.split(',');
            if (cols[0]?.includes('/')) {
                const start = parseItalianDate(cols[0]), end = parseItalianDate(cols[1]);
                let cur = new Date(start);
                while (cur < end) { blocked.push(cur.toISOString().split('T')[0]); cur.setDate(cur.getDate() + 1); }
            }
        });
        bookedDates = [...new Set(blocked)];
        renderCalendar();
    } catch (e) { console.log("Sync Error"); }
}

function parseItalianDate(s) { const p = s.replace(/"/g, '').split('/'); return new Date(p[2], p[1] - 1, p[0]); }
function setLanguage(l) { currentLang = l; localStorage.setItem('cervinia_lang', l); document.querySelectorAll('.lang-txt').forEach(el => el.innerText = el.getAttribute(`data-${l}`)); renderReviews(); renderCalendar(); updatePrice(); }

function openLightbox(i) { currentIndex = i; updateLightbox(); document.getElementById("lightbox").style.display = "flex"; }
function closeLightbox() { document.getElementById("lightbox").style.display = "none"; }
function navigateLightbox(d) { currentIndex = (currentIndex + d + photos.length) % photos.length; updateLightbox(); }
function updateLightbox() { document.getElementById("lbImg").src = photos[currentIndex]; }

function handleDate(d, isB) { if(isB) return; if(!checkIn || (checkIn && checkOut)) { checkIn = d; checkOut = null; } else if (d < checkIn) { checkIn = d; } else { checkOut = d; } renderCalendar(); updatePrice(); }
function updatePrice() {
    const pNew = document.getElementById("totalPrice"); if(!pNew || !checkIn || !checkOut) return;
    const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000*60*60*24));
    let daily = (new Date(checkIn).getMonth() >= 10 || new Date(checkIn).getMonth() <= 3) ? APP_CONFIG.prices.winter : APP_CONFIG.prices.standard;
    let total = nights * daily * (APP_CONFIG.markup[ad] || 1) * (1 + (ch * APP_CONFIG.childExtra));
    pNew.innerText = total.toFixed(0) + "€";
    if(document.getElementById("depositTxt")) document.getElementById("depositTxt").innerText = (total * 0.3).toFixed(0) + "€";
}

document.addEventListener('DOMContentLoaded', () => { setLanguage(currentLang); syncBookedDates(); });
