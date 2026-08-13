const locations = {
  bethanyBeyondJordan: place('bethany-beyond-jordan', 'Bethany beyond the Jordan', 31.84, 35.55, 'Jordan region', 'A traditional study-location area east of the Jordan; its exact identification remains debated.'),
  bethany: place('bethany', 'Bethany', 31.77, 35.27, 'Judea', 'A village east of Jerusalem, associated with Mary, Martha, and Lazarus.'),
  cana: place('cana', 'Cana', 32.75, 35.34, 'Galilee', 'The setting of Jesus’ first sign in John’s Gospel.'),
  capernaum: place('capernaum', 'Capernaum', 32.88, 35.57, 'Galilee', 'A lakeside town on the northwestern shore of the Sea of Galilee.'),
  galilee: place('galilee', 'Galilee', 32.8, 35.0, 'Galilee', 'The northern region where much of Jesus’ public ministry unfolds.'),
  jerusalem: place('jerusalem', 'Jerusalem', 31.78, 35.22, 'Judea', 'The city of the temple and the setting for Jesus’ final Passover.'),
  judea: place('judea', 'Jerusalem / Judea', 31.78, 35.22, 'Judea', 'The southern region around Jerusalem.'),
  kidron: place('kidron', 'Kidron Valley', 31.77, 35.23, 'Jerusalem', 'The valley immediately east of Jerusalem that Jesus crossed before his arrest.'),
  salim: place('salim', 'Aenon near Salim', 32.3, 35.35, 'Samaria', 'The text locates John’s baptizing ministry near Aenon and Salim; the precise site is uncertain.'),
  seaOfGalilee: place('sea-of-galilee', 'Sea of Galilee', 32.84, 35.58, 'Galilee', 'The lake also called the Sea of Tiberias.'),
  siloam: place('siloam', 'Pool of Siloam', 31.77, 35.23, 'Jerusalem', 'A pool on the southern side of ancient Jerusalem.'),
  sychar: place('sychar', 'Sychar / Jacob’s Well area', 32.21, 35.28, 'Samaria', 'The setting for Jesus’ conversation with the Samaritan woman; represented as an approximate study location.'),
  tiberias: place('tiberias', 'Sea of Tiberias', 32.84, 35.58, 'Galilee', 'John’s alternate name for the Sea of Galilee.'),
  temple: place('temple', 'Temple Mount', 31.78, 35.23, 'Jerusalem', 'The temple precinct at the heart of Jerusalem’s religious life.'),
}

const allIsraelBounds = [[34.7, 31.4], [35.8, 33.2]]
const jerusalemBounds = [[35.18, 31.73], [35.3, 31.84]]
const galileeBounds = [[35.1, 32.55], [35.86, 33.25]]

export function getJohnChapterGeography(chapterId, styleId) {
  const entry = johnChapters[chapterId]
  if (!entry || !styleId) return null
  return {
    chapterId,
    bounds: entry.bounds || allIsraelBounds,
    mapStyleUrl: `/api/maptiler?resource=${encodeURIComponent(`maps/${styleId}/style.json`)}`,
    routes: [],
    orientationLabels: orientationLabelsFor(entry.bounds || allIsraelBounds),
    ...entry,
  }
}

