# Nuclear Reactor Design for Young Inventors

**Try it:** https://reactor-seven.vercel.app/
**Code:** https://github.com/alessoh/reactor

---

## Inspiration

In 1993 I wrote a nuclear reactor design program in Microsoft Visual Basic 3 for Windows 3.1.
It shipped on floppy disks with a printed user's manual and a tutorial. Students could pick a
fuel, a moderator, and a coolant, choose a core shape, and watch the program solve their
reactor for criticality.

Then Windows 3.1 died, and the program died with it. The 16-bit executable will not run on any
machine sold this century. What survived was a folder: six `.FRM` form files, a 752-line
`MODULE1.BAS` physics module, 41 hand-drawn bitmaps, and a compressed install set whose
`RX.EX_` I could no longer decompress or execute. Thirty-three years of bit rot, and the
physics inside it was still perfectly good.

Reactor design is one of the few engineering disciplines where the interesting part is not any
single calculation — it is the *trade surface*. Enlarge the core and you fix your heat flux
but pay in fuel inventory. Pick graphite and you get superb neutron economy but a core the
size of a house. You cannot learn that from a textbook derivation. You learn it by running
fifty cases in an afternoon and watching the numbers fight each other.

I wanted a fourteen-year-old with a Chromebook to be able to do that. No install, no license,
no account.

## What it does

You choose a fissile fuel from six isotopes, a moderator from five, a coolant from four, and
one of three core geometries. You set five operating parameters — maximum and minimum coolant
temperature, tube diameter, porosity, and coolant flow rate.

The program then solves for the **moderator-to-fuel atom ratio that makes your reactor exactly
critical**, and from that ratio derives everything else: critical mass, geometric buckling,
fuel number density, thermal power, power density, average heat flux, fuel centreline
temperature, specific power, thermal neutron flux, annual burnup, coolant velocity, Reynolds
number, core pressure drop, pumping power, secondary flow rate, turbine output, and cycle
efficiency.

There is no calculate button. Every number recomputes the instant you move a slider, and a
live plant schematic redraws itself for your core shape and for open versus closed loop power
conversion. You can save cases and compare them side by side, which is how a parametric study
actually gets done.

If your design cannot go critical, a banner says so immediately and names the three variables
that will fix it.

Alongside it is a 53-page manual — reactor physics, thermal-hydraulics, four worked examples,
a 48-term glossary, and six appendices of data.

## How we built it

**Software archaeology first.** The compiled binary was unusable, so the source was the only
route. `MODULE1.BAS` held the physics. `RXMAIN.TXT` — 1,204 lines — held the menus, the
material data tables, and the seven output screens. VB3 form files interleave layout
properties with event code in a custom text format, so reading them meant separating the two by
hand.

**Then a literal port.** `web/src/lib/materials.ts` and `web/src/lib/reactor.ts` are a direct
translation of `MODULE1.BAS` into TypeScript — 434 lines against the original 752. Every cross
section, every material property table, every temperature-keyed coolant step table, and every
correlation carried over unchanged. The Blasius friction factor, the Fermi age treatment, the
buckling formulas for all three geometries: all period-correct.

**Then a modern shell around it.** Next.js and React for the app, Tailwind for styling, and
hand-written SVG for the plant schematic, because the original's charm was its diagram and a
charting library would have flattened it. The whole thing is a static site — the solver runs
in the browser, no backend, no data leaves the machine.

**Then the manual, generated rather than written.** Every number quoted in the book was
produced by running the actual solver, not typed from memory. `manual/cases.mts` drives the
solver across every worked example and every parametric sweep and prints the results;
`manual/build.mjs` assembles the `.docx` from those numbers plus nine generated figures. If the
physics changes, the book can be rebuilt and stays correct.

**Built with Claude Code (Opus 5)**, working from the 1993 sources and the original printed
manuals. The collaboration model that worked was: I supplied the domain judgment about what the
program was *for*, and the AI did the archaeology, the port, the verification, and the
document generation — with every physics claim checked back against the original source rather
than generated from general knowledge.

## Challenges we ran into

