/* Data for the History hands-on activities (ROADMAP F12, docs/HISTORY-ACTIVITIES.md): the ⛏️ Dig Sites and ✍️ Scribe School.
   The logic lives in game.js; this file is only content, so facts can be checked and edited in one place. */

/* A simple world map, drawn by hand in longitude and latitude (x = longitude, y = minus latitude), for tapping where a
   find came from. Water bodies inside the land (Black Sea, Caspian Sea) are listed separately and drawn on top. */
export const WORLD_LAND = [
  // North America
  '-166,68 -156,71.3 -141,69.6 -128,70 -115,68.5 -96,68 -94,62 -93,58.5 -88,56 -82,55 -80,51.5 -78,55 -77,60 -78,62.5 -72,62 -65,60 -61,56 -56,52 -59,48 -64,48.8 -66,45 -70,43.5 -70.5,41.7 -74,40.5 -76,37.5 -76,35 -81,31 -80,26 -81,25 -83,29 -89,30 -94,29.5 -97,27 -97.5,22 -95,18.5 -91,19 -90,21 -87,21.5 -88,16 -84,15 -83,11 -81,9 -77.5,8.5 -80,7.5 -85,10 -87,13 -92,14.5 -96,15.7 -101,17 -105.5,20.5 -108.5,25.5 -113,31 -114.5,29 -112,26 -110,23 -114,28 -117,32.5 -120,34.5 -122.5,37.5 -124,40 -124,46 -124.5,48.5 -127,50.5 -130,54 -134,57.5 -140,60 -147,61 -152,59.5 -158,57 -163,55 -158,58.5 -162,60 -165,62.5 -164,64.5 -166,66',
  // Greenland and Baffin Island
  '-73,78 -60,82 -30,83 -20,80 -18,75 -22,70 -32,68 -40,65 -43,60 -49,61 -52,65 -54,69 -58,75 -68,76.5',
  '-80,73.7 -68,70.5 -62,66.5 -65,62.5 -70,63 -74,64.5 -77,65 -73,67.5 -81,69.7 -89,71',
  // Caribbean
  '-84.9,21.9 -82,23.1 -77.5,21.8 -74.2,20.2 -77.7,19.9 -80.5,22',
  '-74.4,18.4 -72.8,19.9 -69.9,19.6 -68.4,18.6 -71.4,17.6',
  // South America
  '-77.5,8.5 -76,10 -72,12 -68,11 -63,10.7 -60,8.5 -57,6 -52,5 -50,1 -48,-1 -44,-2.5 -38,-4 -35,-6 -35,-9 -39,-14 -39,-18 -41,-22 -45,-23.5 -48.5,-26 -49,-29 -52,-32.5 -56,-35 -57.5,-38 -62,-39 -65,-41 -63.5,-42.5 -65.5,-45 -67.5,-46.5 -66,-48 -68.5,-51 -68.5,-52.5 -71,-54 -74,-52 -75,-48 -74,-44 -73.5,-40 -73.5,-37 -71.5,-32 -71.5,-28 -70.5,-23 -70.3,-18.5 -75,-15.5 -77,-12 -79.5,-8 -81,-5.5 -80,-2 -80,1 -78.5,2 -77.5,4 -77.4,7',
  // Europe and Asia
  '-9,43 -9,39 -9,37 -6,36.2 -2,36.7 0,38.7 0,39.5 3,42 3.2,43 6,43.1 8,43.8 10,44 10.5,43 12,41.8 14,41 15.7,40 16,38 15.6,38 16.5,39 17,40.4 18.5,40.1 16,41.5 14,42.5 12.3,44.5 12.4,45.4 13.7,45.6 15,44.5 17.5,43 19.4,41.8 19.5,40 21,38 22,36.5 23,36.5 23,38 24,38 22.9,40.4 24,40.8 26,40.8 26.2,39.4 27,38 28,36.7 30.5,36.5 32.5,36.1 36,36.6 35.9,35.5 35.5,34 34.9,32.5 34.3,31.3 35,29.5 36.5,26 39,21.5 41,17 43,13 45,12.8 49,14 52,15.8 55,17.5 57,18.9 59.8,22.5 58.5,23.7 56.4,24.9 56.3,26.2 54,24.2 51.6,24.6 51,26 50,26.5 48.5,28.4 48,30 50,30 51.5,27.9 54.5,26.6 56.5,27.1 57.5,25.7 61.5,25.2 66.5,25.4 67.5,23.8 68.8,22.4 70,21 72.8,21 72.8,19 73.5,16 74.8,12.8 76.4,9.5 77.5,8 78.2,8.9 79.9,10.3 80.3,13.5 80,15.5 82.3,16.6 84,18.3 86.5,20 87,21.5 89,22 91,22.5 92,21 94.3,16 97.5,16.7 98.5,13.5 99,10.5 100.3,6.5 102.5,3 103.5,1.3 104.2,1.5 103.2,5 102.2,6.2 100.5,8 100,13.5 102.5,12 105,8.7 106.5,10 109,11.5 109.3,13.5 108.5,16 106.5,18.5 105.7,19 107,21 108.5,21.6 110.5,21 113,22.2 117,23.5 119.5,25.5 121.5,28 122,30 121,32 120.5,34 119,35 122.5,37 121,37.7 118.5,38.3 117.5,39 119,39.5 121.5,40.9 122,39.2 124.5,40 125.5,37.6 126.5,34.5 129.3,35.2 129.5,36.8 128.5,38.5 129.8,41 131.3,42.8 135,43.5 138.5,47 140.3,49 140.5,53.5 137.5,54 141,58.5 149,59.5 155,59.4 156.5,57 156.5,51.5 158.5,52.5 160,54 162.5,56.2 163.2,58 164,60 170,60 173,61.6 178,62.5 180,64.5 180,68.8 175,69.8 170,70 161,69.6 152,70.9 141,72.5 130,71 127,73.5 113,73.5 110,76.7 104,77.7 98,76 88,75.5 80,73.5 72,72.7 69,68.5 66,69.5 60,69.8 55,68.4 44,68.5 41,67 36,69 31,70 28,71 23,70.7 16,69 12,66 10,63.5 5,62 5,59 7,58 10.5,59 11.5,58 12.5,56.2 14.2,55.4 16,56.2 16.5,57.8 18.8,60 17.3,61 17.5,62.8 21,64.5 22.5,65.8 25.4,65.2 25.3,64.5 21.5,62.5 21.6,61 23,60 26,60.4 30,60.2 28,59.5 23.5,59.2 24,58.3 21.5,57.3 21,56 19.6,54.4 17.5,54.8 14.5,54 11,54 10.8,56.2 10.5,57.7 8.5,57.1 8.1,55.5 8.8,54 7,53.5 5,53.2 4,51.8 2.5,51.1 1.6,50.2 0,49.7 -1.5,48.7 -4.7,48.4 -2.5,47.3 -1.2,46 -1.3,44.3 -1.8,43.4 -4,43.4 -8,43.7',
  // Africa
  '-6,35.8 -2,35.1 3,36.8 10,37.3 11,36.8 10.2,35.3 11,33.3 15,32.3 19.8,30.7 20,32 23,32.6 25,31.8 29,30.9 32,31.3 34.2,31.2 34.9,29.5 34.2,27.8 33.6,28.3 32.6,29.9 33.6,27.3 35.5,23.9 37.2,21 38.5,18 39.7,15.1 41.7,13.3 43.3,12.5 44,10.4 51.2,11.8 51,10.4 49,6 46,2 41.5,-1.8 39.2,-4.7 39.5,-7 39.8,-10.2 40.6,-15.5 35.3,-22 35.5,-24 32.8,-26 32.3,-28.9 30,-31.3 27.5,-33.5 25,-34 22,-34.2 20,-34.8 18.4,-34.1 17.8,-31 16.5,-28.6 15.2,-27 14.5,-22.5 11.8,-17.3 12.2,-14 13.5,-11 12.3,-6.1 11.7,-3.5 9.4,-0.3 9.6,2.5 9.7,4 8.5,4.5 6,4.3 4.5,6.3 1.6,6.2 -2,4.8 -4.5,5.2 -7.5,4.4 -10,6.4 -13,8.2 -15,10.9 -16.8,12.4 -17.5,14.7 -16.5,16.2 -16,19 -17,21 -15,24.5 -13.5,27.5 -9.8,29.5 -9.6,31 -6.8,34',
  '49.3,-12 50.4,-15.5 49.3,-18.5 47.5,-24.8 45,-25.5 43.7,-23.5 44.3,-20 44,-17 46.5,-15.7 48,-13.5',
  // islands of Europe
  '-5.7,50.1 1.4,51.2 1.7,52.6 0.3,53.4 -0.2,54.4 -1.6,55.6 -2,57.6 -3.3,58.6 -5,58.6 -6.2,57 -5.6,55.4 -4.8,54.8 -3.2,54.6 -3,53.4 -4.6,52.8 -4.2,51.6 -5.3,51.8',
  '-6,52.2 -6,54 -7.4,55.3 -8.5,54.4 -10,53.4 -9.9,51.7 -8.3,51.7',
  '-22.5,64 -24,65.5 -22.5,66.4 -16,66.5 -13.5,65.1 -18.5,63.4',
  // islands of Asia
  '129.7,33.2 130.2,31.2 131.4,31.4 132,33.5 133.5,33.4 135,33.6 136.8,34.4 138.8,34.6 139.8,35 140.8,35.7 141,37 142,39.5 141.4,41.4 140,40.5 139.5,38.3 136.8,37.3 136,35.8 133,35.5 131,34.4',
  '140,42 141,41.6 143.5,42 145.5,43.3 143,44.5 141.7,45.4 141.3,43.3',
  '142,46 143.5,49 143,51.5 142.7,54.3 142,51.5 141.8,48',
  '79.8,6.5 80,9.7 81.3,8.3 81.8,7 80.6,5.9',
  '120.1,23 121,25.2 122,25 121,22',
  '95.3,5.5 98,4 100.5,0.5 104.5,-3.5 106,-5.8 104.5,-5.8 101.5,-3 98.8,1.5 96.5,3.7',
  '109,1.5 111,2.5 116.5,7 119,5 117.8,1 116,-3.8 113,-3.2 110.2,-2.6 109,-0.3',
  '105.5,-6.8 110.5,-6.5 114.5,-7.8 110,-8.2 106,-7.3',
  '120.6,18.5 122.3,18.5 122,16 124,13 121.8,13.8 120.6,14.5 119.8,16.2',
  '122,7 126,7.2 126.5,9 125,9.7 123.2,8.5',
  '131,-1.3 135,-3.3 138,-1.6 141,-2.6 145.5,-4.5 147.5,-6 150,-10.5 147,-10 143.8,-9 141,-9.1 138.5,-8.3 137.8,-5 134,-4 132,-2.8',
  // Australia and New Zealand
  '113.5,-22 114,-26 115,-34.2 118,-35 123.5,-33.9 126,-32.3 131,-31.5 134.2,-32.8 137.5,-35.5 138.5,-34.5 140,-37.8 143.6,-38.8 146.3,-39.1 150,-37.5 151.3,-33.8 153.6,-28.2 153,-25.2 150.8,-22.5 149,-20.4 146,-18.5 145.3,-15 143.5,-14 142.5,-10.7 141.6,-12.8 141.5,-17 140,-17.7 136.6,-15.9 135.5,-14.7 136.8,-12.2 132.6,-11.5 130.1,-13.3 129,-15 126.5,-14 123,-16.5 121.6,-18.9 117,-20.6',
  '145,-40.8 148.3,-41 147.8,-43.2 146,-43.5',
  '172.7,-34.5 174.5,-36.3 178.5,-37.7 177,-39.2 175,-41.5 174.6,-39.8 173.8,-39.2 174.6,-37',
  '172.8,-40.5 174.3,-41.8 173,-43.8 171,-44.5 169.3,-46.6 166.5,-46 168,-44 170.5,-43'
];
export const WORLD_WATER = [
  '28,41.2 31.5,41.2 35,42 38,40.9 41.5,41.5 41.7,42.5 39.8,43.5 38,44.5 36.5,45.3 35,45 33.5,44.5 32.5,45.4 33.5,46 31,46.6 30.2,45.8 29.7,45.2 28.7,44 27.9,42.5',
  '47,44.5 49,46.5 51.5,47 53,46.6 53.2,45.3 51,44.5 52.7,42 53,40.7 53.9,38.9 54,37.3 51.5,36.8 49,37.6 48.8,38.8 49.5,40.3 48.5,41.8 47.3,43'
];

