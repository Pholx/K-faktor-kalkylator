const UI = {
  els: {},

  init() {
    this.cacheEls();
    this.initTabs();
    this.initMaterials();
    this.injectSVGs();
    this.attachListeners();
    this.loadSettings();
    this.applyMethodVisibility('air');
    this.recalc();
  },

  cacheEls() {
    this.els = {
      material:   document.getElementById('material'),
      thickness:  document.getElementById('thickness'),
      vOpening:   document.getElementById('vOpening'),
      punchRadius:document.getElementById('punchRadius'),
      radius:     document.getElementById('radius'),
      angle:      document.getElementById('angle'),
      flangeA:    document.getElementById('flat_flangeA'), 
      flangeB:    document.getElementById('flat_flangeB'),
      calcRadiusBtn: document.getElementById('calcRadiusBtn'),
      result:     document.getElementById('result'),
      resultFlat: document.getElementById('result-flat'),
      useManualK: document.getElementById('useManualK'),
      manualK:    document.getElementById('manualK'),
      usePunchRadiusBtn: document.getElementById('usePunchRadiusBtn'),
      punchRadiusVal:    document.getElementById('punchRadiusVal'),
    };
  },

  loadSettings() {
    try {
      const savedUseManual = localStorage.getItem('kfactor_useManual');
      const savedManualK = localStorage.getItem('kfactor_manualK');
      if (savedUseManual === 'true' && this.els.useManualK) this.els.useManualK.checked = true;
      if (savedManualK && this.els.manualK) this.els.manualK.value = savedManualK;
    } catch(e) {}
  },

  getMethod() {
    const el = document.querySelector('input[name="method"]:checked');
    return el ? el.value : 'air';
  },

  initTabs() {
    document.querySelectorAll('.tab').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(s => s.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(btn.dataset.tab).classList.add('active');
      });
    });
  },

  initMaterials() {
    let html = '';
    for (const [key, m] of Object.entries(MATERIALS)) {
      const selected = key === 'steel' ? 'selected' : '';
      html += `<option value="${key}" ${selected}>${m.name}</option>`;
    }
    if (this.els.material) this.els.material.innerHTML = html;
    const flatMat = document.getElementById('flat_material');
    if (flatMat) flatMat.innerHTML = html;
  },

  injectSVGs() {
    const set = (id, html) => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = html;
    };
    set('svg-air', SVG.airBend());
    set('svg-bottom', SVG.bottoming());
    set('svg-coin', SVG.coining());
    set('flat_svg-air', SVG.airBend());
    set('flat_svg-bottom', SVG.bottoming());
    set('flat_svg-coin', SVG.coining());
    set('svg-kprinciple', SVG.kPrinciple());
    set('svg-vradius', SVG.vRadius());
  },

  attachListeners() {
    const sync = (id1, id2) => {
      const el1 = document.getElementById(id1);
      const el2 = document.getElementById(id2);
      if (el1 && el2) {
        el1.addEventListener('input', () => { el2.value = el1.value; this.recalc(); });
        el1.addEventListener('change', () => { el2.value = el1.value; this.recalc(); });
        el2.addEventListener('input', () => { el1.value = el2.value; this.recalc(); });
        el2.addEventListener('change', () => { el1.value = el2.value; this.recalc(); });
      }
    };

    sync('material', 'flat_material');
    sync('thickness', 'flat_thickness');
    sync('vOpening', 'flat_vOpening');
    sync('punchRadius', 'flat_punchRadius');
    sync('radius', 'flat_radius');
    sync('angle', 'flat_angle');
    
    const fA = document.getElementById('flat_flangeA');
    const fB = document.getElementById('flat_flangeB');
    if (fA) { fA.addEventListener('input', () => this.recalc()); fA.addEventListener('change', () => this.recalc()); }
    if (fB) { fB.addEventListener('input', () => this.recalc()); fB.addEventListener('change', () => this.recalc()); }

    document.querySelectorAll('input[name="method"]').forEach(r => {
      r.addEventListener('change', () => {
        const val = r.value;
        const flatRadio = document.querySelector(`input[name="flat_method"][value="${val}"]`);
        if (flatRadio) flatRadio.checked = true;
        this.applyMethodVisibility(val);
        this.recalc();
      });
    });

    document.querySelectorAll('input[name="flat_method"]').forEach(r => {
      r.addEventListener('change', () => {
        const val = r.value;
        const mainRadio = document.querySelector(`input[name="method"][value="${val}"]`);
        if (mainRadio) mainRadio.checked = true;
        this.applyMethodVisibility(val);
        this.recalc();
      });
    });

    if (this.els.calcRadiusBtn) {
      this.els.calcRadiusBtn.addEventListener('click', () => {
        const v = parseFloat(this.els.vOpening?.value || 0);
        if (v > 0 && this.els.radius) {
          const r = naturalRadius(v, this.els.material.value).toFixed(2);
          this.els.radius.value = r;
          const flatR = document.getElementById('flat_radius');
          if (flatR) flatR.value = r;
          this.recalc();
        }
      });
    }

    const flatCalcBtn = document.getElementById('flat_calcRadiusBtn');
    if (flatCalcBtn) {
      flatCalcBtn.addEventListener('click', () => {
        const v = parseFloat(document.getElementById('flat_vOpening')?.value || 0);
        const matKey = document.getElementById('flat_material')?.value;
        if (v > 0) {
          const r = naturalRadius(v, matKey).toFixed(2);
          document.getElementById('flat_radius').value = r;
          if (this.els.radius) this.els.radius.value = r;
          this.recalc();
        }
      });
    }

    if (this.els.useManualK) {
      this.els.useManualK.addEventListener('change', () => {
        localStorage.setItem('kfactor_useManual', this.els.useManualK.checked);
        this.recalc();
      });
    }
    if (this.els.manualK) {
      this.els.manualK.addEventListener('input', () => {
        localStorage.setItem('kfactor_manualK', this.els.manualK.value);
        this.recalc();
      });
    }

    if (this.els.usePunchRadiusBtn) {
      this.els.usePunchRadiusBtn.addEventListener('click', () => {
        const pR = parseFloat(this.els.punchRadius?.value || 0);
        if (pR > 0 && this.els.radius) {
          this.els.radius.value = pR.toFixed(2);
          const flatR = document.getElementById('flat_radius');
          if (flatR) flatR.value = pR.toFixed(2);
          this.recalc();
        }
      });
    }
  },

  applyMethodVisibility(method) {
    document.querySelectorAll('[data-show-for]').forEach(el => {
      const visible = el.dataset.showFor.split(' ').includes(method);
      el.classList.toggle('hidden', !visible);
    });
  },

  recalc() {
    if (!this.els.result) return;

    try {
      const T = parseFloat(this.els.thickness?.value);
      const V = parseFloat(this.els.vOpening?.value || 0);
      const pR = parseFloat(this.els.punchRadius?.value || 0);
      const angle = parseFloat(this.els.angle?.value);
      
      const A = parseFloat(this.els.flangeA?.value) || 0;
      const B = parseFloat(this.els.flangeB?.value) || 0;
      const matKey = this.els.material?.value;
      const method = this.getMethod();

      const flangeSvgContainer = document.getElementById('svg-flanges');
      if (flangeSvgContainer) {
        flangeSvgContainer.innerHTML = SVG.flangeLength(angle || 90);
      }

      let R = 0;

      if (method === 'air') {
        R = parseFloat(this.els.radius?.value);
        if (!(T > 0) || !(R > 0) || !(angle > 0) || !(angle < 180)) {
          this.els.result.innerHTML = `<p class="warning">Fyll i giltiga värden (T, R, vinkel 1–179°).</p>`;
          if(this.els.resultFlat) this.els.resultFlat.innerHTML = `<p class="warning">Fyll i giltiga värden.</p>`;
          return;
        }
      } else {
        R = pR;
        if (!(T > 0) || !(R > 0) || !(angle > 0) || !(angle < 180)) {
          this.els.result.innerHTML = `<p class="warning">Fyll i giltiga värden (T, stansradie, vinkel 1–179°).</p>`;
          if(this.els.resultFlat) this.els.resultFlat.innerHTML = `<p class="warning">Fyll i giltiga värden.</p>`;
          return;
        }
      }

      const ratio = R / T;
      const mat = MATERIALS[matKey];
      if (!mat) {
         this.els.result.innerHTML = `<p class="warning">Välj ett giltigt material.</p>`;
         if(this.els.resultFlat) this.els.resultFlat.innerHTML = `<p class="warning">Välj ett giltigt material.</p>`;
         return;
      }

      const baseK = getBaseK(matKey, ratio);
      let K = getMethodAdjustedK(baseK, method);
      K = Math.min(Math.max(K, 0.20), 0.50);
      
      const theoreticalK = K;
      let source = 'Teoretisk (materialkurva)';
      const warnings = []; 

      const isOverride = this.els.useManualK && this.els.useManualK.checked;
      if (isOverride && this.els.manualK) {
        const manualVal = parseFloat(this.els.manualK.value);
        if (manualVal > 0 && manualVal <= 0.5) {
          K = manualVal;
          source = 'Manuellt inställd (Override)';
        } else {
          warnings.push({ type: 'warn', text: 'Ogiltigt manuellt K-värde. Använder teoretiskt värde istället (tillåtet intervall 0.1–0.5).' });
        }
      }

      const BA = calculateBA(angle, R, K, T);
      const BD = calculateBD(angle, R, T, BA);
      
      const flat = (A >= 0 && B >= 0) ? (A + B - BD) : null;

      const BA_std = calculateBA(angle, R, theoreticalK, T);
      const BD_std = calculateBD(angle, R, T, BA_std);

      const diff = BD_std - BD; 
      const sign = diff > 0 ? '+' : '';
      let color = 'var(--text)';
      
      if (isOverride && Math.abs(diff) > 0.005) {
        color = diff > 0 ? 'var(--ok)' : 'var(--warn)';
      }
      
      const displayDiff = isOverride ? `${sign}${diff.toFixed(2)} mm` : '0.00 mm';

      const diffHtml = `
        <div style="grid-column: 1 / -1; background: #fff; border: 1px solid var(--border); margin-top: 0.5rem; border-radius: 4px; padding: .55rem .8rem; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 1px 3px rgba(0,0,0,.05);">
          <span style="color: var(--muted); font-size: .72rem; font-weight: 600; text-transform: uppercase;">Skillnad i platt längd (vs teoretiskt) <span class="tooltip" data-tip="Hur mycket den platta längden ändras när du använder override-värdet istället för materialkurvan. Positivt värde (+) betyder att biten blir längre, negativt (−) att den blir kortare.">?</span></span>
          <strong style="font-family: var(--mono); font-size: 1.1rem; color: ${color};">${displayDiff}</strong>
        </div>
      `;

      const springback = mat.springback || 0;
      const overbend = calculateOverbend(angle, mat);

      // Hantera varning för stansradie och visa/dölj knappen
      let natR = 0;
      if (method === 'air' && V > 0) {
        natR = naturalRadius(V, matKey);
        
        // NYHET: Kolla om stansen är större OCH om R inte redan är satt till stansradien
        if (pR > natR && Math.abs(R - pR) > 0.01) {
          warnings.push({ type: 'warn', text: `Stansradien (${pR.toFixed(2)} mm) är större än naturlig radie från V-öppningen (${natR.toFixed(2)} mm). Stansen styr då innerradien.` });
          
          if (this.els.usePunchRadiusBtn) {
            this.els.usePunchRadiusBtn.style.display = 'inline-block';
            if (this.els.punchRadiusVal) this.els.punchRadiusVal.textContent = pR.toFixed(2);
          }
        } else {
          if (this.els.usePunchRadiusBtn) this.els.usePunchRadiusBtn.style.display = 'none';
        }
      } else {
        if (this.els.usePunchRadiusBtn) this.els.usePunchRadiusBtn.style.display = 'none';
      }

      if (K >= 0.499 && !isOverride) {
        warnings.push({ type: 'info', text: 'K ligger vid 0,50 (neutrala axeln mitt i plåten). Vid mycket stor R/T närmar sig K detta tak.' });
      }
      if (springback >= 8) {
        warnings.push({ type: 'info', text: `Detta material har hög återfjädring (ca ${springback.toFixed(1)}°). Bocka till ${overbend.toFixed(1)}° för att få en slutlig vinkel på ${angle}°.` });
      }
      if (isOverride && source === 'Manuellt inställd (Override)') {
        warnings.push({ type: 'info', text: 'Manuell override är aktiv. K-faktorn beräknas inte från materialkurvan.' });
      }

      const methodLabel = { air: 'Luftbockning', bottom: 'Bottning', coin: 'Prägling' }[method];

      this.els.result.innerHTML = `
        <div class="result-hero">
          <div class="k-badge">K-FAKTOR 
            <span class="tooltip" data-tip="För att beräkna den teoretiska längden på den plana plåten tar man hänsyn till att materialet sträcks på utsidan och komprimeras på insidan. K-faktorn (t.ex. 0,4) betyder att den neutrala axeln (den teoretiska längden) ligger 40% av plåttjockleken in från insidan. Detta används för att räkna ut den exakta utvikta längden.">?</span>
          </div>
          <div class="k-value">${K.toFixed(4)}</div>
          <div class="k-source">${source}</div>
        </div>
        <div class="k-curve-card">
          <div class="k-curve-title">K vs R/T · ${CATEGORY_LABELS[mat.category]}</div>
          ${this.renderKCurveSVG(mat.category, ratio, K)}
        </div>
        <div class="result-details">
          <div><span>R/T <span class="tooltip" data-tip="Förhållandet mellan innerradie (R) och plåttjocklek (T). Detta styr starkt K-faktorn. Ju högre R/T, desto närmare 0,5 hamnar K (den neutrala axeln flyttas mot mitten av plåten).">?</span></span><strong>${ratio.toFixed(2)}</strong></div>
          <div><span>Material</span><strong>${CATEGORY_LABELS[mat.category]}</strong></div>
          <div><span>Kategori</span><strong>${CATEGORY_LABELS[mat.category]}</strong></div>
          <div><span>Metod</span><strong>${methodLabel}</strong></div>
          <div><span>Återfjädring (ca) <span class="tooltip" data-tip="Uppskattad återfjädring i grader för detta material. Förhärdat stål och aluminium 6061-T6 fjädrar tillbaka mycket mer och kräver större överbockning. Kontrollera alltid med en testbock.">?</span></span><strong>${springback.toFixed(1)}°</strong></div>
          <div><span>Rek. överbockning</span><strong>${overbend.toFixed(1)}°</strong></div>
          
          ${diffHtml}
          
        </div>
        <div class="warnings">
          ${warnings.map(w => `<div class="warning ${w.type === 'info' ? 'info' : ''}">${w.type === 'warn' ? '⚠️ ' : 'ℹ️ '}${w.text}</div>`).join('')}
        </div>
      `;

      if (this.els.resultFlat) {
        this.els.resultFlat.innerHTML = `
          <div class="result-metrics">
            <div><span>Böjtillägg (BA)</span><strong>${BA.toFixed(3)} mm</strong></div>
            <div><span>Bockavdrag (BD)</span><strong>${BD.toFixed(3)} mm</strong></div>
            ${flat !== null ? `<div class="metric-emphasis"><span>Platt längd (A + B − BD)</span><strong>${flat.toFixed(2)} mm</strong></div>` : `<div><span>Platt längd</span><strong>Fyll i A och B</strong></div>`}
          </div>
        `;
      }

    } catch (e) {
      console.error(e);
      this.els.result.innerHTML = `<p class="warning">Ett fel uppstod: ${e.message}</p>`;
      if (this.els.resultFlat) this.els.resultFlat.innerHTML = `<p class="warning">Ett fel uppstod.</p>`;
    }
  },

  renderKCurveSVG(category, currentRatio, currentK) {
    const W = 340, H = 140;
    const padL = 34, padR = 14, padT = 14, padB = 26;
    const xMin = 0, xMax = 8;
    const yMin = 0.25, yMax = 0.52;
    const plotW = W - padL - padR;
    const plotH = H - padT - padB;
    const sx = r => padL + (Math.min(Math.max(r, xMin), xMax) - xMin) / (xMax - xMin) * plotW;
    const sy = k => padT + (yMax - Math.min(Math.max(k, yMin), yMax)) / (yMax - yMin) * plotH;

    const samples = [];
    for (let r = 0; r <= xMax + 0.01; r += 0.1) samples.push({ x: r, y: interpolateK(category, r) });
    let path = `M ${sx(samples[0].x)} ${sy(samples[0].y)}`;
    for (let i = 1; i < samples.length; i++) path += ` L ${sx(samples[i].x)} ${sy(samples[i].y)}`;

    const cx = sx(currentRatio);
    const cy = sy(currentK);

    let grid = '';
    [0.3, 0.4, 0.5].forEach(y => {
      const py = sy(y);
      grid += `<line x1="${padL}" y1="${py}" x2="${W-padR}" y2="${py}" stroke="#e2e8f0" stroke-width="1"/>`;
      grid += `<text x="${padL-6}" y="${py+3}" text-anchor="end" font-size="9" fill="#94a3b8">${y.toFixed(1)}</text>`;
    });
    [0, 2, 4, 6, 8].forEach(x => {
      const px = sx(x);
      grid += `<line x1="${px}" y1="${padT}" x2="${px}" y2="${H-padB}" stroke="#e2e8f0" stroke-width="1"/>`;
      grid += `<text x="${px}" y="${H-padB+14}" text-anchor="middle" font-size="9" fill="#94a3b8">${x}</text>`;
    });

    return `
      <svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;display:block">
        <rect x="${padL}" y="${padT}" width="${plotW}" height="${plotH}" fill="#f8fafc" rx="3"/>
        ${grid}
        <path d="${path}" stroke="#0284c7" stroke-width="2" fill="none"/>
        <line x1="${cx}" y1="${padT}" x2="${cx}" y2="${H-padB}" stroke="#d97706" stroke-width="1" stroke-dasharray="3,3"/>
        <line x1="${padL}" y1="${cy}" x2="${W-padR}" y2="${cy}" stroke="#d97706" stroke-width="1" stroke-dasharray="3,3"/>
        <circle cx="${cx}" cy="${cy}" r="5" fill="#d97706" stroke="#fff" stroke-width="2"/>
        <text x="${W-padR-4}" y="${padT+12}" text-anchor="end" font-size="10" fill="#64748b" font-weight="600">R/T</text>
        <text x="${padL-6}" y="${padT-2}" text-anchor="end" font-size="10" fill="#64748b" font-weight="600">K</text>
      </svg>`;
  }
};