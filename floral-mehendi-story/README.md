# 🌸 Floral Mehendi Story — Wedding Website Template
**Brand:** Vanvi Moments  
**Theme:** Festive / Floral / Garden Day Wedding  

---

## 📁 Folder Structure
```text
floral-mehendi-story/
├── index.html          # Main HTML structure with dynamic config & sections
├── style.css           # Complete CSS stylesheets, themes, and keyframe animations
├── script.js           # Core animation engine (3D Parallax, Curtains, Petals, Cursor, Audio)
├── README.md           # Documentation & Customization Guide
└── assets/             # 100% Offline Local Assets
    ├── backgrounds/    # Textured paper & watercolor backgrounds
    ├── elements/       # Petals, peacock feathers, diyas, ganesha, interactive curtains
    ├── frames/         # Couple floral photo frame
    ├── icons/          # Mehendi, Haldi, Sangeet, Cocktail, Sagan, Shaadi, Reception icons
    ├── layers/         # 3D Parallax palace, mandap & couple layers
    └── song/           # Background wedding music (Template_04.mp3)
```

---

## 🚀 How to Run & Preview
1. Simply double-click `index.html` to open it in any web browser (Chrome, Edge, Safari, Firefox).
2. Or run a local HTTP server:
   ```bash
   npx serve floral-mehendi-story
   ```

---

## ⚙️ How to Customize (Dynamic Config)
Inside [index.html](file:///c:/Users/RISHU%20KUMARI/Downloads/Wedding%20Templates/floral-mehendi-story/index.html), search for `<script type="application/json" id="wedding-config">`.
You can update:
- **`couple`**: Bride & Groom names, Wedding date (`YYYY-MM-DD`), Venue, WhatsApp number, Hashtag.
- **`events`**: Add, remove or edit events (Mehendi, Haldi, Cocktail, Sagan, Shaadi, Reception) with custom time, venue & Google Maps links.
- **`story`**: Personality tags or custom story verse.
- **`gallery`**: 4 Photo URLs for the photo frames.
- **`rsvp`**: WhatsApp number or custom form link.
- **`music`**: Path to your MP3 audio file.

---

## 🎨 Included Animations & Features
- **Marigold Mandala Preloader:** Smooth golden trace animation revealing couple names.
- **3D Parallax Hero:** Mandap palace, sky, particles, and couple layers zooming with depth on scroll.
- **Peacock Bridge:** Interactive peacock feather fan expanding dynamically.
- **Curtains Reveal (Our Story):** Pulling cord & sliding sage green curtains revealing the couple.
- **Petal Shower (Canvas/DOM):** Marigold & rose petals gently floating across sections.
- **Live Wedding Countdown:** Days, Hours, Minutes, and Seconds countdown timer.
- **Instant RSVP Button:** Direct 1-tap redirect to WhatsApp with pre-filled message.
- **Add to Calendar:** 1-tap Google Calendar & Apple/iCal buttons.
