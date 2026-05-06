/* 
   MODIFICA SOLO QUESTO FILE PER AGGIORNARE IL SITO
   Le date vanno scritte nel formato "AAAA-MM-GG"
*/

const APP_CONFIG = {
    // Aggiungi qui le date da bloccare (già prenotate)
    bookedDates: [
        "2026-06-24", "2026-06-25", "2026-06-26", "2026-06-27",
        "2026-08-03", "2026-08-04", "2026-08-05", "2026-08-06", 
        "2026-08-07", "2026-08-08"
    ],

    // Impostazioni Prezzi
    prices: {
        standard: 150, // Prezzo base (maggio-ottobre)
        winter: 220    // Prezzo invernale (novembre-aprile)
    },

    // Strategia Occupanti (maggiorazioni)
    markup: {
        3: 1.15, // 3 Adulti: +15%
        4: 1.30, // 4 Adulti: +30%
        5: 1.45, // 5 Adulti: +45%
        6: 1.60  // 6 Adulti: +60%
    },
    childExtra: 0.03, // +3% per ogni bambino

    // Sconto Marketing (quello finto per mostrare il prezzo barrato)
    // 1.13 significa che il prezzo barrato sarà il 13% più alto del reale
    marketingMultiplier: 1.13 
};
