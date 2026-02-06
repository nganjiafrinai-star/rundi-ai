# Responsive Component Checklist

Use this checklist when creating or updating components to ensure they're fully responsive.

## 📋 Pre-Development

- [ ] Review the design at all breakpoints (mobile, tablet, desktop)
- [ ] Identify which elements should stack/reflow at different sizes
- [ ] Plan touch target sizes for mobile interactions
- [ ] Consider dark mode at all screen sizes

## 🎨 Layout & Structure

- [ ] Use mobile-first approach (start with mobile styles)
- [ ] Apply responsive container padding: `px-4 sm:px-6 lg:px-8`
- [ ] Use responsive section spacing: `py-8 sm:py-12 lg:py-16`
- [ ] Implement flexible layouts (Grid/Flexbox with responsive breakpoints)
- [ ] Ensure no horizontal scrolling (except intentional carousels)
- [ ] Use `max-w-*` classes to prevent excessive width on large screens

## 📝 Typography

- [ ] Use responsive font sizes: `text-base sm:text-lg lg:text-xl`
- [ ] Ensure minimum 14px font size on mobile (preferably 16px)
- [ ] Apply responsive line heights for readability
- [ ] Test text wrapping at all breakpoints
- [ ] Use responsive heading hierarchy

## 🖼️ Images & Media

- [ ] Use responsive image containers: `h-48 sm:h-64 lg:h-80`
- [ ] Apply `object-cover` or `object-contain` as appropriate
- [ ] Use Next.js Image component with responsive sizes
- [ ] Implement lazy loading for below-the-fold images
- [ ] Test image aspect ratios at all sizes

## 🔘 Interactive Elements

- [ ] Minimum 44px touch targets on mobile (`min-h-[44px]`)
- [ ] Responsive button padding: `px-4 py-2 sm:px-6 sm:py-3`
- [ ] Responsive button text: `text-sm sm:text-base`
- [ ] Adequate spacing between clickable elements (min 8px)
- [ ] Visible focus states for keyboard navigation
- [ ] Hover states work on desktop, don't interfere on mobile

## 📱 Mobile Specific

- [ ] Test in portrait orientation
- [ ] Test in landscape orientation
- [ ] Verify touch interactions work smoothly
- [ ] Check that modals/overlays work on small screens
- [ ] Ensure forms are easy to fill on mobile
- [ ] Test with on-screen keyboard visible

## 💻 Desktop Specific

- [ ] Utilize available screen space effectively
- [ ] Multi-column layouts where appropriate
- [ ] Hover effects enhance UX
- [ ] Keyboard shortcuts work (if applicable)
- [ ] Consider mouse interactions

## 🎭 Dark Mode

- [ ] All colors have dark mode variants
- [ ] Contrast ratios meet WCAG standards in both modes
- [ ] Images/icons work in both modes
- [ ] Borders/dividers visible in both modes
- [ ] Test at all breakpoints in dark mode

## ♿ Accessibility

- [ ] Semantic HTML elements used
- [ ] ARIA labels where needed
- [ ] Keyboard navigation works
- [ ] Screen reader tested
- [ ] Color contrast meets WCAG AA (4.5:1 for normal text)
- [ ] Focus indicators visible

## ⚡ Performance

- [ ] Images optimized and properly sized
- [ ] Lazy loading implemented where appropriate
- [ ] No layout shift (CLS) issues
- [ ] Smooth animations (60fps)
- [ ] Fast initial load time

## 🧪 Testing

- [ ] Tested on iPhone SE (375px) - smallest modern mobile
- [ ] Tested on standard mobile (390px)
- [ ] Tested on large mobile (430px)
- [ ] Tested on tablet (768px)
- [ ] Tested on laptop (1024px)
- [ ] Tested on desktop (1280px+)
- [ ] Tested in Chrome DevTools device mode
- [ ] Tested on real mobile device
- [ ] Tested on real tablet (if available)
- [ ] Tested with slow network (3G)

## 📦 Code Quality

- [ ] Used responsive utilities from `app/utils/responsive.tsx`
- [ ] Consistent spacing using `spacing` constants
- [ ] Consistent typography using `fontSize` constants
- [ ] No magic numbers (use Tailwind classes)
- [ ] Code is DRY (Don't Repeat Yourself)
- [ ] Component is reusable

## 📚 Documentation

- [ ] Component usage documented
- [ ] Props documented (if applicable)
- [ ] Responsive behavior noted
- [ ] Examples provided

## ✅ Final Checks

- [ ] Component works at all breakpoints
- [ ] No console errors or warnings
- [ ] Passes accessibility audit
- [ ] Passes Lighthouse audit
- [ ] Dark mode works correctly
- [ ] Animations are smooth
- [ ] Loading states implemented
- [ ] Error states handled
- [ ] Empty states designed

---

## 🎯 Quick Patterns Reference

### Container
```tsx
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
```

### Grid
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
```

### Card
```tsx
<div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 lg:p-8 shadow-sm">
```

### Button
```tsx
<button className="px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base min-h-[44px] bg-blue-600 text-white rounded-lg">
```

### Text
```tsx
<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
<p className="text-sm sm:text-base lg:text-lg">
```

---

**Print this checklist and keep it handy when developing!**
