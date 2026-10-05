/** 6th Grade Science — Earth Systems mastery pool (25 MC questions). */

export const scienceEarthSystemsPool = [
  // —— Water Cycle (ses-01 … ses-05) ——
  {
    id: 'ses-01',
    topic: 'water-cycle',
    topicLabel: 'Water Cycle',
    question: 'What happens during evaporation in the water cycle?',
    options: [
      { id: 'a', label: 'Liquid water turns into gas (vapor) and moves upward' },
      { id: 'b', label: 'Water vapor turns into liquid droplets and forms clouds' },
      { id: 'c', label: 'Water falls to Earth as rain, snow, sleet, or hail' },
      { id: 'd', label: 'Water moves over the land into rivers and streams' },
    ],
    correctOptionId: 'a',
    hint: 'Evaporation: liquid → gas, and the vapor moves UP.',
    explanation:
      'Evaporation is when liquid water becomes water vapor (a gas) and rises into the air. Heat from the Sun drives this change.',
  },
  {
    id: 'ses-02',
    topic: 'water-cycle',
    topicLabel: 'Water Cycle',
    question: 'Which process forms clouds in the water cycle?',
    options: [
      { id: 'a', label: 'Precipitation' },
      { id: 'b', label: 'Condensation' },
      { id: 'c', label: 'Infiltration' },
      { id: 'd', label: 'Runoff' },
    ],
    correctOptionId: 'b',
    hint: 'Clouds form when vapor cools into tiny liquid droplets.',
    explanation:
      'Condensation is when water vapor (gas) cools and changes into liquid droplets. Those droplets gather to form clouds.',
  },
  {
    id: 'ses-03',
    topic: 'water-cycle',
    topicLabel: 'Water Cycle',
    question: 'Precipitation is best described as water that:',
    options: [
      { id: 'a', label: 'Rises from oceans as vapor' },
      { id: 'b', label: 'Is released by plant leaves' },
      { id: 'c', label: 'Falls to Earth as rain, snow, sleet, or hail' },
      { id: 'd', label: 'Seeps into soil and rock' },
    ],
    correctOptionId: 'c',
    hint: 'Precipitation comes DOWN from the clouds.',
    explanation:
      'Precipitation is water falling from clouds to Earth as rain, snow, sleet, or hail.',
  },
  {
    id: 'ses-04',
    topic: 'water-cycle',
    topicLabel: 'Water Cycle',
    question: 'How is runoff different from infiltration?',
    options: [
      { id: 'a', label: 'Runoff moves into the ground; infiltration moves over land' },
      { id: 'b', label: 'Runoff moves over land; infiltration moves into the ground' },
      { id: 'c', label: 'Both mean water turning into vapor' },
      { id: 'd', label: 'Both mean water falling from clouds' },
    ],
    correctOptionId: 'b',
    hint: 'Runoff = over land; Infiltration = into ground.',
    explanation:
      'Runoff is water flowing over the land surface. Infiltration is water soaking into the ground.',
  },
  {
    id: 'ses-05',
    topic: 'water-cycle',
    topicLabel: 'Water Cycle',
    question: 'What is transpiration, and what is the primary energy source for the water cycle?',
    options: [
      {
        id: 'a',
        label: 'Water vapor released by plants; the Sun is the primary energy source',
      },
      {
        id: 'b',
        label: 'Water flowing over land; Earth’s inner core is the primary energy source',
      },
      {
        id: 'c',
        label: 'Water soaking into soil; wind is the primary energy source',
      },
      {
        id: 'd',
        label: 'Water freezing into hail; the Moon is the primary energy source',
      },
    ],
    correctOptionId: 'a',
    hint: 'Plants release vapor; the Sun powers the cycle.',
    explanation:
      'Transpiration is water vapor released by plants. The Sun is the primary energy source that drives the water cycle.',
  },

  // —— Rock Cycle (ses-06 … ses-10) ——
  {
    id: 'ses-06',
    topic: 'rock-cycle',
    topicLabel: 'Rock Cycle',
    question: 'How does igneous rock form?',
    options: [
      { id: 'a', label: 'Sediments are compacted and cemented' },
      { id: 'b', label: 'Existing rock changes under heat and pressure' },
      { id: 'c', label: 'Magma or lava cools and hardens (crystallizes)' },
      { id: 'd', label: 'Wind breaks rock into smaller pieces' },
    ],
    correctOptionId: 'c',
    hint: 'Igneous = cooled magma or lava.',
    explanation:
      'Igneous rock forms when molten magma or lava cools and hardens, allowing crystals to form.',
  },
  {
    id: 'ses-07',
    topic: 'rock-cycle',
    topicLabel: 'Rock Cycle',
    question: 'Sedimentary rock forms when:',
    options: [
      { id: 'a', label: 'Magma cools deep underground' },
      { id: 'b', label: 'Sediments are compacted and cemented' },
      { id: 'c', label: 'Rock melts completely into lava' },
      { id: 'd', label: 'Heat and pressure recrystallize solid rock' },
    ],
    correctOptionId: 'b',
    hint: 'Layers of sediment get pressed and glued together.',
    explanation:
      'Sedimentary rock forms when sediments are compacted and cemented into solid rock.',
  },
  {
    id: 'ses-08',
    topic: 'rock-cycle',
    topicLabel: 'Rock Cycle',
    question: 'Metamorphic rock forms when:',
    options: [
      { id: 'a', label: 'Lava freezes on Earth’s surface' },
      { id: 'b', label: 'Bits of rock settle in a lake and cement' },
      { id: 'c', label: 'Existing rock changes under heat and pressure' },
      { id: 'd', label: 'Water dissolves minerals and carries them away' },
    ],
    correctOptionId: 'c',
    hint: 'Meta = change; heat + pressure transform rock.',
    explanation:
      'Metamorphic rock forms when existing rock is changed by heat and pressure without fully melting.',
  },
  {
    id: 'ses-09',
    topic: 'rock-cycle',
    topicLabel: 'Rock Cycle',
    question: 'Which statement correctly matches weathering, erosion, and deposition?',
    options: [
      {
        id: 'a',
        label: 'Weathering moves sediment; erosion breaks rock; deposition melts rock',
      },
      {
        id: 'b',
        label: 'Weathering breaks rock; erosion moves sediment; deposition drops sediment',
      },
      {
        id: 'c',
        label: 'Weathering drops sediment; erosion cements rock; deposition breaks rock',
      },
      {
        id: 'd',
        label: 'Weathering melts rock; erosion cools magma; deposition forms clouds',
      },
    ],
    correctOptionId: 'b',
    hint: 'Break → move → drop.',
    explanation:
      'Weathering breaks rock into smaller pieces. Erosion moves that sediment. Deposition is when sediment is dropped in a new place.',
  },
  {
    id: 'ses-10',
    topic: 'rock-cycle',
    topicLabel: 'Rock Cycle',
    question: 'Which statement about the rock cycle is true?',
    options: [
      {
        id: 'a',
        label: 'Every rock must follow one fixed path: igneous → sedimentary → metamorphic',
      },
      {
        id: 'b',
        label: 'Rocks can take different paths through melting, weathering, or heat and pressure',
      },
      {
        id: 'c',
        label: 'Once a rock is sedimentary, it can never change again',
      },
      {
        id: 'd',
        label: 'Only igneous rocks can become metamorphic',
      },
    ],
    correctOptionId: 'b',
    hint: 'The rock cycle is non-linear — many pathways exist.',
    explanation:
      'The rock cycle is non-linear. Rocks can follow different pathways through melting, weathering, or heat and pressure.',
  },

  // —— Atmosphere (ses-11 … ses-15) ——
  {
    id: 'ses-11',
    topic: 'atmosphere',
    topicLabel: 'Atmosphere',
    question:
      'From the ground upward, what is the correct order of atmospheric layers? (Mnemonic: “The Smart Monkey Takes Everything”)',
    options: [
      {
        id: 'a',
        label: 'Troposphere → Stratosphere → Mesosphere → Thermosphere → Exosphere',
      },
      {
        id: 'b',
        label: 'Stratosphere → Troposphere → Mesosphere → Exosphere → Thermosphere',
      },
      {
        id: 'c',
        label: 'Exosphere → Thermosphere → Mesosphere → Stratosphere → Troposphere',
      },
      {
        id: 'd',
        label: 'Troposphere → Mesosphere → Stratosphere → Exosphere → Thermosphere',
      },
    ],
    correctOptionId: 'a',
    hint: 'The Smart Monkey Takes Everything → T, S, M, T, E.',
    explanation:
      'From the ground up: Troposphere, Stratosphere, Mesosphere, Thermosphere, Exosphere. Remember: “The Smart Monkey Takes Everything.”',
  },
  {
    id: 'ses-12',
    topic: 'atmosphere',
    topicLabel: 'Atmosphere',
    question: 'Which atmospheric layer contains weather and is where we live?',
    options: [
      { id: 'a', label: 'Stratosphere' },
      { id: 'b', label: 'Mesosphere' },
      { id: 'c', label: 'Troposphere' },
      { id: 'd', label: 'Exosphere' },
    ],
    correctOptionId: 'c',
    hint: '“Tropo” is closest to the ground — our home layer.',
    explanation:
      'The troposphere is the lowest layer. It is where we live and where weather happens.',
  },
  {
    id: 'ses-13',
    topic: 'atmosphere',
    topicLabel: 'Atmosphere',
    question: 'Which layer contains the ozone layer?',
    options: [
      { id: 'a', label: 'Troposphere' },
      { id: 'b', label: 'Stratosphere' },
      { id: 'c', label: 'Mesosphere' },
      { id: 'd', label: 'Thermosphere' },
    ],
    correctOptionId: 'b',
    hint: 'Ozone lives in the stratosphere.',
    explanation:
      'The stratosphere contains the ozone layer, which helps protect Earth from harmful ultraviolet radiation.',
  },
  {
    id: 'ses-14',
    topic: 'atmosphere',
    topicLabel: 'Atmosphere',
    question: 'In which layer do most meteors burn up?',
    options: [
      { id: 'a', label: 'Troposphere' },
      { id: 'b', label: 'Stratosphere' },
      { id: 'c', label: 'Mesosphere' },
      { id: 'd', label: 'Exosphere' },
    ],
    correctOptionId: 'c',
    hint: 'Meteors → Mesosphere.',
    explanation:
      'Most meteors burn up in the mesosphere as they enter Earth’s atmosphere.',
  },
  {
    id: 'ses-15',
    topic: 'atmosphere',
    topicLabel: 'Atmosphere',
    question: 'Which pairing is correct?',
    options: [
      { id: 'a', label: 'Thermosphere: auroras; Exosphere: outer edge / satellites' },
      { id: 'b', label: 'Thermosphere: weather; Exosphere: ozone layer' },
      { id: 'c', label: 'Thermosphere: meteors burn; Exosphere: where we live' },
      { id: 'd', label: 'Thermosphere: runoff; Exosphere: infiltration' },
    ],
    correctOptionId: 'a',
    hint: 'Auroras in the thermosphere; satellites near the exosphere edge.',
    explanation:
      'Auroras occur in the thermosphere. The exosphere is the outer edge of the atmosphere, where many satellites orbit.',
  },

  // —— Earth Layers (ses-16 … ses-20) ——
  {
    id: 'ses-16',
    topic: 'earth-layers',
    topicLabel: 'Earth Layers',
    question: 'From outside to center, what is the correct order of Earth’s layers?',
    options: [
      { id: 'a', label: 'Mantle → Crust → Inner Core → Outer Core' },
      { id: 'b', label: 'Crust → Mantle → Outer Core → Inner Core' },
      { id: 'c', label: 'Crust → Outer Core → Mantle → Inner Core' },
      { id: 'd', label: 'Inner Core → Outer Core → Mantle → Crust' },
    ],
    correctOptionId: 'b',
    hint: 'Start at the thin shell, then go deeper toward the center.',
    explanation:
      'From outside to center: Crust → Mantle → Outer Core → Inner Core.',
  },
  {
    id: 'ses-17',
    topic: 'earth-layers',
    topicLabel: 'Earth Layers',
    question: 'Which Earth layer is the thickest?',
    options: [
      { id: 'a', label: 'Crust' },
      { id: 'b', label: 'Mantle' },
      { id: 'c', label: 'Outer Core' },
      { id: 'd', label: 'Inner Core' },
    ],
    correctOptionId: 'b',
    hint: 'The mantle makes up most of Earth’s volume.',
    explanation:
      'The mantle is Earth’s thickest layer, making up most of the planet’s volume beneath the thin crust.',
  },
  {
    id: 'ses-18',
    topic: 'earth-layers',
    topicLabel: 'Earth Layers',
    question: 'Which statement about Earth’s core is correct?',
    options: [
      { id: 'a', label: 'Outer core is solid; inner core is liquid' },
      { id: 'b', label: 'Outer core is liquid; inner core is solid' },
      { id: 'c', label: 'Both the outer and inner cores are solid' },
      { id: 'd', label: 'Both the outer and inner cores are liquid' },
    ],
    correctOptionId: 'b',
    hint: 'Outer = liquid; Inner = solid.',
    explanation:
      'The outer core is liquid metal, while the inner core is solid metal.',
  },
  {
    id: 'ses-19',
    topic: 'earth-layers',
    topicLabel: 'Earth Layers',
    question: 'As you go deeper into Earth, what happens to temperature and pressure?',
    options: [
      { id: 'a', label: 'Temperature increases; pressure decreases' },
      { id: 'b', label: 'Temperature decreases; pressure increases' },
      { id: 'c', label: 'Both temperature and pressure increase' },
      { id: 'd', label: 'Both temperature and pressure decrease' },
    ],
    correctOptionId: 'c',
    hint: 'Deeper = hotter and more squeezed.',
    explanation:
      'Both temperature and pressure increase with depth inside Earth.',
  },
  {
    id: 'ses-20',
    topic: 'earth-layers',
    topicLabel: 'Earth Layers',
    question: 'Which description best fits Earth’s crust?',
    options: [
      { id: 'a', label: 'The thickest molten layer beneath the surface' },
      { id: 'b', label: 'The thin, solid outer shell of Earth' },
      { id: 'c', label: 'The liquid metal layer that creates Earth’s magnetic field alone' },
      { id: 'd', label: 'The solid metal ball at Earth’s exact center' },
    ],
    correctOptionId: 'b',
    hint: 'We live on a thin, solid outer shell.',
    explanation:
      'The crust is Earth’s thin, solid outer shell — the layer we live on.',
  },

  // —— Energy Transfer (ses-21 … ses-25) ——
  {
    id: 'ses-21',
    topic: 'energy-transfer',
    topicLabel: 'Energy Transfer',
    question: 'Energy from the Sun reaches Earth mainly by:',
    options: [
      { id: 'a', label: 'Conduction through empty space' },
      { id: 'b', label: 'Convection currents in solid rock' },
      { id: 'c', label: 'Radiation as rays/waves that do not need direct contact' },
      { id: 'd', label: 'Runoff carrying heat across the oceans' },
    ],
    correctOptionId: 'c',
    hint: 'Radiation travels as rays/waves — no touching required.',
    explanation:
      'Radiation transfers energy as rays or waves and does not require direct contact. That is how energy travels from the Sun to Earth.',
  },
  {
    id: 'ses-22',
    topic: 'energy-transfer',
    topicLabel: 'Energy Transfer',
    question: 'A metal spoon heats up in a hot pan because of:',
    options: [
      { id: 'a', label: 'Radiation' },
      { id: 'b', label: 'Conduction' },
      { id: 'c', label: 'Convection' },
      { id: 'd', label: 'Precipitation' },
    ],
    correctOptionId: 'b',
    hint: 'Conduction needs direct contact — materials must touch.',
    explanation:
      'Conduction transfers energy through direct contact. Heat moves from the hot pan into the spoon where they touch.',
  },
  {
    id: 'ses-23',
    topic: 'energy-transfer',
    topicLabel: 'Energy Transfer',
    question: 'Which statement best describes convection?',
    options: [
      {
        id: 'a',
        label: 'Energy moves by rays/waves with no material needed',
      },
      {
        id: 'b',
        label: 'Energy moves only when two solids touch',
      },
      {
        id: 'c',
        label:
          'Energy moves by fluid circulation in liquids and gases; warm rises and cool sinks',
      },
      {
        id: 'd',
        label: 'Energy moves only through the solid inner core',
      },
    ],
    correctOptionId: 'c',
    hint: 'Warm fluid rises; cool fluid sinks — circulation!',
    explanation:
      'Convection is energy transfer by the movement of fluids (liquids and gases). Warm material rises and cooler material sinks, creating circulation.',
  },
  {
    id: 'ses-24',
    topic: 'energy-transfer',
    topicLabel: 'Energy Transfer',
    question: 'How does convection in Earth’s mantle connect to Earth’s systems?',
    options: [
      { id: 'a', label: 'It forms clouds directly in the troposphere' },
      { id: 'b', label: 'It drives tectonic activity' },
      { id: 'c', label: 'It creates the ozone layer' },
      { id: 'd', label: 'It causes precipitation to fall as hail only' },
    ],
    correctOptionId: 'b',
    hint: 'Moving mantle material helps move Earth’s plates.',
    explanation:
      'Convection in the mantle drives tectonic activity, linking Earth’s interior energy transfer to surface processes.',
  },
  {
    id: 'ses-25',
    topic: 'energy-transfer',
    topicLabel: 'Energy Transfer',
    question: 'Convection in air and water is an important driver of:',
    options: [
      { id: 'a', label: 'Weather' },
      { id: 'b', label: 'Igneous rock crystallization only' },
      { id: 'c', label: 'The order of atmospheric layers' },
      { id: 'd', label: 'The thickness of Earth’s crust' },
    ],
    correctOptionId: 'a',
    hint: 'Moving air and water help make weather patterns.',
    explanation:
      'Convection in air and water drives weather by circulating heat through Earth’s atmosphere and oceans.',
  },
]
