/* ═══════════════════════════════════════════
   POCKETCHEF – app.js
   All feature logic: Profile, Cooking, Planner,
   Nutrition, Pantry Scanner, Grocery Assistant
═══════════════════════════════════════════ */

/* ═══════════════ SECTION ENTRANCE OBSERVER ══════════ */
document.addEventListener('DOMContentLoaded', () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.12 });
  document.querySelectorAll('.section, .alt-bg').forEach(s => observer.observe(s));

  // Init all features
  initToggleGroups();
  initCalorieSlider();
  initRecipes();
  generateMealPlan();
  updateNutrition();
  initPantry();
  initGrocery();
  initNavHighlight();
});

/* ═══════════════ NAVBAR SCROLL HIGHLIGHT ════════════ */
function initNavHighlight() {
  const sections = document.querySelectorAll('section[id], header[id]');
  const links = document.querySelectorAll('.nav-links a');
  window.addEventListener('scroll', () => {
    let cur = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 100) cur = s.id;
    });
    links.forEach(a => {
      a.style.background = a.getAttribute('href') === '#' + cur
        ? 'rgba(255,255,255,0.15)' : '';
      a.style.color = a.getAttribute('href') === '#' + cur
        ? '#ffffff' : '';
    });
  });
}

/* ═══════════════════ TOGGLE GROUPS ══════════════════ */
function initToggleGroups() {
  document.querySelectorAll('.toggle-group').forEach(group => {
    group.querySelectorAll('.toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        group.querySelectorAll('.toggle').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  });
}

/* ═══════════════ CALORIE SLIDER ═════════════════════ */
function initCalorieSlider() {
  const slider  = document.getElementById('calorie-slider');
  const display = document.getElementById('calorie-display');
  if (!slider) return;
  slider.addEventListener('input', () => {
    display.textContent = slider.value;
  });
}

/* ═══════════════ SAVE PROFILE ═══════════════════════ */
function saveProfile() {
  const name = document.getElementById('profile-name').value.trim() || 'Jamie Tran';
  const cals = document.getElementById('calorie-slider').value;
  const diet = document.querySelector('#diet-type .toggle.active')?.dataset.value || 'balanced';
  const skill = document.querySelector('#skill-level .toggle.active')?.dataset.value || 'beginner';
  const allergy = document.getElementById('allergies').value;

  // Update UI
  document.getElementById('user-name-nav').textContent = name;
  document.getElementById('target-display').textContent = cals;
  document.getElementById('calorie-intake').max = cals * 1.5;

  // Show confirm
  const msg = document.getElementById('profile-saved-msg');
  msg.classList.remove('hidden');
  msg.textContent = `✅ Profile saved! ${name} · ${diet} · ${cals} kcal/day · ${skill}${allergy ? ' · ⚠ ' + allergy : ''}`;
  setTimeout(() => msg.classList.add('hidden'), 4000);

  // Update nutrition tip based on diet
  const tips = {
    balanced: 'Aim for a variety of whole foods across all macronutrient groups.',
    vegan: 'Ensure adequate B12, iron, and omega-3 from plant sources.',
    vegetarian: 'Combine legumes and grains for complete protein profiles.',
    keto: 'Keep carbs under 50g/day and prioritise healthy fats.',
    paleo: 'Focus on lean meats, fish, fruits, vegetables, and nuts.'
  };
  document.getElementById('nutrition-tip').innerHTML =
    `💡 <strong>Tip for ${diet} diet:</strong> ${tips[diet] || tips.balanced}`;
}

/* ═══════════════ GUIDED COOKING ═════════════════════ */
const RECIPES = {
  'avocado': {
    steps: [
      { emoji: '🥑', title: 'Prepare the Avocado', desc: 'Slice the avocado in half, remove the pit, and scoop the flesh into a bowl. Add a pinch of salt and mash lightly with a fork.', ingredients: ['1 ripe avocado', 'Pinch of salt'] },
      { emoji: '🍞', title: 'Toast the Bread', desc: 'Toast 2 slices of sourdough bread until golden and crispy. Spread the mashed avocado generously on each slice.', ingredients: ['2 slices sourdough bread'] },
      { emoji: '🥚', title: 'Fry the Eggs', desc: 'Heat 1 tsp of olive oil in a non-stick pan over medium heat. Crack 2 eggs and cook to your preference (sunny side up recommended).', ingredients: ['2 eggs', '1 tsp olive oil'] },
      { emoji: '🍽️', title: 'Assemble & Serve', desc: 'Place the fried eggs on top of the avocado toast. Season with red pepper flakes, lemon juice and fresh herbs. Serve immediately.', ingredients: ['Red pepper flakes', 'Lemon juice', 'Fresh herbs'] }
    ]
  },
  'banh-mi': {
    steps: [
      { emoji: '🥖', title: 'Prepare the Baguette', desc: 'Slice the baguette lengthwise and lightly toast the inside in the oven at 180°C for 5 minutes until crisp.', ingredients: ['1 baguette'] },
      { emoji: '🥩', title: 'Season the Protein', desc: 'Marinate the pork or chicken with fish sauce, lemongrass, garlic, and sugar for at least 20 minutes before grilling.', ingredients: ['200g pork or chicken', '2 tbsp fish sauce', '1 lemongrass stalk', '2 garlic cloves'] },
      { emoji: '🥕', title: 'Pickle the Vegetables', desc: 'Combine shredded daikon and carrots with rice vinegar, sugar and salt. Let sit for 15 minutes to quick-pickle.', ingredients: ['1 cup daikon', '1 carrot', '3 tbsp rice vinegar', '1 tsp sugar'] },
      { emoji: '🌿', title: 'Assemble & Serve', desc: 'Spread pâté and mayo on the bread. Add the grilled protein, pickled vegetables, cucumber slices, jalapeños, and fresh coriander.', ingredients: ['Pâté', 'Mayo', 'Cucumber', 'Jalapeño', 'Coriander'] }
    ]
  },
  'salmon': {
    steps: [
      { emoji: '🐟', title: 'Prepare the Salmon', desc: 'Pat salmon fillets dry and season with salt, pepper, and a drizzle of olive oil. Let rest at room temperature for 10 minutes.', ingredients: ['2 salmon fillets (150g each)', 'Salt & pepper', '1 tbsp olive oil'] },
      { emoji: '🥦', title: 'Prepare the Vegetables', desc: 'Chop broccoli, zucchini and bell peppers into even pieces. Toss with olive oil, salt, pepper and garlic powder.', ingredients: ['1 cup broccoli', '1 zucchini', '1 bell pepper', '1 tsp garlic powder'] },
      { emoji: '🔥', title: 'Grill the Salmon', desc: 'Heat grill pan over high heat. Place salmon skin-side down and cook 4 minutes each side until skin is crispy and flesh is opaque.', ingredients: [] },
      { emoji: '🍽️', title: 'Plate & Serve', desc: 'Arrange roasted vegetables alongside the salmon. Drizzle with lemon juice and garnish with fresh dill.', ingredients: ['Lemon juice', 'Fresh dill'] }
    ]
  },
  'tacos': {
    steps: [
      { emoji: '🫓', title: 'Warm the Tortillas', desc: 'Warm tortillas in a dry pan over medium heat for 30 seconds each side, or wrap in foil and heat in oven at 160°C for 10 minutes.', ingredients: ['6 small corn or flour tortillas'] },
      { emoji: '🧅', title: 'Cook Peppers & Onions', desc: 'Add peppers and onions to a hot pan with oil and cook for 4 minutes until softened and slightly charred. Season with cumin and smoked paprika.', ingredients: ['2 bell peppers (1 red, 1 yellow)', '1 onion diced and sliced', '1 tsp cumin', '½ tsp smoked paprika'] },
      { emoji: '🫘', title: 'Prepare the Filling', desc: 'Add black beans and diced tomatoes to the pan. Cook 3 minutes until warmed through. Squeeze fresh lime juice over everything.', ingredients: ['1 can black beans, drained', '2 tomatoes diced', 'Juice of 1 lime'] },
      { emoji: '🌮', title: 'Build Your Tacos', desc: 'Spoon filling into warm tortillas. Top with shredded cheese, sour cream, fresh salsa and chopped coriander. Serve with lime wedges.', ingredients: ['Shredded cheese', 'Sour cream', 'Fresh salsa', 'Coriander', 'Lime wedges'] }
    ]
  }
};

let currentRecipe = 'avocado';
let currentStep = 0;

function initRecipes() { loadRecipe(); }

function loadRecipe() {
  const sel = document.getElementById('recipe-select');
  currentRecipe = sel ? sel.value : 'avocado';
  currentStep = 0;
  renderStep();
}

function renderStep() {
  const recipe = RECIPES[currentRecipe];
  const step   = recipe.steps[currentStep];
  const total  = recipe.steps.length;

  document.getElementById('step-num').textContent   = currentStep + 1;
  document.getElementById('step-total').textContent = total;
  document.getElementById('step-image').textContent = step.emoji;
  document.getElementById('step-title').textContent = step.title;
  document.getElementById('step-desc').textContent  = step.desc;

  const ul = document.getElementById('step-ingredients');
  ul.innerHTML = step.ingredients.length
    ? step.ingredients.map(i => `<li>${i}</li>`).join('')
    : '<li><em>No additional ingredients for this step</em></li>';

  // Dots
  const dotsEl = document.getElementById('step-dots');
  dotsEl.innerHTML = recipe.steps.map((_, i) =>
    `<div class="step-dot ${i === currentStep ? 'active' : ''}"></div>`).join('');

  document.getElementById('prev-btn').disabled = currentStep === 0;
  document.getElementById('next-btn').textContent =
    currentStep === total - 1 ? '🎉 Finish!' : 'Next Step →';
  document.getElementById('next-btn').disabled = false;
}

function nextStep() {
  const recipe = RECIPES[currentRecipe];
  if (currentStep < recipe.steps.length - 1) {
    currentStep++;
    renderStep();
  } else {
    alert('🎉 Recipe complete! Enjoy your meal!');
    currentStep = 0;
    renderStep();
  }
}

function prevStep() {
  if (currentStep > 0) { currentStep--; renderStep(); }
}

function toggleVideo(e) {
  e.preventDefault();
  const vp = document.getElementById('video-placeholder');
  vp.classList.toggle('hidden');
}

/* ═══════════════ MEAL PLANNER ═══════════════════════ */
const MEAL_POOL = {
  breakfast: [
    { name: 'Avocado Toast w/ Eggs', kcal: 354 },
    { name: 'Greek Yoghurt & Berries', kcal: 220 },
    { name: 'Oatmeal with Banana', kcal: 310 },
    { name: 'Smoothie Bowl', kcal: 290 },
    { name: 'Scrambled Eggs & Toast', kcal: 380 },
    { name: 'Chia Pudding', kcal: 260 }
  ],
  lunch: [
    { name: 'Grilled Salmon w/ Veggies', kcal: 508 },
    { name: 'Chicken Caesar Salad', kcal: 420 },
    { name: 'Banh Mi Sandwich', kcal: 380 },
    { name: 'Quinoa Buddha Bowl', kcal: 460 },
    { name: 'Lentil Soup & Bread', kcal: 340 },
    { name: 'Turkey Wrap', kcal: 390 }
  ],
  dinner: [
    { name: 'Warm Tortilla Tacos', kcal: 620 },
    { name: 'Pasta Primavera', kcal: 540 },
    { name: 'Chicken Stir Fry', kcal: 480 },
    { name: 'Beef & Veg Curry', kcal: 590 },
    { name: 'Baked Cod w/ Salad', kcal: 420 },
    { name: 'Mushroom Risotto', kcal: 510 }
  ],
  snack: [
    { name: 'Apple & Almond Butter', kcal: 180 },
    { name: 'Mixed Nuts', kcal: 160 },
    { name: 'Hummus & Crackers', kcal: 200 },
    { name: 'Protein Bar', kcal: 210 }
  ]
};

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function generateMealPlan() {
  const grid = document.getElementById('planner-grid');
  if (!grid) return;
  grid.innerHTML = '';

  DAYS.forEach(day => {
    const b = pick(MEAL_POOL.breakfast);
    const l = pick(MEAL_POOL.lunch);
    const d = pick(MEAL_POOL.dinner);
    const s = pick(MEAL_POOL.snack);

    grid.innerHTML += `
      <div class="planner-day">
        <div class="planner-day-name">${day}</div>
        <div class="planner-meal">
          <span class="meal-type">Breakfast</span>
          <span class="meal-name">${b.name}</span>
          <span class="meal-kcal">${b.kcal} kcal</span>
        </div>
        <div class="planner-meal">
          <span class="meal-type">Lunch</span>
          <span class="meal-name">${l.name}</span>
          <span class="meal-kcal">${l.kcal} kcal</span>
        </div>
        <div class="planner-meal">
          <span class="meal-type">Dinner</span>
          <span class="meal-name">${d.name}</span>
          <span class="meal-kcal">${d.kcal} kcal</span>
        </div>
        <div class="planner-meal">
          <span class="meal-type">Snack</span>
          <span class="meal-name">${s.name}</span>
          <span class="meal-kcal">${s.kcal} kcal</span>
        </div>
      </div>`;
  });
}

/* ═══════════════ NUTRITION ══════════════════════════ */
function updateNutrition() {
  const intake = parseInt(document.getElementById('calorie-intake').value) || 0;
  const target = parseInt(document.getElementById('target-display').textContent) || 2000;
  const pct    = Math.min(intake / target, 1);

  // SVG circle: r=50 circumference=314
  const offset = 314 - (314 * pct);
  const circle = document.getElementById('calorie-circle');
  if (circle) circle.setAttribute('stroke-dashoffset', offset.toFixed(1));

  document.getElementById('intake-display').textContent = intake;

  // Status message
  const statusEl = document.getElementById('calorie-status');
  if (pct < 0.5)       statusEl.textContent = '⚠ You need to eat more today!';
  else if (pct < 0.85) statusEl.textContent = "You're on track! Keep it up.";
  else if (pct < 1)    statusEl.textContent = '🔥 Almost at your target!';
  else                 statusEl.textContent = '✅ Daily target reached!';

  // Macros scale proportionally
  const scale = intake / 1450; // baseline 1450
  const proteinPct = Math.min(68 * scale, 100);
  const carbPct    = Math.min(77 * scale, 100);
  const fatPct     = Math.min(87 * scale, 100);

  const pBar = document.getElementById('protein-bar');
  const cBar = document.getElementById('carb-bar');
  const fBar = document.getElementById('fat-bar');
  if (pBar) pBar.style.width = proteinPct.toFixed(0) + '%';
  if (cBar) cBar.style.width = carbPct.toFixed(0) + '%';
  if (fBar) fBar.style.width = fatPct.toFixed(0) + '%';

  const pG  = Math.round(82 * scale);
  const cG  = Math.round(155 * scale);
  const fG  = Math.round(52 * scale);
  const pv  = document.getElementById('protein-val');
  const cv  = document.getElementById('carb-val');
  const fv  = document.getElementById('fat-val');
  if (pv) pv.textContent = `${pG}g / 120g`;
  if (cv) cv.textContent = `${cG}g / 200g`;
  if (fv) fv.textContent = `${fG}g / 60g`;
}

/* ═══════════════ PANTRY SCANNER ═════════════════════ */
let pantryItems = [
  'Avocados', 'Eggs', 'Milk', 'Butter', 'Chicken Breast',
  'Salmon Fillet', 'Lettuce', 'Bell Peppers', 'Onions', 'Garlic',
  'Pasta', 'Rice', 'Canned Beans', 'Olive Oil', 'Greek Yoghurt',
  'Cheddar Cheese', 'Bread', 'Oats', 'Bananas', 'Tomatoes'
];

const EXPIRY_DATA = [
  { icon: '🥛', name: 'Milk', date: '2 days', status: 'soon' },
  { icon: '🍝', name: 'Pasta', date: '17 days', status: 'ok' },
  { icon: '🍞', name: 'Bread', date: '8 days', status: 'ok' }
];
const BESTBEFORE_DATA = [
  { icon: '🦃', name: 'Turkey Slices', date: '3 days', status: 'soon' },
  { icon: '🧃', name: 'Greek Yoghurt', date: '11 days', status: 'ok' },
  { icon: '🍘', name: 'Crackers', date: '30 days', status: 'ok' }
];

const SCANNED_PRODUCTS = [
  'Organic Whole Milk (2L) – 125 kcal / 100ml',
  'Sourdough Bread – 265 kcal / 100g',
  'Free-Range Eggs (6 pack)',
  'Cheddar Cheese (200g) – 402 kcal / 100g',
  'Greek Yoghurt (500g) – 97 kcal / 100g',
  'Black Beans Can (400g)',
  'Extra Virgin Olive Oil (500ml)',
  'Chicken Breast (300g) – 165 kcal / 100g'
];

function initPantry() {
  renderPantryTags();
  renderExpiryLists();
}

function renderPantryTags() {
  const tagsEl = document.getElementById('pantry-tags');
  if (!tagsEl) return;
  tagsEl.innerHTML = pantryItems.map(i =>
    `<span class="pantry-tag">${i}</span>`).join('');
}

function renderExpiryLists() {
  const expEl = document.getElementById('expiry-list');
  const bbEl  = document.getElementById('bestbefore-list');
  if (expEl) expEl.innerHTML = EXPIRY_DATA.map(makeExpiryItem).join('');
  if (bbEl)  bbEl.innerHTML  = BESTBEFORE_DATA.map(makeExpiryItem).join('');
}

function makeExpiryItem(item) {
  return `<li class="expiry-item">
    <span class="expiry-icon">${item.icon}</span>
    <span class="expiry-name">${item.name}</span>
    <span class="expiry-date ${item.status}">Expires in ${item.date}</span>
  </li>`;
}

function switchScanTab(tab, btn) {
  document.querySelectorAll('.stab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('barcode-panel').classList.toggle('hidden', tab !== 'barcode');
  document.getElementById('expiry-panel').classList.toggle('hidden', tab !== 'expiry');
}

let scanActive = false;
function simulateScan() {
  if (scanActive) return;
  scanActive = true;
  const status = document.getElementById('scan-status');
  const line   = document.getElementById('scan-line');
  const result = document.getElementById('scan-result');
  result.classList.add('hidden');
  status.textContent = 'Scanning…';
  line.style.animationPlayState = 'running';

  setTimeout(() => {
    const product = SCANNED_PRODUCTS[Math.floor(Math.random() * SCANNED_PRODUCTS.length)];
    status.textContent = '✓ Item found!';
    result.classList.remove('hidden');
    result.innerHTML = `<strong>✅ Scanned:</strong> ${product}`;
    scanActive = false;

    // Add to pantry if new
    const name = product.split(' –')[0].split('(')[0].trim();
    if (!pantryItems.includes(name)) {
      pantryItems.push(name);
      renderPantryTags();
    }
  }, 2000);
}

function addManualItem() {
  const name = prompt('Enter item name to add to pantry:');
  if (name && name.trim()) {
    pantryItems.push(name.trim());
    renderPantryTags();
    document.getElementById('scan-result').classList.remove('hidden');
    document.getElementById('scan-result').innerHTML = `<strong>✅ Added manually:</strong> ${name.trim()}`;
  }
}

function addExpiryItem() {
  const name = prompt('Enter product name:');
  const days = prompt('Enter days until expiry:');
  if (name && days) {
    const isNum = parseInt(days) <= 5;
    EXPIRY_DATA.push({ icon: '📦', name: name.trim(), date: days + ' days', status: isNum ? 'soon' : 'ok' });
    renderExpiryLists();
  }
}

/* ═══════════════ GROCERY ASSISTANT ══════════════════ */
const GROCERY_DATA = {
  Produce:         ['Lettuce', 'Bell peppers', 'Avocados', 'Apples', 'Bananas', 'Tomatoes'],
  Dairy:           ['Milk', 'Greek Yoghurt', 'Cheddar Cheese'],
  'Meats & Seafood': ['Chicken breast', 'Salmon fillet', 'Turkey slices'],
  Pantry:          ['Olive Oil', 'Canned Beans', 'Pasta', 'Rice', 'Oats'],
  Bakery:          ['Sourdough Bread', 'Whole Wheat Wraps']
};

const SUBSTITUTIONS = [
  { original: 'Salmon Fillet',   alt: 'Tinned Tuna',          reason: 'Cheaper & same omega-3 profile' },
  { original: 'Avocados',        alt: 'Hummus',                reason: 'Similar healthy fats, more affordable' },
  { original: 'Greek Yoghurt',   alt: 'Plain Yoghurt',         reason: '⅓ the price, similar protein' },
  { original: 'Chicken Breast',  alt: 'Chicken Thigh',         reason: 'Cheaper cut, more flavourful' },
  { original: 'Sourdough Bread', alt: 'Whole Wheat Bread',     reason: 'Lower cost, higher fibre' },
  { original: 'Cheddar Cheese',  alt: 'Mozzarella',            reason: 'Lower fat, budget-friendly' }
];

const STORES = [
  { name: 'Woolworths', total: '$47.20', best: false },
  { name: 'Coles',      total: '$44.85', best: false },
  { name: 'ALDI',       total: '$38.50', best: true  },
  { name: 'IGA',        total: '$51.30', best: false }
];

function initGrocery() {
  renderGroceryList();
  renderSubstitutions();
  renderStores();
}

function renderGroceryList() {
  const container = document.getElementById('grocery-categories');
  if (!container) return;
  container.innerHTML = '';
  let idCounter = 0;

  Object.entries(GROCERY_DATA).forEach(([cat, items]) => {
    const div = document.createElement('div');
    div.className = 'grocery-category';
    div.innerHTML = `<h5>${cat}</h5>` + items.map(item => {
      const id = 'gi_' + (idCounter++);
      return `<div class="grocery-item">
        <input type="checkbox" id="${id}"/>
        <label for="${id}">${item}</label>
      </div>`;
    }).join('');
    container.appendChild(div);
  });
}

function renderSubstitutions() {
  const el = document.getElementById('subs-list');
  if (!el) return;
  el.innerHTML = SUBSTITUTIONS.map(s => `
    <div class="sub-item">
      <span class="sub-original">❌ ${s.original}</span>
      <span class="sub-arrow">→</span>
      <span class="sub-alt">✅ ${s.alt}</span>
      <span class="sub-reason">${s.reason}</span>
    </div>`).join('');
}

function renderStores() {
  const el = document.getElementById('store-grid');
  if (!el) return;
  el.innerHTML = STORES.map(s => `
    <div class="store-card ${s.best ? 'best' : ''}">
      <div class="store-name">${s.name}</div>
      <div class="store-price">${s.total}</div>
      <div class="store-label">Estimated total</div>
      ${s.best ? '<span class="best-badge">🏆 Best Price</span>' : ''}
    </div>`).join('');
}

function switchGroceryTab(tab, btn) {
  document.querySelectorAll('.gtab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('grocery-list-panel').classList.toggle('hidden', tab !== 'list');
  document.getElementById('grocery-substitutions-panel').classList.toggle('hidden', tab !== 'substitutions');
  document.getElementById('grocery-stores-panel').classList.toggle('hidden', tab !== 'stores');
}

function autoGenerateList() {
  // Add low-stock items from pantry to list
  const low = ['Avocados', 'Milk', 'Eggs', 'Bell peppers'];
  low.forEach(item => {
    const lowerCat = Object.entries(GROCERY_DATA).find(([, items]) =>
      items.some(i => i.toLowerCase() === item.toLowerCase()));
    if (!lowerCat) {
      GROCERY_DATA['Produce'] = GROCERY_DATA['Produce'] || [];
      if (!GROCERY_DATA['Produce'].includes(item)) GROCERY_DATA['Produce'].push(item);
    }
  });
  renderGroceryList();
  alert('🛒 Shopping list updated from pantry scan! Low-stock items added.');
}

function clearPurchases() {
  document.querySelectorAll('.grocery-item input[type="checkbox"]').forEach(cb => {
    cb.checked = false;
  });
}

/* ═══════════════ SECTION DOWNLOAD ═══════════════════ */
function downloadSection(sectionId) {
  const el = document.getElementById(sectionId);
  if (!el) return;

  // Gather styles
  const styles = Array.from(document.styleSheets).reduce((css, sheet) => {
    try {
      return css + Array.from(sheet.cssRules).map(r => r.cssText).join('\n');
    } catch { return css; }
  }, '');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>PocketChef – ${sectionId}</title>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet"/>
  <style>
    :root {
      --green:#1e3a2f;--green-mid:#2d5a3d;--green-light:#4a7c59;
      --cream:#f5f0e8;--cream-dark:#ede5d4;--red:#c0392b;--red-light:#e74c3c;
      --gold:#d4a853;--text:#1a1a1a;--text-muted:#6b6560;--white:#ffffff;
      --shadow:0 8px 40px rgba(0,0,0,0.12);--radius:16px;--radius-sm:8px;
      --font-head:'Playfair Display',Georgia,serif;--font-body:'DM Sans',sans-serif;
    }
    body { font-family:var(--font-body);background:var(--cream);color:var(--text);padding:2rem; }
    ${styles}
  </style>
</head>
<body>${el.outerHTML}</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `pocketchef-${sectionId}.html`;
  a.click();
  URL.revokeObjectURL(url);
}
