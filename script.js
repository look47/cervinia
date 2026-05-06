let offset = 0, checkIn = null, checkOut = null, ad = 2, ch = 0, currentIndex = 0;
let currentLang = localStorage.getItem('cervinia_lang') || 'it';
let bookedDates = [];
const photos = Array.from({length: 20}, (_, i) => `foto${i+1}.webp`);

// LE 6 RECENSIONI TOP (Tutte 5 Fiocchi)
const reviewsData = [
    { date: "Jan 2024", stars: 5, it: "Underbart ställe! Vi kommer tillbaka nästa år.", en: "Wonderful place! We will be back next year.", sv: "Underbart ställe!" },
    { date: "Feb 2024", stars: 5, it: "Posizione imbattibile sulla Pista 16. Casa caldissima e moderna.", en: "Unbeatable location on Slope 16. Very warm and modern house.", sv: "Oslagbart läge!" },
    { date: "Mar 2024", stars: 5, it: "Fantastisk lägenhet! Vi älskade närheten till allt.", en: "Fantastic apartment! Loved the proximity to everything.", sv: "Fantastisk lägenhet!" },
    { date: "Jan 2025", stars: 5, it: "Ski-in/out vero! Il garage privato è comodissimo.", en: "True ski-in/out! The private garage is very convenient.", sv: "Äkta ski-in/out!" },
    { date: "Feb 2025", stars: 5, it: "Great for skiing trips. Everything was perfect.", en: "Great for skiing trips. Everything was perfect.", sv: "Perfekt för skidresor!" },
    { date: "Mar 2025", stars: 5, it: "Veldig fint og rent. Nær bakken.", en: "Very nice and clean. Close to the slope.", sv: "Veldig fint og rent!" }
];

function renderReviews() {
    const container = document.getElementById("reviews-grid");
    if(!container) return;
    container.innerHTML = "";
    reviewsData.forEach(r => {
        let stars = ""; for(let i=0; i<r.stars; i++) stars += '<i class="fas fa-snowflake snowflake-gold"></i>';
        let txt = currentLang === 'it' ? r.it : r.en;
        container.innerHTML += `<div class="rev-card"><div class="rev-header"><span>${stars}</span><span class="rev-date">${r.date}</span></div><div class="rev-text">"${txt}"</div></div>`;
    });
}

function toggleSidebar() { document.getElementById('sidebar').classList.toggle('active'); }

function openLightbox(i) { currentIndex = i; updateLightbox(); document.getElementById("lightbox").style.display = "flex"; }
function closeLightbox() { document.getElementById("lightbox").style.display = "none"; }
function navigateLightbox(d) { currentIndex = (currentIndex + d + photos.length) % photos.length; updateLightbox(); }
function updateLightbox() { document.getElementById("lbImg").src = photos[currentIndex]; }

async function syncBookedDates() {
    renderCalendar();
    try {
        const response = await fetch(APP_CONFIG.googleSheetUrl);
        const csvData = await response.text();
        const rows = csvData.split(/\r?\n/);
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
    } catch (e) { console.log("Sync..."); }
}

