const STORE_KEY = "shelfguard-v1";
const DEFAULT_CATEGORIES = [
  { name: "Meso in ribe", icon: "🥩", location: "Hladilnik" },
  { name: "Mlečni izdelki", icon: "🥛", location: "Hladilnik" },
  { name: "Sadje in zelenjava", icon: "🥬", location: "Hladilnik" },
  { name: "Suha živila", icon: "🌾", location: "Shramba" },
  { name: "Zamrznjena živila", icon: "🧊", location: "Zamrzovalnik" },
  { name: "Drugo", icon: "✳️", location: "" },
];
const DEFAULT_LOCATIONS = [
  { name: "Hladilnik", icon: "❄️" },
  { name: "Zamrzovalnik", icon: "🧊" },
  { name: "Shramba", icon: "🗄️" },
  { name: "Kuhinjski pult", icon: "🧺" },
];
const CATEGORY_ICONS = Object.fromEntries(DEFAULT_CATEGORIES.map((category) => [category.name, category.icon]));
const LOCATION_ICONS = Object.fromEntries(DEFAULT_LOCATIONS.map((location) => [location.name, location.icon]));
const LOCATION_ICON_CHOICES = ["❄️", "🧊", "🗄️", "🧺", "🚪", "📦", "🥫", "🍷", "🧂", "🧰"];
const CATEGORY_ICON_CHOICES = ["🥩", "🐟", "🥛", "🧀", "🥬", "🍎", "🌾", "🍞", "🥫", "🧊", "🍽️", "✳️"];
const THEME_KEY = "shelfguard-theme";

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORE_KEY));
    if (saved && Array.isArray(saved.foods)) {
      const foods = saved.foods.flatMap((food) => {
        const quantity = Math.max(1, Number(food.quantity) || 1);
        const batchId = food.batchId || food.id;
        return Array.from({ length: quantity }, (_, index) => ({
          ...food,
          id: index === 0 ? food.id : crypto.randomUUID(),
          batchId,
          quantity: 1,
        }));
      });
      return {
        foods,
        outcomes: Array.isArray(saved.outcomes) ? saved.outcomes : [],
        categories: Array.isArray(saved.categories) ? saved.categories : [...DEFAULT_CATEGORIES],
        locations: Array.isArray(saved.locations) ? saved.locations : [...DEFAULT_LOCATIONS],
      };
    }
  } catch (error) {
    console.warn("ShelfGuard podatkov ni mogel prebrati.", error);
  }
  return { foods: [], outcomes: [], categories: [...DEFAULT_CATEGORIES], locations: [...DEFAULT_LOCATIONS] };
}

