// Algemene (niet-religieuze) prompt templates voor universele content
export const universalTemplates = {
  coloring: {
    animals: "Adorable {animal} coloring page for {age} year old children, clear bold black outlines, friendly cartoon style, no shading, white background, educational animal facts in Dutch",
    vehicles: "Fun {vehicle} coloring page for kids aged {age}, detailed but simple design, clear black lines, no shading, white background, includes vehicle name in Dutch",
    alphabet: "Educational alphabet coloring page featuring letter {letter} with {object} that starts with that letter, clear outlines for {age} year olds, Dutch word labels",
    emotions: "Emotion recognition coloring page showing {emotion} faces, simple expressions for {age} year old children, Dutch emotion words, clear bold outlines",
    seasons: "{season} themed coloring page with seasonal elements, nature items, weather symbols, suitable for {age} year olds, Dutch seasonal vocabulary",
    celebrations: "Celebration coloring page for {event}, festive elements, balloons, cake, gifts, appropriate for {age} year old children, Dutch celebration words"
  },
  worksheet: {
    counting: "Math counting worksheet (1-{max}) with {theme} objects, clear illustrations, practice boxes, Dutch instructions, for {age} year old children",
    shapes: "Shape recognition worksheet featuring {shapes}, tracing exercises, matching games, Dutch shape names, designed for {age} year olds",
    differences: "Find the differences activity with {theme} theme, {count} differences to find, engaging illustrations for {age} year olds, Dutch instructions",
    maze: "Fun maze puzzle with {theme} theme, appropriate difficulty for {age} year olds, start and finish clearly marked, Dutch guidance",
    matching: "Matching game worksheet connecting {item1} to {item2}, clear illustrations, educational value, Dutch labels, for {age} year old children",
    patterns: "Pattern recognition worksheet with {theme} objects, complete the sequence exercises, {age} appropriate difficulty, Dutch instructions"
  },
  educational: {
    poster: "Educational poster about {topic} for {age} year olds, colorful child-friendly illustrations, key facts in Dutch, visually engaging design",
    flashcard: "Learning flashcard showing {subject}, clear simple illustration, Dutch word with phonetic help if needed, suitable for {age} year old vocabulary building",
    infographic: "Kid-friendly infographic about {topic}, using playful illustrations, simple Dutch text, bright engaging colors, designed for {age} year old children",
    routine: "Daily routine visual aid showing {routine} activities, clock times, sequential steps, Dutch labels, helpful for {age} year old children"
  },
  creative: {
    mask: "DIY {character} mask template for children, cut-out design with elastic band marks, decorating suggestions, suitable for {age} year olds",
    card: "Greeting card template for {occasion}, foldable design, spaces for child's drawing and message, {age} appropriate, Dutch text prompts",
    craft: "{season} craft activity template, step-by-step visual instructions in Dutch, materials list, suitable for {age} year old crafting skills",
    puppet: "Paper puppet template of {character}, moveable parts marked, assembly instructions in Dutch, engaging design for {age} year olds"
  },
  seasonal: {
    spring: "Spring activity page featuring {element} (flowers, butterflies, rain), nature exploration theme, Dutch vocabulary, for {age} year olds",
    summer: "Summer fun activity with {element} (beach, sun, ice cream), vacation theme, outdoor activities, Dutch summer words, {age} appropriate",
    autumn: "Autumn themed page showing {element} (leaves, pumpkins, harvest), seasonal changes, Dutch autumn vocabulary, for {age} year old children",
    winter: "Winter activity featuring {element} (snow, mittens, hot chocolate), cozy indoor/outdoor activities, Dutch winter words, {age} suitable"
  },
  parenting: {
    planner: "Weekly family planner template with child-friendly icons, meal planning section, activity slots, chore assignments, Dutch headers",
    reward: "Reward chart system for {behavior} goals, sticker spaces, weekly progress tracking, motivational Dutch phrases, child age {age}",
    emotions: "Emotion regulation tool for parents and {age} year olds, feeling identification chart, calming strategies, Dutch emotion vocabulary",
    routine: "Visual routine cards for {time} routine, step-by-step illustrations, time indicators, helpful for {age} year old independence"
  }
}

