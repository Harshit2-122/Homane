# Homane — website source

This is a static marketing website built for launch-ready deployment. It uses semantic HTML, separate CSS layers, and plain JavaScript with no build step.

## Structure

```
index.html            All markup, semantic HTML5
css/
  tokens.css           Colors, fonts, spacing — the theme's single source of truth
  base.css              Typography, texture, shared utilities (reveal, hand-marks)
  components.css         Nav, buttons, splash screen, accordion, form
  sections.css            Page section layouts + responsive rules
js/
  main.js               Splash, scrollspy, accordion, step-toggler, form validation
```

No build step, no dependencies, no framework — open `index.html` in a browser and it runs. This also means it deploys as-is to any static host.

## Deploying

Any static host works. Drag-and-drop the whole folder into:
- **Netlify** — netlify.com/drop
- **Vercel** — `vercel deploy` from this folder
- **GitHub Pages** — push to a repo, enable Pages on the `main` branch

Point your domain's DNS at whichever host you pick; each has its own custom-domain instructions.

## Launch checklist

- [x] Branding is aligned across the site
- [x] Contact email is set to a publishable inbox
- [x] SEO metadata and favicon are included
- [ ] Connect the contact form to a real backend if you want submissions tracked automatically
- [ ] Point your domain to your static host of choice

## Editing the theme

Every color, font, and radius lives in `css/tokens.css` as a CSS custom property. Changing `--amber` there, for instance, updates every accent use across the whole site — no need to hunt through other files.

## Interactive elements

- **Splash screen** — 3-second letter-in animation on load, skippable, respects `prefers-reduced-motion`
- **Scrollspy nav** — active section highlights in the header as you scroll
- **Scroll-progress bar** — thin line at the top of the viewport
- **"What We Do" accordion** — click a row to expand its detail
- **"How We Work" step toggler** — click a step label or a dot on the diagram to switch the active step
- **Contact form** — inline validation, live character count, no page reload