/* places a find can come from: [longitude, latitude, name, which side the label goes on] */
export const DIG_PLACES = {
  southDakota:[-102.5, 44.5, 'South Dakota, USA', 'r'],
  newMexico:[-106, 34.5, 'New Mexico, USA', 'r'],
  mexico:[-94.7, 17.7, 'Mexico', 'r'],
  peru:[-75.5, -11, 'Peru', 'r'],
  argentina:[-68.5, -38.5, 'Argentina', 'r'],
  england:[-2, 53.5, 'England', 'l'],
  france:[1.5, 44.5, 'France', 'l'],
  germany:[11, 49, 'Germany', 'r'],
  alps:[10.8, 46.8, 'the Alps', 'b'],
  italy:[14.5, 40.8, 'Italy', 'l'],
  greece:[23.3, 35.9, 'Greece', 't'],
  turkey:[38.9, 37.2, 'Turkey', 't'],
  deadSea:[35.5, 31.7, 'the Dead Sea', 'l'],
  egypt:[31, 26.5, 'Egypt', 'l'],
  nubia:[30.4, 19.6, 'Nubia (Sudan)', 'b'],
  ethiopia:[40.5, 11, 'Ethiopia', 'r'],
  mesopotamia:[44.4, 32.5, 'Mesopotamia (Iraq)', 't'],
  persia:[52.9, 30, 'Persia (Iran)', 'b'],
  indus:[68.1, 27.3, 'Indus Valley (Pakistan)', 'b'],
  india:[83, 25.4, 'India', 'b'],
  mongolia:[103, 44, 'Mongolia', 't'],
  china:[110, 35, 'China', 'b'],
  japan:[138, 36, 'Japan', 'r'],
  tanzania:[35.3, -3, 'Tanzania', 'r'],
  congo:[25, -1, 'Congo', 'l'],
  southAfrica:[21.5, -34.4, 'South Africa', 'l']
};

