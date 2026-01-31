const express = require("express");
const router = express.Router();

const {
    getAIRecommendation,
    getAITextRecommendation
} = require("../controllers/aiController");

router.post("/recommend", getAIRecommendation);
router.post('/recommend-text', (req, res) => {
    const text = req.body.text.toLowerCase();

    // ============ SMART SENTENCE DETECTION ============
    // Detect full phrases and questions
    const isQuestion = text.match(/what|how|which|suggest|recommend|ماذا|كيف|ايش|شو|اقترح/);
    const isGoingTo = text.match(/going to|attending|have a|i have|going for|عندي|رايح|بروح|ذاهب/);

    // ============ SEASON DETECTION ============
    let season = null;

    // Temperature-based detection
    const tempMatch = text.match(/(\d+)\s*(degree|درجة|c|f)/);
    if (tempMatch) {
        const temp = parseInt(tempMatch[1]);
        if (temp <= 10) season = "winter";
        else if (temp <= 20) season = "autumn";
        else if (temp <= 25) season = "spring";
        else season = "summer";
    }

    // Weather-based detection
    if (!season) {
        if (text.match(/rainy|rain|مطر|ممطر/)) season = "autumn";
        else if (text.match(/snowy|snow|ثلج|ثلجي/)) season = "winter";
        else if (text.match(/sunny|sun|مشمس|شمس/)) season = "summer";
        else if (text.match(/windy|wind|هواء|رياح/)) season = "autumn";
    }

    // Keyword-based detection
    if (!season) {
        if (text.match(/winter|cold|freezing|december|january|february|شتاء|برد|بارد|ثلج|ديسمبر|يناير|فبراير|كانون|شباط/)) {
            season = "winter";
        }
        else if (text.match(/summer|hot|sunny|beach|june|july|august|vacation|صيف|حر|حار|بحر|يونيو|يوليو|اغسطس|اجازة|تموز|اب/)) {
            season = "summer";
        }
        else if (text.match(/spring|mild|flowers|march|april|may|ربيع|زهور|مارس|ابريل|مايو|اذار|نيسان|ايار/)) {
            season = "spring";
        }
        else if (text.match(/autumn|fall|leaves|september|october|november|خريف|اوراق|سبتمبر|اكتوبر|نوفمبر|ايلول|تشرين/)) {
            season = "autumn";
        }
        else {
            season = "summer";
        }
    }

    // ============ GENDER DETECTION ============
    let gender = null;

    // Context-based detection
    if (text.match(/my wife|my girlfriend|my sister|my mother|my daughter|زوجتي|حبيبتي|اختي|امي|بنتي/)) {
        gender = "woman";
    }
    else if (text.match(/my husband|my boyfriend|my brother|my father|my son|زوجي|حبيبي|اخي|ابي|ابني/)) {
        gender = "man";
    }
    // Direct keywords
    else if (text.match(/woman|female|girl|lady|she|her|wife|girlfriend|sister|mother|women|girls|i'm a woman|i am a woman|امرأة|بنت|انثى|نساء|بنات|زوجة|حبيبة|اخت|ام|سيدة|هي|انا بنت|أنا امرأة/)) {
        gender = "woman";
    }
    else if (text.match(/man|male|boy|guy|he|him|husband|boyfriend|brother|father|men|boys|i'm a man|i am a man|رجل|ولد|ذكر|رجال|شاب|زوج|حبيب|اخ|اب|شباب|هو|انا رجل|انا شب/)) {
        gender = "man";
    }
    else {
        gender = "man";
    }

    // ============ AGE GROUP DETECTION ============
    let ageGroup = "adult";

    if (text.match(/teen|teenager|young|youth|school|college|university|مراهق|شاب|صغير|مدرسة|جامعة|طالب/)) {
        ageGroup = "young";
    }
    else if (text.match(/mature|older|senior|professional|executive|كبير|ناضج|مدير|تنفيذي/)) {
        ageGroup = "mature";
    }

    // ============ BUDGET DETECTION ============
    let budget = "medium";

    if (text.match(/cheap|budget|affordable|inexpensive|رخيص|اقتصادي|موفر|ميزانية/)) {
        budget = "low";
    }
    else if (text.match(/luxury|expensive|premium|designer|high.end|brand|فاخر|غالي|ماركة|براند|مصمم/)) {
        budget = "high";
    }

    // ============ TIME OF DAY DETECTION ============
    let timeOfDay = "day";

    if (text.match(/morning|breakfast|صباح|فطور/)) {
        timeOfDay = "morning";
    }
    else if (text.match(/evening|dinner|sunset|مساء|عشاء|غروب/)) {
        timeOfDay = "evening";
    }
    else if (text.match(/night|midnight|late|ليل|ليلة|متأخر/)) {
        timeOfDay = "night";
    }
    else if (text.match(/afternoon|lunch|ظهر|غداء/)) {
        timeOfDay = "afternoon";
    }

    // ============ OCCASION DETECTION ============
    let occasion = null;

    // Specific events
    if (text.match(/first date|موعد اول|اول موعد/)) {
        occasion = "firstdate";
    }
    else if (text.match(/job interview|مقابلة عمل|مقابلة وظيفة/)) {
        occasion = "interview";
    }
    else if (text.match(/graduation|تخرج/)) {
        occasion = "graduation";
    }
    else if (text.match(/wedding|عرس|زفاف|فرح/)) {
        occasion = "wedding";
    }
    else if (text.match(/funeral|عزاء|جنازة/)) {
        occasion = "funeral";
    }
    else if (text.match(/picnic|نزهة|بيكنيك/)) {
        occasion = "picnic";
    }
    else if (text.match(/concert|حفلة موسيقية|كونسرت/)) {
        occasion = "concert";
    }
    // General occasions
    else if (text.match(/date|romantic|dinner|anniversary|valentine|love|موعد|رومانسي|عشاء|ذكرى|فالنتاين|حب|غرامي/)) {
        occasion = "romantic";
    }
    else if (text.match(/sport|gym|workout|exercise|running|fitness|athletic|training|yoga|hiking|رياضة|جيم|تمرين|جري|لياقة|يوغا|مشي|تدريب/)) {
        occasion = "sporty";
    }
    else if (text.match(/formal|work|office|meeting|business|presentation|professional|conference|رسمي|عمل|مكتب|اجتماع|عرض|مهني|مؤتمر/)) {
        occasion = "formal";
    }
    else if (text.match(/party|event|celebration|birthday|club|night out|prom|gala|حفلة|مناسبة|عيد ميلاد|نادي|سهرة|حفل/)) {
        occasion = "party";
    }
    else if (text.match(/travel|trip|vacation|airport|flight|tourist|سفر|رحلة|اجازة|مطار|طيران|سياحة/)) {
        occasion = "travel";
    }
    else if (text.match(/beach|pool|swimming|sea|ocean|بحر|مسبح|سباحة|شاطئ/)) {
        occasion = "beach";
    }
    else if (text.match(/casual|everyday|relax|home|shopping|mall|coffee|friends|hangout|عادي|يومي|استرخاء|بيت|تسوق|مول|قهوة|اصدقاء|خروجة/)) {
        occasion = "casual";
    }
    else {
        occasion = "casual";
    }

    // ============ STYLE PREFERENCE DETECTION ============
    let style = "classic";

    if (text.match(/elegant|classy|sophisticated|luxury|chic|glamorous|اناقة|انيق|فاخر|راقي|شيك|جلامور/)) {
        style = "elegant";
    }
    else if (text.match(/modern|trendy|fashionable|stylish|cool|hip|عصري|موضة|ستايل|كول|ترندي/)) {
        style = "modern";
    }
    else if (text.match(/simple|minimal|basic|comfortable|cozy|relaxed|بسيط|مريح|عملي|بيسك/)) {
        style = "simple";
    }
    else if (text.match(/bold|colorful|unique|creative|statement|edgy|جريء|ملون|مميز|ابداعي|مختلف/)) {
        style = "bold";
    }
    else if (text.match(/vintage|retro|classic|traditional|old school|كلاسيك|تقليدي|قديم|ريترو/)) {
        style = "vintage";
    }
    else if (text.match(/streetwear|street|urban|casual cool|ستريت|شارع|اوربان/)) {
        style = "streetwear";
    }

    // ============ COLOR PREFERENCE DETECTION ============
    let detectedColor = null;

    if (text.match(/black|اسود|أسود/)) detectedColor = "black";
    else if (text.match(/white|ابيض|أبيض/)) detectedColor = "white";
    else if (text.match(/blue|navy|ازرق|أزرق|كحلي/)) detectedColor = "blue";
    else if (text.match(/red|احمر|أحمر/)) detectedColor = "red";
    else if (text.match(/green|اخضر|أخضر/)) detectedColor = "green";
    else if (text.match(/pink|وردي|زهري/)) detectedColor = "pink";
    else if (text.match(/yellow|اصفر|أصفر/)) detectedColor = "yellow";
    else if (text.match(/purple|violet|بنفسجي|موف/)) detectedColor = "purple";
    else if (text.match(/orange|برتقالي/)) detectedColor = "orange";
    else if (text.match(/brown|بني/)) detectedColor = "brown";
    else if (text.match(/grey|gray|رمادي/)) detectedColor = "grey";
    else if (text.match(/beige|nude|بيج|نود/)) detectedColor = "beige";
    else if (text.match(/neutral|محايد|نيوترال/)) detectedColor = "neutral";
    else if (text.match(/pastel|باستيل/)) detectedColor = "pastel";
    else if (text.match(/dark|غامق|داكن/)) detectedColor = "dark";
    else if (text.match(/light|bright|فاتح|فاقع/)) detectedColor = "light";

    // ============ EXTENDED RECOMMENDATIONS ============
    const recommendations = {
        winter: {
            man: {
                casual: [
                    "a warm hoodie layered under a puffer jacket, dark jeans, and comfortable boots with a beanie",
                    "a chunky knit sweater, corduroy pants, leather boots, and a wool scarf",
                    "a sherpa-lined denim jacket, thermal henley, dark jeans, and suede boots"
                ],
                formal: [
                    "a wool overcoat, tailored charcoal suit, crisp white shirt, silk tie, and polished oxford shoes",
                    "a cashmere topcoat, navy suit, light blue shirt, burgundy tie, and monk strap shoes",
                    "a camel coat, grey three-piece suit, white pocket square, and cap-toe oxfords"
                ],
                romantic: [
                    "a stylish peacoat, cashmere turtleneck, slim dress pants, and leather chelsea boots",
                    "a fitted wool blazer, merino sweater, dark chinos, and suede desert boots",
                    "a shearling jacket, fitted roll-neck, tailored trousers, and polished boots"
                ],
                sporty: [
                    "a thermal tracksuit, insulated running shoes, and a windbreaker with reflective details",
                    "a tech fleece hoodie, moisture-wicking joggers, and trail running shoes",
                    "a quilted running jacket, compression tights, and cushioned sneakers"
                ],
                party: [
                    "a velvet blazer, black satin shirt, tailored dress pants, and patent leather shoes",
                    "a brocade dinner jacket, black turtleneck, slim trousers, and velvet loafers",
                    "a textured sport coat, silk shirt, black jeans, and chelsea boots"
                ],
                travel: [
                    "a warm parka, comfortable sweater, stretch jeans, and waterproof boots",
                    "a quilted travel jacket, merino base layer, comfortable chinos, and slip-on boots",
                    "a packable down jacket, thermal shirt, travel pants, and walking shoes"
                ],
                beach: [
                    "a thick hoodie, board shorts over thermals, and waterproof sandals for a winter beach walk",
                    "a fleece pullover, joggers, and insulated slip-ons",
                    "a windbreaker, comfortable pants, and weatherproof sneakers"
                ],
                interview: [
                    "a classic navy suit, white dress shirt, conservative tie, polished oxfords, and a wool overcoat",
                    "a charcoal suit, light blue shirt, subtle tie, and cap-toe shoes with a professional briefcase"
                ],
                wedding: [
                    "a dark three-piece suit, white shirt, elegant tie, pocket square, and polished dress shoes",
                    "a black tuxedo with satin lapels, bow tie, and patent leather shoes"
                ],
                graduation: [
                    "a navy blazer, grey trousers, light shirt, and leather loafers",
                    "a smart suit, celebratory tie, and polished shoes"
                ],
                funeral: [
                    "a black suit, white shirt, black tie, and polished black shoes",
                    "dark formal attire with minimal accessories"
                ],
                firstdate: [
                    "a stylish leather jacket, fitted sweater, dark jeans, and clean boots",
                    "a smart casual blazer, quality t-shirt, well-fitted chinos, and stylish sneakers"
                ],
                picnic: [
                    "a comfortable sweater, casual jacket, jeans, and sturdy walking shoes",
                    "layered casual wear with a warm vest and comfortable boots"
                ],
                concert: [
                    "a cool leather jacket, band tee, black jeans, and boots",
                    "a stylish bomber jacket, graphic shirt, and comfortable sneakers"
                ]
            },
            woman: {
                casual: [
                    "a cozy oversized knit sweater, high-waisted leggings, ankle boots, and a chunky scarf",
                    "a teddy coat, fitted turtleneck, mom jeans, and platform boots",
                    "a long cardigan, basic tee, skinny jeans, and chelsea boots"
                ],
                formal: [
                    "a tailored wool coat, silk blouse, pencil skirt, sheer tights, and heeled ankle boots",
                    "a structured blazer dress, statement belt, opaque tights, and pointed-toe pumps",
                    "a cashmere sweater, wide-leg trousers, elegant heels, and a structured bag"
                ],
                romantic: [
                    "an elegant knitted midi dress, statement belt, knee-high suede boots, and delicate gold jewelry",
                    "a velvet wrap top, satin midi skirt, strappy heels, and drop earrings",
                    "a fitted turtleneck dress, statement coat, and elegant ankle boots"
                ],
                sporty: [
                    "thermal leggings, a fleece-lined jacket, insulated sneakers, and a sporty headband",
                    "a tech fleece set, cushioned running shoes, and a warm beanie",
                    "quilted running vest, moisture-wicking layers, and trail shoes"
                ],
                party: [
                    "a sequined top, leather pants, stiletto heels, and a faux fur cropped jacket",
                    "a velvet mini dress, statement jewelry, ankle boots, and a clutch",
                    "a sparkly jumpsuit, strappy heels, and a faux fur stole"
                ],
                travel: [
                    "a long puffer coat, cashmere sweater, comfortable jeans, and warm slip-on boots",
                    "a stylish trench coat, cozy layers, leggings, and comfortable sneakers",
                    "a wool wrap coat, soft sweater, travel pants, and walking boots"
                ],
                beach: [
                    "a cozy cardigan, warm leggings, boots, and a stylish beanie for a winter seaside stroll",
                    "an oversized sweater, comfortable pants, and weatherproof boots",
                    "a fleece jacket, warm pants, and insulated walking shoes"
                ],
                interview: [
                    "a tailored blazer, silk blouse, pencil skirt, nude pumps, and a structured bag",
                    "a professional sheath dress, cardigan, modest heels, and pearl earrings"
                ],
                wedding: [
                    "an elegant midi dress, faux fur wrap, statement heels, and delicate jewelry",
                    "a sophisticated gown, evening clutch, and elegant jewelry"
                ],
                graduation: [
                    "a chic dress, smart blazer, comfortable heels, and celebratory accessories",
                    "a stylish skirt suit, silk blouse, and elegant pumps"
                ],
                funeral: [
                    "a black dress, dark coat, modest heels, and minimal jewelry",
                    "dark tailored separates with conservative accessories"
                ],
                firstdate: [
                    "a flattering wrap dress, ankle boots, delicate jewelry, and a stylish coat",
                    "a cozy sweater, fitted jeans, heeled boots, and pretty earrings"
                ],
                picnic: [
                    "a warm sweater, comfortable jeans, boots, and a cute beanie",
                    "layered casual pieces with a cozy scarf and walking boots"
                ],
                concert: [
                    "a cool leather jacket, graphic tee, black jeans, and combat boots",
                    "an edgy outfit with a band shirt, leather pants, and boots"
                ]
            }
        },
        summer: {
            man: {
                casual: [
                    "a breathable linen t-shirt, tailored chino shorts, canvas sneakers, and stylish sunglasses",
                    "a cotton polo, linen shorts, espadrilles, and a casual watch",
                    "a relaxed fit camp collar shirt, light chinos, and white sneakers"
                ],
                formal: [
                    "a lightweight linen blazer, cotton dress shirt (no tie), tailored trousers, and leather loafers",
                    "a seersucker suit, light shirt, no tie, and suede loafers",
                    "a cotton blazer, linen pants, oxford shirt, and driving shoes"
                ],
                romantic: [
                    "a fitted cotton polo in a soft color, slim chinos, clean white sneakers, and a nice watch",
                    "a linen button-up (slightly unbuttoned), tailored shorts, and leather sandals",
                    "a fitted henley, well-fitted chinos, and clean canvas shoes"
                ],
                sporty: [
                    "moisture-wicking athletic shorts, a breathable tank top, running shoes, and a sports cap",
                    "performance shorts, a dry-fit polo, and lightweight trainers",
                    "quick-dry shorts, a tech tee, and cushioned running shoes"
                ],
                party: [
                    "a vibrant floral short-sleeve shirt, white linen pants, leather sandals, and a beaded bracelet",
                    "a printed silk shirt, tailored shorts, and stylish loafers",
                    "a bold patterned shirt, light chinos, and suede shoes"
                ],
                travel: [
                    "a comfortable cotton t-shirt, cargo shorts, walking sandals, and a lightweight backpack",
                    "a linen blend shirt, travel shorts, comfortable sneakers, and a crossbody bag",
                    "a quick-dry polo, versatile shorts, and walking shoes"
                ],
                beach: [
                    "quick-dry swim trunks, a linen shirt (unbuttoned), flip-flops, and polarized sunglasses",
                    "colorful board shorts, a tank top, and comfortable sandals",
                    "patterned swim shorts, a light cover-up, and beach slides"
                ],
                interview: [
                    "a lightweight suit in light grey or navy, no tie, breathable shirt, and leather loafers",
                    "a cotton blazer, dress shirt, light trousers, and comfortable oxfords"
                ],
                wedding: [
                    "a light linen suit, white shirt, pocket square, and leather loafers",
                    "a summer blazer, linen pants, dress shirt, and elegant shoes"
                ],
                graduation: [
                    "a smart blazer, light shirt, dress pants, and clean loafers",
                    "a cotton suit, casual shirt, and leather shoes"
                ],
                funeral: [
                    "a dark lightweight suit, white shirt, black tie, and black shoes",
                    "dark formal attire appropriate for warm weather"
                ],
                firstdate: [
                    "a well-fitted polo, tailored chinos, clean sneakers, and a nice watch",
                    "a casual button-up, shorts, and stylish sandals"
                ],
                picnic: [
                    "a casual tee, comfortable shorts, sneakers, and a cap",
                    "a linen shirt, relaxed pants, and comfortable shoes"
                ],
                concert: [
                    "a cool graphic tee, denim shorts, comfortable sneakers, and sunglasses",
                    "a band shirt, light pants, and festival-ready shoes"
                ]
            },
            woman: {
                casual: [
                    "a flowy floral sundress, comfortable sandals, a straw tote bag, and oversized sunglasses",
                    "a linen blouse, high-waisted shorts, espadrilles, and a sun hat",
                    "a casual maxi dress, flat sandals, and layered necklaces"
                ],
                formal: [
                    "an elegant midi dress in a light fabric, structured blazer, nude heels, and pearl earrings",
                    "a silk blouse, wide-leg linen pants, heeled sandals, and elegant jewelry",
                    "a sophisticated sheath dress, light cardigan, and classic pumps"
                ],
                romantic: [
                    "a flowing maxi dress with a thigh slit, strappy heeled sandals, and delicate layered necklaces",
                    "a wrap dress in a soft print, wedge sandals, and dainty jewelry",
                    "an off-shoulder midi dress, heeled sandals, and flower earrings"
                ],
                sporty: [
                    "high-waisted athletic shorts, a supportive sports bra, breathable sneakers, and a visor",
                    "a matching workout set, lightweight trainers, and a sporty ponytail",
                    "performance leggings, a crop top, and cushioned running shoes"
                ],
                party: [
                    "a vibrant cocktail dress, statement earrings, strappy heeled sandals, and a clutch purse",
                    "a sequined mini dress, platform heels, and bold accessories",
                    "a colorful jumpsuit, statement jewelry, and strappy heels"
                ],
                travel: [
                    "a comfortable romper, flat sandals, a crossbody bag, and a wide-brim sun hat",
                    "a maxi skirt, simple tank, comfortable sandals, and a tote bag",
                    "linen pants, a breezy blouse, and walking sandals"
                ],
                beach: [
                    "a stylish bikini, sheer cover-up, beach sandals, and a large straw hat",
                    "a one-piece swimsuit, flowy sarong, and flip-flops",
                    "a trendy swimsuit, beach dress, and cute sandals"
                ],
                interview: [
                    "a light blazer, silk blouse, tailored pants, closed-toe heels, and minimal jewelry",
                    "a professional dress, light cardigan, and elegant pumps"
                ],
                wedding: [
                    "an elegant midi dress, strappy heels, delicate jewelry, and a small clutch",
                    "a flowing maxi dress, wedge sandals, and statement earrings"
                ],
                graduation: [
                    "a chic sundress, comfortable heels, and celebratory jewelry",
                    "a smart skirt and blouse, elegant sandals, and fun accessories"
                ],
                funeral: [
                    "a modest dark dress, closed-toe shoes, and minimal jewelry",
                    "dark tailored separates and conservative accessories"
                ],
                firstdate: [
                    "a flattering sundress, cute sandals, and pretty jewelry",
                    "a nice blouse, fitted jeans, wedges, and delicate earrings"
                ],
                picnic: [
                    "a casual dress, comfortable sandals, and a cute hat",
                    "a pretty top, shorts, sneakers, and a crossbody bag"
                ],
                concert: [
                    "a fun crop top, denim shorts, comfortable boots, and statement accessories",
                    "a band tee, skirt, and festival-ready sandals"
                ]
            }
        },
        spring: {
            man: {
                casual: [
                    "a light denim jacket over a graphic tee, fitted jeans, and classic canvas sneakers",
                    "a casual bomber jacket, striped tee, chinos, and white sneakers",
                    "a light cardigan, basic tee, slim jeans, and suede shoes"
                ],
                formal: [
                    "a navy blazer, pastel dress shirt, tailored chinos, and suede derby shoes",
                    "a light grey suit, white shirt, knit tie, and brown brogues",
                    "a cotton sport coat, dress shirt, tailored pants, and loafers"
                ],
                romantic: [
                    "a soft chambray shirt, well-fitted dark jeans, suede desert boots, and a leather watch",
                    "a fitted blazer, henley shirt, chinos, and clean white sneakers",
                    "a casual button-up in a soft color, tailored pants, and suede shoes"
                ],
                sporty: [
                    "a lightweight zip-up hoodie, jogger pants, cushioned running shoes, and a baseball cap",
                    "a track jacket, athletic pants, and performance sneakers",
                    "a windbreaker, shorts, and running shoes"
                ],
                party: [
                    "a smart casual blazer, patterned shirt, dark slim jeans, and polished loafers",
                    "a velvet blazer, band tee, black jeans, and boots",
                    "a printed shirt, tailored chinos, and stylish shoes"
                ],
                travel: [
                    "a versatile field jacket, comfortable henley, stretch jeans, and walking sneakers",
                    "a light rain jacket, comfortable layers, travel pants, and walking shoes",
                    "a casual blazer, tee, jeans, and comfortable sneakers"
                ],
                beach: [
                    "colorful swim shorts, a light cotton shirt, boat shoes, and a casual bracelet",
                    "patterned trunks, a linen shirt, and sandals",
                    "swim shorts, a tank top, and flip-flops"
                ],
                interview: ["a light suit, crisp shirt, subtle tie, and polished shoes", "a blazer, dress shirt, trousers, and oxford shoes"],
                wedding: ["a spring suit in light colors, pocket square, and elegant loafers", "a linen blend suit, pastel shirt, and dress shoes"],
                graduation: ["a smart blazer, light shirt, chinos, and clean shoes", "a casual suit, no tie, and loafers"],
                funeral: ["a dark suit, white shirt, black tie, and polished shoes", "dark formal attire with conservative accessories"],
                firstdate: ["a casual blazer, fitted tee, jeans, and clean sneakers", "a nice button-up, chinos, and stylish shoes"],
                picnic: ["a comfortable button-up, shorts, and sneakers", "a polo, casual pants, and walking shoes"],
                concert: ["a cool jacket, graphic tee, jeans, and boots", "a casual look with a band shirt and comfortable shoes"]
            },
            woman: {
                casual: [
                    "a cropped denim jacket, floral midi skirt, a simple tee, and white platform sneakers",
                    "a light trench coat, striped shirt, jeans, and ankle boots",
                    "a pastel cardigan, white tee, mom jeans, and ballet flats"
                ],
                formal: [
                    "a classic trench coat, silk blouse, tailored wide-leg pants, and pointed-toe pumps",
                    "a structured blazer, satin blouse, pencil skirt, and heels",
                    "a sheath dress, light cardigan, and elegant pumps"
                ],
                romantic: [
                    "a pastel wrap dress, delicate cardigan, nude ballet flats, and flower-shaped earrings",
                    "a floral midi dress, strappy sandals, and dainty jewelry",
                    "a soft blouse, flowy skirt, and pretty heels"
                ],
                sporty: [
                    "colorful leggings, a cropped hoodie, trendy chunky sneakers, and a high ponytail",
                    "a matching workout set, light jacket, and stylish sneakers",
                    "joggers, a fitted tank, and running shoes"
                ],
                party: [
                    "an off-shoulder ruffled dress, statement necklace, strappy heels, and a sparkly clutch",
                    "a sequined top, leather pants, and heeled boots",
                    "a bold mini dress, statement earrings, and platforms"
                ],
                travel: [
                    "a lightweight bomber jacket, comfortable jumpsuit, slip-on sneakers, and a backpack purse",
                    "a versatile dress, denim jacket, and comfortable flats",
                    "leggings, a long cardigan, and walking shoes"
                ],
                beach: [
                    "a cute one-piece swimsuit, flowy beach pants, sandals, and layered anklets",
                    "a bikini, kimono cover-up, and slides",
                    "a swimsuit, maxi skirt, and beach sandals"
                ],
                interview: ["a tailored blazer, blouse, trousers, and pumps", "a professional dress, cardigan, and modest heels"],
                wedding: ["a floral midi dress, heeled sandals, and elegant jewelry", "a pastel gown, clutch, and statement earrings"],
                graduation: ["a chic dress, light blazer, and comfortable heels", "a stylish outfit with celebratory accessories"],
                funeral: ["a dark modest dress, cardigan, and low heels", "dark separates with minimal jewelry"],
                firstdate: ["a pretty dress, cute flats, and delicate jewelry", "a nice top, jeans, and heeled boots"],
                picnic: ["a casual dress, sneakers, and a cute bag", "a blouse, shorts, and comfortable sandals"],
                concert: ["a fun top, jeans, and comfortable boots", "a stylish casual outfit with statement accessories"]
            }
        },
        autumn: {
            man: {
                casual: [
                    "a cozy flannel shirt, dark wash jeans, leather boots, and a canvas jacket",
                    "a denim jacket, hoodie, chinos, and suede sneakers",
                    "a chunky knit sweater, corduroy pants, and boots"
                ],
                formal: [
                    "a tweed sport coat, merino wool sweater, dress trousers, and brogue boots",
                    "a herringbone blazer, turtleneck, tailored pants, and oxford shoes",
                    "a wool suit, knit tie, and polished boots"
                ],
                romantic: [
                    "a fitted leather jacket, henley shirt, slim black jeans, and sleek chelsea boots",
                    "a smart blazer, soft sweater, dark jeans, and suede boots",
                    "a peacoat, roll-neck, chinos, and leather shoes"
                ],
                sporty: [
                    "a performance windbreaker, moisture-wicking joggers, trail running shoes, and a beanie",
                    "a tech fleece set, running shoes, and a cap",
                    "a quilted vest, athletic pants, and trainers"
                ],
                party: [
                    "a burgundy velvet shirt, black tailored pants, dress boots, and a statement belt",
                    "a textured blazer, dark shirt, slim jeans, and chelsea boots",
                    "a brocade jacket, black tee, dress pants, and loafers"
                ],
                travel: [
                    "a versatile quilted jacket, comfortable sweater, durable jeans, and hiking boots",
                    "a waxed jacket, layers, travel pants, and walking shoes",
                    "a field coat, henley, jeans, and boots"
                ],
                beach: [
                    "a light sweater, rolled-up chinos, slip-on sneakers for a cool autumn beach walk",
                    "a casual jacket, comfortable pants, and walking shoes",
                    "layers with a windbreaker and sturdy shoes"
                ],
                interview: ["a wool suit, dress shirt, tie, and polished oxfords", "a tweed blazer, trousers, and brogues"],
                wedding: ["a three-piece suit in autumn colors, elegant tie, and polished shoes", "a dark suit with seasonal accents"],
                graduation: ["a smart blazer, dress shirt, trousers, and clean shoes", "a suit with celebratory accessories"],
                funeral: ["a black suit, white shirt, black tie, and black shoes", "dark formal attire"],
                firstdate: ["a leather jacket, nice sweater, jeans, and boots", "a casual blazer, fitted tee, and chinos"],
                picnic: ["a casual jacket, comfortable layers, jeans, and boots", "a sweater, chinos, and walking shoes"],
                concert: ["a leather jacket, band tee, black jeans, and boots", "an edgy look with comfortable shoes"]
            },
            woman: {
                casual: [
                    "an oversized chunky cardigan, skinny jeans, ankle booties, and a cozy infinity scarf",
                    "a leather jacket, striped tee, mom jeans, and boots",
                    "a long coat, turtleneck, leggings, and chelsea boots"
                ],
                formal: [
                    "a structured wool blazer, turtleneck, high-waisted trousers, and pointed-toe loafers",
                    "a tailored coat, silk blouse, pencil skirt, and heeled boots",
                    "a blazer dress, tights, and ankle boots"
                ],
                romantic: [
                    "a fitted sweater dress, patterned tights, knee-high suede boots, and vintage jewelry",
                    "a velvet top, midi skirt, ankle boots, and delicate earrings",
                    "a wrap dress, cardigan, and heeled boots"
                ],
                sporty: [
                    "a quilted puffer vest, thermal leggings, trail shoes, and a fleece headband",
                    "a tech fleece hoodie, joggers, and running shoes",
                    "a windbreaker, athletic leggings, and trainers"
                ],
                party: [
                    "a rich velvet midi dress, statement gold jewelry, heeled ankle boots, and a clutch",
                    "a sequined top, leather pants, and stilettos",
                    "a bold mini dress, statement jewelry, and boots"
                ],
                travel: [
                    "a long waterproof trench, comfortable layers, stretch pants, and cushioned walking shoes",
                    "a versatile jacket, cozy sweater, jeans, and ankle boots",
                    "a stylish coat, layers, and comfortable footwear"
                ],
                beach: [
                    "a cozy sweater, flowy maxi skirt, ankle boots, and a light scarf for a breezy beach day",
                    "layered casual wear with a warm jacket and boots",
                    "a cardigan, comfortable pants, and walking shoes"
                ],
                interview: ["a tailored blazer, blouse, trousers, and pumps", "a professional dress, structured coat, and heels"],
                wedding: ["an elegant midi dress, heeled boots, and statement jewelry", "a sophisticated gown with autumn accessories"],
                graduation: ["a chic dress, blazer, and comfortable heels", "a stylish outfit with celebratory pieces"],
                funeral: ["a black dress, dark coat, and modest heels", "dark conservative attire"],
                firstdate: ["a cute sweater dress, ankle boots, and pretty jewelry", "a nice top, jeans, and heeled boots"],
                picnic: ["a cozy sweater, jeans, boots, and a scarf", "comfortable layers with walking shoes"],
                concert: ["a leather jacket, edgy top, jeans, and boots", "a cool outfit with comfortable footwear"]
            }
        }
    };

    // ============ GET RECOMMENDATION ============
    let outfitOptions = recommendations[season]?.[gender]?.[occasion];

    // Fallback to casual if occasion not found
    if (!outfitOptions) {
        outfitOptions = recommendations[season]?.[gender]?.casual;
    }

    // Select random outfit from options for variety
    let outfit;
    if (Array.isArray(outfitOptions)) {
        outfit = outfitOptions[Math.floor(Math.random() * outfitOptions.length)];
    } else {
        outfit = outfitOptions || "stylish, comfortable pieces that match your style";
    }

    // ============ BUILD RESPONSE ============
    let response = `For a ${occasion} ${season} look for a ${gender}, we recommend: ${outfit}.`;

    // Add color customization
    const colorTips = {
        black: " Style tip: Black creates a sleek, sophisticated look. Mix textures to add depth.",
        white: " Style tip: White keeps things fresh and clean. Pair with metallics or pastels.",
        blue: " Style tip: Blue is versatile - navy for formal, light blue for casual elegance.",
        red: " Style tip: Red makes a bold statement. Use it as an accent or go all out.",
        green: " Style tip: Earthy greens are trendy. Olive and sage work for any season.",
        pink: " Style tip: Pink adds softness. Blush for elegance, hot pink for fun.",
        yellow: " Style tip: Yellow brightens any outfit. Mustard for autumn, lemon for summer.",
        purple: " Style tip: Purple exudes luxury. Deep plum for formal, lavender for casual.",
        orange: " Style tip: Orange is warm and energetic. Rust tones work great in autumn.",
        brown: " Style tip: Brown is classic and grounding. Mix different brown shades for depth.",
        grey: " Style tip: Grey is effortlessly chic. Layer different grey tones for dimension.",
        beige: " Style tip: Beige and nude tones are timeless. Perfect for a polished look.",
        neutral: " Style tip: Stick to beige, grey, white, and black for a sophisticated palette.",
        pastel: " Style tip: Pastels are soft and romantic. Mix different pastel shades together.",
        dark: " Style tip: Dark colors create a sleek silhouette. Add metallic accents for interest.",
        light: " Style tip: Light colors are airy and fresh. Perfect for a cheerful vibe."
    };

    if (detectedColor && colorTips[detectedColor]) {
        response += colorTips[detectedColor];
    }

    // Add style tips
    const styleTips = {
        elegant: " Keep everything well-fitted and accessorize with quality pieces.",
        modern: " Don't be afraid to mix textures and try current trends.",
        simple: " Less is more - focus on fit and comfort over complexity.",
        bold: " Express yourself with unique patterns and standout accessories.",
        vintage: " Look for retro-inspired pieces and classic silhouettes.",
        streetwear: " Mix high and low fashion with sneakers and statement pieces.",
        classic: ""
    };

    if (styleTips[style]) {
        response += styleTips[style];
    }

    // Add age-appropriate tips
    if (ageGroup === "young") {
        response += " Feel free to experiment with trends and express your personal style!";
    } else if (ageGroup === "mature") {
        response += " Focus on quality fabrics and timeless pieces that fit well.";
    }

    // Add budget tips
    if (budget === "low") {
        response += " Shop at Shein, H&M, or Zara for affordable options.";
    } else if (budget === "high") {
        response += " Consider investing in designer pieces from luxury brands.";
    }

    // Add time-specific tips
    if (timeOfDay === "evening" || timeOfDay === "night") {
        response += " For evening, you can add more glamorous touches and statement jewelry.";
    } else if (timeOfDay === "morning") {
        response += " For morning events, keep it fresh and polished but comfortable.";
    }

    // ============ SEND RESPONSE ============
    res.json({
        recommendation: response,
        detected: {
            season,
            gender,
            occasion,
            style,
            ageGroup,
            budget,
            timeOfDay,
            color: detectedColor
        },
        alternatives: Array.isArray(outfitOptions) ? outfitOptions : [outfitOptions]
    });
});

module.exports = router;
