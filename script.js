const bookedDates = ["2026-06-24", "2026-06-25", "2026-06-26", "2026-06-27", "2026-08-03", "2026-08-04", "2026-08-05", "2026-08-06", "2026-08-07", "2026-08-08"];
const pricing = { base: 150, winter: 220, markup: { 3: 1.15, 4: 1.30, 5: 1.45, 6: 1.60 }, child: 0.03 };

let currentLang = "it";
let checkIn = null; let checkOut = null;
let adults = 2; let children = 0;
let monthOffset = 0;

function changeLang(l) {
    currentLang = l;
    document.querySelectorAll('.flag').forEach(f => f.classList.remove('active'));
    document.getElementById("flag-"+l).classList.add("active");

    const t = {
        it: { gallery: "Foto", info: "Info", book: "Prenota", ad: "Adulti", ch: "Bambini", btn: "PRENOTA" },
        en: { gallery: "Photos", info: "Info", book: "Booking", ad: "Adults", ch: "Children", btn: "BOOK NOW" }
    };

    const s = t[l];
    document.getElementById("navGallery").innerText = s.gallery;
    document.getElementById("navInfo").innerText = s.info;
    document.getElementById("navBook").innerText = s.book;
    document.getElementById("lblAd").innerText = s.ad;
    document.getElementById("lblCh").innerText = s.ch;
    document.getElementById("txtBtnBook").innerText = s.btn;
    renderCalendar();
}

function setGuests(type, delta) {
    if(type === 'ad') adults = Math.max(1, Math.min(6, adults + delta));
    else children = Math.max(0, Math.min(6, children + delta));

    if(adults + children > 6) {
        if(type === 'ad') children = 6 - adults; else adults = 6 - children;
    }
    document.getElementById("valAd").innerText = adults;
    document.getElementById("valCh").innerText = children;
}

function renderCalendar() {
    const container = document.getElementById("calendar-render");
    if(!container) return;
    container.innerHTML = "";
    const now = new Date();
    
    for(let m=0; m<2; m++) {
        const date = new Date(now.getFullYear(), now.getMonth() + monthOffset + m, 1);
        const name = date.toLocaleString(currentLang==='it'?'it-IT':'en-US', {month:'long', year:'numeric'});
        
        let html = `<div><div style="text-align:center; color:#00e5ff; font-weight:800; margin-bottom:15px; font-size:14px;">${name.toUpperCase()}</div><div class="cal-grid">`;
        const heads = currentLang==='it'?["L","M","M","G","V","S","D"]:["M","T","W","T","F","S","S"];
        heads.forEach(h => html += `<div style="text-align:center; font-size:11px; opacity:0.5">${h}</div>`);
        
        let start = new Date(date.getFullYear(), date.getMonth(), 1).getDay() || 7;
        for(let i=1; i<start; i++) html += `<div></div>`;
        
        const totalDays = new Date(date.getFullYear(), date.getMonth()+1, 0).getDate();
        for(let d=1; d<=totalDays; d++) {
            const ds = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
            const isBooked = bookedDates.includes(ds);
            const isSelected = (checkIn===ds || checkOut===ds);
            const inRange = (checkIn && checkOut && ds > checkIn && ds < checkOut);
            html += `<div class="cal-day ${isBooked?'booked':''} ${isSelected?'selected':''} ${inRange?'range':''}" onclick="handleDate('${ds}', ${isBooked})">${d}</div>`;
        }
        container.innerHTML += html + `</div></div>`;
    }
}

function handleDate(date, isBooked) {
    if(isBooked) return;
    if(!checkIn || (checkIn && checkOut)) { checkIn = date; checkOut = null; }
    else if (date < checkIn) { checkIn = date; }
    else { checkOut = date; submit(); }
    renderCalendar();
}

function submit() {
    const n = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000*60*60*24));
    let daily = new Date(checkIn).getMonth() >= 11 || new Date(checkIn).getMonth() <= 3 ? pricing.winter : pricing.base;
    let mult = pricing.markup[adults] || 1;
    let total = n * daily * mult * (1 + (children * pricing.child));
    window.location.href = `recap.html?in=${checkIn}&out=${checkOut}&n=${n}&t=${total.toFixed(0)}&o=${(total*1.15).toFixed(0)}&ad=${adults}&ch=${children}&l=${currentLang}`;
}

function toggleSidebar() { 
    document.getElementById('sidebar').classList.toggle('active'); 
    const ov = document.getElementById('overlay');
    ov.style.display = ov.style.display === 'block' ? 'none' : 'block';
}
function handleNav() { if(window.innerWidth <= 992) toggleSidebar(); }
function shiftMonth(d) { monthOffset += d; renderCalendar(); }
function moveCarousel(d) { document.getElementById('track').scrollBy({left: d*400, behavior:'smooth'}); }
function openLightbox(i) { 
    const f = ["foto1.webp","foto2.webp","foto3.webp","foto4.webp","foto5.webp","foto6.webp","foto7.webp"];
    document.getElementById("lbImg").src = f[i]; document.getElementById("lightbox").style.display = "flex"; 
}
function closeLightbox() { document.getElementById("lightbox").style.display = "none"; }

document.addEventListener('DOMContentLoaded', () => changeLang('it'));
