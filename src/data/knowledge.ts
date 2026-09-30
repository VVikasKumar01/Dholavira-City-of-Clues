import { KnowledgeCard } from '../types/game';

export const KNOWLEDGE_DATABASE: Record<string, KnowledgeCard> = {
  k_water_engineering: {
    id: 'k_water_engineering',
    title: 'Ancient Water Engineering & Hydraulic Network',
    category: 'Water Management',
    summary: 'How Dholavira thrived in an arid saline desert through sophisticated rainwater harvesting, cascading check-dams, desilting basins, and massive rock-hewn reservoirs.',
    keyConcept: 'Closed-loop, gravity-fed storm runoff harvesting with sediment filtration and inter-reservoir cascading storage.',
    archaeologicalEvidence: 'Remains of at least 16 peripheral and internal stone-hewn reservoirs, masonry dams on the Manhar and Mansar torrents, stone desilting chambers, and stone-cut sluices capable of holding over 250,000 m³ of fresh water.',
    sourceCitation: 'Singh et al. (2020), "Hydrology and water resources management in ancient India", Journal of Hydrology / Bisht, R.S. (2015), "Dholavira: Excavations at a Harappan City"',
    missionOrigin: 'Mission 1: Restore the Water System',
    imageAlt: 'Archaeological cross-section of Dholavira rock-cut reservoir and feeder sluices',
    unlocked: false,
    fullText: [
      'Dholavira is located on Khadir Bet, an isolated island in the Great Rann of Kutch (Gujarat). The surrounding area is salty desert with sparse, erratic rainfall averaging less than 300 mm annually.',
      'Instead of succumbing to water scarcity, Harappan hydraulic engineers transformed seasonal flash floods into an enduring lifeline. They built stone dams across two seasonal streams flanking the settlement—the Manhar to the north and the Mansar to the south.',
      'Water was diverted through rock-cut channels equipped with sedimentation basins that allowed dense sand and gravel to settle before water entered the pristine storage reservoirs.',
      'The eastern reservoir alone measured over 73 meters long and nearly 10 meters deep, with stepped terraces providing continuous safe access as the water level dropped across dry months.',
      'System reconstruction note: In archaeological serious games, schematic flow diagrams abstract the complex multi-tiered topography into foundational engineering logic: Source → Diversion Bund → Silt Trap → Intermediate Channel → Rock Storage → Controlled Sluice.'
    ]
  },
  k_bead_technology: {
    id: 'k_bead_technology',
    title: 'Harappan Stone Bead Drilling & Pyrotechnology',
    category: 'Craft & Technology',
    summary: 'The discovery of constricted micro-drills made of "Ernestite" metamorphic rock, allowing ancient artisans to bore ultra-long carnelian beads exported across Mesopotamia.',
    keyConcept: 'Thermal oxidation of chalcedony followed by high-speed bow-drill perforation using specialized micro-crystalline stone bits.',
    archaeologicalEvidence: 'Workshop debitage containing thousands of broken bead blanks, pottery firing canisters, talc/steatite bearing capstones, and hundreds of hard constricted drill bits made of fine-grained chert/metamorphic stone.',
    sourceCitation: 'Prabhakar, V.N. (2016), "An Overview of the Stone Bead Drilling Technology in South Asia from Earliest Times to Harappans", Heritage: Journal of Multidisciplinary Studies in Archaeology',
    missionOrigin: 'Mission 2: The Artisan\'s Challenge',
    imageAlt: 'Micro-drill bits and biconically perforated Harappan carnelian beads',
    unlocked: false,
    fullText: [
      'One of the most prized luxury exports of the Indus Valley Civilization was the long barrel-cylinder carnelian bead, worn by royalty from Harappa and Mohenjo-daro to the Royal Tombs of Ur in Sumer (modern Iraq).',
      'Carnelian is a form of microcrystalline quartz with a Mohs hardness of nearly 7. Bronze and copper tools cannot penetrate it effectively. For decades, archaeologists wondered how Bronze Age craftsmen bored straight holes through beads exceeding 10 cm in length.',
      'Excavations at Dholavira, Chanhudaro, and Lothal resolved this mystery with the discovery of specialized micro-drills made from an exceptionally hard metamorphic stone known archaeologically as "Ernestite".',
      'The drilling was biconical—pecking from one end to the center, then flipping the bead to drill from the opposite side until the holes met with sub-millimeter precision. Lubricated by water and fine slurry, a single bead could take dozens of hours of patient craft.',
      'Thermal pyrotechnology was equally crucial: heating yellowish chalcedony nodules in specialized clay canisters oxidized the trace iron minerals within the stone, creating the brilliant red-orange luster prized by trade caravans.'
    ]
  },
  k_urban_planning: {
    id: 'k_urban_planning',
    title: 'Tripartite Urban Planning & Fortifications',
    category: 'Urban Planning',
    summary: 'The unique geometric division of Dholavira into Castle/Citadel, Middle Town, and Lower Town, enclosed within monumental stone masonry walls.',
    keyConcept: 'Hierarchical yet functionally integrated urban zoning with standardized proportions, modular streets, and advanced civic sanitation.',
    archaeologicalEvidence: 'Excavated tripartite city plan with massive stone-faced ramparts, ceremonial grounds/stadium, modular residential blocks, and stone pillar drums.',
    sourceCitation: 'Bisht, R.S. (1999), "Dholavira and Banawali: Two different explorations", Man and Environment / Possehl, G.L. (2002), "The Indus Civilization"',
    missionOrigin: 'Field Archive',
    imageAlt: 'Dholavira tripartite city layout and ceremonial ground',
    unlocked: true,
    fullText: [
      'Unlike most other Indus settlements divided simply into an Upper and Lower Town, Dholavira possessed an elaborate tripartite layout comprising the Citadel (Castle + Bailey), the Middle Town, and the Lower Town.',
      'Between the Citadel and the Middle Town lies a vast open space measuring 283 meters long and 47 meters wide, identified by archaeologists as a ceremonial ground or multi-purpose stadium with stepped spectator terraces.',
      'The monumental architecture extensively used dressed and polished stone blocks instead of just kiln-baked bricks, reflecting the rich local geological resources of Khadir Bet island.',
      'Civic sanitation featured underground drains covered with stone slabs that could be lifted for regular maintenance—evidence of centralized municipal planning over 4,500 years ago.'
    ]
  },
  k_signboard_script: {
    id: 'k_signboard_script',
    title: 'The Dholavira Signboard & Indus Script',
    category: 'Archaeological Evidence',
    summary: 'A monumental ten-character inscription made of white gypsum paste tiles, originally mounted over the northern gateway of the Citadel.',
    keyConcept: 'Public civic signage and symbolic communication in the undeciphered Indus script.',
    archaeologicalEvidence: 'Ten large Indus signs (each ~37 cm tall) inlaid with crystalline gypsum paste, recovered from the floor of the northern gateway chamber where the wooden board had rotted away.',
    sourceCitation: 'Parpola, A. (1994), "Deciphering the Indus Script", Cambridge University Press / Kenoyer, J.M. (1998)',
    missionOrigin: 'Field Archive',
    imageAlt: 'The ten gypsum characters of the Dholavira wooden signboard',
    unlocked: true,
    fullText: [
      'In 1990, archaeologists led by Dr. R.S. Bisht uncovered one of the most astonishing epigraphic finds in South Asian archaeology: the "Dholavira Signboard".',
      'The sign consisted of ten large Indus characters, each approximately 37 cm high and 25 to 27 cm wide, meticulously crafted from white crystalline gypsum paste inlaid into a wooden board about 3 meters long.',
      'The wooden board eventually rotted away, but the durable gypsum inlays remained in their exact original sequence on the stone floor of the gateway chamber.',
      'While the Indus script remains undeciphered, the colossal size and prominent public placement above the northern gateway indicate it served as an official civic proclamation, royal title, or city emblem.'
    ]
  }
};
