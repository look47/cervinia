let offset = 0, checkIn = null, checkOut = null, ad = 2, ch = 0, currentIndex = 0;
let currentLang = localStorage.getItem('cervinia_lang') || 'it';
let bookedDates = [];
const photos = ['foto1.webp', 'foto2.webp', 'foto3.webp', 'foto4.webp', 'foto5.webp', 'foto6.webp', 'foto7.webp'];

const reviewsData = [
    { date: "Gennaio 2024", it: "Posizione da sogno, esci di casa con gli sci ai piedi. Casa caldissima e moderna, ideale dopo una giornata sulla neve. Host gentilissimi.", en: "Dream location, ski-out directly from the door. Very warm and modern house." },
    { date: "Febbraio 2024", it: "Ristrutturazione incredibile. Il garage privato a Cervinia è un vero lusso. Pulizia impeccabile e accoglienza cordiale.", en: "Incredible renovation. Private garage is a luxury." },
    { date: "Marzo 2024", it: "Vista Cervino pazzesca. Tutto perfetto per la nostra famiglia. La casa è dotata di ogni comfort e il riscaldamento è eccellente.", en: "Amazing Matterhorn view. Everything was perfect." },
    { date: "Dicembre 2024", it: "Il miglior ski-in ski-out mai provato. Host disponibili e premurosi. La casa profumava di pulito al nostro arrivo.", en: "The best ski-in ski-out experience ever." },
    { date: "Gennaio 2025", it: "Appartamento moderno e funzionale. Gli host ci hanno accolto come amici. Posizione imbattibile sulla Pista 16.", en: "Modern and functional. Unbeatable location." },
    { date: "Febbraio 2025", it: "Vacanza indimenticabile. Casa silenziosa, calda e vicinissima a tutto. Host cordiali e precisi nelle indicazioni.", en: "Unforgettable holiday. Quiet and warm house." }
];

function renderReviews() {
    const container = document.getElementById("reviews-grid");
    if(!container) return;
    container.innerHTML = "";
    reviewsData.forEach(r => {
        let stars = '<i class="fas fa-snowflake snowflake-gold"></i>'.repeat(5);
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
        let html = `<div><div style="text-align:center; color:var(--accent); font-weight:800; margin-bottom:10px;">${name.toUpperCase()}</div><div class="cal-grid">`;
        const heads = currentLang==='it'?["L","M","M","G","V","S","D"]:["M","T","W","T","F","S","S"];
        heads.forEach(h => html += `<div style="text-align:center; font-size:10px; opacity:0.5;">${h}</div>`);
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
        const res = await fetch(APP_CONFIG.googleSheetUrl);
        const csv = await res.text();
        const rows = csv.split(/\r?\n/);
        let blocked = [];
        rows.forEach(row => {
            const cols = row.split(',');
            if (cols[0]?.includes('/')) {
                const start = parseItalianDate(cols[0]), end = parseItalianDate(cols[1]);
                let cur = new Date(start);
                while (cur <= end) { 
                    // Usa formato locale YYYY-MM-DD per evitare conversioni UTC
                    const year = cur.getFullYear();
                    const month = String(cur.getMonth() + 1).padStart(2, '0');
                    const day = String(cur.getDate()).padStart(2, '0');
                    blocked.push(`${year}-${month}-${day}`);
                    cur.setDate(cur.getDate() + 1); 
                }
            }
        });
        bookedDates = [...new Set(blocked)];
        renderCalendar();
    } catch (e) { console.log("Sync..."); }
}

function parseItalianDate(s) { 
    const p = s.replace(/"/g, '').split('/'); 
    // Forza ora a mezzogiorno locale per evitare problemi di fusi orario
    return new Date(p[2], p[1] - 1, p[0], 12, 0, 0); 
}

function setLanguage(l) {
    currentLang = l; localStorage.setItem('cervinia_lang', l);
    document.querySelectorAll('.lang-txt').forEach(el => el.innerText = el.getAttribute(`data-${l}`));
    const itF = document.getElementById('lang-it'), enF = document.getElementById('lang-en');
    if(itF && enF) { itF.classList.toggle('active', l === 'it'); enF.classList.toggle('active', l === 'en'); }
    renderReviews(); renderCalendar(); updatePrice();
}

function setGuests(t, v) {
    if (v === 1 && (ad + ch) >= 6) return alert("Max 6 ospiti totali");
    if (t === 'ad') ad = Math.max(1, Math.min(6, ad + v));
    else ch = Math.max(0, Math.min(5, ch + v));
    document.getElementById("valAd").innerText = ad;
    document.getElementById("valCh").innerText = ch;
    updatePrice();
}

function handleDate(d, isB) { if(isB) return; if(!checkIn || (checkIn && checkOut)) { checkIn = d; checkOut = null; } else if (d < checkIn) { checkIn = d; } else { checkOut = d; } renderCalendar(); updatePrice(); }

function updatePrice() {
    const pNew = document.getElementById("totalPrice"); if(!pNew || !checkIn || !checkOut) return;
    const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000*60*60*24));
    let daily = (new Date(checkIn).getMonth() >= 10 || new Date(checkIn).getMonth() <= 3) ? APP_CONFIG.prices.winter : APP_CONFIG.prices.standard;
    let total = nights * daily * (APP_CONFIG.markup[ad] || 1) * (1 + (ch * APP_CONFIG.childExtra));
    pNew.innerText = total.toFixed(0) + "€";
    document.getElementById("oldPrice").innerText = (total * APP_CONFIG.marketingMultiplier).toFixed(0) + "€";
}

