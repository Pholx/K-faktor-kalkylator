const SVG = {
    airBend() {
    return `
      <svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg">
        <!-- Dyna (V-spår) -->
        <polygon points="20,75 70,75 100,120 130,75 180,75 180,140 20,140" fill="#64748b"/>
        
        <!-- Stans (går inte hela vägen ner till dynans botten) -->
        <path d="M85,0 L115,0 L105,85 Q100,90 95,85 Z" fill="#1e293b"/>
        
        <!-- Plåten: Bockas exakt vid stansen, vingarna ligger plant mot dynans kanter -->
        <polyline points="20,55 70,75 100,90 130,75 180,55" 
                  stroke="#0284c7" stroke-width="6" fill="none" 
                  stroke-linejoin="round" stroke-linecap="round"/>
      </svg>`;
  },

  bottoming() {
    return `
      <svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg">
        <!-- Dyna -->
        <polygon points="20,75 70,75 100,120 130,75 180,75 180,140 20,140" fill="#64748b"/>
        
        <!-- Stansen går hela vägen ner -->
        <path d="M85,0 L115,0 L105,111 Q100,116 95,111 Z" fill="#1e293b"/>
        
        <!-- Plåten: Raka vingar som sticker upp över dynan, böjd vid stansens spets -->
        <polyline points="75,45 100,111 125,45" 
                  stroke="#0284c7" stroke-width="6" fill="none" 
                  stroke-linejoin="round" stroke-linecap="round"/>
        
        <!-- Visuell markering för trycket i botten -->
        <g stroke="#d97706" stroke-width="1.5" fill="none">
          <path d="M90,114 L90,106" />
          <path d="M110,114 L110,106" />
        </g>
      </svg>`;
  },

  coining() {
    return `
      <svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg">
        <!-- Dyna (V-form med rundad botten) -->
        <path d="M 20,140 L 20,70 L 65,70 L 85,95 Q 100,110 115,95 L 135,70 L 180,70 L 180,140 Z" fill="#64748b"/>
        
        <!-- Stans (Matchar dynan, går hela vägen ner) -->
        <path d="M 65,0 L 135,0 L 135,60 L 115,85 Q 100,100 85,85 L 65,60 Z" fill="#1e293b"/>
        
        <!-- Plåten (ligger centrerad i spalten och följer verktygens former) -->
        <path d="M 29,20 L 65,65 L 85,90 Q 100,105 115,90 L 135,65 L 171,20" 
              stroke="#0284c7" stroke-width="6" fill="none" 
              stroke-linejoin="round" stroke-linecap="round"/>
      </svg>`;
  },

  kPrinciple() {
    return `
      <svg viewBox="0 0 340 150" xmlns="http://www.w3.org/2000/svg">
        <rect x="60" y="40" width="220" height="60" fill="#e2e8f0" stroke="#334155" stroke-width="2"/>
        <line x1="60" y1="78" x2="280" y2="78" stroke="#d97706" stroke-width="2" stroke-dasharray="8,4"/>
        <text x="280" y="36" text-anchor="end" font-size="11" fill="#334155">Utsida (sträcks)</text>
        <text x="280" y="116" text-anchor="end" font-size="11" fill="#334155">Insida (komprimeras)</text>
        
        <!-- ÄNDRAD HÄR: x="200" och text-anchor="middle" -->
        <text x="200" y="72" text-anchor="middle" font-size="11" fill="#d97706" font-weight="bold">Neutral axel</text>
        
        <line x1="45" y1="40" x2="45" y2="100" stroke="#0284c7" stroke-width="1.5"/>
        <text x="32" y="74" font-size="12" fill="#0284c7" font-weight="bold" text-anchor="middle">T</text>
        <line x1="75" y1="78" x2="75" y2="100" stroke="#d97706" stroke-width="1.5"/>
        <text x="88" y="92" font-size="12" fill="#d97706" font-weight="bold">t</text>
      </svg>`;
  },

  vRadius() {
    return `
      <svg viewBox="0 0 340 160" xmlns="http://www.w3.org/2000/svg">
        <polygon points="20,60 90,60 170,150 250,60 320,60 320,155 20,155" fill="#64748b"/>
        <line x1="20" y1="55" x2="320" y2="55" stroke="#0284c7" stroke-width="4"/>
        <line x1="90" y1="40" x2="250" y2="40" stroke="#334155" stroke-width="1"/>
        <polygon points="90,40 96,36 96,44" fill="#334155"/>
        <polygon points="250,40 244,36 244,44" fill="#334155"/>
        <text x="170" y="34" text-anchor="middle" font-size="11" fill="#334155" font-weight="bold">V-öppning</text>
        <circle cx="170" cy="145" r="5" fill="none" stroke="#d97706" stroke-width="2"/>
        <text x="185" y="140" font-size="11" fill="#d97706" font-weight="bold">R ≈ V × f</text>
      </svg>`;
  },

  flangeLength(angle) {
    const alpha = (angle === undefined || isNaN(angle) || angle <= 0 || angle >= 180) ? 90 : angle;
    const alphaRad = alpha * Math.PI / 180;
    
    const T = 12; // Plåttjocklek för bilden
    const L_B = 140;
    const L_A = 110;
    
    // Inre teoretisk skärningspunkt (den röda pricken)
    const Vx = 200, Vy = 150; 
    
    // Riktningsvektor för ben A
    const dxA = Math.cos(alphaRad);
    const dyA = -Math.sin(alphaRad);
    
    // Normalvektor som pekar utåt (för att få en rak, vinkelrät ände)
    const nxA = Math.sin(alphaRad);
    const nyA = Math.cos(alphaRad);

    // Beräkna yttre teoretisk skärningspunkt (där ytterkanterna möts)
    const tanHalf = Math.tan(alphaRad / 2);
    const Vx_out = Vx + T * tanHalf;
    const Vy_out = Vy + T;
    
    // Yttre ändpunkt för ben A (vinkelrät mot plåten)
    const P_A_out_x = Vx + L_A * dxA + T * nxA;
    const P_A_out_y = Vy + L_A * dyA + T * nyA;

    // Plåtens kontur (polygon)
    const platePath = `
      M ${Vx - L_B},${Vy}
      L ${Vx},${Vy}
      L ${Vx + L_A * dxA},${Vy + L_A * dyA}
      L ${P_A_out_x},${P_A_out_y}
      L ${Vx_out},${Vy_out}
      L ${Vx - L_B},${Vy_out}
      Z
    `;
    
    // --- MÅTTLINJER FÖR B (Horisontellt ben) ---
    const dimB_offset = 30;
    const dimB_start = { x: Vx - L_B, y: Vy_out + dimB_offset };
    const dimB_end = { x: Vx, y: Vy_out + dimB_offset };
    
    const extB_start = `<line x1="${Vx - L_B}" y1="${Vy_out}" x2="${dimB_start.x}" y2="${dimB_start.y}" stroke="#94a3b8" stroke-width="1" stroke-dasharray="3,3"/>`;
    const extB_end = `<line x1="${Vx}" y1="${Vy}" x2="${dimB_end.x}" y2="${dimB_end.y}" stroke="#94a3b8" stroke-width="1" stroke-dasharray="3,3"/>`;
    const dimB_line = `<line x1="${dimB_start.x}" y1="${dimB_start.y}" x2="${dimB_end.x}" y2="${dimB_end.y}" stroke="#0f172a" stroke-width="1.5"/>`;
    const dimB_ticks = `
      <line x1="${dimB_start.x}" y1="${dimB_start.y - 5}" x2="${dimB_start.x}" y2="${dimB_start.y + 5}" stroke="#0f172a" stroke-width="1.5"/>
      <line x1="${dimB_end.x}" y1="${dimB_end.y - 5}" x2="${dimB_end.x}" y2="${dimB_end.y + 5}" stroke="#0f172a" stroke-width="1.5"/>
    `;
    const dimB_text = `<text x="${(dimB_start.x + dimB_end.x)/2}" y="${dimB_start.y - 8}" text-anchor="middle" font-size="14" fill="#0f172a" font-weight="bold">B</text>`;

    // --- MÅTTLINJER FÖR A (Vinklat ben) ---
    const dimA_offset = 30;
    
    // Start- och slutpunkt för måttlinjen A (parallell med benet)
    const dimA_start = { x: Vx + nxA * dimA_offset, y: Vy + nyA * dimA_offset };
    const dimA_end = { x: Vx + L_A * dxA + nxA * dimA_offset, y: Vy + L_A * dyA + nyA * dimA_offset };
    
    const extA_start = `<line x1="${Vx}" y1="${Vy}" x2="${dimA_start.x}" y2="${dimA_start.y}" stroke="#94a3b8" stroke-width="1" stroke-dasharray="3,3"/>`;
    const extA_end = `<line x1="${Vx + L_A * dxA}" y1="${Vy + L_A * dyA}" x2="${dimA_end.x}" y2="${dimA_end.y}" stroke="#94a3b8" stroke-width="1" stroke-dasharray="3,3"/>`;
    const dimA_line = `<line x1="${dimA_start.x}" y1="${dimA_start.y}" x2="${dimA_end.x}" y2="${dimA_end.y}" stroke="#0f172a" stroke-width="1.5"/>`;
    const dimA_ticks = `
      <line x1="${dimA_start.x - nxA * 5}" y1="${dimA_start.y - nyA * 5}" x2="${dimA_start.x + nxA * 5}" y2="${dimA_start.y + nyA * 5}" stroke="#0f172a" stroke-width="1.5"/>
      <line x1="${dimA_end.x - nxA * 5}" y1="${dimA_end.y - nyA * 5}" x2="${dimA_end.x + nxA * 5}" y2="${dimA_end.y + nyA * 5}" stroke="#0f172a" stroke-width="1.5"/>
    `;
    
    // Rotation för text A
    let rotA = alpha - 90;
    if (rotA < -90) rotA += 180;
    if (rotA > 90) rotA -= 180;
    
    const textAx = (dimA_start.x + dimA_end.x)/2 + nxA * 12;
    const textAy = (dimA_start.y + dimA_end.y)/2 + nyA * 12;
    const dimA_text = `<text x="${textAx}" y="${textAy}" text-anchor="middle" dominant-baseline="middle" font-size="14" fill="#0f172a" font-weight="bold" transform="rotate(${rotA}, ${textAx}, ${textAy})">A</text>`;

    // --- VINKELBÅGE ---
    const arcR = 45;
    const arcStart = { x: Vx - arcR, y: Vy };
    const arcEnd = { x: Vx + arcR * dxA, y: Vy + arcR * dyA };
    
    const midAngle = alphaRad / 2;
    const angleTextPos = { x: Vx - 70 * Math.cos(midAngle), y: Vy - 70 * Math.sin(midAngle) };

    return `
      <svg viewBox="0 0 500 220" xmlns="http://www.w3.org/2000/svg">
        <!-- Streckade linjer för teoretisk skärningspunkt -->
        <line x1="${Vx}" y1="${Vy}" x2="${Vx - 40}" y2="${Vy}" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4,4"/>
        <line x1="${Vx}" y1="${Vy}" x2="${Vx + 40 * dxA}" y2="${Vy + 40 * dyA}" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4,4"/>
        
        <!-- Själva plåten (rak ände) -->
        <path d="${platePath}" fill="#bae6fd" stroke="#0284c7" stroke-width="2" stroke-linejoin="round"/>
        
        <!-- Markering för teoretisk bockpunkt på insidan -->
        <circle cx="${Vx}" cy="${Vy}" r="4" fill="#e11d48" />
        
        <!-- Måttlinjer B -->
        ${extB_start}
        ${extB_end}
        ${dimB_line}
        ${dimB_ticks}
        ${dimB_text}
        
        <!-- Måttlinjer A -->
        ${extA_start}
        ${extA_end}
        ${dimA_line}
        ${dimA_ticks}
        ${dimA_text}
        
        <!-- Vinkelmarkering -->
        <path d="M ${arcStart.x},${arcStart.y} A ${arcR},${arcR} 0 0 1 ${arcEnd.x},${arcEnd.y}" fill="none" stroke="#334155" stroke-width="1.5"/>
        <text x="${angleTextPos.x}" y="${angleTextPos.y}" text-anchor="middle" dominant-baseline="middle" font-size="12" fill="#334155" font-weight="bold">${alpha}°</text>
        
        <!-- Förklaringstext -->
        <text x="250" y="210" text-anchor="middle" font-size="12" fill="#64748b" font-weight="bold">A och B mäts från ytterkant till den röda pricken (teoretisk bockpunkt på insidan).</text>
      </svg>
    `;
  }
};