const state = loadState();
let currentLanguage = localStorage.getItem("shelfguard-language") || "sl";
const originalTextNodes = new WeakMap();
const ENGLISH = {
  "TVOJA KUHINJA":"YOUR KITCHEN","Dobro jutro.":"Good morning.","Tukaj je pregled tvoje zaloge.":"Here is an overview of your food.","Dodaj živilo":"Add food","Na zalogi":"In stock","pakiranj":"packages","Porabi kmalu":"Use soon","v naslednjih 5 dneh":"in the next 5 days","Pretečen rok":"Expired","pakiranj za pregled":"packages to review","POZORNOST":"NEEDS ATTENTION","Porabi najprej":"Use these first","Vsa živila":"All food","KJE SO STVARI":"WHERE THINGS ARE","Mesta shranjevanja":"Storage locations","Uredi mesta":"Edit locations","MAJHEN OPOMNIK":"A LITTLE REMINDER","Manj zavržene hrane,":"Less food waste,","več dobrih obrokov.":"more good meals.","Začni pri živilih, ki jim rok najprej poteče.":"Start with food that expires soonest.","Preglej zalogo":"Review stock","TVOJA EVIDENCA":"YOUR INVENTORY","Vsako pakiranje spremlja svoj rok uporabe.":"Each package has its own expiry date.","Išči med živili":"Search food","Vse":"All","Pretečeno":"Expired","Odprto":"Opened","ŽIVILO":"FOOD","KOLIČINA":"QUANTITY","ROK / STATUS":"DATE / STATUS","Tukaj še ni živil.":"No food here yet.","Dodaj živilo in ga shrani na to mesto.":"Add food and store it here.","NOVA ZALOGA":"NEW STOCK","Vnesi podatke s pakiranja.":"Enter the details from the package.","Zapri":"Close","Osnovni podatki":"Basic details","Za lažje iskanje in predlog shranjevanja.":"For easier search and storage suggestions.","Ime živila":"Food name","Na primer: Polnomastno mleko":"For example: Whole milk","Kategorija":"Category","Mesto shranjevanja":"Storage location","Predlagano mesto:":"Suggested location:","Uporabi":"Use","Pakiranje in rok":"Package and expiry","Vsako pakiranje lahko spremljaš ločeno.":"Track each package separately.","＋ Dodaj pakiranje z drugim rokom":"＋ Add package with a different expiry","Odprto pakiranje?":"Is the package open?","Rok po odprtju lahko dodaš zdaj ali pozneje.":"Add the after-opening date now or later.","Živilo je že odprto":"This food is already open","Začni spremljati priporočeni rok porabe.":"Track the recommended time to use it.","Datum odprtja":"Opened on","Porabi v (dneh)":"Use within (days)","Rok po odprtju se izračuna od dneva, ko si pakiranje odprl.":"The after-opening date is calculated from the day you opened the package.","Prekliči":"Cancel","Shrani živilo":"Save food","PO TVOJE":"YOUR SETTINGS","Uredi shrambo":"Manage your pantry","Dodaj kategorije in poimenuj svoja mesta.":"Add categories and name your storage locations.","PRIKAZ":"DISPLAY","Videz aplikacije":"App appearance","Tema":"Theme","Izberi svetel ali temen videz.":"Choose a light or dark appearance.","Svetla":"Light","Temna":"Dark","Jezik":"Language","Izberi jezik aplikacije.":"Choose the app language.","Ponastavi podatke":"Reset data","Odstrani živila, mesta in kategorije.":"Remove food, locations and categories.","Ponastavi":"Reset","PROSTORI":"LOCATIONS","RAZVRSTITEV":"ORGANIZATION","Kategorije živil":"Food categories","Dodaj mesto":"Add location","Dodaj kategorijo":"Add category","Mesta se prikažejo kot predlogi pri dodajanju živila.":"Locations appear as suggestions when adding food.","Vsaka kategorija ima svoje privzeto mesto.":"Each category has a default location.","Ime novega mesta":"New location name","Ime nove kategorije":"New category name","Brez predloga":"No suggestion","Dodaj":"Add","Pregled":"Home","Živila":"Food","Uredi":"Manage","Shramba":"Pantry","Hladilnik":"Fridge","Zamrzovalnik":"Freezer","Kuhinjski pult":"Kitchen counter","Meso in ribe":"Meat and fish","Mlečni izdelki":"Dairy","Sadje in zelenjava":"Fruit and vegetables","Suha živila":"Dry goods","Zamrznjena živila":"Frozen food","Drugo":"Other","Zaprto":"Closed","Brez roka":"No date","Danes":"Today","Jutri":"Tomorrow","Porabi do":"Use by","Rok uporabe":"Expiry date","Brez vnesenega roka":"No date entered","Odpri izbrano":"Open selected","Označi zaprto":"Mark as closed","Porabljeno":"Used up","Zavrzi":"Discard","Shrani spremembe":"Save changes","pakiranje":"package","UREJANJE MESTA":"EDIT LOCATION","UREJANJE KATEGORIJE":"EDIT CATEGORY","Simbol":"Icon","Predlagano mesto":"Suggested location","Mesta shranjevanja posodobljeno.":"Storage location updated.","Kategorija posodobljena.":"Category updated.","To mesto že obstaja.":"This location already exists.","Ta kategorija že obstaja.":"This category already exists.","Vnesi ime.":"Enter a name.","Mesto shranjevanja dodano.":"Storage location added.","Kategorija dodana.":"Category added.","PREGLED ROKOV":"EXPIRY OVERVIEW","Obvestila":"Notifications","Shrani":"Save","Odstrani":"Remove","Vse pod nadzorom.":"Everything is under control.","Trenutno ni živil, ki bi jih bilo treba kmalu porabiti.":"There is no food that needs using soon.","TEDENSKI PREGLED":"WEEKLY SUMMARY","Spremljaj porabo in zavržke.":"Track what you use and discard.","Ta teden ni zabeleženih zavržkov.":"No food waste recorded this week.","zavrženih":"discarded","Odpri obvestila":"Open notifications","PREGLED MESTA":"LOCATION VIEW","← Mesta shranjevanja":"← Storage locations","Celotna zaloga":"All stock","Še prazno":"Empty for now","pak.":"packs","Odprto pakiranje":"Open package","Zavrzi":"Discard","pakiranja":"packages","pakiranj":"packages","Uporabi najprej":"Use first","Shramba":"Pantry"
};
Object.assign(ENGLISH, {
  "Vse pod nadzorom.": "Everything is under control.", "Trenutno ni živil, ki bi jih bilo treba kmalu porabiti.": "Nothing needs to be used soon.",
  "Trenutno ni živil s skorajšnjim ali pretečenim rokom.": "No food is close to or past its expiry date.", "tvojo pozornost.": "need your attention.",
  "Pakiranje zavrženo in vključeno v tedenski pregled.": "Package discarded and included in the weekly summary.", "Pakiranje označeno kot porabljeno.": "Package marked as used up.",
  "Spremembe shranjene.": "Changes saved.", "Pakiranje odstranjeno.": "Package removed.", "Mesto shranjevanja dodano.": "Storage location added.",
  "Kategorija dodana.": "Category added.", "To mesto že obstaja.": "This location already exists.", "Ta kategorija že obstaja.": "This category already exists.",
  "Odprto · pretečeno": "Opened · expired", "Odprto · danes": "Opened · today", "Odprto · jutri": "Opened · tomorrow", "Odprto · danes": "Opened · today",
  "Odprto · pretečeno": "Opened · expired", "Pakiranje je odprto": "Package is open", "Status lahko kadarkoli spremeniš.": "You can change this status at any time.",
  "Rok uporabe": "Expiry date", "Brez mesta": "No location", "Brez roka": "No expiry date", "Še ni dodanih mest.": "No locations added yet.",
  "Še ni dodanih kategorij.": "No categories added yet.", "Predlog: brez mesta": "Suggestion: no location", "Predlog: Hladilnik": "Suggestion: Fridge",
  "Predlog: Shramba": "Suggestion: Pantry", "Predlog: Zamrzovalnik": "Suggestion: Freezer", "Pakiranje in rok": "Package and date",
  "Koliko pakiranj želiš spremeniti?": "How many packages do you want to update?", "v tej skupini": "in this group", "Odprto": "Opened", "Vsa mesta": "All locations", "← Mesta shranjevanja": "← Storage locations", "Zapri": "Close",
  "V1.0 · Beta · Build 2": "V1.0 · Beta · Build 2", "Razvil Gašper Černetič · Manj zavržene hrane, več pregleda.": "Built by Gašper Černetič · Less food waste, more peace of mind.", "Zaloga se trenutno shranjuje samo v tem brskalniku.": "Your inventory is currently stored only in this browser.",
  "Označeno kot porabljeno.": "Marked as used up.", "pakiranja": "packages", "pakiranj": "packages", "pakiranje": "package"
});
Object.assign(ENGLISH, { "Dober dan.": "Good afternoon.", "Dober večer.": "Good evening." });

function englishText(value) {
  const trimmed = value.trim();
  if (ENGLISH[trimmed]) return value.replace(trimmed, ENGLISH[trimmed]);
  let translated = trimmed;
  translated = translated.replace(/^Predlog: /, "Suggested location: ").replace(/^Predlagano mesto: /, "Suggested location: ");
  translated = translated.replace(/^Odprto · /, "Opened · ").replace(/^Odprto /, "Opened ").replace(/^Čez (\d+) dni$/, "In $1 days").replace(/^Odprto · čez (\d+) dni$/, "Opened · in $1 days");
  translated = translated.replace(/^Opened · čez (\d+) dni$/, "Opened · in $1 days").replace(/^(\d+)× pak\.$/, "$1× packs");
  translated = translated.replace(/^(\d+) pakiranj na zalogi$/, "$1 packages in stock").replace(/^(\d+) pakiranje na zalogi$/, "$1 package in stock");
  translated = translated.replace(/^(\d+) pakiranja dodana v zalogo\.$/, "$1 packages added to stock.").replace(/^(\d+) pakiranj dodanih v zalogo\.$/, "$1 packages added to stock.").replace(/^1 pakiranje dodano v zalogo\.$/, "1 package added to stock.");
  translated = translated.replace(/^Porabi v (\d+) dneh$/, "Use within $1 days");
  translated = translated.replace(/^1 pakiranje označeno kot porabljeno\.$/, "1 package marked as used up.").replace(/^(\d+) pakiranja označena kot porabljeno\.$/, "$1 packages marked as used up.").replace(/^(\d+) pakiranji označeni kot porabljeno\.$/, "$1 packages marked as used up.").replace(/^(\d+) pakiranje zavrženo\.$/, "$1 package discarded.").replace(/^(\d+) pakiranji zavrženi\.$/, "$1 packages discarded.");
  translated = translated.replace(/^Naslednjič poskusi kupiti manjšo količino teh živil\.$/, "Try buying smaller quantities next time.").replace(/^(\d+) zavrženo pakiranje ta teden\.$/, "$1 package discarded this week.").replace(/^(\d+) zavržena pakiranja ta teden\.$/, "$1 packages discarded this week.").replace(/^(\d+) od (\d+) zaključenih pakiranj je bilo zavrženih v zadnjih 7 dneh\.$/, "$1 of $2 completed packages were discarded in the last 7 days.");
  translated = translated.replace(/^Odprto · danes$/, "Opened · today").replace(/^Odprto · jutri$/, "Opened · tomorrow").replace(/^Odprto · pretečeno$/, "Opened · expired").replace(/^Pretečeno$/, "Expired").replace(/^Danes$/, "Today").replace(/^Jutri$/, "Tomorrow").replace(/^Čez (\d+) dni$/, "In $1 days");
  translated = translated.replace(/^Ali želiš ponastaviti vso zalogo, tedenski pregled, mesta in kategorije\? Tega dejanja ni mogoče razveljaviti\.$/, "Reset all stock, weekly summaries, locations and categories? This cannot be undone.");
  return value.replace(trimmed, translated);
}

