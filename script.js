let lang = "it";
const fotoArray = ["foto1.webp", "foto2.webp", "foto3.webp", "foto4.webp", "foto5.webp"];
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
    document.getElementById("descP1").innerText = "With free WiFi and garden views, Rododendro Ski-in Ski-out CIR 0491 offers accommodation in Breuil-Cervinia just 900 meters from the Plateau Rosà Cable Car. Located 8.6 km from Klein Matterhorn, the property features a terrace and free private parking.";
    document.getElementById("descP2").innerText = "This apartment with a balcony and mountain views features 1 bedroom, a living room, a flat-screen TV, a kitchen with a fridge and dishwasher, and 1 bathroom with a bidet.";
    document.getElementById("descP3").innerText = "Ski-to-door access and ski storage are available at this apartment. Turin Airport is 114 km away.";
    document.getElementById("reviewsTitle").innerText = "What our guests say";
    document.getElementById("waText").innerText = "WhatsApp";
    document.getElementById("availTitle").innerText = "Availability";
    document.getElementById("availText").innerText = "Dates updated in real time";
  } else {
    document.getElementById("title").innerText = "Cervinia Ski Home";
    document.getElementById("desc").innerText = "Il tuo rifugio moderno sulle piste del Cervino";
    document.getElementById("descTitle").innerText = "L'Appartamento";
    document.getElementById("descP1").innerText = "Con WiFi gratuito e vista sul giardino, Rododendro Ski-in Ski-out CIR 0491 offre un alloggio a Breuil-Cervinia a solo 900 metri da Funivia del Plateau Rosà. Situata a 8,6 km da Klein Matterhorn, la struttura prevede una terrazza e il parcheggio privato gratuito.";
    document.getElementById("descP2").innerText = "Questo appartamento con balcone e vista sulla montagna presenta 1 camera da letto, un soggiorno, una TV a schermo piatto, una cucina con frigorifero e lavastoviglie e 1 bagno con bidet.";
    document.getElementById("descP3").innerText = "L’accesso diretto alle piste e un deposito sci sono disponibili presso questo appartamento. L'Aeroporto di Torino si trova a 114 km di distanza.";
    document.getElementById("reviewsTitle").innerText = "Cosa dicono gli ospiti";
    document.getElementById("waText").innerText = "WhatsApp";
    document.getElementById("availTitle").innerText = "Disponibilità";
    document.getElementById("availText").innerText = "Date aggiornate in tempo reale";
  }
}

function scrollCarousel(direction) {
  const carousel = document.getElementById("myCarousel");
  const scrollAmount = 300;
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
