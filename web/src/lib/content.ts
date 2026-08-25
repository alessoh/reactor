// Tutorial and reference text, condensed from the 1993 user's manual
// (USER595.DOC) and tutorial (TUTOR595.DOC) by H. Peter Alesso.

export interface Section {
  id: string;
  title: string;
  body: string[];
}

export const TUTORIAL: Section[] = [
  {
    id: "overview",
    title: "1.0 Overview",
    body: [
      "Nuclear fission is the splitting of the nucleus into two or more fission fragments with one to three neutrons and a great deal of energy — about 200 million electron-volts. Fission occurs with high probability for fissile materials such as Uranium-235 or Plutonium-239. Neutrons emitted immediately from fission are called prompt neutrons; those released 0.2 to 55 seconds after fissioning are called delayed neutrons.",
      "When the number of neutrons being produced from all sources is exactly equal to the number being eliminated by all mechanisms, the rate of change in the neutron population is zero. The population is balanced and the reactor is CRITICAL. If the population is growing the reactor is SUPERCRITICAL; if it is declining, SUBCRITICAL.",
      "The choice of fuel determines the probability of fission. The choice of moderator determines the probability that neutrons slow down without being absorbed or lost to leakage. The choice of geometry and dimensions plays a large role in the rate at which neutrons are lost to leakage. And the choice of coolant plays a role in neutron absorption, as well as determining the rate of heat transfer from the reactor to the power conversion system.",
      "The design of a thermal nuclear reactor is a complex integration of physics and engineering. The choice of a reactor concept is based on extensive parametric studies that vary fundamental variables — fuel, moderator, geometry, coolant, and power conversion system. As you gain experience running your own designs, you will begin to appreciate the trade-offs that must be made.",
    ],
  },
  {
    id: "fuel",
    title: "2.0 Selecting the Fuel",
    body: [
      "Only three nuclides — Uranium-233, Uranium-235, and Plutonium-239 — are (1) stable for storage, (2) available, and (3) capable of fissioning by neutrons of all energies, from thermal (0.025 eV or less) to millions of electron volts. Of these, only U-235 occurs in nature. The others are produced artificially by neutron capture followed by radioactive decay.",
      "Plutonium-241, Americium-242, and Curium-245 are included as selection options. Their stability is limited and they will be unavailable for decades to come, but they are included for the insight they provide when comparing parametric studies.",
      "Atoms with nuclei containing the same number of protons but different mass numbers are essentially identical chemically, although they can have widely different nuclear properties. Such species are called isotopes.",
    ],
  },
  {
    id: "moderator",
    title: "3.0 Selecting the Moderator",
    body: [
      "To minimize the required critical mass of fuel, it is desirable to have most of the fissions occur as a result of absorption of thermal neutrons. This is achieved by distributing the fuel within a moderating material, whose function is to slow down the high-energy neutrons liberated in fission, mainly through elastic scattering.",
      "The best moderators are materials consisting of elements of low mass number with little tendency to capture neutrons — ordinary water, heavy water (deuterium oxide), beryllium, and carbon. The relative amount and nature of the fuel and moderator determine the energies of most of the neutrons causing fission. The relative amounts are expressed as the moderator-to-fuel ratio, the ratio of an atom of moderator to an atom of fuel.",
    ],
  },
  {
    id: "geometry",
    title: "4.0 Geometry and Buckling",
    body: [
      "The critical buckling B² for thermal unreflected reactors is used to evaluate the critical size for a prescribed shape. For a given material composition, the critical volume — and therefore the critical mass — is minimal for a sphere. This is because the sphere has the minimum area-to-volume ratio: neutron production takes place throughout the volume, but leakage out of the reactor occurs only at the surface.",
      "Once fuel and moderator have been selected and the geometry designated, the critical mass can be calculated from the geometric buckling and the resulting critical moderator-to-fuel ratio. In this program the calculation uses Fermi age, thermal group, and homogeneous reactor approximations. The results are rough estimates — not as accurate as Monte Carlo simulations of heterogeneous designs.",
    ],
  },
  {
    id: "thermal",
    title: "5.0 Heat Removal and Power Conversion",
    body: [
      "The heat generated in the core by fission is removed by a coolant — water, liquid metals, gases, or certain organic compounds. To convert this heat to electrical energy it must be either (1) transferred from the coolant to a working fluid to raise steam in a CLOSED LOOP power conversion system, or (2) used to run a turbine directly in an OPEN LOOP system.",
      "The higher the temperature of the steam or working fluid, the greater the efficiency of conversion into useful power — hence the desire to operate at the highest possible temperature. But heat must be removed from the core at a rate that lets the coolant reach a high temperature without causing thermal stresses or fuel centerline temperatures that would damage the fuel or structure.",
      "A thermal designer must ensure that all channels are safe with respect to thermal limits, which is accomplished by ensuring the most limiting channel is safe. The hot channel is assumed to be in the hottest region of the core with the most adverse dimensions. Thermal limits are set as: no flow oscillations, no instabilities, no departure from nucleate boiling, and no temperature greater than the maximum allowable peak centerline temperature.",
    ],
  },
  {
    id: "control",
    title: "6.0 Reactivity and Control",
    body: [
      "Reactivity is the degree of criticality of a reactor, ρ = 1 − 1/k_eff. Reactivity is inserted by five mechanisms: coolant temperature, reactor pressure, control rod movement, fuel depletion (including burnable poison depletion), and fission product poison concentration.",
      "A change in the average coolant temperature changes moderator density, which changes the rate at which neutrons slow down. Temperature also changes Doppler broadening — the width of the absorption cross sections in the resonance region. The composite of these two effects is the temperature coefficient. All reactors are required to have negative temperature coefficients so as to have negative feedback and thus be self-regulating.",
      "The reactor operator controls k_eff by rod motion. This is possible only because of delayed neutrons: prompt neutrons appear about 10⁻⁴ seconds after a fission, while delayed neutrons appear 0.2 to 55 seconds after. If all neutrons were prompt, power could change by a factor of 8,000 in 0.33 seconds for a k_eff change of 0.003.",
    ],
  },
  {
    id: "history",
    title: "7.0 Background",
    body: [
      "The development of nuclear reactors had its origin in the atomic program of World War II, the Manhattan Project. Commercial development originated with the project's partners — the U.S., the U.K., France, and Canada.",
      "Canada was the first nation to emphasize the civil aspects. Its early research reactor, the NRX of 1947, was the precursor to the CANDU heavy-water reactor. The French first went critical in 1948 and by 1956 had a plutonium-powered, air-cooled, graphite-moderated reactor. The U.K. began with the gas-cooled MAGNOX type because it lacked enrichment facilities.",
      "The U.S. had large alternative energy resources and so did not immediately move ahead with commercial reactors; many different types were explored. Eventually the demand for a compact, reliable reactor for submarines led to the rapid development of the Pressurized Water Reactor. The PWR and the Boiling Water Reactor became the basis of the U.S. commercial industry.",
      "There are today six basic types of commercial reactor: PWR, BWR, CANDU, gas-cooled (MAGNOX), advanced gas-cooled (AGR), and high-temperature gas reactor (HTGR).",
    ],
  },
];

export const ASSUMPTIONS = [
  "Thermal group approximation, homogeneous reactor approximation, and Fermi age approximation are used to compute criticality.",
  "The core is unreflected — there is no reflector region.",
  "Critical mass is given for the pure isotope. Use Design Your Own Fuel to account for alloyed fuels of various enrichments.",
  "Annual fuel burnup assumes 100% power continuously and a 0% breeding rate.",
  "A maximum gas velocity of Mach 0.3 is imposed on hydrogen and helium coolants.",
  "The neutron reproduction factor η is held at 2.06 for all fuels, as in the original program.",
  "Secondary-loop state points are fixed at the values tabulated in the manual and do not vary with the design.",
];

/** Appendix C — reference plants, for comparison against a user design. */
export const EXAMPLES = [
  { name: "Oconee 1", type: "PWR", powerTh: 2584, powerEl: 886, volume: 30.7, mass: 83000, tHot: 591, tCold: 563, flow: 12600, powerDen: 31.1, heatFlux: 54.1 },
  { name: "Pickering", type: "HWR", powerTh: 1742, powerEl: 508, volume: 265, mass: 92600, tHot: 567, tCold: 523, flow: 17700, powerDen: 10, heatFlux: 59.2 },
];
