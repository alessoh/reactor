# Amazon KDP listing — Design Your Own Nuclear Reactor

Everything below is ready to paste into the KDP setup screens. Limits noted per field.

---

## 1. Title and subtitle

KDP indexes the title and subtitle heavily, so the subtitle is the single highest-value
piece of search real estate you control. Recommended:

**Title** (field limit 200 characters)

```
Design Your Own Nuclear Reactor
```

**Subtitle** (field limit 200 characters)

```
A College-Level Manual of Reactor Physics, Thermal-Hydraulics, and Core Design — with a Free Browser Simulator
```

*Why this title.* It is the name of the program, it is concrete and memorable, and it reads
as an invitation rather than a category label. The subtitle then carries the three phrases a
serious buyer actually searches — reactor physics, thermal-hydraulics, core design — plus the
differentiator no competing textbook has: working software.

*Alternate subtitle, if you want the audience named explicitly:*

```
Reactor Physics, Thermal-Hydraulics, and Core Design for Engineering Students — with a Free Browser Simulator
```

**Series field.** If this joins your AI HIVE list, enter the series name in the Series field
rather than in the title. Titles padded with series names rank worse.

---

## 2. Book description

Field limit is 4,000 characters **including HTML tags**. The version below is 3,377, which
leaves room to add an endorsement line later without a rewrite.

KDP supports only these tags: `<br>` `<p>` `<b>` `<i>` `<em>` `<u>` `<h4>` `<h5>` `<h6>`
`<ol>` `<ul>` `<li>`. It does **not** support `<h1>`–`<h3>`, `<strong>`, `<div>`, or inline
CSS. Paste the block below into the description box using the `<>` (HTML) view.

```html
<h4>Most people never get to design a nuclear reactor. This book hands you the controls.</h4>

<p>In 1993, engineer H. Peter Alesso wrote a reactor design program for Windows 3.1. It has now been rebuilt to run in any web browser, free, with nothing to install and no account required. <b>This is the manual that goes with it.</b></p>

<p>Choose a fissile fuel. Choose a moderator, a coolant, and a core shape. Set five operating parameters. The program solves for the moderator-to-fuel ratio that makes your reactor exactly critical, then reports critical mass, thermal power, power density, heat flux, fuel centreline temperature, coolant velocity, neutron flux, and cycle efficiency, recomputed the instant you move a slider.</p>

<p>Because a case costs nothing to run, you can sweep a variable across its entire range and watch what happens. That is how engineering intuition is actually built.</p>

<h5>WHAT YOU WILL LEARN</h5>
<ul>
<li><b>Part I, the physics.</b> Fission and the neutron life cycle. Prompt and delayed neutrons, and why reactor control depends entirely on the delayed ones. Moderation, the Fermi age, and the diffusion length. Geometric buckling, critical size, and why the sphere always wins.</li>
<li><b>Part II, the engineering.</b> Porosity and the coolant unit cell. Power density, heat flux, and departure from nucleate boiling. Fuel centreline temperature and the melting limit. Pressure drop, pumping power, and the Mach limit on gas coolants. Closed-loop and open-loop power conversion.</li>
<li><b>Part III, the program.</b> A step-by-step guide to every control, every output page, and every way a design can fail.</li>
</ul>

<h5>FOUR WORKED EXAMPLES, START TO FINISH</h5>
<ul>
<li>A <b>pressurised water reactor</b>, beginning from a design that looks perfectly healthy and is in fact thermally impossible, then repairing it using nothing but numbers the program reports.</li>
<li>A <b>heavy-water reactor</b>, and why D2O buys natural-uranium operation at the price of size.</li>
<li>A <b>high-temperature gas reactor</b>, where graphite delivers the best neutron economy in the book and helium presents a punishing circulator bill.</li>
<li>An <b>open-loop propulsion core</b> that goes critical on 2.7 kilograms of fuel and then melts itself. Fixing it is the exercise.</li>
</ul>

<h5>BUILT FOR SELF-STUDY AND FOR THE CLASSROOM</h5>
<ul>
<li>Nine figures, seventeen data tables, and a complete equation summary</li>
<li>A 48-term glossary and eighteen references to the standard literature</li>
<li>Six appendices: fuel, moderator and coolant data; stated assumptions and limitations; and two operating plants to benchmark your designs against</li>
<li>Five suggested exercises to run yourself</li>
</ul>

<p>Every number printed in this book was produced by the program itself, not written by hand. Its approximations, the thermal group and homogeneous core treatments, the Fermi age method, and the absence of a reflector, are stated plainly in an appendix, so you always know exactly what a result is worth.</p>

<p><b>For undergraduate engineering and physics students, for instructors who want a hands-on laboratory that needs no laboratory, and for any technically literate reader who wants to understand what genuinely constrains a nuclear reactor design.</b></p>

<p><i>The companion program is free, and always will be.</i></p>
```

---

## 3. Keywords

Seven slots, 50 characters each. Rules Amazon enforces: no other authors' names, no
trademarks, no subjective claims ("best", "bestselling"), no time-sensitive claims ("new"),
and no words already carried by your title or subtitle — those are indexed separately, so
repeating them wastes a slot.

