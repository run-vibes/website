# Shared Utilities

Common code and content shared across all three prototypes.

---

## Files

| File | Purpose |
|------|---------|
| `reset.css` | Normalize browser defaults |
| `animations.js` | Scroll observer and easing utilities |
| `content.js` | Shared content data (headlines, services, etc.) |

## Content Data

All prototypes use identical content to ensure fair visual comparison:

### Headlines
- **Primary:** "The studio where AI agents come to life"
- **Subheadline:** "Delivering impact you can measure"

### Services (4)
1. **Agent Development** — End-to-end design and development of AI agents
2. **AI Strategy & Consulting** — Advisory and roadmapping
3. **Product Development** — Building AI-native products
4. **Workshops & Training** — Upskilling teams

### Case Studies (3 placeholders)
- Fintech: Automated compliance agent
- E-commerce: Inventory optimization system
- SaaS: Customer support automation

### Industries (4)
- Fintech
- E-commerce
- SaaS
- Professional Services

### Insights (3 placeholder articles)
- "Building Multi-Agent Systems That Scale"
- "The ROI of AI Agents: A Framework"
- "From Chatbot to Agent: What's the Difference?"

## Animation System

The `animations.js` file provides:

```javascript
// Intersection Observer wrapper
observeSections({
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px',
  onEnter: (element) => element.classList.add('visible'),
  staggerChildren: true,
  staggerDelay: 100
});
```

Each prototype defines its own CSS for the `.visible` state transitions.

## Usage

Each prototype's `index.html` imports shared utilities:

```html
<link rel="stylesheet" href="../shared/reset.css">
<script src="../shared/content.js"></script>
<script src="../shared/animations.js"></script>
```
