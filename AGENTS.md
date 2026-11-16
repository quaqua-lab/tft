# AGENTS.md — 聯盟戰棋（TFT）陣容與營運百科

## 1. 專案目的（Project Purpose）
本專案為一個靜態網頁形式的《聯盟戰棋》（Teamfight Tactics）陣容攻略百科，旨在整理當前賽季（預設為 Set 18）的主流上分陣容、升等經濟節奏與裝備搭配。
本專案的核心設計目標是**高度模組化與可擴充性**：每套陣容皆為獨立的靜態 HTML 頁面，並透過統一的 CSS Design System 與首頁索引卡片進行管理，使 AI 能依照本文件規範快速生成新陣容頁面並同步更新首頁。

---

## 2. 目錄結構與檔案命名規範（Directory & Naming Rules）

```text
tft-comp-wiki/
├── AGENTS.md               # AI 開發與擴充規範（本文件，修改結構時須同步更新）
├── index.html              # 首頁：網站導覽、陣容篩選器與所有陣容總覽卡片
├── css/
│   └── style.css           # 全站共用樣式表（含深色主題配色、英雄費用框線、排版元件）
├── js/
│   └── filter.js           # 首頁按「強度（Tier）」與「營運節奏」篩選卡片的邏輯
└── comps/                  # 存放所有獨立陣容攻略頁面
    ├── _template.html      # 標準陣容頁面範本（僅供複製參考，不可直接當作正式陣容連結）
    └── <comp-slug>.html    # 具體陣容頁面
```

### 命名規範
1. **陣容檔案 (`comps/<comp-slug>.html`)**：一律使用全小寫英文與連字號 (`-`)，格式為 `<核心節奏或羈絆>-<主C英文名>.html`。
   - 正確範例：`fast8-ryze.html`、`reroll-tristana.html`、`vertical-mage.html`
   - 錯誤範例：`Fast8_Ryze.html`、`雷茲陣容.html`、`comp1.html`
2. **路徑引用規則**：
   - 位於根目錄的 `index.html` 引用資源時使用相對路徑 `css/style.css`、`js/filter.js` 與 `comps/<comp-slug>.html`。
   - 位於 `comps/` 子目錄下的所有陣容頁，引用樣式與返回首頁時必須使用 `../css/style.css` 與 `../index.html`。

---

## 3. 網頁整體風格與視覺規範（Visual Style & CSS Rules）
- **視覺風格**：深色戰術儀表板風格（Dark Mode），高對比、資訊密度適中，方便玩家在遊戲讀取或對局空檔快速掃視。
- **核心色票**（定義於 `css/style.css` 的 `:root`）：
  - 主背景色：`#0f172a`（深藍灰）
  - 卡片背景色：`#1e293b`（石板灰），邊框 `#334155`
  - 主強調色：`#f59e0b`（戰棋金，用於 S 級標籤、主 C 標記與關鍵回合提醒）
  - 輔助強調色：`#38bdf8`（海克斯青，用於經濟與升等節奏標示）
- **英雄費用顏色規範**（必須套用對應 class）：
  - 1 費卡：`.cost-1`（灰框 `#94a3b8`）
  - 2 費卡：`.cost-2`（綠框 `#22c55e`）
  - 3 費卡：`.cost-3`（藍框 `#3b82f6`）
  - 4 費卡：`.cost-4`（紫框 `#a855f7`）
  - 5 費卡：`.cost-5`（金框 `#f59e0b`）
- **樣式禁令**：嚴禁在任何 HTML 標籤中使用 `style="..."` 行內樣式。所有排版與配色必須透過 `css/style.css` 既有的 class 實現。

---

## 4. 頁面結構規範（Page Structure）

### A. 首頁結構 (`index.html`)
- `<header class="site-header">`：網站主標題、賽季版本徽章（如 `Set 18 Meta`）與簡短說明。
- `<nav class="filter-bar">`：提供按鈕篩選陣容強度（`all`、`S`、`A`）與節奏標籤（`all`、`速八營運`、`低費賭狗`、`轉職上限`）。
- `<main class="comp-grid">`：由多張 `<article class="comp-card">` 組成。每張卡片必須包含 `data-tier` 與 `data-style` 屬性以配合篩選器運作。

