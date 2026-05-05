let lang = "it";
const fotoArray = ["foto1.webp", "foto2.webp", "foto3.webp", "foto4.webp", "foto5.webp", "foto6.webp", "foto7.webp"];
let currentPhotoIndex = 0;

function setLang(selectedLang) {
  lang = selectedLang;
  document.getElementById("flag-it").classList.remove("active");
  document.getElementById("flag-en").classList.remove("active");
  document.getElementById("flag-" + lang).classList.add("active");

  if (lang === "en") {
    document.getElementById("title").innerText = "Cervinia Ski Home";
    document.getElementById("desc").innerText = "Your modern retreat on the slopes of Cervinia";
    document.getElementById("descTitle").innerText = "The Apartment";
    document.getElementById("descP1").innerText = "Ski-in Ski-Out apartment located directly on the slopes of Cervinia Cielo Alto. 6 beds available (1 double bed, 2 single beds and a comfortable sofa bed). Free WiFi and garden views, the apartment offers warm and welcoming accommodation in Breuil-Cervinia. The property features a private balcony with a view and free private parking.";
    document.getElementById("descP2").innerHTML = "This mountain view apartment features 1 bedroom, a living room, a smart TV, a kitchen with fridge, dishwasher, <b>microwave and Nespresso coffee machine</b>, plus 1 bathroom with bidet. <b>Bed linen, blankets and complete towel sets are provided for each guest.</b>";
    document.getElementById("descP3").innerText = "Direct access to the slopes (slope 16), right from the parking lot! The center of Cervinia is 700 m away.";
    
    document.getElementById("rulesTitle").innerText = "House Rules";
    document.getElementById("checkInText").innerHTML = '<i class="fas fa-sign-in-alt"></i> <b>Check-in:</b> from 16:00';
    document.getElementById("checkOutText").innerHTML = '<i class="fas fa-sign-out-alt"></i> <b>Check-out:</b> by 10:30';
    document.getElementById("weatherTitle").innerText = "Cervinia Weather";
    document.getElementById("reviewsTitle").innerText = "Guest Reviews";
    document.getElementById("availTitle").innerText = "Availability";
  } else {
    document.getElementById("title").innerText = "Cervinia Ski Home";
    document.getElementById("desc").innerText = "Il tuo rifugio moderno sulle piste del Cervino";
    document.getElementById("descTitle").innerText = "L'Appartamento";
    document.getElementById("descP1").innerText = "Appartamento SKi-in SKi-Out ubicato direttamente sulle piste di Cervinia Cielo alto. 6 posti letto disponibili (1 letto matrimoniale, 2 letti singoli e un comodo divano letto). WiFi gratuito e vista sul giardino, l'appartamento offre un alloggio caldo ed accogliente a Breuil-Cervinia. La struttura prevede balcone privato con vista e il parcheggio privato gratuito.";
    document.getElementById("descP2").innerHTML = "Questo appartamento con balcone e vista sulla montagna presenta 1 camera da letto, soggiorno, una smart TV, una cucina con frigorifero, lavastoviglie, <b>microonde e macchina da caffè Nespresso</b>, oltre a 1 bagno con bidet. <b>Vengono forniti lenzuola, coperte e set di asciugamani completi per ogni ospite.</b>";
    document.getElementById("descP3").innerText = "L’accesso diretto alle piste (pista 16), direttamente dal parcheggio! Il centro di Cervinia si trova a 700 m.";
    
    document.getElementById("rulesTitle").innerText = "Regole della casa";
    document.getElementById("checkInText").innerHTML = '<i class="fas fa-sign-in-alt"></i> <b>Check-in:</b> dalle 16:00';
    document.getElementById("checkOutText").innerHTML = '<i class="fas fa-sign-out-alt"></i> <b>Check-out:</b> entro le 10:30';
    document.getElementById("weatherTitle").innerText = "Meteo Cervinia";
    document.getElementById("reviewsTitle").innerText = "Cosa dicono gli ospiti";
    document.getElementById("availTitle").innerText = "Disponibilità";
  }
}

function scrollCarousel(carouselId, direction) {
  const carousel = document.getElementById(carouselId);
  const scrollAmount = 320;
  carousel.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
}

function openLightbox(index) {
  currentPhotoIndex = index;
  document.getElementById("lightboxImg").src = fotoArray[currentPhotoIndex];
  document.getElementById("lightbox").style.display = "flex";
}

function closeLightbox() {
  document.getElementById("lightbox").style.display = "none";
}

function changeLightboxImage(direction, event) {
  event.stopPropagation();
  currentPhotoIndex += direction;
  if (currentPhotoIndex < 0) currentPhotoIndex = fotoArray.length - 1;
  else if (currentPhotoIndex >= fotoArray.length) currentPhotoIndex = 0;
  document.getElementById("lightboxImg").src = fotoArray[currentPhotoIndex];
}
