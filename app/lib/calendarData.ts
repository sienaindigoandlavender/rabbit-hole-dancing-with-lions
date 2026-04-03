export type Tradition =
  | "islamic"
  | "chinese"
  | "hindu"
  | "persian"
  | "jewish"
  | "buddhist"
  | "solar";

export const TRADITION_COLORS: Record<Tradition, string> = {
  islamic: "#d4a254",
  chinese: "#c4362a",
  hindu: "#d4872a",
  persian: "#3a8a5c",
  jewish: "#3a6a8a",
  buddhist: "#6a3a8a",
  solar: "#f5f0e8",
};

export const TRADITION_LABELS: Record<Tradition, string> = {
  islamic: "Islamic",
  chinese: "Chinese / East Asian",
  hindu: "Hindu / South Asian",
  persian: "Persian / Central Asian",
  jewish: "Jewish",
  buddhist: "Buddhist",
  solar: "Solar / Seasonal",
};

export interface Festival {
  id: string;
  name: string;
  tradition: Tradition;
  question: string;
  answer: string;
  cities?: string[];
}

export interface FestivalDate {
  festivalId: string;
  date: string;
}

export const FESTIVALS: Record<string, Festival> = {
  ramadan_start: {
    id: "ramadan_start",
    name: "Ramadan",
    tradition: "islamic",
    question:
      "The entire country transforms for 30 days. Restaurants close during daylight. Then sunset arrives and everything erupts.",
    answer:
      "Ramadan is the ninth month of the Islamic calendar, when Muslims fast from dawn to sunset. In Morocco, the day slows to a crawl — shops close early, streets empty by afternoon. Then the adhan sounds at maghrib and the city detonates. Tables appear on pavements. Harira soup is ladled from enormous pots. Dates and milk pass between strangers. For the traveller, Ramadan means adjusted opening hours, closed daytime restaurants outside tourist zones, and the most extraordinary street food experience on earth after dark. The iftar meal is the real Morocco. You have not eaten in this country until you have broken fast with a family.",
    cities: ["Marrakech", "Fes"],
  },
  eid_al_fitr: {
    id: "eid_al_fitr",
    name: "Eid al-Fitr",
    tradition: "islamic",
    question:
      "After thirty days of fasting, the new moon appears. The next morning, an entire civilisation exhales.",
    answer:
      "Eid al-Fitr marks the end of Ramadan. Families gather, new clothes are worn, sweet pastries are exchanged. In Morocco, the streets fill with people visiting relatives. Shops close for two to three days. For the traveller, expect limited services but extraordinary warmth — you may be invited into homes. The celebration is quieter than Eid al-Adha but deeply joyful.",
    cities: ["Marrakech", "Fes", "Casablanca"],
  },
  eid_al_adha: {
    id: "eid_al_adha",
    name: "Eid al-Adha",
    tradition: "islamic",
    question:
      "Live sheep appear on rooftops, in car parks. Then one morning, smoke rises from every rooftop.",
    answer:
      "Eid al-Adha commemorates Ibrahim's willingness to sacrifice his son. Every family that can afford it buys a sheep weeks in advance. On the morning of Eid, the sacrifice happens simultaneously across the country. Smoke rises, meat is divided into three portions — one for family, one for friends, one for the poor. For the traveller, this is visceral and real. The medina smells of charcoal and roasting meat. Almost everything closes for three days. Book accommodation in advance and carry cash.",
    cities: ["Marrakech", "Fes"],
  },
  islamic_new_year: {
    id: "islamic_new_year",
    name: "Islamic New Year",
    tradition: "islamic",
    question:
      "The Islamic calendar resets. But there are no fireworks, no countdown. Just prayer and reflection.",
    answer:
      "The first day of Muharram marks the Islamic New Year. It is observed quietly — no celebrations in the Western sense. Muslims reflect on the hijra, the Prophet Muhammad's migration from Mecca to Medina. For the traveller, daily life continues largely unchanged, though some businesses may close.",
  },
  ashura: {
    id: "ashura",
    name: "Ashura",
    tradition: "islamic",
    question:
      "On the tenth of Muharram, two branches of Islam remember the same day in completely different ways.",
    answer:
      "For Sunni Muslims, Ashura is a day of fasting commemorating Moses leading the Israelites from Egypt. For Shia Muslims, it marks the martyrdom of Hussein at Karbala — a day of mourning and procession. In Morocco, a Sunni country, children receive gifts and special foods are prepared. The day reveals the deep connections between Abrahamic traditions.",
  },
  mawlid: {
    id: "mawlid",
    name: "Mawlid",
    tradition: "islamic",
    question:
      "The Prophet's birthday. In some countries, the streets fill with light and song. In others, the day passes in silence.",
    answer:
      "Mawlid an-Nabi celebrates the birth of the Prophet Muhammad. In Morocco, it is a public holiday. Families gather, religious songs are performed, and sweet couscous is served. Some scholars consider the celebration a later innovation. For the traveller, expect a festive atmosphere with processions in some cities.",
  },
  lunar_new_year: {
    id: "lunar_new_year",
    name: "Lunar New Year",
    tradition: "chinese",
    question:
      "A billion people move simultaneously. The largest annual human migration on earth.",
    answer:
      "Spring Festival marks the beginning of the Chinese lunar calendar. The chunyun migration sees three billion trips made over 40 days as workers return to their hometowns. Red envelopes pass between generations. Firecrackers drive away the monster Nian. For the traveller, China's transport system operates at maximum capacity. Book trains months ahead. Expect closures of two weeks in many businesses. But the temple fairs, dragon dances, and family warmth make this the most extraordinary time to witness Chinese culture at its most concentrated.",
  },
  qingming: {
    id: "qingming",
    name: "Qingming",
    tradition: "chinese",
    question:
      "Families sweep the graves of their ancestors, burn paper money, and leave offerings of food. The dead are still part of the household.",
    answer:
      "Qingming (Tomb Sweeping Day) falls 15 days after the spring equinox. Families visit ancestral graves to clean them, offer food, and burn joss paper. It is one of the most important expressions of filial piety in Chinese culture. For the traveller, expect crowded cemeteries and parks. Some businesses close.",
  },
  dragon_boat: {
    id: "dragon_boat",
    name: "Dragon Boat Festival",
    tradition: "chinese",
    question:
      "Long narrow boats race down rivers. Crowds eat rice wrapped in bamboo leaves. All because a poet drowned himself 2,300 years ago.",
    answer:
      "The Dragon Boat Festival commemorates Qu Yuan, a poet who drowned himself in protest against corruption. Villagers raced boats to save him and threw rice into the water to distract fish from his body. Today, dragon boat races fill rivers across East Asia, and zongzi (sticky rice in bamboo leaves) are eaten everywhere. For the traveller, the races are spectacular and the food is exceptional.",
  },
  mid_autumn: {
    id: "mid_autumn",
    name: "Mid-Autumn Festival",
    tradition: "chinese",
    question:
      "Under the fullest moon of the year, families share round cakes and tell the story of a woman who lives on the moon.",
    answer:
      "The Mid-Autumn Festival celebrates the harvest moon — the fullest and brightest of the year. Families gather outdoors, eat mooncakes filled with lotus seed paste, and tell the legend of Chang'e, who drank the elixir of immortality and floated to the moon. Lanterns light parks and riversides. For the traveller, this is one of the most beautiful nights to be in any Chinese city.",
  },
  holi: {
    id: "holi",
    name: "Holi",
    tradition: "hindu",
    question:
      "Strangers throw coloured powder at each other's faces. Social hierarchy dissolves for one day. Everyone is covered in the same paint.",
    answer:
      "Holi celebrates the triumph of good over evil and the arrival of spring. On the night before, bonfires burn effigies of the demoness Holika. The next morning, all rules break. Coloured powder (gulal) and water fly through the streets. Caste, class, age — all dissolve in pigment. For the traveller, wear clothes you can throw away. Join in. You will be targeted. This is the point. Protect your camera.",
    cities: ["Varanasi", "Jaipur"],
  },
  diwali: {
    id: "diwali",
    name: "Diwali",
    tradition: "hindu",
    question:
      "For five nights, a billion people light oil lamps on every surface. The darkness fills with fire.",
    answer:
      "Diwali is the festival of lights, celebrating the return of Rama from exile and the triumph of light over darkness. Clay lamps (diyas) line every window, rooftop, and threshold. Fireworks fill the sky for hours. Rangoli patterns decorate doorsteps. Lakshmi, goddess of wealth, is worshipped. New account books are opened. For the traveller, Varanasi during Diwali is transcendent — the ghats covered in a million flames reflected in the Ganges. The air quality suffers from fireworks, but the visual spectacle is without equal.",
    cities: ["Varanasi", "Jaipur"],
  },
  navaratri_start: {
    id: "navaratri_start",
    name: "Navaratri",
    tradition: "hindu",
    question:
      "For nine nights, thousands dance in concentric circles until dawn. Each night dedicated to a different form of the goddess.",
    answer:
      "Navaratri celebrates nine forms of the goddess Durga over nine nights. In Gujarat, massive garba dances draw thousands into spinning circles. In Bengal, elaborate pandals house artistic Durga idols. The tenth day, Dussehra, sees giant effigies of Ravana burned. For the traveller, the garba nights in Ahmedabad are one of India's greatest spectacles.",
  },
  ganesh_chaturthi: {
    id: "ganesh_chaturthi",
    name: "Ganesh Chaturthi",
    tradition: "hindu",
    question:
      "Enormous statues of an elephant-headed god are paraded through streets, then submerged in the ocean.",
    answer:
      "Ganesh Chaturthi celebrates the birth of Ganesha, remover of obstacles. Clay statues — from small household figures to enormous public installations — are worshipped for up to ten days, then carried in procession to the sea or river for immersion (visarjan). Mumbai's celebrations are the largest. For the traveller, the immersion processions are electrifying and emotional.",
  },
  nawruz: {
    id: "nawruz",
    name: "Nawruz",
    tradition: "persian",
    question:
      "On the spring equinox, families set a table with seven items beginning with S. Each symbolises something.",
    answer:
      "Nawruz marks the Persian New Year on the spring equinox — March 20 or 21. The haft-sin table holds seven items beginning with the letter sin: sprouts (sabzeh) for rebirth, apples (sib) for health, garlic (sir) for medicine, vinegar (serkeh) for patience, sumac for sunrise, a wheat pudding (samanu) for affluence, and jujube fruit (senjed) for love. The tradition is over 3,000 years old, predating Islam. Celebrated from Iran to Central Asia to Kurdish communities worldwide. For the traveller, Nawruz in Isfahan or Samarkand is a window into a civilisation that measures time by the sun.",
  },
  passover: {
    id: "passover",
    name: "Passover",
    tradition: "jewish",
    question:
      "For eight days, no leavened bread is eaten. Every meal tells the story of slavery and liberation.",
    answer:
      "Pesach commemorates the Exodus from Egypt. The seder meal follows a precise order — bitter herbs for suffering, charoset for the mortar of slavery, matzah for the bread that had no time to rise. Four cups of wine mark four promises of redemption. For the traveller in Israel or in Jewish communities worldwide, Passover means restaurant menus change entirely, bakeries close, and the story of freedom is retold at every table.",
  },
  rosh_hashanah: {
    id: "rosh_hashanah",
    name: "Rosh Hashanah",
    tradition: "jewish",
    question:
      "A ram's horn sounds in the synagogue. The Book of Life opens. You have ten days to make things right.",
    answer:
      "Rosh Hashanah marks the Jewish New Year — not with celebration but with introspection. The shofar (ram's horn) sounds 100 times. Apples are dipped in honey for a sweet year. The ten days until Yom Kippur are a period of repentance. For the traveller, expect business closures in Israel and in Jewish neighbourhoods worldwide.",
  },
  yom_kippur: {
    id: "yom_kippur",
    name: "Yom Kippur",
    tradition: "jewish",
    question:
      "For 25 hours, an entire country stops. No cars. No phones. Children ride bicycles on highways.",
    answer:
      "Yom Kippur is the Day of Atonement — the holiest day in Judaism. A 25-hour fast begins at sunset. In Israel, the entire country shuts down. No television broadcasts. No public transport. No cars on the roads. Children take over the empty highways on bicycles. The silence is absolute. For the traveller, Ben Gurion Airport closes. Plan accordingly. The stillness of Tel Aviv on Yom Kippur is unlike anything else on earth.",
  },
  hanukkah: {
    id: "hanukkah",
    name: "Hanukkah",
    tradition: "jewish",
    question:
      "For eight nights, candles multiply. One becomes two, two become three. The light grows against the darkest month.",
    answer:
      "Hanukkah commemorates the rededication of the Temple in Jerusalem, when a day's worth of oil burned for eight nights. Each evening, a new candle is added to the menorah. Fried foods — latkes, sufganiyot — are eaten in remembrance of the oil. For the traveller, Jerusalem's Old City during Hanukkah is luminous. Menorahs appear in every window.",
  },
  vesak: {
    id: "vesak",
    name: "Vesak",
    tradition: "buddhist",
    question:
      "On the full moon of May, caged birds are released. Prisoners are pardoned. What happened on this moon?",
    answer:
      "Vesak celebrates the birth, enlightenment, and death of the Buddha — all said to have occurred on the same full moon. Temples are decorated, monks chant through the night, caged animals are freed as acts of merit. In Sri Lanka and Southeast Asia, elaborate lanterns and light displays transform temple grounds. For the traveller, Vesak in Kandy or Borobudur is profoundly peaceful. The full moon over a thousand candles is the Buddhism that no text can convey.",
  },
  obon: {
    id: "obon",
    name: "Obon",
    tradition: "buddhist",
    question:
      "The Japanese believe the spirits of the dead return home for three days. Lanterns float on rivers to send them back.",
    answer:
      "Obon is Japan's festival of the dead. For three days in mid-August, spirits of ancestors are believed to return to the living world. Families clean graves, light welcome fires (mukaebi), and dance the bon odori. On the final night, paper lanterns are floated on rivers and lakes to guide the spirits back. In Kyoto, the Daimonji fires blaze on five mountains. For the traveller, Obon is when Japan is at its most tender. Book accommodation far in advance — the entire country travels home.",
  },
  nyepi: {
    id: "nyepi",
    name: "Nyepi",
    tradition: "buddhist",
    question:
      "For 24 hours, an entire island goes silent. Even the airport closes.",
    answer:
      "Nyepi is the Balinese Day of Silence — the Hindu New Year on the Saka calendar. The night before, enormous papier-mâché monsters (ogoh-ogoh) are paraded through streets and burned at crossroads to drive away evil spirits. Then, at dawn, silence falls. No one leaves their home. No lights. No fires. No work. No travel. The airport closes. Pecalang (traditional guards) patrol the empty streets. On a clear Nyepi night, with no light pollution, the Milky Way appears over Bali in a way most people have never seen. For the traveller, you must stay in your hotel for 24 hours. This is enforced. Plan for it. It is extraordinary.",
  },
  spring_equinox: {
    id: "spring_equinox",
    name: "Spring Equinox",
    tradition: "solar",
    question:
      "Day and night are exactly equal. The planet balances on a knife edge before tipping into light.",
    answer:
      "The vernal equinox marks the astronomical beginning of spring in the Northern Hemisphere. Day and night are equal length. Nawruz falls on this date. Easter is calculated from the first full moon after it. Holi falls near it. For three thousand years, civilisations have marked this moment of balance. The equinox connects Persian, Christian, Hindu, and pagan traditions through a single astronomical event.",
  },
  summer_solstice: {
    id: "summer_solstice",
    name: "Summer Solstice",
    tradition: "solar",
    question:
      "The longest day. The sun barely sets. Ancient stones align with the light.",
    answer:
      "The summer solstice is the longest day of the year. At Stonehenge, the sun rises directly over the Heel Stone. In Scandinavia, midsummer celebrations last all night. In the Arctic, the sun does not set at all. The solstice has been marked by human civilisations for at least 5,000 years — it is the oldest continuously observed astronomical event on earth.",
  },
  autumn_equinox: {
    id: "autumn_equinox",
    name: "Autumn Equinox",
    tradition: "solar",
    question:
      "Balance again. Day and night are equal. The harvest is in. The darkness begins to win.",
    answer:
      "The autumnal equinox marks the beginning of astronomical autumn. The Mid-Autumn Festival and Sukkot both cluster around this date. Harvest traditions worldwide acknowledge this tipping point — the last moment of balance before winter. The equinox connects Chinese, Jewish, Celtic, and Japanese traditions through the same astronomical reality.",
  },
  winter_solstice: {
    id: "winter_solstice",
    name: "Winter Solstice",
    tradition: "solar",
    question:
      "The shortest day. The longest night. Every tradition of light — Christmas, Hanukkah, Yalda — fights the same darkness.",
    answer:
      "The winter solstice is the shortest day of the year. Yalda Night (Persian), Christmas, Hanukkah, Saturnalia, Dongzhi (Chinese) — all cluster around this date. Humanity has always lit fires against the longest night. The solstice reveals that the festival of lights is not one tradition but all traditions, responding to the same astronomical fact: the sun will return.",
  },
};