### B. 陣容內頁標準五區塊 (`comps/<comp-slug>.html`)
每一份陣容攻略頁面必須嚴格依序包含以下 5 個 `<section>`，不可增減或調換順序：
1. **`.comp-header`（陣容總覽標頭）**：
   - 返回首頁連結 (`../index.html`)
   - 陣容標題 (`<h1>`)
   - 強度徽章（`<span class="badge tier-s">S 級</span>` 或 `tier-a`、`tier-b`）與營運節奏標籤（`<span class="tag">速八營運</span>`）
   - 一句話核心定位說明（`.comp-summary`）
2. **`.core-roster`（最終成形配置與三神裝）**：
   - 8 人口（或賭狗陣容 6/7 人口）標準成形英雄列表，每位英雄以 `.unit-chip` 呈現並加上對應 `.cost-1` ~ `.cost-5`。
   - 核心羈絆列表（`.trait-list`）。
   - 主 C（Main Carry）與主坦（Main Tank）的三件推薦裝備（使用繁體中文正式裝備名稱，如「精進之矛」、「珠光護手」、「石像鬼石板甲」）。
3. **`.leveling-roadmap`（關鍵升等與經濟節奏）**：
   - 使用 `<table class="roadmap-table">` 列出關鍵回合節點（`2-1`、`2-5`、`3-2`、`4-1 / 4-2`、`5-1`），欄位固定為：`回合數｜目標等級｜操作重點（升等／D牌時機）`。
4. **`.stage-guide`（分階段營運細節）**：
   - 固定分為三個子卡片（`.stage-card`）：前期過渡（2 階段）、中期鎖血（3 階段）、後期上限（4～5 階段）。
5. **`.augments-tips`（海克斯強化與實戰細節）**：
   - 推薦海克斯強化優先級：經濟類、戰力類、轉職／特殊類。
   - 站位與克制注意事項（條列式說明，例如避開特定控制或刺客切入）。

---

## 5. AI 新增或修改內容 SOP（Standard Operating Procedure）
當使用者要求「新增一套陣容」或「補充攻略」時，AI 必須依序執行以下 4 個步驟，缺一不可：

1. **建立陣容頁面**：
   - 在 `comps/` 下建立 `<comp-slug>.html`，完整套用 `comps/_template.html` 的 HTML 骨架與上述「標準五區塊」結構。
   - 確保所有文案使用台灣《聯盟戰棋》常用繁體中文術語（如：海克斯強化、羈絆、三神裝、D牌、過渡、鎖血），且不得留下任何 TODO 或未填寫的佔位文字。
2. **同步更新首頁索引 (`index.html`)**：
   - 在 `index.html` 的 `<main class="comp-grid">` 區塊中（S 級陣容排在 A 級之前），新增一張對應的 `<article class="comp-card">`，格式必須完全符合以下範本：

```html
<article class="comp-card" data-tier="S" data-style="速八營運">
  <div class="card-top">
    <span class="badge tier-s">S 級</span>
    <span class="tag">速八營運</span>
  </div>
  <h2 class="card-title"><a href="comps/<comp-slug>.html">陣容中文名稱</a></h2>
  <p class="card-desc">一句話陣容特色與啟動條件摘要。</p>
  <div class="card-units">
    <span class="unit-chip cost-4">主C名稱</span>
    <span class="unit-chip cost-4">主坦名稱</span>
    <span class="unit-chip cost-5">五費核心</span>
  </div>
</article>
```

3. **驗證連結與屬性一致性**：
   - 確認 `index.html` 卡片上的 `data-tier`、`data-style` 與陣容內頁的徽章完全一致。
   - 確認 `href="comps/<comp-slug>.html"` 與實際建立的檔名一字不差。
4. **回報摘要**：
   - 完成後，向使用者列出本次新增／修改的檔案清單，並簡述該陣容套用了哪些規範（如檔案命名、費用框線與五段式結構）。
