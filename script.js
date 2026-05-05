function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    sidebar.classList.toggle('active');
    overlay.style.display = sidebar.classList.contains('active') ? 'block' : 'none';
}

function changeLang(l) {
    document.querySelectorAll('.flag').forEach(f => f.classList.remove('active'));
    document.getElementById("flag-"+l).classList.add("active");

    const t = {
        it: { info: "Appartamento", gallery: "Gallery", rev: "Recensioni", book: "PRENOTA", tagline: "Il tuo rifugio moderno sulle piste del Cervino" },
        en: { info: "Apartment", gallery: "Gallery", rev: "Reviews", book: "BOOK NOW", tagline: "Your modern retreat on the Matterhorn slopes" }
    };
    const s = t[l];
    document.getElementById("navInfo").innerText = s.info;
    document.getElementById("navFoto").innerText = s.gallery;
    document.getElementById("navRev").innerText = s.rev;
    document.getElementById("txtBook").innerText = s.book;
    document.getElementById("heroTagline").innerText = s.tagline;
}

function moveCarousel(d) {
    document.getElementById('track').scrollBy({ left: d * 350, behavior: 'smooth' });
}

function openLightbox(i) {
    const f = ["foto1.webp","foto2.webp","foto3.webp","foto4.webp","foto5.webp","foto6.webp","foto7.webp"];
    document.getElementById("lbImg").src = f[i];
    document.getElementById("lightbox").style.display = "flex";
}

function closeLightbox() {
    document.getElementById("lightbox").style.display = "none";
}

document.addEventListener('DOMContentLoaded', () => {
    // Inizializza lingua italiana
    changeLang('it');
});
