# Product Requirements Document (PRD)

## DreamSnap - AI-Powered Photography Web App

### 1. Product Overview

**Product Name:** DreamSnap

**Version:** 1.0 (Implemented)

**Date:** January 2026

**Product Type:** Progressive Web Application (PWA)

**Target Audience:** Individuals and couples at events (weddings, engagements, parties, etc.)

**Core Value Proposition:** An AI-powered photography experience that transforms photos into themed, artistic images with instant Telegram sharing and automatic downloads.

---

### 2. Product Goals & Objectives

**Primary Goals:**
- Provide an engaging, interactive photo experience at events
- Generate high-quality, themed AI photos that maintain facial and body characteristics
- Facilitate instant Telegram group sharing with proper attribution
- Capture valuable marketing leads (name, Instagram handles, phone number)
- Support both single person and couple photos

**Success Metrics:**
- Number of photo sessions completed
- Telegram shares and engagement rate
- Lead capture rate (% of users who complete the full flow)
- User satisfaction (repeat usage at events)

---

### 3. User Flow

```
1. Fullscreen Camera Capture (5 Burst Photos)
   ↓
2. Review & Select 1 Photo
   ↓
3. Browse & Select Theme
   ↓
4. AI Image Generation (with loading state)
   ↓
5. Review Generated Image with Watermark Overlay
   ↓
6. Approve/Retry Decision
   ↓
7. Lead Capture Form (Name, Instagram, Phone, Consent)
   ↓
8. Telegram Upload & Photo Download
   ↓
9. Success/Thank You Page
```

---

### 4. Implemented Features

#### 4.1 Photo Capture Module ✅

**Implementation:**
- Fullscreen camera interface (no branding, fills entire screen)
- Captures 5 photos in quick succession (burst mode, 0.25s between shots)
- Adaptive resolution based on device orientation:
  - Portrait: 1080x1920 (9:16 aspect ratio)
  - Landscape: 1920x1080 (16:9 aspect ratio)
- Front and rear camera toggle (mobile)
- Real-time orientation detection

**UI/UX:**
- Fullscreen camera feed with overlay controls
- Progress indicator at top (5 dots showing capture progress)
- Instagram-style controls at bottom:
  - Flip camera button (left)
  - Large circular capture button (center)
  - Symmetrical layout
- Countdown display (3-2-1)
- Minimal camera guideline overlay

**Technical Implementation:**
- `react-webcam` library
- Dynamic `videoConstraints` based on orientation
- Handles camera permissions gracefully
- Optimized image quality (max 2MB per photo)

---

#### 4.2 Photo Selection Module ✅

**Implementation:**
- Display all 5 captured photos in gallery view
- User selects exactly 1 photo to proceed
- Visual indication of selected photo
- Option to retake photos if unsatisfied

**UI/UX:**
- Thumbnail grid layout
- Selected photo highlighted with border/checkmark
- "Retake Photos" and "Continue" buttons
- "Continue" enabled only when 1 photo selected

---

#### 4.3 Theme Selection Module ✅

**Implementation:**
- 10 curated wedding/couple-focused themes
- Each theme optimized for 1 or 2 people
- Enhanced prompts with explicit facial feature preservation

**Available Themes:**
1. Classic Wedding Portrait
2. Vintage Romance
3. Fairytale Fantasy
4. Beach Sunset
5. Garden Party
6. Black & White Elegance
7. Watercolor Art
8. Cinematic Movie Poster
9. Anime Illustrated
10. Cultural Traditional

**Prompt Structure:**
All themes use a two-part prompt structure:
- **CRITICAL - DO NOT CHANGE**: Explicit instructions to preserve facial features, skin tone, hair, body positions
- **STYLE TO APPLY**: Background and atmosphere modifications only

---

#### 4.4 AI Image Generation Module ✅

**Implementation:**
- Google Gemini 2.5 Flash Image API
- Streaming response handling
- Dual-execution prevention (React Strict Mode compatible)

