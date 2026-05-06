const APP_CONFIG = {
    googleSheetUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTdggamylvF2ppk6wdHX4tkPKF97eJRSL04x-mgT_dppkwqYJbfHp3gdgtgJFbfqeyb2xa17nDTISGZ/pub?gid=0&single=true&output=csv",
    
    // Lascia pure questi segnaposto per ora
    emailjs: {
        publicKey: "TUA_PUBLIC_KEY",
        serviceId: "TUO_SERVICE_ID",
        templateId: "TUO_TEMPLATE_ID"
    },

    prices: { standard: 150, winter: 220 },
    markup: { 3: 1.15, 4: 1.30, 5: 1.45, 6: 1.60 },
    childExtra: 0.03,
    marketingMultiplier: 1.13 
};
