function openLightbox(i) {
    const photos = ["foto1.webp","foto2.webp","foto3.webp","foto4.webp","foto5.webp","foto6.webp","foto7.webp"];
    const lbImg = document.getElementById("lbImg");
    const lb = document.getElementById("lightbox");
    if (lbImg && lb) {
        lbImg.src = photos[i];
        lb.style.display = "flex";
    }
}

function closeLightbox() {
    const lb = document.getElementById("lightbox");
    if (lb) lb.style.display = "none";
}

function changeLang(l) {
    document.querySelectorAll('.flag').forEach(f => f.classList.remove('active'));
    // Qui andrebbe implementata la logica di cambio testi bilingue se desiderata
}

// Chiudi lightbox con tasto ESC
document.addEventListener('keydown', (e) => {
    if (e.key === "Escape") closeLightbox();
});