export const FESTIVAL_DATES: Record<number, FestivalDate[]> = {
  2026: [
    { festivalId: "lunar_new_year", date: "2026-02-17" },
    { festivalId: "ramadan_start", date: "2026-02-18" },
    { festivalId: "holi", date: "2026-03-09" },
    { festivalId: "nyepi", date: "2026-03-19" },
    { festivalId: "nawruz", date: "2026-03-20" },
    { festivalId: "spring_equinox", date: "2026-03-20" },
    { festivalId: "eid_al_fitr", date: "2026-03-20" },
    { festivalId: "passover", date: "2026-04-02" },
    { festivalId: "qingming", date: "2026-04-05" },
    { festivalId: "vesak", date: "2026-05-12" },
    { festivalId: "eid_al_adha", date: "2026-05-27" },
    { festivalId: "dragon_boat", date: "2026-05-31" },
    { festivalId: "islamic_new_year", date: "2026-06-16" },
    { festivalId: "summer_solstice", date: "2026-06-21" },
    { festivalId: "ashura", date: "2026-06-25" },
    { festivalId: "obon", date: "2026-08-13" },
    { festivalId: "mawlid", date: "2026-08-25" },
    { festivalId: "ganesh_chaturthi", date: "2026-08-27" },
    { festivalId: "rosh_hashanah", date: "2026-09-12" },
    { festivalId: "yom_kippur", date: "2026-09-21" },
    { festivalId: "mid_autumn", date: "2026-09-23" },
    { festivalId: "autumn_equinox", date: "2026-09-23" },
    { festivalId: "navaratri_start", date: "2026-10-01" },
    { festivalId: "diwali", date: "2026-10-20" },
    { festivalId: "hanukkah", date: "2026-12-05" },
    { festivalId: "winter_solstice", date: "2026-12-21" },
  ],
  2027: [
    { festivalId: "lunar_new_year", date: "2027-02-06" },
    { festivalId: "ramadan_start", date: "2027-02-08" },
    { festivalId: "holi", date: "2027-02-27" },
    { festivalId: "nyepi", date: "2027-03-08" },
    { festivalId: "eid_al_fitr", date: "2027-03-10" },
    { festivalId: "nawruz", date: "2027-03-20" },
    { festivalId: "spring_equinox", date: "2027-03-20" },
    { festivalId: "passover", date: "2027-03-22" },
    { festivalId: "vesak", date: "2027-05-02" },
    { festivalId: "eid_al_adha", date: "2027-05-17" },
    { festivalId: "islamic_new_year", date: "2027-06-06" },
    { festivalId: "summer_solstice", date: "2027-06-21" },
    { festivalId: "obon", date: "2027-08-13" },
    { festivalId: "rosh_hashanah", date: "2027-09-02" },
    { festivalId: "yom_kippur", date: "2027-09-11" },
    { festivalId: "autumn_equinox", date: "2027-09-22" },
    { festivalId: "diwali", date: "2027-10-09" },
    { festivalId: "winter_solstice", date: "2027-12-21" },
  ],
};

