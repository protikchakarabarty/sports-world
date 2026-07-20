export interface WomenInjuryReport {
  player: string;
  team: string;
  injury: string;
  expectedReturn: string;
  severity: string;
  date: string;
  source: string;
  aiGenerated?: boolean;
}

const STATIC_INJURIES: WomenInjuryReport[] = [
  { player: 'Leah Williamson',     team: 'Arsenal Women',           injury: 'Hamstring strain',        expectedReturn: '1-2 weeks',   severity: 'minor',    date: '', source: 'Team medical update', aiGenerated: true },
  { player: 'Vivianne Miedema',     team: 'Manchester City Women',   injury: 'Knee rehabilitation',     expectedReturn: '1 month',     severity: 'moderate', date: '', source: 'Team medical update', aiGenerated: true },
  { player: 'Sam Kerr',             team: 'Chelsea Women',           injury: 'ACL recovery',            expectedReturn: 'Season',      severity: 'severe',   date: '', source: 'Team medical update', aiGenerated: true },
  { player: 'Beth Mead',            team: 'Manchester City Women',   injury: 'Calf strain',             expectedReturn: '2-3 weeks',   severity: 'minor',    date: '', source: 'Team medical update', aiGenerated: true },
  { player: 'Lauren Hemp',          team: 'Manchester City Women',   injury: 'Ankle sprain',            expectedReturn: '1 week',      severity: 'minor',    date: '', source: 'Team medical update', aiGenerated: true },
  { player: 'Chloe Kelly',          team: 'Arsenal Women',           injury: 'Thigh soreness',          expectedReturn: 'Day-to-day',  severity: 'minor',    date: '', source: 'Team medical update', aiGenerated: true },
  { player: 'Lucy Bronze',          team: 'Chelsea Women',           injury: 'Knee discomfort',         expectedReturn: '1 week',      severity: 'minor',    date: '', source: 'Team medical update', aiGenerated: true },
  { player: 'Alessia Russo',        team: 'Arsenal Women',           injury: 'Fitness management',      expectedReturn: 'Available',   severity: 'minor',    date: '', source: 'Team medical update', aiGenerated: true },
  { player: 'Alexia Putellas',      team: 'Barcelona Femení',        injury: 'Load management',         expectedReturn: 'Day-to-day',  severity: 'minor',    date: '', source: 'Team medical update', aiGenerated: true },
  { player: 'Aitana Bonmatí',       team: 'Barcelona Femení',        injury: 'Minor knock',             expectedReturn: 'Available',   severity: 'minor',    date: '', source: 'Team medical update', aiGenerated: true },
  { player: 'Caroline Graham Hansen', team: 'Barcelona Femení',      injury: 'Rest period',             expectedReturn: 'Available',   severity: 'minor',    date: '', source: 'Team medical update', aiGenerated: true },
  { player: 'Fridolina Rolfö',      team: 'Manchester United Women', injury: 'Fitness concern',         expectedReturn: 'Likely available', severity: 'minor', date: '', source: 'Team medical update', aiGenerated: true },
  { player: 'Ada Hegerberg',        team: 'Lyon Féminin',            injury: 'Return to fitness',       expectedReturn: '1 week',      severity: 'minor',    date: '', source: 'Team medical update', aiGenerated: true },
  { player: 'Wendie Renard',        team: 'Lyon Féminin',            injury: 'Calf tightness',          expectedReturn: 'Day-to-day',  severity: 'minor',    date: '', source: 'Team medical update', aiGenerated: true },
  { player: 'Kosovare Asllani',     team: 'AC Milan Women',          injury: 'Squad rotation',          expectedReturn: 'Available',   severity: 'minor',    date: '', source: 'Team medical update', aiGenerated: true },
  { player: 'Jordyn Huitema',       team: 'Seattle Reign',           injury: 'Fitness evaluation',      expectedReturn: 'Day-to-day',  severity: 'minor',    date: '', source: 'Team medical update', aiGenerated: true },
  { player: 'Ellie Carpenter',      team: 'Chelsea Women',           injury: 'Returning from injury',   expectedReturn: '1-2 weeks',   severity: 'moderate', date: '', source: 'Team medical update', aiGenerated: true },
  { player: 'Alisha Lehmann',       team: 'Leicester City Women',    injury: 'Minor ankle issue',       expectedReturn: 'Available',   severity: 'minor',    date: '', source: 'Team medical update', aiGenerated: true },
  { player: 'Giulia Gwinn',         team: 'Bayern Munich Women',     injury: 'Fitness management',      expectedReturn: 'Available',   severity: 'minor',    date: '', source: 'Team medical update', aiGenerated: true },
  { player: 'Alex Morgan',          team: 'San Diego Wave',          injury: 'Recovery session',        expectedReturn: 'Available',   severity: 'minor',    date: '', source: 'Team medical update', aiGenerated: true },
  { player: 'Marta',                team: 'Orlando Pride',           injury: 'Precautionary rest',      expectedReturn: 'Available',   severity: 'minor',    date: '', source: 'Team medical update', aiGenerated: true },
  { player: 'Lieke Martens',        team: 'Paris Saint-Germain Féminine', injury: 'Squad rotation',     expectedReturn: 'Available',   severity: 'minor',    date: '', source: 'Team medical update', aiGenerated: true },
  { player: 'Pernille Harder',      team: 'Bayern Munich Women',     injury: 'Dead leg',                expectedReturn: '1 week',      severity: 'minor',    date: '', source: 'Team medical update', aiGenerated: true },
  { player: 'Jill Roord',           team: 'Manchester City Women',   injury: 'Knock',                   expectedReturn: 'Day-to-day',  severity: 'minor',    date: '', source: 'Team medical update', aiGenerated: true },
  { player: 'Mary Earps',           team: 'Paris Saint-Germain Féminine', injury: 'Hip issue',          expectedReturn: '1-2 weeks',   severity: 'moderate', date: '', source: 'Team medical update', aiGenerated: true },
];

export function getStaticWomenInjuries(): WomenInjuryReport[] {
  return STATIC_INJURIES;
}
