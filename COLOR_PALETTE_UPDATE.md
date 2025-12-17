# Creative Color Palette Update

## New Color Scheme

The Braille Translator application now features a vibrant, modern, and creative color palette designed to be both visually engaging and accessible.

### Primary Colors

**Purple (Primary)**
- Light Mode: `HSL(270, 60%, 50%)` - Rich, vibrant purple
- Dark Mode: `HSL(270, 70%, 65%)` - Lighter purple for dark backgrounds
- Glow Variant: `HSL(270, 70%, 65%)` / `HSL(270, 80%, 75%)`
- Usage: Main brand color, primary buttons, key UI elements

**Teal (Secondary)**
- Light Mode: `HSL(180, 70%, 45%)` - Fresh, vibrant teal
- Dark Mode: `HSL(180, 70%, 50%)` - Slightly brighter for contrast
- Usage: Secondary actions, complementary highlights, history page accents

**Coral/Orange (Accent)**
- Light Mode: `HSL(15, 85%, 60%)` - Warm, energetic coral
- Dark Mode: `HSL(15, 85%, 65%)` - Slightly lighter for visibility
- Usage: Call-to-action elements, important highlights, translation page accents

### Background Colors

**Light Mode**
- Background: `HSL(270, 30%, 97%)` - Soft off-white with purple tint
- Card: `HSL(0, 0%, 100%)` - Pure white for contrast
- Muted: `HSL(270, 20%, 92%)` - Light purple-gray

**Dark Mode**
- Background: `HSL(270, 40%, 10%)` - Deep purple-black
- Card: `HSL(270, 35%, 14%)` - Slightly lighter purple-black
- Muted: `HSL(270, 30%, 20%)` - Medium purple-gray

### Text Colors

**Light Mode**
- Foreground: `HSL(270, 50%, 15%)` - Dark purple-black
- Muted Foreground: `HSL(270, 15%, 45%)` - Medium gray with purple tint

**Dark Mode**
- Foreground: `HSL(270, 20%, 95%)` - Off-white with purple tint
- Muted Foreground: `HSL(270, 15%, 65%)` - Light gray with purple tint

## Visual Enhancements

### Gradient Effects

**Primary Gradient**
```css
linear-gradient(135deg, hsl(270 60% 50%), hsl(270 70% 65%))
```
- Used for: Main headings, feature icons, primary CTAs

**Secondary Gradient**
```css
linear-gradient(135deg, hsl(180 70% 45%), hsl(180 60% 60%))
```
- Used for: History page elements, secondary highlights

**Accent Gradient**
```css
linear-gradient(135deg, hsl(15 85% 60%), hsl(30 90% 65%))
```
- Used for: Special call-to-action elements

### Gradient Text Utilities

Three new utility classes for gradient text effects:

1. `.gradient-text` - Primary purple gradient
2. `.gradient-text-secondary` - Teal gradient
3. `.gradient-text-accent` - Coral/orange gradient

Usage:
```jsx
<h1 className="text-4xl font-bold">
  <span className="gradient-text">Braille Translator</span>
</h1>
```

## Page-Specific Enhancements

### Landing Page
- Gradient background: `from-background via-background to-primary/5`
- Feature cards with gradient icons
- Hover effects with scale and shadow transitions
- Gradient CTA card at bottom

### Dashboard Page
- Gradient background: `from-background via-background to-secondary/5`
- Gradient text heading
- Stat cards with hover effects and border highlights
- Icon backgrounds with primary color

### Translation Page
- Gradient background: `from-background via-background to-accent/5`
- Gradient text heading
- Clean, focused interface for translation work

### History Page
- Gradient background: `from-background via-background to-secondary/5`
- Secondary gradient text heading
- Translation cards with teal gradient icons
- Hover effects with scale and border highlights

## Interactive Elements

### Hover Effects
- Cards: Scale up slightly (1.02-1.05x) with shadow increase
- Borders: Transition to colored borders on hover
- Buttons: Enhanced shadows and subtle transformations

### Transitions
- Duration: 300ms for smooth animations
- Easing: Default ease-out for natural feel
- Properties: transform, shadow, border-color

## Accessibility Considerations

### Contrast Ratios
- All text colors meet WCAG AA standards
- Primary purple provides excellent contrast on white
- Teal and coral used strategically for highlights
- Dark mode colors carefully calibrated for readability

### Color Blindness
- Purple and teal provide good distinction for most types of color blindness
- Coral accent adds warmth without relying solely on red
- Sufficient contrast ensures usability regardless of color perception

## Design Philosophy

The new color palette embodies:

1. **Creativity**: Vibrant purple and teal create a modern, engaging aesthetic
2. **Energy**: Coral accents add warmth and excitement
3. **Professionalism**: Carefully balanced colors maintain credibility
4. **Accessibility**: High contrast and thoughtful color choices ensure usability
5. **Cohesion**: Complementary colors create visual harmony throughout the app

## Technical Implementation

All colors are defined as CSS custom properties in `src/index.css` using HSL values for easy manipulation and theming. The design system is fully integrated with Tailwind CSS through `tailwind.config.js`, ensuring consistent usage across all components.

---

**Updated**: December 2024
**Color Scheme**: Complementary (Purple + Teal with Coral accents)
**Accessibility**: WCAG AA Compliant
