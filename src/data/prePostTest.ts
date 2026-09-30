import { PrePostQuestion } from '../types/game';

export const EVALUATION_QUESTIONS: PrePostQuestion[] = [
  {
    id: 'q1',
    question: 'How did the ancient inhabitants of Dholavira primarily secure fresh water in the arid Rann of Kutch?',
    options: [
      'By drilling deep artesian tube-wells into groundwater aquifers',
      'By impounding seasonal monsoon flash floods with stone dams across seasonal streams (Manhar & Mansar)',
      'By transporting water by boat from mainland rivers',
      'By melting winter snow from nearby hilltops'
    ],
    correctIndex: 1,
    explanation: 'Dholavira is situated between two seasonal monsoon torrents (Manhar and Mansar). Heavy stone bunds diverted flash floodwaters into a connected series of massive urban reservoirs.',
    sourceReference: 'Singh et al. (2020), "Hydrology and water resources management in ancient India"'
  },
  {
    id: 'q2',
    question: 'What crucial engineering purpose did the stone settling/desilting basins serve before water reached the main reservoirs?',
    options: [
      'They cooled the water temperature before drinking',
      'They trapped sand, gravel, and sediment so the main reservoirs would not silt up and lose storage capacity',
      'They served as ritual bathing tanks for priests',
      'They added minerals to turn the water alkaline'
    ],
    correctIndex: 1,
    explanation: 'Flash torrents in arid soils carry massive amounts of silt. Desilting basins slowed water velocity, causing dense sediment to settle out prior to entering deep bedrock-carved storage tanks.',
    sourceReference: 'Bisht, R.S. (2015), "Dholavira: Excavations at a Harappan City"'
  },
  {
    id: 'q3',
    question: 'Why could ancient Harappan artisans NOT use bronze or copper drill bits to drill holes through carnelian beads?',
    options: [
      'Bronze was strictly forbidden by religious laws',
      'Carnelian is much harder (Mohs ~7) than bronze or copper, causing metal bits to blunt instantly without penetrating',
      'Copper produced toxic dust when heated',
      'Bronze tools were too heavy for craftsmen to hold'
    ],
    correctIndex: 1,
    explanation: 'Quartz and carnelian possess a Mohs hardness of nearly 7. Bronze Age copper tools (Mohs 3–3.5) cannot drill quartz. The Harappans pioneered ultra-hard metamorphic stone micro-drills known as Ernestite.',
    sourceReference: 'Prabhakar, V.N. (2016), "Stone Bead Drilling Technology in South Asia"'
  },
  {
    id: 'q4',
    question: 'What technique did Harappan lapidary craftspeople use to transform dull yellowish chalcedony into lustrous red carnelian?',
    options: [
      'Dipping the stones in crushed pomegranate juice',
      'Controlled heating inside ceramic canisters in kiln hearths to thermally oxidize iron minerals',
      'Boiling the stones in salty sea water',
      'Leaving stones buried beneath desert sand for decades'
    ],
    correctIndex: 1,
    explanation: 'Pyrotechnology was central to Indus bead craft. Heating chalcedony in clay canisters oxidized trace ferrous iron compounds into ferric iron, turning the stones a vivid red.',
    sourceReference: 'Kenoyer, J.M. (1998), "Ancient Cities of the Indus Valley Civilization"'
  },
  {
    id: 'q5',
    question: 'Approximately how much water could Dholavira\'s complex of at least 16 rock-cut reservoirs hold when full?',
    options: [
      'About 1,000 cubic meters',
      'Over 250,000 cubic meters',
      '50,000 liters',
      'Only enough for 3 days of supply'
    ],
    correctIndex: 1,
    explanation: 'Archaeologists estimate the total capacity of Dholavira\'s interconnected reservoir system at 250,000 to 300,000 m³—sufficient to support 15,000 to 20,000 people through multi-year droughts.',
    sourceReference: 'Singh et al. (2020); Agrawal & Kharakwal (2002)'
  }
];
