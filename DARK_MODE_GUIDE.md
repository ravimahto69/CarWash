# Dark Mode Quick Start Guide

## How to Use Dark Mode

### For Users:
1. **Toggle Dark Mode**: Click the sun ☀️ or moon 🌙 icon in the top-right corner of the header
2. **Auto-Save**: Your preference is automatically saved and will persist when you revisit
3. **System Preference**: On first visit, your system's color scheme preference is detected

### Visual Changes:
- **Light Mode**: White backgrounds, dark text, blue accents
- **Dark Mode**: Gray-900 backgrounds, light text, blue-400 accents
- All pages are fully styled for both modes

## Files Modified

### Core Infrastructure:
- ✅ `src/app/context/ThemeContext.js` - Created theme context
- ✅ `src/app/layout.js` - Added ThemeProvider wrapper

### Components Updated with Dark Mode:
- ✅ `src/app/component/Header.jsx` - Added toggle button + dark styles
- ✅ `src/app/component/Home.jsx` - Dark styles for hero, services, stores
- ✅ `src/app/component/Footer.jsx` - Dark styles applied
- ✅ `src/app/component/Login.jsx` - Dark form styling
- ✅ `src/app/component/Register.jsx` - Dark form styling
- ✅ `src/app/component/Contact.jsx` - Dark form + layout styling
- ✅ `src/app/component/Services.jsx` - Dark page + card styling
- ✅ `src/app/component/Book.jsx` - Dark form styling

## Color Classes Applied

### Background Colors:
```css
light: bg-white, bg-gray-100, bg-blue-600
dark:  dark:bg-gray-900, dark:bg-gray-800, dark:bg-blue-900
```

### Text Colors:
```css
light: text-black, text-gray-600, text-gray-500
dark:  dark:text-white, dark:text-gray-300, dark:text-gray-400
```

### Border Colors:
```css
light: border-gray-100, border-gray-300
dark:  dark:border-gray-700, dark:border-gray-600
```

### Interactive Elements:
```css
light: hover:text-blue-500, hover:bg-blue-700
dark:  dark:hover:text-blue-400, dark:hover:bg-blue-800
```

## Testing Checklist

- [ ] Header toggle button appears and works
- [ ] All pages have dark backgrounds when toggled
- [ ] Text is readable in both modes
- [ ] Colors have proper contrast
- [ ] Buttons and links are visible in dark mode
- [ ] Mobile menu works in dark mode
- [ ] Theme persists after page refresh
- [ ] Forms are usable in dark mode
- [ ] Icons are visible in dark mode

## Technical Details

**Storage**: localStorage key `theme` (values: 'dark' or 'light')
**Class Strategy**: Tailwind CSS `dark:` prefix on `document.documentElement`
**Context**: React Context API for global state management
**Hydration**: Safe SSR with `mounted` check to prevent hydration mismatch

## Customization

To change dark mode colors, edit the Tailwind classes in component files:
- Search for `dark:` to find all dark mode styles
- Use Tailwind's color palette (gray-50 to gray-950)
- Maintain WCAG AA contrast ratios (4.5:1 minimum for text)

## Browser DevTools

Check dark mode in DevTools:
1. Open DevTools (F12)
2. Press Ctrl+Shift+P (or Cmd+Shift+P on Mac)
3. Type "Rendering" and press Enter
4. Look for "Emulate CSS media feature prefers-color-scheme"
5. Toggle between "dark" and "light"
