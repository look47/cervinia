const bookedDates = ["2026-06-24", "2026-06-25", "2026-06-26", "2026-06-27", "2026-08-03", "2026-08-04", "2026-08-05", "2026-08-06", "2026-08-07", "2026-08-08"];

const pricing = {
    base: 150, 
    winter: 220,
    markup: { 3: 1.15, 4: 1.30, 5: 1.45, 6: 1.60 },
    child: 0.03
};

let lang = "it";
let checkIn = null;
let checkOut = null;
let adults = 2;
let children = 0;
let monthOffset = 0;

function setLang(l) {
    lang = l;
    document.querySelectorAll('.flag-icon').forEach(f => f.classList.remove('active'));
    document.getElementById("flag-"+l).classList.add("active");

    const t = {
        it: { navFoto: "Foto", navInfo: "Info", navAvail: "Prenota", btnBook: "PRENOTA", lblAdults: "Adulti", lblChildren: "Bambini" },
        en: { navFoto: "Photos", navInfo: "Info", navAvail: "Booking", btnBook: "BOOK NOW", lblAdults: "Adults", lblChildren: "Children" }
    };

    const s = t[lang];
    document.getElementById("navFoto").innerText = s.navFoto;
    document.getElementById("navInfo").innerText = s.navInfo;
    document.getElementById("navAvail").innerText = s.navAvail;
    document.getElementById("lblAdults").innerText = s.lblAdults;
    document.getElementById("lblChildren").innerText = s.lblChildren;
    document.getElementById("txtBtnBook").innerText = s.btnBook;

    renderCalendar();
}

function changeGuests(type, delta) {
    if(type === 'adults') adults = Math.max(1, Math.min(6, adults + delta));
    else children = Math.max(0, Math.min(6, children + delta));

    if(adults + children > 6) {
        if(type === 'adults') children = 6 - adults;
        else adults = 6 - children;
    }
    document.getElementById("numAdults").innerText = adults;
    document.getElementById("numChildren").innerText = children;
}

function renderCalendar() {
    const container = document.getElementById("calendar-grid-container");
    container.innerHTML = "";
    const now = new Date();
    
    for(let m=0; m<2; m++) {
        const date = new Date(now.getFullYear(), now.getMonth() + monthOffset + m, 1);
        const monthName = date.toLocaleString(lang==='it'?'it-IT':'en-US', {month:'long', year:'numeric'});
        
        let html = `<div><div style="text-align:center; color:#00e5ff; font-weight:800; margin-bottom:15px; font-size:14px;">${monthName.toUpperCase()}</div><div class="cal-grid">`;
        const daysHeads = lang==='it'?["L","M","M","G","V","S","D"]:["M","T","W","T","F","S","S"];
        daysHeads.forEach(d => html += `<div style="text-align:center; font-size:11px; opacity:0.5; padding-bottom:5px;">${d}</div>`);
        
        let start = new Date(date.getFullYear(), date.getMonth(), 1).getDay() || 7;
        for(let i=1; i<start; i++) html += `<div></div>`;
        
        const totalDays = new Date(date.getFullYear(), date.getMonth()+1, 0).getDate();
        for(let d=1; d<=totalDays; d++) {
            const ds = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
            const booked = bookedDates.includes(ds);
            const isSel = (checkIn===ds || checkOut===ds);
            const inRange = (checkIn && checkOut && ds > checkIn && ds < checkOut);
            html += `<div class="cal-day ${booked?'booked':''} ${isSel?'selected':''} ${inRange?'range':''}" onclick="onDateClick('${ds}', ${booked})">${d}</div>`;
        }
        container.innerHTML += html + `</div></div>`;
    }
}

function onDateClick(date, booked) {
    if(booked) return;
    if(!checkIn || (checkIn && checkOut)) { checkIn = date; checkOut = null; }
    else if (date < checkIn) { checkIn = date; }
    else { checkOut = date; finish(); }
    renderCalendar();
}

function finish() {
    const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000*60*60*24));
    let daily = new Date(checkIn).getMonth() >= 11 || new Date(checkIn).getMonth() <= 3 ? pricing.winter : pricing.base;
    let mult = pricing.markup[adults] || 1;
    let total = nights * daily * mult * (1 + (children * pricing.child));
    let old = total * 1.15;
    window.location.href = `recap.html?in=${checkIn}&out=${checkOut}&n=${nights}&t=${total.toFixed(0)}&o=${old.toFixed(0)}&ad=${adults}&ch=${children}&l=${lang}`;
}

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('active');
    const over = document.getElementById('overlay');
    over.style.display = over.style.display === 'block' ? 'none' : 'block';
}

function moveMonth(d) { monthOffset += d; renderCalendar(); }
function scrollCarousel(d) { document.getElementById('myCarousel').scrollBy({left: d*400, behavior:'smooth'}); }
function openLightbox(i) { 
    const f = ["foto1.webp","foto2.webp","foto3.webp","foto4.webp","foto5.webp","foto6.webp","foto7.webp"];
    document.getElementById("lbImg").src = f[i]; 
    document.getElementById("lightbox").style.display = "flex"; 
}
function closeLightbox() { document.getElementById("lightbox").style.display = "none"; }

window.onload = () => setLang('it');