**System Prompt Features:**
- Maintains facial features and likenesses
- Preserves body positions and poses
- Applies selected theme style
- Generates high-resolution output (min 1080px width)
- Supports both portrait and landscape orientations

**UI/UX:**
- Loading screen with animated spinner
- Progress bar (0-100%)
- Status messages during generation
- Estimated time display (~30-60 seconds)
- Error handling with retry option

**Technical Implementation:**
- `@google/genai` package
- `useRef` for preventing double API calls
- Base64 image processing
- Streaming chunk processing
- Comprehensive error handling

---

#### 4.5 Watermark Overlay & Preview Module ✅

**Implementation:**
- PNG watermark overlay on generated image (positioned at bottom center, max 150px width)
- Configurable via environment variable
- Preview before submission

**UI/UX:**
- Full-screen preview of final watermarked image
- "Approve" button to proceed
- "Try Another Theme" button (returns to theme selection)
- "Retake Photo" button (restarts entire process)

**Technical Implementation:**
- Client-side Canvas API overlay
- PNG watermark with transparency (max 150px width, bottom center positioning)
- Composite JPEG/PNG output
- Watermark URL from `VITE_WATERMARK_IMAGE_URL` env variable

---

#### 4.6 Lead Capture Form ✅

**Required Fields:**
- Full Name(s) - single or two names
- Instagram Handle 1 - optional
- Instagram Handle 2 - optional
- Phone Number - with country code selector (+1, +44, +91, +65, +60, +61, +64, +86, +81, +82)
- Consent Checkbox - required

**Validation:**
- Name: minimum 2 characters
- Instagram: valid format (auto-adds @ if missing)
- Phone: valid format using `libphonenumber-js`
- Consent: must be checked to proceed

**UI/UX:**
- Clean, simple form layout
- Instagram handle auto-formatting
- Phone number formatting with country selector
- Clear consent checkbox with terms
- "Submit & Download Photo" CTA button

---

#### 4.7 Telegram Integration ✅

**Implementation:**
- Telegram Bot API for photo uploads
- Photos sent to configured group chat
- No compression - preserves original quality
- Caption includes names, theme, and Instagram handles

**Caption Format:**
```
📸 DreamSnap Photo
👤 [Full Name]
🎨 Theme: [Theme Name]
📸 @instagram_handle1 @instagram_handle2

💫 Created with DreamSnap AI Photography
```

**Technical Implementation:**
- Axios FormData upload
- Base64 to Blob conversion
- Preserves original MIME type
- 30-second timeout
- Error handling with fallback
- Dual-execution prevention (React Strict Mode compatible)

**Configuration:**
- `VITE_TELEGRAM_BOT_TOKEN`
- `VITE_TELEGRAM_CHAT_ID`

---

#### 4.8 Photo Download ✅

**Implementation:**
- Automatic download trigger after form submission
- Filename format: `dreamsnap_{name}_{timestamp}.jpg`
- Cross-browser compatible

**Technical Implementation:**
- HTML5 download attribute
- Blob download for compatibility
- iOS Safari support
- Optimized file size (max 3MB)

---

#### 4.9 Data Storage ✅

**Supabase (PostgreSQL):**

Table: `leads`
```sql
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    full_name TEXT NOT NULL,
    instagram_handle_1 TEXT,
    instagram_handle_2 TEXT,
    phone_number TEXT NOT NULL,
    country_code TEXT NOT NULL DEFAULT '+1',
    consent_given BOOLEAN NOT NULL DEFAULT FALSE,
    event_id TEXT,
    theme_selected TEXT NOT NULL
);
```

**Storage Strategy:**
- Lead data in Supabase
- Photos uploaded to Telegram group
- No local file storage required

---

### 5. Technical Stack

**Frontend:**
- Framework: Vite + React 19.2.3
- Language: TypeScript 5.9.3
- Styling: Tailwind CSS 4.1.18
- State Management: Zustand 5.0.9
- Routing: React Router DOM 7.11.0
- Camera: react-webcam 7.2.0

