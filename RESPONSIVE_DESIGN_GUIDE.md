# Responsive Design System - Rundi AI

## Overview
This document outlines the responsive design system implemented across the entire Rundi AI Next.js application.

## Breakpoints
Following Tailwind CSS default breakpoints:
- **Mobile**: < 640px (default)
- **sm**: ≥ 640px (Small tablets)
- **md**: ≥ 768px (Tablets)
- **lg**: ≥ 1024px (Laptops)
- **xl**: ≥ 1280px (Desktops)
- **2xl**: ≥ 1536px (Large desktops)

## Typography Scale

### Mobile (< 640px)
- Base font-size: 16px
- Headings scale: 0.875rem - 2rem
- Body text: 0.875rem - 1rem
- Small text: 0.75rem - 0.875rem

### Tablet (≥ 768px)
- Base font-size: 17px
- Headings scale: 1rem - 2.5rem
- Body text: 0.9375rem - 1.0625rem

### Desktop (≥ 1024px)
- Base font-size: 19px (current)
- Headings scale: 1.125rem - 3rem
- Body text: 1rem - 1.125rem

## Spacing System

### Container Padding
- Mobile: `px-4` (1rem)
- Tablet: `sm:px-6` (1.5rem)
- Desktop: `lg:px-8` (2rem)

### Section Spacing
- Mobile: `py-8` (2rem)
- Tablet: `sm:py-12` (3rem)
- Desktop: `lg:py-16` (4rem)

### Grid Gaps
- Mobile: `gap-4` (1rem)
- Tablet: `sm:gap-6` (1.5rem)
- Desktop: `lg:gap-8` (2rem)

## Layout Patterns

### Navigation
- **Mobile**: Bottom navigation bar + hamburger menu
- **Tablet**: Same as mobile
- **Desktop**: Top horizontal navigation + sidebar

### Sidebar
- **Mobile**: Overlay drawer (280px width)
- **Desktop**: Fixed sidebar (280px expanded, 64px collapsed)

### Content Grid
```tsx
// 1 column mobile, 2 columns tablet, 3+ columns desktop
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
```

### Cards
```tsx
<div className="p-4 sm:p-6 lg:p-8">
  <h3 className="text-lg sm:text-xl lg:text-2xl">Title</h3>
  <p className="text-sm sm:text-base">Content</p>
</div>
```

## Component Patterns

### Buttons
```tsx
// Responsive button
<button className="px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base">
  Click me
</button>
```

### Images
```tsx
// Responsive image container
<div className="h-48 sm:h-64 lg:h-80">
  <img className="w-full h-full object-cover" />
</div>
```

### Modals
```tsx
// Responsive modal
<div className="w-full max-w-sm sm:max-w-md lg:max-w-2xl p-4 sm:p-6 lg:p-8">
```

## Touch Targets
- Minimum touch target: 44x44px (iOS) / 48x48px (Android)
- Mobile buttons: `min-h-[44px] min-w-[44px]`
- Desktop can be smaller: `min-h-[36px]`

## Performance Optimizations

### Images
- Use Next.js Image component with responsive sizes
- Implement lazy loading for below-the-fold content
- Use appropriate image formats (WebP with fallbacks)

### Fonts
- Load only necessary font weights
- Use `font-display: swap` for better performance

### CSS
- Minimize custom CSS, leverage Tailwind utilities
- Use CSS containment where appropriate

## Accessibility

### Focus States
- Visible focus indicators on all interactive elements
- Keyboard navigation support

### Screen Readers
- Proper ARIA labels
- Semantic HTML structure

### Color Contrast
- Minimum 4.5:1 for normal text
- Minimum 3:1 for large text

## Testing Checklist

### Devices to Test
- [ ] iPhone SE (375px)
- [ ] iPhone 12/13/14 (390px)
- [ ] iPhone 14 Pro Max (430px)
- [ ] iPad Mini (768px)
- [ ] iPad Pro (1024px)
- [ ] Desktop (1280px+)

### Features to Test
- [ ] Navigation (mobile menu, desktop nav)
- [ ] Forms (input sizes, button spacing)
- [ ] Modals (sizing, positioning)
- [ ] Images (loading, sizing)
- [ ] Typography (readability at all sizes)
- [ ] Touch targets (minimum 44px)
- [ ] Landscape orientation
- [ ] Dark mode

## Common Patterns

### Hide/Show Elements
```tsx
// Hide on mobile, show on desktop
<div className="hidden lg:block">Desktop only</div>

// Show on mobile, hide on desktop
<div className="lg:hidden">Mobile only</div>
```

### Responsive Flexbox
```tsx
// Stack on mobile, row on desktop
<div className="flex flex-col lg:flex-row gap-4">
```

### Responsive Text Alignment
```tsx
<h1 className="text-center lg:text-left">
```

### Responsive Widths
```tsx
<div className="w-full lg:w-1/2 xl:w-1/3">
```

## Implementation Status

### ✅ Completed
- Top Navigation (mobile bottom nav + desktop horizontal)
- Sidebar (mobile drawer + desktop fixed)
- Discover Interface (responsive grid)
- Article Modal (responsive sizing)

### 🔄 In Progress
- Dashboard components
- Form interfaces
- Settings modals

### 📋 To Do
- FAQ page
- Policy pages
- Footer responsiveness
- Landing page

## Best Practices

1. **Mobile First**: Start with mobile styles, add larger breakpoints
2. **Touch Friendly**: Ensure all interactive elements are easily tappable
3. **Performance**: Optimize images and lazy load content
4. **Testing**: Test on real devices, not just browser dev tools
5. **Accessibility**: Ensure keyboard navigation and screen reader support
6. **Consistency**: Use the same spacing and sizing patterns throughout

## Resources

- [Tailwind CSS Responsive Design](https://tailwindcss.com/docs/responsive-design)
- [MDN Responsive Design](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)
- [Web.dev Responsive Images](https://web.dev/responsive-images/)
