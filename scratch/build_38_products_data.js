const fs = require('fs');

const MEESHO_ITEMS_DEF = [
  // 1-7: Cute Plushies & Stuffed Toys
  {
    name: 'Cuddle Hugs Baby Panda Plushie',
    tagline: 'Ultra-soft, velvet-feel huggable companion with sweet sleepy eyes',
    desc: 'Crafted from premium hypoallergenic plush fleece with squishy feather-soft filling. Perfect sweet bedside companion or birthday surprise to deliver cozy hugs.',
    cat: 'plushies',
    badge: 'Trending Cute 🐼',
    price: 199,
    origPrice: 499,
    rating: 4.9,
    reviews: 428,
    img: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=700&q=80',
    specs: ['Super Soft Plush Fur', 'Non-Toxic Hypoallergenic Material', 'Machine Washable', '30cm Huggable Size'],
    pairsWith: 'Pairs with Birthday 3D Box & Cute Panda Assistant'
  },
  {
    name: 'Fluffy Teddy Bear with Heart Bow',
    tagline: 'Classic gentle brown teddy with satin heart embroidery bow',
    desc: 'Timeless sweet teddy bear crafted with ultra-plush fur and a rich satin bow tie. An adorable token of warmth and affection for your special someone.',
    cat: 'plushies',
    badge: 'Valentine Choice ❤️',
    price: 249,
    origPrice: 599,
    rating: 4.9,
    reviews: 312,
    img: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=700&q=80',
    specs: ['Premium Velvet Poly-fill', 'Reinforced Safety Seams', 'Silky Red Ribbon Bow', 'Sitting Height 28cm'],
    pairsWith: 'Pairs with Love in Clouds & Midnight Wish'
  },
  {
    name: 'Kawaii Pastel Bunny Stuffed Toy',
    tagline: 'Long-eared floppy plush bunny in dreamy pastel blush pink',
    desc: 'Gentle, comforting floppy ear bunny rabbit made with cloud-soft microvelvet. Irresistibly cute for room decor, nursery hampers, or gifting your bestie.',
    cat: 'plushies',
    badge: 'Cute Kawaii 🐰',
    price: 229,
    origPrice: 549,
    rating: 4.8,
    reviews: 265,
    img: 'https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?auto=format&fit=crop&w=700&q=80',
    specs: ['Microvelvet Soft Touch', 'Flexible Floppy Ears', 'Child-Safe Embroidered Eyes', 'Pastel Pink Shade'],
    pairsWith: 'Pairs with Hey Birthday & Sweet Dreams Keepsake'
  },
  {
    name: 'Chubby Chick Plush Stuffed Friend',
    tagline: 'Round squishy cuddle plush with tiny wings and orange beak',
    desc: 'Adorable mood-lifting round squishy companion. Designed to relieve stress and bring an instant smile whenever held.',
    cat: 'plushies',
    badge: 'Mood Booster 🐥',
    price: 189,
    origPrice: 449,
    rating: 4.8,
    reviews: 194,
    img: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=700&q=80',
    specs: ['Squishy Slow-Rebound Cotton', 'Lightweight & Compact', 'Bright Cheerful Yellow', 'Pocket-Friendly Size'],
    pairsWith: 'Pairs with Birthday Cake 3D & Celebration Poppers'
  },
  {
    name: 'Sleepy Fox Velvet Cuddle Toy',
    tagline: 'Warm terracotta orange fox with cute curled tail and soft snout',
    desc: 'Charming woodland fox plushie designed with silky fur and cozy warm tones. Great for autumn celebrations, birthdays, or comforting cuddles.',
    cat: 'plushies',
    badge: 'Forest Magic 🦊',
    price: 269,
    origPrice: 629,
    rating: 4.9,
    reviews: 178,
    img: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=700&q=80',
    specs: ['Terracotta Velvet Coat', 'Hand-Stitched Nose & Whiskers', 'Washable Outer Shell', 'Length 32cm'],
    pairsWith: 'Pairs with Golden Sunset & Rustic Celebration'
  },
  {
    name: 'Mini Boba Milk Tea Plush Charm',
    tagline: 'Pocket kawaii boba cup with smiling face and straw',
    desc: 'Trending viral kawaii boba tea plushie with soft plush tapioca pearls and plush drinking straw. Ideal desk aesthetic or bag companion.',
    cat: 'plushies',
    badge: 'Viral Aesthetic 🧋',
    price: 169,
    origPrice: 399,
    rating: 4.9,
    reviews: 520,
    img: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=700&q=80',
    specs: ['Kawaii Embroidered Face', 'Compact 18cm Desk Size', 'Silky Soft Polyester Fur', 'Lightweight 120g'],
    pairsWith: 'Pairs with Pastel Pop & Modern Birthday Invite'
  },
  {
    name: 'Sweet Lavender Snuggle Bear',
    tagline: 'Pastel purple plush bear infused with cozy calming vibes',
    desc: 'Unique lavender-toned teddy bear with velvet touch paws and cute satin neck ribbon. A delicate aesthetic gift for anniversaries or surprises.',
    cat: 'plushies',
    badge: 'Aesthetic Hue 💜',
    price: 239,
    origPrice: 579,
    rating: 4.8,
    reviews: 145,
    img: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=700&q=80',
    specs: ['Pastel Lavender Hue', 'Extra Soft Down Cotton', 'Clean Odorless Fabric', 'Height 26cm'],
    pairsWith: 'Pairs with Lavender Hues & Moonlight Serenade'
  },

  // 8-9: Scrapbooks & Albums
  {
    name: 'Handcrafted Vintage Memories Scrapbook',
    tagline: 'Thick black kraft paper album with rustic tie ribbon and photo corners',
    desc: '30 sheets (60 pages) of heavyweight craft sheets. Fill it with romantic Polaroid snaps, concert tickets, handwritten notes, and celebration stickers.',
    cat: 'scrapbooks',
    badge: 'Memories Vault 📖',
    price: 349,
    origPrice: 799,
    rating: 5.0,
    reviews: 382,
    img: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=700&q=80',
    specs: ['300 GSM Heavy Black Kraft', '360-Degree Spiral Bound', 'Includes Metallic Pen & Corner Stickers', 'A4 Landscape Size'],
    pairsWith: 'Pairs with Polaroids & Memory Lane Timeline'
  },
  {
    name: 'Surprise Hexagon Explosion Memory Box',
    tagline: 'Multi-layered DIY pop-up box that unfolds into 4 layers of photos',
    desc: 'Creative explosion photo box designed to reveal hidden cards, pocket letters, and a center surprise gift compartment when the lid is lifted.',
    cat: 'scrapbooks',
    badge: 'DIY Surprise 🎁',
    price: 399,
    origPrice: 899,
    rating: 4.9,
    reviews: 410,
    img: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=700&q=80',
    specs: ['4 Nested Folding Layers', 'Pre-Cut Greeting Stencils Included', 'Center Compartment for Ring/Watch', 'High-Rigidity Matte Cardstock'],
    pairsWith: 'Pairs with Velvet Ring Box & Birthday 3D Box'
  },

  // 10-15: Sparkle Earrings & Studs
  {
    name: 'Rose Gold Dancing Crystal Studs',
    tagline: 'Hypoallergenic zircon crystal studs with 18k rose gold plating',
    desc: 'Gleaming multifaceted cubic zirconia in a prong setting that catches light effortlessly. Safe for sensitive ears, perfect for weddings and date nights.',
    cat: 'jewelry',
    badge: '18K Rose Gold ✨',
    price: 199,
    origPrice: 499,
    rating: 4.9,
    reviews: 620,
    img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=700&q=80',
    specs: ['AAA+ Cubic Zirconia', '18K Rose Gold PVD Plating', 'Hypoallergenic Silver Posts', 'Comes in Velvet Pouch'],
    pairsWith: 'Pairs with Temple Blossom Luxe & Royal Vivah'
  },
  {
    name: 'Floral Blossom Dainty Ear Studs',
    tagline: 'Delicate five-petal flower studs with shimmering central crystal',
    desc: 'Inspired by spring cherry blossoms, these dainty ear studs offer subtle elegance and everyday grace for traditional or western outfits.',
    cat: 'jewelry',
    badge: 'Floral Grace 🌸',
    price: 179,
    origPrice: 429,
    rating: 4.8,
    reviews: 290,
    img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=700&q=80',
    specs: ['Anti-Tarnish Polish', 'Lightweight 3.5g Per Pair', 'Secure Butterfly Backs', 'Petal Calligraphy Finish'],
    pairsWith: 'Pairs with Floral Royale & Wedding Mandap'
  },
  {
    name: 'Twinkling Star & Moon Drop Earrings',
    tagline: 'Asymmetric celestial drop earrings with micro-pave crystals',
    desc: 'One ear featuring a glowing crescent moon and the other a radiant north star. A romantic aesthetic jewelry piece designed for dreamers.',
    cat: 'jewelry',
    badge: 'Celestial Glow 🌙',
    price: 219,
    origPrice: 549,
    rating: 4.9,
    reviews: 340,
    img: 'https://images.unsplash.com/photo-1611591475837-975949d2146f?auto=format&fit=crop&w=700&q=80',
    specs: ['Asymmetric Celestial Motif', 'Lead & Nickel Free Alloy', 'High Polish Gold Accent', 'Dangle Drop Length 3.5cm'],
    pairsWith: 'Pairs with Constellation of Love & Starlight Wish'
  },
  {
    name: 'Aesthetic Butterfly Wings Studs',
    tagline: 'Holographic shimmer butterfly ear studs with enamel gradient',
    desc: 'Whimsical butterfly studs displaying iridescent color shifts under light. Light, charming, and a favorite aesthetic accessory for college and parties.',
    cat: 'jewelry',
    badge: 'Kawaii Chic 🦋',
    price: 169,
    origPrice: 399,
    rating: 4.8,
    reviews: 215,
    img: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=700&q=80',
    specs: ['Iridescent Acrylic Wings', 'Sterling Silver Ear Needle', 'Sweat & Water Resistant', 'Ultra-Light 2g Weight'],
    pairsWith: 'Pairs with Love in Clouds & Pastel Euphoria'
  },
  {
    name: 'Vintage Freshwater Pearl Dangle Drops',
    tagline: 'Classic teardrop luster pearls suspended from gold filigree hooks',
    desc: 'Cultured baroque style teardrop pearls with warm organic iridescence. Timeless jewelry that compliments saree, lehenga, or evening gowns.',
    cat: 'jewelry',
    badge: 'Classic Heritage 🦪',
    price: 279,
    origPrice: 699,
    rating: 4.9,
    reviews: 188,
    img: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=700&q=80',
    specs: ['High-Luster Pearl Simulant', 'Antique Gold Finish Hooks', 'Comfort Ear Cushion Backs', 'Gift Box Packing Included'],
    pairsWith: 'Pairs with Ivory Arch Wedding & Silk Elegance'
  },
  {
    name: 'Double Heart Crystal Solitaire Studs',
    tagline: 'Twin intertwined hearts embracing a radiant cubic diamond',
    desc: 'Symbol of eternal togetherness. Interlocking heart contours lined with sparkling micro-stones surrounding a solitaire center stone.',
    cat: 'jewelry',
    badge: 'Twin Hearts 💕',
    price: 199,
    origPrice: 489,
    rating: 4.9,
    reviews: 405,
    img: 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&w=700&q=80',
    specs: ['Interlocking Heart Design', 'Rhodium Platinum Tone', 'Friction Backing Closure', 'Laser Cut Sparkle Facets'],
    pairsWith: 'Pairs with Valentine Love & Anniversary Ring'
  },

  // 16-18: Romantic Bracelets & Bangles
  {
    name: 'Magnetic Heart Couple Touch Bracelets',
    tagline: 'Set of 2 adjustable rope bracelets that attract and click together',
    desc: 'Features two half-heart magnetic bells that magnetically snap into a complete heart whenever hands hold close. A heartwarming gift for couples.',
    cat: 'bracelets',
    badge: 'Soulmate Bond 🧲',
    price: 249,
    origPrice: 599,
    rating: 5.0,
    reviews: 730,
    img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=700&q=80',
    specs: ['Strong Neodymium Magnet Hearts', 'Durable Braided Wax Cord', 'Fully Adjustable Wrist Sizing', 'Set of 2 (Black + Pink/White)'],
    pairsWith: 'Pairs with Love in Clouds & Polaroid Love'
  },
  {
    name: 'Infinity Love Charm Rose Gold Bangle',
    tagline: 'Delicate open cuff bracelet with pavé crystal infinity symbol',
    desc: 'Sleek minimalist cuff with an endless infinity charm on one end and crystal droplet on the other. Flexible fit suitable for any wrist size.',
    cat: 'bracelets',
    badge: 'Forever Love ♾️',
    price: 219,
    origPrice: 529,
    rating: 4.9,
    reviews: 298,
    img: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=700&q=80',
    specs: ['Rose Gold Tone PVD Finish', 'Flexible Open Cuff Fit', 'Micro Pavé Crystal Setting', 'Comes with Cleaning Cloth'],
    pairsWith: 'Pairs with Royal Vivah & Engagement Atelier'
  },
  {
    name: 'Natural Rose Quartz Healing Bead Bracelet',
    tagline: 'Genuine natural pink rose quartz crystal beads for love and harmony',
    desc: 'Known as the stone of unconditional love, this elastic beaded bracelet promotes emotional warmth, compassion, and positive celebration energy.',
    cat: 'bracelets',
    badge: 'Healing Crystal 🌸',
    price: 269,
    origPrice: 649,
    rating: 4.8,
    reviews: 210,
    img: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=700&q=80',
    specs: ['8mm Genuine Rose Quartz Beads', 'Heavy-Duty Elastic Cord', 'Smooth Polished Surface', 'Energized & Natural'],
    pairsWith: 'Pairs with Aura Calm & Pastel Aesthetic Invite'
  },

  // 19-24: Hampers & Combos
  {
    name: 'Luxe Celebration Chocolate & Keepsake Hamper',
    tagline: 'Curated gift trunk with artisanal chocolates, fairy lights, and note card',
    desc: 'All-in-one celebration bundle packaged in a reusable luxury kraft trunk with satin ribbon tie, warm battery fairy lights, and scented potpourri.',
    cat: 'combos',
    badge: 'Grand Hamper 🎀',
    price: 499,
    origPrice: 1199,
    rating: 4.9,
    reviews: 320,
    img: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=700&q=80',
    specs: ['Re-usable Rigid Gift Box', 'Warm Fairy Lights Included', 'Personalized Handwritten Note Card', 'Satin Bow & Golden Straw Cushioning'],
    pairsWith: 'Pairs with Golden Grandeur & VIP Atelier'
  },
  {
    name: 'Handcrafted Soy Aromatherapy Candle Trio',
    tagline: 'Set of 3 glass jar candles in French Vanilla, Wild Rose, and Lavender',
    desc: '100% natural organic soy wax candles hand-poured with cotton wicks. Burn cleanly for 25+ hours each, filling any room with sweet romantic fragrance.',
    cat: 'combos',
    badge: 'Scented Aura 🕯️',
    price: 369,
    origPrice: 849,
    rating: 5.0,
    reviews: 415,
    img: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=700&q=80',
    specs: ['100% Organic Soy Wax', 'Smokeless Cotton Wicks', 'Amber Glass Jars with Metal Lids', '25+ Hours Burn Time Each'],
    pairsWith: 'Pairs with Candle Wish 3D & Midnight Surprise'
  },
  {
    name: 'Aesthetic Desk Fairy LED Bottle Lamp',
    tagline: 'Vintage glass decanter filled with 20 starry micro-LED copper lights',
    desc: 'Warm ambient night light shaped like an antique elixir bottle with cork stopper. Runs on included button cells to transform any room into a cozy haven.',
    cat: 'combos',
    badge: 'Cozy Starry 💡',
    price: 199,
    origPrice: 499,
    rating: 4.9,
    reviews: 580,
    img: 'https://images.unsplash.com/photo-1517991104123-1d56a6e81ed9?auto=format&fit=crop&w=700&q=80',
    specs: ['20 Micro Copper Star LEDs', 'Glass Vintage Bottle', 'Replaceable Button Cells Included', 'Warm 2700K Cozy Glow'],
    pairsWith: 'Pairs with Starlight Wishes & Cyber Neon'
  },
  {
    name: 'Couple Coffee Mugs with Gold Spoons',
    tagline: 'Set of 2 ceramic marble texture mugs with crown lids and golden spoons',
    desc: 'Mr. and Mrs. style blush pink and slate grey mugs with real gold decal accents. Sturdy, microwave safe, and a beloved anniversary wedding gift.',
    cat: 'combos',
    badge: 'Couple Royalty ☕',
    price: 449,
    origPrice: 999,
    rating: 4.9,
    reviews: 362,
    img: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=700&q=80',
    specs: ['High-Grade Glazed Ceramic', '350ml Generous Capacity', 'Crown Coaster Lids Included', 'Dual Gold Stirrer Spoons'],
    pairsWith: 'Pairs with Royal Vivah & Anniversary Special'
  },
  {
    name: 'Bath Bliss Himalayan Salt & Rose Spa Box',
    tagline: 'Organic pink Himalayan bath salts, handmade rose soap, and bath bomb',
    desc: 'Self-care pamper gift box crafted with therapeutic essential oils and dried rose petals. Perfect for bridal showers, birthdays, or comforting relaxation.',
    cat: 'combos',
    badge: 'Self-Care Spa 🛁',
    price: 329,
    origPrice: 749,
    rating: 4.8,
    reviews: 198,
    img: 'https://images.unsplash.com/photo-1520523839898-507125cd53c1?auto=format&fit=crop&w=700&q=80',
    specs: ['Pure Pink Himalayan Rock Salt', 'Handmade Cold-Pressed Rose Soap', 'Moisturizing Fizzy Bath Bomb', 'Eco Kraft Box Packaging'],
    pairsWith: 'Pairs with Bridal Shower & Rose Invitation'
  },
  {
    name: 'Romantic Everlasting Preserved Rose Dome',
    tagline: 'Real beauty rose preserved inside a crystal glass cloche with LED base',
    desc: 'Inspired by fairy tale enchanted roses. Specially treated real rose that retains its fresh velvety texture for 3+ years without water or sunlight.',
    cat: 'combos',
    badge: 'Eternal Rose 🌹',
    price: 499,
    origPrice: 1299,
    rating: 5.0,
    reviews: 492,
    img: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=700&q=80',
    specs: ['Real Preserved Natural Rose', 'High-Clarity Glass Bell Dome', 'Built-in Warm Fairy String Light', 'Lifespan 3 to 5 Years'],
    pairsWith: 'Pairs with The Velvet Ring Box & Temple Blossom'
  },

  // 25-33: Aesthetic Photo Frames
  {
    name: 'Solid Wood 360° Rotating Photo Frame',
    tagline: 'Double-sided spinning beechwood frame to showcase 2 cherished memories',
    desc: 'Turn the frame smoothly with a gentle touch to switch between couple portraits or family snapshots. Elegant natural wood grain compliments any living room.',
    cat: 'frames',
    badge: 'Double Sided 🔄',
    price: 349,
    origPrice: 799,
    rating: 4.9,
    reviews: 310,
    img: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=700&q=80',
    specs: ['Solid Beechwood Construction', 'High-Definition Clear Acrylic Panes', 'Smooth 360 Spin Bearing', 'Holds Two 4x6 Inch Photos'],
    pairsWith: 'Pairs with Memory Lane & Couple Portrait'
  },
  {
    name: 'LED Ambient Glowing Acrylic Photo Block',
    tagline: 'Laser-etched transparent acrylic frame with warm wooden LED light bar',
    desc: 'Customizable photo display that illuminates your favourite celebration snapshot with a soft warm radiance from the concealed wooden light bar underneath.',
    cat: 'frames',
    badge: 'Nightlight Glow 🌟',
    price: 399,
    origPrice: 899,
    rating: 5.0,
    reviews: 640,
    img: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=700&q=80',
    specs: ['5mm Ultra-Clear Acrylic Pane', 'Natural Beechwood LED Base', 'USB Powered with On/Off Switch', 'Scratch Resistant UV Coating'],
    pairsWith: 'Pairs with Neon Night & Midnight Wish'
  },
  {
    name: 'Brushed Gold Rim Modern Portrait Frame',
    tagline: 'Slim aluminum metal frame with matte brass finish and crystal glass',
    desc: 'Sleek luxury border with minimal profile that puts full focus on your wedding vows, baby photos, or celebration invitations.',
    cat: 'frames',
    badge: 'Matte Brass 🖼️',
    price: 299,
    origPrice: 699,
    rating: 4.8,
    reviews: 245,
    img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=700&q=80',
    specs: ['Anodized Aluminum Alloy', 'Anti-Glare Real Glass Paning', 'Dual Wall Hook & Table Easel', 'Fits 5x7 or 6x8 Photos'],
    pairsWith: 'Pairs with Royal Vivah & Wedding Ceremony'
  },
  {
    name: 'Vintage Carved Floral Filigree Frame',
    tagline: 'Ornate antique baroque picture frame in distressed ivory and gold',
    desc: 'Intricate royal filigree borders cast with floral motifs. Gives wedding portraits or family heirlooms a grand museum-grade regal presentation.',
    cat: 'frames',
    badge: 'Royal Vintage 👑',
    price: 379,
    origPrice: 849,
    rating: 4.9,
    reviews: 185,
    img: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=700&q=80',
    specs: ['High-Density Polyresin Molding', 'Distressed Gold Hand Rubbing', 'Velvet Backing with Sturdy Stand', 'Heirloom Keepsake Quality'],
    pairsWith: 'Pairs with Temple Blossom Luxe & Royal Mandap'
  },
  {
    name: 'Floating Glass Polaroid Collage Frame',
    tagline: 'Transparent double glass floating frame for instant camera photo prints',
    desc: 'Suspends your cute square Polaroid snaps between two panes of tempered glass. Add dried flowers or pressed petals for a dreamy aesthetic touch.',
    cat: 'frames',
    badge: 'Polaroid Float 📸',
    price: 319,
    origPrice: 729,
    rating: 4.9,
    reviews: 320,
    img: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=700&q=80',
    specs: ['Twin Tempered Glass Panels', 'Rose Gold Metal Perimeter Wire', 'Perfect for 3x4 Polaroid Prints', 'Press Flowers Between Panes'],
    pairsWith: 'Pairs with Polaroid Memories & Instant Love'
  },
  {
    name: 'Modern Minimalist Nordic Oak Frame',
    tagline: 'Clean natural oak wood frame with beveled white mat border',
    desc: 'Scandinavian simplicity at its finest. Neutral warm oak complements modern apartments and minimal aesthetic room decor effortlessly.',
    cat: 'frames',
    badge: 'Nordic Oak 🌿',
    price: 289,
    origPrice: 649,
    rating: 4.8,
    reviews: 210,
    img: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=700&q=80',
    specs: ['Solid Russian Oak Timber', 'Acid-Free Archival White Mat', 'Shatterproof Polymer Glass', 'Wall Hang or Tabletop Ready'],
    pairsWith: 'Pairs with Minimalist Chic & Contemporary Wish'
  },
  {
    name: 'Antique Brass & Glass Hanging Locket Frame',
    tagline: 'Vintage brass picture frame with delicate chain for hanging on walls',
    desc: 'Geometric glass frame with rustic antique latch closure and matching hanging chain. A lovely way to frame love letters or pressed wildflowers.',
    cat: 'frames',
    badge: 'Locket Frame 🗝️',
    price: 259,
    origPrice: 589,
    rating: 4.9,
    reviews: 175,
    img: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=700&q=80',
    specs: ['Hand-Soldered Brass Rim', 'Sturdy 20cm Brass Hanging Chain', 'Sliding Hasp Lock Mechanism', 'Hexagonal Aesthetic Shape'],
    pairsWith: 'Pairs with Vintage Love & Botanical Wedding'
  },
  {
    name: 'Gallery Wall Multi-Aperture Frame Grid',
    tagline: 'Matte black collage frame designed to hold 4 favorite story moments',
    desc: 'Tell a complete celebration journey from first meeting to engagement with 4 symmetrically arranged photo openings protected under clean glass.',
    cat: 'frames',
    badge: 'Story Collage 🎞️',
    price: 429,
    origPrice: 949,
    rating: 4.9,
    reviews: 280,
    img: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=700&q=80',
    specs: ['4 Aperture 4x4 Inch Windows', 'Matte Black Wood Grain Finish', 'Seamless Rear Loading Clips', 'Includes Bubble Level Tool'],
    pairsWith: 'Pairs with Journey of Us & Timeline Romance'
  },
  {
    name: 'Custom Spotify Scannable Acrylic Music Plaque',
    tagline: 'Acrylic song plaque with album art, waveform, and instant Spotify scan code',
    desc: 'Put your song on crystal-clear acrylic! Point the Spotify app camera at the engraved code to instantly stream your special celebration soundtrack.',
    cat: 'frames',
    badge: 'Scannable Song 🎵',
    price: 379,
    origPrice: 899,
    rating: 5.0,
    reviews: 820,
    img: 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=700&q=80',
    specs: ['Laser-Etched Acrylic Sheet', 'Solid Beechwood Stand Base', 'High-Res Scratch-Proof UV Print', 'Working Spotify Audio Waveform'],
    pairsWith: 'Pairs with All Musical & Audio Celebration Invites'
  },

  // 34-35: More Cute Plushies
  {
    name: 'Chubby Penguin with Knitted Scarf',
    tagline: 'Cute chubby penguin plushie with a tiny red striped woolen muffler',
    desc: 'Irresistibly adorable round penguin with soft flippers and a knit winter scarf. Brings smiles to kids, teens, and adults alike.',
    cat: 'plushies',
    badge: 'Winter Cozy 🐧',
    price: 219,
    origPrice: 499,
    rating: 4.8,
    reviews: 165,
    img: 'https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?auto=format&fit=crop&w=700&q=80',
    specs: ['Plush Velvet Outer Skin', 'Removable Knit Scarf', 'Super Squishy Belly', 'Height 24cm'],
    pairsWith: 'Pairs with Winter Wonderland & Christmas Wish'
  },
  {
    name: 'Cuddle Koala Soft Tree Hugger',
    tagline: 'Gentle grey koala with fluffy ears and soft velcro clutching paws',
    desc: 'Sweet koala plushie whose paws can hug around bottles, bedposts, or gift packages. A delightful physical accessory for hampers.',
    cat: 'plushies',
    badge: 'Tree Hugger 🐨',
    price: 249,
    origPrice: 569,
    rating: 4.9,
    reviews: 190,
    img: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=700&q=80',
    specs: ['Huggable Velcro Arm Paws', 'Fluffy Sherpa Ear Tuft', 'Child Safe Polyfill', 'Height 25cm'],
    pairsWith: 'Pairs with Hey Birthday & Sweet Cuddles'
  },

  // 36: Musical Toy / Melody Box
  {
    name: 'Vintage Hand-Crank Wooden Melody Music Box',
    tagline: 'Carved wooden music box playing sweet classical anniversary tunes',
    desc: 'No batteries required! Simply crank the golden handle to play enchanting acoustic melodies through an authentic 18-note mechanical musical chime.',
    cat: 'musicbox',
    badge: 'Pure Acoustics 🎶',
    price: 299,
    origPrice: 699,
    rating: 5.0,
    reviews: 430,
    img: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=700&q=80',
    specs: ['Authentic 18-Note Musical Movement', 'Intricately Carved Natural Birchwood', 'No Batteries Needed — Hand Crank', 'Pocket Size 6.5 x 5 x 4 cm'],
    pairsWith: 'Pairs with Hey Birthday Melody & Wedding Waltz'
  },

  // 37-38: Keepsake 3D Greeting Cards
  {
    name: '3D Laser Cut Pop-Up Cherry Blossom Card',
    tagline: 'Opens into a breathtaking 3-dimensional blooming sakura tree with couple',
    desc: 'Meticulously crafted laser-cut art paper card. When opened, an intricate 3D blossoming tree pops up gracefully with ample space for love notes.',
    cat: 'cards',
    badge: '3D Pop-Up 🌸',
    price: 149,
    origPrice: 349,
    rating: 4.9,
    reviews: 512,
    img: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=700&q=80',
    specs: ['300 GSM Heavy Italian Art Paper', 'Precision Laser-Cut Pop-Up', 'Matching Shimmer Pearl Envelope', 'Slide-Out Hidden Note Card'],
    pairsWith: 'Pairs with Cherry Blossom & Spring Romance'
  },
  {
    name: 'Royal Wax-Sealed Gold Foil Love Letter Card',
    tagline: 'Burgundy velvet card with gold hot-stamped vows and genuine wax seal stamp',
    desc: 'Ultra-luxurious tactile keepsake card made with rich cotton rag paper, deckled edges, genuine gold foil calligraphy, and a scented royal wax seal.',
    cat: 'cards',
    badge: 'Wax Seal Royale 👑',
    price: 179,
    origPrice: 399,
    rating: 5.0,
    reviews: 388,
    img: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=700&q=80',
    specs: ['Heavyweight Deckled Cotton Stock', 'Real Hot-Stamped Gold Foil', 'Hand-Poured Crimson Wax Seal', 'Velvet Protective Sleeve Included'],
    pairsWith: 'Pairs with Royal Vivah & Ivory Arch Wedding'
  }
];