function parseItalianDate(s) { const p = s.replace(/"/g, '').split('/'); return new Date(p[2], p[1] - 1, p[0]); }

function setLanguage(l) {
    currentLang = l; localStorage.setItem('cervinia_lang', l);
    document.querySelectorAll('.lang-txt').forEach(el => el.innerText = el.getAttribute(`data-${l}`));
    if(document.getElementById('btn-it')) {
        document.getElementById('btn-it').classList.toggle('active', l === 'it');
        document.getElementById('btn-en').classList.toggle('active', l === 'en');
    }
    renderReviews(); renderCalendar(); updatePrice();
}

function renderCalendar() {
    const container = document.getElementById("calendar-render");
    if(!container) return;
    container.innerHTML = "";
    const now = new Date();
    for(let m=0; m<2; m++) {
        const date = new Date(now.getFullYear(), now.getMonth() + offset + m, 1);
        const name = date.toLocaleString(currentLang==='it'?'it-IT':'en-US', {month:'long', year:'numeric'});
        let html = `<div class="cal-month-box"><div class="cal-month-title" style="text-align:center; color:var(--accent); font-weight:800; margin-bottom:10px;">${name.toUpperCase()}</div><div class="cal-grid">`;
        const heads = currentLang==='it'?["L","M","M","G","V","S","D"]:["M","T","W","T","F","S","S"];
        heads.forEach(h => html += `<div style="text-align:center; font-size:11px; opacity:0.5;">${h}</div>`);
        let shift = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
        shift = shift === 0 ? 6 : shift - 1;
        for(let i=0; i<shift; i++) html += `<div></div>`;
        const total = new Date(date.getFullYear(), date.getMonth()+1, 0).getDate();
        for(let d=1; d<=total; d++) {
            const dayStr = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
            const isB = bookedDates.includes(dayStr), isS = (checkIn===dayStr || checkOut===dayStr), inR = (checkIn && checkOut && dayStr > checkIn && dayStr < checkOut);
            html += `<div class="cal-day ${isB?'booked':''} ${isS?'selected':''} ${inR?'range':''}" onclick="handleDate('${dayStr}', ${isB})">${d}</div>`;
        }
        container.innerHTML += html + `</div></div>`;
    }
}

function handleDate(d, isB) {
    if(isB) return;
    if(!checkIn || (checkIn && checkOut)) { checkIn = d; checkOut = null; }
    else if (d < checkIn) { checkIn = d; }
    else { checkOut = d; }
    renderCalendar(); updatePrice();
}

function updatePrice() {
    const pNew = document.getElementById("totalPrice");
    if(!pNew || !checkIn || !checkOut) return;
    const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000*60*60*24));
    let daily = (new Date(checkIn).getMonth() >= 10 || new Date(checkIn).getMonth() <= 3) ? APP_CONFIG.prices.winter : APP_CONFIG.prices.standard;
    let total = nights * daily * (APP_CONFIG.markup[ad] || 1) * (1 + (ch * APP_CONFIG.childExtra));
    pNew.innerText = total.toFixed(0) + "€";
    if(document.getElementById("oldPrice")) document.getElementById("oldPrice").innerText = (total * APP_CONFIG.marketingMultiplier).toFixed(0) + "€";
    if(document.getElementById("depositTxt")) document.getElementById("depositTxt").innerText = (total * 0.3).toFixed(0) + "€";
}

async function confirmBooking() {
    const name = document.getElementById("fName").value;
    const email = document.getElementById("fEmail").value;
    if(!checkIn || !checkOut || !name || !email) return alert("Completa i dati!");
    const btn = document.getElementById("mainConfirmBtn");
    btn.disabled = true; btn.innerText = "...";
    try {
        emailjs.init(APP_CONFIG.emailjs.publicKey);
        await emailjs.send(APP_CONFIG.emailjs.serviceId, APP_CONFIG.emailjs.templateId, { guest_name: name, check_in: checkIn, check_out: checkOut, total: document.getElementById("totalPrice").innerText });
        window.location.href = `https://wa.me/393479612836?text=Prenotazione: ${name} dal ${checkIn} al ${checkOut}`;
    } catch (e) { alert("EmailJS Error"); btn.disabled = false; }
}

function setGuests(t, v) { if(t==='ad') ad = Math.max(1, Math.min(6, ad+v)); else ch = Math.max(0, 6-ad, ch+v); document.getElementById("valAd").innerText = ad; document.getElementById("valCh").innerText = ch; updatePrice(); }
function shiftMonth(d) { offset += d; renderCalendar(); }

document.addEventListener('DOMContentLoaded', () => { setLanguage(currentLang); syncBookedDates(); });
