const bookedDates = ["2026-06-24", "2026-06-25", "2026-06-26","2026-06-27","2026-08-03", "2026-08-04","2026-08-05", "2026-08-06", "2026-08-07", "2026-08-08"];
const priceConfig = { base: 150, winter: 220 };

let lang = "it";
let checkIn = null;
let checkOut = null;
let currentMonthOffset = 0;

function setLang(l) {
    lang = l;
    document.querySelectorAll('.flag-icon').forEach(f => f.classList.remove('active'));
    document.getElementById("flag-"+l).classList.add("active");
    // [Aggiungi traduzioni qui come fatto in precedenza]
    renderCalendar();
}

function renderCalendar() {
    const container = document.getElementById("calendar-container");
    container.innerHTML = "";
    const now = new Date();
    for(let m=0; m<2; m++) {
        const date = new Date(now.getFullYear(), now.getMonth() + currentMonthOffset + m, 1);
        const monthName = date.toLocaleString(lang==='it'?'it-IT':'en-US', {month:'long', year:'numeric'});
        let html = `<div><div style="text-align:center; margin-bottom:10px; color:#00e5ff; font-weight:800">${monthName.toUpperCase()}</div><div class="calendar-grid">`;
        const heads = lang==='it'?["L","M","M","G","V","S","D"]:["M","T","W","T","F","S","S"];
        heads.forEach(h => html += `<div style="text-align:center; font-size:11px; color:#00e5ff; padding-bottom:5px">${h}</div>`);
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
    let p = new Date(checkIn).getMonth() >= 11 || new Date(checkIn).getMonth() <= 3 ? priceConfig.winter : priceConfig.base;
    let total = nights * p;
    // Sconto fittizio per marketing: il prezzo "originale" è il 113% del totale
    let fakeOld = total * 1.13;
    window.location.href = `recap.html?in=${checkIn}&out=${checkOut}&nights=${nights}&total=${total.toFixed(0)}&old=${fakeOld.toFixed(0)}`;
}

function changeMonth(dir) { currentMonthOffset += dir; renderCalendar(); }
function scrollCarousel(id, dir) { document.getElementById(id).scrollBy({ left: dir * 400, behavior: 'smooth' }); }

window.onload = () => renderCalendar();
