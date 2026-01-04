import { Theme } from '@/types';

export const themes: Theme[] = [
  {
    id: 'beach-wedding',
    name: 'Beach Wedding',
    description: 'Romantic seaside wedding with ocean views',
    previewImage: '/themes/beach-wedding.jpg',
    referenceImage: '/previewImage/1.Beach.jpg',
    themeImage: '/themeImage/1.Beach.jpg',
    promptTemplate: `Transform this photo into a romantic beach wedding portrait.

🚨 CRITICAL FACE PRESERVATION RULES (HIGHEST PRIORITY - NON-NEGOTIABLE):

1. COPY the face(s) from the captured image EXACTLY as-is - pixel-perfect preservation required
2. DO NOT modify, alter, enhance, smooth, or change ANY facial features whatsoever
3. Preserve EXACT: eyes, nose, mouth, chin, jawline, skin tone, skin texture, wrinkles, freckles, moles, facial hair
4. NO beautification, NO facial smoothing, NO AI enhancements
5. ONLY lighting may be adjusted to match the scene - facial structure stays 100% identical

⚠️ Any face modification = CRITICAL FAILURE - When in doubt, preserve perfectly

REQUIRED CHANGES:
- ALWAYS transform ALL clothing into elegant beach wedding attire - this is MANDATORY
  * For women: flowing white beach wedding dress, light and elegant
  * For men: light-colored suit or formal beach attire
  * No exceptions - all casual clothes MUST become beach wedding attire
- Apply soft, natural beach lighting with golden hour tones
- Background MUST be transformed into a beautiful beach setting with ocean and sand
- Pose can be adjusted for romantic beach wedding composition

STYLE TO APPLY:
- Romantic beach wedding atmosphere with ocean backdrop
- Soft golden hour lighting, warm sunset tones
- Sandy beach with ocean waves in the background
- Tropical, breezy, romantic aesthetic
- Light, airy feeling typical of beach weddings
- Keep the face as the central focus with crystal-clear detail

CRITICAL OUTPUT FORMAT:
- IGNORE the reference image's aspect ratio completely
- OUTPUT MUST BE: Portrait orientation 1080x1920 pixels (vertical/tall format)
- Do NOT create square images - output must be vertical portrait`,
  },
  {
    id: 'cherry-blossom-anime',
    name: 'Cherry Blossom Anime',
    description: 'Japanese anime style with cherry blossoms',
    previewImage: '/themes/anime-illustrated.jpg',
    referenceImage: '/previewImage/2.Cherry Blossom Japanese Anime.jpg',
    themeImage: '/themeImage/2.Cherry Blossom Japanese Anime.jpg',
    promptTemplate: `Transform this photo into Japanese anime style with cherry blossoms.

FACE GUIDELINES:
- Use the person(s) from the captured image as inspiration for the anime character(s)
- Transform into anime/manga art style with stylized features
- Maintain general resemblance while applying anime aesthetic
- FACE LIGHTING SHOULD BE ADJUSTED to match the surrounding environment and scene lighting

REQUIRED CHANGES:
- ALWAYS transform into anime/manga art style - this is MANDATORY
- Transform clothing into elegant Japanese-inspired attire or modern anime fashion
- Apply anime-style shading, highlights, and color palette
- Background MUST feature cherry blossom trees and petals
- Anime aesthetic with characteristic large eyes and stylized features

STYLE TO APPLY:
- Beautiful Japanese anime/manga art style
- Cherry blossom (sakura) trees in full bloom
- Soft pink petals falling in the air
- Vibrant anime colors with clean line work
- Romantic Japanese spring atmosphere
- Stylized anime interpretation of the person

CRITICAL OUTPUT FORMAT:
- IGNORE the reference image's aspect ratio completely
- OUTPUT MUST BE: Portrait orientation 1080x1920 pixels (vertical/tall format)
- Do NOT create square images - output must be vertical portrait`,
  },
  {
    id: 'game-of-thrones',
    name: 'Game of Thrones Fantasy',
    description: 'Epic medieval fantasy with royal attire',
    previewImage: '/themes/fairytale-fantasy.jpg',
    referenceImage: '/previewImage/3.Game of Thrones.jpg',
    themeImage: '/themeImage/3.Game of Thrones.jpg',
    promptTemplate: `Transform this photo into epic Game of Thrones fantasy style.

🚨 CRITICAL FACE PRESERVATION RULES (HIGHEST PRIORITY - NON-NEGOTIABLE):

1. COPY the face(s) from the captured image EXACTLY as-is - pixel-perfect preservation required
2. DO NOT modify, alter, enhance, smooth, or change ANY facial features whatsoever
3. Preserve EXACT: eyes, nose, mouth, chin, jawline, skin tone, skin texture, wrinkles, freckles, moles, facial hair
4. NO beautification, NO facial smoothing, NO AI enhancements
5. ONLY lighting may be adjusted to match the scene - facial structure stays 100% identical

⚠️ Any face modification = CRITICAL FAILURE - When in doubt, preserve perfectly

REQUIRED CHANGES:
- ALWAYS transform ALL clothing into medieval fantasy royal attire - this is MANDATORY
  * Elaborate medieval robes, fur cloaks, royal garments
  * Rich fabrics, jeweled accessories, crowns or circlets
  * No exceptions - transform into fantasy nobility attire
- Apply dramatic, cinematic lighting typical of Game of Thrones
- Background MUST be transformed into medieval castle, throne room, or winter landscape
- Epic, powerful pose befitting fantasy royalty

STYLE TO APPLY:
- Epic medieval fantasy atmosphere like Game of Thrones
- Dramatic cinematic lighting with rich, moody tones
- Medieval castle architecture or winter landscape background
- Rich royal fabrics, furs, and medieval accessories
- Powerful, regal composition
- Keep the face as the central focus with perfect clarity

CRITICAL OUTPUT FORMAT:
- IGNORE the reference image's aspect ratio completely
- OUTPUT MUST BE: Portrait orientation 1080x1920 pixels (vertical/tall format)
- Do NOT create square images - output must be vertical portrait`,
  },
  {
    id: 'garden-party-elegant',
    name: 'Elegant Garden Party',
    description: 'Sophisticated garden celebration with floral elegance',
    previewImage: '/themes/garden-party.jpg',
    referenceImage: '/previewImage/4.Garden Party 1.jpg',
    themeImage: '/themeImage/4.Garden Party 1.jpg',
    promptTemplate: `Transform this photo into an elegant garden party portrait.

🚨 CRITICAL FACE PRESERVATION RULES (HIGHEST PRIORITY - NON-NEGOTIABLE):

1. COPY the face(s) from the captured image EXACTLY as-is - pixel-perfect preservation required
2. DO NOT modify, alter, enhance, smooth, or change ANY facial features whatsoever
3. Preserve EXACT: eyes, nose, mouth, chin, jawline, skin tone, skin texture, wrinkles, freckles, moles, facial hair
4. NO beautification, NO facial smoothing, NO AI enhancements
5. ONLY lighting may be adjusted to match the scene - facial structure stays 100% identical

⚠️ Any face modification = CRITICAL FAILURE - When in doubt, preserve perfectly

REQUIRED CHANGES:
- ALWAYS transform ALL clothing into elegant garden party attire - this is MANDATORY
  * For women: sophisticated floral dress or elegant summer gown
  * For men: smart casual or formal garden party suit
  * No exceptions - all casual clothes MUST become elegant party attire
- Apply soft, natural daylight with dappled sunlight
- Background MUST be transformed into lush garden with flowers
- Elegant, sophisticated garden party atmosphere

STYLE TO APPLY:
- Sophisticated garden party setting with abundant flowers
- Soft natural lighting with gentle shadows through foliage
- Lush greenery, colorful flower arrangements, manicured garden
- Elegant, fresh, sophisticated aesthetic
- Daytime outdoor celebration atmosphere
- Keep the face as the central focus with crystal-clear detail

CRITICAL OUTPUT FORMAT:
- IGNORE the reference image's aspect ratio completely
- OUTPUT MUST BE: Portrait orientation 1080x1920 pixels (vertical/tall format)
- Do NOT create square images - output must be vertical portrait`,
  },
  {
    id: 'garden-party-romantic',
    name: 'Romantic Garden Party',
    description: 'Dreamy garden wedding with romantic florals',
    previewImage: '/themes/garden-party.jpg',
    referenceImage: '/previewImage/5.Garden Party 2.jpg',
    themeImage: '/themeImage/5.Garden Party 2.jpg',
    promptTemplate: `Transform this photo into a romantic garden party wedding portrait.

🚨 CRITICAL FACE PRESERVATION RULES (HIGHEST PRIORITY - NON-NEGOTIABLE):

1. COPY the face(s) from the captured image EXACTLY as-is - pixel-perfect preservation required
2. DO NOT modify, alter, enhance, smooth, or change ANY facial features whatsoever
3. Preserve EXACT: eyes, nose, mouth, chin, jawline, skin tone, skin texture, wrinkles, freckles, moles, facial hair
4. NO beautification, NO facial smoothing, NO AI enhancements
5. ONLY lighting may be adjusted to match the scene - facial structure stays 100% identical

⚠️ Any face modification = CRITICAL FAILURE - When in doubt, preserve perfectly

REQUIRED CHANGES:
- ALWAYS transform ALL clothing into romantic garden wedding attire - this is MANDATORY
  * For women: romantic white or pastel wedding/party dress
  * For men: elegant suit appropriate for garden wedding
  * No exceptions - transform into romantic formal garden attire
- Apply soft, dreamy lighting with romantic atmosphere
- Background MUST be transformed into romantic garden with abundant flowers
- Dreamy, enchanted garden atmosphere

STYLE TO APPLY:
- Romantic, dreamy garden wedding atmosphere
- Soft lighting with ethereal quality
- Abundant flowers, roses, romantic garden setting
- Pastel tones, soft focus on background
- Enchanted garden aesthetic
- Keep the face as the central focus with perfect clarity

CRITICAL OUTPUT FORMAT:
- IGNORE the reference image's aspect ratio completely
- OUTPUT MUST BE: Portrait orientation 1080x1920 pixels (vertical/tall format)
- Do NOT create square images - output must be vertical portrait`,
  },
  {
    id: 'halloween-spooky',
    name: 'Halloween Spooky',
    description: 'Festive Halloween with spooky atmosphere',
    previewImage: '/themes/cultural-traditional.jpg',
    referenceImage: '/previewImage/6.Halloween.jpg',
    themeImage: '/themeImage/6.Halloween.jpg',
    promptTemplate: `Transform this photo into festive Halloween portrait.

🚨 CRITICAL FACE PRESERVATION RULES (HIGHEST PRIORITY - NON-NEGOTIABLE):

1. COPY the face(s) from the captured image EXACTLY as-is - pixel-perfect preservation required
2. DO NOT modify, alter, enhance, smooth, or change ANY facial features whatsoever
3. Preserve EXACT: eyes, nose, mouth, chin, jawline, skin tone, skin texture, wrinkles, freckles, moles, facial hair
4. NO beautification, NO facial smoothing, NO AI enhancements
5. ONLY lighting may be adjusted to match the scene - facial structure stays 100% identical

⚠️ Any face modification = CRITICAL FAILURE - When in doubt, preserve perfectly

REQUIRED CHANGES:
- ALWAYS transform ALL clothing into Halloween-themed attire - this is MANDATORY
  * Creative Halloween costumes, elegant gothic attire, or festive Halloween outfits
  * Dark, festive colors - blacks, oranges, purples
  * No exceptions - transform into Halloween-appropriate clothing
- Apply atmospheric Halloween lighting with orange and purple tones
- Background MUST be transformed into spooky Halloween setting
- Festive yet slightly spooky Halloween atmosphere

STYLE TO APPLY:
- Festive Halloween atmosphere with pumpkins, autumn leaves
- Moody lighting with orange and purple color palette
- Spooky but fun setting - haunted house, pumpkin patch, autumn forest
- Halloween decorations, jack-o-lanterns, autumn aesthetic
- Mysterious, festive Halloween celebration mood
- Keep the face as the central focus with perfect clarity

CRITICAL OUTPUT FORMAT:
- IGNORE the reference image's aspect ratio completely
- OUTPUT MUST BE: Portrait orientation 1080x1920 pixels (vertical/tall format)
- Do NOT create square images - output must be vertical portrait`,
  },
  {
    id: 'harry-potter-magic',
    name: 'Harry Potter Magic',
    description: 'Magical wizarding world with Hogwarts aesthetic',
    previewImage: '/themes/fairytale-fantasy.jpg',
    referenceImage: '/previewImage/7.Harry Porter.jpg',
    themeImage: '/themeImage/7.Harry Porter.jpg',
    promptTemplate: `Transform this photo into magical Harry Potter wizarding world portrait.

🚨 CRITICAL FACE PRESERVATION RULES (HIGHEST PRIORITY - NON-NEGOTIABLE):

1. COPY the face(s) from the captured image EXACTLY as-is - pixel-perfect preservation required
2. DO NOT modify, alter, enhance, smooth, or change ANY facial features whatsoever
3. Preserve EXACT: eyes, nose, mouth, chin, jawline, skin tone, skin texture, wrinkles, freckles, moles, facial hair
4. NO beautification, NO facial smoothing, NO AI enhancements
5. ONLY lighting may be adjusted to match the scene - facial structure stays 100% identical

⚠️ Any face modification = CRITICAL FAILURE - When in doubt, preserve perfectly

REQUIRED CHANGES:
- REMOVE the people in the current reference image
- ALWAYS ADD WITCH HAT to the top of the person's head - this is MANDATORY
- ALWAYS transform ALL clothing into Hogwarts wizarding attire - this is MANDATORY
  * Hogwarts robes, house scarves, wizard robes, or magical academic attire
  * House colors (Gryffindor, Slytherin, Ravenclaw, or Hufflepuff)
  * No exceptions - transform into magical wizard/witch clothing
- Apply magical, mystical lighting with warm castle tones
- Background MUST be transformed into Hogwarts castle or magical setting
- Magical, wizarding world atmosphere

STYLE TO APPLY:
- Magical Harry Potter atmosphere with Hogwarts aesthetic
- Warm, mystical lighting typical of the wizarding world
- Hogwarts castle interior or magical setting background
- Rich, warm colors with magical atmosphere
- Academic wizarding world aesthetic
- Keep the face as the central focus with crystal-clear detail

CRITICAL OUTPUT FORMAT:
- IGNORE the reference image's aspect ratio completely
- OUTPUT MUST BE: Portrait orientation 1080x1920 pixels (vertical/tall format)
- Do NOT create square images - output must be vertical portrait`,
  },
  {
    id: 'superhero-epic',
    name: 'Superhero Epic',
    description: 'Powerful superhero with dramatic cityscape',
    previewImage: '/themes/cinematic-movie.jpg',
    referenceImage: '/previewImage/8.Superhero Theme.jpg',
    themeImage: '/themeImage/8.Superhero Theme.jpg',
    promptTemplate: `Transform this photo into epic superhero portrait.

CRITICAL - PRESERVE THE FACE (ABSOLUTE REQUIREMENT):
- MUST use the EXACT face(s) from the captured image - NO EXCEPTIONS
- If there are 2 people in the captured image, include BOTH faces in the output as a superhero duo
- DO NOT modify, alter, or change facial features in ANY way
- Keep facial features, face shape, facial structure, skin tone, and all facial characteristics 100% IDENTICAL
- Preserve exact eye shape, nose, mouth, facial proportions, and bone structure
- FACE LIGHTING SHOULD BE ADJUSTED to match the surrounding environment and scene lighting
- This is MANDATORY and NON-NEGOTIABLE - any face modification is a critical failure

REQUIRED CHANGES:
- ALWAYS transform ALL clothing into superhero costume - this is MANDATORY
  * Sleek superhero suit with cape or tactical superhero gear
  * Bold colors, superhero emblem, powerful design
  * If 2 people: create complementary superhero costumes as a dynamic duo
  * No exceptions - transform into superhero attire
- Apply dramatic, cinematic lighting with heroic atmosphere
- Background MUST be transformed into epic cityscape or dramatic setting
- Powerful, heroic superhero pose (duo pose if 2 people)

STYLE TO APPLY:
- Epic superhero atmosphere like Marvel/DC movies
- Dramatic cinematic lighting with bold colors
- City skyline, rooftop, or dramatic urban background
- Powerful, heroic composition
- Dynamic action-ready pose
- Keep the face as the central focus with perfect clarity

CRITICAL OUTPUT FORMAT:
- IGNORE the reference image's aspect ratio completely
- OUTPUT MUST BE: Portrait orientation 1080x1920 pixels (vertical/tall format)
- Do NOT create square images - output must be vertical portrait`,
  },
  {
    id: 'mountain-summit',
    name: 'Mountain Summit',
    description: 'Adventurous mountain peak with stunning views',
    previewImage: '/themes/beach-sunset.jpg',
    referenceImage: '/previewImage/9.Top of Mountain.jpg',
    themeImage: '/themeImage/9.Top of Mountain.jpg',
    promptTemplate: `Transform this photo into adventurous mountain summit portrait.

🚨 CRITICAL FACE PRESERVATION RULES (HIGHEST PRIORITY - NON-NEGOTIABLE):

1. COPY the face(s) from the captured image EXACTLY as-is - pixel-perfect preservation required
2. DO NOT modify, alter, enhance, smooth, or change ANY facial features whatsoever
3. Preserve EXACT: eyes, nose, mouth, chin, jawline, skin tone, skin texture, wrinkles, freckles, moles, facial hair
4. NO beautification, NO facial smoothing, NO AI enhancements
5. ONLY lighting may be adjusted to match the scene - facial structure stays 100% identical

⚠️ Any face modification = CRITICAL FAILURE - When in doubt, preserve perfectly

REQUIRED CHANGES:
- ALWAYS transform ALL clothing into mountain adventure attire - this is MANDATORY
  * Outdoor adventure gear, hiking jacket, mountaineering clothing
  * Practical outdoor colors, weather-appropriate gear
  * No exceptions - transform into mountain adventure clothing
- Apply crisp mountain lighting with clear blue skies
- Background MUST be transformed into mountain summit with panoramic views
- Adventurous, triumphant mountain peak atmosphere

STYLE TO APPLY:
- Epic mountain summit atmosphere with breathtaking views
- Clear, crisp mountain air lighting
- Dramatic mountain peaks, clouds below, vast sky
- Sense of achievement and adventure
- Panoramic mountain landscape background
- Keep the face as the central focus with crystal-clear detail

CRITICAL OUTPUT FORMAT:
- IGNORE the reference image's aspect ratio completely
- OUTPUT MUST BE: Portrait orientation 1080x1920 pixels (vertical/tall format)
- Do NOT create square images - output must be vertical portrait`,
  },
  {
    id: 'indian-cultural',
    name: 'Indian Cultural Wedding',
    description: 'Rich Indian cultural attire with traditional elegance',
    previewImage: '/themes/cultural-traditional.jpg',
    referenceImage: '/previewImage/10.Indian Cultural.jpg',
    themeImage: '/themeImage/10.Indian Cultural.jpg',
    promptTemplate: `Transform this photo into rich Indian cultural wedding portrait.

CRITICAL - PRESERVE THE FACE (ABSOLUTE REQUIREMENT):
- MUST use the EXACT face(s) from the captured image - NO EXCEPTIONS
- DO NOT modify, alter, or change facial features in ANY way
- Keep facial features, face shape, facial structure, skin tone, and all facial characteristics 100% IDENTICAL
- Preserve exact eye shape, nose, mouth, facial proportions, and bone structure
- FACE LIGHTING SHOULD BE ADJUSTED to match the surrounding environment and scene lighting
- DO NOT change the person's race, ethnicity, or skin tone - maintain their exact appearance
- This is MANDATORY and NON-NEGOTIABLE - any face modification is a critical failure

REQUIRED CHANGES:
- ALWAYS transform ALL clothing into traditional Indian wedding attire - this is MANDATORY
  * For women: beautiful saree or lehenga with intricate details, jewelry
  * For men: sherwani or traditional Indian formal wear
  * No exceptions - transform into elegant Indian cultural attire
- Apply rich, warm lighting typical of Indian celebrations
- Background MUST be transformed into elegant Indian wedding venue
- Festive, celebratory Indian cultural atmosphere

STYLE TO APPLY:
- Rich Indian cultural wedding atmosphere
- Vibrant colors - reds, golds, jewel tones
- Ornate traditional Indian setting with decorations
- Intricate traditional jewelry and accessories
- Festive, celebratory mood
- Keep the face as the central focus with perfect clarity

CRITICAL OUTPUT FORMAT:
- IGNORE the reference image's aspect ratio completely
- OUTPUT MUST BE: Portrait orientation 1080x1920 pixels (vertical/tall format)
- Do NOT create square images - output must be vertical portrait`,
  },
  {
    id: 'chinese-traditional',
    name: 'Traditional Chinese Wedding',
    description: 'Elegant Chinese cultural attire with traditional charm',
    previewImage: '/themes/cultural-traditional.jpg',
    referenceImage: '/previewImage/11.Traditional Chinese.jpg',
    themeImage: '/themeImage/11.Traditional Chinese.jpg',
    promptTemplate: `Transform this photo into elegant traditional Chinese wedding portrait.

CRITICAL - PRESERVE THE FACE (ABSOLUTE REQUIREMENT):
- MUST use the EXACT face(s) from the captured image - NO EXCEPTIONS
- DO NOT modify, alter, or change facial features in ANY way
- Keep facial features, face shape, facial structure, skin tone, and all facial characteristics 100% IDENTICAL
- Preserve exact eye shape, nose, mouth, facial proportions, and bone structure
- FACE LIGHTING SHOULD BE ADJUSTED to match the surrounding environment and scene lighting
- DO NOT change the person's race, ethnicity, or skin tone - maintain their exact appearance
- This is MANDATORY and NON-NEGOTIABLE - any face modification is a critical failure

REQUIRED CHANGES:
- ALWAYS transform ALL clothing into traditional Chinese wedding attire - this is MANDATORY
  * For women: elegant qipao/cheongsam or traditional Chinese wedding dress
  * For men: traditional Chinese formal attire or mandarin collar suit
  * Rich reds and golds typical of Chinese celebrations
  * No exceptions - transform into Chinese cultural attire
- Apply elegant lighting with traditional Chinese aesthetic
- Background MUST be transformed into traditional Chinese setting
- Elegant, traditional Chinese wedding atmosphere

STYLE TO APPLY:
- Traditional Chinese wedding atmosphere with cultural elegance
- Rich red and gold color palette
- Traditional Chinese architectural elements or garden setting
- Elegant, refined traditional aesthetic
- Cultural decorations and traditional elements
- Keep the face as the central focus with crystal-clear detail

CRITICAL OUTPUT FORMAT:
- IGNORE the reference image's aspect ratio completely
- OUTPUT MUST BE: Portrait orientation 1080x1920 pixels (vertical/tall format)
- Do NOT create square images - output must be vertical portrait`,
  },
  {
    id: 'malay-traditional',
    name: 'Traditional Malay Wedding',
    description: 'Beautiful Malay cultural attire with traditional elegance',
    previewImage: '/themes/cultural-traditional.jpg',
    referenceImage: '/previewImage/12.Traditional Malay Cultural.jpg',
    themeImage: '/themeImage/12.Traditional Malay Cultural.jpg',
    promptTemplate: `Transform this photo into beautiful traditional Malay wedding portrait.

CRITICAL - PRESERVE THE FACE (ABSOLUTE REQUIREMENT):
- MUST use the EXACT face(s) from the captured image - NO EXCEPTIONS
- DO NOT modify, alter, or change facial features in ANY way
- Keep facial features, face shape, facial structure, skin tone, and all facial characteristics 100% IDENTICAL
- Preserve exact eye shape, nose, mouth, facial proportions, and bone structure
- FACE LIGHTING SHOULD BE ADJUSTED to match the surrounding environment and scene lighting
- DO NOT change the person's race, ethnicity, or skin tone - maintain their exact appearance
- This is MANDATORY and NON-NEGOTIABLE - any face modification is a critical failure

REQUIRED CHANGES:
- ALWAYS transform ALL clothing into traditional Malay wedding attire - this is MANDATORY
  * For women: elegant baju kurung or kebaya with traditional accessories
  * For men: baju melayu with sampin or traditional formal wear
  * Rich traditional colors and patterns
  * No exceptions - transform into Malay cultural attire
- Apply warm, elegant lighting typical of Malay celebrations
- Background MUST be transformed into traditional Malay wedding venue
- Festive, elegant Malay cultural atmosphere

STYLE TO APPLY:
- Traditional Malay wedding atmosphere with cultural elegance
- Rich colors - purples, golds, teals, traditional patterns
- Malay traditional decorations and setting
- Elegant, refined traditional aesthetic
- Cultural celebration atmosphere
- Keep the face as the central focus with perfect clarity

CRITICAL OUTPUT FORMAT:
- IGNORE the reference image's aspect ratio completely
- OUTPUT MUST BE: Portrait orientation 1080x1920 pixels (vertical/tall format)
- Do NOT create square images - output must be vertical portrait`,
  },
  {
    id: 'winter-wonderland',
    name: 'Winter Wonderland',
    description: 'Magical snowy winter scene with elegant winter attire',
    previewImage: '/themes/fairytale-fantasy.jpg',
    referenceImage: '/previewImage/13.Winter Wonderland.jpg',
    themeImage: '/themeImage/13.Winter Wonderland.jpg',
    promptTemplate: `Transform this photo into magical winter wonderland portrait.

🚨 CRITICAL FACE PRESERVATION RULES (HIGHEST PRIORITY - NON-NEGOTIABLE):

1. COPY the face(s) from the captured image EXACTLY as-is - pixel-perfect preservation required
2. DO NOT modify, alter, enhance, smooth, or change ANY facial features whatsoever
3. Preserve EXACT: eyes, nose, mouth, chin, jawline, skin tone, skin texture, wrinkles, freckles, moles, facial hair
4. NO beautification, NO facial smoothing, NO AI enhancements
5. ONLY lighting may be adjusted to match the scene - facial structure stays 100% identical

⚠️ Any face modification = CRITICAL FAILURE - When in doubt, preserve perfectly

REQUIRED CHANGES:
- ALWAYS transform ALL clothing into elegant winter attire - this is MANDATORY
  * Elegant winter coat, formal winter wear, or winter wedding attire
  * Rich winter colors - whites, silvers, deep blues, burgundy
  * No exceptions - transform into sophisticated winter clothing
- Apply soft, cool winter lighting with snow glow
- Background MUST be transformed into snowy winter wonderland
- Magical, enchanting winter atmosphere

STYLE TO APPLY:
- Magical winter wonderland atmosphere with falling snow
- Soft, cool lighting with snow reflecting light
- Snowy landscape, frosted trees, winter magic
- Elegant, enchanting winter aesthetic
- Romantic winter celebration mood
- Keep the face as the central focus with crystal-clear detail

CRITICAL OUTPUT FORMAT:
- IGNORE the reference image's aspect ratio completely
- OUTPUT MUST BE: Portrait orientation 1080x1920 pixels (vertical/tall format)
- Do NOT create square images - output must be vertical portrait`,
  },
  {
    id: 'military-formal',
    name: 'Military Formal',
    description: 'Distinguished military formal attire with honor',
    previewImage: '/themes/black-white-elegance.jpg',
    referenceImage: '/previewImage/14.Military.jpg',
    themeImage: '/themeImage/14.Military.jpg',
    promptTemplate: `Transform this photo into distinguished military formal portrait.

🚨 CRITICAL FACE PRESERVATION RULES (HIGHEST PRIORITY - NON-NEGOTIABLE):

1. COPY the face(s) from the captured image EXACTLY as-is - pixel-perfect preservation required
2. DO NOT modify, alter, enhance, smooth, or change ANY facial features whatsoever
3. Preserve EXACT: eyes, nose, mouth, chin, jawline, skin tone, skin texture, wrinkles, freckles, moles, facial hair
4. NO beautification, NO facial smoothing, NO AI enhancements
5. ONLY lighting may be adjusted to match the scene - facial structure stays 100% identical

⚠️ Any face modification = CRITICAL FAILURE - When in doubt, preserve perfectly

REQUIRED CHANGES:
- ALWAYS transform ALL clothing into military dress uniform - this is MANDATORY
  * Formal military dress uniform with medals and insignia
  * Professional military bearing and formal attire
  * No exceptions - transform into military formal uniform
- Apply formal, dignified lighting
- Background MUST be formal military or ceremonial setting
- Distinguished, honorable military atmosphere

STYLE TO APPLY:
- Distinguished military formal atmosphere
- Formal, dignified lighting with sharp details
- Formal military background or ceremonial setting
- Professional, honorable composition
- Medals, insignia, formal military elements
- Keep the face as the central focus with perfect clarity

CRITICAL OUTPUT FORMAT:
- IGNORE the reference image's aspect ratio completely
- OUTPUT MUST BE: Portrait orientation 1080x1920 pixels (vertical/tall format)
- Do NOT create square images - output must be vertical portrait`,
  },
  {
    id: 'garden-wedding-classic',
    name: 'Classic Garden Wedding',
    description: 'Timeless garden wedding with natural beauty',
    previewImage: '/themes/classic-wedding.jpg',
    referenceImage: '/previewImage/15. Garden Wedding.jpg',
    themeImage: '/themeImage/15. Garden Wedding.jpg',
    promptTemplate: `Transform this photo into classic garden wedding portrait.

🚨 CRITICAL FACE PRESERVATION RULES (HIGHEST PRIORITY - NON-NEGOTIABLE):

1. COPY the face(s) from the captured image EXACTLY as-is - pixel-perfect preservation required
2. DO NOT modify, alter, enhance, smooth, or change ANY facial features whatsoever
3. Preserve EXACT: eyes, nose, mouth, chin, jawline, skin tone, skin texture, wrinkles, freckles, moles, facial hair
4. NO beautification, NO facial smoothing, NO AI enhancements
5. ONLY lighting may be adjusted to match the scene - facial structure stays 100% identical

⚠️ Any face modification = CRITICAL FAILURE - When in doubt, preserve perfectly

REQUIRED CHANGES:
- ALWAYS transform ALL clothing into classic garden wedding attire - this is MANDATORY
  * For women: elegant white wedding dress perfect for garden setting
  * For men: formal suit or tuxedo
  * No exceptions - transform into classic wedding attire
- Apply soft, natural garden lighting
- Background MUST be transformed into beautiful garden wedding venue
- Classic, timeless garden wedding atmosphere

STYLE TO APPLY:
- Classic garden wedding atmosphere with natural elegance
- Soft natural lighting with gentle shadows
- Beautiful garden setting with flowers and greenery
- Timeless, romantic aesthetic
- Professional wedding photography style
- Keep the face as the central focus with crystal-clear detail

CRITICAL OUTPUT FORMAT:
- IGNORE the reference image's aspect ratio completely
- OUTPUT MUST BE: Portrait orientation 1080x1920 pixels (vertical/tall format)
- Do NOT create square images - output must be vertical portrait`,
  },
  {
    id: 'hot-air-balloon',
    name: 'Hot Air Balloon Adventure',
    description: 'Whimsical hot air balloon field with colorful balloons',
    previewImage: '/themes/fairytale-fantasy.jpg',
    referenceImage: '/previewImage/16.Hot air balloon field.jpg',
    themeImage: '/themeImage/16.Hot air balloon field.jpg',
    promptTemplate: `Transform this photo into whimsical hot air balloon adventure portrait.

🚨 CRITICAL FACE PRESERVATION RULES (HIGHEST PRIORITY - NON-NEGOTIABLE):

1. COPY the face(s) from the captured image EXACTLY as-is - pixel-perfect preservation required
2. DO NOT modify, alter, enhance, smooth, or change ANY facial features whatsoever
3. Preserve EXACT: eyes, nose, mouth, chin, jawline, skin tone, skin texture, wrinkles, freckles, moles, facial hair
4. NO beautification, NO facial smoothing, NO AI enhancements
5. ONLY lighting may be adjusted to match the scene - facial structure stays 100% identical

⚠️ Any face modification = CRITICAL FAILURE - When in doubt, preserve perfectly

REQUIRED CHANGES:
- ALWAYS transform ALL clothing into adventure/travel elegant attire - this is MANDATORY
  * Stylish travel outfit, elegant casual adventure wear
  * Colorful, adventurous aesthetic
  * No exceptions - transform into adventure-ready elegant clothing
- Apply warm golden hour lighting
- Background MUST be transformed into hot air balloon field at sunrise/sunset
- Whimsical, adventurous, dreamy atmosphere

STYLE TO APPLY:
- Whimsical hot air balloon field atmosphere
- Golden hour lighting with warm, dreamy tones
- Multiple colorful hot air balloons in background
- Adventurous, romantic, dreamy aesthetic
- Sense of wonder and adventure
- Keep the face as the central focus with perfect clarity

CRITICAL OUTPUT FORMAT:
- IGNORE the reference image's aspect ratio completely
- OUTPUT MUST BE: Portrait orientation 1080x1920 pixels (vertical/tall format)
- Do NOT create square images - output must be vertical portrait`,
  },
  {
    id: 'jungle-cartoon',
    name: 'Jungle Cartoon Adventure',
    description: 'Playful cartoon jungle with vibrant colors',
    previewImage: '/themes/watercolor-art.jpg',
    referenceImage: '/previewImage/17. Jungle Cartoon.jpg',
    themeImage: '/themeImage/17. Jungle Cartoon.jpg',
    promptTemplate: `Transform this photo into playful cartoon jungle adventure portrait.

FACE GUIDELINES:
- Use the person(s) from the captured image as inspiration for the cartoon character(s)
- Transform into cartoon/animated art style with stylized features
- Maintain general resemblance while applying cartoon aesthetic
- FACE LIGHTING SHOULD BE ADJUSTED to match the surrounding environment and scene lighting

REQUIRED CHANGES:
- ALWAYS transform into cartoon/animated art style - this is MANDATORY
- Transform clothing into fun adventure/safari cartoon attire
- Apply vibrant cartoon colors and shading
- Background MUST be transformed into lush cartoon jungle
- Playful, adventurous cartoon aesthetic

STYLE TO APPLY:
- Playful cartoon jungle adventure atmosphere
- Vibrant, saturated colors typical of animation
- Lush jungle with cartoon animals, vines, tropical plants
- Fun, whimsical animated aesthetic
- Adventure and exploration mood
- Stylized cartoon interpretation of the person

CRITICAL OUTPUT FORMAT:
- IGNORE the reference image's aspect ratio completely
- OUTPUT MUST BE: Portrait orientation 1080x1920 pixels (vertical/tall format)
- Do NOT create square images - output must be vertical portrait`,
  },
  {
    id: 'sand-dunes-wedding',
    name: 'Desert Sand Dunes Wedding',
    description: 'Romantic desert wedding with golden sand dunes',
    previewImage: '/themes/beach-sunset.jpg',
    referenceImage: '/previewImage/18. Sand Dunes Wedding.jpg',
    themeImage: '/themeImage/18. Sand Dunes Wedding.jpg',
    promptTemplate: `Transform this photo into romantic desert sand dunes wedding portrait.

🚨 CRITICAL FACE PRESERVATION RULES (HIGHEST PRIORITY - NON-NEGOTIABLE):

1. COPY the face(s) from the captured image EXACTLY as-is - pixel-perfect preservation required
2. DO NOT modify, alter, enhance, smooth, or change ANY facial features whatsoever
3. Preserve EXACT: eyes, nose, mouth, chin, jawline, skin tone, skin texture, wrinkles, freckles, moles, facial hair
4. NO beautification, NO facial smoothing, NO AI enhancements
5. ONLY lighting may be adjusted to match the scene - facial structure stays 100% identical

⚠️ Any face modification = CRITICAL FAILURE - When in doubt, preserve perfectly

REQUIRED CHANGES:
- ALWAYS transform ALL clothing into elegant desert wedding attire - this is MANDATORY
  * For women: flowing white wedding dress perfect for desert setting
  * For men: light-colored suit appropriate for desert wedding
  * No exceptions - transform into elegant desert wedding attire
- Apply warm, golden desert lighting
- Background MUST be transformed into beautiful sand dunes at golden hour
- Romantic, adventurous desert wedding atmosphere

STYLE TO APPLY:
- Romantic desert wedding atmosphere with sand dunes
- Warm golden hour lighting with rich desert tones
- Beautiful sand dunes, endless desert landscape
- Elegant yet adventurous aesthetic
- Dramatic desert sunset or sunrise lighting
- Keep the face as the central focus with perfect clarity

CRITICAL OUTPUT FORMAT:
- IGNORE the reference image's aspect ratio completely
- OUTPUT MUST BE: Portrait orientation 1080x1920 pixels (vertical/tall format)
- Do NOT create square images - output must be vertical portrait`,
  },
  {
    id: 'singapore-coffee-shop',
    name: 'Singapore Coffee Shop',
    description: 'Nostalgic Singapore kopitiam with local charm',
    previewImage: '/themes/vintage-romance.jpg',
    referenceImage: '/previewImage/19. Singapore Coffee Shop.jpg',
    themeImage: '/themeImage/19. Singapore Coffee Shop.jpg',
    promptTemplate: `Transform this photo into nostalgic Singapore coffee shop portrait.

🚨 CRITICAL FACE PRESERVATION RULES (HIGHEST PRIORITY - NON-NEGOTIABLE):

1. COPY the face(s) from the captured image EXACTLY as-is - pixel-perfect preservation required
2. DO NOT modify, alter, enhance, smooth, or change ANY facial features whatsoever
3. Preserve EXACT: eyes, nose, mouth, chin, jawline, skin tone, skin texture, wrinkles, freckles, moles, facial hair
4. NO beautification, NO facial smoothing, NO AI enhancements
5. ONLY lighting may be adjusted to match the scene - facial structure stays 100% identical

⚠️ Any face modification = CRITICAL FAILURE - When in doubt, preserve perfectly

REQUIRED CHANGES:
- ALWAYS transform ALL clothing into casual Singapore local style - this is MANDATORY
  * Smart casual or traditional Singaporean attire
  * Comfortable, local aesthetic
  * No exceptions - transform into appropriate local casual clothing
- Apply warm, nostalgic lighting typical of local kopitiams
- Background MUST be transformed into authentic Singapore coffee shop setting
- Nostalgic, local, warm atmosphere

STYLE TO APPLY:
- Nostalgic Singapore kopitiam (coffee shop) atmosphere
- Warm, inviting lighting with vintage feel
- Traditional coffee shop furniture, marble tables, wooden chairs
- Local cultural elements, authentic Singaporean aesthetic
- Warm, community atmosphere
- Keep the face as the central focus with crystal-clear detail

CRITICAL OUTPUT FORMAT:
- IGNORE the reference image's aspect ratio completely
- OUTPUT MUST BE: Portrait orientation 1080x1920 pixels (vertical/tall format)
- Do NOT create square images - output must be vertical portrait`,
  },
  {
    id: 'ski-resort',
    name: 'Ski Resort Winter',
    description: 'Snowy ski resort with winter sports elegance',
    previewImage: '/themes/fairytale-fantasy.jpg',
    referenceImage: '/previewImage/20.Ski Resort.jpg',
    themeImage: '/themeImage/20.Ski Resort.jpg',
    promptTemplate: `Transform this photo into elegant ski resort winter portrait.

🚨 CRITICAL FACE PRESERVATION RULES (HIGHEST PRIORITY - NON-NEGOTIABLE):

1. COPY the face(s) from the captured image EXACTLY as-is - pixel-perfect preservation required
2. DO NOT modify, alter, enhance, smooth, or change ANY facial features whatsoever
3. Preserve EXACT: eyes, nose, mouth, chin, jawline, skin tone, skin texture, wrinkles, freckles, moles, facial hair
4. NO beautification, NO facial smoothing, NO AI enhancements
5. ONLY lighting may be adjusted to match the scene - facial structure stays 100% identical

⚠️ Any face modification = CRITICAL FAILURE - When in doubt, preserve perfectly

REQUIRED CHANGES:
- ALWAYS transform ALL clothing into stylish ski resort attire - this is MANDATORY
  * Fashionable ski jacket, winter sports elegant wear
  * Stylish winter colors and patterns
  * No exceptions - transform into chic ski resort clothing
- Apply bright, crisp winter mountain lighting
- Background MUST be transformed into luxury ski resort setting
- Elegant, sporty winter atmosphere

STYLE TO APPLY:
- Elegant ski resort atmosphere with snowy mountains
- Bright, crisp winter lighting with blue skies
- Snowy slopes, ski lifts, mountain lodge background
- Fashionable, sporty winter aesthetic
- Luxury winter vacation mood
- Keep the face as the central focus with perfect clarity

CRITICAL OUTPUT FORMAT:
- IGNORE the reference image's aspect ratio completely
- OUTPUT MUST BE: Portrait orientation 1080x1920 pixels (vertical/tall format)
- Do NOT create square images - output must be vertical portrait`,
  },
  {
    id: 'tropical-beach-wedding',
    name: 'Tropical Beach Wedding',
    description: 'Paradise tropical beach wedding with palm trees',
    previewImage: '/themes/beach-sunset.jpg',
    referenceImage: '/previewImage/21. Tropical beach wedding.jpg',
    themeImage: '/themeImage/21. Tropical beach wedding.jpg',
    promptTemplate: `Transform this photo into paradise tropical beach wedding portrait.

🚨 CRITICAL FACE PRESERVATION RULES (HIGHEST PRIORITY - NON-NEGOTIABLE):

1. COPY the face(s) from the captured image EXACTLY as-is - pixel-perfect preservation required
2. DO NOT modify, alter, enhance, smooth, or change ANY facial features whatsoever
3. Preserve EXACT: eyes, nose, mouth, chin, jawline, skin tone, skin texture, wrinkles, freckles, moles, facial hair
4. NO beautification, NO facial smoothing, NO AI enhancements
5. ONLY lighting may be adjusted to match the scene - facial structure stays 100% identical

⚠️ Any face modification = CRITICAL FAILURE - When in doubt, preserve perfectly

REQUIRED CHANGES:
- ALWAYS transform ALL clothing into tropical beach wedding attire - this is MANDATORY
  * For women: light, flowing tropical wedding dress with island flair
  * For men: light suit or formal tropical beach attire
  * No exceptions - transform into tropical wedding attire
- Apply warm tropical lighting with turquoise water tones
- Background MUST be transformed into tropical paradise beach with palm trees
- Romantic, paradise tropical wedding atmosphere

STYLE TO APPLY:
- Paradise tropical beach wedding atmosphere
- Warm, vibrant tropical lighting
- Turquoise ocean water, white sand, palm trees
- Tropical flowers, island paradise aesthetic
- Romantic, relaxed tropical celebration mood
- Keep the face as the central focus with crystal-clear detail

CRITICAL OUTPUT FORMAT:
- IGNORE the reference image's aspect ratio completely
- OUTPUT MUST BE: Portrait orientation 1080x1920 pixels (vertical/tall format)
- Do NOT create square images - output must be vertical portrait`,
  },
];

export const getThemeById = (id: string): Theme | undefined => {
  return themes.find((theme) => theme.id === id);
};
