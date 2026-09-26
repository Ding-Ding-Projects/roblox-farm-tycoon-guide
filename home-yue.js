// The English source remains in index.html. These are its reviewed Cantonese counterparts.
const copy = [
  [".brand@aria-label", "Farm Tycoon 農場指南主頁"],
  [".topbar nav@aria-label", "主導覽"],
  [".hero-copy .primary-button", "睇吓指南 →"],
  [".hero-copy > p:not(.eyebrow)", "呢份指南講清楚每種農作物、物品、動物、食譜同建築有咩用、要幾多成本，以及相關流程有冇喺 Studio 真正操作過。公開 Roblox 測試版仲喺準備中；未完成嘅內容會老實標明。"],
  [".hero-image img@alt", "木製穀倉入面，入口旁邊有一堆圓圓嘅乾草"],
  [".hero-image figcaption", "已驗證嘅開發畫面。Roblox 公開測試版仍未推出。"],
  ["#search@placeholder", "試吓小麥、麵包店、羊毛……"],
  [".section-head p:not(.eyebrow)", "數值根據下方列出嘅原始版本。計時器使用目前嘅壓縮節奏。資料定義或者本機觀察，都唔等於公開伺服器已經提供呢個功能。"],
  ["#systems > .eyebrow", "經營農場"],
  ["#systems-title", "各樣嘢點樣連埋一齊"],
  ["#systems .systems-grid article:nth-child(1) h3", "認領同建造"],
  ["#systems .systems-grid article:nth-child(1) p", "先揀一塊可用地並認領，之後先改動農場。最多可以放六塊免費起步泥田，再用自家建造板預覽、旋轉、擺放、移動或者取消物件。移動自己擁有嘅建築唔使重新付建造費。空泥田可以收起；種咗嘢嘅泥田要先收成。新建築仍要達到等級、付金幣同材料，並等候計時器。目前只有部分初次接觸同建築流程有原生操作證據。"],
  ["#systems .systems-grid article:nth-child(2) h3", "播種同收成"],
  ["#systems .systems-grid article:nth-child(2) p", "買相應種子或者樹苗，種落自家空泥田，等圖鑑顯示嘅目前壓縮計時器。倉庫有位時，收成會畀你所列作物數量、XP，同一份補充種植用品。未成熟嘅作物唔可以提早收。小麥有一條完整選定嘅本機流程；其他作物仍要更廣泛驗收。"],
  ["#systems .systems-grid article:nth-child(3) h3", "儲存同升級"],
  ["#systems .systems-grid article:nth-child(3) p", "穀倉同筒倉代表唔同倉儲路線；指南列出四種分級升級。土地升級每級增加一個動物擺放名額，目前上限 16，唔會增加建築名額。容量、成本同庫存變動由伺服器決定。倉庫爆滿時會拒絕收集，唔會無聲無息吞咗貨。筒倉實體路線有選定本機證據；完整分拆倉儲同升級流程仍屬開發中。"],
  ["#systems .systems-grid article:nth-child(4) h3", "製作貨品"],
  ["#systems .systems-grid article:nth-child(4) p", "建造自家工作站，準備食譜指定數量嘅原料，加入生產佇列，等計時器完再收取產品。圖鑑列出全部 13 張食譜嘅工作站、等級、原料同產量。飼料廠同雞飼料流程有選定本機證據。其餘暫時只係原始資料定義，仍要實際賺取同公開版本操作證明。"],
  ["#systems .systems-grid article:nth-child(5) h3", "照顧動物"],
  ["#systems .systems-grid article:nth-child(5) p", "先建自家住所、達到動物嘅等級同價錢，再經實體流程買入、製作相應飼料，餵養並等候計時器收集。動物同產品都屬於確切嘅農場主人。買雞、餵雞同收蛋已經喺本機觀察過；牛、羊同豬仍屬開發中。"],
  ["#systems .systems-grid article:nth-child(6) h3", "訂單、出售同訪客"],
  ["#systems .systems-grid article:nth-child(6) p", "起步訂單要兩個麵包，完成可得 50 金幣同 20 XP。呢張訂單交齊之前，之後嘅訂單唔會更新。實體告示板會先列明需求同獎勵，交易再由伺服器扣貨同支付金幣、XP。城鎮訪客服務要用自家建築同計時到訪。交易仲要證明持久結算同雙帳戶隔離；公開保障仍未通過。指南唔會將有定義嘅訂單或者訪客流程寫成已經喺網上驗證。"],
  ["#systems .systems-grid article:nth-child(7) h3", "金幣同鑽石"],
  ["#systems .systems-grid article:nth-child(7) p", "金幣靠實際活動賺取，用嚟買種子、建築、動物同升級。鑽石係另一種方便用途貨幣，使用前要確認。目前規則係用五粒鑽石加快第一件未完成嘅排隊產品。開發者產品鑽石包暫停，直到真實產品同收據處理驗證完成。呢份指南冇購買按鈕。"],
  ["#systems .systems-grid article:nth-child(8) h3", "存檔同推出"],
  ["#systems .systems-grid article:nth-child(8) p", "Studio 按設計只用當次工作階段嘅資料。公開伺服器必須用持久存檔、報告真實儲存狀態，並喺完整離開再加入後保住賺取嘅進度。呢項公開驗收仍未完成。只有指定公開版本通過全新加入、操作同持久存檔檢查，先會出現 Roblox 體驗連結。"],
  ["#lore .eyebrow", "原創世界故事"],
  ["#lore-title", "一件件實用嘢，砌出一條村"],
  ["#lore .lore-layout > div > p:nth-of-type(2)", "山谷一開始只有大家共用嘅接待大堂同空田。新嚟嘅農夫冇現成莊園可以接手；佢哋自己揀地、放低第一塊泥田，再慢慢學識畀土地時間，土地先會回報。"],
  ["#lore .lore-layout > div > p:nth-of-type(3)", "小麥換返第一間穀倉。穀倉畀動物容身，飼料廠令照顧動物有咗每日節奏。貨運站、市場、麵包店同其他建築都出自同一個想法：門行得入、機器用得到、有人帶得嘢返屋企，條村先至成形。"],
  ["#lore .lore-layout > div > p:nth-of-type(4)", "貨運站嘅舊器材仍然保留，因為製作者留下咗實用嘅經驗。每道閘、每張櫃檯、每間房都有用途。普通收成、仔細建造，同終於可以住低嘅訪客，繼續寫呢條村嘅故事。"],
  ["#lore .lore-boundary", "呢段係指南原創嘅世界設定，唔代表未完成嘅任務、角色或者建築已經可以玩。"],
  ["#lore .lore-layout > div > a", "閱讀世界故事 →"],
  ["#lore img@alt", "農場城鎮嘅接待處，同佢木製嘅室內空間"],
  ["#lore figcaption", "接待大堂嘅開發畫面。"],
  ["#status > .eyebrow", "推出進度"],
  ["#status-title", "公開測試版準備緊"],
  ["#status > p:not(.eyebrow):not(.status-links)", "目前證據涵蓋選定嘅 Studio 操作流程，同原生存檔重新開啟。全新公開加入、持久化離開再加入，以及完整建築配置仍未驗證。只有指定公開版本通過呢啲檢查，頁面先會提供 Roblox 體驗連結。"],
  ["#status .status-grid article:nth-child(1) p", "認領地塊、小麥收成、起步建築、飼料廠同雞嘅流程，以及選定門口同設施互動，都有綁定原始版本嘅記錄。"],
  ["#status .status-grid article:nth-child(1) strong", "本機已觀察"],
  ["#status .status-grid article:nth-child(2) p", "其他貨品同建築有資料定義，但完整賺取流程同公開版本流程尚未證實。"],
  ["#status .status-grid article:nth-child(2) strong", "開發中"],
  ["#status .status-grid article:nth-child(3) strong", "公開測試版"],
  ["#beta-link-state", "公開版本仍未驗證。呢度唔會將遊玩連結當成完成咗嘅版本提供。"],
  ["#status .status-links a:nth-child(1)", "睇已驗證嘅開發畫面"],
  ["#status .status-links a:nth-child(2)", "瀏覽百科"],
  ["footer span:nth-child(2)", "指南內容有版本記錄；開發狀態標明證據。"],
  ["footer a", "返去頂部 ↑"],
];
export const homeCopyInventory = copy.map(([selector]) => selector);
const originals = new Map();
export function paintHomeCopy(preferences) {
  const mode = preferences.language;
  for (const [selector, cantonese] of copy) {
    const [query, attribute] = selector.split("@");
    const node = document.querySelector(query);
    if (!node) throw Error(`Home copy target missing: ${selector}`);
    const key = `${selector}`;
    if (!originals.has(key)) originals.set(key, attribute ? node.getAttribute(attribute) : node.textContent);
    const english = originals.get(key);
    const value = mode === "yue" ? cantonese : mode === "bilingual" ? `${english} · ${cantonese}` : english;
    if (attribute) node.setAttribute(attribute, value); else node.textContent = value;
  }
  const sourceNote = document.querySelector(".source-note");
  const sourceRevision = document.querySelector("#source-revision");
  const sourceEnglish = "Catalogue source revision: ";
  const sourceYue = "圖鑑原始版本：";
  const sourceTailEnglish = ". Source is private; this public guide includes only gameplay definitions and reviewed captures.";
  const sourceTailYue = "。原始碼屬私人資料；公開指南只載有玩法定義同已審核畫面。";
  sourceNote.replaceChildren(mode === "yue" ? sourceYue : mode === "bilingual" ? `${sourceEnglish}${sourceYue}` : sourceEnglish, sourceRevision, mode === "yue" ? sourceTailYue : mode === "bilingual" ? `${sourceTailEnglish} ${sourceTailYue}` : sourceTailEnglish);
  const voice = document.querySelector(".hero-voice") ?? document.createElement("p");
  voice.className = "hero-voice";
  const en = ["The source facts stay the same.", "The source facts stay the same. The field notes are neatly stacked.", "The source facts stay the same. Even the scarecrow can read the labels.", "The source facts stay the same. The scarecrow brought a clipboard.", "The source facts stay the same. The scarecrow is running the filing desk."][preferences.englishFunny - 1];
  const yue = ["原始資料事實維持不變。", "原始資料事實維持不變，筆記排得整整齊齊。", "原始資料事實維持不變，稻草人都睇得明標籤。", "原始資料事實維持不變，稻草人攞埋寫字板。", "原始資料事實維持不變，稻草人坐鎮檔案櫃。 "][preferences.cantoneseFunny - 1];
  voice.textContent = mode === "yue" ? yue : mode === "bilingual" ? `${en} ${yue}` : en;
  document.querySelector(".hero-copy").append(voice);
}