function applyLanguage(language = currentLanguage) {
  currentLanguage = language === "en" ? "en" : "sl";
  localStorage.setItem("shelfguard-language", currentLanguage);
  document.documentElement.lang = currentLanguage;
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (!originalTextNodes.has(node)) originalTextNodes.set(node, node.nodeValue);
    const original = originalTextNodes.get(node);
    node.nodeValue = currentLanguage === "en" ? englishText(original) : original;
  }
  const attributes = { placeholder: { "Išči med živili": "Search food", "npr. 500 g": "e.g. 500 g", "npr. 3": "e.g. 3", "Ime novega mesta": "New location name", "Ime nove kategorije": "New category name" }, "aria-label": { "Dodaj mesto": "Add location", "Dodaj kategorijo": "Add category", "Uredi mesta": "Edit locations" } };
  Object.entries(attributes).forEach(([attribute, terms]) => $$(`[${attribute}]`).forEach((element) => {
    const key = `original${attribute.replaceAll("-", "")}`;
    if (!element.dataset[key]) element.dataset[key] = element.getAttribute(attribute) || "";
    const original = element.dataset[key];
    element.setAttribute(attribute, currentLanguage === "en" ? (terms[original] || original) : original);
  }));
  if ($("#language-select")) $("#language-select").value = currentLanguage;
  const lang = currentLanguage === "en" ? "en-US" : "sl-SI";
  const today = new Intl.DateTimeFormat(lang, { weekday: "long", day: "numeric", month: "long" }).format(new Date());
  if ($("#today-label")) $("#today-label").textContent = today.charAt(0).toLocaleUpperCase(lang) + today.slice(1);
}
const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
const dateInput = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
const todayString = () => dateInput(new Date());
const startOfDay = (value) => {
  const date = new Date(`${value}T00:00:00`);
  date.setHours(0, 0, 0, 0);
  return date;
};
const dayDistance = (value) => Math.round((startOfDay(value) - startOfDay(todayString())) / 86400000);
const formatDate = (value) => value ? new Intl.DateTimeFormat(currentLanguage === "en" ? "en-US" : "sl-SI", { day: "numeric", month: "short", year: "numeric" }).format(startOfDay(value)) : (currentLanguage === "en" ? "No date" : "Brez roka");
const escapeHTML = (value = "") => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
const iconForCategory = (name) => state.categories?.find((category) => category.name === name)?.icon || CATEGORY_ICONS[name] || "✳️";
const iconForLocation = (name) => state.locations?.find((location) => location.name === name)?.icon || LOCATION_ICONS[name] || "📦";

function applyTheme(theme) {
  const dark = theme === "dark";
  document.body.classList.toggle("dark-mode", dark);
  localStorage.setItem(THEME_KEY, dark ? "dark" : "light");
  const themeColor = $("meta[name='theme-color']");
  if (themeColor) themeColor.content = dark ? "#111713" : "#edf1eb";
  const select = $("#theme-select");
  if (select) select.value = dark ? "dark" : "light";
}

function save() {
  localStorage.setItem(STORE_KEY, JSON.stringify(state));
  render();
}

function logOutcome(food, outcome) {
  state.outcomes ||= [];
  state.outcomes.push({ id: crypto.randomUUID(), outcome, name: food.name, category: food.category, packageSize: food.packageSize, date: todayString() });
}

function renderWasteFeedback() {
  const since = new Date(); since.setDate(since.getDate() - 6); since.setHours(0, 0, 0, 0);
  const week = (state.outcomes || []).filter((entry) => startOfDay(entry.date) >= since);
  const wasted = week.filter((entry) => entry.outcome === "discarded");
  const handled = week.filter((entry) => entry.outcome === "discarded" || entry.outcome === "consumed");
  const percent = handled.length ? Math.round((wasted.length / handled.length) * 100) : 0;
  const title = !handled.length ? "Spremljaj porabo in zavržke." : wasted.length === 0 ? "Ta teden ni zabeleženih zavržkov." : percent >= 50 ? "Ta teden si zavrgel/a veliko živil." : `${wasted.length} ${wasted.length === 1 ? "zavrženo pakiranje" : "zavržena pakiranja"} ta teden.`;
  const body = !handled.length ? "Ko živilo porabiš ali zavržeš, to označi v zalogi. Pripravili bomo tedenski povzetek." : wasted.length && percent >= 50 ? "Naslednjič poskusi kupiti manjšo količino teh živil." : `${wasted.length} od ${handled.length} zaključenih pakiranj je bilo zavrženih v zadnjih 7 dneh.`;
  const el = $("#waste-feedback");
  if (el) el.innerHTML = `<span class="feedback-mark">↗</span><div><p class="overline">TEDENSKI PREGLED</p><h2>${escapeHTML(title)}</h2><p>${escapeHTML(body)}</p></div><span class="feedback-stat">${wasted.length}<small>zavrženih</small></span>`;
}

function expiration(food) {
  if (food.opened && food.openedAt && Number(food.daysAfterOpen) > 0) {
    const opened = startOfDay(food.openedAt);
    opened.setDate(opened.getDate() + Number(food.daysAfterOpen));
    return dateInput(opened);
  }
  return food.expiresAt || "";
}

function foodStatus(food) {
  const date = expiration(food);
  if (!date) return { key: "unknown", text: "Brez roka", sort: 999 };
  const days = dayDistance(date);
  if (days < 0) return { key: "expired", text: food.opened ? "Odprto · pretečeno" : "Pretečeno", days, sort: -100 + days };
  if (days === 0) return { key: "soon", text: food.opened ? "Odprto · danes" : "Danes", days, sort: 0 };
  if (days <= 5) {
    const label = days === 1 ? "Jutri" : `Čez ${days} dni`;
    return { key: "soon", text: food.opened ? `Odprto · ${label.toLocaleLowerCase("sl")}` : label, days, sort: days };
  }
  return { key: food.opened ? "open" : "ok", text: food.opened ? "Odprto" : "Zaprto", days, sort: 100 + days };
}

