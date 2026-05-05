const bookedDates = ["2026-06-24", "2026-06-25", "2026-06-26","2026-06-27","2026-08-03", "2026-08-04","2026-08-05", "2026-08-06", "2026-08-07", "2026-08-08"];

const pricing = {
    basePrice: 150, // Cambia questo valore base
    winterPrice: 220,
    occupancy: {
        3: 1.15, // +15%
        4: 1.30, // +30%
        5: 1.45, // +45%
        6: 1.60  // +60%
    },
    childExtra: 0.03 // +3% per bambino
};

let lang = "it";
let checkIn = null;
let checkOut = null;
let currentMonthOffset = 0;
let adults = 2;
let children = 0;

function setLang(l) {
    lang = l;
    document.querySelectorAll('.flag-icon').forEach(f => f.classList.remove('active'));
    document.getElementById("flag-"+l).classList.add("active");
    
    const t = {
        it: { navInfo: "Info", navFoto: "Foto", navAvail: "Prenota", navLoc: "Mappa", labelAdults: "Adulti", labelChildren: "Bambini", btnFloatBook: "PRENOTA" },
        en: { navInfo: "Info", navFoto: "Photos", navAvail: "Booking", navLoc: "Map", labelAdults: "Adults", labelChildren: "Children", btnFloatBook: "BOOK" }
    };
    
    const sel = t[lang];
    document.getElementById("navInfo").innerText = sel.navInfo;
    document.getElementById("navFoto").innerText = sel.navFoto;
    document.getElementById("navAvail").innerText = sel.navAvail;
    document.getElementById("navLoc").innerText = sel.navLoc;
    document.getElementById("labelAdults").innerText = sel.labelAdults;
    document.getElementById("labelChildren").innerText = sel.labelChildren;
    document.getElementById("btnFloatBook").innerText = sel.btnFloatBook;
    
    renderCalendar();
}

function updateGuests(type, delta) {
    if (type === 'adults') {
        adults = Math.max(1, Math.min(6, adults + delta));
    } else {
        children = Math.max(0, Math.min(6, children + delta));
    }
    
    // Limite totale 6 persone
    if (adults + children > 6) {
        if (type === 'adults') children = 6 - adults;
        else adults = 6 - children;
    }
    
    // Almeno un adulto
    if (adults < 1) adults = 1;

    document.getElementById("countAdults").innerText = adults;
    document.getElementById("countChildren").innerText = children;
}

function renderCalendar() {
    const container = document.getElementById("calendar-container");
    container.innerHTML = "";
    const now = new Date();
    for(let m=0; m<2; m++) {
        const date = new Date(now.getFullYear(), now.getMonth() + currentMonthOffset + m, 1);
        const monthName = date.toLocaleString(lang==='it'?'it-IT':'en-US', {month:'long', year:'numeric'});
        let html = `<div><div style="text-align:center; color:#00e5ff; font-weight:800; margin-bottom:10px">${monthName.toUpperCase()}</div><div class="calendar-grid">`;
        const heads = lang==='it'?["L","M","M","G","V","S","D"]:["M","T","W","T","F","S","S"];
        heads.forEach(h => html += `<div style="text-align:center; font-size:11px; opacity:0.6">${h}</div>`);
        let start = new Date(date.getFullYear(), date.getMonth(), 1).getDay() || 7;
        for(let i=1; i<start; i++) html += `<div></div>`;
        const days = new Date(date.getFullYear(), date.getMonth()+1, 0).getDate();
        for(let d=1; d<=days; d++) {
            const ds = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
            const booked = bookedDates.includes(ds);
            const sel = (checkIn===ds || checkOut===ds);
            const range = (checkIn && checkOut && ds > checkIn && ds < checkOut);
            html += `<div class="cal-day ${booked?'booked':''} ${sel?'selected':''} ${range?'in-range':''}" onclick="handleDateClick('${ds}', ${booked})">${d}</div>`;
        }
        container.innerHTML += html + `</div></div>`;
    }
}

function handleDateClick(date, booked) {
    if(booked) return;
    if(!checkIn || (checkIn && checkOut)) { checkIn = date; checkOut = null; }
    else if (date < checkIn) { checkIn = date; }
    else { checkOut = date; calculate(); }
    renderCalendar();
}

function calculate() {
    const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000*60*60*24));
    let dailyPrice = new Date(checkIn).getMonth() >= 11 || new Date(checkIn).getMonth() <= 3 ? pricing.winterPrice : pricing.basePrice;
    
    // Occupazione Adulti
    let multiplier = 1;
    if (adults >= 3) multiplier = pricing.occupancy[adults] || 1.6;
    
    // Bambini
    let childBonus = children * pricing.childExtra;
    
    let total = nights * dailyPrice * multiplier * (1 + childBonus);
    let fakeOld = total * 1.15; // +15% per l'effetto marketing

    window.location.href = `recap.html?in=${checkIn}&out=${checkOut}&nights=${nights}&total=${total.toFixed(0)}&old=${fakeOld.toFixed(0)}&ad=${adults}&ch=${children}&lang=${lang}`;
}

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('active');
    const overlay = document.getElementById('menuOverlay');
    overlay.style.display = overlay.style.display === 'block' ? 'none' : 'block';
}

function changeMonth(dir) { currentMonthOffset += dir; renderCalendar(); }
function scrollCarousel(id, dir) { document.getElementById(id).scrollBy({ left: dir * 400, behavior: 'smooth' }); }
function openLightbox(i) { 
    const f = ["foto1.webp","foto2.webp","foto3.webp","foto4.webp","foto5.webp","foto6.webp","foto7.webp"];
    document.getElementById("lightboxImg").src = f[i]; 
    document.getElementById("lightbox").style.display = "flex"; 
}
function closeLightbox() { document.getElementById("lightbox").style.display = "none"; }

window.onload = () => setLang('it');
