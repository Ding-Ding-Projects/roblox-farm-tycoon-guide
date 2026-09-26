/* Public guide snapshot from Farm Tycoon source 163c830. Values are development data, not a live-service promise. */
export const sourceCommit = "163c8305694d8a25b453031b4bc54bc431af4642";

export const crops = [
  { id: "wheat", name: "Wheat", seed: "Wheat seed", level: 1, seconds: 45, yield: 3, xp: 5, price: 2, status: "observed", note: "The first crop. A timed harvest supplies the starter barn and early feedmill construction." },
  { id: "corn", name: "Corn", seed: "Corn seed", level: 2, seconds: 75, yield: 3, xp: 8, price: 3, status: "development", note: "A feed ingredient used for chickens, cows, and pigs." },
  { id: "carrot", name: "Carrot", seed: "Carrot seed", level: 3, seconds: 100, yield: 3, xp: 11, price: 4, status: "development", note: "A crop for pig feed and carrot cake." },
  { id: "soybean", name: "Soybean", seed: "Soybean seed", level: 5, seconds: 130, yield: 3, xp: 14, price: 6, status: "development", note: "A later feed ingredient and an earned loom construction material." },
  { id: "sugarcane", name: "Sugarcane", seed: "Sugarcane seed", level: 7, seconds: 170, yield: 3, xp: 18, price: 8, status: "development", note: "Processed into sugar and used to construct the sugar mill." },
  { id: "strawberry", name: "Strawberry", seed: "Strawberry seed", level: 10, seconds: 210, yield: 2, xp: 24, price: 12, status: "development", note: "A preserves ingredient and construction material." },
  { id: "apples", name: "Apple", seed: "Apple sapling", level: 12, seconds: 300, yield: 4, xp: 28, price: 20, status: "development", note: "Harvested from the apple-sapling route for preserves." },
];

export const animals = [
  { id: "chicken", name: "Chicken", feed: "Chicken feed", product: "Egg", level: 4, seconds: 120, yield: 2, purchase: 75, status: "observed", note: "An owned chicken has been purchased, housed, fed, and collected in local Studio Play. Public-server persistence remains unverified." },
  { id: "cow", name: "Cow", feed: "Cow feed", product: "Milk", level: 8, seconds: 180, yield: 2, purchase: 180, status: "development", note: "Milk is the input for dairy products." },
  { id: "sheep", name: "Sheep", feed: "Sheep feed", product: "Wool", level: 11, seconds: 210, yield: 2, purchase: 260, status: "development", note: "Wool is woven into cloth." },
  { id: "pig", name: "Pig", feed: "Pig feed", product: "Truffle", level: 15, seconds: 240, yield: 1, purchase: 400, status: "development", note: "Truffles are the rare input for the bakery's truffle tart." },
];

export const recipes = [
  { id: "chicken_feed", name: "Chicken feed", station: "Feedmill", level: 1, seconds: 30, input: "2 wheat + 1 corn", output: "2 chicken feed", status: "observed", availability: "The recipe unlocks at level 1. Growing its corn input on your own farm requires level 2." },
  { id: "cow_feed", name: "Cow feed", station: "Feedmill", level: 5, seconds: 45, input: "2 corn + 2 soybean", output: "2 cow feed", status: "development" },
  { id: "sheep_feed", name: "Sheep feed", station: "Feedmill", level: 9, seconds: 55, input: "2 wheat + 3 soybean", output: "2 sheep feed", status: "development" },
  { id: "pig_feed", name: "Pig feed", station: "Feedmill", level: 12, seconds: 50, input: "3 corn + 2 carrot", output: "2 pig feed", status: "development" },
  { id: "bread", name: "Bread", station: "Bakery", level: 3, seconds: 45, input: "3 wheat", output: "1 bread", status: "development" },
  { id: "carrot_cake", name: "Carrot cake", station: "Bakery", level: 8, seconds: 75, input: "2 carrot + 2 wheat + 1 egg", output: "1 carrot cake", status: "development" },
  { id: "cheese", name: "Cheese", station: "Dairy", level: 9, seconds: 60, input: "2 milk", output: "1 cheese", status: "development" },
  { id: "butter", name: "Butter", station: "Dairy", level: 6, seconds: 40, input: "1 milk", output: "1 butter", status: "development", availability: "The recipe unlocks at level 6. Constructing your own dairy requires level 8." },
  { id: "sugar", name: "Sugar", station: "Sugarmill", level: 7, seconds: 50, input: "3 sugarcane", output: "2 sugar", status: "development" },
  { id: "strawberry_jam", name: "Strawberry jam", station: "Preserves", level: 11, seconds: 80, input: "3 strawberry + 1 sugar", output: "1 strawberry jam", status: "development" },
  { id: "apple_preserves", name: "Apple preserves", station: "Preserves", level: 13, seconds: 85, input: "3 apple + 1 sugar", output: "1 apple preserves", status: "development" },
  { id: "wool_cloth", name: "Wool cloth", station: "Loom", level: 14, seconds: 90, input: "3 wool", output: "1 wool cloth", status: "development" },
  { id: "truffle_tart", name: "Truffle tart", station: "Bakery", level: 18, seconds: 120, input: "1 truffle + 2 wheat + 1 sugar + 1 butter", output: "1 truffle tart", status: "development" },
];

