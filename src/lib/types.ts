export type Champion = {
  player: string;
  time: string;
  timeMs: number;
  country: string;
  region: string;
  character: string;
  vehicle: string;
  controller: string;
  anomalous: boolean;
  rank: number;
};

export type CompetitionSummary = {
  id: number;
  start: string;
  end: string;
  course: string;
  description: string;
  restrictions: string;
  repeatOf: number | null;
  worldwideCount: number;
  regionCounts: {
    Japan: number;
    "North America": number;
    Europe: number;
    Australia: number;
    Korea: number;
  };
  official: Champion | null;
  champion: Champion | null;
};

export type Catalog = {
  scrapedAt: string;
  source: string;
  wiki: string;
  anomalyThresholdMs: number;
  totalRows: number;
  competitions: CompetitionSummary[];
};

export type Leader = {
  player: string;
  count: number;
  competitions: number[];
};

export type Leaders = {
  world: Leader[];
  europe: Leader[];
  japan: Leader[];
  northAmerica: Leader[];
  australia: Leader[];
  korea: Leader[];
  podiums: Leader[];
};

export type RankingEntry = {
  rank: number;
  player: string;
  time: string;
  timeMs: number;
  region: string;
  country: string;
  character: string;
  vehicle: string;
  controller: string;
  date: string;
};

export type RankingFile = {
  id: number;
  complete: boolean;
  worldwide: RankingEntry[];
  regions: {
    Japan: RankingEntry[];
    "North America": RankingEntry[];
    Europe: RankingEntry[];
    Australia: RankingEntry[];
    Korea: RankingEntry[];
  };
};

export type PlayerRecord = {
  name: string;
  worldTitles: number[];
  japanTitles: number[];
  northAmericaTitles: number[];
  europeTitles: number[];
  australiaTitles: number[];
  koreaTitles: number[];
  podiums: number[];
  results: [number, string, number, number][];
};
