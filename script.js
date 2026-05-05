const bookedDates = ["2026-12-24", "2026-12-25", "2026-12-31", "2027-01-01"];
const priceConfig = { base: 150, winter: 280 };

let lang = "it";
let checkIn = null;
let checkOut = null;
let currentMonthOffset = 0;

function setLang(l) {
    lang = l;
    document.querySelectorAll('.flag-icon').forEach(f => f.classList.remove('active'));
    document.getElementById("flag-" + l).classList.add("active");
    
    const t = {
        it: { title: "Cervinia Ski Home", bp: "Miglior Prezzo Garantito", guide: "Guida Locale Cervinia", descTitle: "L'Appartamento", availTitle: "Disponibilità e Preventivo" },
        en: { title: "Cervinia Ski Home", bp: "Best Price Guaranteed", guide: "Cervinia Local Guide", descTitle: "The Apartment", availTitle: "Availability & Quote" }
    };
    
    document.getElementById("title").innerText = t[lang].title;
    document.getElementById("bpText").innerText = t[lang].bp;
    document.getElementById("guideTitle").innerText = t[lang].guide;
    document.getElementById("descTitle").innerText = t[lang].descTitle;
    document.getElementById("availTitle").innerText = t[lang].availTitle;
    renderCalendar();
}

function renderCalendar() {
    const container = document.getElementById("calendar-container");
    container.innerHTML = "";
    const now = new Date();
    
    for(let m=0; m<2; m++) {
        const date = new Date(now.getFullYear(), now.getMonth() + currentMonthOffset + m, 1);
        const monthName = date.toLocaleString(lang === 'it' ? 'it-IT' : 'en-US', { month: 'long', year: 'numeric' });
        
        let html = `<div><div class="cal-month-title">${monthName}</div><div class="calendar-grid">`;
        const headers = lang === 'it' ? ["L","M","M","G","V","S","D"] : ["M","T","W","T","F","S","S"];
        headers.forEach(d => html += `<div class="cal-day cal-header" style="background:none; color:#00e5ff">${d}</div>`);
        
        let firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay() || 7;
        for(let i=1; i<firstDay; i++) html += `<div class="cal-day" style="background:none"></div>`;
        
        const days = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
        for(let d=1; d<=days; d++) {
            const dStr = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            const isBooked = bookedDates.includes(dStr);
            const isSelected = (checkIn === dStr || checkOut === dStr);
            const inRange = (checkIn && checkOut && dStr > checkIn && dStr < checkOut);
            
            html += `<div class="cal-day ${isBooked ? 'booked' : ''} ${isSelected ? 'selected' : ''} ${inRange ? 'in-range' : ''}" 
                     onclick="handleDateClick('${dStr}', ${isBooked})">${d}</div>`;
        }
        container.innerHTML += html + `</div></div>`;
    }
}

function handleDateClick(date, isBooked) {
    if(isBooked) return;
    if(!checkIn || (checkIn && checkOut)) { checkIn = date; checkOut = null; }
    else if (date < checkIn) { checkIn = date; }
    else if (date > checkIn) { checkOut = date; calculateAndRedirect(); }
    renderCalendar();
}

function calculateAndRedirect() {
    const start = new Date(checkIn);
    const nights = Math.ceil((new Date(checkOut) - start) / (1000 * 60 * 60 * 24));
    let p = priceConfig.base;
    if(start.getMonth() >= 11 || start.getMonth() <= 3) p = priceConfig.winter;
    
    let total = nights * p;
    if (nights >= 4) { total = total * 0.9; } // SCONTO 10%
    
    window.location.href = `recap.html?in=${checkIn}&out=${checkOut}&nights=${nights}&total=${total.toFixed(0)}`;
}

function changeMonth(dir) {
    const newOffset = currentMonthOffset + dir;
    if (newOffset >= 0 && newOffset <= 11) {
        currentMonthOffset = newOffset;
        renderCalendar();
    }
}

function scrollCarousel(id, dir) { document.getElementById(id).scrollBy({ left: dir * 400, behavior: 'smooth' }); }
function openLightbox(i) { 
    const fotoArray = ["foto1.webp", "foto2.webp", "foto3.webp", "foto4.webp", "foto5.webp", "foto6.webp", "foto7.webp"];
    document.getElementById("lightboxImg").src = fotoArray[i]; 
    document.getElementById("lightbox").style.display = "flex"; 
}
function closeLightbox() { document.getElementById("lightbox").style.display = "none"; }

window.onload = () => setLang('it');
