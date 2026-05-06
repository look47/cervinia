/* --- LIGHTBOX STYLES AGGIORNATI --- */
#lightbox { 
    display: none; 
    position: fixed; 
    inset: 0; 
    background: rgba(0,0,0,0.95); 
    z-index: 9999; 
    align-items: center; 
    justify-content: center; 
}

.lb-content {
    position: relative;
    max-width: 90vw;
    max-height: 85vh;
    display: flex;
    flex-direction: column;
    align-items: center;
}

#lbImg { 
    max-width: 100%; 
    max-height: 85vh; 
    border-radius: 8px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    user-select: none;
}

.close-lb { 
    position: absolute; 
    top: 20px; 
    right: 30px; 
    color: white; 
    font-size: 40px; 
    cursor: pointer; 
    z-index: 10000;
    transition: color 0.2s;
}
.close-lb:hover { color: var(--accent); }

.lb-nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(255,255,255,0.1);
    border: none;
    color: white;
    font-size: 30px;
    padding: 15px 20px;
    cursor: pointer;
    border-radius: 50%;
    transition: background 0.3s, color 0.3s;
    z-index: 10000;
}
.lb-nav:hover {
    background: var(--accent);
    color: black;
}
.lb-prev { left: 30px; }
.lb-next { right: 30px; }

.lb-counter {
    position: absolute;
    bottom: -30px;
    color: white;
    font-size: 16px;
    letter-spacing: 2px;
    font-family: monospace;
}

/* Nascondi frecce su schermi piccolissimi, usa il tap ai lati (gestito via JS o CSS avanzato) o tienile piccole */
@media (max-width: 600px) {
    .lb-nav { padding: 10px 15px; font-size: 20px; }
    .lb-prev { left: 10px; }
    .lb-next { right: 10px; }
}