export const items = [
  ["wheat_seed", "Wheat seed", "seed", 2], ["corn_seed", "Corn seed", "seed", 3], ["carrot_seed", "Carrot seed", "seed", 4],
  ["soybean_seed", "Soybean seed", "seed", 6], ["sugarcane_seed", "Sugarcane seed", "seed", 8], ["strawberry_seed", "Strawberry seed", "seed", 12], ["apple_sapling", "Apple sapling", "seed", 20],
  ["wheat", "Wheat", "crop", 4], ["corn", "Corn", "crop", 6], ["carrot", "Carrot", "crop", 8], ["soybean", "Soybean", "crop", 11],
  ["sugarcane", "Sugarcane", "crop", 14], ["strawberry", "Strawberry", "crop", 20], ["apple", "Apple", "crop", 22],
  ["egg", "Egg", "animal product", 10], ["milk", "Milk", "animal product", 14], ["wool", "Wool", "animal product", 18], ["truffle", "Truffle", "animal product", 50],
  ["chicken_feed", "Chicken feed", "feed", 8], ["cow_feed", "Cow feed", "feed", 15], ["sheep_feed", "Sheep feed", "feed", 20], ["pig_feed", "Pig feed", "feed", 18],
  ["bread", "Bread", "made good", 18], ["carrot_cake", "Carrot cake", "made good", 52], ["cheese", "Cheese", "made good", 45],
  ["butter", "Butter", "made good", 28], ["sugar", "Sugar", "made good", 12], ["strawberry_jam", "Strawberry jam", "made good", 70],
  ["apple_preserves", "Apple preserves", "made good", 82], ["wool_cloth", "Wool cloth", "made good", 100], ["truffle_tart", "Truffle tart", "made good", 180],
].map(([id, name, kind, value]) => ({ id, name, kind, value, status: ["wheat_seed", "wheat", "egg", "chicken_feed"].includes(id) ? "observed" : "development" }));

export const buildings = [
  { id: "silo", name: "Silo", level: 1, coins: 0, materials: "None", seconds: 30, status: "observed", note: "The free first storage building. Local Play has placed it, entered it, and operated its aeration panel. Its storage path remains under broader integration." },
  { id: "barn", name: "Barn", level: 1, coins: 40, materials: "3 wheat", seconds: 20, status: "observed", note: "Owned livestock housing and a furnished working interior. One barn was earned through real wheat harvests and entered in Studio Play." },
  { id: "personal_market", name: "Personal market", level: 1, coins: 55, materials: "4 wheat", seconds: 25, status: "development", note: "The owned farm's selling and exchange building, separate from shared town scenery." },
  { id: "supplies", name: "Supplies shop", level: 1, coins: 45, materials: "3 wheat", seconds: 25, status: "development", note: "A physical source for seed and supply actions on the owned plot." },
  { id: "restaurant", name: "Restaurant", level: 3, coins: 95, materials: "6 wheat", seconds: 35, status: "development", note: "A town-service destination with its own interior and visitor flow." },
  { id: "depot", name: "Depot", level: 2, coins: 75, materials: "5 wheat", seconds: 30, status: "development", note: "The logistics building. Reviewed fire shutters and controls have native interaction evidence, while the full earned route remains open." },
  { id: "hotel", name: "Hotel", level: 7, coins: 220, materials: "6 corn", seconds: 60, status: "development", note: "A longer-term visitor destination with a distinct furnished interior." },
  { id: "restroom", name: "Restroom", level: 1, coins: 35, materials: "2 wheat", seconds: 20, status: "development", note: "A standalone amenity with accessible fixture routes. Its construction across all final layouts remains unverified." },
  { id: "feedmill", name: "Feedmill", level: 1, coins: 70, materials: "5 wheat", seconds: 30, status: "observed", note: "Turns harvested crops into animal feed. One feedmill was earned, entered, and used in a local chicken-feeding loop." },
  { id: "bakery", name: "Bakery", level: 3, coins: 110, materials: "8 wheat", seconds: 40, status: "development", note: "Produces bread and later recipes. Its open hearth has native geometry evidence, not a complete published production route." },
  { id: "dairy", name: "Dairy", level: 8, coins: 210, materials: "5 corn", seconds: 50, status: "development", note: "Processes milk into butter and cheese." },
  { id: "sugarmill", name: "Sugar mill", level: 7, coins: 155, materials: "3 sugarcane", seconds: 45, status: "development", note: "Refines sugarcane into sugar for preserves and baking." },
  { id: "loom", name: "Loom", level: 14, coins: 290, materials: "5 soybean", seconds: 55, status: "development", note: "Weaves wool into cloth." },
  { id: "preserves", name: "Preserves workshop", level: 11, coins: 230, materials: "3 strawberry", seconds: 50, status: "development", note: "Makes strawberry jam and apple preserves from fruit and sugar." },
];

export const upgrades = [
  { id: "barn", name: "Barn capacity", max: 4, base: 100, effect: "+25 inventory capacity per tier", status: "development" },
  { id: "silo", name: "Silo capacity", max: 3, base: 140, effect: "+15 inventory capacity per tier", status: "development" },
  { id: "queue", name: "Production queue", max: 3, base: 80, effect: "+1 production slot per tier", status: "development" },
  { id: "land", name: "Land", max: 8, base: 120, effect: "+1 animal placement allowance per tier, up to the current cap of 16", status: "development" },
];