**The original had four bugs, and finding them was the hard part.** Leftover debugging
statements in `Calculation_Phase` were overriding computed values: primary pressure pinned to
45 atm, pump power pinned to 1 MWe, and turbine output replaced by a flat 36 per cent
conversion regardless of the steam cycle. Worse, a misplaced `End If` let the helium Mach-0.3
test fall through and corrupt the coolant velocity for *every* coolant. These are the kind of
lines a developer adds at 2 a.m. to isolate a problem and then forgets to remove. Spotting them
required reading the code as archaeology — asking not "what does this do" but "why would
someone have written this."

**Deciding what to fix was harder than fixing it.** The four debugging statements were clearly
accidental, so I corrected them and marked each `FIDELITY` in the source with the original line
quoted. But the program also holds the neutron reproduction factor η at 2.06 for *every* fuel,
and fixes the secondary steam conditions so cycle efficiency never responds to primary
temperature. Those are wrong physics — and they are deliberate 1993 simplifications, not
mistakes. Changing them would have made this a different program. I left them and documented
them in an appendix instead. Knowing which errors to preserve turned out to be the real
engineering judgment in the project.

**The demo case is thermally impossible, and I nearly missed it.** The default configuration
produces a beautifully plausible 2633 MWth and 902 MWe at 34.2 per cent efficiency — within a
few per cent of Oconee 1, a real plant. But it does it in a one-cubic-metre core, which means a
power density of 3930 MW/m³ and a heat flux of 798 W/cm². That is 125 times and 15 times
operating practice respectively. The criticality page looks perfect. Only the thermal page
gives it away.

**Unit labels that were wrong for 33 years.** Secondary state points 5, 6, and 7 are labelled
kelvin in the original. A 41 K condenser is colder than liquid nitrogen and would freeze the
working fluid solid. The values are consistent with Celsius, and the enthalpies alongside them
are self-consistent and produce the correct efficiency. The numbers were right; only the unit
label was wrong.

**Typography, unexpectedly.** Unicode subscript characters silently fell back to look-alike
glyphs in the figures, so `N_channels` rendered as `Nmhkmhlk`. Every subscript had to be
rebuilt with SVG `tspan` elements.

## Accomplishments that we're proud of

**It runs.** A 33-year-old program, dead on arrival on modern hardware, is live on the open web
and needs nothing but a browser tab.

**Every number in the book is real.** Not one figure in the 53-page manual was written by hand.
The solver produced all of them, and a script regenerates the document from the solver's output.

**We found genuine bugs in the original** — four of them, each documented with the line it
replaced, so anyone can audit the change.

**We found something I missed in 1993.** Critical mass versus core size is
*non-monotonic*. Below about a 35 cm cube, no composition achieves criticality at all. Above
that, critical mass falls steeply to a **minimum of 4.09 kg at a 48 cm cube**, then climbs
again — 331 kg at 300 cm, 1509 kg at 500 cm. Two effects run against each other: required fuel
concentration falls as leakage relaxes, while volume grows as the cube of the dimension. Below
the minimum, concentration wins; above it, volume wins. Nobody plotted that in 1993 because
each point took an evening. Now it takes a script.

**The Am-242 result is a genuinely good teaching moment.** In the same 200 cm cube, U-235 needs
100.8 kg and americium-242 needs 9.2 kg — an eleventh, tracking the absorption cross section
almost exactly. It is also completely impractical, and the manual says so. Showing a student
*why* an obviously superior number is useless is worth more than hiding it.

## What we learned

**Old code is a primary source.** The comments in `MODULE1.BAS` were the map. Variable names
like `fermiage` and `crossabs` carried decades of domain convention, and preserving them made
the port auditable in a way that renaming everything to modern style would have destroyed.

**Fidelity and correctness are different goals, and you must pick per line.** A faithful port of
a buggy program reproduces the bugs. A "fixed" port is no longer the program. The resolution
was to fix only what was clearly accidental, document everything else, and make the reasoning
visible in the source.

**A tool's most valuable teaching moment can be its own failure.** The default case being
thermally impossible looked like a flaw. It became Worked Example 1 in the manual — read the
warning signs, diagnose, enlarge the core to 27 m³, and watch heat flux fall from 798 to
29.6 W/cm² while critical mass rises from 14.8 kg to 331 kg. That trade *is* reactor design,
and no amount of exposition teaches it as well as watching it happen.

