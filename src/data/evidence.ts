import { EvidenceItem } from '../types/game';

export const EVIDENCE_DATABASE: Record<string, EvidenceItem> = {
  // Mission 1: Water System Evidence
  m1_stream_bund: {
    id: 'm1_stream_bund',
    title: 'Manhar Seasonal Stream Bund',
    category: 'Water Management',
    location: 'Northern Perimeter Dam, Dholavira',
    description: 'A massive dressed-stone check-dam built across the seasonal Manhar nullah (stream) to impound monsoon flash floods.',
    archaeologicalNotes: 'Dholavira is situated between two seasonal monsoon torrents: the Mansar in the south and the Manhar in the north. The Harappans constructed heavy stone-faced bunds to trap intermittent storm runoff.',
    source: 'Singh et al., 2020; Bisht, R.S., 2015',
    missionId: 'mission_1_water',
    verified: true,
    details: {
      material: 'Limestone masonry with mud mortar & stone packing',
      period: 'Mature Harappan (c. 2600–1900 BCE)',
      excavationContext: 'Outer fortifications and feeder bunds',
      significance: 'Primary collection point before water entered the city channels.'
    }
  },
  m1_silt_chamber: {
    id: 'm1_silt_chamber',
    title: 'Inlet Siltation Basin',
    category: 'Water Management',
    location: 'Eastern Reservoir Feeder Sluice',
    description: 'A specialized stone-lined settling basin positioned along the feeder channel before water enters the primary reservoir.',
    archaeologicalNotes: 'Storm runoff in arid Kutch carried massive amounts of sediment and coarse sand. Archaeological excavations identified settling chambers designed to let heavy silt drop out before clean water passed onward.',
    source: 'Singh et al., 2020; Agrawal & Kharakwal, 2002',
    missionId: 'mission_1_water',
    verified: true,
    details: {
      material: 'Cut stone blocks with clay sealant',
      period: 'Mature Harappan',
      excavationContext: 'Eastern water inlet conduit',
      significance: 'Prevents reservoir sedimentation and ensures water clarity.'
    }
  },
  m1_masonry_channel: {
    id: 'm1_masonry_channel',
    title: 'Cut-Stone Inlet Channel',
    category: 'Water Management',
    location: 'Intermediate Conduit between Bund and Citadel Reservoirs',
    description: 'Covered masonry conduits with gentle slopes linking peripheral catchments directly into inner urban tanks.',
    archaeologicalNotes: 'Excavations revealed subterranean drains and rock-cut channels equipped with stone slabs to reduce evaporation in the intense Kutch desert sun.',
    source: 'Bisht, R.S., 1999; Singh et al., 2020',
    missionId: 'mission_1_water',
    verified: true,
    details: {
      material: 'Sandstone blocks with grooved interlocking joints',
      period: 'Mature Harappan (Stage IV)',
      excavationContext: 'Between castle wall and eastern reservoir',
      significance: 'Maintains controlled gradient to avoid erosive velocity.'
    }
  },
  m1_rock_cut_reservoir: {
    id: 'm1_rock_cut_reservoir',
    title: 'Eastern Rock-Cut Reservoir',
    category: 'Water Management',
    location: 'Eastern Citadel Annexe, Dholavira',
    description: 'Enormous stone-cut reservoir measuring 73.4 m × 29.3 m, carved directly into bedrock with flight of steps leading to the bottom.',
    archaeologicalNotes: 'At least 16 reservoirs surrounded Dholavira, collectively capable of storing an estimated 250,000 to 300,000 cubic meters of water, sustaining an estimated urban population of 15,000–20,000 through droughts.',
    source: 'Singh et al., 2020; Bisht, R.S., 2015',
    missionId: 'mission_1_water',
    verified: true,
    details: {
      material: 'Excavated sedimentary bedrock lined with dressed stone',
      period: 'Mature Harappan',
      excavationContext: 'Eastern reservoir complex',
      significance: 'Central civic reserve for dry-season survival.'
    }
  },
  m1_sluice_steps: {
    id: 'm1_sluice_steps',
    title: 'Controlled Sluice & Stepwell Access',
    category: 'Water Management',
    location: 'Southern Reservoir Terrace',
    description: 'Stone flight of steps with vertical grooves indicative of wooden sluice boards used to regulate outflow into secondary community tanks.',
    archaeologicalNotes: 'Grooves cut in stone pillars flanking the outlet show that Harappan engineers could insert movable sluice gates to apportion water during restricted months.',
    source: 'Singh et al., 2020; Jansen, M., 1993',
    missionId: 'mission_1_water',
    verified: true,
    details: {
      material: 'Carved sandstone pillar sockets and steps',
      period: 'Mature Harappan',
      excavationContext: 'Southern spillway and access ramp',
      significance: 'Democratized public drawing access and emergency flood overflow.'
    }
  },
  m1_overflow_drain: {
    id: 'm1_overflow_drain',
    title: 'Secondary Spillway Overflow Drain',
    category: 'Water Management',
    location: 'South-Western Defensive Flank',
    description: 'Cascading drainage overflow that directed excess water from higher reservoirs into lower tier reservoirs to prevent embankment collapse.',
    archaeologicalNotes: 'Dholavira featured an interconnected cascading reservoir system: when an upper tank filled to capacity, excess water automatically spilled into the next lower reservoir.',
    source: 'Singh et al., 2020',
    missionId: 'mission_1_water',
    verified: true,
    details: {
      material: 'Stepped masonry spillway',
      period: 'Mature Harappan',
      excavationContext: 'Terrace between Bailey and Middle Town',
      significance: 'Inter-reservoir cascade preventing flash flood structural failure.'
    }
  },

  // Mission 2: Bead Workshop & Micro-Drilling Evidence
  m2_raw_carnelian: {
    id: 'm2_raw_carnelian',
    title: 'Raw Carnelian Nodules & Heating Hearth',
    category: 'Craft & Technology',
    location: 'Southern Bailey Craft Quarter',
    description: 'Pebbles of rough chalcedony and carnelian found adjacent to pottery kiln hearths used for thermal transformation.',
    archaeologicalNotes: 'Harappan artisans sourced raw agate/carnelian from quarries in Gujarat (such as Ratanpur/Rajpipla). Heating in specialized ceramic pots turned dull yellowish chalcedony into rich fiery red carnelian.',
    source: 'Prabhakar, 2016; Kenoyer, 1998',
    missionId: 'mission_2_artisan',
    verified: true,
    details: {
      material: 'Microcrystalline quartz / carnelian / iron oxides',
      period: 'Mature Harappan',
      excavationContext: 'Craft workshop floor debitage',
      significance: 'Thermal oxidation to achieve desired red-orange color.'
    }
  },
  m2_ernestite_drill: {
    id: 'm2_ernestite_drill',
    title: 'Constricted Micro-Drill Bits ("Ernestite")',
    category: 'Craft & Technology',
    location: 'Artisan Workshop Floor, Stratum IV',
    description: 'Fine, dark, extremely hard stone drill bits with a distinctive constricted neck, manufactured from fine-grained metamorphic rock.',
    archaeologicalNotes: 'Termed "Ernestite" (named after Ernest Mackay by J.M. Kenoyer), this extremely hard silica-rich metamorphic rock (Mohs hardness ~7.5) could drill through hard carnelian where bronze or copper tools quickly dull.',
    source: 'Prabhakar, 2016; Kenoyer & Vidale, 1992',
    missionId: 'mission_2_artisan',
    verified: true,
    details: {
      material: 'Phyllitic silicious metamorphic stone ("Ernestite")',
      period: 'Mature Harappan',
      excavationContext: 'Workshop refuse alongside broken drill heads',
      significance: 'Technological leap enabling drilling of ultra-hard gemstones.'
    }
  },
  m2_bow_drill: {
    id: 'm2_bow_drill',
    title: 'Bow-Drill Mechanics & Steatite Capstone',
    category: 'Craft & Technology',
    location: 'Craft Workshop Bench',
    description: 'Smooth steatite bearing-cap with center depression used to apply downward palm pressure on a spinning wooden drill shaft.',
    archaeologicalNotes: 'By wrapping a bowstring around the wooden spindle, ancient craftsmen achieved continuous high-speed rotational friction while water and fine abrasive grit lubricated the drill bit.',
    source: 'Prabhakar, 2016; Kenoyer, 2003',
    missionId: 'mission_2_artisan',
    verified: true,
    details: {
      material: 'Talc/Steatite socket capstone & wooden bow reconstruction',
      period: 'Mature Harappan',
      excavationContext: 'Artisan tool cache',
      significance: 'High RPM rotational drilling with minimal wobble.'
    }
  },
  m2_finished_beads: {
    id: 'm2_finished_beads',
    title: 'Long Barrel-Cylinder Carnelian Beads',
    category: 'Craft & Technology',
    location: 'High-Status Citadel Hoard',
    description: 'Exquisitely polished, up to 12-cm long biconically drilled beads exported across ancient maritime routes to Mesopotamia.',
    archaeologicalNotes: 'Drilling a single long carnelian barrel bead required over 20–30 hours of continuous skilled micro-drilling from both ends until the holes met in the center without cracking the stone.',
    source: 'Prabhakar, 2016; Possehl, 2002',
    missionId: 'mission_2_artisan',
    verified: true,
    details: {
      material: 'Fine-polished red carnelian with biconical perforation',
      period: 'Mature Harappan',
      excavationContext: 'Export trading cache & luxury hoard',
      significance: 'Hallmark of Indus lapidary mastery and international trade.'
    }
  }
};
