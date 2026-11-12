(() => {
  const products = [
    { id: "notebook", name: "The Everyday Notebook", category: "Paper goods", descriptor: "For lists, plans & sudden ideas", color: "coral", icon: "▤" },
    { id: "pens", name: "Writing Pens", category: "Writing tools", descriptor: "Your favourite line, your way", color: "blue", icon: "✎" },
    { id: "pencils", name: "Pencils & Sharpeners", category: "Writing tools", descriptor: "A good place to begin again", color: "yellow", icon: "⌁" },
    { id: "art", name: "Colour & Art Supplies", category: "Creative corner", descriptor: "For the colourful in-between", color: "green", icon: "✿" },
    { id: "school", name: "School Essentials", category: "School days", descriptor: "Ready for the next chapter", color: "lavender", icon: "✳" },
    { id: "office", name: "Desk & Office Basics", category: "Office things", descriptor: "Small tools, satisfying work", color: "peach", icon: "▦" }
  ];
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const config = window.DEVI_STORE || {};
  const grid = $("#product-grid");
  let activeCategory = "All things";
  let bag = JSON.parse(localStorage.getItem("devi-quote-bag") || "[]");
  const categories = ["All things", ...new Set(products.map(p => p.category))];
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" })[c]);

  $("#category-filters").innerHTML = categories.map((c, i) => `<button class="filter-chip${i === 0 ? " active" : ""}" data-category="${esc(c)}" aria-pressed="${i === 0}">${esc(c)}</button>`).join("");
  $("#product-suggestions").innerHTML = products.map(p => `<option value="${esc(p.name)}"></option>`).join("");
  function renderProducts() {
    const q = $("#product-search").value.trim().toLowerCase();
    const shown = products.filter(p => (activeCategory === "All things" || p.category === activeCategory) && `${p.name} ${p.category} ${p.descriptor}`.toLowerCase().includes(q));
    grid.innerHTML = shown.length ? shown.map((p, i) => `<article class="product-card"><div class="product-visual visual-${p.color}" aria-hidden="true"><span class="product-index">0${products.indexOf(p) + 1} / 06</span><span class="product-icon">${p.icon}</span><span class="product-category">${esc(p.category)}</span><span class="product-shape shape-${i % 3}"></span></div><div class="product-info"><div><h3>${esc(p.name)}</h3><p>${esc(p.descriptor)}</p></div><button class="add-button" data-add="${esc(p.id)}" aria-label="Add ${esc(p.name)} to quote bag">+</button></div><span class="price-note">ASK FOR CURRENT PRICE</span></article>`).join("") : `<p class="no-results">Nothing on this shelf yet. Try another search.</p>`;
  }
  function updateBag() {
    localStorage.setItem("devi-quote-bag", JSON.stringify(bag));
    const count = bag.reduce((n, id) => n + (products.find(p => p.id === id)?.qty || 1), 0);
    $("#bag-count").textContent = count;
    $("#bag-open").setAttribute("aria-label", `Open quote bag, ${count} ${count === 1 ? "item" : "items"}`);
    $("#dialog-count").textContent = `(${count})`;
    $("#bag-items").innerHTML = bag.length ? bag.map((id, i) => { const p = products.find(x => x.id === id); return p ? `<div class="bag-row"><span class="bag-item-icon">${p.icon}</span><span><strong>${esc(p.name)}</strong><small>${esc(p.category)} · price on request</small></span><button data-remove="${i}" aria-label="Remove ${esc(p.name)} from quote bag">×</button></div>` : ""; }).join("") : `<div class="empty-bag"><span aria-hidden="true">✳</span><p>Your quote bag is waiting<br>for a good idea.</p><button class="text-link" id="empty-shop">Browse the shelves ↗</button></div>`;
  }
  $("#category-filters").addEventListener("click", e => { const b = e.target.closest("[data-category]"); if (!b) return; activeCategory = b.dataset.category; $$(".filter-chip").forEach(x => { const on = x === b; x.classList.toggle("active", on); x.setAttribute("aria-pressed", on); }); renderProducts(); });
  $("#product-search").addEventListener("input", renderProducts);
  grid.addEventListener("click", e => { const b = e.target.closest("[data-add]"); if (!b) return; bag.push(b.dataset.add); updateBag(); b.textContent = "✓"; setTimeout(() => b.textContent = "+", 700); });
  $("#bag-items").addEventListener("click", e => { if (e.target.id === "empty-shop") { $("#bag-dialog").close(); $("#shop").scrollIntoView({ behavior: "smooth" }); } const b = e.target.closest("[data-remove]"); if (b) { bag.splice(Number(b.dataset.remove), 1); updateBag(); } });
  $("#bag-open").addEventListener("click", () => $("#bag-dialog").showModal());
  $("#bag-close").addEventListener("click", () => $("#bag-dialog").close());
  $("#clear-bag").addEventListener("click", () => { bag = []; updateBag(); });
  $("#copy-request").addEventListener("click", async () => { const text = `Hello, I’d like to ask about availability and current prices for:\n${bag.map(id => `• ${products.find(p => p.id === id)?.name}`).join("\n")}\n\nPlease let me know what’s available. This is an enquiry, not a confirmed order.`; try { await navigator.clipboard.writeText(text); $("#copy-status").textContent = "Enquiry copied. You can paste it into a message to the store."; } catch { $("#copy-status").textContent = text; } });
  const menu = $(".menu-toggle");
  menu.addEventListener("click", () => { const open = menu.getAttribute("aria-expanded") === "true"; menu.setAttribute("aria-expanded", String(!open)); $("#primary-nav").classList.toggle("nav-open", !open); });
  $$("#primary-nav a").forEach(a => a.addEventListener("click", () => { menu.setAttribute("aria-expanded", "false"); $("#primary-nav").classList.remove("nav-open"); }));

  // Consent state is stored locally. Optional tags are not loaded by this starter site.
  const consentKey = "devi-cookie-preferences";
  const banner = $("#cookie-banner");
  function openConsent() { const saved = JSON.parse(localStorage.getItem(consentKey) || "{}"); $("#analytics-consent").checked = !!saved.analytics; $("#marketing-consent").checked = !!saved.marketing; banner.hidden = false; }
  if (!localStorage.getItem(consentKey)) openConsent();
  $("#privacy-settings").addEventListener("click", openConsent);
  $("#cookie-save").addEventListener("click", () => { localStorage.setItem(consentKey, JSON.stringify({ essential: true, analytics: $("#analytics-consent").checked, marketing: $("#marketing-consent").checked, savedAt: new Date().toISOString() })); banner.hidden = true; });
  $("#cookie-close").addEventListener("click", () => { banner.hidden = true; });

  if (config.address) $("#footer-nap").textContent = `${config.address}${config.hours ? `\n${config.hours}` : ""}`;
  if (config.phone) { const p = $("#footer-phone"); p.href = `tel:${config.phone.replace(/[^+\d]/g, "")}`; p.textContent = config.phone; }
  $("#year").textContent = new Date().getFullYear();
  renderProducts(); updateBag();
})();