const VANVI_MEESHO_LINKS = [
  'https://link.meesho.co/l59nef2jo5',
  'https://link.meesho.co/1z17k5e0s0j',
  'https://link.meesho.co/a2644nzddf',
  'https://link.meesho.co/l59ner5kso',
  'https://link.meesho.co/1cv0hlq998f',
  'https://link.meesho.co/1z17k5q27os',
  'https://link.meesho.co/1z17k5ttzma',
  'https://link.meesho.co/a26458qhmp',
  'https://link.meesho.co/a2645baxm6',
  'https://link.meesho.co/l59nfha0nx',
  'https://link.meesho.co/1z17k6dlm0k',
  'https://link.meesho.co/a2645pmwlt',
  'https://link.meesho.co/1z17k6n0e4z',
  'https://link.meesho.co/a2645wkxlj',
  'https://link.meesho.co/1cv0hmvnrgq',
  'https://link.meesho.co/l59ng2jhil',
  'https://link.meesho.co/l59ng49dsd',
  'https://link.meesho.co/1z17k7csi0l',
  'https://link.meesho.co/1z17k7jqol8',
  'https://link.meesho.co/1z17k7luwin',
  'https://link.meesho.co/flpvtu49dx',
  'https://link.meesho.co/l59ngyz0he',
  'https://link.meesho.co/1z17k7v0lou',
  'https://link.meesho.co/a26474mffw',
  'https://link.meesho.co/l59nh5jc40',
  'https://link.meesho.co/1z17k821iyt',
  'https://link.meesho.co/l59nh9bm4x',
  'https://link.meesho.co/flpvud8dqg',
  'https://link.meesho.co/a2647go7qr',
  'https://link.meesho.co/a2647ilnbh',
  'https://link.meesho.co/flpvum3yry',
  'https://link.meesho.co/1z17k8grs4f',
  'https://link.meesho.co/1z17k8j5c2b',
  'https://link.meesho.co/l59nhu6tyv',
  'https://link.meesho.co/a2647yunrt',
  'https://link.meesho.co/l59ni1749l',
  'https://link.meesho.co/1cv0hp856rf',
  'https://link.meesho.co/a2648qhgdz'
];

