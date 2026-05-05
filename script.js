const bookedDates = ["2026-06-24", "2026-06-25", "2026-06-26", "2026-06-27", "2026-08-03", "2026-08-04", "2026-08-05", "2026-08-06", "2026-08-07", "2026-08-08"];
const pricing = { base: 150, winter: 220, markup: { 3: 1.15, 4: 1.30, 5: 1.45, 6: 1.60 }, child: 0.03 };

let curLang = "it";
let checkIn = null, checkOut = null;
let ad = 2, ch = 0, offset = 0;

function changeLang(l) {
    curLang = l;
    document.querySelectorAll('.flag').forEach(f => f.classList.remove('active'));
    if(document.getElementById("flag-"+l)) document.getElementById("flag-"+l).classList.add("active");

    const t = {
        it: { info: "Descrizione", gallery: "Gallery", rev: "Recensioni", book: "PRENOTA", ad: "Adulti", ch: "Bambini" },
        en: { info: "Description", gallery: "Gallery", rev: "Reviews", book: "BOOK NOW", ad: "Adults", ch: "Children" }
    };
    const s = t[l];
    if(document.getElementById("navInfo")) document.getElementById("navInfo").innerText = s.info;
    if(document.getElementById("navFoto")) document.getElementById("navFoto").innerText = s.gallery;
    if(document.getElementById("navRev")) document.getElementById("navRev").innerText = s.rev;
    if(document.getElementById("navBook")) document.getElementById("navBook").innerText = s.book;
    if(document.getElementById("lblAd")) document.getElementById("lblAd").innerText = s.ad;
    if(document.getElementById("lblCh")) document.getElementById("lblCh").innerText = s.ch;

    renderCalendar();
}

function setGuests(type, val) {
    if(type === 'ad') ad = Math.max(1, Math.min(6, ad + val));
    else ch = Math.max(0, Math.min(6, ch + val));
    if(ad + ch > 6) { if(type === 'ad') ch = 6 - ad; else ad = 6 - ch; }
    document.getElementById("valAd").innerText = ad;
    document.getElementById("valCh").innerText = ch;
    updatePrice();
}

function renderCalendar() {
    const container = document.getElementById("calendar-render");
    if(!container) return;
    container.innerHTML = "";
    const now = new Date();
    for(let m=0; m<2; m++) {
        const date = new Date(now.getFullYear(), now.getMonth() + offset + m, 1);
        const name = date.toLocaleString(curLang==='it'?'it-IT':'en-US', {month:'long', year:'numeric'});
        let html = `<div><div style="text-align:center; color:#00e5ff; font-weight:800; margin-bottom:10px; font-size:13px;">${name.toUpperCase()}</div><div class="cal-grid">`;
        const dHeads = curLang==='it'?["L","M","M","G","V","S","D"]:["M","T","W","T","F","S","S"];
        dHeads.forEach(h => html += `<div style="text-align:center; font-size:10px; opacity:0.5">${h}</div>`);
        let start = new Date(date.getFullYear(), date.getMonth(), 1).getDay() || 7;
        for(let i=1; i<start; i++) html += `<div></div>`;
        const tot = new Date(date.getFullYear(), date.getMonth()+1, 0).getDate();
        for(let d=1; d<=tot; d++) {
            const ds = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
            const isB = bookedDates.includes(ds);
            const isS = (checkIn===ds || checkOut===ds);
            const inR = (checkIn && checkOut && ds > checkIn && ds < checkOut);
            html += `<div class="cal-day ${isB?'booked':''} ${isS?'selected':''} ${inR?'range':''}" onclick="handleDate('${ds}', ${isB})">${d}</div>`;
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
    if(!checkIn || !checkOut) return;
    const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000*60*60*24));
    let daily = new Date(checkIn).getMonth() >= 10 || new Date(checkIn).getMonth() <= 3 ? pricing.winter : pricing.base;
    let mult = pricing.markup[ad] || 1;
    let tot = nights * daily * mult * (1 + (ch * pricing.child));
    
    document.getElementById("totalPrice").innerText = tot.toFixed(0) + "€";
    document.getElementById("oldPrice").innerText = (tot * 1.15).toFixed(0) + "€";

    const name = document.getElementById("fName").value;
    const surname = document.getElementById("fSurname").value;
    const phone = document.getElementById("fPhone").value;
    
    const msg = `Richiesta Cervinia Ski Home%0ANome: ${name} ${surname}%0ATel: ${phone}%0AIn: ${checkIn}%0AOut: ${checkOut}%0AOspiti: ${ad} Ad, ${ch} Bam.%0ATotale: ${tot.toFixed(0)}€`;
    document.getElementById("waBtn").href = `https://wa.me/393479612836?text=${msg}`;
}

function toggleSidebar() { document.getElementById('sidebar').classList.toggle('active'); }
function handleNav() { if(window.innerWidth <= 992) toggleSidebar(); }
function shiftMonth(d) { offset += d; renderCalendar(); }
function moveCarousel(d) { document.getElementById('track').scrollBy({left: d*350, behavior:'smooth'}); }
function openLightbox(i) { 
    const f = ["foto1.webp","foto2.webp","foto3.webp","foto4.webp","foto5.webp","foto6.webp","foto7.webp"];
    document.getElementById("lbImg").src = f[i]; document.getElementById("lightbox").style.display = "flex"; 
}
function closeLightbox() { document.getElementById("lightbox").style.display = "none"; }

document.addEventListener('DOMContentLoaded', () => changeLang('it'));