function setView(name) {
  $$(".view").forEach((view) => view.classList.toggle("active", view.id === `view-${name}`));
  $$(".nav-item").forEach((button) => button.classList.toggle("active", button.dataset.view === name));
  if (name === "add") prepareForm();
  if (name === "inventory") renderInventory();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

let toastTimer;
function toast(message) {
  const element = $("#toast");
  element.textContent = currentLanguage === "en" ? englishText(message) : message;
  element.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => element.classList.remove("show"), 2500);
}

function renderHome() {
  updateGreeting();
  const activeFoods = state.foods.filter((food) => !food.consumed);
  const critical = activeFoods.map((food) => ({ food, status: foodStatus(food) }))
    .filter(({ status }) => status.key === "expired" || (status.days >= 0 && status.days <= 5))
    .sort((a, b) => a.status.sort - b.status.sort).slice(0, 5);
  $("#total-count").textContent = activeFoods.length;
  $("#soon-count").textContent = activeFoods.filter((food) => {
    const status = foodStatus(food);
    return status.days >= 0 && status.days <= 5;
  }).length;
  $("#expired-count").textContent = activeFoods.filter((food) => foodStatus(food).key === "expired").length;
  $("#soon-progress").style.width = `${Math.min(100, activeFoods.length ? (Number($("#soon-count").textContent) / activeFoods.length) * 100 : 0)}%`;
  const alertCount = activeFoods.filter((food) => ["expired", "soon"].includes(foodStatus(food).key)).length;
  $(".notification-dot").classList.toggle("hidden", alertCount === 0);
  $("#notifications-button").setAttribute("aria-label", `Odpri obvestila${alertCount ? `, ${alertCount} živil potrebuje pozornost` : ""}`);
  const list = $("#critical-list");
  if (!critical.length) {
    list.innerHTML = `<div class="empty-state"><span class="empty-art">✳</span><h2>Vse pod nadzorom.</h2><p>Trenutno ni živil, ki bi jih bilo treba kmalu porabiti.</p>${activeFoods.length ? "" : '<button class="button button-dark" data-action="new">＋ Dodaj prvo živilo</button>'}</div>`;
    bindDynamicActions(list);
  } else {
    list.innerHTML = critical.map(({ food, status }) => foodRow(food, status, false)).join("");
    bindFoodActions(list);
  }

  const summary = $("#storage-summary");
  renderWasteFeedback();
  if (!state.locations.length) {
    summary.innerHTML = `<p class="storage-meta">Dodaj mesto shranjevanja za organizacijo zaloge.</p>`;
  } else {
    summary.innerHTML = state.locations.slice(0, 4).map((location) => {
      const count = activeFoods.filter((food) => food.location === location.name).length;
      return `<div class="storage-entry"><span class="place-icon">${escapeHTML(location.icon || iconForLocation(location.name))}</span><span><span class="storage-name">${escapeHTML(location.name)}</span><span class="storage-meta">${count ? `${count} ${count === 1 ? "pakiranje" : "pakiranj"}` : "Še prazno"}</span></span><span class="storage-count">${count}</span></div>`;
    }).join("");
  }
}

function updateGreeting() {
  const hour = new Date().getHours();
  const greeting = hour >= 5 && hour < 12 ? "Dobro jutro." : hour >= 12 && hour < 18 ? "Dober dan." : "Dober večer.";
  const title = $("#home-title");
  if (title && title.dataset.greeting !== greeting) {
    title.dataset.greeting = greeting;
    title.textContent = greeting;
  }
}

function badgeClass(status) {
  return status.key === "expired" ? "badge-expired" : status.key === "soon" ? "badge-soon" : status.key === "open" ? "badge-open" : "badge-ok";
}

function foodRow(food, status = foodStatus(food), inventory = true) {
  const icon = iconForCategory(food.category);
  const date = expiration(food);
  const context = food.opened ? `Odprto ${food.openedAt ? formatDate(food.openedAt) : ""}` : food.category;
  const locationText = food.location || "Brez mesta";
  const size = food.packageSize || "—";
  return `<article class="${inventory ? "inventory-row" : "food-row"}" data-food-id="${escapeHTML(food.id)}">
    <span class="food-icon">${escapeHTML(icon)}</span>
    <span><span class="food-name">${escapeHTML(food.name)}</span><span class="food-caption">${escapeHTML(context)} · ${escapeHTML(locationText)}</span></span>
    ${inventory ? `<span class="quantity">${escapeHTML(food.quantity || "1")} × ${escapeHTML(size)}</span><span class="date-value">${date ? escapeHTML(formatDate(date)) : "—"} <button type="button" class="badge ${badgeClass(status)}" aria-label="Spremeni stanje živila ${escapeHTML(food.name)}" data-food-action="${escapeHTML(food.id)}">${escapeHTML(status.text)}</button></span>` : `<span class="food-info"><strong>${escapeHTML(size)} · ${escapeHTML(food.quantity || "1")} pak.</strong>${escapeHTML(locationText)}</span><span class="food-info"><strong>${date ? escapeHTML(formatDate(date)) : "Brez roka"}</strong>${food.opened ? "rok po odprtju" : "rok uporabe"}</span><button type="button" class="badge ${badgeClass(status)}" aria-label="Spremeni stanje živila ${escapeHTML(food.name)}" data-food-action="${escapeHTML(food.id)}">${escapeHTML(status.text)}</button>`}
    <button class="row-action" aria-label="Možnosti za ${escapeHTML(food.name)}" data-food-action="${escapeHTML(food.id)}">···</button>
  </article>`;
}

