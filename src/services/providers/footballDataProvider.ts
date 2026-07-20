import {
  type FootballMatch,
  type CompetitionInfo,
  type StandingEntry,
  type ScorerEntry,
  getCompetitionFixtures,
  getCompetitions,
  getTable,
  getTopScorers,
  getWomenCompetitionFixtures,
  getWomenTable,
  getWomenTopScorers,
  getTrackedWomenCompetitions,
} from '../footballApi';
import type { FootballMatchProvider, ProviderName } from './types';

const TRACKED_CODES = ['PL', 'ELC', 'PD', 'SA', 'BL1', 'FL1', 'CL', 'DED', 'PPL', 'WC', 'EC', 'UNL', 'COPA', 'CAF', 'AFC', 'GC', 'CWC', 'OLY', 'FRI'];

const name: ProviderName = 'football-data';

export const footballDataProvider: FootballMatchProvider = {
  name,

  async getAllFixtures(): Promise<FootballMatch[]> {
    console.log(`[FDOProvider] Fetching ${TRACKED_CODES.length} competitions: ${TRACKED_CODES.join(', ')}`);
    const results = await Promise.all(
      TRACKED_CODES.map(code => getCompetitionFixtures(code))
    );
    const all: FootballMatch[] = [];
    const added = new Set<string>();
    for (const matches of results) {
      for (const m of matches) {
        if (!added.has(m.id)) {
          added.add(m.id);
          all.push(m);
        }
      }
    }
    return all;
  },

  async getCompetitions(): Promise<CompetitionInfo[]> {
    return getCompetitions();
  },

  async getTable(compCode: string): Promise<StandingEntry[]> {
    return getTable(compCode);
  },

  async getTopScorers(compCode: string): Promise<ScorerEntry[]> {
    return getTopScorers(compCode);
  },
};

const WOMENS_TRACKED_CODES = getTrackedWomenCompetitions();

export const womenFootballDataProvider = {
  async getAllFixtures(): Promise<FootballMatch[]> {
    console.log(`[FDOProvider] Fetching ${WOMENS_TRACKED_CODES.length} women competitions: ${WOMENS_TRACKED_CODES.join(', ')}`);
    const results = await Promise.all(
      WOMENS_TRACKED_CODES.map(code => getWomenCompetitionFixtures(code))
    );
    const all: FootballMatch[] = [];
    const added = new Set<string>();
    for (const matches of results) {
      for (const m of matches) {
        if (!added.has(m.id)) {
          added.add(m.id);
          all.push(m);
        }
      }
    }
    return all;
  },

  async getTable(compCode: string): Promise<StandingEntry[]> {
    return getWomenTable(compCode);
  },

  async getTopScorers(compCode: string): Promise<ScorerEntry[]> {
    return getWomenTopScorers(compCode);
  },
};
