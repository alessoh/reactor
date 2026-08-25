import { createRequire } from "node:module";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const require = createRequire(import.meta.url);
const D = require("docx");
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, PageBreak,
  Table, TableRow, TableCell, WidthType, ShadingType, BorderStyle, ImageRun,
  TableOfContents, Header, Footer, PageNumber, LevelFormat, ExternalHyperlink,
  convertInchesToTwip, VerticalAlign,
} = D;

const dir = path.dirname(fileURLToPath(import.meta.url));
const fig = (f) => readFileSync(path.join(dir, "figures", f));

const { front, part1 } = await import("./content1.mjs");
const { part2 } = await import("./content2.mjs");
const { examples, glossary, references } = await import("./content3.mjs");
const { appendices } = await import("./content4.mjs");

/* ------------------------------------------------------------------ theme */

const SERIF = "Georgia";
const SANS = "Arial";
const INK = "1B1A17";
const INK2 = "3A3833";
const MUTED = "6E6960";
const ACCENT = "0F5F58";
const RULE = "C9C4B7";
const BAND = "F1EFE9";

const CONTENT_W = 9360; // Letter, 1 inch margins, in DXA

/* -------------------------------------------------------------- utilities */

const words = (s) => String(s).trim().split(/\s+/).filter(Boolean).length;
let WORDCOUNT = 0;
const count = (s) => { WORDCOUNT += words(s); return s; };

function body(text, opts = {}) {
  count(text);
  return new Paragraph({
    spacing: { after: 140, line: 276 },
    alignment: opts.center ? AlignmentType.CENTER : AlignmentType.BOTH,
    indent: opts.indent ? { left: 360 } : undefined,
    children: [new TextRun({ text, font: SERIF, size: 21, color: INK2 })],
  });
}

function h1(text) {
  count(text);
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 420, after: 190 },
    pageBreakBefore: true,
    children: [new TextRun({ text, font: SANS, size: 30, bold: true, color: ACCENT })],
  });
}

function h2(text) {
  count(text);
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 300, after: 130 },
    children: [new TextRun({ text, font: SANS, size: 23, bold: true, color: INK })],
  });
}

function partPage(title, sub) {
  count(title); count(sub);
  return [
    new Paragraph({ children: [new PageBreak()] }),
    new Paragraph({ spacing: { before: 2600, after: 0 }, alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: title.toUpperCase(), font: SANS, size: 26, bold: true,
        color: MUTED, characterSpacing: 90 })] }),
    new Paragraph({ spacing: { before: 200, after: 0 }, alignment: AlignmentType.CENTER,
      border: { top: { style: BorderStyle.SINGLE, size: 6, color: RULE, space: 14 } },
      children: [new TextRun({ text: sub, font: SERIF, size: 36, color: INK })] }),
  ];
}

function bulletList(items) {
  return items.map((t) => {
    count(t);
    return new Paragraph({
      numbering: { reference: "bullets", level: 0 },
      spacing: { after: 90, line: 276 },
      children: [new TextRun({ text: t, font: SERIF, size: 21, color: INK2 })],
    });
  });
}

let LISTN = 0;
function numberList(items, ref = "numbers") {
  LISTN += 1;
  const instance = LISTN;
  return items.map((t) => {
    count(t);
    return new Paragraph({
      numbering: { reference: ref, level: 0, instance },
      spacing: { after: 100, line: 276 },
      children: [new TextRun({ text: t, font: SERIF, size: 21, color: INK2 })],
    });
  });
}

function stepList(items) {
  return items.map((t, i) => {
    count(t);
    return new Paragraph({
      spacing: { after: 90, line: 276 },
      indent: { left: 560, hanging: 340 },
      children: [
        new TextRun({ text: `${i + 1}.  `, font: SANS, size: 20, bold: true, color: ACCENT }),
        new TextRun({ text: t, font: SERIF, size: 21, color: INK2 }),
      ],
    });
  });
}

function equation(text) {
  count(text);
  return new Paragraph({
    spacing: { before: 170, after: 190 },
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text, font: "Cambria Math", size: 23, color: INK })],
  });
}

function noteBlock(text) {
  count(text);
  return new Paragraph({
    spacing: { before: 130, after: 200, line: 258 },
    indent: { left: 220, right: 220 },
    shading: { type: ShadingType.CLEAR, fill: BAND, color: "auto" },
    border: {
      top: { style: BorderStyle.SINGLE, size: 2, color: BAND, space: 10 },
      bottom: { style: BorderStyle.SINGLE, size: 2, color: BAND, space: 10 },
      left: { style: BorderStyle.SINGLE, size: 12, color: RULE, space: 10 },
      right: { style: BorderStyle.SINGLE, size: 2, color: BAND, space: 10 },
    },
    children: [new TextRun({ text, font: SERIF, size: 19.5, color: INK2, italics: true })],
  });
}

