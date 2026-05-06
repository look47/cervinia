async function syncBookedDates() {
    try {
        const response = await fetch(APP_CONFIG.googleSheetUrl);
        const csvData = await response.text();
        const rows = csvData.split(/\r?\n/);
        let datesToBlock = [];

        rows.forEach(row => {
            const cols = row.split(',');
            // Il file ponte ha solo 2 colonne: A (ingresso) e B (uscita)
            const startStr = cols[0]?.trim();
            const endStr = cols[1]?.trim();

            if (startStr && endStr && startStr.includes('/')) {
                const start = parseItalianDate(startStr);
                const end = parseItalianDate(endStr);
                if (!isNaN(start) && !isNaN(end)) {
                    let cur = new Date(start);
                    while (cur < end) {
                        datesToBlock.push(cur.toISOString().split('T')[0]);
                        cur.setDate(cur.getDate() + 1);
                    }
                }
            }
        });
        bookedDates = [...new Set(datesToBlock)];
        renderCalendar();
    } catch (e) { 
        console.error("Errore Sync: Controlla che il foglio ponte sia pubblicato come CSV", e); 
    }
}
