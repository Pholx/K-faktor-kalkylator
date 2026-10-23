const MATERIALS = {
  alu:       { name: 'Aluminium 5052',            category: 'soft',       vFactor: 0.12, springback: 5 },
  copper:    { name: 'Koppar & Mässing',          category: 'soft',       vFactor: 0.16, springback: 0.5 },
  steel:     { name: 'Mjukt stål (CRS)',           category: 'medium',     vFactor: 0.16, springback: 1.5 },
  hsla:      { name: 'Höghållfast stål (HSLA)',   category: 'medium',     vFactor: 0.16, springback: 3 },
  ss:        { name: 'Rostfritt 304',             category: 'hard',       vFactor: 0.20, springback: 3.5 },
  hardened:  { name: 'Förhärdat stål (Hardox)',   category: 'extra_hard', vFactor: 0.20, springback: 15 },
  alu6061:   { name: 'Aluminium 6061-T6',         category: 'extra_hard', vFactor: 0.12, springback: 10 },
};

const K_CURVES = {
  soft: [
    { x: 0.1, y: 0.28 }, { x: 0.5, y: 0.30 }, { x: 1, y: 0.33 },
    { x: 2,   y: 0.38 }, { x: 3,   y: 0.42 }, { x: 5, y: 0.48 },
    { x: 10,  y: 0.50 },
  ],
  medium: [
    { x: 0.1, y: 0.32 }, { x: 0.5, y: 0.35 }, { x: 1, y: 0.38 },
    { x: 2,   y: 0.41 }, { x: 3,   y: 0.44 }, { x: 5, y: 0.48 },
    { x: 10,  y: 0.50 },
  ],
  hard: [
    { x: 0.1, y: 0.34 }, { x: 0.5, y: 0.37 }, { x: 1, y: 0.40 },
    { x: 2,   y: 0.43 }, { x: 3,   y: 0.46 }, { x: 5, y: 0.49 },
    { x: 10,  y: 0.50 },
  ],
  extra_hard: [
    { x: 0.1, y: 0.38 }, { x: 0.5, y: 0.40 }, { x: 1, y: 0.42 },
    { x: 2,   y: 0.45 }, { x: 3,   y: 0.47 }, { x: 5, y: 0.49 },
    { x: 10,  y: 0.50 },
  ],
};

const CATEGORY_LABELS = {
  soft:       'Mjukt',
  medium:     'Medel',
  hard:       'Hårt',
  extra_hard: 'Förhärdat',
};