function callout(title, text) {
  count(title); count(text);
  return [
    new Paragraph({
      spacing: { before: 200, after: 40 },
      indent: { left: 220, right: 220 },
      shading: { type: ShadingType.CLEAR, fill: BAND, color: "auto" },
      border: { left: { style: BorderStyle.SINGLE, size: 12, color: ACCENT, space: 10 },
                top: { style: BorderStyle.SINGLE, size: 2, color: BAND, space: 8 } },
      children: [new TextRun({ text: title, font: SANS, size: 19, bold: true, color: ACCENT })],
    }),
    new Paragraph({
      spacing: { after: 220, line: 258 },
      indent: { left: 220, right: 220 },
      shading: { type: ShadingType.CLEAR, fill: BAND, color: "auto" },
      border: { left: { style: BorderStyle.SINGLE, size: 12, color: ACCENT, space: 10 },
                bottom: { style: BorderStyle.SINGLE, size: 2, color: BAND, space: 8 } },
      children: [new TextRun({ text, font: SERIF, size: 19.5, color: INK2 })],
    }),
  ];
}

function urlPara(url) {
  return new Paragraph({
    spacing: { before: 120, after: 220 },
    alignment: AlignmentType.CENTER,
    children: [
      new ExternalHyperlink({
        link: url,
        children: [new TextRun({ text: url, font: SANS, size: 23, bold: true, color: ACCENT, underline: {} })],
      }),
    ],
  });
}

let FIGN = 0, TABN = 0;

function caption(kind, n, text) {
  count(text);
  return new Paragraph({
    spacing: { before: 90, after: 260 },
    alignment: AlignmentType.LEFT,
    children: [
      new TextRun({ text: `${kind} ${n}.  `, font: SANS, size: 17.5, bold: true, color: ACCENT }),
      new TextRun({ text, font: SANS, size: 17.5, color: MUTED }),
    ],
  });
}

function figure(src, w, h, cap) {
  FIGN += 1;
  return [
    new Paragraph({
      spacing: { before: 220, after: 0 },
      alignment: AlignmentType.CENTER,
      children: [new ImageRun({ data: fig(src), type: "png", transformation: { width: w, height: h } })],
    }),
    caption("Figure", FIGN, cap),
  ];
}

function cell(text, { headerRow = false, first = false, width, keep = false }) {
  count(text);
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    margins: { top: 70, bottom: 70, left: 110, right: 110 },
    shading: headerRow ? { type: ShadingType.CLEAR, fill: BAND, color: "auto" } : undefined,
    verticalAlign: VerticalAlign.CENTER,
    borders: {
      top: { style: BorderStyle.SINGLE, size: headerRow ? 6 : 2, color: headerRow ? RULE : "E4E1DA" },
      bottom: { style: BorderStyle.SINGLE, size: headerRow ? 6 : 2, color: headerRow ? RULE : "E4E1DA" },
      left: { style: BorderStyle.NONE, size: 0, color: "auto" },
      right: { style: BorderStyle.NONE, size: 0, color: "auto" },
    },
    children: [new Paragraph({
      alignment: AlignmentType.LEFT,
      keepNext: keep,
      spacing: { after: 0, line: 240 },
      children: [new TextRun({
        text, font: SANS, size: headerRow ? 17 : 18,
        bold: headerRow, color: headerRow ? INK : INK2,
      })],
    })],
  });
}

function dataTable(head, rows, widths, cap) {
  TABN += 1;
  const total = widths.reduce((a, b) => a + b, 0);
  const scale = CONTENT_W / total;
  const w = widths.map((x) => Math.round(x * scale));
  w[w.length - 1] = CONTENT_W - w.slice(0, -1).reduce((a, b) => a + b, 0);

  // Keep short tables whole: keepNext on every row but the last makes Word
  // move the entire table to the next page rather than orphan a row.
  const glue = rows.length <= 13;
  const t = new Table({
    columnWidths: w,
    width: { size: CONTENT_W, type: WidthType.DXA },
    rows: [
      new TableRow({
        tableHeader: true,
        cantSplit: true,
        children: head.map((c, i) => cell(c, { headerRow: true, width: w[i], keep: glue })),
      }),
      ...rows.map((r, ri) => new TableRow({
        cantSplit: true,
        children: r.map((c, i) => cell(c, {
          first: i === 0, width: w[i], keep: glue && ri < rows.length - 1,
        })),
      })),
    ],
  });
  const out = [new Paragraph({ spacing: { before: 200, after: 60 }, children: [] }), t];
  if (cap) out.push(caption("Table", TABN, cap));
  else out.push(new Paragraph({ spacing: { after: 240 }, children: [] }));
  return out;
}

