import { RandomEncounter, MissingMystery } from '../types';

export const RANDOM_ENCOUNTERS: RandomEncounter[] = [
  {
    id: 'enc_doldrums',
    title: 'The Equatorial Doldrums',
    type: 'SEA',
    description: 'The trade winds have died completely. The Atlantic lies as flat and glassy as molten lead under a scorching sun. The sails hang limp and moisture rots the canvas as the days stretch into weeks.',
    historicalContext: 'The Intertropical Convergence Zone (ITCZ) was feared by captains for stranding sailing ships for a month or more without fresh rainwater.',
    options: [
      {
        label: 'Order the crew to man the longboats and tow the ship',
        description: 'Exhausting physical labor; consumes extra water rations but breaks through the calm.',
        riskChance: 0.25,
        successText: 'By blistered palms and steadfast rowing, the longboats pull the flagship into a fresh southerly breeze! Morale holds.',
        failureText: 'Two sailors succumb to sunstroke and water runs dangerously low before a breeze stirs.',
        effect: (_state) => ({
          log: 'Navigated out of the Doldrums via arduous longboat towing.',
          moraleDelta: 5,
          healthDelta: -5,
          resourceDeltas: { provisions: -15 }
        })
      },
      {
        label: 'Drop drift nets and conserve rations while awaiting wind',
        description: 'Passive survival; preserves crew energy but tests the patience of the men.',
        riskChance: 0.35,
        successText: 'The crew catches several large dorado (dolphin-fish) and barrels of fresh rainwater during a sudden squall!',
        failureText: 'Cabin fever sets in, and sea slime fouls the rudder.',
        effect: (_state) => ({
          log: 'Waited out the Doldrums peacefully, supplementing rations with sea catch.',
          moraleDelta: -8,
          resourceDeltas: { provisions: 10 }
        })
      }
    ]
  },
  {
    id: 'enc_mermaids',
    title: 'Sirens of the Caribbean Shallows',
    type: 'SEA',
    description: 'At twilight, the lookout in the crow\'s nest screams: "Mermaids on the shoal!" Pale whiskered faces and broad tails rise from the seagrass shallows, squeaking softly in the warm breeze.',
    historicalContext: 'In January 1493 Columbus wrote that he saw three "mermaids" off Hispaniola that "were not as beautiful as they are painted"—almost certainly manatees.',
    options: [
      {
        label: 'Dispatch the ship naturalist with sketchbook and spyglass',
        description: 'Treat the phenomenon with scientific rigor and record the species in the compendium.',
        successText: 'The naturalist sketches the gentle Caribbean sea cows! The scholars at home will rejoice at this witty debunking of ancient siren mythology.',
        effect: (_state) => ({
          log: 'Scientific observation of sea cows ("Sirens") recorded in the Natural History compendium.',
          resourceDeltas: { prestige: 25, ducats: 50 }
        })
      },
      {
        label: 'Serve an extra ration so the crew can toast the "Sea Maidens"',
        description: 'Embrace the sailor folklore to lift crew spirits.',
        successText: 'The crew merrily sings sea shanties late into the starlit night, convinced the sea maidens brought good fortune.',
        effect: (_state) => ({
          log: 'Celebrated the mermaid sighting with an extra ration; crew morale surged!',
          moraleDelta: 20,
          resourceDeltas: { provisions: -5 }
        })
      }
    ]
  },
  {
    id: 'enc_bioluminescence',
    title: 'The Sea of Living Stars',
    type: 'SEA',
    description: 'As night falls, the ocean awakens with an eerie, magical electric azure glow. Every wave crested by the prow bursts into sparkling blue light, and schools of flying fish leave trails like shooting stars in the brine.',
    historicalContext: 'Noctiluca scintillans dinoflagellates create breathtaking bioluminescence in warm tropical seas.',
    options: [
      {
        label: 'Collect water samples in glass jars for close study',
        description: 'Study the glowing microorganisms under magnifying glass lenses.',
        successText: 'The water in the jars flashes blue again each time it is shaken, for several nights! A wondrous addition to your scientific journal.',
        effect: (_state) => ({
          log: 'Bioluminescent marine samples cataloged; scholarly prestige awarded.',
          resourceDeltas: { prestige: 20 }
        })
      },
      {
        label: 'Bathe in the starlit wake to wash away shipboard grime',
        description: 'Sailors dive safely from safety ropes into the warm, shimmering sea.',
        successText: 'Crew spirits soar as the men laugh, glowing like sea gods in the luminescent waves.',
        effect: (_state) => ({
          log: 'Night swim in bioluminescent sea boosted crew morale dramatically.',
          moraleDelta: 25
        })
      }
    ]
  },
  {
    id: 'enc_saint_elmo',
    title: 'Saint Elmo\'s Celestial Fire',
    type: 'SEA',
    description: 'During a pitch-black thunderstorm far out at sea, ghostly blue-violet flames dance along the yardarms, masthead truck, and bowsprit. The eerie glow hisses softly like fat in a skillet.',
    historicalContext: 'Saint Elmo\'s Fire is an atmospheric electrostatic glow created by ionized air during thunderstorms, seen by sailors as a sign of divine protection.',
    options: [
      {
        label: 'Kneel in thanksgiving and reassure the superstitious crew',
        description: 'Interpret the celestial flame as a blessing of safe passage through the storm.',
        successText: 'The terrified sailors take heart, steering true through howling forty-knot gale waves without losing a spar.',
        effect: (_state) => ({
          log: 'Saint Elmo\'s Fire steadied the helmsman through a fierce gale.',
          moraleDelta: 20,
          healthDelta: -5
        })
      },
      {
        label: 'Climb aloft to observe and sketch the flame up close',
        description: 'A daring attempt to describe the strange light for the natural philosophers at home.',
        riskChance: 0.2,
        successText: 'The cartographer sketches the cold flame at the masthead—a record later scholars would recognize as electricity in the air.',
        failureText: 'A violent gust nearly throws the cartographer from the yard; he returns soaked and shaken.',
        effect: (_state) => ({
          log: 'Naturalist examined Saint Elmo\'s electrostatic flame; scientific prestige gained.',
          resourceDeltas: { prestige: 30 }
        })
      }
    ]
  },
  {
    id: 'enc_quinine_healer',
    title: 'The Shivering Fever & The Bitter Bark',
    type: 'LAND',
    description: 'Three naturalists and five oarsmen have taken ill with the shaking marsh ague (malaria). Their teeth chatter violently despite layers of wool blankets.',
    historicalContext: 'Malaria killed many sailors. In the 1630s, Jesuits in Peru learned—likely from Andean healers—that the bitter bark of the cinchona tree eased its fevers. Its active ingredient, quinine, was isolated in 1820.',
    options: [
      {
        label: 'Seek help from local healers, bringing respectful gifts',
        description: 'Humbly ask the healers who know this land for their remedies.',
        successText: 'The healers share bitter herbal teas, cool cloths and rest in the shade. Over several days the fevers ease and color returns to their cheeks.',
        effect: (_state) => ({
          log: 'Local healers helped the crew through the fever; diplomatic harmony deepened.',
          moraleDelta: 15,
          resourceDeltas: { rareFlora: 15, prestige: 20 }
        })
      },
      {
        label: 'Rely on standard European bloodletting and sea salt biscuits',
        description: 'Follow conservative 16th-century ship doctor practices.',
        successText: 'Two recover slowly through bed rest, though crew strength remains sapped.',
        effect: (_state) => ({
          log: 'Conservative remedies applied; crew recovery is slow and morale dampened.',
          moraleDelta: -10,
          healthDelta: -10
        })
      }
    ]
  },
  {
    id: 'enc_croatoan_discovery',
    title: 'The Palisade at Roanoke Island',
    type: 'MYSTERY',
    description: 'Your landing party steps onto a sandy barrier spit where English colonists vanished seventeen years ago. The houses are taken down, and on a palisade post stripped of bark are eight carved letters: C-R-O-A-T-O-A-N.',
    historicalContext: 'In 1590 Governor John White found the settlement empty, with no cross (the agreed distress sign) and "CROATOAN" carved on a post. The leading theory is that some colonists went to live with the friendly Croatoan people (later called the Hatteras), but no one has proven what happened.',
    options: [
      {
        label: 'Follow the clues peacefully to the nearby indigenous town',
        description: 'Send unarmed interpreters bearing tobacco and woven gifts.',
        successText: 'In this voyage\'s telling, you find some of the missing settlers living among the Croatoan, married into the community and fluent in their language, with notebooks of plant drawings to share.',
        effect: (_state) => ({
          log: 'A possible answer to CROATOAN: settlers found living with Croatoan allies (history\'s real answer is still unknown).',
          moraleDelta: 30,
          resourceDeltas: { prestige: 100, ducats: 250, rareFlora: 30 }
        })
      },
      {
        label: 'Excavate the buried chests beneath the palisade corner',
        description: 'Uncover the water-sealed iron trunk left by the previous captain.',
        successText: 'Beneath the sand, you unearth three leather-wrapped journals with water-stained pages, faded coastal charts and pressed specimens of Virginia flora!',
        effect: (_state) => ({
          log: 'Unearthed lost expedition journals containing invaluable cartographic survey charts.',
          resourceDeltas: { prestige: 75, ducats: 150 }
        })
      }
    ]
  }
];

