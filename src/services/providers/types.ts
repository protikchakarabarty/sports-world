import type { FootballMatch, CompetitionInfo, StandingEntry, ScorerEntry } from '../footballApi';

export type ProviderName = 'sportmonks' | 'football-data';

export interface FootballMatchProvider {
  readonly name: ProviderName;
  getAllFixtures(from: string, to: string): Promise<FootballMatch[]>;
  getCompetitions(): Promise<CompetitionInfo[]>;
  getTable(compCode: string): Promise<StandingEntry[]>;
  getTopScorers(compCode: string): Promise<ScorerEntry[]>;
}

export interface ProviderFixtureResult {
  matches: FootballMatch[];
  source: ProviderName | 'merged';
}

export interface ProviderCompetitionResult {
  competitions: CompetitionInfo[];
  source: ProviderName;
}

export interface ProviderTableResult {
  standings: StandingEntry[];
  source: ProviderName;
}

export interface ProviderTopScorerResult {
  scorers: ScorerEntry[];
  source: ProviderName;
}