/* One dig site per History unit, plus a dinosaur bonus in Unit 1. Each find: where it is from (place), a clue to work it
   out, and a fact shown once it is identified. "extra" places show on the map as other choices. */
export const DIG_SITES = [
  {id:'origins', course:'history', emoji:'🏺', name:'Clues to the Past Dig', extra:['china', 'mexico'],
    intro:'Some finds changed how historians know about the past. Brush away the dirt, then work out where each find came from.',
    finds:[
      {id:'rosetta', emoji:'🪨', name:'The Rosetta Stone', made:'carved in 196 BCE', place:'egypt',
        clue:'A broken stone slab with the same message written three ways: in hieroglyphs, in an everyday script called Demotic, and in Greek. French soldiers found it in 1799 while rebuilding an old fort near the mouth of the Nile.',
        fact:'It came from Egypt. Scholars could read the Greek, so Jean-François Champollion used it to crack hieroglyphs in 1822, and thousands of years of Egyptian writing could be read again.'},
      {id:'lascaux', emoji:'🐎', name:'Lascaux cave painting', made:'about 17,000 years ago', place:'france',
        clue:'Horses, bulls and deer painted deep inside a cave with red, yellow and black earth colors. Four teenagers found the cave in 1940 in the countryside of western Europe.',
        fact:'It came from France. With no writing, paintings like these are some of the only clues to what Ice Age people saw and cared about.'},
      {id:'blombos', emoji:'🟥', name:'Engraved ochre from Blombos Cave', made:'about 75,000 years ago', place:'southAfrica',
        clue:'A piece of red ochre with a crosshatch pattern scratched into it, found in a cave on the coast near the southern tip of Africa.',
        fact:'It came from South Africa. It is one of the oldest designs anyone ever made on purpose, a clue that early people were thinking in symbols.'},
      {id:'ishango', emoji:'🦴', name:'The Ishango bone', made:'about 20,000 years ago', place:'congo',
        clue:'A bone with rows of notches carved in groups, found beside a lake in the middle of Africa, near the equator.',
        fact:'It came from the Democratic Republic of the Congo. Some scientists think the notches were for counting, which would make it one of the oldest math tools.'},
      {id:'khipu', emoji:'🧶', name:'An Inca khipu', made:'about 1400 to 1530 CE', place:'peru',
        clue:'Bunches of colored strings with knots tied in them. The empire that made them ruled the Andes Mountains of South America without writing books.',
        fact:'It came from Peru. Inca officials kept counts of people, crops and taxes in the knots. A record does not have to be written to be a primary source.'},
      {id:'suttonHoo', emoji:'🪖', name:'The Sutton Hoo helmet', made:'buried about 625 CE', place:'england',
        clue:'An iron helmet with a face mask, found in 1939 inside the outline of a whole ship buried under a mound, on a big island in northwest Europe where Anglo-Saxon kings once ruled.',
        fact:'It came from England. The ship burial showed that Anglo-Saxon kings were richer and more connected to faraway lands than the few written records said.'}]},
  {id:'dinos', course:'history', bonus:true, emoji:'🦖', name:'Before History: Fossil Dig', extra:['egypt', 'china'],
    intro:'Dinosaurs lived millions of years before the first people, so no person ever saw one. Their bones are fossils: remains of living things that slowly turned to stone. Things people made or used are artifacts, and history starts with people, so this dig is a bonus from before history.',
    finds:[
      {id:'sue', emoji:'🦖', name:'Sue the T. rex', made:'about 67 million years old', place:'southDakota',
        clue:'One of the biggest and most complete T. rex skeletons ever found, dug out of a cliff in 1990 on the Great Plains of North America.',
        fact:'It came from South Dakota, USA. It is named after Sue Hendrickson, who found it, and it stands in the Field Museum in Chicago.'},
      {id:'fighting', emoji:'⚔️', name:'The Fighting Dinosaurs', made:'about 75 million years old', place:'mongolia',
        clue:'A Velociraptor and a Protoceratops buried together in the middle of a fight, probably by a collapsing sand dune. Scientists found them in 1971 in the Gobi Desert of Central Asia.',
        fact:'It came from Mongolia. It shows one moment in time: two animals locked together for 75 million years.'},
      {id:'archaeopteryx', emoji:'🪶', name:'Archaeopteryx', made:'about 150 million years old', place:'germany',
        clue:'A crow-sized animal with teeth, a bony tail and clear prints of feathers, found in fine limestone quarries in central Europe in the 1860s.',
        fact:'It came from Germany. It helped scientists see that birds are related to dinosaurs.'},
      {id:'argentinosaurus', emoji:'🦕', name:'Argentinosaurus', made:'about 95 million years old', place:'argentina',
        clue:'A plant eater so huge that one of its backbones is taller than a person. A rancher in Patagonia, near the southern end of South America, spotted the first bone in 1987.',
        fact:'It came from Argentina, the country it is named after. It may be one of the largest animals that ever walked on land.'},
      {id:'ichthyosaur', emoji:'🐬', name:'Mary Anning’s ichthyosaur', made:'about 200 million years old', place:'england',
        clue:'A sea reptile with a long snout and huge eyes, dug out of seaside cliffs in 1811 and 1812 by a girl about 12 years old and her brother, on the south coast of a big island in northwest Europe.',
        fact:'It came from England. It is not a dinosaur: it is a sea reptile from the same age. Mary Anning became one of the greatest fossil hunters, even though scientists of her time often left her out.'},
      {id:'lucy', emoji:'🦴', name:'Lucy', made:'about 3.2 million years old', place:'ethiopia',
        clue:'Part of the skeleton of an early human relative who walked on two legs, found in 1974 in a dry valley in the Horn of Africa.',
        fact:'It came from Ethiopia. Lucy is not a dinosaur! She lived more than 60 million years after the last dinosaurs, but still millions of years before writing, so she is from before history too.'}]},
  {id:'early', course:'history2', emoji:'🦴', name:'Early Humans Dig', extra:['egypt', 'peru'],
    intro:'These finds come from people who lived before cities and writing. Brush away the dirt, then work out where each find came from.',
    finds:[
      {id:'handaxe', emoji:'🪨', name:'A hand axe from Olduvai Gorge', made:'over a million years ago', place:'tanzania',
        clue:'A teardrop-shaped stone chipped sharp on both sides, from a deep canyon in East Africa where the Leakey family searched for early humans.',
        fact:'It came from Tanzania. Early humans used tools like this for more than a million years, long before our own species, to cut meat and shape wood.'},
      {id:'clovis', emoji:'🔺', name:'A Clovis point', made:'about 13,000 years ago', place:'newMexico',
        clue:'A finely chipped stone spear point, found in 1929 near a town in the dry Southwest of North America, close to the bones of mammoths.',
        fact:'It came from New Mexico, USA. Points like this, found across North America, show people hunting big Ice Age animals there more than 13,000 years ago.'},
      {id:'gobekli', emoji:'🗿', name:'A carved pillar from Göbekli Tepe', made:'about 9500 BCE', place:'turkey',
        clue:'Huge T-shaped stone pillars carved with foxes, boars and vultures, set up on a hilltop in Southwest Asia before farming had really started.',
        fact:'It came from Turkey. Foragers built it, which surprised archaeologists: people worked together on giant projects before they lived in farming villages.'},
      {id:'jiahu', emoji:'🎶', name:'A bone flute from Jiahu', made:'about 7000 to 5700 BCE', place:'china',
        clue:'A flute carved from the wing bone of a crane, with seven holes, from an early rice-farming village in East Asia. It can still play notes!',
        fact:'It came from China. These are some of the oldest instruments that can still be played, so we can hear music from about 9,000 years ago.'},
      {id:'jomon', emoji:'🏺', name:'A Jōmon pot', made:'some about 16,000 years old', place:'japan',
        clue:'Clay pots decorated by pressing twisted cords into the wet clay, made by foragers on a chain of islands off the east coast of Asia.',
        fact:'It came from Japan. Jōmon means “cord-marked.” Some are among the oldest pottery in the world, made by people who fished, hunted and gathered instead of farming.'},
      {id:'otzi', emoji:'🪓', name:'Ötzi the Iceman’s copper axe', made:'about 3300 BCE', place:'alps',
        clue:'A copper axe blade on a wooden handle, carried by a man who died high in the snowy mountains of central Europe. Hikers found him frozen in the ice in 1991.',
        fact:'It came from the Alps, on the border of Italy and Austria. Copper tools were new and valuable then, so Ötzi was probably an important person.'}]},
  {id:'rivers', course:'history3', emoji:'🌾', name:'River Valleys Dig', extra:['greece', 'peru'],
    intro:'Early farming kingdoms grew up along rivers. Brush away the dirt, then work out where each find came from.',
    finds:[
      {id:'hammurabi', emoji:'⚖️', name:'Hammurabi’s law stone', made:'about 1754 BCE', place:'mesopotamia',
        clue:'A tall black stone carved with 282 laws in cuneiform. Archaeologists found it in 1901 in Iran, where an enemy army had carried it off as a prize, but it was made for the king of Babylon, between the Tigris and Euphrates rivers.',
        fact:'It came from Mesopotamia (Babylon, in today’s Iraq). It is one of the oldest written law codes, carved in stone so everyone could see the rules. Finding a thing somewhere doesn’t always mean it was made there!'},
      {id:'tut', emoji:'👑', name:'Tutankhamun’s golden mask', made:'about 1323 BCE', place:'egypt',
        clue:'A face mask of gold, blue glass and stone, found in 1925 on a young king’s mummy, in a tomb in the Valley of the Kings beside the Nile.',
        fact:'It came from Egypt. Tutankhamun’s tomb was found almost untouched, so it showed how Egyptians prepared their rulers for the afterlife.'},
      {id:'seal', emoji:'🦄', name:'The “unicorn” seal', made:'about 2500 BCE', place:'indus',
        clue:'A small square stone stamp showing an animal with one horn and a row of signs no one can read yet, from a planned brick city with covered drains, called Mohenjo-daro.',
        fact:'It came from the Indus Valley (today’s Pakistan). Traders pressed seals into clay to mark goods. The writing is still a mystery: maybe you will crack it!'},
      {id:'oracle', emoji:'🐢', name:'A Shang oracle bone', made:'about 1200 BCE', place:'china',
        clue:'A turtle shell with cracks and carved questions for the ancestors, like “Will it rain?” Farmers near the city of Anyang dug up pieces and sold them as “dragon bones” for medicine.',
        fact:'It came from China. Oracle bones hold the oldest Chinese writing, and many signs led to characters still used today. Try writing on one in Scribe School!'},
      {id:'olmec', emoji:'🗿', name:'An Olmec colossal head', made:'about 1200 to 900 BCE', place:'mexico',
        clue:'A giant stone head of a ruler wearing a helmet, almost 3 meters tall. The stone was dragged many kilometers to a city near the Gulf Coast of Mesoamerica.',
        fact:'It came from Mexico. The Olmec built one of the first complex societies in the Americas, and they moved these stones without wheels or big work animals.'},
      {id:'kerma', emoji:'🏺', name:'A Kerma beaker', made:'about 1750 to 1500 BCE', place:'nubia',
        clue:'A thin, shiny red cup with a black rim, made by expert potters in the kingdom of Kush, south of Egypt along the Nile.',
        fact:'It came from Nubia (today’s Sudan). Kerma was the capital of a powerful kingdom that traded with Egypt and sometimes fought it.'}]},
  {id:'empires', course:'history4', emoji:'🏛️', name:'Empires Dig', extra:['egypt', 'mesopotamia'],
    intro:'Big empires and new beliefs left treasures behind. Brush away the dirt, then work out where each find came from.',
    finds:[
      {id:'terracotta', emoji:'💂', name:'A Terracotta Army soldier', made:'about 210 BCE', place:'china',
        clue:'One of thousands of life-size clay soldiers, each with its own face, found in 1974 by farmers digging a well near the tomb of the First Emperor.',
        fact:'It came from China. The First Emperor of the Qin wanted an army to guard him after death, which shows how much power and labor one ruler could command.'},
      {id:'daric', emoji:'🪙', name:'A gold daric coin', made:'about 500 to 330 BCE', place:'persia',
        clue:'A thick gold coin showing a king running with a bow and a spear. It paid soldiers across the empire that Cyrus the Great began.',
        fact:'It came from the Persian Empire (today’s Iran). One kind of money used across a huge empire made trade and taxes easier.'},
      {id:'ashoka', emoji:'🦁', name:'The Lion Capital of Ashoka', made:'about 250 BCE', place:'india',
        clue:'Four lions sitting back to back on top of a stone pillar. An emperor who turned to Buddhism put it up where the Buddha first taught.',
        fact:'It came from India (Sarnath). Today it is the national emblem of India.'},
      {id:'bread', emoji:'🍞', name:'A loaf of bread from Pompeii', made:'79 CE', place:'italy',
        clue:'A round loaf, burned black, found in a bakery oven in a Roman town that was buried when a volcano erupted near the Bay of Naples.',
        fact:'It came from Italy. Ash from Mount Vesuvius froze a whole Roman town in time, so we can see everyday life, all the way down to the bread.'},
      {id:'antikythera', emoji:'⚙️', name:'The Antikythera mechanism', made:'about 100 BCE', place:'greece',
        clue:'A lump of rusty bronze gears pulled from a shipwreck in 1901 by sponge divers, near a small island in the Aegean Sea.',
        fact:'It came from Greece. X-rays showed it is a hand-cranked machine that predicted eclipses and the phases of the moon: an ancient computer.'},
      {id:'scrolls', emoji:'📜', name:'The Dead Sea Scrolls', made:'about 250 BCE to 70 CE', place:'deadSea',
        clue:'Old scrolls hidden in clay jars in desert caves. A young shepherd found the first ones in 1947, near the lowest place on land.',
        fact:'They came from the Dead Sea, near Jerusalem in Southwest Asia. They include the oldest known copies of books of the Hebrew Bible.'}]}
];