export interface Convergence {
  year: number;
  festivals: string[];
  text: string;
}

export const CONVERGENCES: Convergence[] = [
  {
    year: 2026,
    festivals: ["eid_al_fitr", "nawruz", "spring_equinox"],
    text: "In March 2026, Eid al-Fitr, Nawruz, and the spring equinox fall on the same day. Three civilisations mark three different kinds of renewal — the end of a fast, the turn of a year, the balance of light and dark — under the same sun.",
  },
  {
    year: 2026,
    festivals: ["mid_autumn", "autumn_equinox"],
    text: "In September 2026, the Mid-Autumn Festival and the autumn equinox align. The Chinese harvest moon and the astronomical moment of balance coincide — the same moon, the same mathematics, separated by thousands of miles of culture.",
  },
  {
    year: 2027,
    festivals: ["lunar_new_year", "ramadan_start"],
    text: "In February 2027, Lunar New Year and Ramadan begin within two days of each other. A billion Chinese celebrate with feasts while a billion Muslims begin fasting. Two of humanity's great rhythms, moving to different moons, briefly synchronise.",
  },
];

export function getMoonPhase(date: Date): number {
  const knownNewMoon = new Date(2025, 0, 29).getTime();
  const lunarCycle = 29.53058770576;
  const daysSinceNew =
    (date.getTime() - knownNewMoon) / (1000 * 60 * 60 * 24);
  return (daysSinceNew % lunarCycle) / lunarCycle;
}

export function getMoonPhaseName(phase: number): string {
  if (phase < 0.03 || phase > 0.97) return "New Moon";
  if (phase < 0.22) return "Waxing Crescent";
  if (phase < 0.28) return "First Quarter";
  if (phase < 0.47) return "Waxing Gibbous";
  if (phase < 0.53) return "Full Moon";
  if (phase < 0.72) return "Waning Gibbous";
  if (phase < 0.78) return "Last Quarter";
  return "Waning Crescent";
}
