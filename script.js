const bookedDates = ["2026-06-24", "2026-06-25", "2026-06-26","2026-06-27","2026-08-03", "2026-08-04","2026-08-05", "2026-08-06", "2026-08-07", "2026-08-08"];
const priceConfig = { base: 150, winter: 220 };

let lang = "it";
let checkIn = null;
let checkOut = null;
let currentMonthOffset = 0;

document.addEventListener('DOMContentLoaded', () => {
    setLang('it');
});

function setLang(l) {
    lang = l;
    document.querySelectorAll('.flag-icon').forEach(f => f.classList.remove('active'));
    document.getElementById("flag-"+l).classList.add("active");
    if(document.getElementById("flag-"+l+"-mob")) document.getElementById("flag-"+l+"-mob").classList.add("active");

    const t = {
        it: { 
            bp: "Miglior Prezzo Garantito", guide: "Location & Guida", descTitle: "L'Appartamento", availTitle: "Disponibilità e Preventivo",
            navInfo: "Informazioni", navFoto: "Foto", navLoc: "Location", navAvail: "Prenota",
            foodT: "Dove Mangiare", skiT: "Ski Tips", btnBook: "PRENOTA ORA", skipass: "Acquista Skipass Online"
        },
        en: { 
            bp: "Best Price Guaranteed", guide: "Location & Guide", descTitle: "The Apartment", availTitle: "Availability & Quote",
            navInfo: "Info", navFoto: "Gallery", navLoc: "Location", navAvail: "Book Now",
            foodT: "Where to Eat", skiT: "Ski Tips", btnBook: "BOOK NOW", skipass: "Buy Skipass Online"
        }
    };

    const sel = t[lang];
    document.getElementById("bpText").innerText = sel.bp;
    document.getElementById("guideTitle").innerText = sel.guide;
    document.getElementById("descTitle").innerText = sel.descTitle;
    document.getElementById("availTitle").innerText = sel.availTitle;
    document.getElementById("navInfo").innerText = sel.navInfo;
    document.getElementById("navFoto").innerText = sel.navFoto;
    document.getElementById("navLoc").innerText = sel.navLoc;
    document.getElementById("navAvail").innerText = sel.navAvail;
    document.getElementById("foodTitle").innerText = sel.foodT;
    document.getElementById("skiTitle").innerText = sel.skiT;
    document.getElementById("btnBookText").innerText = sel.btnBook;
    document.getElementById("skipassText").innerText = sel.skipass;

    renderCalendar();
}

function renderCalendar() {
    const container = document.getElementById("calendar-container");
    container.innerHTML = "";
    const now = new Date();
    for(let m=0; m<2; m++) {
        const date = new Date(now.getFullYear(), now.getMonth() + currentMonthOffset + m, 1);
        const monthName = date.toLocaleString(lang==='it'?'it-IT':'en-US', {month:'long', year:'numeric'});
        let html = `<div><div class="cal-month-title">${monthName}</div><div class="calendar-grid">`;
        const heads = lang==='it'?["L","M","M","G","V","S","D"]:["M","T","W","T","F","S","S"];
        heads.forEach(h => html += `<div class="cal-day cal-header">${h}</div>`);
        let start = new Date(date.getFullYear(), date.getMonth(), 1).getDay() || 7;
        for(let i=1; i<start; i++) html += `<div class="cal-day" style="background:none"></div>`;
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
    let price = new Date(checkIn).getMonth() >= 11 || new Date(checkIn).getMonth() <= 3 ? priceConfig.winter : priceConfig.base;
    let total = nights * price;
    if(nights >= 4) total *= 0.9;
    window.location.href = `recap.html?in=${checkIn}&out=${checkOut}&nights=${nights}&total=${total.toFixed(0)}`;
}

function changeMonth(dir) { currentMonthOffset += dir; renderCalendar(); }
function toggleSidebar() { if(window.innerWidth <= 992) document.getElementById('sidebar').classList.toggle('active'); }
function scrollCarousel(id, dir) { document.getElementById(id).scrollBy({left: dir*400, behavior:'smooth'}); }
function openLightbox(i) { 
    const f = ["foto1.webp","foto2.webp","foto3.webp","foto4.webp","foto5.webp","foto6.webp","foto7.webp"];
    document.getElementById("lightboxImg").src = f[i]; document.getElementById("lightbox").style.display = "flex"; 
}
function closeLightbox() { document.getElementById("lightbox").style.display = "none"; }
