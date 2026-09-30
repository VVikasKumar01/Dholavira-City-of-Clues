import { Mission, MapLocation } from '../types/game';

export const MAP_LOCATIONS: MapLocation[] = [
  {
    id: 'loc_reservoir',
    name: 'Reservoir & Bund Complex',
    tagline: 'Hydraulic Engineering Hub',
    description: 'Immense stone reservoirs and storm-water catchments engineered to harvest fleeting monsoon rains.',
    coordinates: { x: 38, y: 32 },
    status: 'available',
    missionId: 'mission_1_water',
    icon: 'droplets'
  },
  {
    id: 'loc_workshop',
    name: 'Artisan Bead Workshop',
    tagline: 'High-Precision Lapidary Quarter',
    description: 'Archaeological remains of bead drillers, firing hearths, and luxury gemstone export craft.',
    coordinates: { x: 62, y: 64 },
    status: 'locked',
    missionId: 'mission_2_artisan',
    icon: 'gem'
  },
  {
    id: 'loc_citadel',
    name: 'Citadel & Castle Enclosure',
    tagline: 'Monumental Fortified Acropolis',
    description: 'Massive stone-faced defensive walls, polished stone pillars, and administrative gateways.',
    coordinates: { x: 48, y: 48 },
    status: 'locked',
    icon: 'shield'
  },
  {
    id: 'loc_residential',
    name: 'Middle & Lower Town',
    tagline: 'Planned Residential Quarters',
    description: 'Grid-patterned thoroughfares, soak-jars, drain inlets, and multi-room modular housing.',
    coordinates: { x: 74, y: 36 },
    status: 'locked',
    icon: 'home'
  },
  {
    id: 'loc_archive',
    name: 'Archaeological Evidence Archive',
    tagline: 'Field Museum & Research Repository',
    description: 'The master archive storing all documented artifacts, field notes, and published academic citations.',
    coordinates: { x: 22, y: 72 },
    status: 'available',
    icon: 'book-open'
  }
];

export const MISSIONS_DATABASE: Record<string, Mission> = {
  mission_1_water: {
    id: 'mission_1_water',
    number: 1,
    title: 'RESTORE THE WATER SYSTEM',
    subtitle: 'Reconstruct Dholavira\'s Hydraulic Network',
    theme: 'Hydrology & Civil Engineering',
    objective: 'Investigate the archaeological evidence and reconstruct how the water system functioned.',
    story: 'The island of Khadir Bet experiences harsh semi-arid droughts punctuated by violent monsoon rains. Ancient Dholavira survived and flourished here for centuries. Several archaeological clues have been recovered around the reservoirs and perimeter dams. Examine the field evidence, understand the functional requirements, and reconstruct the hydraulic flow sequence.',
    locationId: 'loc_reservoir',
    status: 'available',
    requiredEvidenceIds: [
      'm1_stream_bund',
      'm1_silt_chamber',
      'm1_masonry_channel',
      'm1_rock_cut_reservoir',
      'm1_sluice_steps'
    ],
    totalEvidenceCount: 6,
    unlockedKnowledgeId: 'k_water_engineering',
    hints: [
      'Level 1: Consider where water originates in the arid landscape and where it must arrive before public use.',
      'Level 2: Untreated monsoon torrents carry heavy gravel and mud that would rapidly choke deep reservoirs if not intercepted early.',
      'Level 3: The correct sequence flows from Natural Stream Bund → Desilting Basin → Inlet Channel → Rock-Cut Reservoir → Public Sluice & Steps.'
    ]
  },
  mission_2_artisan: {
    id: 'mission_2_artisan',
    number: 2,
    title: 'THE ARTISAN\'S CHALLENGE',
    subtitle: 'Harappan Bead & Micro-Drilling Mastery',
    theme: 'Material Science & Lapidary Craft',
    objective: 'Identify raw gemstone materials, select the proper micro-drill tool, and reconstruct the ancient biconical drilling technique.',
    story: 'Harappan carnelian beads were prized throughout the ancient Near East, found even in the Royal Cemetery of Ur in Mesopotamia. How did ancient artisans drill precise, hairline holes through quartz pebbles that resist steel? Examine the workshop remains, select the historically accurate tool, and complete the drilling sequence.',
    locationId: 'loc_workshop',
    status: 'locked',
    requiredEvidenceIds: [
      'm2_raw_carnelian',
      'm2_ernestite_drill',
      'm2_bow_drill',
      'm2_finished_beads'
    ],
    totalEvidenceCount: 4,
    unlockedKnowledgeId: 'k_bead_technology',
    hints: [
      'Level 1: Carnelian is a crystalline gemstone with high hardness (Mohs 7). Copper or soft bronze will merely warp without penetrating.',
      'Level 2: Look for the specialized dark constricted micro-drill made of metamorphic silica stone discovered in Harappan workshop layers.',
      'Level 3: The process requires: 1) Firing raw stone in kiln, 2) Shaping/flaking blank, 3) Selecting the Ernestite drill bit with bow assembly, 4) Controlled rotational drilling from both ends.'
    ]
  }
};