function glossaryBlock(entries) {
  return entries.flatMap(([term, def]) => {
    count(term); count(def);
    return new Paragraph({
      spacing: { after: 110, line: 264 },
      indent: { left: 340, hanging: 340 },
      children: [
        new TextRun({ text: term + "  ", font: SANS, size: 19, bold: true, color: INK }),
        new TextRun({ text: def, font: SERIF, size: 20, color: INK2 }),
      ],
    });
  });
}

function refList(items) {
  return items.map((t) => {
    count(t);
    return new Paragraph({
      spacing: { after: 110, line: 264 },
      indent: { left: 340, hanging: 340 },
      children: [new TextRun({ text: t, font: SERIF, size: 20, color: INK2 })],
    });
  });
}

function eqList(pairs) {
  return pairs.flatMap(([label, eq]) => {
    count(label);
    return new Paragraph({
      spacing: { after: 110, line: 264 },
      indent: { left: 340, hanging: 340 },
      children: [
        new TextRun({ text: label + "   ", font: SANS, size: 18, color: MUTED }),
        new TextRun({ text: eq, font: "Cambria Math", size: 21, color: INK }),
      ],
    });
  });
}

function linkList(items) {
  return items.flatMap(([label, url, desc]) => {
    count(label); count(desc);
    return [
      new Paragraph({
        spacing: { before: 130, after: 20 },
        children: [new TextRun({ text: label, font: SANS, size: 19, bold: true, color: INK })],
      }),
      new Paragraph({
        spacing: { after: 20 },
        indent: { left: 240 },
        children: [new ExternalHyperlink({
          link: url,
          children: [new TextRun({ text: url, font: SANS, size: 18, color: ACCENT, underline: {} })],
        })],
      }),
      new Paragraph({
        spacing: { after: 90, line: 258 },
        indent: { left: 240 },
        children: [new TextRun({ text: desc, font: SERIF, size: 19, color: INK2 })],
      }),
    ];
  });
}

/* ------------------------------------------------------------- the driver */

function render(blocks) {
  const out = [];
  for (const b of blocks) {
    switch (b.t) {
      case "h1": out.push(h1(b.x)); break;
      case "h2": out.push(h2(b.x)); break;
      case "p": out.push(body(b.x)); break;
      case "part": out.push(...partPage(b.x, b.sub)); break;
      case "bullets": out.push(...bulletList(b.x)); break;
      case "numbers": out.push(...numberList(b.x)); break;
      case "steps": out.push(...stepList(b.x)); break;
      case "eq": out.push(equation(b.x)); break;
      case "note": out.push(noteBlock(b.x)); break;
      case "callout": out.push(...callout(b.title, b.x)); break;
      case "url": out.push(urlPara(b.x)); break;
      case "fig": out.push(...figure(b.src, b.w, b.h, b.cap)); break;
      case "table": out.push(...dataTable(b.head, b.rows, b.widths, b.cap)); break;
      case "gloss": out.push(...glossaryBlock(b.x)); break;
      case "refs": out.push(...refList(b.x)); break;
      case "eqlist": out.push(...eqList(b.x)); break;
      case "linklist": out.push(...linkList(b.x)); break;
      case "pagebreak": out.push(new Paragraph({ children: [new PageBreak()] })); break;
      default: throw new Error("unknown block: " + b.t);
    }
  }
  return out;
}

/* ---------------------------------------------------------- title pages */