**Stating your limits builds more trust than hiding them.** Appendix B lists all twelve
approximations plainly — thermal group, homogeneous core, Fermi age, bare core, fixed η.
Readers who know the field respect a tool that knows what it cannot do.

## What's next for Nuclear Reactor Design for Young Inventors

**Add a reflector.** The single largest gap. Every core is currently bare, so every critical
mass is conservative by roughly a third. A one-group reflector saving would make the numbers
markedly more realistic.

**Make cycle efficiency respond to primary temperature.** Right now the secondary state points
are fixed, so a 1000 K helium outlet earns the same 34.2 per cent as a 530 K water outlet. That
hides the entire argument for high-temperature reactors — the one thing an HTGR is *for*.

**Correct η per fuel.** Holding it at the U-235 value makes cross-fuel comparisons directional
rather than quantitative.

**Two-group and heterogeneous lattices**, so resonance escape and thermal utilisation respond
to actual pin geometry instead of a homogeneous smear.

**Burnup over time and xenon transients** — the reason a reactor cannot simply be switched off
and on.

**Shareable design URLs**, so a student can send a teacher a link that opens their exact core.
Currently designs save to JSON files, which is one step too many for a classroom.

**A guided problem-set mode** built from the manual's five suggested exercises, with the
program checking whether the student's core actually meets the stated constraints.

There is also an unfinished 2007 C# port sitting in the repository, with a small Access
database of designs. Whoever started it had the right instinct — saved designs deserve to
persist. That idea is worth bringing forward.

---

## Built With

`typescript` · `react` · `next.js` · `tailwindcss` · `svg` · `vercel` · `visual-basic` ·
`node.js` · `claude` · `claude-code` · `docx` · `git`

**Languages and frameworks:** TypeScript, React 19, Next.js 16, Tailwind CSS 4, Node.js
**Original source:** Microsoft Visual Basic 3 (Windows 3.1), 1993
**Graphics:** hand-authored SVG, rendered to PNG via headless Chromium
**Document generation:** the `docx` npm library, driven by the solver's own output
**AI pair:** Claude Code (Opus 5)
**Hosting:** Vercel, static export, zero backend

---

## Two-minute demo video script

Spoken narration only. Roughly 300 words, which lands at about two minutes at a natural
presenting pace.

---

In 1993 I wrote a nuclear reactor design program for Windows 3.1. It shipped on floppy disks.
Then Windows 3.1 died, and the program died with it.

I still had the source. So I brought it back.

This is Nuclear Reactor Design for Young Inventors. It runs in any browser. Nothing to install,
no account, and every calculation happens on your own machine.

Pick a fuel — there are six fissile isotopes. Pick a moderator. Pick a coolant and a core
shape. Set five parameters.

The program solves for the moderator-to-fuel ratio that makes your reactor exactly critical,
then gives you everything that follows from it. Critical mass. Thermal power. Heat flux. Fuel
temperature. Efficiency. There's no calculate button. Move a slider, and every number moves
with it.

Now watch this, because it's the best thing in the project.

The default case looks great. Twenty-six hundred megawatts thermal, nine hundred megawatts
electric, thirty-four percent efficiency. That's a real power plant.

It's also impossible. Look at the power density. Thirty-nine hundred megawatts per cubic meter
— a hundred and twenty-five times any reactor operating today. The heat flux is fifteen times
Oconee. This core would vaporize itself.

The fix is one change. Make the core bigger. Three meters on a side.

Power stays exactly the same. Heat flux falls from seven ninety-eight to thirty. Coolant
velocity, thirty-five meters per second down to under four. Everything lands in operating
range.

And the cost? Critical mass goes from fifteen kilograms to three hundred and thirty-one.

That trade — thermal feasibility bought with fuel — is reactor design. You just watched it
happen in twenty seconds.

Rebuilding this found four bugs in my own 1993 code. And one thing I never noticed back then.
Critical mass versus core size isn't monotonic. There's a minimum. A forty-eight centimeter
cube. Four kilograms.

It's free. Reactor dash seven dot vercel dot app. Go design a reactor.