**Backend & Services:**
- AI: Google Gemini 2.5 Flash Image (`@google/genai` 1.34.0)
- Database: Supabase (PostgreSQL)
- Photo Sharing: Telegram Bot API
- Image Processing: Browser Canvas API

**Additional Libraries:**
- `libphonenumber-js` 1.12.33 - Phone validation
- `axios` 1.13.2 - HTTP requests
- `browser-image-compression` 2.0.2 - Image optimization

---

### 6. Key Implementation Details

#### Orientation Support
- Detects device orientation (portrait/landscape)
- Adapts camera resolution dynamically
- Listens to resize and orientationchange events
- Portrait: 1080x1920, Landscape: 1920x1080

#### React Strict Mode Compatibility
- Uses `useRef` instead of `useState` for execution tracking
- Prevents double API calls to Gemini
- Prevents double Telegram uploads
- Implemented in:
  - `AIGeneration.tsx`
  - `SuccessPage.tsx`

#### Theme Prompt Engineering
All 10 themes use structured prompts:
1. **Supports 1 or 2 people** - "person/people" language
2. **Explicit preservation instructions** - "CRITICAL - DO NOT CHANGE" section
3. **Clear style boundaries** - "STYLE TO APPLY (background and atmosphere only)"
4. **Identity maintenance** - Facial features, skin tone, hair must remain identical

#### Error Handling
- Camera permission denial
- Gemini API failures
- Telegram upload failures
- Supabase connection errors
- Form validation errors
- Graceful fallbacks for each error type

---

### 7. Environment Variables

```env
# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key

# Telegram Bot
VITE_TELEGRAM_BOT_TOKEN=your_bot_token
VITE_TELEGRAM_CHAT_ID=your_chat_id

# Google Gemini AI
VITE_GEMINI_API_KEY=your_gemini_api_key

# App Configuration
VITE_EVENT_ID=default_event
VITE_WATERMARK_IMAGE_URL=/frames/default-frame.png
```

---

### 8. Removed Features (from original PRD)

- ❌ Instagram API integration (replaced with Telegram)
- ❌ Convex file storage (replaced with Telegram)
- ❌ Wall of Fame / Gallery Page (simplified for events)
- ❌ Instagram Story publication
- ❌ Public gallery with real-time updates

---

### 9. Future Enhancements (V2+)

- Multi-event support with unique URLs/QR codes
- Admin dashboard for event organizers
- Email delivery of photos
- Print-ready high-res download option
- Video burst capture
- Real-time face detection
- Photo booth kiosk mode (fullscreen, auto-restart)
- Analytics dashboard
- Payment integration for premium features
- SMS notifications

---

### 10. Success Criteria

- [x] Camera capture works on iOS Safari and Android Chrome
- [x] 5 photos captured successfully in burst mode
- [x] Photo selection and theme selection flows are intuitive
- [x] Gemini API generates images maintaining facial features
- [x] Watermark overlay composites correctly
- [x] Lead capture form validates all fields
- [x] Data saved to Supabase successfully
- [x] Photos uploaded to Telegram group
- [x] Photo download works on mobile and desktop
- [x] Adaptive orientation support (portrait/landscape)
- [x] React Strict Mode compatibility (no double executions)
- [x] Responsive design tested on multiple devices
- [x] Error handling for all failure scenarios

---

### 11. Known Issues / Limitations

1. **Gemini API**: May intermittently return text-only responses without image data
2. **Telegram**: Requires bot to be added to group and proper Chat ID
3. **Supabase**: Requires manual table creation (not auto-migrated)
4. **Camera**: iOS requires HTTPS for camera access
5. **Watermark Overlay**: Fails gracefully if watermark image not found

---

## Document Control

**Author:** Product Team, PixelPro Studios

**Last Updated:** January 4, 2026

**Status:** Implemented (V1.0)

**Change Log:**
- 2026-01-03: Initial draft created
- 2026-01-04: Updated with implementation details, removed Instagram/Convex, added Telegram integration
