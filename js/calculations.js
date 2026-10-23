function interpolateK(category, ratio) {
  const curve = K_CURVES[category];
  if (!curve || curve.length === 0) return 0.4;
  if (ratio <= curve[0].x) return curve[0].y;
  if (ratio >= curve[curve.length - 1].x) return curve[curve.length - 1].y;

  for (let i = 0; i < curve.length - 1; i++) {
    const a = curve[i];
    const b = curve[i + 1];
    if (ratio >= a.x && ratio <= b.x) {
      const t = (ratio - a.x) / (b.x - a.x);
      return a.y + t * (b.y - a.y);
    }
  }
  return curve[curve.length - 1].y;
}

function getBaseK(materialKey, ratio) {
  const m = MATERIALS[materialKey];
  if (!m) return 0.4;
  return interpolateK(m.category, ratio);
}

function getMethodAdjustedK(baseK, method) {
  if (method === 'air')    return baseK;
  if (method === 'bottom') return Math.min(baseK + 0.06, 0.50); 
  if (method === 'coin')   return Math.min(baseK + 0.04, 0.50);
  return baseK;
}

function naturalRadius(vOpening, materialKey) {
  const m = MATERIALS[materialKey];
  if (!m) return vOpening / 6;
  return vOpening * m.vFactor;
}

function calculateBA(angleDeg, R, K, T) {
  return (Math.PI / 180) * angleDeg * (R + K * T);
}

function calculateBD(angleDeg, R, T, BA) {
  const ossb = Math.tan((angleDeg * Math.PI / 180) / 2) * (R + T);
  return 2 * ossb - BA;
}

function backCalcK(BA, angleDeg, R, T) {
  return ((BA * 180 / (Math.PI * angleDeg)) - R) / T;
}

/**
 * Uppskattar rekommenderad överbockningsvinkel.
 * @param {number} targetAngle - Den önskade slutliga vinkeln (t.ex. 90).
 * @param {object} material - Materialobjektet från MATERIALS.
 * @returns {number} Rekommenderad verktygsvinkel (targetAngle + springback).
 */
function calculateOverbend(targetAngle, material) {
  if (!material || !material.springback) return targetAngle;
  return targetAngle + material.springback;
}