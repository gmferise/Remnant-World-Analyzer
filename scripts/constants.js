/// GLOBAL VARS & CONSTANTS

const regions = [
  'Earth',
  'Rhom',
  'Corsus',
  'Yaesha',
  'Reisum',
];

const events = [
  'Item',
  'Side Dungeon',
  'Siege',
  'Point of Interest',
  'Mini-Boss',
  'World Boss',
];

const sublocations = {
  RootCultist: 'MarrowPass',
  RootWraith: 'TheHiddenSanctum',
  RootBrute: 'SunkenPassage',
  Brabus: 'CutthroatChannel',
  RootTumbleweed: 'TheTangledPass',
  RootEnt: 'TheChokingHollow',
  RootDragon: 'TheAshYard',
  HuntersHideout: 'HiddenGrotto',
  MadMerchant: 'Junktown',
  LizAndLiz: 'TheWarren',
  LastWill: 'FindMonkeyKey',
  RootShrine: 'TheGallows',
  SwarmMaster: 'TheIronRift',
  HoundMaster: 'TheBurrows',
  Sentinel: 'ShackledCanyon',
  Vyr: 'TheArdentTemple',
  WastelandGuardian: 'LoomOfTheBlackSun',
  TheHarrow: 'TheBunker',
  TheLostGantry: 'ConcourseOfTheSun',
  ArmorVault: 'VaultOfTheHeralds',
  TheCleanRoom: 'ThePurgeHall',
  SlimeHulk: 'TheDrownedTrench',
  Fatty: 'TheFetidGlade',
  Tyrant: 'TheCapillary',
  SwampGuardian: 'The Grotto',
  KinCaller: 'TheHallOfJudgement',
  BlinkFiend: 'Widow\'sPass',
  StuckMerchant: 'MerchantDungeon',
  BlinkThief: 'ForgottenUndercroft',
  StormCaller: 'Heretic\'sNest',
  ImmolatorAndZephyr: 'WitheringVillage',
  Wolf: 'TheScaldingGlade',
  TotemFather: 'TheScaldingGlade',
  TheRisen: 'Ahanae\'sLament',
  DoeShrine: 'Widow\'sVestry',
  WolfShrine: 'Martyr\'sSanctuary',
  Splitter: 'ResearchStationAlpha',
  BarbTerror: 'NeedleLair',
  QueensTemple: 'IskalTemple',
  BrainBug: 'StrangePass',
  Wisp: 'CircletHatchery',
  FetidPool: 'FetidPools',
  FlickeringHorror: 'HallOfWhispers',
};

const mainLocations = {
  'City Overworld Zone1': 'Fairview',
  'City Overworld Zone2': 'Westcourt',
  'Wasteland Overworld Zone1': 'TheEasternWind',
  'Wasteland Overworld Zone2': 'TheScouringWaste',
  'Jungle Overworld Zone1': 'TheVerdantStrand',
  'Jungle Overworld Zone2': 'TheScaldingGlade',
  'Swamp Overworld Zone1': 'TheFetidGlade',
  'Swamp Overworld Zone2': 'TheMistFen',
};

const eventNameOverrides = {
  // Bosses
  FlickeringHorror: 'DreamEater',
  Wisp: 'HiveWisps',
  TheRisen: 'Reanimators',
  LizAndLiz: 'LizChicagoTypewriter',
  Fatty: 'TheUncleanOne',
  WastelandGuardian: 'Claviger',
  RootEnt: 'EntBoss',
  Wolf: 'TheRavager',
  RootDragon: 'Singe',
  SwarmMaster: 'Scourge',
  RootWraith: 'Shroud',
  RootTumbleweed: 'TheMangler',
  Kincaller: 'Warden',
  Tyrant: 'Thrall',
  Vyr: 'ShadeAndShatter',
  ImmolatorAndZephyr: 'ScaldAndSear',
  RootBrute: 'Gorefist',
  SlimeHulk: 'Canker',
  BlinkFiend: 'Onslaught',
  Sentinel: 'Raze',
  Penitent: 'Letos Amulet',
  LastWill: 'SupplyRunAssaultRifle',
  SwampGuardian: 'Ixillis',
  Splitter: 'RiphideLetosArmor',
  // Items
  GunslignersRing: 'GunslingersRing', // yes... they actually made this typo in the save files
};

export {
  regions,
  events,
  sublocations,
  eventNameOverrides,
};