export const MYSTERY_INVESTIGATIONS: MissingMystery[] = [
  {
    id: 'myst_roanoke',
    shipName: 'The Good Hope',
    lostCoords: [35.9, -75.7],
    locationDescription: 'Roanoke Island & Outer Banks',
    clueTitle: 'The Carved Post: "CROATOAN"',
    clueText: 'A weathered palisade post stands at the tree line, carved with the single word "CROATOAN" with no cross of distress. Fresh tracks of native leather moccasins and English hobnailed shoes lead south toward Hatteras Island.',
    resolutionOutcome: 'INTEGRATED_TRIBE',
    survivorsFound: 24,
    prestigeReward: 120,
    loreReward: 'In this telling, the survivors were welcomed by the Croatoan people and shared what they knew of plants and coastlines. (Historians still debate the real fate of the 1587 colonists.)'
  },
  {
    id: 'myst_amazon',
    shipName: 'La Couronne d\'Or',
    lostCoords: [-0.5, -50.5],
    locationDescription: 'Amazon River Estuary & Deep Canals',
    clueTitle: 'The Cork-Sealed Brass Cylinder',
    clueText: 'Tangled in the aerial roots of a weeping mangrove, your search sloop spots an airtight brass cylinder bearing the royal seal. Inside is the captain\'s water-resistant parchment log.',
    resolutionOutcome: 'CHART_RECOVERED',
    survivorsFound: 14,
    prestigeReward: 95,
    loreReward: 'The recovered charts reveal three navigable channels cutting 200 leagues into the Amazon basin, unlocking inland spice groves.'
  },
  {
    id: 'myst_magellan',
    shipName: 'Victoria de Sagres',
    lostCoords: [-53.5, -70.5],
    locationDescription: 'Strait of Magellan & Tierra del Fuego',
    clueTitle: 'The Smoke of the Secret Cove',
    clueText: 'Through the icy mist of a sheltered fjord, your lookout spots a spiral of woodsmoke. Beached on a gravel shelf is the ship\'s hull, converted into a cozy winter fortress.',
    resolutionOutcome: 'SECRET_HAVEN',
    survivorsFound: 19,
    prestigeReward: 110,
    loreReward: 'The stranded crew found a sheltered cove with fresh water and wild celery, surviving the bitter southern winter in high spirits!'
  }
];
