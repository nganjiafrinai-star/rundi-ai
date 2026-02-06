# Responsive Design Quick Reference

## 🎯 Quick Patterns

### Container
```tsx
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
```

### Grid
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
```

### Flex Stack
```tsx
<div className="flex flex-col lg:flex-row gap-4">
```

### Responsive Text
```tsx
<h1 className="text-2xl sm:text-3xl lg:text-4xl">
<p className="text-sm sm:text-base lg:text-lg">
```

### Responsive Padding
```tsx
<div className="p-4 sm:p-6 lg:p-8">
```

### Responsive Spacing
```tsx
<section className="py-8 sm:py-12 lg:py-16">
```

### Hide/Show
```tsx
<div className="hidden lg:block">Desktop only</div>
<div className="lg:hidden">Mobile only</div>
```

## 🔧 Hooks

```tsx
import { useIsMobile, useIsDesktop, useBreakpoint } from '@/app/utils/responsive'

const isMobile = useIsMobile()        // true if < lg
const isDesktop = useIsDesktop()      // true if >= lg
const breakpoint = useBreakpoint()    // 'mobile' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
```

## 📏 Breakpoints

```
mobile: < 640px
sm:     640px
md:     768px
lg:     1024px
xl:     1280px
2xl:    1536px
```

## 🎨 Pre-configured Utilities

```tsx
import { spacing, fontSize } from '@/app/utils/responsive'

<section className={spacing.section}>     // py-8 sm:py-12 lg:py-16
<div className={spacing.container}>       // px-4 sm:px-6 lg:px-8
<div className={spacing.card}>            // p-4 sm:p-6 lg:p-8

<h1 className={fontSize['2xl']}>          // text-2xl sm:text-3xl lg:text-4xl
<p className={fontSize.base}>             // text-base sm:text-lg
```

## 🎯 Common Patterns

### Responsive Button
```tsx
<button className="px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base min-h-[44px]">
  Click me
</button>
```

### Responsive Image Container
```tsx
<div className="h-48 sm:h-64 lg:h-80 w-full overflow-hidden rounded-lg">
  <img className="w-full h-full object-cover" />
</div>
```

### Responsive Modal
```tsx
<div className="w-full max-w-sm sm:max-w-md lg:max-w-2xl p-4 sm:p-6 lg:p-8">
```

### Responsive Card
```tsx
<div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
```

## ✅ Checklist

- [ ] Use mobile-first approach (start with mobile, add breakpoints up)
- [ ] Ensure 44px minimum touch targets on mobile
- [ ] Test on real devices, not just browser tools
- [ ] Check both portrait and landscape orientations
- [ ] Verify dark mode works at all sizes
- [ ] Test keyboard navigation
- [ ] Check focus states are visible
- [ ] Ensure text remains readable (min 16px on mobile)
- [ ] Test with slow network (3G)
- [ ] Verify images load properly

## 🚫 Common Mistakes to Avoid

❌ Fixed pixel widths without responsive alternatives
❌ Text smaller than 14px on mobile
❌ Touch targets smaller than 44px
❌ Horizontal scrolling (except intentional carousels)
❌ Desktop-first approach
❌ Forgetting to test on real devices
❌ Not considering landscape orientation
❌ Ignoring safe area insets on notched devices
