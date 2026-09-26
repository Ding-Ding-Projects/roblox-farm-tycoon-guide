// Cantonese wording for the reviewed catalogue snapshot. Numbers come from catalogue.js.
export const names = {
  wheat: "小麥", corn: "粟米", carrot: "紅蘿蔔", soybean: "黃豆", sugarcane: "甘蔗", strawberry: "士多啤梨", apples: "蘋果", apple: "蘋果",
  chicken: "雞", cow: "牛", sheep: "羊", pig: "豬", egg: "雞蛋", milk: "牛奶", wool: "羊毛", truffle: "松露",
  chicken_feed: "雞飼料", cow_feed: "牛飼料", sheep_feed: "羊飼料", pig_feed: "豬飼料", bread: "麵包", carrot_cake: "紅蘿蔔蛋糕", cheese: "芝士", butter: "牛油", sugar: "糖", strawberry_jam: "士多啤梨果醬", apple_preserves: "蘋果蜜餞", wool_cloth: "羊毛布", truffle_tart: "松露撻",
  silo: "筒倉", barn: "穀倉", personal_market: "私人市場", supplies: "用品店", restaurant: "餐廳", depot: "貨運站", hotel: "酒店", restroom: "洗手間", feedmill: "飼料廠", bakery: "麵包店", dairy: "乳製品工場", sugarmill: "糖廠", loom: "織布機", preserves: "果醬工場", queue: "生產佇列", land: "土地",
};
export function nameYue(value) {
  const id = String(value).toLowerCase().replaceAll(" ", "_");
  if (id.endsWith("_seed")) return `${names[id.slice(0, -5)] ?? value}種子`;
  if (id === "apple_sapling") return "蘋果樹苗";
  return names[id] ?? value;
}
export function quantityYue(value) {
  return String(value).replace(/\b(\d+) ([A-Za-z][A-Za-z ]*?)(?=\s*\+|$)/g, (_, count, name) => `${count} ${nameYue(name)}`);
}
export const notes = {
  "The first crop. A timed harvest supplies the starter barn and early feedmill construction.": "第一種農作物。按時收成嘅小麥可以用嚟起第一間穀倉同早期飼料廠。",
  "A feed ingredient used for chickens, cows, and pigs.": "雞、牛同豬嘅飼料原料。",
  "A crop for pig feed and carrot cake.": "可以製作豬飼料同紅蘿蔔蛋糕。",
  "A later feed ingredient and an earned loom construction material.": "後期飼料原料，亦係建造織布機要賺取嘅材料。",
  "Processed into sugar and used to construct the sugar mill.": "可以加工成糖，亦用嚟建造糖廠。",
  "A preserves ingredient and construction material.": "果醬原料，同時係建築材料。",
  "Harvested from the apple-sapling route for preserves.": "由蘋果樹苗路線收成，可用嚟製作蜜餞。",
  "An owned chicken has been purchased, housed, fed, and collected in local Studio Play. Public-server persistence remains unverified.": "本機 Studio 操作已買入、安置、餵養自家嘅雞，亦收集咗產品。公開伺服器嘅持久存檔仍未驗證。",
  "Milk is the input for dairy products.": "牛奶係乳製品嘅原料。",
  "Wool is woven into cloth.": "羊毛可以織成布。",
  "Truffles are the rare input for the bakery's truffle tart.": "松露係麵包店製作松露撻嘅稀有原料。",
  "The free first storage building. Local Play has placed it, entered it, and operated its aeration panel. Its storage path remains under broader integration.": "第一棟免費倉儲建築。本機操作已擺放、進入，亦用過通風控制板。完整倉儲流程仍待整合。",
  "Owned livestock housing and a furnished working interior. One barn was earned through real wheat harvests and entered in Studio Play.": "自家牲畜住所，室內已布置並可以使用。本機 Studio 操作曾靠真實小麥收成換到一間穀倉，並行入去。",
  "The owned farm's selling and exchange building, separate from shared town scenery.": "自家農場用嚟出售同交換嘅建築，唔係公共城鎮擺設。",
  "A physical source for seed and supply actions on the owned plot.": "自家地塊上買種子同用品嘅實體店舖。",
  "A town-service destination with its own interior and visitor flow.": "有獨立室內空間同訪客流程嘅城鎮服務地點。",
  "The logistics building. Reviewed fire shutters and controls have native interaction evidence, while the full earned route remains open.": "物流建築。經審核嘅防火閘同控制器有原生互動證據；完整賺取流程仲未完成。",
  "A longer-term visitor destination with a distinct furnished interior.": "供訪客長時間逗留嘅地點，有獨立布置嘅室內空間。",
  "A standalone amenity with accessible fixture routes. Its construction across all final layouts remains unverified.": "獨立設施，有可通行嘅設備路線；喺所有最終配置入面都成功建造仍未驗證。",
  "Turns harvested crops into animal feed. One feedmill was earned, entered, and used in a local chicken-feeding loop.": "將收成農作物製成動物飼料。本機曾賺得一間飼料廠、走入廠內，並用佢完成餵雞流程。",
  "Produces bread and later recipes. Its open hearth has native geometry evidence, not a complete published production route.": "製作麵包同之後嘅食譜。開放式焗爐有原生幾何證據，但未有完整公開生產流程。",
  "Processes milk into butter and cheese.": "將牛奶加工成牛油同芝士。",
  "Refines sugarcane into sugar for preserves and baking.": "將甘蔗煉成糖，供果醬同烘焙使用。",
  "Weaves wool into cloth.": "將羊毛織成布。",
  "Makes strawberry jam and apple preserves from fruit and sugar.": "用水果同糖製作士多啤梨果醬同蘋果蜜餞。",
  "The recipe unlocks at level 1. Growing its corn input on your own farm requires level 2.": "食譜喺等級 1 解鎖，但要喺自己農場種出所需粟米，必須達到等級 2。",
  "The recipe unlocks at level 6. Constructing your own dairy requires level 8.": "食譜喺等級 6 解鎖，但自家乳製品工場要到等級 8 先可以建造。",
};
export const upgradeEffects = {
  "+25 inventory capacity per tier": "每級增加 25 格物品容量",
  "+15 inventory capacity per tier": "每級增加 15 格物品容量",
  "+1 production slot per tier": "每級增加 1 個生產欄位",
  "+1 animal placement allowance per tier, up to the current cap of 16": "每級增加 1 個動物擺放名額，目前上限為 16",
};
