// Part II - the engineering chapters, and Part III chapter 8 (running the program).

export const part2 = [
  { t: "part", x: "Part II", sub: "The Engineering of Heat Removal" },

  // ------------------------------------------------------------------ Ch 5
  { t: "h1", x: "5. Heat Removal and the Unit Cell" },

  { t: "h2", x: "5.1 Porosity and the coolant channels" },
  { t: "p", x: "Fission deposits its energy almost entirely as kinetic energy of the fission fragments, within a micron or so of where the fission occurred. That heat has to cross from the fuel into the coolant, and the geometry of that crossing sets the limits on the whole design." },
  { t: "p", x: "The program treats the core as a homogeneous mixture of fuel and moderator, perforated by a regular array of identical coolant channels. A single parameter, the porosity ε, describes the split: it is the fraction of the core volume occupied by coolant. Everything else follows from it and from the tube diameter d." },
  { t: "fig", src: "fig7-unitcell.png", w: 624, h: 240, n: 4, cap: "The homogenised unit cell and the resulting radial temperature profile. Porosity sets the number of channels and the solid volume; the fuel radius and the power density together set the centreline temperature." },
  { t: "p", x: "The number of coolant channels is the total coolant volume divided by the volume of one channel. The solid volume that holds fuel and moderator is V(1 − ε). The mass of moderator is that solid volume times the moderator density, and the mass of coolant in the core is εV times the coolant density. The default porosity of 0.33 in a one cubic metre core with 0.4 cm tubes gives about 26,300 channels — a plausible number for a small core, and one that scales to 236,000 when the core is enlarged to three metres on a side." },
  { t: "p", x: "Porosity is a genuine design variable with opposing pulls. Raising it gives more flow area, so coolant velocity and pressure drop fall and pumping power falls with them. But it also removes fuel and moderator from the core, which raises the critical mass requirement and cuts the power density. Lowering it does the reverse. There is no universally right answer, only an answer for a given objective." },

  { t: "h2", x: "5.2 Power, power density, and heat flux" },
  { t: "p", x: "The thermal power is fixed entirely by the coolant energy balance. It is the mass flow rate multiplied by the specific heat capacity and by the temperature rise across the core:" },
  { t: "eq", x: "P = ṁ · cp · (Tmax − Tmin)" },
  { t: "p", x: "This is worth dwelling on, because it catches people out. The thermal power the program reports has nothing to do with the critical mass or the core size. It is whatever the coolant carries away. If you set a flow rate of 10,000 kg/s of water with a 60 K rise, you get 2633 MW of thermal power whether the core is one cubic metre or twenty-seven. What changes with core size is the power density — the same power spread through a different volume — and every thermal consequence that follows from it." },
  { t: "p", x: "Power density is the thermal power divided by the solid volume, V(1 − ε). Average heat flux is the thermal power divided by the total channel wall area. Both are the quantities that actually threaten the design. A power density of 3930 MW/m³, which is what the program's demonstration default produces, is more than a hundred times what any operating power reactor sustains, and the heat flux of 798 W/cm² that goes with it is fifteen times the value at Oconee 1. The demonstration case is deliberately compact so that it runs quickly and shows a critical result; it is not a plausible plant. Recognising that, and fixing it, is the substance of Worked Example 1." },

  { t: "h2", x: "5.3 Fuel centreline temperature" },
  { t: "p", x: "Heat generated on the axis of a fuel element must conduct radially outward to reach the coolant. Solving the conduction equation for a cylinder with uniform volumetric heat generation gives a parabolic temperature profile, with the peak on the centreline and a temperature rise proportional to the volumetric heat rate times the square of the fuel radius, divided by the thermal conductivity." },
  { t: "p", x: "The program computes an effective fuel radius from the tube diameter and the porosity, imposes a floor of 0.4 cm, then adds a fixed 200 K film and cladding allowance to the maximum coolant temperature before adding the conduction rise. The result is reported as Maximum Fuel Temperature." },
  { t: "p", x: "Two limits bracket this number. Uranium dioxide melts at about 3120 K, and no design may approach it under any transient. Zirconium alloy cladding begins to react rapidly with steam above roughly 1500 K, which is the more restrictive limit in a water reactor. UO₂ has poor thermal conductivity, around 3 W/m·K at operating temperature, so the centreline of a fuel pin runs far hotter than its surface — a temperature difference of 1000 K or more across a few millimetres is normal. That is why fuel pins are thin. Halving the pin radius quarters the centreline temperature rise." },
  { t: "p", x: "Watch this number in every case you run. It is the fastest way to discover that a design which looks fine on the criticality page is thermally impossible." },

  { t: "h2", x: "5.4 Thermal limits and the hot channel" },
  { t: "p", x: "A thermal designer must ensure that every coolant channel is safe, which is done by ensuring the single most limiting channel is safe. The hot channel is assumed to sit in the hottest region of the core and to have the least favourable dimensions within manufacturing tolerance. Hot channel factors relate its conditions to the core average, and they are typically in the range 2 to 2.5 for the combined radial and axial peaking in a large core." },
  { t: "p", x: "Four limits govern. There must be no flow oscillations. There must be no hydraulic instabilities. There must be no departure from nucleate boiling. And no temperature anywhere may exceed the allowable peak centreline value, for steady state or for the design transient." },
  { t: "p", x: "Departure from nucleate boiling deserves particular attention. In nucleate boiling, bubbles form at the heated surface and detach, and heat transfer is extremely efficient. If the heat flux is pushed too high, the bubbles merge into a continuous vapour film that blankets the surface. Vapour conducts heat poorly, so the surface temperature jumps almost instantly by hundreds of degrees, which can destroy the cladding in seconds. The critical heat flux at which this happens depends on pressure, mass flux, and steam quality. The program does not compute a DNB ratio, so the average heat flux it reports must be compared against experience: values of 50 to 60 W/cm² are typical of operating PWRs, and anything far above that should be treated as a warning." },

  { t: "h2", x: "5.5 Pressure drop and pumping power" },
  { t: "p", x: "Coolant velocity follows directly from the flow rate, the density, and the total flow area. From velocity, the program computes the Reynolds number, then the friction factor from the Blasius correlation for smooth turbulent pipe flow:" },
  { t: "eq", x: "f = 0.079 · Re⁻⁰·²⁵" },
  { t: "p", x: "and from the friction factor the pressure drop through the core, with a factor of 1.5 applied to account for entrance, exit, and grid losses. The pumping power follows from the pressure drop, the flow area, and the velocity, at an assumed pump efficiency of 0.8." },
  { t: "p", x: "Pressure drop scales with the square of velocity and pumping power with the cube, which makes velocity the variable to watch. The demonstration default runs water at 35 m/s, giving an 18.8 atm pressure drop and 17.4 MWe of pumping power — around two per cent of gross electrical output consumed just to push coolant. Operating PWRs run at 4 to 6 m/s. Enlarging the core in Worked Example 1 brings the velocity to 3.89 m/s, the pressure drop to 1.21 atm, and the pumping power to 1.12 MWe, all of which are realistic." },
  { t: "p", x: "Gas coolants are subject to an additional limit. The program caps hydrogen and helium at Mach 0.3, computed from the local sound speed at the maximum coolant temperature. If the requested flow would exceed it, the velocity is clipped and the system pressure is raised to compensate, which is what a real designer would do — gas cooling at high power requires high pressure precisely to keep the volumetric flow, and hence the velocity, manageable. When a case is Mach limited the program says so on the Primary Coolant page." },

  // ------------------------------------------------------------------ Ch 6
  { t: "h1", x: "6. Power Conversion" },

  { t: "h2", x: "6.1 Two ways to make electricity" },
  { t: "p", x: "Heat in a coolant is not yet useful work. It must be converted, and the program offers the two fundamental architectures." },
  { t: "fig", src: "fig3-loops.png", w: 624, h: 423, n: 5, cap: "The two power conversion architectures. A closed loop keeps the primary coolant inside containment and transfers heat to a separate steam circuit; an open loop expands the coolant directly through the turbine and discards it." },
  { t: "p", x: "In a closed loop, the primary coolant circulates through the core and then through a steam generator, where it gives up heat to a physically separate secondary circuit without mixing. The secondary fluid boils, expands through a turbine, condenses, and is pumped back. Water, helium, and sodium coolants all use this arrangement in the program. The advantage is containment: activated primary coolant never leaves the shielded loop, so the turbine hall is accessible during operation. The cost is a heat exchanger and the temperature penalty across it." },
  { t: "p", x: "In an open loop, the coolant itself expands through the turbine and is then discarded. Selecting hydrogen forces this configuration, and the program removes the steam generator, condenser, and feed pump from the diagram accordingly. Open loops are used where mass matters more than fuel economy — nuclear thermal propulsion above all — because they eliminate an entire heat exchanger and its associated mass. The penalty is severe: the working fluid is consumed, so operating time is bounded by tank capacity, and any activated coolant is released." },

  { t: "h2", x: "6.2 The secondary circuit and cycle efficiency" },
  { t: "p", x: "For the closed loop the program uses a fixed set of secondary state points, tabulated in Appendix A, Table V. Steam leaves the generator at 516 K and 34.9 atm with an enthalpy of 1205 BTU/lb. It expands through the turbine to an exhaust enthalpy of 850 BTU/lb, condenses at 0.077 atm, and is returned as feedwater at 168 BTU/lb." },
  { t: "p", x: "The secondary mass flow rate is whatever is needed to absorb the reactor's thermal power across the enthalpy rise from feedwater to steam. The turbine output is that flow rate times the enthalpy drop across the turbine. Dividing turbine output by thermal power gives the cycle efficiency, which for these fixed state points comes to 34.2 per cent — a value that matches the efficiency of a real PWR closely, and matches the constant the original program carried as its default." },
  { t: "p", x: "Because the secondary state points are fixed, the cycle efficiency does not change when you change the primary side. This is a genuine limitation and you should know about it. In reality, raising the primary outlet temperature would let you raise steam conditions and gain efficiency; that is the entire argument for high-temperature gas reactors and for supercritical water designs. The program will not show you that gain. What it will show you correctly is the effect of your choices on the primary side — velocity, pressure drop, pumping power, fuel temperature — and on criticality." },
  { t: "p", x: "For the open loop the program applies a flat 36 per cent conversion to the thermal power, slightly higher than the closed-loop figure, reflecting the absence of a steam generator temperature penalty." },

  // ------------------------------------------------------------------ Ch 7
  { t: "h1", x: "7. Control, Protection, and Shielding" },

  { t: "h2", x: "7.1 The purpose of the control system" },
  { t: "p", x: "Control rods serve four functions: to start the reactor up, to hold the average coolant temperature at its setpoint, to shut the reactor down, and to compensate for the slow changes in core properties over life so that criticality can be maintained. The operator controls the effective multiplication factor by rod motion, and as Chapter 2 explained, that is possible at all only because of delayed neutrons." },
  { t: "p", x: "The program does not model rods. It computes the composition of an exactly critical core with no rods present, which corresponds to a core at the end of life with all rods fully withdrawn. A real design would carry substantially more fuel than the program's critical mass, with the excess held down by rods and burnable poisons." },

  { t: "h2", x: "7.2 Automatic protection" },
  { t: "p", x: "Many transients develop far too quickly for human diagnosis, so protection is automated. A scram is the rapid insertion of all control rods, complete within about a second. A cutback is a fast but controlled rod insertion, used where a full scram would be excessive. Either may be initiated manually or automatically when a monitored parameter crosses its trip point." },
  { t: "p", x: "The protection logic maps failure modes to trips. A reactivity excursion — from uncontrolled or over-rapid rod withdrawal, a cold water accident, or loss of coolant — is caught by a high start-up rate scram or an overpower scram. A loss of control from a control system failure, operator error, or a stuck rod is caught by a high outlet temperature scram or an overpower scram. A power-to-flow mismatch from instrument error or control malfunction is caught by the high outlet temperature scram. A coolant failure from loss of flow, loss of coolant, or vessel failure is caught by a loss of flow scram, a high outlet temperature scram, or a low pressure scram." },
  { t: "p", x: "Interlocks provide a second layer, preventing operators from committing certain errors at all. A cold water interlock, for example, blocks starting flow from a cold loop into the reactor, which would insert a large positive reactivity through the negative temperature coefficient. Beyond the hardware, safe operation depends on trained personnel following explicitly written procedures, in normal operation, in shutdown, and in emergencies." },

  { t: "h2", x: "7.3 Shielding and radiological hazard" },
  { t: "p", x: "A shield surrounds the reactor to reduce radiation to tolerable levels, and it has two components. The thermal shield, close to the core, absorbs most of the energy and protects the pressure vessel from radiation damage and excessive heating. The biological shield, outside it, reduces the dose rate to levels safe for personnel. Lead and steel attenuate gamma rays; hydrogenous material, usually water or concrete, moderates and captures neutrons." },
  { t: "p", x: "Radioactivity in the primary coolant comes from three sources. Gamma rays from the fuel activate the coolant itself, producing short-lived oxygen and nitrogen isotopes. Erosion and corrosion release metal from surfaces in contact with the coolant — cobalt, iron, and manganese in particular — which then circulate through the core and become activated; cobalt-60 has a long half-life and is the dominant contributor to long-term dose during maintenance. Third, fission products recoil out of any failed fuel, and impurities in the cladding activate and migrate into the coolant." },
  { t: "p", x: "With an adequate shield, direct radiation is not the limiting hazard. The dose at the site boundary of a well-designed plant at full power is below natural background. The design problems are the ones that involve moving material: controlled discharge of primary coolant, handling of activated components during maintenance, and management of spent fuel." },

  { t: "part", x: "Part III", sub: "Using the Program" },

  // ------------------------------------------------------------------ Ch 8
  { t: "h1", x: "8. Getting Started" },

  { t: "h2", x: "8.1 Opening the program" },
  { t: "p", x: "The program runs entirely in your browser. There is nothing to install, no account to create, and no data leaves your machine — every calculation happens locally in the page. It works in any current browser on desktop, tablet, or phone, although a screen at least 1200 pixels wide is best because it shows the design controls, the plant diagram, and the results side by side." },
  { t: "steps", x: [
    "Open a web browser.",
    "Go to https://reactor-seven.vercel.app/",
    "The workspace loads with the demonstration reactor already configured and solved. You do not need to press anything to see results.",
  ]},
  { t: "p", x: "The demonstration case is a one metre cube of U-235 in light water, water cooled, closed loop, at 470 to 530 K with 10,000 kg/s of flow. It is the same default set the 1993 program started from, and it is listed in full in Appendix A, Table IV." },

  { t: "h2", x: "8.2 The workspace" },
  { t: "fig", src: "fig5-workspace.png", w: 624, h: 412, n: 6, cap: "The workspace. Design controls on the left, the live system diagram and headline results in the centre, and the five output pages on the right." },
  { t: "p", x: "The screen has three columns. On the left is the DESIGN PHASE panel, which holds every input. In the centre is the system diagram, which redraws whenever you change the core shape or the coolant, and below it eight headline results. On the right are the five output pages of the OUTPUT PHASE, selected by the tabs across the top." },
  { t: "p", x: "There is no calculate button. Every result on the screen recomputes the moment you change any input, which is what makes parametric exploration fast. Drag a slider and watch the critical mass and the fuel temperature move together." },

  { t: "h2", x: "8.3 The DESIGN PHASE, step by step" },
  { t: "p", x: "Work down the left panel in order. The sequence matters, because later choices depend on earlier ones." },
  { t: "steps", x: [
    "Select the fuel. Six isotopes are offered: U-233, U-235, Pu-239, Pu-241, Am-242, and Cm-245. Each button shows the thermal fission cross section in barns, so you can see at a glance why the choice matters. Full data is in Appendix A, Table I.",
    "Select the moderator. Five materials are offered: light water, heavy water, beryllium, carbon-12, and carbon-13. The relevant properties — Fermi age, diffusion length squared, density, and absorption cross section — are in Appendix A, Table II.",
    "Select the coolant. Water, hydrogen, helium, or sodium. Choosing hydrogen switches the plant to an open loop automatically and removes the steam generator and condenser from the diagram. The other three use a closed loop with water as the secondary fluid.",
    "Select the geometry, then enter dimensions. Rectangular takes three edge lengths; cylindrical takes a radius and a height; spherical takes a radius. All dimensions are in centimetres, and the allowed range appears above each field. You can type a value or drag the slider.",
    "Set the variables. Maximum and minimum coolant temperature in kelvin, coolant tube diameter in centimetres, porosity as a fraction, and coolant flow rate in kilograms per second.",
  ]},
  { t: "p", x: "The difference between the maximum and minimum coolant temperatures is the temperature rise across the core, and together with the flow rate it fixes the thermal power. Set these two first when you are targeting a particular power output." },

  { t: "h2", x: "8.4 Defining your own materials" },
  { t: "p", x: "If you have data for a material the program does not offer — an alloyed fuel at a particular enrichment, a mixed oxide, an unusual moderator — use the Define your own button beside the Fuel or Moderator heading. For a fuel you supply the thermal fission cross section, thermal absorption cross section, thermal conductivity, density, atomic mass number, and a name. For a moderator you supply the diffusion length squared, Fermi age, thermal absorption cross section, density, mass number, and a name." },
  { t: "p", x: "This is how you approach a realistic enrichment. The program's built-in fuels are pure isotopes, so a critical mass of 331 kg of U-235 means 331 kg of the pure isotope. To model 4 per cent enriched UO₂ you would enter effective cross sections weighted for the fuel composition and the density of the oxide, and read the result as a mass of that fuel rather than of pure metal." },

  { t: "h2", x: "8.5 The OUTPUT PHASE" },
  { t: "p", x: "Five pages report the results, reached by the tabs on the right." },
  { t: "bullets", x: [
    "Reactor gives the criticality and core results: volume, buckling, moderator-to-fuel ratio, fuel number density, moderator mass, critical mass, annual burnup, specific power, power density, average heat flux, maximum fuel temperature, average thermal neutron flux, and thermal power.",
    "Primary reports the primary coolant circuit: porosity, tube diameter, number of channels, coolant density, pressure, flow rate, velocity, Reynolds number, friction factor, core pressure drop, pump power, coolant mass in the core, maximum temperature, and temperature rise.",
    "Secondary reports the power conversion side: steam conditions, turbine efficiency, cycle efficiency, secondary flow rate, condensate pump power, and electrical output. For an open loop it reports the direct-expansion equivalents instead.",
    "State Points tabulates temperature, pressure, and enthalpy at each numbered point around the plant. Points 1 to 3 are the primary loop and follow your design; points 4 to 7 are the secondary loop and are fixed.",
    "Summary lists your current selections and compares your design against two operating plants, Oconee 1 and Pickering, on thermal power, electrical power, core volume, and heat flux.",
  ]},
  { t: "fig", src: "fig6-outputs.png", w: 330, h: 437, n: 7, cap: "The Primary Coolant output page for the demonstration case. A velocity of 35 m/s and a pressure drop of 18.8 atm are both far above operating practice — the first sign that the default core is too small." },

  { t: "h2", x: "8.6 Saving, loading, and printing" },
  { t: "p", x: "The Files menu holds four commands. Save design writes the current configuration to a JSON file on your computer. Open design reads one back. Print page sends the workspace to your printer or to a PDF. Reset to defaults returns everything to the demonstration case." },
  { t: "p", x: "Save case, the green button at the top right, is different: it adds the current design to a comparison table below the diagram without leaving the current design. This is the tool for parametric studies, and Chapter 13 uses it." },
];
