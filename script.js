// Genera dinamicamente l'array con le 20 foto
const totalPhotos = 20;
const photosArray = [];
for (let i = 1; i <= totalPhotos; i++) {
    photosArray.push(`foto${i}.webp`);
}

let currentIndex = 0;
const lightbox = document.getElementById("lightbox");
const lbImg = document.getElementById("lbImg");
const lbCounter = document.getElementById("lbCounter");

// Apri Lightbox all'indice specificato
function openLightbox(index) {
    if (!lbImg || !lightbox) return;
    
    // Sicurezza: assicura che l'indice sia valido (soprattutto per il pulsante "Altre foto")
    if (index >= 0 && index < photosArray.length) {
        currentIndex = index;
    } else {
        currentIndex = 0;
    }

    updateLightboxImage();
    lightbox.style.display = "flex";
    document.body.style.overflow = "hidden"; // Blocca lo scroll della pagina sottostante
}

// Chiudi Lightbox
function closeLightbox() {
    if (lightbox) {
        lightbox.style.display = "none";
        document.body.style.overflow = "auto"; // Riabilita lo scroll
    }
}

// Naviga Avanti/Indietro
function navigateLightbox(direction) {
    currentIndex += direction;
    
    // Gestione del "loop" continuo
    if (currentIndex < 0) {
        currentIndex = photosArray.length - 1;
    } else if (currentIndex >= photosArray.length) {
        currentIndex = 0;
    }
    
    updateLightboxImage();
}

// Aggiorna immagine e contatore
function updateLightboxImage() {
    lbImg.src = photosArray[currentIndex];
    lbCounter.innerText = `${currentIndex + 1} / ${photosArray.length}`;
}

// Navigazione tramite tastiera
document.addEventListener('keydown', (e) => {
    if (lightbox && lightbox.style.display === "flex") {
        if (e.key === "Escape") {
            closeLightbox();
        } else if (e.key === "ArrowRight") {
            navigateLightbox(1);
        } else if (e.key === "ArrowLeft") {
            navigateLightbox(-1);
        }
    }
});

// Cambia lingua (placeholder)
function changeLang(l) {
    document.querySelectorAll('.flag').forEach(f => f.classList.remove('active'));
    document.querySelector(`.flag[onclick*="${l}"]`).classList.add('active');
    // ... eventuale logica testi ...
}