| # | Keyword string | Chars |
| --- | --- | --- |
| 1 | `nuclear engineering textbook for students` | 41 |
| 2 | `criticality critical mass neutron flux` | 38 |
| 3 | `pressurized water reactor PWR gas cooled` | 40 |
| 4 | `nuclear power plant engineering guide` | 37 |
| 5 | `fission moderator coolant buckling core` | 39 |
| 6 | `how nuclear power works energy explained` | 40 |
| 7 | `heavy water graphite helium sodium fuel` | 39 |

Each string is a phrase bundle, not a single term. Amazon matches on any combination of the
words in a slot plus the words in your title, so `nuclear engineering textbook for students`
also reaches "engineering textbook", "textbook for students", and "nuclear engineering
students" without spending extra slots.

Five slots do repeat one word from the title — "nuclear", "reactor", or "core". That is
deliberate and it is the one place worth bending the no-repeats rule: a slot has to read as a
phrase a real person would type, and `engineering textbook for students` on its own would
match cookbooks and civil-engineering primers. One anchor word costs a few characters and
buys precision. Never spend a whole slot on a bare title word.

Deliberately avoided: **CANDU** and **NERVA** are trademarks or programme names and can get a
listing suppressed. **SMR** and **small modular reactor** were left out because the book does
not cover them, and irrelevant keywords hurt conversion and can trigger review.

---

## 4. Categories

KDP allows three. Choose these in the browse-category picker:

1. **Technology & Engineering › Power Resources › Nuclear**
2. **Science › Physics › Nuclear Physics**
3. **Science › Energy**

These are small, winnable categories. Nuclear Power Resources in particular has a shallow
bestseller list, which is the fastest route to an orange banner.

If the picker offers it, **Education › Higher Education** is a reasonable substitute for the
third slot when you want to reach instructors rather than general-science readers.

**Age and grade range:** leave blank. Setting it flags the book as children's or young-adult
and removes it from the adult nonfiction lists.

---

## 5. Back cover copy (print edition)

Roughly 190 words, sized for a 6×9 back cover with room for the barcode and author photo.

> **Most people never get to design a nuclear reactor.**
>
> Choose a fissile fuel. Choose a moderator, a coolant, and a core shape. Set five
> parameters. The companion program — free, in your browser, nothing to install — solves for
> the moderator-to-fuel ratio that makes your reactor exactly critical, then reports critical
> mass, thermal power, heat flux, fuel temperature, neutron flux, and cycle efficiency. Move
> a slider and every number moves with it.
>
> This manual is the physics and engineering behind those numbers. It covers the neutron
> life cycle, the Fermi age, geometric buckling and critical size; then porosity, heat flux,
> departure from nucleate boiling, pumping power, and the two ways to turn reactor heat into
> electricity.
>
> Four worked examples take you from a first attempt to a defensible design — including one
> that looks perfectly healthy and would vaporise its own core, and what the program tells
> you to do about it.
>
> With nine figures, seventeen data tables, a 48-term glossary, and six appendices of
> reference data.
>
> **H. Peter Alesso** wrote the original program in 1993. He is the author of *Connections*,
> *Thinking on the Web*, and *Developing Semantic Web Services*.

---

## 6. Promotional copy

**One line, for a banner or a link preview**

> Design a working nuclear reactor in your browser — and understand every number it gives you.

**Social post, under 280 characters**

> In 1993 I wrote a nuclear reactor design program for Windows 3.1. It now runs in any
> browser, free. The manual is out: reactor physics, thermal-hydraulics, four worked
> examples, and one design that looks perfect right up until it melts.
> reactor-seven.vercel.app

**Short blurb, ~90 words, for a newsletter or catalogue**

> Pick a fuel, a moderator, a coolant, and a core shape, and a free browser program solves
> your reactor for criticality in real time — then reports the power, heat flux, fuel
> temperature, and efficiency that follow. This manual is the physics and engineering behind
> it: the neutron life cycle, buckling and critical size, heat removal, and power conversion,
> with four worked examples that show how a promising design fails and how the numbers tell
> you to fix it.

**A+ Content modules worth building** (free, and it measurably lifts conversion)

1. *Standard Image Header with Text* — a screenshot of the workspace, headline "The program
   is free. This is the manual."
2. *Standard Three Image & Text* — the neutron life-cycle figure, the buckling figure, and
   the critical-mass curve, each with one sentence.
3. *Standard Single Image & Sidebar* — the four worked examples as a bulleted list beside the
   plant schematic.
4. *Standard Text* — the assumptions-and-limitations list. Stating limits openly reads as
   competence to this audience and pre-empts the one-star review that says "it's only
   approximate."

---

## 7. Remaining setup fields

| Field | Value |
| --- | --- |
| Primary audience | Adult (leave age/grade blank) |
| Publishing rights | I own the copyright |
| Language | English |
| Publisher | AI HIVE Publications |
| Contributor | H. Peter Alesso — Author |
| Trim size | 8.5 × 11 in for the full-width tables and figures; 6 × 9 only if you re-flow them |
| Interior | Black & white on white paper, or premium colour if you keep the teal figures |
| Bleed | No bleed |
| Cover finish | Matte |
| DRM | Recommend disabling — this audience shares and annotates |
| KDP Select | Worth enrolling for the first 90 days for Kindle Unlimited page reads |

**A note on the free program.** Amazon allows you to reference a companion website, and the
description above does so without a live link, which is the safe form. Put the actual URL in
the front matter of the book itself and in your Author Central bio, where links are permitted.
