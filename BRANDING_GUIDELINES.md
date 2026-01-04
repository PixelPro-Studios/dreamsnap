# DreamSnap Branding Guidelines

Complete guide for customizing DreamSnap's visual identity for your events.

---

## Table of Contents

1. [Color Palette](#color-palette)
2. [Typography](#typography)
3. [Logo & Watermark Overlays](#logo--watermark-overlays)
4. [Camera Interface](#camera-interface)
5. [Theme Customization](#theme-customization)
6. [Copy & Messaging](#copy--messaging)
7. [Event-Specific Customization](#event-specific-customization)

---

## 1. Color Palette

### Default DreamSnap Colors

**Primary Colors:**
```css
/* Vibrant Purple-Pink Gradient */
--primary-50:  #fdf4ff;
--primary-100: #fae8ff;
--primary-200: #f5d0fe;
--primary-300: #f0abfc;
--primary-400: #e879f9;
--primary-500: #d946ef;  /* Main brand color */
--primary-600: #c026d3;
--primary-700: #a21caf;
--primary-800: #86198f;
--primary-900: #701a75;

/* Accent Pink */
--pink-500: #ec4899;
--pink-600: #db2777;
```

### Customization Guide

#### Method 1: CSS Variables (Recommended)

Edit `src/index.css`:

```css
@layer base {
  :root {
    /* Change primary color (affects buttons, gradients, progress bars) */
    --primary-50:  #your-color-50;
    --primary-100: #your-color-100;
    --primary-200: #your-color-200;
    --primary-300: #your-color-300;
    --primary-400: #your-color-400;
    --primary-500: #your-color-500;  /* Main brand */
    --primary-600: #your-color-600;
    --primary-700: #your-color-700;
    --primary-800: #your-color-800;
    --primary-900: #your-color-900;
  }
}
```

#### Method 2: Tailwind Config

Edit `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#your-color-50',
          100: '#your-color-100',
          // ... add all shades
          900: '#your-color-900',
        },
        accent: {
          // Add secondary brand colors
          500: '#your-accent-color',
        }
      }
    }
  }
}
```

### Color Usage Map

| Element | Color Used | Where to Change |
|---------|-----------|-----------------|
| Main buttons | `primary-600` | CSS variables or Tailwind |
| Button hover | `primary-700` | CSS variables |
| Progress bars | `primary-600 to pink-600` gradient | CSS variables |
| Text highlights | `primary-600 to pink-600` gradient | CSS variables |
| Camera capture indicator | `red-500` | Hardcoded (PhotoCapture.tsx line 137) |

### Recommended Color Schemes

#### Wedding Elegance
```css
--primary-500: #9333ea;  /* Purple */
--accent: #ec4899;       /* Pink */
```

#### Corporate Modern
```css
--primary-500: #3b82f6;  /* Blue */
--accent: #0ea5e9;       /* Cyan */
```

#### Luxury Gold
```css
--primary-500: #d97706;  /* Amber */
--accent: #fbbf24;       /* Yellow */
```

#### Nature Fresh
```css
--primary-500: #10b981;  /* Emerald */
--accent: #059669;       /* Green */
```

---

## 2. Typography

### Default Fonts

**System Font Stack:**
```css
font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI',
             Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
```

### Custom Font Integration

#### Step 1: Add Google Fonts

Edit `index.html`:

```html
<head>
  <!-- Add Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
</head>
```

#### Step 2: Update CSS

Edit `src/index.css`:

```css
@layer base {
  body {
    font-family: 'Inter', system-ui, sans-serif;
  }

  h1, h2, h3 {
    font-family: 'Playfair Display', serif;
  }
}
```

### Font Recommendations

**Elegant Events:**
- Headings: `Playfair Display`, `Cormorant Garamond`
- Body: `Inter`, `Lato`

**Modern Corporate:**
- Headings: `Montserrat`, `Poppins`
- Body: `Open Sans`, `Source Sans Pro`

**Playful Fun:**
- Headings: `Lobster`, `Pacifico`
- Body: `Quicksand`, `Raleway`

---

## 3. Logo & Watermark Overlays

### Custom Watermark Overlay

Watermarks are PNG images overlaid at the bottom center of generated photos.

#### Watermark Specifications

**Technical Requirements:**
- Format: PNG with transparency
- Maximum width: 150px (height scales proportionally)
- Position: Bottom center with 20px margin from bottom
- File size: < 100KB for performance
- Transparent background recommended

#### Creating Your Watermark

1. **Design Tools:** Canva, Figma, Photoshop
2. **Elements to Include:**
   - Event name or logo
   - Simple, clean design (small size)
   - Date/hashtag
   - Sponsor logo (if applicable)
3. **Best Practices:**
   - Keep it minimal (will be displayed at max 150px width)
   - Use white or light colors for visibility
   - Include transparency for professional look
   - Test on both light and dark backgrounds

#### Watermark Examples

**Wedding Watermark:**
```
┌─────────────────────┐
│  ♥ Sarah & James ♥  │
│   June 15, 2026     │
└─────────────────────┘
(Positioned at bottom center of photo)
```

**Corporate Event Watermark:**
```
┌──────────────────────┐
│  [Company Logo]      │
│  #TechSummit2026     │
└──────────────────────┘
(Positioned at bottom center of photo)
```

#### Installing Custom Watermark

```bash
# Place your watermark file
cp your-custom-watermark.png public/frames/default-frame.png

# Or use environment variable for different watermarks per event
# .env.local
VITE_WATERMARK_IMAGE_URL=/frames/wedding-2026.png
```

### Multiple Watermark Support

For events needing multiple watermarks:

**Option 1: Environment Variable per Event**
```env
# Event A
VITE_WATERMARK_IMAGE_URL=/frames/event-a-frame.png

# Event B
VITE_WATERMARK_IMAGE_URL=/frames/event-b-frame.png
```

**Option 2: Dynamic Watermark Selection (Code Modification)**

Edit `src/components/AIGeneration.tsx`:

```typescript
// Add watermark selection logic based on event
const getWatermarkUrl = () => {
  const eventId = import.meta.env.VITE_EVENT_ID;
  return `/frames/${eventId}-watermark.png`;
};

const watermarkUrl = getWatermarkUrl();
```

---

## 4. Camera Interface

### Camera Screen Customization

The fullscreen camera is located in `src/components/PhotoCapture.tsx`.

#### Removing/Adding Branding

**Current State:** No branding (clean fullscreen)

**To Add Event Branding:**

Edit `PhotoCapture.tsx` around line 150:

```tsx
{/* Add event branding - top of camera */}
<div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20">
  <h1 className="text-2xl font-bold text-white drop-shadow-lg">
    Your Event Name
  </h1>
  <p className="text-sm text-white text-center drop-shadow">
    June 15, 2026
  </p>
</div>
```

#### Camera Button Colors

**Flip Camera Button:**
Line 172: Change `bg-white bg-opacity-30` to your brand color:

```tsx
className="... bg-purple-600 bg-opacity-80 ..."
```

**Capture Button:**
Line 187: Change `bg-white` to your color:

```tsx
className="... bg-gradient-to-r from-purple-600 to-pink-600 ..."
```

#### Progress Indicator Style

Line 155-159: Customize dots:

```tsx
{/* Filled dots */}
className="... bg-gradient-to-r from-purple-600 to-pink-600"

{/* Empty dots */}
className="... bg-white bg-opacity-30"
```

---

## 5. Theme Customization

### Adding Custom Themes

Edit `src/lib/themes.ts`:

```typescript
{
  id: 'beach-wedding',
  name: 'Beach Wedding Bliss',
  description: 'Tropical paradise with ocean views',
  previewImage: '/themes/beach-wedding.jpg',
  promptTemplate: `Transform this photo into beach wedding style...

  CRITICAL - DO NOT CHANGE:
  - Keep facial features IDENTICAL
  - Maintain skin tone, hair, eyes
  - Preserve body positions

  STYLE TO APPLY:
  - Beach setting with turquoise water
  - White sand, palm trees
  - Sunset golden hour lighting
  - Tropical flowers
  - Resolution: minimum 1080px width`
}
```

### Theme Preview Images

1. Create preview images: 400x300px
2. Save to `public/themes/your-theme.jpg`
3. Reference in theme definition

### Reordering Themes

Themes display in array order. Rearrange in `themes.ts`:

```typescript
export const themes: Theme[] = [
  // Put most popular first
  themes.find(t => t.id === 'classic-wedding'),
  themes.find(t => t.id === 'vintage-romance'),
  // ... rest
];
```

---

## 6. Copy & Messaging

### Editable Text Content

| Location | File | Line | Current Text |
|----------|------|------|--------------|
| Form heading | `LeadCaptureForm.tsx` | 116 | "Almost There!" |
| Form subtitle | `LeadCaptureForm.tsx` | 120 | "Share your details to receive your photo" |
| Consent text | `LeadCaptureForm.tsx` | 214 | "I allow DreamSnap..." |
| Success message | `SuccessPage.tsx` | 136 | "Your photo has been saved successfully" |
| Telegram caption | `telegram.ts` | 102 | "📸 DreamSnap Photo" |

### Customization Examples

#### Wedding Event
```tsx
// LeadCaptureForm.tsx line 116-120
<h2>Just One More Step!</h2>
<p>We'll text you your beautiful wedding photo</p>

// Consent
"I agree to share my photo in the wedding gallery"
```

#### Corporate Event
```tsx
<h2>Claim Your Photo</h2>
<p>Enter your details to download your professional headshot</p>

// Consent
"I consent to company use of this photo for marketing"
```

### Multi-language Support

For international events, replace text with translation function:

```typescript
// Create src/lib/i18n.ts
const translations = {
  en: {
    formHeading: "Almost There!",
    formSubtitle: "Share your details..."
  },
  es: {
    formHeading: "¡Casi listo!",
    formSubtitle: "Comparte tus datos..."
  }
};

export const t = (key: string, lang = 'en') => translations[lang][key];
```

---

## 7. Event-Specific Customization

### Quick Customization Checklist

Use this checklist for each new event:

#### Before Event (Design Phase)
- [ ] Choose color palette (primary + accent)
- [ ] Select fonts (heading + body)
- [ ] Design custom watermark overlay
- [ ] Create/select 5-7 relevant themes
- [ ] Write custom consent text
- [ ] Prepare theme preview images

#### Setup (Technical)
- [ ] Update `.env.local` with event ID
- [ ] Upload custom watermark to `public/frames/`
- [ ] Update CSS variables with brand colors
- [ ] Update copy in forms and success page
- [ ] Test on mobile device
- [ ] Verify Telegram group connection
- [ ] Test full user flow

#### Post-Event
- [ ] Archive event photos from Telegram
- [ ] Export leads from Supabase
- [ ] Reset to default branding (if needed)

### Example: Complete Wedding Customization

#### 1. Colors (Wedding Rose Gold)
```css
/* src/index.css */
:root {
  --primary-500: #c9a576;  /* Rose gold */
  --accent: #d4af7a;
}
```

#### 2. Custom Watermark
```bash
# Add wedding watermark
cp wedding-sarah-james-watermark.png public/frames/default-frame.png
```

#### 3. Update Copy
```tsx
// LeadCaptureForm.tsx
<h2>Sarah & James Wedding</h2>
<p>Get your magical photo!</p>
```

#### 4. Select Themes
```typescript
// themes.ts - Keep only wedding-appropriate
themes = [
  classicWedding,
  vintageRomance,
  fairytaleFantasy,
  beachSunset,
  gardenParty
]
```

#### 5. Telegram Caption
```typescript
// telegram.ts
caption = `💍 Sarah & James Wedding
👤 ${fullName}
🎨 Theme: ${theme}
📅 June 15, 2026

#SarahAndJamesForever`
```

---

## Advanced Customization

### Multi-Event Support

For running multiple events simultaneously:

```typescript
// src/lib/eventConfig.ts
export const eventConfigs = {
  'wedding-2026-06': {
    primaryColor: '#c9a576',
    watermarkPath: '/frames/wedding-watermark.png',
    themes: ['classic-wedding', 'vintage-romance'],
    eventName: 'Sarah & James Wedding'
  },
  'corporate-gala': {
    primaryColor: '#3b82f6',
    watermarkPath: '/frames/corporate-watermark.png',
    themes: ['cinematic-movie', 'black-white-elegance'],
    eventName: 'Tech Summit 2026'
  }
};

// Use in components
const eventId = import.meta.env.VITE_EVENT_ID;
const config = eventConfigs[eventId];
```

### Dynamic Theme Loading

Load themes from Supabase for easy management:

```sql
-- Supabase table
CREATE TABLE event_themes (
  id UUID PRIMARY KEY,
  event_id TEXT,
  name TEXT,
  description TEXT,
  prompt_template TEXT,
  preview_image_url TEXT
);
```

---

## Resources

### Design Assets

**Color Palette Generators:**
- [Coolors.co](https://coolors.co) - Generate color schemes
- [Adobe Color](https://color.adobe.com) - Color wheel tool

**Watermark Design:**
- [Canva](https://canva.com) - Watermark templates
- [Figma](https://figma.com) - Professional design

**Font Pairing:**
- [FontPair](https://fontpair.co) - Google Font combinations
- [Typewolf](https://typewolf.com) - Font inspiration

### Testing Tools

- Chrome DevTools - Test responsive design
- [BrowserStack](https://browserstack.com) - Cross-device testing
- [PageSpeed Insights](https://pagespeed.web.dev) - Performance

---

## Support

For customization assistance:
- Review `PRD.md` for technical details
- Check component files for specific elements
- Test changes in development mode first

**Built with ❤️ by PixelPro Studios**
