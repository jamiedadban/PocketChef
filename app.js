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


