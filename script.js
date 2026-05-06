// Array di 20 foto
const totalPhotos = 20;
const photosArray = [];
for (let i = 1; i <= totalPhotos; i++) {
    photosArray.push(`foto${i}.webp`);
}

let currentIndex = 0;
const lightbox = document.getElementById("lightbox");
const lbImg = document.getElementById("lbImg");
const lbCounter = document.getElementById("lbCounter");

function openLightbox(index) {
    if (!lbImg || !lightbox) return;
    
    if (index >= 0 && index < photosArray.length) {
        currentIndex = index;
    } else {
        currentIndex = 0;
    }

    updateLightboxImage();
    lightbox.style.display = "flex";
    document.body.style.overflow = "hidden";
}

function closeLightbox() {
    if (lightbox) {
        lightbox.style.display = "none";
        document.body.style.overflow = "auto";
    }
}

function navigateLightbox(direction) {
    currentIndex += direction;
    
    if (currentIndex < 0) {
        currentIndex = photosArray.length - 1;
    } else if (currentIndex >= photosArray.length) {
        currentIndex = 0;
    }
    
    updateLightboxImage();
}

function updateLightboxImage() {
    // Aggiunge un gestore di errore nel caso una foto da 8 a 20 non esista ancora sul server
    lbImg.onerror = function() {
        console.error("Immagine non trovata: " + lbImg.src);
        // Potresti mettere un'immagine di placeholder qui se vuoi
    };
    lbImg.src = photosArray[currentIndex];
    lbCounter.innerText = `${currentIndex + 1} / ${photosArray.length}`;
}

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

function changeLang(l) {
    document.querySelectorAll('.flag').forEach(f => f.classList.remove('active'));
    document.querySelector(`.flag[onclick*="${l}"]`).classList.add('active');
    
    // Testi base (puoi espandere questo oggetto)
    const texts = {
        it: { desc: "L'Appartamento", revTitle: "Cosa dicono i nostri ospiti", map: "Posizione" },
        en: { desc: "The Apartment", revTitle: "Guest Reviews", map: "Location" }
    };
    
    const s = texts[l];
    if(document.getElementById("descTitle")) document.getElementById("descTitle").innerText = s.desc;
    // Aggiungi gli id agli altri h3 se vuoi tradurli
}
