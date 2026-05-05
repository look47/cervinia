let lang = "it";

// Funzione Cambio Lingua
function toggleLang() {
  if (lang === "it") {
    document.getElementById("desc").innerText = "Your modern retreat on the Matterhorn slopes";
    document.getElementById("waText").innerText = "Message me";
    document.getElementById("availTitle").innerText = "Availability";
    document.getElementById("availText").innerText = "Check updated dates on the calendar";
    lang = "en";
  } else {
    document.getElementById("desc").innerText = "Il tuo rifugio moderno sulle piste del Cervino";
    document.getElementById("waText").innerText = "WhatsApp";
    document.getElementById("availTitle").innerText = "Disponibilità";
    document.getElementById("availText").innerText = "Date aggiornate in tempo reale";
    lang = "it";
  }
}

// Funzione per ingrandire le foto
function openLightbox(src) {
  document.getElementById("lightboxImg").src = src;
  document.getElementById("lightbox").style.display = "flex";
}

