# DreamSnap

AI-powered photography web app for events that transforms photos into themed artistic images.

## Features

- 📸 **Fullscreen Camera Capture** - Instagram-style interface with burst mode (5 photos)
- 🎨 **10 Themed Styles** - Wedding, vintage, fairytale, anime, and more
- 🤖 **AI Image Generation** - Powered by Google Gemini 2.5 Flash Image
- 📱 **Adaptive Orientation** - Supports both portrait and landscape
- 💬 **Telegram Integration** - Automatic photo sharing to group
- 📥 **Instant Download** - Photos automatically downloaded
- 📊 **Lead Capture** - Collect names, Instagram handles, and phone numbers

## Tech Stack

- **Frontend**: Vite + React 19 + TypeScript + Tailwind CSS
- **AI**: Google Gemini 2.5 Flash Image API
- **Database**: Supabase (PostgreSQL)
- **Photo Sharing**: Telegram Bot API
- **State**: Zustand
- **Camera**: react-webcam

## Quick Start

### Prerequisites

- Node.js 18+
- Supabase account
- Google Gemini API key
- Telegram bot token

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Update .env.local with your credentials
```

### Environment Variables

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

### Database Setup

Create the `leads` table in Supabase:

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

-- Enable Row Level Security
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts
CREATE POLICY "Allow anonymous inserts" ON leads
    FOR INSERT
    WITH CHECK (true);
```

### Telegram Bot Setup

1. Create a bot via [@BotFather](https://t.me/botfather)
2. Get your bot token
3. Create a group and add your bot
4. Get the Chat ID:

```bash
# Send a message in the group, then:
curl https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Build

```bash
npm run build
npm run preview
```

## User Flow

1. **Camera** - Capture 5 burst photos in fullscreen mode
2. **Select** - Choose your best photo
3. **Theme** - Pick from 10 artistic styles
4. **Generate** - AI transforms your photo (~30-60s)
5. **Preview** - Review with optional frame overlay
6. **Details** - Enter name, Instagram, phone
7. **Done** - Auto-download + Telegram upload

## Available Themes

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

## Key Features

### Adaptive Orientation
- Portrait: 1080x1920 (9:16)
- Landscape: 1920x1080 (16:9)
- Real-time orientation detection

### Facial Feature Preservation
All themes use structured prompts with explicit instructions to:
- Maintain facial features and structure
- Preserve skin tone, eye color, hair
- Keep body positions unchanged
- Only modify background and atmosphere

### React Strict Mode Compatible
- Uses `useRef` to prevent double executions
- No duplicate Gemini API calls
- No duplicate Telegram uploads

## Documentation

See [PRD.md](./PRD.md) for detailed product requirements and implementation details.

## License

Proprietary - PixelPro Studios © 2026