let activeFilter = "all";
let selectedLocation = null;
let addLocationContext = "";
function renderInventory() {
  const overview = $("#inventory-locations");
  const stockView = $("#location-stock-view");
  if (!selectedLocation) {
    stockView.classList.add("hidden");
    overview.classList.remove("hidden");
    const places = [...state.locations];
    const total = state.foods.filter((food) => !food.consumed).length;
    overview.innerHTML = `<button class="place-card place-card-all" type="button" data-location-view="all"><span class="place-card-icon">▦</span><span><strong>Vsa mesta</strong><small>Celotna zaloga · ${total} ${total === 1 ? "pakiranje" : "pakiranj"}</small></span><span class="place-arrow">↗</span></button>${places.map((place) => {
      const count = state.foods.filter((food) => !food.consumed && food.location === place.name).length;
      return `<button class="place-card" type="button" data-location-view="${escapeHTML(place.name)}"><span class="place-card-icon">${escapeHTML(place.icon || iconForLocation(place.name))}</span><span><strong>${escapeHTML(place.name)}</strong><small>${count ? `${count} ${count === 1 ? "pakiranje" : "pakiranj"}` : "Še prazno"}</small></span><span class="place-arrow">↗</span></button>`;
    }).join("")}`;
    $$('[data-location-view]', overview).forEach((button) => button.addEventListener("click", () => {
      selectedLocation = button.dataset.locationView;
      renderInventory();
    }));
    return;
  }
  overview.classList.add("hidden");
  stockView.classList.remove("hidden");
  const isAll = selectedLocation === "all";
  $("#selected-location-title").textContent = isAll ? "Vsa mesta" : selectedLocation;
  $("#location-back").textContent = "← Mesta shranjevanja";
  const query = $("#search-input").value.trim().toLocaleLowerCase("sl-SI");
  const foods = state.foods.filter((food) => !food.consumed).filter((food) => {
    const status = foodStatus(food);
    const matchesQuery = `${food.name} ${food.category} ${food.location}`.toLocaleLowerCase("sl-SI").includes(query);
    const matchesFilter = activeFilter === "all" || (activeFilter === "soon" && status.key === "soon") || (activeFilter === "expired" && status.key === "expired") || (activeFilter === "opened" && food.opened);
    return matchesQuery && matchesFilter && (isAll || food.location === selectedLocation);
  }).sort((a, b) => foodStatus(a).sort - foodStatus(b).sort || a.name.localeCompare(b.name, "sl"));
  const groups = new Map();
  foods.forEach((food) => {
    const key = JSON.stringify([food.name.toLocaleLowerCase("sl"), food.category, food.location, food.packageSize]);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(food);
  });
  $("#inventory-list").innerHTML = [...groups.values()].map((group) => {
    const first = group[0];
    const batches = new Map();
    group.forEach((food) => {
      const key = JSON.stringify([food.batchId || food.id, food.opened, food.openedAt, food.daysAfterOpen, food.expiresAt]);
      if (!batches.has(key)) batches.set(key, []);
      batches.get(key).push(food);
    });
    return `<article class="product-card"><header class="product-heading"><span class="food-icon">${escapeHTML(iconForCategory(first.category))}</span><span><strong>${escapeHTML(first.name)}</strong><small>${escapeHTML(first.packageSize || "")}${isAll ? ` · ${escapeHTML(first.location || "Brez mesta")}` : ""}</small></span><span class="product-total">${group.length} ${group.length === 1 ? "pak." : "pak."}</span></header><div class="product-batches">${[...batches.values()].map((batch) => {
      const item = batch[0]; const status = foodStatus(item); const expiryDate = expiration(item);
      return `<div class="package-batch"><span class="batch-quantity">${batch.length}×</span><span class="batch-details"><strong>${item.opened ? "Odprto" : "Zaprto"}${batch.length > 1 ? ` · ${batch.length} pak.` : ""}</strong><small>${expiryDate ? `${item.opened ? "Porabi do" : "Rok uporabe"}: ${escapeHTML(formatDate(expiryDate))}` : "Brez vnesenega roka"}</small></span><button type="button" class="badge ${badgeClass(status)}" data-food-action="${escapeHTML(item.id)}">${escapeHTML(status.text)}</button><button type="button" class="batch-more" data-batch-action="${escapeHTML(item.id)}" aria-label="Uredi pakiranje">···</button></div>`;
    }).join("")}</div></article>`;
  }).join("");
  $("#empty-inventory").classList.toggle("hidden", foods.length !== 0);
  bindFoodActions($("#inventory-list"));
  $$('[data-batch-action]', $("#inventory-list")).forEach((button) => button.addEventListener("click", () => openBatchDialog(button.dataset.batchAction)));
}

function renderSettings() {
  $("#locations-list").innerHTML = state.locations.map((location, index) => `<div class="setting-item"><span class="setting-emoji">${escapeHTML(location.icon || iconForLocation(location.name))}</span><span><span class="setting-label">${escapeHTML(location.name)}</span><span class="setting-description">${state.foods.filter((food) => !food.consumed && food.location === location.name).length} pakiranj na zalogi</span></span><button class="setting-edit" aria-label="Uredi ${escapeHTML(location.name)}" data-edit-location="${index}">✎</button></div>`).join("") || `<p class="storage-meta">Še ni dodanih mest.</p>`;
  $("#categories-list").innerHTML = state.categories.map((category, index) => `<div class="setting-item"><span class="setting-emoji">${escapeHTML(category.icon || iconForCategory(category.name))}</span><span><span class="setting-label">${escapeHTML(category.name)}</span><span class="setting-description">Predlog: ${escapeHTML(category.location || "brez mesta")}</span></span><button class="setting-edit" aria-label="Uredi ${escapeHTML(category.name)}" data-edit-category="${index}">✎</button></div>`).join("") || `<p class="storage-meta">Še ni dodanih kategorij.</p>`;
  bindSettingActions();
  populateIconChoices();
}

function populateIconChoices() {
  const locationIconSelect = $('#location-form select[name="icon"]');
  const categoryIconSelect = $('#category-form select[name="icon"]');
  const categoryLocationSelect = $('#category-form select[name="location"]');
  if (!locationIconSelect || !categoryIconSelect || !categoryLocationSelect) return;
  const options = (icons) => icons.map((icon) => `<option value="${escapeHTML(icon)}">${escapeHTML(icon)}</option>`).join("");
  locationIconSelect.innerHTML = options(LOCATION_ICON_CHOICES);
  categoryIconSelect.innerHTML = options(CATEGORY_ICON_CHOICES);
  categoryLocationSelect.innerHTML = `<option value="">Brez predloga</option>${state.locations.map((location) => `<option value="${escapeHTML(location.name)}">${escapeHTML(location.icon || iconForLocation(location.name))} ${escapeHTML(location.name)}</option>`).join("")}`;
}

function suggestedIcon(name, choices, type) {
  const value = name.toLocaleLowerCase("sl-SI");
  const rules = type === "location"
    ? [[/hladil|hladn/, "❄️"], [/zamrz|leden/, "🧊"], [/shramb|omara|polic/, "🗄️"], [/pult|košar/, "🧺"], [/pijač|vino/, "🍷"], [/začin/, "🧂"]]
    : [[/meso/, "🥩"], [/rib/, "🐟"], [/mleč|sir|jogurt/, "🥛"], [/sadje|zelenj|solat/, "🥬"], [/sadje|jabolk/, "🍎"], [/zamrzn/, "🧊"], [/kruh|pekar/, "🍞"], [/suha|žita|testen/, "🌾"], [/konzerv/, "🥫"]];
  return choices.find((icon) => rules.find(([pattern, match]) => pattern.test(value) && icon === match)?.[1]) || choices[0];
}

function suggestedLocationForCategory(name) {
  const value = name.toLocaleLowerCase("sl-SI");
  const preferred = /zamrzn/.test(value) ? "Zamrzovalnik" : /suha|žita|testen|konzerv/.test(value) ? "Shramba" : /meso|rib|mleč|sir|jogurt|sadje|zelenj|solat/.test(value) ? "Hladilnik" : "";
  return state.locations.find((location) => location.name === preferred)?.name || "";
}