function openLightbox(i) { 
    if (i >= photos.length) return; 
    currentIndex = i; 
    document.getElementById("lbImg").src = photos[i]; 
    document.getElementById("lightbox").style.display = "flex"; 
    document.body.style.overflow = "hidden";
}

function closeLightbox() { 
    document.getElementById("lightbox").style.display = "none"; 
    document.body.style.overflow = "";
}

function nextPhoto() {
    currentIndex = (currentIndex + 1) % photos.length;
    document.getElementById("lbImg").src = photos[currentIndex];
}

function prevPhoto() {
    currentIndex = (currentIndex - 1 + photos.length) % photos.length;
    document.getElementById("lbImg").src = photos[currentIndex];
}

document.addEventListener('keydown', (e) => {
    const lightbox = document.getElementById("lightbox");
    if (lightbox.style.display === "flex") {
        if (e.key === "Escape") closeLightbox();
        if (e.key === "ArrowRight") nextPhoto();
        if (e.key === "ArrowLeft") prevPhoto();
    }
});
function shiftMonth(d) { offset += d; renderCalendar(); }

function confirmBooking() {
    const fName = document.getElementById("fName").value.trim();
    const fSurname = document.getElementById("fSurname").value.trim();
    const fEmail = document.getElementById("fEmail").value.trim();
    const fPhone = document.getElementById("fPhone").value.trim();
    
    if (!checkIn || !checkOut) {
        alert(currentLang === 'it' ? "Seleziona le date del soggiorno" : "Please select your stay dates");
        return;
    }
    
    if (!fName || !fSurname || !fEmail || !fPhone) {
        alert(currentLang === 'it' ? "Compila tutti i campi obbligatori" : "Please fill all required fields");
        return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(fEmail)) {
        alert(currentLang === 'it' ? "Inserisci un'email valida" : "Please enter a valid email");
        return;
    }
    
    const phoneRegex = /^[+]?[\d\s\-()]{8,20}$/;
    if (!phoneRegex.test(fPhone)) {
        alert(currentLang === 'it' ? "Inserisci un numero di telefono valido" : "Please enter a valid phone number");
        return;
    }
    
    const btn = document.getElementById("mainConfirmBtn");
    btn.disabled = true;
    btn.textContent = currentLang === 'it' ? "ELABORAZIONE..." : "PROCESSING...";
    
    setTimeout(() => {
        alert(currentLang === 'it' ? "Grazie! La tua richiesta è stata registrata. Ti contatteremo presto per confermare." : "Thank you! Your request has been registered. We will contact you soon to confirm.");
        btn.disabled = false;
        btn.textContent = currentLang === 'it' ? "CONFERMA E PRENOTA" : "CONFIRM AND BOOK";
    }, 1500);
}

document.addEventListener('DOMContentLoaded', () => { setLanguage(currentLang); syncBookedDates(); });
