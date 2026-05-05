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


/* STILE DESCRIZIONE */
.description-section {
  background: rgba(0, 0, 0, 0.4);
  padding: 30px;
  border-radius: 15px;
  margin: 30px 0;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  text-align: left;
}

.description-section h2 {
  margin-top: 0;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-bottom: 2px solid #25D366;
  padding-bottom: 10px;
  display: inline-block;
}

.description-section p {
  line-height: 1.6;
  font-size: 16px;
  color: #ddd;
  margin-bottom: 15px;
}

.rating-box {
  background: rgba(255, 255, 255, 0.1);
  padding: 15px;
  border-radius: 8px;
  margin-top: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: bold;
}

.rating-box i {
  color: #FFD700; /* Giallo stella */
  font-size: 20px;
}
