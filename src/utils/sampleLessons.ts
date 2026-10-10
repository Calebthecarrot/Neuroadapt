import { LessonContent } from '../types';

export const SAMPLE_LESSONS: LessonContent[] = [
  {
    id: 'adhd_dopamine',
    topic: 'How the ADHD Brain & Dopamine Work',
    summary: 'Discover why your brain craves novel stimulation, how dopamine receptors regulate motivation, and how to harness your hyperfocus superpower.',
    tags: ['Neuroscience', 'ADHD Superpower', 'Habits'],
    estimatedMinutes: 4,
    audioFormat: {
      audioOverview: 'A lively 3-minute conversational audio guide explaining dopamine loops, executive function, and the hyperfocus ignition switch.',
      scriptNarrative: `Hey friend! Have you ever wondered why you can spend six hours non-stop building a complex Lego castle or coding a game, but writing a single paragraph of an essay feels physically painful?
      
Here is the neuroscience secret: it is not a lack of willpower. It is Dopamine regulation. 

Think of dopamine as your brain's motivational currency. In a neurotypical brain, small routine tasks dispense steady drops of dopamine like a leaky faucet. But in an ADHD brain, the dopamine receptors have fewer open doors and clear dopamine out way too fast. 

Your brain is in a perpetual state of hunger for stimulation. When something is novel, urgent, interesting, or physically challenging, your brain floods with dopamine—triggering Hyperfocus, where your creativity and problem-solving leave everyone else in the dust!`,
      keyTakeaways: [
        'ADHD is not a deficit of attention; it is a difficulty regulating where attention goes.',
        'Dopamine clears out too fast in ADHD brains, creating a drive for novelty and high-stimulus tasks.',
        'Micro-rewards and gamification supply the exact dopamine drops your prefrontal cortex needs to focus.'
      ],
      chunks: [
        {
          title: '1. The Dopamine Economy',
          text: 'Dopamine is your brain’s chemical reward ticket. Routine chores produce zero dopamine, which feels like pushing a boulder up a hill.',
          emphasis: 'Not laziness — a chemical regulation difference.',
          durationSeconds: 35
        },
        {
          title: '2. The Hyperfocus Paradox',
          text: 'When high interest or urgency occurs, dopamine floods the frontal lobe, enabling legendary focus that outlasts anyone.',
          emphasis: 'Your secret superpower when unlocked correctly.',
          durationSeconds: 42
        },
        {
          title: '3. Hacking the Reward Engine',
          text: 'By breaking daunting tasks into 2-minute micro-goals with tactile rewards, you trigger steady dopamine drops that keep you in flow.',
          emphasis: 'Micro-steps equal massive momentum.',
          durationSeconds: 38
        }
      ]
    },
    visualFormat: {
      plainText: 'Dopamine is a key neurotransmitter that transmits signals between nerve cells. In brains with ADHD, dopamine transporters work faster, reducing the baseline concentration of dopamine available in synapses. As a result, the prefrontal cortex—which governs executive functions like task prioritization and impulse resistance—requires stronger stimulation to activate.',
      bionicStory: 'Dopamine is a key neurotransmitter that transmits signals between nerve cells. In brains with ADHD, dopamine transporters work faster, reducing the baseline concentration of dopamine available in synapses. As a result, the prefrontal cortex—which governs executive functions like task prioritization and impulse resistance—requires stronger stimulation to activate.',
      cards: [
        {
          title: 'The Synaptic Faucet',
          description: 'Dopamine gets reabsorbed too quickly before it can lock into receptor keys, making routine tasks feel exhausting.',
          mnemonic: 'Empty Fuel Tank = Need High-Octane Novelty',
          accentColor: '#3b82f6',
          iconName: 'Brain'
        },
        {
          title: 'The Prefrontal Cortex',
          description: 'The brain conductor that plans, organizes, and filters out background noise. It turns on when stimulated.',
          mnemonic: 'Conductor needs music to stay awake',
          accentColor: '#ec4899',
          iconName: 'Sparkles'
        },
        {
          title: 'Hyperfocus Ignition',
          description: 'High interest unlocks intense creative concentration. When engaged, ADHD learners solve problems 3x faster.',
          mnemonic: 'Rocket engine needing a launch spark',
          accentColor: '#10b981',
          iconName: 'Zap'
        }
      ],
      mindMap: {
        centralConcept: 'ADHD Dopamine Cycle',
        branches: [
          {
            title: 'Baseline State',
            detail: 'Low resting dopamine',
            children: ['Restlessness', 'Novelty seeking', 'Time blindness']
          },
          {
            title: 'Triggers that Activate',
            detail: 'High emotional or sensory stimuli',
            children: ['Urgency (Deadlines)', 'Passionate Interest', 'Physical Movement']
          },
          {
            title: 'Supportive Tools',
            detail: 'External scaffolding for flow',
            children: ['Brown noise audio', 'Visual timers', 'Tactile fidgeting']
          }
        ]
      },
      takeawayBulletPoints: [
        'Low baseline dopamine causes restlessness and distraction.',
        'Urgency and novelty instantly ignite executive function.',
        'Tactile and visual scaffolds bypass the willpower drain.'
      ]
    },
    interactiveFormat: {
      quickGoal: 'Score 150 Dopamine XP by sorting the brain hacks and testing your recall!',
      challenges: [
        {
          id: 'c1',
          question: 'Why do boring routine tasks feel physically exhausting to an ADHD brain?',
          type: 'multiple_choice',
          options: [
            'Because the muscles in the prefrontal cortex are weaker',
            'Because baseline dopamine is lower, so tasks produce zero neurochemical reward',
            'Because ADHD learners lack long-term memory capacity',
            'Because of excessive caffeine intake'
          ],
          correctIndex: 1,
          explanation: 'Exactly! Without sufficient dopamine drops, the prefrontal cortex struggles to engage executive function.',
          dopaminePraise: 'Boom! +50 XP ⚡ Instant Dopamine Shot!'
        },
        {
          id: 'c2',
          question: 'True or False: Hyperfocus proves that someone with ADHD can easily concentrate anytime they choose.',
          type: 'true_false',
          options: [
            'True — they just need more discipline',
            'False — hyperfocus is an involuntary state ignited only by high-stimulation or deep interest'
          ],
          correctIndex: 1,
          explanation: 'Correct! Hyperfocus is not volitional discipline; it is an involuntary state activated by high interest or urgency.',
          dopaminePraise: 'Spot on! You nailed the core myth! +50 XP 🎯'
        },
        {
          id: 'c3',
          question: 'Which tool provides an external auditory scaffold to calm ADHD mind-wandering?',
          type: 'multiple_choice',
          options: [
            'Loud dance pop with unpredictable lyrics',
            'Complete silence in an empty echoing room',
            'Continuous low-frequency Brown Noise or Binaural rhythm',
            'Multiple podcasts playing simultaneously'
          ],
          correctIndex: 2,
          explanation: 'Brown noise provides continuous sonic damping that masks micro-distractions and settles restless brain frequencies.',
          dopaminePraise: 'Genius! Sensory mastery achieved! +50 XP 🏆'
        }
      ],
      fidgetPrompt: 'Feeling restless? Tap the haptic fidget pad below to release motor tension while reviewing.'
    }
  },
  {
    id: 'photosynthesis',
    topic: 'Photosynthesis: How Plants Eat Sunshine',
    summary: 'A visual and sensory journey through chloroplast solar panels, splitting water molecules, and generating Earth’s oxygen.',
    tags: ['Biology', 'Visual Thinking', 'Ecology'],
    estimatedMinutes: 3,
    audioFormat: {
      audioOverview: 'A relaxing narrative taking you inside a green leaf to hear the humming solar machinery at work.',
      scriptNarrative: `Imagine if every morning, you could step outside into the sunlight, take a deep breath of fresh air, drink a cup of water, and instantly be full! 

That is exactly what a plant does through Photosynthesis. 

Deep inside every green leaf are microscopic cellular factories called Chloroplasts. Inside them sits a vibrant green pigment called Chlorophyll. Think of chlorophyll as tiny solar panels. 

When sunlight photons strike these solar panels, they supercharge electrons with raw energy. The plant uses this electrical charge to break apart water molecules absorbed through its roots, releasing Oxygen for us to breathe, and converting Carbon Dioxide into sweet, energy-rich glucose sugar.`,
      keyTakeaways: [
        'Photosynthesis converts light energy into chemical fuel (sugar).',
        'Chloroplasts act as cellular solar collectors.',
        'Water + Carbon Dioxide + Sunlight = Glucose + Oxygen.'
      ],
      chunks: [
        {
          title: '1. The Solar Panels',
          text: 'Chlorophyll molecules capture green-spectrum reflecting sunlight, soaking up blue and red photon energy.',
          emphasis: 'Nature’s most efficient solar grid.',
          durationSeconds: 30
        },
        {
          title: '2. The Water Split',
          text: 'Light energy splits water (H2O) apart. The hydrogen is kept for fuel; pure oxygen (O2) is exhaled into the atmosphere.',
          emphasis: 'The breath of life for Earth.',
          durationSeconds: 34
        },
        {
          title: '3. Baking Glucose Sugar',
          text: 'Carbon dioxide from the air is woven with hydrogen to produce glucose—storable plant food that powers life on our planet.',
          emphasis: 'Sunlight converted into edible energy.',
          durationSeconds: 32
        }
      ]
    },
    visualFormat: {
      plainText: 'Photosynthesis is the biochemical process by which photoautotrophic organisms convert light energy into chemical energy stored in carbohydrate bonds. The light-dependent reactions occur within the thylakoid membrane, generating ATP and NADPH, while the Calvin Cycle fixes inorganic carbon dioxide into organic sugars.',
      bionicStory: 'Photosynthesis is the biochemical process by which photoautotrophic organisms convert light energy into chemical energy stored in carbohydrate bonds. The light-dependent reactions occur within the thylakoid membrane, generating ATP and NADPH, while the Calvin Cycle fixes inorganic carbon dioxide into organic sugars.',
      cards: [
        {
          title: 'Input: Sunlight + H2O + CO2',
          description: 'Three simple ingredients taken from the sky, soil, and air.',
          mnemonic: 'Sun + Drink + Breath = Food',
          accentColor: '#eab308',
          iconName: 'Sun'
        },
        {
          title: 'Engine: Chloroplasts',
          description: 'The green powerplants that hold thylakoid solar coin stacks.',
          mnemonic: 'Green coin stacks capturing photons',
          accentColor: '#22c55e',
          iconName: 'Leaf'
        },
        {
          title: 'Output: Oxygen + Sugar',
          description: 'Delicious energy for the plant and fresh breathable air for all living creatures.',
          mnemonic: 'Clean air to breathe, sweet energy to grow',
          accentColor: '#06b6d4',
          iconName: 'Wind'
        }
      ],
      mindMap: {
        centralConcept: 'Photosynthesis Engine',
        branches: [
          {
            title: 'Inputs',
            detail: 'What goes in',
            children: ['Photons (Sunlight)', 'Water from soil (H2O)', 'Carbon Dioxide (CO2)']
          },
          {
            title: 'Factory',
            detail: 'Where it happens',
            children: ['Chloroplast organelle', 'Thylakoid membranes', 'Chlorophyll pigment']
          },
          {
            title: 'Gifts to Earth',
            detail: 'What comes out',
            children: ['Glucose (Plant energy)', 'Oxygen (O2 for animals)']
          }
        ]
      },
      takeawayBulletPoints: [
        'Leaves act as solar panels absorbing photon energy.',
        'Water molecules are split to release pure oxygen.',
        'Glucose stores the energy for the entire food chain.'
      ]
    },
    interactiveFormat: {
      quickGoal: 'Test your understanding of the solar engine and earn 150 XP!',
      challenges: [
        {
          id: 'p1',
          question: 'What essential gas do plants release as a byproduct of splitting water molecules?',
          type: 'multiple_choice',
          options: [
            'Carbon Monoxide',
            'Oxygen (O2)',
            'Helium',
            'Nitrogen'
          ],
          correctIndex: 1,
          explanation: 'Yes! Plants exhale oxygen, which all animals and humans rely on to breathe.',
          dopaminePraise: 'Brilliant! +50 XP 🌿 Oxygen Master!'
        },
        {
          id: 'p2',
          question: 'What is the green pigment inside plant cells that catches sunlight like a solar panel?',
          type: 'multiple_choice',
          options: [
            'Hemoglobin',
            'Melanin',
            'Chlorophyll',
            'Keratin'
          ],
          correctIndex: 2,
          explanation: 'Spot on! Chlorophyll gives plants their green hue and absorbs red and blue light wavelengths.',
          dopaminePraise: 'You got it! Solar genius unlocked! +50 XP ☀️'
        },
        {
          id: 'p3',
          question: 'True or False: Plants need darkness too—some sugar building reactions occur without direct sunlight.',
          type: 'true_false',
          options: [
            'True — the Calvin Cycle (light-independent phase) builds sugars without needing photons',
            'False — all plant activity completely halts the microsecond the sun sets'
          ],
          correctIndex: 0,
          explanation: 'True! The Calvin cycle continues turning carbon dioxide into glucose using stored chemical energy.',
          dopaminePraise: 'Outstanding deduction! +50 XP 🌙'
        }
      ],
      fidgetPrompt: 'Tap the leaf pulse button in rhythm to stimulate attention.'
    }
  },
  {
    id: 'black_holes',
    topic: 'Black Holes & The Warp of Spacetime',
    summary: 'A mind-bending exploration of supermassive gravity wells, time dilation, and the mysterious Event Horizon.',
    tags: ['Physics', 'Astrophysics', 'Cosmic Wonder'],
    estimatedMinutes: 5,
    audioFormat: {
      audioOverview: 'An ambient, cinematic audio journey to the edge of an event horizon where time slows to a crawl.',
      scriptNarrative: `Picture a giant stretched rubber trampoline sheet. If you place a tennis ball on it, it makes a tiny dimple. If you drop a heavy bowling ball, it creates a deep valley. 
      
Now imagine packing the mass of three entire Suns into a marble smaller than the tip of your pinky finger. 

The weight would punch an infinite puncture straight through the trampoline fabric. That is a Black Hole. 

Its gravitational pull is so ferocious that not even light—the fastest thing in the known universe—can escape. At the boundary line called the Event Horizon, the escape velocity equals the speed of light. Step one millimeter past it, and space itself cascades inward faster than light, dragging time along with it!`,
      keyTakeaways: [
        'Black holes form when massive dying stars collapse under their own gravity.',
        'The Event Horizon is the point of no return—past it, not even light escapes.',
        'Intense gravity warps time: clocks tick significantly slower near a black hole.'
      ],
      chunks: [
        {
          title: '1. The Stretched Trampoline',
          text: 'Albert Einstein showed that space and time form a flexible fabric. Extreme mass creates extreme curvature.',
          emphasis: 'Gravity is the curvature of spacetime itself.',
          durationSeconds: 36
        },
        {
          title: '2. The Event Horizon',
          text: 'The invisible boundary where space falls inward at the speed of light. Once crossed, every future direction points toward the center.',
          emphasis: 'The ultimate cosmic one-way street.',
          durationSeconds: 38
        },
        {
          title: '3. Time Dilation',
          text: 'If you hovered safely near a black hole for one hour, decades would pass back home on Earth. Gravity literally slows time.',
          emphasis: 'Time is not absolute; it bends to mass.',
          durationSeconds: 40
        }
      ]
    },
    visualFormat: {
      plainText: 'A black hole is a region of spacetime where gravity is so strong that nothing—no particles or even electromagnetic radiation such as light—can escape from it. The theory of general relativity predicts that a sufficiently compact mass can deform spacetime to form a black hole. The boundary of no return is called the event horizon.',
      bionicStory: 'A black hole is a region of spacetime where gravity is so strong that nothing—no particles or even electromagnetic radiation such as light—can escape from it. The theory of general relativity predicts that a sufficiently compact mass can deform spacetime to form a black hole. The boundary of no return is called the event horizon.',
      cards: [
        {
          title: 'Singularity',
          description: 'The zero-volume, infinite-density point at the very center where physics as we know it breaks down.',
          mnemonic: 'Infinite mass packed into zero space',
          accentColor: '#8b5cf6',
          iconName: 'CircleDot'
        },
        {
          title: 'Event Horizon',
          description: 'The black sphere of no return. The cosmic waterfall edge where light gets trapped.',
          mnemonic: 'The point of no return',
          accentColor: '#3b82f6',
          iconName: 'ShieldAlert'
        },
        {
          title: 'Accretion Disk',
          description: 'Superheated glowing gas and dust spiraling into the hole at millions of miles per hour.',
          mnemonic: 'Glowing cosmic whirlpool',
          accentColor: '#f97316',
          iconName: 'Flame'
        }
      ],
      mindMap: {
        centralConcept: 'Black Hole Anatomy',
        branches: [
          {
            title: 'Core Structures',
            detail: 'Physical zones',
            children: ['Singularity (Center)', 'Event Horizon (Border)', 'Accretion Disk (Halo)']
          },
          {
            title: 'Relativistic Effects',
            detail: 'Weird physics',
            children: ['Gravitational Time Dilation', 'Spaghettification', 'Gravitational Lensing']
          },
          {
            title: 'Origins',
            detail: 'How they form',
            children: ['Supernova stellar collapse', 'Neutron star mergers', 'Primordial universe']
          }
        ]
      },
      takeawayBulletPoints: [
        'Gravity is so intense that the escape velocity exceeds the speed of light.',
        'Clocks tick slower near the horizon due to gravitational time dilation.',
        'Superheated matter in the accretion disk glows brighter than whole galaxies.'
      ]
    },
    interactiveFormat: {
      quickGoal: 'Survive the event horizon quiz and claim 150 cosmic XP!',
      challenges: [
        {
          id: 'b1',
          question: 'What is the name of the boundary beyond which nothing, not even light, can escape a black hole?',
          type: 'multiple_choice',
          options: [
            'The Sound Barrier',
            'The Event Horizon',
            'The Solar Corona',
            'The Oort Cloud'
          ],
          correctIndex: 1,
          explanation: 'Yes! The Event Horizon is the theoretical boundary around a black hole beyond which no light or radiation can escape.',
          dopaminePraise: 'Cosmic Accuracy! +50 XP 🚀'
        },
        {
          id: 'b2',
          question: 'What happens to time for an observer standing near a supermassive black hole compared to someone on Earth?',
          type: 'multiple_choice',
          options: [
            'Time runs backwards',
            'Time ticks significantly slower due to intense gravitational dilation',
            'Time speeds up ten times faster',
            'Time ceases to exist entirely'
          ],
          correctIndex: 1,
          explanation: 'Correct! Einstein showed that extreme gravity dilates time—1 hour near the hole could be 7 years on Earth.',
          dopaminePraise: 'Relativity master! Einstein would be proud! +50 XP ⏱️'
        },
        {
          id: 'b3',
          question: 'True or False: Black holes act like giant cosmic vacuum cleaners that suck in planets from across the entire galaxy.',
          type: 'true_false',
          options: [
            'True — they roam around sucking up stars like vacuum cleaners',
            'False — if our Sun were replaced by an equal-mass black hole, Earth would continue orbiting normally'
          ],
          correctIndex: 1,
          explanation: 'False! A black hole only exerts extreme gravity when you get extremely close to it. From afar, gravity is identical to a star of the same mass.',
          dopaminePraise: 'Myth busted! Superb critical thinking! +50 XP 🌌'
        }
      ],
      fidgetPrompt: 'Tap the gravitational wave ripple to stabilize focus.'
    }
  }
];
