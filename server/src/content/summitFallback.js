/**
 * The bundled programme, mirrored from client/src/content/summit.js.
 *
 * Used only when the content store has no sessions entered — the same
 * condition under which the website itself falls back to its fixtures. Kept
 * as a copy rather than an import so the server never reaches across into the
 * client bundle for data.
 */
export const SUMMIT_FALLBACK = {
  summit: {
    date: '19 September 2026',
    venue: 'Bharat Mandapam, New Delhi',
  },
  sessions: [
  {
    id: 'registration',
    kind: 'break',
    start: '09:00',
    end: '09:30',
    title: 'Registration & Tea',
    description: 'Delegate check-in and networking.',
  },
  {
    id: 'inaugural',
    kind: 'session',
    start: '09:30',
    end: '10:45',
    type: 'Inaugural Session',
    theme: 'Abeyance with Cause',
    group: 'Introduction',
    title: 'Inaugural Session',
    description:
      "Sets the tone for the day: India's abeyance of the IWT as a lawful, measured "
      + 'response to sustained cross-border terrorism and treaty bad faith, not an act '
      + "of aggression. Frames the dialogue's central proposition that security and "
      + 'legality, not sentiment, must govern the future of the Treaty. Previews the '
      + "day's four analytical pillars: law, security, hydrology/economics, and "
      + 'strategic communication.',
  },
  {
    id: 'break-1',
    kind: 'break',
    start: '10:45',
    end: '11:00',
    title: 'Break',
    description: 'Tea & networking.',
  },
  {
    id: 'curtain-raiser',
    kind: 'session',
    start: '11:00',
    end: '11:40',
    type: 'Curtain-Raiser Panel',
    group: 'Identity Crisis',
    title: 'Reclaiming the Indus — Civilisation, Heritage and the Naming of a River',
    description:
      'A short historical and archaeological session on the Indus Valley Civilisation, '
      + 'Mohenjo-daro, Harappa, and the shared linguistic root of Sindhu, Hindu, India '
      + "and Indus. Establishes India's civilisational continuity with the Indus basin "
      + 'as context for the day.',
  },
  {
    id: 'session-1',
    kind: 'session',
    start: '11:40',
    end: '12:45',
    type: 'Session I',
    group: 'Introduction',
    title: 'The Text Speaks — Abeyance as Lawful, Not Breach',
    description:
      "The legal core of the dialogue. It covers the IWT's Preamble, the Article IX "
      + 'dispute-resolution ladder, and Article XII on modification and termination, '
      + "including a direct discussion of Article XII(4)'s requirement that the Treaty "
      + "remains in force until mutually terminated, and the Permanent Court of "
      + "Arbitration's 2025 supplemental award on continuing jurisdiction. Discusses how "
      + "India's abeyance is a proportionate countermeasure under the law of state "
      + 'responsibility (material breach, rebus sic stantibus and ARSIWA Articles 25–26). '
      + 'Addresses, independent of the terrorism question, why climate-driven shifts in '
      + "glacial melt and river flow make a scientific case for renegotiating the Treaty's "
      + 'technical terms.',
  },
  {
    id: 'break-2',
    kind: 'break',
    start: '12:45',
    end: '13:00',
    title: 'Break',
    description: 'Tea & networking.',
  },
  {
    id: 'session-2',
    kind: 'session',
    start: '13:00',
    end: '14:05',
    type: 'Session II',
    group: "Decoding Pakistan's Narrative",
    title: 'Terror as the Breach',
    description:
      'Examines how sustained cross-border terrorism — Pahalgam (2025), Pulwama, 26/11 '
      + '— has eroded the good-faith premise on which the IWT was built. Discussion on '
      + 'sourced, dated accounts linking specific attacks to the breakdown of treaty '
      + 'cooperation, drawing on investigation records, judicial findings, UN listings '
      + "and FATF documentation. The session also places on record Pakistan's public "
      + "statements threatening a military response to India's water policy, analysed as "
      + 'posturing rather than credible deterrence.',
  },
  {
    id: 'lunch',
    kind: 'break',
    start: '14:10',
    end: '14:55',
    title: 'Lunch Break',
    description: '',
  },
  {
    id: 'session-3',
    kind: 'session',
    start: '14:55',
    end: '15:55',
    type: 'Session III',
    group: "Decoding Pakistan's Narrative",
    title: 'Who Actually Weaponises Water and the Accountability Deficit',
    description:
      'A data-driven session on the hydrology and infrastructure of the western rivers. '
      + "Speakers present basin-share figures, flow and storage data, and India's "
      + "project-compliance record, alongside Pakistan's own decades of under-investment "
      + 'in storage and its procedural blocking of Indian projects. The Left Bank Outfall '
      + 'Drain (LBOD) is discussed as an example of cross-border environmental harm '
      + 'affecting the Rann of Kutch. Climate-altered flows and environmental-impact '
      + 'considerations are also addressed, alongside how six decades of favourable water '
      + 'access did not translate into commensurate Pakistani investment in storage or '
      + 'irrigation efficiency.',
  },
  {
    id: 'break-3',
    kind: 'break',
    start: '15:55',
    end: '16:10',
    title: 'Break',
    description: 'Tea & networking.',
  },
  {
    id: 'session-4',
    kind: 'session',
    start: '16:10',
    end: '17:10',
    type: 'Session IV',
    group: 'Economics & The Red Line',
    title: 'India as Lawful Upper Riparian and Terms for Return',
    description:
      'Makes the forward-looking case: why the western rivers are critical to India\'s '
      + 'agriculture, hydropower and water security, and what conditions would need to be '
      + "met for a return to normal treaty cooperation. Quantifies India's usage of its "
      + 'treaty-compliant projects (Salal, Baglihar, Dulhasti, Uri, Kishanganga) and sets '
      + 'out realistic terms — verifiable cessation of cross-border terrorism and '
      + "good-faith engagement — under which India's position could evolve.",
  },
  {
    id: 'valedictory',
    kind: 'session',
    start: '17:10',
    end: '17:40',
    type: 'Valedictory',
    group: 'Economics & The Red Line',
    title: "Adoption of the 'New Delhi Declaration on the Indus Waters Treaty'",
    description:
      "Closing session synthesising the day's legal, security and economic arguments "
      + "into a short, adopted declaration reaffirming India's position, and releasing "
      + 'the White Paper summarising the sourced evidence presented across all sessions.',
  },
  {
    id: 'high-tea',
    kind: 'break',
    start: '17:40',
    end: '18:00',
    title: 'High Tea',
    description: 'Tea & networking.',
  },
],
};
