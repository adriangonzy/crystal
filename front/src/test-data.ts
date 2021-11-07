export const lineData = [
  {
    id: 'jungle freaks',
    color: '#5e32e1',
    data: [
      {
        x: '01',
        y: 290,
      },
      {
        x: '02',
        y: 115,
      },
      {
        x: '03',
        y: 33,
      },
      {
        x: '04',
        y: 83,
      },
      {
        x: '05',
        y: 9,
      },
      {
        x: '06',
        y: 55,
      },
      {
        x: '07',
        y: 71,
      },
      {
        x: '08',
        y: 75,
      },
      {
        x: '09',
        y: 270,
      },
      {
        x: '10',
        y: 257,
      },
      {
        x: '11',
        y: 249,
      },
      {
        x: '12',
        y: 28,
      },
    ],
  },
  {
    id: 'pepemon',
    color: '#00ffff',
    data: [
      {
        x: '01',
        y: 185,
      },
      {
        x: '02',
        y: 264,
      },
      {
        x: '03',
        y: 199,
      },
      {
        x: '04',
        y: 262,
      },
      {
        x: '05',
        y: 35,
      },
      {
        x: '06',
        y: 137,
      },
      {
        x: '07',
        y: 184,
      },
      {
        x: '08',
        y: 144,
      },
      {
        x: '09',
        y: 226,
      },
      {
        x: '10',
        y: 257,
      },
      {
        x: '11',
        y: 197,
      },
      {
        x: '12',
        y: 138,
      },
    ],
  },
]

export const tableColumns = [
  {
    Header: 'Collection',
    accessor: 'collection', // accessor is the "key" in the data
  },
  {
    Header: 'Floor Today',
    accessor: 'floor-today',
  },
  {
    Header: 'Floor yesterday',
    accessor: 'floor-yesterday',
  },
]

export const tableData = [
  {
    collection: 'Jungle Freaks',
    'floor-today': '1 eth',
    'floor-yesterday': '1.5 eth',
  },
  {
    collection: 'Pepemon',
    'floor-today': '10 eth',
    'floor-yesterday': '11.5 eth',
  },
  {
    collection: 'Punkachiens',
    'floor-today': '100 eth',
    'floor-yesterday': '130 eth',
  },
]