function renderSelectOptions() {
  const categorySelect = $("#category-select");
  const locationSelect = $("#location-select");
  const currentCategory = categorySelect.value;
  const currentLocation = locationSelect.value;
  categorySelect.innerHTML = state.categories.map((category) => `<option value="${escapeHTML(category.name)}">${escapeHTML(category.icon || iconForCategory(category.name))} &nbsp; ${escapeHTML(category.name)}</option>`).join("");
  locationSelect.innerHTML = state.locations.map((location) => `<option value="${escapeHTML(location.name)}">${escapeHTML(location.icon || iconForLocation(location.name))} &nbsp; ${escapeHTML(location.name)}</option>`).join("");
  if (state.categories.some((category) => category.name === currentCategory)) categorySelect.value = currentCategory;
  if (state.locations.some((location) => location.name === currentLocation)) locationSelect.value = currentLocation;
  updateSuggestion();
}

function updateSuggestion(applySuggestion = false) {
  const category = state.categories.find((entry) => entry.name === $("#category-select").value);
  const suggested = category?.location && state.locations.some((location) => location.name === category.location) ? category.location : "";
  const label = suggested ? `${iconForLocation(suggested)} ${suggested}` : "Izberi primerno mesto";
  if (applySuggestion && suggested) $("#location-select").value = suggested;
  $("#storage-suggestion").innerHTML = `<span class="suggestion-mark">✳</span><span>Predlagano mesto: <strong>${escapeHTML(label)}</strong></span><button type="button" id="use-suggestion" ${suggested ? "" : "disabled"}>Uporabi</button>`;
  $("#use-suggestion").addEventListener("click", () => { $("#location-select").value = suggested; });
  applyLanguage();
}

function addPackageField(value = {}) {
  const holder = document.createElement("div");
  holder.className = "package-line";
  holder.innerHTML = `<label class="field"><span>Velikost pakiranja</span><input name="packageSize" placeholder="npr. 500 g" value="${escapeHTML(value.packageSize || "")}" required /></label><label class="field"><span>Število</span><input name="quantity" type="number" min="1" step="1" value="${escapeHTML(value.quantity || "1")}" required /></label><label class="field"><span>Rok uporabe</span><input name="expiresAt" type="date" value="${escapeHTML(value.expiresAt || "")}" /></label><button type="button" class="remove-package" aria-label="Odstrani pakiranje">×</button>`;
  $("#package-fields").append(holder);
  applyLanguage();
  $(".remove-package", holder).addEventListener("click", () => {
    if ($$(".package-line").length > 1) holder.remove();
    else toast("Dodaj vsaj eno pakiranje.");
  });
}

function prepareForm() {
  $("#food-form").reset();
  $("#opened-fields").classList.add("hidden");
  $('#opened-fields input[name="openedAt"]').required = false;
  $('#opened-fields input[name="daysAfterOpen"]').required = false;
  renderSelectOptions();
  if (addLocationContext && state.locations.some((location) => location.name === addLocationContext)) {
    $("#location-select").value = addLocationContext;
  } else {
    const category = state.categories.find((entry) => entry.name === $("#category-select").value);
    if (category?.location && state.locations.some((location) => location.name === category.location)) $("#location-select").value = category.location;
  }
  addLocationContext = "";
  $("#package-fields").innerHTML = "";
  addPackageField({ expiresAt: dateInput(new Date(Date.now() + 7 * 86400000)) });
}

function bindFoodActions(parent) {
  $$('[data-food-action]', parent).forEach((button) => button.addEventListener("click", () => openFoodDialog(button.dataset.foodAction)));
}

function bindDynamicActions(parent) {
  $$('[data-action="new"]', parent).forEach((button) => button.addEventListener("click", () => setView("add")));
}

function openFoodDialog(id) {
  const food = state.foods.find((entry) => entry.id === id);
  if (!food) return;
  const dialog = $("#edit-dialog");
  const status = foodStatus(food);
  $("#dialog-content").innerHTML = `<p class="overline">${escapeHTML(food.category)}</p><h2>${escapeHTML(food.name)}</h2><p class="dialog-sub">${escapeHTML(food.packageSize || "")}${food.quantity ? ` · ${escapeHTML(food.quantity)} pak.` : ""} · ${escapeHTML(food.location || "Brez mesta")}</p>
    <label class="field"><span>Rok uporabe</span><input id="dialog-expiry" type="date" value="${escapeHTML(food.expiresAt || "")}" /></label>
    <label class="switch-row dialog-switch"><span><strong>Pakiranje je odprto</strong><small>Status lahko kadarkoli spremeniš.</small></span><input type="checkbox" id="dialog-open-toggle" ${food.opened ? "checked" : ""} /><i class="switch"></i></label>
    <div id="dialog-open-fields" class="form-two dialog-open-fields ${food.opened ? "" : "hidden"}"><label class="field"><span>Datum odprtja</span><input id="dialog-opened-at" type="date" value="${escapeHTML(food.openedAt || todayString())}" /></label><label class="field"><span>Porabi v (dneh)</span><input id="dialog-open-days" type="number" min="1" value="${escapeHTML(food.daysAfterOpen || "")}" /></label></div>
    <p class="dialog-sub">Trenutni status: <span class="badge ${badgeClass(status)}">${escapeHTML(status.text)}</span></p>
    <div class="dialog-actions"><button type="button" data-dialog="discard" class="danger">Zavrzi</button><button type="button" data-dialog="save" class="confirm">Shrani</button><button type="button" data-dialog="consume">Porabljeno</button></div>`;
  dialog.showModal();
  applyLanguage();
  $("#dialog-open-toggle").addEventListener("change", (event) => {
    $("#dialog-open-fields").classList.toggle("hidden", !event.target.checked);
    if (event.target.checked && !$("#dialog-opened-at").value) $("#dialog-opened-at").value = todayString();
  });
  $$('[data-dialog]', dialog).forEach((button) => button.addEventListener("click", () => {
    const action = button.dataset.dialog;
    if (action === "discard") {
      food.consumed = true; food.consumedAt = todayString(); food.outcome = "discarded"; logOutcome(food, "discarded");
      dialog.close(); save(); toast("Pakiranje zavrženo in vključeno v tedenski pregled.");
    } else if (action === "consume") {
      food.consumed = true; food.consumedAt = todayString(); food.outcome = "consumed"; logOutcome(food, "consumed"); dialog.close(); save(); toast("Pakiranje označeno kot porabljeno.");
    } else if (action === "save") {
      food.expiresAt = $("#dialog-expiry").value;
      food.opened = $("#dialog-open-toggle").checked;
      food.openedAt = food.opened ? $("#dialog-opened-at").value : "";
      food.daysAfterOpen = food.opened ? $("#dialog-open-days").value : "";
      dialog.close(); save(); toast("Spremembe shranjene.");
    }
  }));
}

