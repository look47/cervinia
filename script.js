let offset = 0;
let checkIn = null, checkOut = null;
let ad = 2, ch = 0;
let currentIndex = 0;
const photos = Array.from({length: 20}, (_, i) => `foto${i+1}.webp`);

// SIDEBAR
function toggleSidebar() {
    const s = document.getElementById('sidebar');
    const o = document.getElementById('overlay');
    if(!s || !o) return;
    s.classList.toggle('active');
    o.style.display = s.classList.contains('active') ? 'block' : 'none';
}

// CALENDARIO
function renderCalendar() {
    const container = document.getElementById("calendar-render");
    if(!container) return; // Non siamo nella pagina recap
    
    container.innerHTML = "";
    const now = new Date();
    
    for(let m=0; m<2; m++) {
        const date = new Date(now.getFullYear(), now.getMonth() + offset + m, 1);
        const name = date.toLocaleString('it-IT', {month:'long', year:'numeric'});
        
        let html = `<div class="cal-month-box"><div class="cal-month-title">${name.toUpperCase()}</div><div class="cal-grid">`;
        const heads = ["L","M","M","G","V","S","D"];
        heads.forEach(h => html += `<div class="cal-head-cell">${h}</div>`);
        
        let firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
        let startShift = firstDay === 0 ? 6 : firstDay - 1; 
        for(let i=0; i<startShift; i++) html += `<div></div>`;
        
        const totalDays = new Date(date.getFullYear(), date.getMonth()+1, 0).getDate();
        for(let d=1; d<=totalDays; d++) {
            const dayStr = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
            const isBooked = (typeof APP_CONFIG !== 'undefined') ? APP_CONFIG.bookedDates.includes(dayStr) : false;
            const isSelected = (checkIn === dayStr || checkOut === dayStr);
            const inRange = (checkIn && checkOut && dayStr > checkIn && dayStr < checkOut);
            
            html += `<div class="cal-day ${isBooked?'booked':''} ${isSelected?'selected':''} ${inRange?'range':''}" 
                     onclick="handleDate('${dayStr}', ${isBooked})">${d}</div>`;
        }
        container.innerHTML += html + `</div></div>`;
    }
}

function handleDate(date, isB) {
    if(isB) return;
    if(!checkIn || (checkIn && checkOut)) { checkIn = date; checkOut = null; }
    else if (date < checkIn) { checkIn = date; }
    else { checkOut = date; }
    renderCalendar();
    updatePrice();
}

function updatePrice() {
    const display = document.getElementById("totalPrice");
    const oldDisplay = document.getElementById("oldPrice");
    const saveTxt = document.getElementById("txtSave");
    const waBtn = document.getElementById("waBtn");
    
    if(!display || !checkIn || !checkOut || typeof APP_CONFIG === 'undefined') return;

    const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000*60*60*24));
    const month = new Date(checkIn).getMonth();
    let daily = (month >= 10 || month <= 3) ? APP_CONFIG.prices.winter : APP_CONFIG.prices.standard;
    
    let markup = APP_CONFIG.markup[ad] || 1;
    let total = nights * daily * markup * (1 + (ch * APP_CONFIG.childExtra));
    
    display.innerText = total.toFixed(0) + "€";
    if(oldDisplay) oldDisplay.innerText = (total * APP_CONFIG.marketingMultiplier).toFixed(0) + "€";
    if(saveTxt) saveTxt.style.display = "block";

    const n = document.getElementById("fName") ? document.getElementById("fName").value : "";
    const s = document.getElementById("fSurname") ? document.getElementById("fSurname").value : "";
    
    const msg = `Ciao! Prenotazione Cervinia Ski Home%0ANome: ${n} ${s}%0AIn: ${checkIn}%0AOut: ${checkOut}%0AOspiti: ${ad} Adulti, ${ch} Bambini%0ATotale: ${total.toFixed(0)}€`;
    if(waBtn) waBtn.href = `https://wa.me/393479612836?text=${msg}`;
}

function setGuests(type, val) {
    if(type === 'ad') ad = Math.max(1, Math.min(6, ad + val));
    else ch = Math.max(0, Math.min(6, ch + val));
    const adEl = document.getElementById("valAd");
    const chEl = document.getElementById("valCh");
    if(adEl) adEl.innerText = ad;
    if(chEl) chEl.innerText = ch;
    updatePrice();
}

function shiftMonth(d) { offset += d; renderCalendar(); }

// GALLERY LIGHTBOX
function openLightbox(index) {
    currentIndex = index;
    const lb = document.getElementById("lightbox");
    const img = document.getElementById("lbImg");
    if(!lb || !img) return;
    img.src = photos[currentIndex];
    lb.style.display = "flex";
    document.body.style.overflow = "hidden";
}
function closeLightbox() { 
    const lb = document.getElementById("lightbox");
    if(lb) lb.style.display = "none"; 
    document.body.style.overflow = "auto";
}
function navigateLightbox(d) {
    currentIndex = (currentIndex + d + photos.length) % photos.length;
    const img = document.getElementById("lbImg");
    if(img) img.src = photos[currentIndex];
}

document.addEventListener('DOMContentLoaded', () => {
    renderCalendar();
});
