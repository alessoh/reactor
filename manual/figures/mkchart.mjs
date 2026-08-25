import { writeFileSync } from "node:fs";

// Values produced by the solver (web/src/lib/reactor.ts), U-235 / H2O, cube of edge L.
const fine = [
  [36, 110.405], [38, 9.704], [40, 6.055], [42, 4.888], [44, 4.385], [46, 4.163],
  [48, 4.090], [50, 4.108], [52, 4.191], [54, 4.321], [56, 4.490], [58, 4.692],
  [60, 4.923], [62, 5.181], [64, 5.466], [66, 5.774], [68, 6.107], [70, 6.464],
  [72, 6.844], [74, 7.248], [76, 7.676], [78, 8.127], [80, 8.604], [82, 9.104],
  [84, 9.630], [86, 10.181], [88, 10.759], [90, 11.362],
];
const full = [
  [40, 6.055], [50, 4.108], [60, 4.923], [80, 8.604], [100, 14.79], [150, 44.29],
  [200, 100.81], [250, 193.27], [300, 330.65], [400, 776.01], [500, 1508.71],
];

const W = 900, H = 360;
const P = { l: 62, r: 18, t: 34, b: 52 };
const panelW = (W - 40) / 2 - 20;

function panel(ox, data, xmin, xmax, ymin, ymax, xticks, yticks, title, sub) {
  const pw = panelW - P.l - P.r, ph = H - P.t - P.b - 26;
  const X = (v) => ox + P.l + ((v - xmin) / (xmax - xmin)) * pw;
  const Y = (v) =>
    P.t + 26 + ph - ((Math.log10(v) - Math.log10(ymin)) / (Math.log10(ymax) - Math.log10(ymin))) * ph;
  let s = "";
  s += `<text x="${ox + P.l + pw / 2}" y="${P.t + 4}" text-anchor="middle" font-size="12.5" font-weight="600" fill="#0f766e">${title}</text>`;
  // grid + y ticks
  for (const t of yticks) {
    s += `<line x1="${ox + P.l}" y1="${Y(t)}" x2="${ox + P.l + pw}" y2="${Y(t)}" stroke="#e0ddd4" stroke-width="1"/>`;
    s += `<text x="${ox + P.l - 8}" y="${Y(t) + 3.5}" text-anchor="end" font-size="10" fill="#7d786e">${t}</text>`;
  }
  for (const t of xticks) {
    s += `<line x1="${X(t)}" y1="${P.t + 26}" x2="${X(t)}" y2="${P.t + 26 + ph}" stroke="#f0eee8" stroke-width="1"/>`;
    s += `<text x="${X(t)}" y="${P.t + 26 + ph + 15}" text-anchor="middle" font-size="10" fill="#7d786e">${t}</text>`;
  }
  // axes
  s += `<line x1="${ox + P.l}" y1="${P.t + 26}" x2="${ox + P.l}" y2="${P.t + 26 + ph}" stroke="#cbc7ba" stroke-width="1.2"/>`;
  s += `<line x1="${ox + P.l}" y1="${P.t + 26 + ph}" x2="${ox + P.l + pw}" y2="${P.t + 26 + ph}" stroke="#cbc7ba" stroke-width="1.2"/>`;
  // curve
  const pts = data.filter(([x]) => x >= xmin && x <= xmax).map(([x, y]) => `${X(x).toFixed(1)},${Y(y).toFixed(1)}`);
  s += `<polyline points="${pts.join(" ")}" fill="none" stroke="#0f766e" stroke-width="2.2" stroke-linejoin="round"/>`;
  for (const [x, y] of data.filter(([x]) => x >= xmin && x <= xmax))
    s += `<circle cx="${X(x).toFixed(1)}" cy="${Y(y).toFixed(1)}" r="2.6" fill="#fff" stroke="#0f766e" stroke-width="1.4"/>`;
  // axis labels
  s += `<text x="${ox + P.l + pw / 2}" y="${H - 12}" text-anchor="middle" font-size="11" fill="#4a4741">Cube edge length (cm)</text>`;
  s += `<text transform="translate(${ox + 15},${P.t + 26 + ph / 2}) rotate(-90)" text-anchor="middle" font-size="11" fill="#4a4741">Critical mass (kg U-235)</text>`;
  if (sub) s += sub(X, Y);
  return s;
}

let svg = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, Arial, sans-serif">`;
svg += `<rect width="${W}" height="${H}" fill="#fff"/>`;

svg += panel(10, fine, 34, 92, 3, 200, [40, 50, 60, 70, 80, 90], [3, 10, 30, 100],
  "(a) Near the critical threshold",
  (X, Y) => {
    let s = "";
    // subcritical band
    s += `<rect x="${X(34)}" y="${P.t + 26}" width="${X(35.6) - X(34)}" height="${H - P.t - P.b - 26}" fill="#fbeeee"/>`;
    s += `<text x="${X(34.6)}" y="${P.t + 46}" font-size="9" fill="#a52a2a" transform="rotate(-90 ${X(34.6)} ${P.t + 46})" text-anchor="end">subcritical</text>`;
    // minimum marker
    s += `<circle cx="${X(48)}" cy="${Y(4.09)}" r="5" fill="none" stroke="#b4530a" stroke-width="1.8"/>`;
    s += `<line x1="${X(48)}" y1="${Y(4.09) - 8}" x2="${X(55)}" y2="${Y(4.09) - 52}" stroke="#b4530a" stroke-width="1"/>`;
    s += `<text x="${X(55) + 3}" y="${Y(4.09) - 54}" font-size="10" font-weight="600" fill="#b4530a">minimum 4.09 kg</text>`;
    s += `<text x="${X(55) + 3}" y="${Y(4.09) - 42}" font-size="10" fill="#b4530a">at a 48 cm cube</text>`;
    return s;
  });

svg += panel(10 + panelW + 40, full, 0, 520, 3, 2000, [0, 100, 200, 300, 400, 500], [3, 10, 100, 1000],
  "(b) Full design range",
  (X, Y) => {
    let s = "";
    s += `<circle cx="${X(300)}" cy="${Y(330.65)}" r="5" fill="none" stroke="#b4530a" stroke-width="1.8"/>`;
    s += `<text x="${X(300) - 8}" y="${Y(330.65) - 12}" font-size="10" font-weight="600" fill="#b4530a" text-anchor="end">Worked Example 1</text>`;
    s += `<text x="${X(300) - 8}" y="${Y(330.65) - 1}" font-size="10" fill="#b4530a" text-anchor="end">331 kg, 27 m&#179;</text>`;
    return s;
  });

svg += `</svg>`;
writeFileSync(new URL("./fig6-critmass.html", import.meta.url),
  `<style>body{margin:0;background:#fff}</style><div style="width:900px">${svg}</div>`);
console.log("wrote fig6-critmass.html");