// Algemene thema's voor universele content
export const universalThemes = [
  {
    category: 'Dieren & Natuur',
    themes: [
      { value: 'farm_animals', label: 'Boerderijdieren', tags: ['koe', 'varken', 'kip', 'schaap'] },
      { value: 'wild_animals', label: 'Wilde dieren', tags: ['leeuw', 'olifant', 'giraffe', 'aap'] },
      { value: 'pets', label: 'Huisdieren', tags: ['hond', 'kat', 'konijn', 'vis'] },
      { value: 'insects', label: 'Insecten', tags: ['vlinder', 'bij', 'lieveheersbeestje'] },
      { value: 'ocean', label: 'Oceaan dieren', tags: ['vis', 'dolfijn', 'schildpad', 'octopus'] },
      { value: 'birds', label: 'Vogels', tags: ['uil', 'papegaai', 'zwaan', 'duif'] }
    ]
  },
  {
    category: 'Transport & Avontuur',
    themes: [
      { value: 'vehicles', label: 'Voertuigen', tags: ['auto', 'bus', 'fiets', 'motor'] },
      { value: 'flying', label: 'Vliegend', tags: ['vliegtuig', 'helikopter', 'ballon'] },
      { value: 'water_transport', label: 'Op het water', tags: ['boot', 'schip', 'onderzeeër'] },
      { value: 'construction', label: 'Bouwvoertuigen', tags: ['kraan', 'bulldozer', 'vrachtwagen'] },
      { value: 'emergency', label: 'Hulpdiensten', tags: ['brandweer', 'politie', 'ambulance'] }
    ]
  },
  {
    category: 'Leren & Ontwikkeling',
    themes: [
      { value: 'alphabet', label: 'Alfabet', tags: ['letters', 'woorden', 'lezen'] },
      { value: 'numbers', label: 'Cijfers', tags: ['tellen', 'rekenen', 'getallen'] },
      { value: 'shapes', label: 'Vormen', tags: ['cirkel', 'vierkant', 'driehoek'] },
      { value: 'colors', label: 'Kleuren', tags: ['rood', 'blauw', 'geel', 'groen'] },
      { value: 'emotions', label: 'Emoties', tags: ['blij', 'verdrietig', 'boos', 'bang'] },
      { value: 'body_parts', label: 'Lichaam', tags: ['hoofd', 'hand', 'voet', 'oog'] }
    ]
  },
  {
    category: 'Seizoenen & Feesten',
    themes: [
      { value: 'birthday', label: 'Verjaardag', tags: ['taart', 'ballonnen', 'cadeaus'] },
      { value: 'seasons_general', label: 'Seizoenen', tags: ['lente', 'zomer', 'herfst', 'winter'] },
      { value: 'holidays', label: 'Vakanties', tags: ['strand', 'bergen', 'camping'] },
      { value: 'celebrations', label: 'Feesten', tags: ['feest', 'muziek', 'dansen'] },
      { value: 'special_days', label: 'Speciale dagen', tags: ['moederdag', 'vaderdag', 'dierendag'] }
    ]
  },
  {
    category: 'Dagelijks Leven',
    themes: [
      { value: 'home', label: 'Thuis', tags: ['huis', 'kamer', 'tuin', 'keuken'] },
      { value: 'school', label: 'School', tags: ['klas', 'leraar', 'vriendjes'] },
      { value: 'playground', label: 'Speeltuin', tags: ['glijbaan', 'schommel', 'zandbak'] },
      { value: 'sports', label: 'Sport', tags: ['voetbal', 'zwemmen', 'fietsen'] },
      { value: 'food', label: 'Eten', tags: ['fruit', 'groente', 'maaltijd'] },
      { value: 'daily_routine', label: 'Dagelijkse routine', tags: ['opstaan', 'eten', 'slapen'] }
    ]
  },
  {
    category: 'Fantasie & Creativiteit',
    themes: [
      { value: 'fairytale', label: 'Sprookjes', tags: ['prins', 'prinses', 'draak', 'kasteel'] },
      { value: 'superheroes', label: 'Superhelden', tags: ['held', 'cape', 'masker'] },
      { value: 'pirates', label: 'Piraten', tags: ['schip', 'schat', 'papegaai'] },
      { value: 'space', label: 'Ruimte', tags: ['raket', 'planeet', 'ster', 'astronaut'] },
      { value: 'dinosaurs', label: 'Dinosaurussen', tags: ['t-rex', 'triceratops'] }
    ]
  }
]

