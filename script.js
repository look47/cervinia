// ... (Variabili iniziali invariate) ...

function setLanguage(l) {
    currentLang = l;
    localStorage.setItem('cervinia_lang', l);
    
    // Aggiorna tutti i testi
    document.querySelectorAll('.lang-txt').forEach(el => {
        el.innerText = el.getAttribute(`data-${l}`);
    });

    // ILLUMINA LA LINGUA SELEZIONATA
    const itFlag = document.getElementById('lang-it');
    const enFlag = document.getElementById('lang-en');
    if(itFlag && enFlag) {
        itFlag.classList.toggle('active', l === 'it');
        enFlag.classList.toggle('active', l === 'en');
    }

    renderReviews();
    renderCalendar();
    updatePrice();
}

// ... (Resto del codice invariato) ...
