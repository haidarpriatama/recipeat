# Design System Document: The Culinary Curator

## 1. Overview & Creative North Star
This design system is built to transform the functional act of meal planning into a high-end editorial experience. Moving away from the rigid, boxy constraints of traditional utility apps, we adopt the **"Culinary Curator"** as our North Star. 

This philosophy treats the UI as a living magazine—spacious, vibrant, and tactile. We prioritize breathing room, intentional asymmetry, and a sophisticated layering of surfaces to guide the user’s eye. By utilizing organic roundedness and "glass-on-paper" depth, we create an environment that feels as fresh as the ingredients in a chef's kitchen.

---

## 2. Colors: Tonal Depth & Vibrancy
The palette is a celebration of freshness. Greens represent vitality and growth, while oranges spark appetite and warmth.

### Core Palette
- **Primary (#006941):** The "Garden Deep." Used for high-level branding and primary actions.
- **Secondary (#8c4a00):** The "Zest." Used for highlights, culinary accents, and seasonal energy.
- **Surface (#f5f6f7):** Our canvas. A clean, off-white that prevents the "clinical" feel of pure white.

### The "No-Line" Rule
To achieve a premium, modern aesthetic, **1px solid borders are strictly prohibited** for sectioning content. Boundaries must be defined solely through:
1. **Background Shifts:** Placing a `surface-container-low` component on a `surface` background.
2. **Tonal Transitions:** Using depth to define the "start" and "end" of an element.

### Glass & Gradient Implementation
- **Signature Gradients:** Use a subtle linear gradient from `primary` to `primary_container` for hero banners or main CTA buttons. This provides a "soul" to the UI that flat colors lack.
- **Glassmorphism:** For floating navigation bars or mobile overlays, use semi-transparent `surface` colors with a `backdrop-blur` of 20px. This allows the vibrant food photography to bleed through the UI, making the app feel integrated and airy.

---

## 3. Typography: The Editorial Voice
We utilize a dual-font strategy to balance character with extreme readability.

- **The Display Voice (Plus Jakarta Sans):** Used for `display` and `headline` scales. This font brings a modern, geometric personality. Bold weights should be used with tight letter-spacing for a high-end editorial feel.
- **The Utility Voice (Inter):** Used for `title`, `body`, and `label` scales. Inter provides the technical precision needed for ingredient lists and cooking instructions, ensuring legibility at all sizes.

**Key Rule:** Maintain a high contrast between headline sizes and body text to reinforce the "magazine" hierarchy.

---

## 4. Elevation & Depth: Tonal Layering
Traditional shadows are often heavy and dated. This system uses **Tonal Layering** to create a physical sense of space.

### The Layering Principle
Think of the UI as stacked sheets of fine paper. 
- **Base:** `surface` (#f5f6f7)
- **Sections:** `surface-container-low` (#eff1f2)
- **Interactive Cards:** `surface-container-lowest` (#ffffff)

### Ambient Shadows
When a floating effect is required (e.g., a "Current Recipe" card), use "Ambient Shadows":
- **Blur:** 32px to 64px.
- **Opacity:** 4% to 8%.
- **Color:** Use a tint of the `on-surface` color rather than pure black to keep the shadow feeling soft and integrated with the background.

### The "Ghost Border"
If a border is required for accessibility, use a "Ghost Border": the `outline-variant` token at **15% opacity**. Never use 100% opaque lines.

---

## 5. Components

### Buttons & Interaction
- **Primary Button:** Large `xl` (1.5rem) rounded corners. Background: Gradient from `primary` to `primary_dim`. Text: `on_primary`.
- **Secondary/Ghost:** No background. Use `primary` text with a `surface-container-high` hover state.
- **Chips:** Used for dietary tags (e.g., "Vegan", "Gluten-Free"). Use `tertiary_container` with `on_tertiary` text for a soft, sophisticated look.

### Input Fields
- **Search & Inputs:** Use `surface_container_lowest` with a `md` (0.75rem) corner radius. Instead of a border, use a subtle 1-2px inset shadow to create a "pressed" feel into the surface.

### Cards & Recipes
- **Rule:** **No Divider Lines.** Separate recipe title, time, and calories using vertical whitespace (16px/24px) or subtle typography weight shifts.
- **Image Treatment:** All food photography must have a `lg` (1rem) corner radius. Use a subtle `surface_dim` inner glow to make the images pop.

### Custom App Components
- **The Meal Timeline:** An asymmetric vertical track using `primary_fixed` to connect daily meals, avoiding a standard grid for a more "journey-based" layout.
- **Ingredient Checklist:** Use the `secondary` orange for checkmarks to provide a satisfying "completed" state that stands out against the green-dominated UI.

---

## 6. Do's and Don'ts

### Do
- **Do** use generous white space (32px+) between major sections.
- **Do** lean into the `xl` and `full` roundedness for buttons and tags to keep the "friendly" chef-like persona.
- **Do** use "surface nesting" (putting a white card on a light grey section) to define hierarchy.
- **Do** prioritize mobile-first gestures; buttons should be thumb-friendly and surfaces should feel "swipeable."

### Don't
- **Don't** use 1px solid black or grey borders.
- **Don't** use sharp 0px corners; everything in a kitchen (and this app) should feel tactile and safe.
- **Don't** crowd the interface with too many icons. Let the food photography and typography do the heavy lifting.
- **Don't** use standard "drop shadows." Use the Ambient Shadow specifications provided in section 4.