function openBatchDialog(batchId) {
  const selectedItem = state.foods.find((food) => food.id === batchId && !food.consumed);
  if (!selectedItem) return;
  const batchKey = (food) => JSON.stringify([food.batchId || food.id, food.opened, food.openedAt, food.daysAfterOpen, food.expiresAt]);
  const batch = state.foods.filter((food) => !food.consumed && batchKey(food) === batchKey(selectedItem));
  if (!batch.length) return;
  const item = batch[0];
  const dialog = $("#edit-dialog");
  const opened = item.opened;
  $("#dialog-content").innerHTML = `<p class="overline">${escapeHTML(item.location || "Brez mesta")}</p><h2>${escapeHTML(item.name)}</h2><p class="dialog-sub">${escapeHTML(item.packageSize || "Pakiranje")} · ${batch.length} ${batch.length === 1 ? "pakiranje" : "pakiranj"} v tej skupini</p><label class="field"><span>Koliko pakiranj želiš spremeniti?</span><input id="batch-count" type="number" min="1" max="${batch.length}" value="1" /></label>${opened ? `<div class="dialog-sub">Odprto ${escapeHTML(formatDate(item.openedAt || todayString()))}${item.daysAfterOpen ? ` · porabi v ${escapeHTML(item.daysAfterOpen)} dneh` : ""}</div>` : `<label class="field"><span>Porabi v (dneh po odprtju)</span><input id="batch-open-days" type="number" min="1" placeholder="Po želji" /></label>`}<div class="dialog-actions">${opened ? `<button type="button" data-batch-update="close">Označi zaprto</button>` : `<button type="button" data-batch-update="open" class="confirm">Odpri izbrano</button>`}<button type="button" data-batch-update="consume">Porabljeno</button><button type="button" data-batch-update="discard" class="danger">Zavrzi</button></div>`;
  dialog.showModal();
  applyLanguage();
  $$('[data-batch-update]', dialog).forEach((button) => button.addEventListener("click", () => {
    const count = Math.min(batch.length, Math.max(1, Number($("#batch-count").value) || 1));
    const selected = batch.slice(0, count);
    if (button.dataset.batchUpdate === "open") selected.forEach((food) => { food.opened = true; food.openedAt = todayString(); food.daysAfterOpen = $("#batch-open-days").value; });
    if (button.dataset.batchUpdate === "close") selected.forEach((food) => { food.opened = false; food.openedAt = ""; food.daysAfterOpen = ""; });
    if (button.dataset.batchUpdate === "consume" || button.dataset.batchUpdate === "discard") selected.forEach((food) => { food.consumed = true; food.consumedAt = todayString(); food.outcome = button.dataset.batchUpdate === "discard" ? "discarded" : "consumed"; logOutcome(food, food.outcome); });
    dialog.close(); save();
    toast(button.dataset.batchUpdate === "consume" ? `${count} ${count === 1 ? "pakiranje označeno" : "pakiranji označeni"} kot porabljeno.` : button.dataset.batchUpdate === "discard" ? `${count} ${count === 1 ? "pakiranje zavrženo" : "pakiranji zavrženi"}.` : `${count} ${count === 1 ? "pakiranje posodobljeno" : "pakiranji posodobljeni"}.`);
  }));
}

function openNotifications() {
  const alerts = state.foods.filter((food) => !food.consumed).map((food) => ({ food, status: foodStatus(food) }))
    .filter(({ status }) => status.key === "expired" || status.key === "soon")
    .sort((a, b) => a.status.sort - b.status.sort);
  const content = $("#notifications-content");
  content.innerHTML = `<p class="overline">PREGLED ROKOV</p><h2>Obvestila</h2><p class="dialog-sub">${alerts.length ? `${alerts.length} ${alerts.length === 1 ? "živilo potrebuje" : "živila potrebujejo"} tvojo pozornost.` : "Trenutno ni živil s skorajšnjim ali pretečenim rokom."}</p>${alerts.length ? `<div class="notification-list">${alerts.map(({ food, status }) => `<button class="notification-entry" type="button" data-notification-food="${escapeHTML(food.id)}"><span class="food-icon">${escapeHTML(iconForCategory(food.category))}</span><span><strong>${escapeHTML(food.name)}</strong><small>${escapeHTML(food.location || "Brez mesta")} · ${escapeHTML(formatDate(expiration(food)))}</small></span><span class="badge ${badgeClass(status)}">${escapeHTML(status.text)}</span></button>`).join("")}</div>` : ""}`;
  const dialog = $("#notifications-dialog");
  dialog.showModal();
  applyLanguage();
  $$('[data-notification-food]', content).forEach((button) => button.addEventListener("click", () => {
    const id = button.dataset.notificationFood;
    dialog.close();
    openFoodDialog(id);
  }));
}

function showInventoryFilter(filter) {
  selectedLocation = "all";
  activeFilter = filter;
  $$(".filter-chip").forEach((chip) => chip.classList.toggle("active", chip.dataset.filter === filter));
  setView("inventory");
}

function bindSettingActions() {
  $$('[data-edit-location]').forEach((button) => button.addEventListener("click", () => {
    openEntityEditor("location", Number(button.dataset.editLocation));
  }));
  $$('[data-edit-category]').forEach((button) => button.addEventListener("click", () => {
    openEntityEditor("category", Number(button.dataset.editCategory));
  }));
}

function openEntityEditor(type, index) {
  const isLocation = type === "location";
  const entry = (isLocation ? state.locations : state.categories)[index];
  if (!entry) return;
  const iconChoices = isLocation ? LOCATION_ICON_CHOICES : CATEGORY_ICON_CHOICES;
  const locationOptions = state.locations.map((location) => `<option value="${escapeHTML(location.name)}" ${entry.location === location.name ? "selected" : ""}>${escapeHTML(location.icon || iconForLocation(location.name))} ${escapeHTML(location.name)}</option>`).join("");
  $("#dialog-content").innerHTML = `<p class="overline">UREJANJE ${isLocation ? "MESTA" : "KATEGORIJE"}</p><h2>${isLocation ? "Mesto shranjevanja" : "Kategorija živila"}</h2><label class="field"><span>Ime</span><input id="entity-name" value="${escapeHTML(entry.name)}" maxlength="40" /></label><label class="field"><span>Simbol</span><select id="entity-icon">${iconChoices.map((icon) => `<option value="${escapeHTML(icon)}" ${entry.icon === icon ? "selected" : ""}>${escapeHTML(icon)}</option>`).join("")}</select></label>${isLocation ? "" : `<label class="field"><span>Predlagano mesto</span><select id="entity-location"><option value="">Brez predloga</option>${locationOptions}</select></label>`}<div class="dialog-actions"><button type="button" class="confirm" id="save-entity">Shrani spremembe</button></div>`;
  const dialog = $("#edit-dialog");
  dialog.showModal();
  applyLanguage();
  $("#save-entity").addEventListener("click", () => {
    const name = $("#entity-name").value.trim();
    if (!name) return toast("Vnesi ime.");
    const oldName = entry.name;
    if (isLocation && state.locations.some((item, i) => i !== index && item.name.toLocaleLowerCase("sl") === name.toLocaleLowerCase("sl"))) return toast("To mesto že obstaja.");
    if (!isLocation && state.categories.some((item, i) => i !== index && item.name.toLocaleLowerCase("sl") === name.toLocaleLowerCase("sl"))) return toast("Ta kategorija že obstaja.");
    entry.name = name;
    entry.icon = $("#entity-icon").value;
    if (isLocation) {
      state.foods.forEach((food) => { if (food.location === oldName) food.location = name; });
      state.categories.forEach((category) => { if (category.location === oldName) category.location = name; });
      if (selectedLocation === oldName) selectedLocation = name;
    } else {
      entry.location = $("#entity-location").value;
      state.foods.forEach((food) => { if (food.category === oldName) food.category = name; });
    }
    dialog.close(); save(); toast(`${isLocation ? "Mesto" : "Kategorija"} posodobljena.`);
  });
}