/* ✍️ Scribe School: four ancient ways of writing. For the alphabets, each letter of a name maps to a sign. */
export const SCRIBE_SYSTEMS = [
  {id:'cuneiform', emoji:'🧱', name:'Cuneiform on clay', place:'Mesopotamia and Ugarit', surface:'clay', font:'Noto Sans Ugaritic',
    intro:'Scribes pressed the end of a cut reed into wet clay to make wedge-shaped marks. Mesopotamian scribes used hundreds of signs for words and syllables. The city of Ugarit (in today’s Syria, about 1400 BCE) used a short cuneiform alphabet of 30 signs, so we use it to spell your name.',
    how:'Pick a wedge direction, then tap the clay to press a wedge. Build each sign from wedges. The wedge to the right is the most common one.'},
  {id:'hieroglyphs', emoji:'📜', name:'Hieroglyphs on papyrus', place:'Egypt', surface:'papyrus', font:'Noto Sans Egyptian Hieroglyphs',
    intro:'Egyptian scribes wrote with reed brushes and black or red ink on papyrus, a paper made from river reeds. Hieroglyphs mix sound signs and picture signs. Some signs stand for one sound, so you can spell your name with them. Royal names were written inside an oval called a cartouche.',
    how:'Copy the signs for your name with the reed brush. Draw an oval around them to make your own cartouche.'},
  {id:'oracle', emoji:'🐢', name:'Oracle bone writing', place:'Shang China', surface:'bone',
    intro:'Shang kings asked their ancestors questions like “Will it rain?” A diviner carved the question on an ox bone or turtle shell, then heated it until it cracked, and read the cracks as the answer. These are the oldest Chinese writing, and the signs are pictures of things, not letters.',
    how:'Pick signs to build a question for the ancestors, carve them on the bone, then heat the bone to see the cracks.'},
  {id:'greek', emoji:'🏺', name:'Greek letters on an ostrakon', place:'Ancient Greece', surface:'shard',
    intro:'The Greeks borrowed their alphabet from the Phoenicians and added letters for vowels. Paper was costly, so people scratched or painted words on broken pieces of pottery called ostraka. In Athens, citizens wrote a name on an ostrakon to vote someone out of the city for ten years: that is where the word “ostracize” comes from.',
    how:'Copy the Greek letters of your name with ink on the pottery shard.'}
];
/* sound signs for spelling a name. Ugaritic: the cuneiform alphabet of Ugarit. Hieroglyphs: the one-sound signs. */
export const UGARITIC = {A:'𐎀', B:'𐎁', C:'𐎋', D:'𐎄', E:'𐎛', F:'𐎔', G:'𐎂', H:'𐎅', I:'𐎛', J:'𐎊', K:'𐎋', L:'𐎍', M:'𐎎', N:'𐎐', O:'𐎜', P:'𐎔', Q:'𐎖', R:'𐎗', S:'𐎒', T:'𐎚', U:'𐎜', V:'𐎆', W:'𐎆', X:'𐎋𐎒', Y:'𐎊', Z:'𐎇', SH:'𐎌', TH:'𐎘'};
export const HIEROGLYPHS = {A:'𓄿', B:'𓃀', C:'𓎡', D:'𓂧', E:'𓇋', F:'𓆑', G:'𓎼', H:'𓉔', I:'𓇋', J:'𓆓', K:'𓎡', L:'𓃭', M:'𓅓', N:'𓈖', O:'𓍯', P:'𓊪', Q:'𓈎', R:'𓂋', S:'𓋴', T:'𓏏', U:'𓅱', V:'𓆑', W:'𓅱', X:'𓎡𓋴', Y:'𓇌', Z:'𓊃', SH:'𓈙', CH:'𓍿', KH:'𓐍'};
export const HIEROGLYPH_NAMES = {'𓄿':'vulture', '𓃀':'foot', '𓎡':'basket', '𓂧':'hand', '𓇋':'reed', '𓆑':'horned viper', '𓎼':'jar stand', '𓉔':'courtyard', '𓆓':'cobra', '𓃭':'lion', '𓅓':'owl', '𓈖':'water', '𓍯':'rope loop', '𓊪':'stool', '𓈎':'hill', '𓂋':'mouth', '𓋴':'folded cloth', '𓏏':'bread', '𓅱':'quail chick', '𓇌':'two reeds', '𓊃':'door bolt', '𓈙':'pool', '𓍿':'rope', '𓐍':'sieve'};
export const GREEK = {A:'Α', B:'Β', C:'Κ', D:'Δ', E:'Ε', F:'Φ', G:'Γ', H:'Η', I:'Ι', J:'Ι', K:'Κ', L:'Λ', M:'Μ', N:'Ν', O:'Ο', P:'Π', Q:'Κ', R:'Ρ', S:'Σ', T:'Τ', U:'Υ', V:'Β', W:'Ω', X:'Ξ', Y:'Υ', Z:'Ζ', TH:'Θ', PH:'Φ', PS:'Ψ', CH:'Χ'};
export const GREEK_NAMES = {'Α':'alpha', 'Β':'beta', 'Γ':'gamma', 'Δ':'delta', 'Ε':'epsilon', 'Ζ':'zeta', 'Η':'eta', 'Θ':'theta', 'Ι':'iota', 'Κ':'kappa', 'Λ':'lambda', 'Μ':'mu', 'Ν':'nu', 'Ξ':'xi', 'Ο':'omicron', 'Π':'pi', 'Ρ':'rho', 'Σ':'sigma', 'Τ':'tau', 'Υ':'upsilon', 'Φ':'phi', 'Χ':'chi', 'Ψ':'psi', 'Ω':'omega'};
/* oracle bone signs, drawn as simple strokes in a 40 × 40 box (after the Shang forms, simplified) */
export const ORACLE_SIGNS = [
  {id:'sun', word:'sun, day', today:'日', d:'M20 7a13 13 0 1 0 .1 0Z M15 20h10'},
  {id:'moon', word:'moon, month', today:'月', d:'M25 5C11 9 11 31 25 35C18 28 18 12 25 5Z M20 17v6'},
  {id:'rain', word:'rain', today:'雨', d:'M6 8H34 M20 8V14 M10 14V20 M10 25V31 M20 19V25 M20 29V35 M30 14V20 M30 25V31'},
  {id:'mountain', word:'mountain', today:'山', d:'M5 32L5 22L12 30L20 7L28 30L35 22L35 32Z'},
  {id:'water', word:'water, river', today:'水', d:'M20 4C27 11 13 18 20 25C26 30 20 34 21 37 M10 9l2 4 M9 21l2 4 M30 11l-2 4 M31 23l-2 4'},
  {id:'tree', word:'tree, wood', today:'木', d:'M20 4V36 M20 14L10 6 M20 14L30 6 M20 27L10 36 M20 27L30 36'},
  {id:'person', word:'person', today:'人', d:'M25 5C21 13 17 22 10 35 M19 17L28 26'},
  {id:'fire', word:'fire', today:'火', d:'M8 32Q12 23 9 13Q16 22 20 6Q24 22 31 13Q28 23 32 32Z'},
  {id:'field', word:'field', today:'田', d:'M7 9H33V31H7Z M20 9V31 M7 20H33'},
  {id:'ox', word:'ox', today:'牛', d:'M20 10V37 M11 19H29 M11 19Q6 11 11 4 M29 19Q34 11 29 4'},
  {id:'king', word:'king', today:'王', d:'M8 7H32 M20 7V33 M11 19H29 M6 33H34'},
  {id:'big', word:'big, great', today:'大', d:'M20 4V22 M7 14H33 M20 22L9 36 M20 22L31 36'}
];
