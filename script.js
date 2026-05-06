let offset = 0, checkIn = null, checkOut = null, ad = 2, ch = 0, currentIndex = 0;
let currentLang = localStorage.getItem('cervinia_lang') || 'it';
let bookedDates = [];
const photos = Array.from({length: 20}, (_, i) => `foto${i+1}.webp`);

async function syncBookedDates() {
    try {
        const response = await fetch(APP_CONFIG.googleSheetUrl);
        const csvData = await response.text();
        const rows = csvData.split(/\r?\n/);
        let datesToBlock = [];

        rows.forEach(row => {
            const cols = row.split(',');
            const startStr = cols[0]?.trim();
            const endStr = cols[1]?.trim();
            if (startStr && endStr && startStr.includes('/')) {
                const start = parseItalianDate(startStr);
                const end = parseItalianDate(endStr);
                if (!isNaN(start) && !isNaN(end)) {
                    let cur = new Date(start);
                    while (cur < end) {
                        datesToBlock.push(cur.toISOString().split('T')[0]);
                        cur.setDate(cur.getDate() + 1);
                    }
                }
            }
        });
        bookedDates = [...new Set(datesToBlock)];
        renderCalendar();
    } catch (e) { console.error("Sync Error:", e); }
}

function parseItalianDate(s) {
    const p = s.replace(/"/g, '').split('/');
    return new Date(p[2], p[1] - 1, p[0]);
}

function setLanguage(l) {
    currentLang = l;
    localStorage.setItem('cervinia_lang', l);
    document.querySelectorAll('.lang-txt').forEach(el => el.innerText = el.getAttribute(`data-${l}`));
    renderCalendar();
    updatePrice();
}

function renderCalendar() {
    const container = document.getElementById("calendar-render");
    if(!container) return; // Se siamo in index.html non fa nulla
    
    container.innerHTML = "";
    const now = new Date();
    
    for(let m=0; m<2; m++) {
        const date = new Date(now.getFullYear(), now.getMonth() + offset + m, 1);
        const name = date.toLocaleString(currentLang === 'it' ? 'it-IT' : 'en-US', {month:'long', year:'numeric'});
        
        let html = `<div class="cal-month-box"><div class="cal-month-title" style="text-align:center; font-weight:800; margin-bottom:15px; color:#00e5ff;">${name.toUpperCase()}</div><div class="cal-grid">`;
        const heads = currentLang === 'it' ? ["L","M","M","G","V","S","D"] : ["M","T","W","T","F","S","S"];
        heads.forEach(h => html += `<div class="cal-head-cell" style="opacity:0.5; font-size:12px; text-align:center; padding-bottom:10px;">${h}</div>`);
        
        let startShift = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
        startShift = startShift === 0 ? 6 : startShift - 1; 
        for(let i=0; i<startShift; i++) html += `<div></div>`;
        
        const totalDays = new Date(date.getFullYear(), date.getMonth()+1, 0).getDate();
        for(let d=1; d<=totalDays; d++) {
            const dayStr = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
            const isB = bookedDates.includes(dayStr);
            const isS = (checkIn === dayStr || checkOut === dayStr);
            const inR = (checkIn && checkOut && dayStr > checkIn && dayStr < checkOut);
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
    renderCalendar();
    updatePrice();
}

function updatePrice() {
    const pNew = document.getElementById("totalPrice");
    if(!pNew || !checkIn || !checkOut) return;
    const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000*60*60*24));
    const month = new Date(checkIn).getMonth();
    let daily = (month >= 10 || month <= 3) ? APP_CONFIG.prices.winter : APP_CONFIG.prices.standard;
    let total = nights * daily * (APP_CONFIG.markup[ad] || 1) * (1 + (ch * APP_CONFIG.childExtra));
    pNew.innerText = total.toFixed(0) + "€";
    document.getElementById("oldPrice").innerText = (total * APP_CONFIG.marketingMultiplier).toFixed(0) + "€";
    document.getElementById("depositTxt").innerText = (total * 0.3).toFixed(0) + "€";
}

async function confirmBooking() {
    const name = document.getElementById("fName").value;
    const email = document.getElementById("fEmail").value;
    if(!checkIn || !checkOut || !name || !email) return alert(currentLang==='it'?"Dati incompleti!":"Incomplete data!");
    
    const btn = document.getElementById("mainConfirmBtn");
    btn.disabled = true; btn.innerText = "...";
    
    const params = {
        guest_name: name + " " + document.getElementById("fSurname").value,
        check_in: checkIn,
        check_out: checkOut,
        guests: ad + " AD, " + ch + " CH",
        total: document.getElementById("totalPrice").innerText,
        deposit: document.getElementById("depositTxt").innerText,
        lang: currentLang,
        guest_email: email
    };

    try {
        emailjs.init(APP_CONFIG.emailjs.publicKey);
        await emailjs.send(APP_CONFIG.emailjs.serviceId, APP_CONFIG.emailjs.templateId, params);
        window.location.href = `https://wa.me/393479612836?text=${encodeURIComponent("Nuova richiesta: " + name + " - Periodo: " + checkIn + " / " + checkOut)}`;
    } catch (e) { alert("Error!"); btn.disabled = false; }
}

function toggleSidebar() { document.getElementById('sidebar').classList.toggle('active'); }
function openLightbox(i) { currentIndex = i; document.getElementById("lbImg").src = photos[i]; document.getElementById("lightbox").style.display = "flex"; }
function closeLightbox() { document.getElementById("lightbox").style.display = "none"; }
function navigateLightbox(d) { currentIndex = (currentIndex + d + photos.length) % photos.length; document.getElementById("lbImg").src = photos[currentIndex]; }
function setGuests(t, v) { if(t==='ad') ad = Math.max(1, Math.min(6, ad+v)); else ch = Math.max(0, 6-ad, ch+v); document.getElementById("valAd").innerText = ad; document.getElementById("valCh").innerText = ch; updatePrice(); }
function shiftMonth(d) { offset += d; renderCalendar(); }

document.addEventListener('DOMContentLoaded', () => { 
    setLanguage(currentLang); 
    syncBookedDates(); 
});
