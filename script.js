// CONFIGURAZIONE
const bookedDates = ["2026-12-24", "2026-12-25", "2026-12-31", "2027-01-01"];
const priceConfig = {
    base: 150,
    winter: 220,
    holidays: 350,
    summer: 160
};

let lang = "it";
let checkIn = null;
let checkOut = null;
const fotoArray = ["foto1.webp", "foto2.webp", "foto3.webp", "foto4.webp", "foto5.webp", "foto6.webp", "foto7.webp"];

function setLang(l) {
    lang = l;
    document.querySelectorAll('.flag-icon').forEach(f => f.classList.remove('active'));
    document.getElementById("flag-" + l).classList.add("active");
    
    const t = {
        it: { title: "Cervinia Ski Home", desc: "RIFUGIO MODERNO SULLE PISTE", cal: "Arrivo / Partenza", legB: "Occupato", legF: "Libero", legS: "Selezione" },
        en: { title: "Cervinia Ski Home", desc: "MODERN RETREAT ON THE SLOPES", cal: "Check-in / Check-out", legB: "Booked", legF: "Free", legS: "Selection" }
    };
    
    document.getElementById("title").innerText = t[lang].title;
    document.getElementById("desc").innerText = t[lang].desc;
    document.getElementById("calInstruction").innerText = t[lang].cal;
    document.getElementById("legBooked").innerText = t[lang].legB;
    document.getElementById("legFree").innerText = t[lang].legF;
    document.getElementById("legSelected").innerText = t[lang].legS;
    
    renderCalendar();
    renderPriceList();
}

function renderPriceList() {
    const grid = document.getElementById("priceGrid");
    grid.innerHTML = `<p style="font-size:14px; margin:0;">Base: ${priceConfig.base}€ | Inverno: ${priceConfig.winter}€ | Festività: ${priceConfig.holidays}€</p>`;
}

function renderCalendar() {
    const container = document.getElementById("calendar-container");
    container.innerHTML = "";
    const now = new Date();
    
    for(let m=0; m<3; m++) {
        const date = new Date(now.getFullYear(), now.getMonth() + m, 1);
        const monthName = date.toLocaleString(lang === 'it' ? 'it-IT' : 'en-US', { month: 'long', year: 'numeric' });
        
        let html = `<div class="cal-month-title">${monthName}</div><div class="calendar-grid">`;
        ["L","M","M","G","V","S","D"].forEach(d => html += `<div class="cal-day cal-header">${d}</div>`);
        
        let firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay() || 7;
        for(let i=1; i<firstDay; i++) html += `<div class="cal-day empty"></div>`;
        
        const days = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
        for(let d=1; d<=days; d++) {
            const dateStr = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            const isBooked = bookedDates.includes(dateStr);
            const isSelected = (checkIn === dateStr || checkOut === dateStr);
            const inRange = (checkIn && checkOut && dateStr > checkIn && dateStr < checkOut);
            
            html += `<div class="cal-day ${isBooked ? 'booked' : ''} ${isSelected ? 'selected' : ''} ${inRange ? 'in-range' : ''}" 
                     onclick="handleDateClick('${dateStr}', ${isBooked})">${d}</div>`;
        }
        container.innerHTML += html + `</div>`;
    }
}

function handleDateClick(date, isBooked) {
    if(isBooked) return;
    
    if(!checkIn || (checkIn && checkOut)) {
        checkIn = date;
        checkOut = null;
    } else if (date < checkIn) {
        checkIn = date;
    } else if (date > checkIn) {
        checkOut = date;
        calculateAndRedirect();
    }
    renderCalendar();
}

function calculateAndRedirect() {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    
    // Logica prezzo semplificata per il demo
    let pricePerNight = priceConfig.base;
    if(start.getMonth() >= 11 || start.getMonth() <= 3) pricePerNight = priceConfig.winter;
    
    const total = nights * pricePerNight;
    window.location.href = `recap.html?in=${checkIn}&out=${checkOut}&nights=${nights}&total=${total}`;
}

function scrollCarousel(id, dir) { document.getElementById(id).scrollBy({ left: dir * 400, behavior: 'smooth' }); }
function openLightbox(i) { document.getElementById("lightboxImg").src = fotoArray[i]; document.getElementById("lightbox").style.display = "flex"; }
function closeLightbox() { document.getElementById("lightbox").style.display = "none"; }

window.onload = () => setLang('it');