// Ontwikkelingsfases voor algemene content
export const developmentStages = [
  { value: '2-3', label: 'Eerste verkenning', skills: ['grove motoriek', 'kleuren ontdekken'] },
  { value: '3-4', label: 'Speels leren', skills: ['fijne motoriek', 'eerste tellen'] },
  { value: '4-5', label: 'Voorbereiden', skills: ['pengreep', 'vormen herkennen'] },
  { value: '5-6', label: 'Schoolrijp', skills: ['letters', 'cijfers tot 10'] },
  { value: '6-7', label: 'Beginnend lezen', skills: ['woorden', 'rekenen tot 20'] },
  { value: '7-8', label: 'Zelfstandig', skills: ['zinnen', 'klokkijken'] },
  { value: '8-10', label: 'Verdieping', skills: ['verhalen', 'tafels'] }
]

// Seizoensgebonden algemene content
export const seasonalUniversalContent = {
  january: {
    themes: ['winter', 'sneeuw', 'nieuwjaar', 'winterkleding'],
    activities: ['sneeuwpop maken', 'winter dieren', 'warme chocolademelk']
  },
  february: {
    themes: ['valentijn', 'vriendschap', 'hartjes', 'liefde'],
    activities: ['vriendschapskaarten', 'hartjes knutselen']
  },
  march: {
    themes: ['lente', 'bloemen', 'lentekriebels'],
    activities: ['zaadjes planten', 'vlinders', 'regenlaarzen']
  },
  april: {
    themes: ['pasen', 'kuikens', 'eieren', 'konijnen'],
    activities: ['eieren versieren', 'paashaas', 'lentebloemen']
  },
  may: {
    themes: ['moederdag', 'bloemen', 'natuur'],
    activities: ['moederdag kaart', 'bloemen plukken']
  },
  june: {
    themes: ['zomer', 'vakantie', 'vaderdag', 'zon'],
    activities: ['vaderdag cadeau', 'zomerpret', 'picknicken']
  },
  july: {
    themes: ['strand', 'zee', 'ijsjes', 'reizen'],
    activities: ['vakantiedagboek', 'zandkasteel', 'zwemmen']
  },
  august: {
    themes: ['zomerfruit', 'buitenspelen', 'camping'],
    activities: ['fruit proeven', 'natuurspeurtocht']
  },
  september: {
    themes: ['school', 'herfst', 'bladeren', 'terug naar school'],
    activities: ['schooltas', 'herfstbladeren', 'nieuwe vrienden']
  },
  october: {
    themes: ['herfst', 'dierendag', 'pompoenen', 'paddenstoelen'],
    activities: ['dierenmaskers', 'herfstkleurplaat', 'eikels verzamelen']
  },
  november: {
    themes: ['sint maarten', 'lampionnen', 'herfststormen'],
    activities: ['lampion maken', 'lichtjes', 'binnen knutselen']
  },
  december: {
    themes: ['winter', 'feestdagen', 'sterren', 'gezelligheid'],
    activities: ['sterren knutselen', 'winterverhalen', 'cadeautjes']
  }
}

// Stijlen voor algemene content
export const universalArtStyles = [
  { value: 'cartoon_friendly', label: 'Vriendelijke Cartoon', description: 'Ronde vormen, grote ogen' },
  { value: 'simple_line', label: 'Eenvoudige Lijntekening', description: 'Minimalistisch en helder' },
  { value: 'playful_doodle', label: 'Speelse Doodle', description: 'Handgetekende stijl' },
  { value: 'educational_clear', label: 'Educatief Helder', description: 'Duidelijk en leerzaam' },
  { value: 'soft_pastel', label: 'Zachte Pastel', description: 'Rustgevende kleuren' },
  { value: 'bold_bright', label: 'Bold & Bright', description: 'Felle vrolijke kleuren' }
]