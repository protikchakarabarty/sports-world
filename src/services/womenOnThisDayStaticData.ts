import type { OnThisDayEntry } from '@/types';

interface StaticPlayer {
  name: string;
  bm: number; bd: number; by: number;
  dm?: number; dd?: number; dy?: number;
  country: string;
  club: string;
  desc: string;
  img: string;
}

const STATIC_PLAYERS: StaticPlayer[] = [
  // January
  { name: 'Aitana Bonmatí',   bm:1,bd:18,by:1998, country:'Spain',       club:'Barcelona',      desc:'Spanish midfielder, Ballon d\'Or Féminin winner 2023 & 2024', img:'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/25th_Laureus_World_Sports_Awards_-_240422_214032.jpg/330px-25th_Laureus_World_Sports_Awards_-_240422_214032.jpg' },
  { name: 'Alisha Lehmann',   bm:1,bd:21,by:1999, country:'Switzerland',  club:'Leicester City', desc:'Swiss forward, one of the most followed footballers on social media', img:'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Lewes_FC_Women_0_West_Ham_Utd_Women_5_pre_season_12_08_2018-614_%2829081676397%29_%28cropped%29.jpg/330px-Lewes_FC_Women_0_West_Ham_Utd_Women_5_pre_season_12_08_2018-614_%2829081676397%29_%28cropped%29.jpg' },
  { name: 'Julie Foudy',      bm:1,bd:23,by:1971, country:'United States',club:'—',              desc:'American midfielder, two-time World Cup winner, Olympic gold medalist', img:'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Julie_Foudy_portrait_shot_2014.jpg/330px-Julie_Foudy_portrait_shot_2014.jpg' },
  { name: 'Louisa Necib',     bm:1,bd:23,by:1987, country:'France',       club:'Lyon',           desc:'French midfielder, known for her technical skill and creativity', img:'' },
  { name: 'Sakina Karchaoui', bm:1,bd:26,by:1996, country:'France',       club:'Paris Saint-Germain', desc:'French left-back, known for pace and dribbling', img:'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Sakina_Karchaoui_PSG-ManU.png/330px-Sakina_Karchaoui_PSG-ManU.png' },
  { name: 'Georgia Stanway',  bm:1,bd:3,by:1999,  country:'England',      club:'Bayern Munich',   desc:'English midfielder, Euro 2022 winner', img:'' },

  // February
  { name: 'Michelle Akers',    bm:2,bd:1,by:1966,  country:'United States',club:'—',              desc:'American forward, 1991 World Cup top scorer with 10 goals', img:'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Michelle_Akers_USWNT_v_Colombia_Mar_7_2026-54_%28cropped%29.jpg/330px-Michelle_Akers_USWNT_v_Colombia_Mar_7_2026-54_%28cropped%29.jpg' },
  { name: 'Alexia Putellas',   bm:2,bd:4,by:1994,  country:'Spain',        club:'Barcelona',       desc:'Spanish midfielder, two-time Ballon d\'Or Féminin winner', img:'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/UWCL_2025-26_Final_C16.jpg/330px-UWCL_2025-26_Final_C16.jpg' },
  { name: 'Delphine Cascarino',bm:2,bd:5,by:1997, country:'France',       club:'Lyon',            desc:'French winger, known for speed and dribbling', img:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Delphine_Cascarino_WCL_2019.jpg/330px-Delphine_Cascarino_WCL_2019.jpg' },
  { name: 'Stina Blackstenius',bm:2,bd:5,by:1996, country:'Sweden',       club:'Arsenal',          desc:'Swedish forward, Olympic silver medalist 2021', img:'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Sweden_-_Serbia_09_%28cropped%29.jpg/330px-Sweden_-_Serbia_09_%28cropped%29.jpg' },
  { name: 'Alessia Russo',     bm:2,bd:8,by:1999,  country:'England',      club:'Arsenal',          desc:'English forward, Euro 2022 winner', img:'' },
  { name: 'Joy Fawcett',       bm:2,bd:8,by:1968,  country:'United States',club:'—',               desc:'American defender, two-time World Cup winner', img:'' },
  { name: 'Pia Sundhage',      bm:2,bd:13,by:1960, country:'Sweden',       club:'—',               desc:'Swedish footballer and manager, coached USWNT to Olympic gold', img:'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Pia_Sundhage_Jan_2013.jpg/330px-Pia_Sundhage_Jan_2013.jpg' },
  { name: 'Sara Däbritz',      bm:2,bd:15,by:1995, country:'Germany',      club:'Lyon',            desc:'German midfielder, Olympic gold medalist 2016', img:'https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/2023-06-26_Fussball%2C_Frauen%2C_Deutsche_Nationalmannschaft%2C_Media_Day_1DX_6292_by_Stepro.jpg/330px-2023-06-26_Fussball%2C_Frauen%2C_Deutsche_Nationalmannschaft%2C_Media_Day_1DX_6292_by_Stepro.jpg' },
  { name: 'Lotta Ökvist',      bm:2,bd:17,by:1997, country:'Sweden',       club:'Hammarby',        desc:'Swedish defender', img:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/20250308%2C_Svenska_Cupen%2C_Alings%C3%A5s_-_Hammarby_057_%28cropped%29.jpg/330px-20250308%2C_Svenska_Cupen%2C_Alings%C3%A5s_-_Hammarby_057_%28cropped%29.jpg' },
  { name: 'Caroline Graham Hansen',bm:2,bd:18,by:1995, country:'Norway',   club:'Barcelona',       desc:'Norwegian winger, known for dribbling and creativity', img:'https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Brann_-_Bar%C3%A7a_Femen%C3%AD_CG3A7081_%28cropped%29.jpg/330px-Brann_-_Bar%C3%A7a_Femen%C3%AD_CG3A7081_%28cropped%29.jpg' },
  { name: 'Marta',             bm:2,bd:19,by:1986,  country:'Brazil',      club:'Orlando Pride',    desc:'Brazilian forward, six-time FIFA World Player of the Year', img:'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/NC_Courage_vs_Orlando_Pride_%28Jun_2024%29_073_%28cropped%29.jpg/330px-NC_Courage_vs_Orlando_Pride_%28Jun_2024%29_073_%28cropped%29.jpg' },
  { name: 'April Heinrichs',   bm:2,bd:27,by:1964, country:'United States',club:'—',              desc:'American forward, captain of 1991 World Cup winning team', img:'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/April_Heinrichs.jpg/330px-April_Heinrichs.jpg' },

  // March
  { name: 'Formiga',           bm:3,bd:3,by:1978,  country:'Brazil',      club:'—',              desc:'Brazilian midfielder, played in 7 World Cups — a record', img:'' },
  { name: 'Mary Earps',        bm:3,bd:7,by:1993,  country:'England',      club:'Paris Saint-Germain', desc:'English goalkeeper, Euro 2022 winner, World Cup 2023 Golden Glove', img:'' },
  { name: 'Nikita Parris',     bm:3,bd:10,by:1994, country:'England',     club:'Brighton',        desc:'English forward, Euro 2022 winner', img:'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Nikita_Parris_2023.jpg/330px-Nikita_Parris_2023.jpg' },
  { name: 'Mia Hamm',          bm:3,bd:17,by:1972, country:'United States',club:'—',              desc:'American forward, two-time World Cup winner, two-time Olympic gold medalist', img:'https://upload.wikimedia.org/wikipedia/commons/3/3e/Mia_Hamm_corner_%28cropped%29.jpg' },
  { name: 'Geyse',             bm:3,bd:27,by:1998, country:'Brazil',      club:'Manchester United', desc:'Brazilian forward, known for pace and skill', img:'' },
  { name: 'Leah Williamson',   bm:3,bd:29,by:1997, country:'England',     club:'Arsenal',          desc:'English defender, captain of Euro 2022 winning team', img:'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Lionesses_Victory_Parade_2025_%2854687088710%29_%28cropped_-_Williamson%29.jpg/330px-Lionesses_Victory_Parade_2025_%2854687088710%29_%28cropped_-_Williamson%29.jpg' },

  // April
  { name: 'Kadidiatou Diani',  bm:4,bd:1,by:1995,  country:'France',      club:'Lyon',            desc:'French forward, known for speed and power', img:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Kadidiatou_Diani_%282%29.jpg/330px-Kadidiatou_Diani_%282%29.jpg' },
  { name: 'Sun Wen',           bm:4,bd:6,by:1973,  country:'China',        club:'—',               desc:'Chinese forward, FIFA World Player of the Year 1999', img:'' },
  { name: 'Alexandra Popp',    bm:4,bd:6,by:1991,  country:'Germany',      club:'VfL Wolfsburg',   desc:'German striker, Olympic gold medalist 2016', img:'https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/2023_Alexandra_Popp_%28cropped%29.jpg/330px-2023_Alexandra_Popp_%28cropped%29.jpg' },
  { name: 'Julie Ertz',        bm:4,bd:6,by:1992,  country:'United States',club:'—',               desc:'American defender/midfielder, World Cup winner 2015 & 2019', img:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/2025_Julie_Ertz_%28cropped%29.jpg/330px-2025_Julie_Ertz_%28cropped%29.jpg' },
  { name: 'Jordyn Huitema',    bm:4,bd:6,by:2001,  country:'Canada',       club:'Seattle Reign',   desc:'Canadian forward, Olympic gold medalist 2021', img:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Jordyn_Huitema_Canada_v_Argentina_Mar_7_2026-29_%28cropped%29.jpg/330px-Jordyn_Huitema_Canada_v_Argentina_Mar_7_2026-29_%28cropped%29.jpg' },
  { name: 'Keira Walsh',       bm:4,bd:8,by:1997,  country:'England',      club:'Barcelona',       desc:'English midfielder, Euro 2022 winner, most expensive transfer', img:'' },
  { name: 'Hanna Glas',        bm:4,bd:16,by:1993, country:'Sweden',       club:'Bayern Munich',    desc:'Swedish defender, Olympic silver medalist 2021', img:'' },
  { name: 'Dzsenifer Marozsán',bm:4,bd:18,by:1992,country:'Germany',      club:'Lyon',            desc:'German midfielder, Olympic gold medalist 2016', img:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Dzsenifer_Marozs%C3%A1n_%28croped%29.jpg/330px-Dzsenifer_Marozs%C3%A1n_%28croped%29.jpg' },
  { name: 'Jill Roord',        bm:4,bd:22,by:1997, country:'Netherlands',  club:'Manchester City', desc:'Dutch midfielder, Euro 2017 winner', img:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Jill_Roord_20180506.jpg/330px-Jill_Roord_20180506.jpg' },
  { name: 'Ellie Carpenter',   bm:4,bd:28,by:2000, country:'Australia',    club:'Chelsea',         desc:'Australian right-back, Olympic bronze medalist 2021', img:'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/20250905-Ellie_Carpenter.jpg/330px-20250905-Ellie_Carpenter.jpg' },

  // May
  { name: 'Thembi Kgatlana',   bm:5,bd:2,by:1996,  country:'South Africa',club:'San Diego Wave', desc:'South African forward, African Women\'s Footballer of the Year 2018', img:'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/2023_NWSL_Challenge_Cup_final%2C_396_%28Kgatlana%29.jpg/330px-2023_NWSL_Challenge_Cup_final%2C_396_%28Kgatlana%29.jpg' },
  { name: 'Cindy Parlow Cone', bm:5,bd:8,by:1978,  country:'United States',club:'—',              desc:'American midfielder, World Cup winner 1999', img:'' },
  { name: 'Beth Mead',         bm:5,bd:9,by:1995,  country:'England',      club:'Manchester City', desc:'English forward, Euro 2022 Golden Boot winner', img:'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Eng_Women_0_Czech_Rep_0_11_10_2022-225_%2852426070932%29_%28cropped%29.jpg/330px-Eng_Women_0_Czech_Rep_0_11_10_2022-225_%2852426070932%29_%28cropped%29.jpg' },
  { name: 'Ellen White',       bm:5,bd:9,by:1989,  country:'England',      club:'—',              desc:'English forward, all-time top scorer for England women', img:'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Ellen_White_47986452323_james_boyes_%28cropped%29.jpg/330px-Ellen_White_47986452323_james_boyes_%28cropped%29.jpg' },
  { name: 'Carla Overbeck',    bm:5,bd:9,by:1968,  country:'United States',club:'—',              desc:'American defender, captain of 1999 World Cup winning team', img:'' },
  { name: 'Tabitha Chawinga',  bm:5,bd:11,by:1996, country:'Malawi',      club:'Lyon',            desc:'Malawian forward, first African player to win UEFA Women\'s Champions League', img:'' },
  { name: 'Rose Lavelle',      bm:5,bd:14,by:1995, country:'United States',club:'Seattle Reign',  desc:'American midfielder, World Cup winner 2019, Bronze Ball winner', img:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Rose_Lavelle_USWNT_vs_Italy_Nov_28_2025-186_%28cropped%29.jpg/330px-Rose_Lavelle_USWNT_vs_Italy_Nov_28_2025-186_%28cropped%29.jpg' },
  { name: 'Cristiane',         bm:5,bd:15,by:1985, country:'Brazil',      club:'Flamengo',        desc:'Brazilian forward, Olympic silver medalist 2004 & 2008', img:'' },
  { name: 'Eugénie Le Sommer', bm:5,bd:18,by:1989, country:'France',      club:'Toluca',          desc:'French forward, all-time top scorer for France', img:'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Eug%C3%A9nie_Le_Sommer_Coupe_2018_cropped.jpg/330px-Eug%C3%A9nie_Le_Sommer_Coupe_2018_cropped.jpg' },
  { name: 'Tobin Heath',       bm:5,bd:29,by:1988, country:'United States',club:'—',              desc:'American winger, two-time World Cup winner, Olympic gold medalist', img:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Tobin_Heath_USWNT_vs_Paraguay%2C_2021-09-16_%28cropped%29.jpg/330px-Tobin_Heath_USWNT_vs_Paraguay%2C_2021-09-16_%28cropped%29.jpg' },
  { name: 'Sherida Spitse',    bm:5,bd:29,by:1990, country:'Netherlands',  club:'Ajax',           desc:'Dutch midfielder, Euro 2017 winner, most capped Dutch player', img:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Sherida_Spitse_2014_%28cropped%29.jpg/330px-Sherida_Spitse_2014_%28cropped%29.jpg' },

  // June
  { name: 'Abby Wambach',      bm:6,bd:2,by:1980,  country:'United States',club:'—',              desc:'American forward, all-time second highest international goal scorer', img:'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Wambach-cropped.jpg/330px-Wambach-cropped.jpg' },
  { name: 'Becky Sauerbrunn',  bm:6,bd:6,by:1985,  country:'United States',club:'—',              desc:'American center-back, World Cup winner 2015 & 2019', img:'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Becky_Sauerbrunn_%2849628077113%29_%28cropped%29.jpg/330px-Becky_Sauerbrunn_%2849628077113%29_%28cropped%29.jpg' },
  { name: 'Christine Sinclair',bm:6,bd:12,by:1983, country:'Canada',       club:'—',              desc:'Canadian forward, all-time top international goal scorer', img:'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Christine_Sinclair_2016_%283x4_cropped%29.jpg/330px-Christine_Sinclair_2016_%283x4_cropped%29.jpg' },
  { name: 'Fran Kirby',        bm:6,bd:29,by:1993, country:'England',      club:'Brighton',        desc:'English attacking midfielder, Euro 2022 winner', img:'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/BHA_Women_2_MUFC_Women_3_02_11_2025-2105_%28cropped%29.jpg/330px-BHA_Women_2_MUFC_Women_3_02_11_2025-2105_%28cropped%29.jpg' },

  // July
  { name: 'Alex Morgan',       bm:7,bd:2,by:1989,  country:'United States',club:'—',              desc:'American forward, World Cup winner 2015 & 2019', img:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Alex_Morgan_May19.jpg/330px-Alex_Morgan_May19.jpg' },
  { name: 'Giulia Gwinn',      bm:7,bd:2,by:1999,  country:'Germany',      club:'Bayern Munich',   desc:'German right-back/midfielder, Euro 2025 winner', img:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/2022-06-24_Fussball%2C_Frauen%2C_L%C3%A4nderspiel%2C_Deutschland_-_Schweiz_1DX_0701_by_Stepro.jpg/330px-2022-06-24_Fussball%2C_Frauen%2C_L%C3%A4nderspiel%2C_Deutschland_-_Schweiz_1DX_0701_by_Stepro.jpg' },
  { name: 'Grace Geyoro',      bm:7,bd:2,by:1997,  country:'France',       club:'Paris Saint-Germain', desc:'French midfielder, known for box-to-box play', img:'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Grace_Geyoro_%28PSG_in_Qatar%29.png/330px-Grace_Geyoro_%28PSG_in_Qatar%29.png' },
  { name: 'Megan Rapinoe',     bm:7,bd:5,by:1985,  country:'United States',club:'—',              desc:'American winger, Ballon d\'Or Féminin 2019, World Cup winner', img:'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Megan_Rapinoe_%2848675274817%29_%28cropped%29.jpg/330px-Megan_Rapinoe_%2848675274817%29_%28cropped%29.jpg' },
  { name: 'Ada Hegerberg',     bm:7,bd:10,by:1995, country:'Norway',      club:'Lyon',            desc:'Norwegian striker, first Ballon d\'Or Féminin winner 2018', img:'https://upload.wikimedia.org/wikipedia/commons/e/e2/AHegerberg.jpg' },
  { name: 'Vivianne Miedema',  bm:7,bd:15,by:1996, country:'Netherlands', club:'Manchester City', desc:'Dutch forward, all-time top scorer in WSL', img:'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Miedemavliverpool.jpg/330px-Miedemavliverpool.jpg' },
  { name: 'Carli Lloyd',       bm:7,bd:16,by:1982, country:'United States',club:'—',              desc:'American midfielder, two-time World Cup winner, two-time Olympic gold medalist', img:'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Carli_Lloyd_Paley_Center_Fox_Sports_Soccer-16.jpg/330px-Carli_Lloyd_Paley_Center_Fox_Sports_Soccer-16.jpg' },
  { name: 'Hege Riise',        bm:7,bd:18,by:1969, country:'Norway',      club:'—',              desc:'Norwegian midfielder, World Cup winner 1995, Olympic gold 2000', img:'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Hege_Riise_%282017%29.jpg/330px-Hege_Riise_%282017%29.jpg' },
  { name: 'Wendie Renard',     bm:7,bd:20,by:1990, country:'France',      club:'Lyon',            desc:'French center-back, all-time most appearances for Lyon', img:'https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/2019-05-17_Fu%C3%9Fball%2C_Frauen%2C_UEFA_Women%27s_Champions_League%2C_Olympique_Lyonnais_-_FC_Barcelona_StP_0635_LR10_by_Stepro.jpg/330px-2019-05-17_Fu%C3%9Fball%2C_Frauen%2C_UEFA_Women%27s_Champions_League%2C_Olympique_Lyonnais_-_FC_Barcelona_StP_0635_LR10_by_Stepro.jpg' },
  { name: 'Brandi Chastain',   bm:7,bd:21,by:1968, country:'United States',club:'—',              desc:'American defender, scored winning penalty in 1999 World Cup final', img:'' },
  { name: 'Kristine Lilly',    bm:7,bd:22,by:1971, country:'United States',club:'—',              desc:'American midfielder, most capped player in football history (354 caps)', img:'https://upload.wikimedia.org/wikipedia/commons/9/96/Kristine_Lilly_2015.jpg' },
  { name: 'Hope Solo',         bm:7,bd:30,by:1981, country:'United States',club:'—',              desc:'American goalkeeper, World Cup winner 2015, two-time Olympic gold medalist', img:'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Hope_Solo_USA_Training_%28edited%29.jpg/330px-Hope_Solo_USA_Training_%28edited%29.jpg' },

  // August
  { name: 'Lauren Hemp',       bm:8,bd:7,by:2000,  country:'England',      club:'Manchester City', desc:'English winger, Euro 2022 winner, PFA Young Player of the Year', img:'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/20250905-Lauren_Hemp.jpg/330px-20250905-Lauren_Hemp.jpg' },
  { name: 'Lina Magull',       bm:8,bd:15,by:1994, country:'Germany',      club:'Inter Milan',     desc:'German midfielder, Euro 2022 Golden Player Award', img:'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/2025-04-08_Fussball%2C_UEFA_Women%27s_Nations_League%2C_Deutschland_-_Schottland_STP_2060.jpg/330px-2025-04-08_Fussball%2C_UEFA_Women%27s_Nations_League%2C_Deutschland_-_Schottland_STP_2060.jpg' },
  { name: 'Millie Bright',     bm:8,bd:21,by:1993, country:'England',      club:'Chelsea',          desc:'English center-back, Euro 2022 winner, World Cup 2023 runner-up', img:'' },
  { name: 'Kosovare Asllani',  bm:8,bd:31,by:1989, country:'Sweden',       club:'AC Milan',        desc:'Swedish forward/midfielder, Olympic silver medalist 2021', img:'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Kosovare_Asllani_2021.jpg/330px-Kosovare_Asllani_2021.jpg' },

  // September
  { name: 'Ella Toone',        bm:9,bd:2,by:1999,  country:'England',      club:'Manchester United', desc:'English attacking midfielder, Euro 2022 winner', img:'' },
  { name: 'Homare Sawa',       bm:9,bd:6,by:1978,  country:'Japan',        club:'—',               desc:'Japanese midfielder, World Cup winner 2011, Ballon d\'Or 2011', img:'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Homare_Sawa_2015_%28cropped%29.jpg/330px-Homare_Sawa_2015_%28cropped%29.jpg' },
  { name: 'Sam Kerr',          bm:9,bd:10,by:1993, country:'Australia',    club:'Chelsea',          desc:'Australian forward, all-time top scorer for Australia and Chelsea', img:'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Sam_Kerr_%28Women_World_Cup_France_2019%29.jpg/330px-Sam_Kerr_%28Women_World_Cup_France_2019%29.jpg' },
  { name: 'Amandine Henry',    bm:9,bd:28,by:1989, country:'France',       club:'Toluca',           desc:'French defensive midfielder, World Cup runner-up 2019', img:'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/2019-05-17_Fu%C3%9Fball%2C_Frauen%2C_UEFA_Women%27s_Champions_League%2C_Olympique_Lyonnais_-_FC_Barcelona_StP_0709_LR10_by_Stepro.jpg/330px-2019-05-17_Fu%C3%9Fball%2C_Frauen%2C_UEFA_Women%27s_Champions_League%2C_Olympique_Lyonnais_-_FC_Barcelona_StP_0709_LR10_by_Stepro.jpg' },
  { name: 'Lauren James',      bm:9,bd:29,by:2001, country:'England',      club:'Chelsea',           desc:'English forward, known for creativity and dribbling', img:'' },

  // October
  { name: 'Shanice van de Sanden',bm:10,bd:2,by:1992, country:'Netherlands',club:'Liverpool',      desc:'Dutch winger, Euro 2017 winner, known for speed', img:'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/2019-05-18_Fu%C3%9Fball%2C_Frauen%2C_UEFA_Women%27s_Champions_League%2C_Olympique_Lyonnais_-_FC_Barcelona_StP_1098_LR10_by_Stepro.jpg/330px-2019-05-18_Fu%C3%9Fball%2C_Frauen%2C_UEFA_Women%27s_Champions_League%2C_Olympique_Lyonnais_-_FC_Barcelona_StP_1098_LR10_by_Stepro.jpg' },
  { name: 'Ana-Maria Crnogorčević',bm:10,bd:3,by:1990, country:'Switzerland',club:'Strasbourg',    desc:'Swiss winger/right-back, known for crossing ability', img:'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/2011-08_Ana-Maria_Crnogor%C4%8Devi%C4%87.JPG/330px-2011-08_Ana-Maria_Crnogor%C4%8Devi%C4%87.JPG' },
  { name: 'Asisat Oshoala',    bm:10,bd:9,by:1994, country:'Nigeria',      club:'Al Hilal',        desc:'Nigerian forward, African Women\'s Footballer of the Year six times', img:'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/NC_Courage_vs_Bay_FC_%28Apr_2025%29_009_%28cropped%29.jpg/330px-NC_Courage_vs_Bay_FC_%28Apr_2025%29_009_%28cropped%29.jpg' },
  { name: 'Debinha',           bm:10,bd:20,by:1991, country:'Brazil',      club:'Kansas City Current', desc:'Brazilian forward, Olympic silver medalist 2024', img:'' },
  { name: 'Birgit Prinz',      bm:10,bd:25,by:1977, country:'Germany',     club:'—',              desc:'German forward, two-time World Cup winner, three-time FIFA World Player of the Year', img:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Birgit_Prinz_20180519_%28cropped%29.jpg/330px-Birgit_Prinz_20180519_%28cropped%29.jpg' },
  { name: 'Lucy Bronze',       bm:10,bd:28,by:1991, country:'England',     club:'Chelsea',        desc:'English right-back, UEFA Women\'s Player of the Year 2019', img:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/20250510-Lucy_Bronze_%28cropped_-_portrait%29.jpg/330px-20250510-Lucy_Bronze_%28cropped_-_portrait%29.jpg' },
  { name: 'Kelly Smith',       bm:10,bd:29,by:1978,country:'England',      club:'—',              desc:'English forward, all-time top scorer for England until 2017', img:'' },

  // November
  { name: 'Marie-Antoinette Katoto',bm:11,bd:1,by:1998, country:'France', club:'Paris Saint-Germain', desc:'French striker, all-time top scorer for PSG', img:'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/20180912_UEFA_Women%27s_Champions_League_2019_SKN_-_PSG_Marie-Antoinette_Katoto_850_5429.jpg/330px-20180912_UEFA_Women%27s_Champions_League_2019_SKN_-_PSG_Marie-Antoinette_Katoto_850_5429.jpg' },
  { name: 'Ana Maria Marković',bm:11,bd:9,by:1999, country:'Croatia',     club:'Grasshopper',     desc:'Croatian forward, known for social media presence', img:'https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/LS3_1091-1_%2853332368764%29_%28cropped%29.jpg/330px-LS3_1091-1_%2853332368764%29_%28cropped%29.jpg' },
  { name: 'Nadine Angerer',    bm:11,bd:10,by:1978, country:'Germany',     club:'—',              desc:'German goalkeeper, World Cup winner 2007, UEFA Best Women\'s Player 2013', img:'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Nadine_Angerer_-_UEFA_EURO_2024_Fan_Zone_Hamburg_04.jpg/330px-Nadine_Angerer_-_UEFA_EURO_2024_Fan_Zone_Hamburg_04.jpg' },
  { name: 'Andressa Alves',    bm:11,bd:10,by:1992, country:'Brazil',      club:'Houston Dash',    desc:'Brazilian forward, Olympic silver medalist 2024', img:'' },
  { name: 'Pernille Harder',   bm:11,bd:15,by:1992, country:'Denmark',     club:'Bayern Munich',   desc:'Danish midfielder/forward, two-time UEFA Women\'s Player of the Year', img:'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Pernille_Harder%2C_V%C3%A5lerenga_Fotball_Damer_v_FC_Bayern_M%C3%BCnchen_Frauen%2C_21_November_2024_05_%28cropped%29.jpg/330px-Pernille_Harder%2C_V%C3%A5lerenga_Fotball_Damer_v_FC_Bayern_M%C3%BCnchen_Frauen%2C_21_November_2024_05_%28cropped%29.jpg' },
  { name: 'Maribel Domínguez', bm:11,bd:18,by:1978, country:'Mexico',      club:'—',              desc:'Mexican forward, all-time top scorer for Mexico women', img:'https://upload.wikimedia.org/wikipedia/commons/0/0a/Maribel_Dom%C3%ADnguez-072513.jpg' },
  { name: 'Fridolina Rolfö',   bm:11,bd:24,by:1993, country:'Sweden',      club:'Manchester United', desc:'Swedish left-back/winger, Olympic silver medalist 2021', img:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/BHA_Women_2_MUFC_Women_3_02_11_2025-726_%28cropped%29.jpg/330px-BHA_Women_2_MUFC_Women_3_02_11_2025-726_%28cropped%29.jpg' },

  // December
  { name: 'Ludmila',           bm:12,bd:1,by:1994,  country:'Brazil',      club:'Atlético Madrid', desc:'Brazilian forward, known for pace and finishing', img:'' },
  { name: 'Rachel Daly',       bm:12,bd:6,by:1991,  country:'England',     club:'Aston Villa',     desc:'English forward, Euro 2022 winner, WSL Golden Boot 2023', img:'' },
  { name: 'Lieke Martens',     bm:12,bd:16,by:1992,country:'Netherlands',  club:'Paris Saint-Germain', desc:'Dutch winger, Euro 2017 Player of the Tournament', img:'https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Lieke_Martens.jpg/330px-Lieke_Martens.jpg' },
  { name: 'Jackie Groenen',    bm:12,bd:17,by:1994,country:'Netherlands',  club:'Paris Saint-Germain', desc:'Dutch midfielder, Euro 2017 winner', img:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Jackie_Groenen_BL_FCB_gg._1._FFC_Frankfurt_Muenchen-1_%28cropped%29.jpg/330px-Jackie_Groenen_BL_FCB_gg._1._FFC_Frankfurt_Muenchen-1_%28cropped%29.jpg' },
  { name: 'Ramona Bachmann',   bm:12,bd:25,by:1990,country:'Switzerland',  club:'—',              desc:'Swiss forward, known for technical ability and creativity', img:'https://upload.wikimedia.org/wikipedia/commons/5/53/Ramona_Bachmann_April_2013_%28cropped%29.jpg' },
  { name: 'Ary Borges',        bm:12,bd:28,by:1999, country:'Brazil',      club:'Palmeiras',       desc:'Brazilian midfielder, known for creativity and set pieces', img:'' },

  // Additional players for broader coverage
  { name: 'Marianne Pettersen',bm:4,bd:12,by:1975, country:'Norway',      club:'—',              desc:'Norwegian forward, 1995 World Cup winner', img:'' },
  { name: 'Solveig Gulbrandsen',bm:1,bd:12,by:1981,country:'Norway',      club:'—',              desc:'Norwegian midfielder, 2000 Olympic gold medalist', img:'' },
  { name: 'Lene Jensen',       bm:3,bd:7,by:1976,  country:'Denmark',      club:'—',              desc:'Danish forward, all-time top scorer for Denmark', img:'' },
  { name: 'Sissi',             bm:6,bd:2,by:1967,  country:'Brazil',       club:'—',              desc:'Brazilian midfielder, 1999 World Cup third place', img:'' },
  { name: 'Pretinha',          bm:5,bd:19,by:1975, country:'Brazil',      club:'—',              desc:'Brazilian forward, 2004 & 2008 Olympic silver medalist', img:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Pretinha.jpg/330px-Pretinha.jpg' },
  { name: 'Katia',             bm:2,bd:18,by:1977, country:'Brazil',       club:'—',              desc:'Brazilian forward, 1999 World Cup third place', img:'' },
  { name: 'Meg',               bm:12,bd:26,by:1974,country:'Brazil',       club:'—',              desc:'Brazilian defender, 1999 World Cup third place', img:'' },
];

export function getStaticWomenOnThisDay(month: number, day: number): OnThisDayEntry[] {
  const entries: OnThisDayEntry[] = [];

  for (const p of STATIC_PLAYERS) {
    if (p.bm === month && p.bd === day) {
      entries.push({
        id: `women-static-born-${p.name.replace(/\s+/g, '-')}`,
        name: p.name,
        sport: 'football',
        type: 'born',
        year: String(p.by),
        description: p.desc,
        image: p.img || undefined,
        country: p.country,
      });
    }
    if (p.dm && p.dd && p.dm === month && p.dd === day) {
      entries.push({
        id: `women-static-died-${p.name.replace(/\s+/g, '-')}`,
        name: p.name,
        sport: 'football',
        type: 'died',
        year: String(p.dy ?? ''),
        description: p.desc,
        image: p.img || undefined,
        country: p.country,
      });
    }
  }

  return entries;
}