const fileHeader = `/**
 * VANVI MOMENTS — PHYSICAL GIFT BOUTIQUE & AFFILIATE RESELLING ENGINE
 * Curated physical celebration treasures with direct 1-tap affiliate and
 * reselling links across Meesho, Amazon India, Flipkart, and Myntra.
 */

(function(root) {
  'use strict';

  const VANVI_MEESHO_LINKS = ${JSON.stringify(VANVI_MEESHO_LINKS, null, 4)};

  const MEESHO_ITEMS_DEF = ${JSON.stringify(MEESHO_ITEMS_DEF, null, 4)};

  const LINKED_MEESHO_PRODUCTS = MEESHO_ITEMS_DEF.map((item, index) => {
    const link = VANVI_MEESHO_LINKS[index] || VANVI_MEESHO_LINKS[0];
    const num = String(index + 1).padStart(2, '0');
    return {
      id: 'meesho-gift-' + num,
      name: item.name,
      tagline: item.tagline,
      description: item.desc,
      price: item.price,
      originalPrice: item.origPrice,
      category: item.cat,
      badge: item.badge,
      rating: item.rating,
      reviewCount: item.reviews,
      image: item.img,
      primaryStore: 'meesho',
      primaryStoreName: 'Meesho Resell',
      primaryStoreBadge: '🛍️ Best Meesho Rate',
      primaryAffiliateLink: link,
      stores: [
        { id: 'meesho', name: 'Meesho Resell', icon: '🛍️', badge: 'Direct Wholesale Rate', price: item.price, link: link },
        { id: 'amazon', name: 'Amazon India', icon: '📦', badge: 'Fast Delivery', price: item.price + 50, link: 'https://www.amazon.in/s?k=' + encodeURIComponent(item.name) + '&tag=vanvi-21' },
        { id: 'flipkart', name: 'Flipkart', icon: '⚡', badge: 'SuperCoins Available', price: item.price + 40, link: 'https://www.flipkart.com/search?q=' + encodeURIComponent(item.name) }
      ],
      specs: item.specs,
      pairsWith: item.pairsWith
    };
  });

  const VANVI_PRODUCT_CATEGORIES = [
    { id: 'all', name: 'All 38 Cute Gifts', icon: '🎁' },
    { id: 'plushies', name: 'Plushies & Teddies', icon: '🧸' },
    { id: 'frames', name: 'Aesthetic Frames', icon: '🖼️' },
    { id: 'jewelry', name: 'Earrings & Studs', icon: '✨' },
    { id: 'bracelets', name: 'Couple Bracelets', icon: '💫' },
    { id: 'combos', name: 'Hampers & Candles', icon: '🎀' },
    { id: 'scrapbooks', name: 'Scrapbook Albums', icon: '📖' },
    { id: 'musicbox', name: 'Melody Music Box', icon: '🎶' },
    { id: 'cards', name: '3D Keepsake Cards', icon: '💌' }
  ];

  // ─── AFFILIATE & RESELLING ENGINE ──────────────────────────────────────
  const VanviAffiliate = {
    getAll() {
      return LINKED_MEESHO_PRODUCTS;
    },

    getById(id) {
      return LINKED_MEESHO_PRODUCTS.find(p => p.id === id) || null;
    },

    openStore(productId, storeId) {
      const prod = this.getById(productId);
      if (!prod) return;

      let targetUrl = prod.primaryAffiliateLink;
      let storeName = prod.primaryStoreName;

      if (storeId && prod.stores) {
        const found = prod.stores.find(s => s.id === storeId);
        if (found) {
          targetUrl = found.link;
          storeName = found.name;
        }
      }

      // Smooth click notification toast
      if (typeof window !== 'undefined' && window.showToast) {
        window.showToast('Opening official ' + storeName + ' storefront... 🛍️');
      }

      // Open affiliate store safely in new tab
      window.open(targetUrl, '_blank', 'noopener,noreferrer,sponsored');
    }
  };

  // Backwards-compatible dummy cart (prevents legacy reference errors)
  const VanviCart = {
    getCart() { return []; },
    addItem(p) { VanviAffiliate.openStore(p.id); return []; },
    updateQty() { return []; },
    removeItem() { return []; },
    clear() { return []; },
    getCount() { return 0; },
    getTotal() { return 0; }
  };

  // ─── EXPORTS ─────────────────────────────────────────────────────────
  root.VANVI_BOUTIQUE_PRODUCTS = LINKED_MEESHO_PRODUCTS;
  root.VANVI_PRODUCTS = LINKED_MEESHO_PRODUCTS;
  root.LINKED_MEESHO_PRODUCTS = LINKED_MEESHO_PRODUCTS;
  root.VANVI_PRODUCT_CATEGORIES = VANVI_PRODUCT_CATEGORIES;
  root.VanviAffiliate = VanviAffiliate;
  root.VanviCart = VanviCart;

})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));
`;

fs.writeFileSync('js/vanvi-products-data.js', fileHeader, 'utf8');
console.log('Successfully wrote updated js/vanvi-products-data.js with all 38 products!');
