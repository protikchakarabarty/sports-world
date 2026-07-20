export interface SeriesEntry {
  id: string;
  name: string;
  type: string;
  status: string;
  startDate: string;
  endDate: string;
  gender: string;
}

const series: SeriesEntry[] = [
  // === ONGOING SERIES (July 2026) ===
  {
    id: 'series-ind-eng-2026',
    name: 'India tour of England, 2026',
    type: 'ODI',
    status: 'ongoing',
    startDate: '2026-07-12',
    endDate: '2026-07-22',
    gender: 'men',
  },
  {
    id: 'series-nz-wi-2026',
    name: 'New Zealand tour of West Indies, 2026',
    type: 'ODI',
    status: 'ongoing',
    startDate: '2026-07-10',
    endDate: '2026-07-22',
    gender: 'men',
  },
  {
    id: 'series-zim-ban-2026',
    name: 'Bangladesh tour of Zimbabwe, 2026',
    type: 'T20',
    status: 'ongoing',
    startDate: '2026-07-15',
    endDate: '2026-07-19',
    gender: 'men',
  },
  {
    id: 'series-pak-wi-2026',
    name: 'Pakistan tour of West Indies, 2026',
    type: 'Test',
    status: 'ongoing',
    startDate: '2026-07-18',
    endDate: '2026-08-05',
    gender: 'men',
  },
  {
    id: 'series-cwc-league2-2023-27',
    name: 'ICC Cricket World Cup League Two 2023-27',
    type: 'ODI',
    status: 'ongoing',
    startDate: '2023-01-01',
    endDate: '2027-12-31',
    gender: 'men',
  },
  {
    id: 'series-zim-ban-test-2026',
    name: 'Bangladesh tour of Zimbabwe, 2026',
    type: 'Test',
    status: 'ongoing',
    startDate: '2026-07-22',
    endDate: '2026-07-30',
    gender: 'men',
  },
  // === WOMEN'S ONGOING SERIES ===
  {
    id: 'series-womens-eng-ind-2026',
    name: 'England Women in India ODI Series, 2026',
    type: 'ODI',
    status: 'ongoing',
    startDate: '2026-06-28',
    endDate: '2026-07-18',
    gender: 'women',
  },
  {
    id: 'series-womens-zim-ban-2026',
    name: 'Bangladesh Women tour of Zimbabwe, 2026',
    type: 'T20',
    status: 'ongoing',
    startDate: '2026-07-10',
    endDate: '2026-07-18',
    gender: 'women',
  },
  {
    id: 'series-womens-wi-pak-2026',
    name: 'Pakistan Women tour of West Indies, 2026',
    type: 'T20',
    status: 'ongoing',
    startDate: '2026-07-17',
    endDate: '2026-08-01',
    gender: 'women',
  },

  // === UPCOMING SERIES (late July - August 2026) ===
  {
    id: 'series-sl-ind-2026',
    name: 'India tour of Sri Lanka, 2026',
    type: 'ODI',
    status: 'upcoming',
    startDate: '2026-07-27',
    endDate: '2026-08-05',
    gender: 'men',
  },
  {
    id: 'series-afg-zim-2026',
    name: 'Afghanistan tour of Zimbabwe, 2026',
    type: 'T20',
    status: 'upcoming',
    startDate: '2026-07-28',
    endDate: '2026-08-10',
    gender: 'men',
  },
  {
    id: 'series-eng-sl-2026',
    name: 'Sri Lanka tour of England, 2026',
    type: 'Test',
    status: 'upcoming',
    startDate: '2026-08-10',
    endDate: '2026-08-31',
    gender: 'men',
  },
  {
    id: 'series-sa-wi-2026',
    name: 'South Africa tour of West Indies, 2026',
    type: 'T20',
    status: 'upcoming',
    startDate: '2026-08-12',
    endDate: '2026-08-22',
    gender: 'men',
  },
  // === WOMEN'S UPCOMING SERIES ===
  {
    id: 'series-womens-ind-eng-upcoming-2026',
    name: 'India Women in England Test Series, 2026',
    type: 'Test',
    status: 'upcoming',
    startDate: '2026-07-20',
    endDate: '2026-08-05',
    gender: 'women',
  },
  {
    id: 'series-womens-nam-quad-2026',
    name: 'Women T20I Quadrangular Series (Namibia), 2026',
    type: 'T20',
    status: 'upcoming',
    startDate: '2026-07-21',
    endDate: '2026-07-26',
    gender: 'women',
  },
  {
    id: 'series-womens-wi-nz-2026',
    name: 'New Zealand Women tour of West Indies, 2026',
    type: 'T20',
    status: 'upcoming',
    startDate: '2026-07-25',
    endDate: '2026-08-10',
    gender: 'women',
  },
];

export function getUpcomingSeries(): SeriesEntry[] {
  return series;
}