function render() {
  renderHome();
  renderInventory();
  renderSettings();
  renderSelectOptions();
  applyLanguage();
}

$("#today-label").textContent = new Intl.DateTimeFormat("sl-SI", { weekday: "long", day: "numeric", month: "long" }).format(new Date());
$("#today-label").textContent = $("#today-label").textContent.charAt(0).toLocaleUpperCase("sl-SI") + $("#today-label").textContent.slice(1);
$$(".nav-item").forEach((button) => button.addEventListener("click", () => setView(button.dataset.view)));
$("#brand-home").addEventListener("click", (event) => {
  event.preventDefault();
  if (window.location.hash !== "#home") history.replaceState(null, "", "#home");
  selectedLocation = null;
  setView("home");
});
$("#notifications-button").addEventListener("click", openNotifications);
$$('[data-stat-filter]').forEach((card) => {
  const openList = () => showInventoryFilter(card.dataset.statFilter);
  card.addEventListener("click", openList);
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") { event.preventDefault(); openList(); }
  });
});
$$('[data-go]').forEach((button) => button.addEventListener("click", () => setView(button.dataset.go)));
const beginAdd = () => {
  addLocationContext = $("#view-inventory").classList.contains("active") && selectedLocation && selectedLocation !== "all" ? selectedLocation : "";
  setView("add");
};
$$('[data-action="new"]').forEach((button) => button.addEventListener("click", beginAdd));
$("#category-select").addEventListener("change", () => updateSuggestion(true));
$("#add-package").addEventListener("click", () => addPackageField({ expiresAt: dateInput(new Date(Date.now() + 7 * 86400000)) }));
$("#opened-toggle").addEventListener("change", (event) => {
  const openedFields = $("#opened-fields");
  openedFields.classList.toggle("hidden", !event.target.checked);
  $('#opened-fields input[name="openedAt"]').required = event.target.checked;
  $('#opened-fields input[name="daysAfterOpen"]').required = event.target.checked;
  if (event.target.checked) $('#opened-fields input[name="openedAt"]').value = todayString();
});
$("#food-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const now = new Date().toISOString();
  const opened = data.get("opened") === "on";
  const packages = $$(".package-line").flatMap((line) => {
    const quantity = Math.max(1, Number($('[name="quantity"]', line).value) || 1);
    const batchId = crypto.randomUUID();
    return Array.from({ length: quantity }, () => ({
      id: crypto.randomUUID(), batchId, name: data.get("name").trim(), category: data.get("category"), location: data.get("location"),
      packageSize: $('[name="packageSize"]', line).value.trim(), quantity: 1,
      expiresAt: $('[name="expiresAt"]', line).value, opened,
      openedAt: opened ? data.get("openedAt") : "", daysAfterOpen: opened ? data.get("daysAfterOpen") : "",
      createdAt: now, consumed: false,
    }));
  });
  state.foods.push(...packages);
  save();
  selectedLocation = null;
  event.currentTarget.reset();
  toast(`${packages.length} ${packages.length === 1 ? "pakiranje dodano" : "pakiranj dodanih"} v zalogo.`);
  setView("inventory");
});
$("#search-input").addEventListener("input", renderInventory);
$("#location-back").addEventListener("click", () => { selectedLocation = null; activeFilter = "all"; renderInventory(); });
$$(".filter-chip").forEach((button) => button.addEventListener("click", () => {
  activeFilter = button.dataset.filter;
  $$(".filter-chip").forEach((chip) => chip.classList.toggle("active", chip === button));
  renderInventory();
}));
$("#add-location").addEventListener("click", () => { $("#location-form").classList.toggle("hidden"); $("#location-form input").focus(); });
$("#add-category").addEventListener("click", () => { $("#category-form").classList.toggle("hidden"); $("#category-form input").focus(); });
$('#location-form input[name="name"]').addEventListener("input", (event) => { $('#location-form select[name="icon"]').value = suggestedIcon(event.target.value, LOCATION_ICON_CHOICES, "location"); });
$('#category-form input[name="name"]').addEventListener("input", (event) => {
  $('#category-form select[name="icon"]').value = suggestedIcon(event.target.value, CATEGORY_ICON_CHOICES, "category");
  $('#category-form select[name="location"]').value = suggestedLocationForCategory(event.target.value);
});
$("#location-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const name = new FormData(event.currentTarget).get("name").trim();
  if (state.locations.some((location) => location.name.toLocaleLowerCase("sl") === name.toLocaleLowerCase("sl"))) return toast("To mesto že obstaja.");
  state.locations.push({ name, icon: new FormData(event.currentTarget).get("icon") || suggestedIcon(name, LOCATION_ICON_CHOICES, "location") }); event.currentTarget.reset(); event.currentTarget.classList.add("hidden"); save(); toast("Mesto shranjevanja dodano.");
});
$("#category-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const name = new FormData(event.currentTarget).get("name").trim();
  if (state.categories.some((category) => category.name.toLocaleLowerCase("sl") === name.toLocaleLowerCase("sl"))) return toast("Ta kategorija že obstaja.");
  const fields = new FormData(event.currentTarget);
  state.categories.push({ name, icon: fields.get("icon") || suggestedIcon(name, CATEGORY_ICON_CHOICES, "category"), location: fields.get("location") || suggestedLocationForCategory(name) }); event.currentTarget.reset(); event.currentTarget.classList.add("hidden"); save(); toast("Kategorija dodana.");
});

$("#theme-select").addEventListener("change", (event) => applyTheme(event.target.value));
$("#language-select").addEventListener("change", (event) => { currentLanguage = event.target.value; render(); });
$("#reset-data").addEventListener("click", () => {
  const question = "Ali želiš ponastaviti vso zalogo, tedenski pregled, mesta in kategorije? Tega dejanja ni mogoče razveljaviti.";
  const approved = confirm(currentLanguage === "en" ? englishText(question) : question);
  if (!approved) return;
  localStorage.removeItem(STORE_KEY);
  window.location.reload();
});

applyTheme(localStorage.getItem(THEME_KEY) || "light");
render();
setInterval(() => {
  const previousGreeting = $("#home-title")?.dataset.greeting;
  updateGreeting();
  if (previousGreeting !== $("#home-title")?.dataset.greeting) applyLanguage();
}, 60_000);
