// ==========================================
// CONFIGURAZIONE MANUALE
// ==========================================

const bookedDates = [
    "2026-12-24", "2026-12-25", "2026-12-26",
    "2026-12-31", "2027-01-01", "2027-01-02"
];

const prices = [
    { seasonIT: "Inverno", seasonEN: "Winter", price: "180€" },
    { seasonIT: "Natale/Capodanno", seasonEN: "Holidays", price: "350€" },
    { seasonIT: "Estate", seasonEN: "Summer", price: "140€" }
];

// ==========================================
// LOGICA APPLICATIVO
// ==========================================

let lang = "it";
const fotoArray = ["foto1.webp", "foto2.webp", "foto3.webp", "foto4.webp", "foto5.webp", "foto6.webp", "foto7.webp"];
let currentPhotoIndex = 0;

function setLang(selectedLang) {
    lang = selectedLang;
    document.querySelectorAll('.flag-icon').forEach(f => f.classList.remove('active'));
    document.getElementById("flag-" + lang).classList.add("active");

    const t = {
        en: {
            title: "Cervinia Ski Home",
            desc: "MODERN RETREAT @ MATTERHORN SLOPES",
            descTitle: "The Apartment",
            p1: "Ski-in Ski-Out apartment directly on Cervinia Cielo Alto slopes. 6 beds (1 double, 2 singles, 1 sofa bed).",
            p2: "Smart TV, <b>Nespresso & Microwave</b>. Bed linen and towels provided.",
            p3: "Direct access to <b>Slope 16</b> from the parking! Center at 700m.",
            rules: "Rules",
            priceT: "Rates",
            avail: "Availability",
            weather: "Weather",
            reviews: "Reviews",
            legB: "Booked", legF: "Free"
        },
        it: {
            title: "Cervinia Ski Home",
            desc: "RIFUGIO MODERNO SULLE PISTE",
            descTitle: "L'Appartamento",
            p1: "Appartamento SKi-in SKi-Out su piste Cervinia Cielo alto. 6 posti letto (1 matr, 2 singoli, 1 divano letto).",
            p2: "Smart TV, <b>Nespresso e Microonde</b>. Lenzuola e asciugamani inclusi.",
            p3: "Accesso diretto alla <b>Pista 16</b> dal parcheggio! Centro a 700m.",
            rules: "Regole",
            priceT: "Listino",
            avail: "Disponibilità",
            weather: "Meteo",
            reviews: "Recensioni",
            legB: "Occupato", legF: "Libero"
        }
    };

    const sel = t[lang];
    document.getElementById("title").innerText = sel.title;
    document.getElementById("desc").innerText = sel.desc;
    document.getElementById("descTitle").innerText = sel.descTitle;
    document.getElementById("descP1").innerText = sel.p1;
    document.getElementById("descP2").innerHTML = sel.p2;
    document.getElementById("descP3").innerHTML = sel.p3;
    document.getElementById("rulesTitle").innerText = sel.rules;
    document.getElementById("priceTitle").innerText = sel.priceT;
    document.getElementById("availTitle").innerText = sel.avail;
    document.getElementById("weatherTitle").innerText = sel.weather;
    document.getElementById("reviewsTitle").innerText = sel.reviews;
    document.getElementById("legBooked").innerText = sel.legB;
    document.getElementById("legFree").innerText = sel.legF;

    renderPrices();
    renderCalendar();
}

function renderPrices() {
    const container = document.getElementById("priceGrid");
    container.innerHTML = "";
    prices.forEach(p => {
        const name = lang === "it" ? p.seasonIT : p.seasonEN;
        container.innerHTML += `
            <div class="price-card material-card">
                <b>${name}</b><br>
                <span>${p.price}</span><small>/night</small>
            </div>`;
    });
}

function renderCalendar() {
    const container = document.getElementById("calendar-container");
    container.innerHTML = "";
    const now = new Date();
    for(let m=0; m<2; m++) {
        const date = new Date(now.getFullYear(), now.getMonth() + m, 1);
        const monthName = date.toLocaleString(lang === 'it' ? 'it-IT' : 'en-US', { month: 'long' });
        let html = `<div class="cal-month-title">${monthName}</div><div class="calendar-grid">`;
        ["L", "M", "M", "G", "V", "S", "D"].forEach(d => html += `<div class="cal-day cal-header">${d}</div>`);
        let firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay() || 7;
        for(let i=1; i<firstDay; i++) html += `<div class="cal-day empty"></div>`;
        const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
        for(let d=1; d<=daysInMonth; d++) {
            const cur = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            html += `<div class="cal-day ${bookedDates.includes(cur) ? 'booked' : ''}">${d}</div>`;
        }
        container.innerHTML += html + `</div>`;
    }
}

function scrollCarousel(id, dir) {
    document.getElementById(id).scrollBy({ left: dir * 400, behavior: 'smooth' });
}

function openLightbox(i) {
    currentPhotoIndex = i;
    document.getElementById("lightboxImg").src = fotoArray[i];
    document.getElementById("lightbox").style.display = "flex";
}

function closeLightbox() { document.getElementById("lightbox").style.display = "none"; }

function changeLightboxImage(dir, e) {
    e.stopPropagation();
    currentPhotoIndex = (currentPhotoIndex + dir + fotoArray.length) % fotoArray.length;
    document.getElementById("lightboxImg").src = fotoArray[currentPhotoIndex];
}

window.onload = () => setLang('it');
