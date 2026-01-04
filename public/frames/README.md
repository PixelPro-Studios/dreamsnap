# Frame Overlays

Place your custom frame PNG files in this directory.

## Requirements

- **Format**: PNG with transparency
- **Size**: Minimum 1080x1080px (recommended: 2048x2048px for high quality)
- **Transparency**: The center area where the photo shows through must be transparent
- **Aspect Ratio**: Square (1:1) recommended

## Default Frame

The app looks for `/frames/default-frame.png` by default.

You can override this in your `.env` file:

```env
VITE_FRAME_IMAGE_URL=/frames/my-custom-frame.png
```

## Creating a Frame

### Using Photoshop/GIMP

1. Create a new image (2048x2048px)
2. Add your border/decorative elements around the edges
3. Keep the center transparent (use eraser or layer mask)
4. Export as PNG with transparency

### Using Canva

1. Create a design (2048x2048px)
2. Add elements around the border
3. Download as PNG with transparent background
4. Use a tool to erase the center if needed

## Example Frame Structure

```
┌────────────────────────┐
│  ╔══════════════════╗  │
│  ║                  ║  │
│  ║   TRANSPARENT    ║  │ <- Photo shows through
│  ║      AREA        ║  │
│  ║                  ║  │
│  ╚══════════════════╝  │
│    "DreamSnap 2026"    │ <- Optional text/logo
└────────────────────────┘
```

## Tips

- Keep decorative elements elegant and not too busy
- Use high contrast colors for visibility
- Test with different photo styles
- Leave enough transparent space for faces to be visible
- Consider adding event name, date, or hashtags at the bottom

## Multi-Event Support

For different events, create multiple frames:

```
frames/
  ├── wedding-gold-frame.png
  ├── birthday-party-frame.png
  └── corporate-event-frame.png
```

Then set the appropriate frame in your `.env` per deployment.
