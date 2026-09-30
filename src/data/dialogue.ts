import { DialogueNode } from '../types/game';

export const DIALOGUES: Record<string, DialogueNode[]> = {
  intro_briefing: [
    {
      id: 'd1',
      speaker: {
        name: 'Dr. R.S. Rao',
        role: 'Field Director & Archaeologist',
        avatarColor: '#c97a3e',
        avatarSvgType: 'archaeologist'
      },
      text: 'Welcome to the salt flats of Khadir Bet, Investigator. Before you lies Dholavira—one of the grandest urban centers of the Mature Indus Civilization.'
    },
    {
      id: 'd2',
      speaker: {
        name: 'Meera',
        role: 'Field Research Assistant',
        avatarColor: '#38bdf8',
        avatarSvgType: 'assistant'
      },
      text: 'Annual rainfall here rarely exceeds 300 millimeters, yet this city sustained over 15,000 souls for seven centuries. Their secret was engineering, not miracles.'
    },
    {
      id: 'd3',
      speaker: {
        name: 'Dr. R.S. Rao',
        role: 'Field Director & Archaeologist',
        avatarColor: '#c97a3e',
        avatarSvgType: 'archaeologist'
      },
      text: 'Your mission is not to memorize facts, but to think like an archaeologist: examine raw physical evidence, deduce functional relationships, and reconstruct their ancient technological systems.'
    }
  ],

  m1_start: [
    {
      id: 'm1_d1',
      speaker: {
        name: 'Meera',
        role: 'Field Research Assistant',
        avatarColor: '#38bdf8',
        avatarSvgType: 'assistant'
      },
      text: 'We are standing by the massive Eastern Reservoir. The monsoon runoff from the Manhar nullah once flowed through here, but the exact channel sequence is disrupted.'
    },
    {
      id: 'm1_d2',
      speaker: {
        name: 'Dr. R.S. Rao',
        role: 'Field Director & Archaeologist',
        avatarColor: '#c97a3e',
        avatarSvgType: 'archaeologist'
      },
      text: 'Inspect the archaeological features across this sector. When you collect enough verified evidence, open your Evidence Board and reconstruct the flow sequence.'
    }
  ],

  m1_completed: [
    {
      id: 'm1_c1',
      speaker: {
        name: 'Dr. R.S. Rao',
        role: 'Field Director & Archaeologist',
        avatarColor: '#c97a3e',
        avatarSvgType: 'archaeologist'
      },
      text: 'Superb deduction! Your reconstructed flow mirrors the empirical hydraulic layout documented in archaeological excavation reports.'
    },
    {
      id: 'm1_c2',
      speaker: {
        name: 'Meera',
        role: 'Field Research Assistant',
        avatarColor: '#38bdf8',
        avatarSvgType: 'assistant'
      },
      text: 'By interposing the siltation chamber before the primary rock-cut reservoir, you prevented sediment from filling the tanks. Knowledge Card #01 has been added to your Archive!'
    }
  ],

  m2_start: [
    {
      id: 'm2_d1',
      speaker: {
        name: 'Shridhar',
        role: 'Harappan Lapidary Craftsman (Reconstruction)',
        avatarColor: '#f59e0b',
        avatarSvgType: 'artisan'
      },
      text: 'Greetings, traveler. Traders from across the western ocean demand our red carnelian barrel beads. But raw quartz stone is obstinate and fractures easily under brute force.'
    },
    {
      id: 'm2_d2',
      speaker: {
        name: 'Meera',
        role: 'Field Research Assistant',
        avatarColor: '#38bdf8',
        avatarSvgType: 'assistant'
      },
      text: 'Examine the workshop floor debitage. Notice the burned clay vessels, the unbored beads, and the tiny stone drill fragments.'
    }
  ],

  m2_completed: [
    {
      id: 'm2_c1',
      speaker: {
        name: 'Dr. R.S. Rao',
        role: 'Field Director & Archaeologist',
        avatarColor: '#c97a3e',
        avatarSvgType: 'archaeologist'
      },
      text: 'Astonishing work. You successfully identified the Ernestite micro-drill bit. Bronze tools simply lacked the hardness to pierce quartz beads without modern diamond abrasives.'
    }
  ]
};