const johnChapters = {
  'john-1': chapter('John 1 introduces John’s witness at Bethany beyond the Jordan, then follows Jesus as he calls disciples and travels into Galilee.', [locations.bethanyBeyondJordan, locations.cana, locations.galilee], {
    routes: [route('john-1-journey', 'From the Jordan region toward Galilee', [[35.55, 31.84], [35.34, 32.75]], 'Jesus’ early disciples encounter him near the Jordan and the narrative moves toward Galilee.')],
  }),
  'john-2': chapter('John 2 moves from Cana in Galilee to Jerusalem for Passover, linking Jesus’ first sign with his temple action.', [locations.cana, locations.temple], {
    routes: [route('john-2-journey', 'Cana to Jerusalem', [[35.34, 32.75], [35.22, 31.78]], 'The chapter crosses the country from Galilee to Jerusalem for Passover.')],
  }),
  'john-3': chapter('John 3 begins in Jerusalem and then places Jesus’ ministry in the Judean countryside, alongside John’s baptizing work near Aenon.', [locations.jerusalem, locations.judea, locations.salim]),
  'john-4': chapter('John 4 follows Jesus north from Judea toward Galilee. The encounter at the well takes place in Samaria, near Sychar.', [locations.judea, locations.sychar, locations.galilee], {
    routes: [
      route('john-4-direct', 'Jesus’ route through Samaria', [[35.22, 31.78], [35.28, 32.21], [35.0, 32.8]], 'The highlighted route passes north through Samaria toward Galilee.', 'story', [35.08, 32.48]),
      route('john-4-avoidance', 'Common route east of the Jordan', [[35.22, 31.78], [35.55, 31.95], [35.62, 32.55], [35.0, 32.8]], 'A longer alternative that avoided Samaritan territory.', 'comparison', [35.54, 32.5]),
    ],
    routeComparison: { title: 'A direct road with a social boundary', body: 'Traveling north through Samaria was the direct route from Judea to Galilee. Many Jewish travelers chose a longer eastern route to avoid Samaritan territory. Jesus’ journey through Samaria sets the scene for his conversation at the well.' },
  }),
  'john-5': chapter('John 5 is set in Jerusalem, at a pool near the Sheep Gate, where Jesus heals a man and speaks about his authority.', [locations.jerusalem, locations.temple], { bounds: jerusalemBounds }),
  'john-6': chapter('John 6 unfolds around the Sea of Galilee: a crowd is fed on its far side, and Jesus later comes to the disciples on the water.', [locations.seaOfGalilee, locations.capernaum], { bounds: galileeBounds }),
  'john-7': chapter('John 7 returns to Jerusalem for the Festival of Booths, where Jesus teaches publicly in the temple precinct.', [locations.jerusalem, locations.temple], { bounds: jerusalemBounds }),
  'john-8': chapter('John 8 continues Jesus’ public teaching in Jerusalem’s temple setting.', [locations.jerusalem, locations.temple], { bounds: jerusalemBounds }),
  'john-9': chapter('John 9 moves within Jerusalem from the place of healing to the Pool of Siloam, where the man born blind washes and receives sight.', [locations.jerusalem, locations.siloam], { bounds: jerusalemBounds, routes: [route('john-9-walk', 'To the Pool of Siloam', [[35.23, 31.78], [35.23, 31.77]], 'Jesus sends the man to wash at Siloam.')] }),
  'john-10': chapter('John 10 begins in Jerusalem at the Festival of Dedication and later notes Jesus’ ministry across the Jordan.', [locations.temple, locations.bethanyBeyondJordan]),
  'john-11': chapter('John 11 centers on Bethany, a village near Jerusalem, where Jesus raises Lazarus and the conflict surrounding him intensifies.', [locations.bethany, locations.jerusalem], { bounds: jerusalemBounds }),
  'john-12': chapter('John 12 moves from Bethany to Jerusalem as Jesus enters the city for the final week before his crucifixion.', [locations.bethany, locations.jerusalem], { bounds: jerusalemBounds, routes: [route('john-12-entry', 'Bethany to Jerusalem', [[35.27, 31.77], [35.22, 31.78]], 'Jesus enters Jerusalem from the nearby village of Bethany.')] }),
  'john-13': chapter('John 13 takes place in Jerusalem during the Passover meal, where Jesus washes his disciples’ feet and prepares them for what is ahead.', [locations.jerusalem], { bounds: jerusalemBounds }),
  'john-14': chapter('John 14 remains in Jerusalem during Jesus’ final teachings to his disciples before his arrest.', [locations.jerusalem], { bounds: jerusalemBounds }),
  'john-15': chapter('John 15 continues Jesus’ final teaching in Jerusalem, using the vine and branches to describe abiding in him.', [locations.jerusalem], { bounds: jerusalemBounds }),
  'john-16': chapter('John 16 continues the farewell teaching in Jerusalem as Jesus prepares his disciples for his departure and coming suffering.', [locations.jerusalem], { bounds: jerusalemBounds }),
  'john-17': chapter('John 17 records Jesus’ prayer in Jerusalem before he crosses the Kidron Valley.', [locations.jerusalem, locations.kidron], { bounds: jerusalemBounds }),
  'john-18': chapter('John 18 follows Jesus from the Kidron Valley to his arrest and hearings in Jerusalem.', [locations.kidron, locations.jerusalem], { bounds: jerusalemBounds, routes: [route('john-18-kidron', 'Across the Kidron Valley', [[35.22, 31.78], [35.23, 31.77]], 'Jesus crosses the Kidron Valley to the garden before his arrest.')] }),
  'john-19': chapter('John 19 is set in Jerusalem, where Jesus is tried, crucified, buried, and laid in a nearby tomb.', [locations.jerusalem], { bounds: jerusalemBounds }),
  'john-20': chapter('John 20 begins at Jesus’ tomb in Jerusalem and records resurrection appearances to the disciples there.', [locations.jerusalem], { bounds: jerusalemBounds }),
  'john-21': chapter('John 21 returns to Galilee, at the Sea of Tiberias, where the risen Jesus meets disciples by the shore.', [locations.tiberias, locations.capernaum], { bounds: galileeBounds }),
}

function chapter(summary, places, options = {}) {
  return { summary, places: places.map((entry, index) => ({ ...entry, isStoryLocation: index === 0 })), ...options }
}

function place(id, name, latitude, longitude, ancientRegion, summary) {
  return { id, name, latitude, longitude, ancientRegion, summary }
}

function route(id, name, coordinates, summary, kind = 'story', labelCoordinate = undefined) {
  return { id, name, coordinates, summary, kind, ...(labelCoordinate ? { labelCoordinate } : {}) }
}

function orientationLabelsFor(bounds) {
  if (bounds === jerusalemBounds) {
    return [
      orientation('Jerusalem', 31.795, 35.205),
      orientation('Mount of Olives', 31.783, 35.245),
      orientation('Kidron Valley', 31.765, 35.24),
    ]
  }
  if (bounds === galileeBounds) {
    return [
      orientation('Nazareth', 32.7036, 35.2956),
      orientation('Tiberias', 32.794, 35.5315),
      orientation('Safed', 32.9647, 35.496),
      orientation('Sea of Galilee', 32.84, 35.58),
      orientation('Jordan River', 32.72, 35.66),
      orientation('Israel', 32.9, 35.18),
      orientation('Jordan', 32.7, 35.81),
      orientation('Lebanon', 33.2, 35.48),
    ]
  }
  return [
    orientation('Israel', 32.02, 34.93),
    orientation('Judea', 31.64, 34.98),
    orientation('Samaria', 32.3, 35.03),
    orientation('Galilee', 32.95, 35.12),
    orientation('Jordan River', 32.5, 35.57),
    orientation('Sea of Galilee', 32.84, 35.58),
  ]
}

function orientation(name, latitude, longitude) {
  return { name, latitude, longitude }
}