const titlePage = [
  new Paragraph({ spacing: { before: 2400, after: 0 }, alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "DESIGN YOUR OWN", font: SANS, size: 26, bold: true,
      color: MUTED, characterSpacing: 120 })] }),
  new Paragraph({ spacing: { before: 260, after: 0 }, alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "Nuclear Reactor", font: SERIF, size: 62, color: INK })] }),
  new Paragraph({ spacing: { before: 120, after: 0 }, alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "Design", font: SERIF, size: 62, color: INK })] }),
  new Paragraph({ spacing: { before: 320, after: 0 }, alignment: AlignmentType.CENTER,
    border: { top: { style: BorderStyle.SINGLE, size: 6, color: RULE, space: 16 } },
    children: [new TextRun({ text: "A College-Level Manual and Program Guide",
      font: SERIF, size: 26, color: INK2, italics: true })] }),
  new Paragraph({ spacing: { before: 900, after: 0 }, alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "H. PETER ALESSO", font: SANS, size: 24, bold: true,
      color: INK, characterSpacing: 60 })] }),
  new Paragraph({ spacing: { before: 1400, after: 0 }, alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "AI HIVE PUBLICATIONS", font: SANS, size: 17,
      color: MUTED, characterSpacing: 80 })] }),
  new Paragraph({ spacing: { before: 60, after: 0 }, alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "Pleasanton, California", font: SANS, size: 17, color: MUTED })] }),
  new Paragraph({ children: [new PageBreak()] }),

  // copyright page
  new Paragraph({ spacing: { before: 3200, after: 130 }, alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "Nuclear Reactor Design", font: SERIF, size: 22, color: INK })] }),
  new Paragraph({ spacing: { after: 130 }, alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "A College-Level Manual and Program Guide", font: SERIF, size: 19, color: MUTED, italics: true })] }),
  new Paragraph({ spacing: { after: 130 }, alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "H. Peter Alesso © 2026", font: SERIF, size: 19, color: INK2 })] }),
  new Paragraph({ spacing: { after: 130 }, alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "hpeteralesso.com", font: SANS, size: 18, color: MUTED })] }),
  new Paragraph({ spacing: { before: 260, after: 130 }, alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "AI HIVE Publications, Pleasanton, CA 94566", font: SANS, size: 18, color: MUTED })] }),
  new Paragraph({ spacing: { after: 400 }, alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "Edition 2.00", font: SANS, size: 18, color: MUTED })] }),
  new Paragraph({ spacing: { after: 120 }, alignment: AlignmentType.CENTER,
    children: [new TextRun({
      text: "The program described in this manual performs a preliminary conceptual design using approximate methods. Its results are estimates intended for teaching. They are not suitable for engineering design, licensing, or safety analysis.",
      font: SERIF, size: 18, color: MUTED, italics: true })] }),
  new Paragraph({ children: [new PageBreak()] }),

  // TOC
  new Paragraph({ spacing: { before: 200, after: 240 },
    children: [new TextRun({ text: "Contents", font: SANS, size: 30, bold: true, color: ACCENT })] }),
  new TableOfContents("Contents", { hyperlink: true, headingStyleRange: "1-2" }),
  new Paragraph({ children: [new PageBreak()] }),
];

/* ------------------------------------------------------------ assemble */

const children = [
  ...titlePage,
  ...render(front),
  ...render(part1),
  ...render(part2),
  ...render(examples),
  ...render(glossary),
  ...render(references),
  ...render(appendices),
];

const doc = new Document({
  creator: "H. Peter Alesso",
  title: "Nuclear Reactor Design",
  description: "A college-level manual and program guide",
  styles: {
    default: {
      document: { run: { font: SERIF, size: 21, color: INK2 } },
      heading1: { run: { font: SANS, size: 30, bold: true, color: ACCENT } },
      heading2: { run: { font: SANS, size: 23, bold: true, color: INK } },
    },
  },
  numbering: {
    config: [
      { reference: "bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•",
        alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 560, hanging: 280 } } } }] },
      { reference: "numbers", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.",
        alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 560, hanging: 340 } } } }] },
    ],
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440, header: 720, footer: 720 },
      },
      titlePage: true,
    },
    headers: {
      default: new Header({ children: [new Paragraph({
        alignment: AlignmentType.RIGHT,
        border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: RULE, space: 6 } },
        children: [new TextRun({ text: "Nuclear Reactor Design",
          font: SANS, size: 16, color: MUTED })] })] }),
      first: new Header({ children: [new Paragraph({ children: [] })] }),
    },
    footers: {
      default: new Footer({ children: [new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ children: [PageNumber.CURRENT], font: SANS, size: 17, color: MUTED })] })] }),
      first: new Footer({ children: [new Paragraph({ children: [] })] }),
    },
    children,
  }],
});

const buf = await Packer.toBuffer(doc);
const outPath = path.join(dir, "Nuclear-Reactor-Design-Manual.docx");
writeFileSync(outPath, buf);
console.log("wrote", outPath);
console.log("body word count (approx):", WORDCOUNT);
console.log("figures:", FIGN, " tables:", TABN);
