let curLang = "it";

function changeLang(l) {
    curLang = l;
    document.querySelectorAll('.flag').forEach(f => f.classList.remove('active'));
    document.getElementById("flag-"+l).classList.add("active");

    const t = {
        it: { 
            ottimo: "Ottimo", reviews: "recensioni", more: "Altre 22 foto", map: "Vedi su mappa",
            desc: "L'Appartamento", book: "PRENOTA"
        },
        en: { 
            ottimo: "Excellent", reviews: "reviews", more: "See all photos", map: "Show on map",
            desc: "The Apartment", book: "BOOK NOW"
        }
    };
    const s = t[l];
    document.getElementById("txtOttimo").innerText = s.ottimo;
    document.getElementById("txtRevCount").innerText = s.reviews;
    document.getElementById("txtMorePhotos").innerText = s.more;
    document.getElementById("txtMap").innerText = s.map;
    document.getElementById("descTitle").innerText = s.desc;
    document.getElementById("txtBook").innerText = s.book;
}

function openLightbox(i) {
    const images = ["foto1.webp","foto2.webp","foto3.webp","foto4.webp","foto5.webp","foto6.webp","foto7.webp"];
    document.getElementById("lbImg").src = images[i];
    document.getElementById("lightbox").style.display = "flex";
}

function closeLightbox() {
    document.getElementById("lightbox").style.display = "none";
}

document.addEventListener('DOMContentLoaded', () => {
    changeLang('it');
});
