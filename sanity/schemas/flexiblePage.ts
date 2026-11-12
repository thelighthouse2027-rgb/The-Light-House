import {
  AutoTranslateInput,
  PriceFxInput,
  CapacityOpsInput,
  WhatsAppMarketingInput,
} from '@/app/components/StudioCustomInputs';

const createMultiLangField = (
  name: string,
  title: string,
  isArray: boolean = false,
  group?: string
) => ({
  name,
  title,
  type: 'object',
  ...(group ? { group } : {}),
  components: {
    input: AutoTranslateInput,
  },
  fields: ['en', 'de', 'fr', 'pl'].map((langCode) => ({
    name: langCode,
    title: langCode.toUpperCase(),
    type: isArray ? 'array' : 'string',
    ...(isArray
      ? {
          of: [
            { type: 'block' },
            { type: 'image', options: { hotspot: true } },
          ],
        }
      : {}),
  })),
});

// دالة مشتركة لأزرار الـ CTA والروابط
const createCtaFields = () => [
  createMultiLangField('ctaText', 'نص زر الانتقال (CTA Text)'),
  createMultiLangField('ctaUrl', 'رابط زر الانتقال المتعدد اللغات (URL)'),
];

// القائمة الموحدة للإيموجي لمنع تكرار الكود في SonarCloud
const BADGE_EMOJI_LIST = [
  { title: '🔥 الأكثر طلباً / ساخن (Fire)', value: '🔥' },
  { title: '👨‍👩‍👧‍👦 مناسب للعائلات (Family)', value: '👨‍👩‍👧‍👦' },
  { title: '👶 مناسب للمبتدئين (Beginner)', value: '👶' },
  { title: '🏆 مستوى محترف / متقدم (Pro)', value: '🏆' },
  { title: '🤿 معدات غوص شاملة (Diving Gear)', value: '🤿' },
  { title: '🚤 رحلة بحرية سريعة (Speedboat)', value: '🚤' },
  { title: '🐬 مشاهدة دلافين وحياة بحرية (Dolphins)', value: '🐬' },
  { title: '⭐ خدمة في آي بي مميزة (VIP)', value: '⭐' },
  { title: '🍽️ بوفيه مفتوح ومشروبات (Open Buffet)', value: '🍽️' },
  { title: '🚐 انتقالات مجانية (Free Transfer)', value: '🚐' },
];

export default {
  name: 'flexiblePage',
  title: 'Flexible Pages & Trips (الصفحات والرحلات المرنة)',
  type: 'document',

  groups: [
    { name: 'main', title: 'General Info', default: true },
    { name: 'sections', title: 'Page Builder Sections (أقسام الصفحة)' },
    { name: 'pricing', title: 'Pricing & Currency' },
    { name: 'capacity', title: 'Capacity & Ops' },
    { name: 'action', title: 'WhatsApp & Marketing' },
    { name: 'media', title: 'Media' },
    { name: 'seo', title: 'SEO Settings' },
  ],

  fields: [
    // ==========================================
    // TAB 1: General Info
    // ==========================================
    {
      name: 'isActive',
      title: 'Published on Website (isActive)',
      description: 'Toggle public visibility across catalog listings, search engines, and booking widgets.',
      type: 'boolean',
      initialValue: true,
      group: 'main',
    },
    {
      name: 'pageCategory',
      title: 'تصنيف الصفحة في القائمة الجانبية (Desk Category)',
      type: 'string',
      group: 'main',
      options: {
        list: [
          { title: '📄 صفحة عامة مرنة (General Flexible Page)', value: 'general' },
          { title: '🎓 كورسات وتخصصات الغوص (Courses & Specialties)', value: 'courses' },
          { title: '🤿 غوص يومي وسنوركلينج (Daily Diving & Snorkel)', value: 'daily' },
          { title: '🛥️ رحلات القوارب والسفاري (Boat Trips & Safaris)', value: 'trips' },
        ],
        layout: 'radio',
      },
      initialValue: 'general',
    },
    {
      ...createMultiLangField('pageTitle', 'Trip / Page Title باللغات الأربع (AutoTranslate Pro)', false, 'main'),
    },
    {
      name: 'slug',
      title: 'رابط الصفحة (Slug)',
      type: 'slug',
      group: 'main',
      options: {
        source: (doc: any) => doc.pageTitle?.en || 'page',
        maxLength: 96,
      },
    },
    {
      // تم تفعيل isArray: true ليدعم التنسيق الكامل + الترجمة التلقائية
      ...createMultiLangField('shortDescription', 'Trip Summary / Description (يدعم التنسيق + الترجمة التلقائية)', true, 'main'),
    },

    // ==========================================
    // TAB 2: Pricing & Currency (FX Live Sync + Rich Text & AutoTranslate)
    // ==========================================
    {
      name: 'basePriceEur',
      title: 'Base Price (EUR €)',
      type: 'number',
      group: 'pricing',
      initialValue: 450,
      components: {
        input: PriceFxInput,
      },
    },
    {
      // يدعم التنسيق (نقاط، قوائم، عريض) + الترجمة التلقائية للغات الأربع
      ...createMultiLangField('includedInPrice', '✅ Included in Price (ما يشمله السعر - يدعم التنسيق والنقاط والترجمة التلقائية)', true, 'pricing'),
    },
    {
      // يدعم التنسيق (نقاط، قوائم، عريض) + الترجمة التلقائية للغات الأربع
      ...createMultiLangField('notIncludedInPrice', '❌ Not Included / Extra Fees (غير مشمول في السعر - يدعم التنسيق والنقاط والترجمة التلقائية)', true, 'pricing'),
    },
    {
      // حقل إضافي لكتابة أي محتوى أو جداول أو تفاصيل أسعار منسقة
      ...createMultiLangField('pricingDetails', '📋 Additional Pricing Details & Content (محتوى وتفاصيل إضافية للأسعار والباقات - يدعم التنسيق والترجمة)', true, 'pricing'),
    },

    // ==========================================
    // TAB 3: Capacity & Ops
    // ==========================================
    {
      name: 'capacityOps',
      title: 'Fleet, Boat Capacity & Operations',
      type: 'object',
      group: 'capacity',
      components: {
        input: CapacityOpsInput,
      },
      fields: [
        {
          name: 'vessel',
          title: 'Assigned Vessel / Yacht (اليخت أو القارب)',
          type: 'string',
          options: {
            list: [
              { title: 'M/Y Light Star (32m Liveaboard)', value: 'M/Y Light Star' },
              { title: 'M/Y Red Sea Queen (Daily Cruiser)', value: 'M/Y Red Sea Queen' },
              { title: 'Speedboat Barracuda (Zodiac)', value: 'Speedboat Barracuda' },
            ],
          },
          initialValue: 'M/Y Light Star',
        },
        {
          name: 'maxCapacity',
          title: 'Max Guest Capacity (الحد الأقصى للمقاعد)',
          type: 'number',
          initialValue: 20,
        },
        {
          name: 'bookedCapacity',
          title: 'Current Booked Guests - Pax (المقاعد المحجوزة حالياً)',
          type: 'number',
          initialValue: 17,
        },
        {
          name: 'crewNotes',
          title: 'Divemaster & Crew Assignment (طاقم الرحلة)',
          type: 'string',
          initialValue: 'DM Karim Zaki & Captain Hassan (Radio Ch: 16)',
        },
      ],
    },

    // ==========================================
    // TAB 4: WhatsApp & Marketing
    // ==========================================
    {
      name: 'whatsappMarketing',
      title: 'WhatsApp Direct Inquiry & Campaign Generator',
      type: 'object',
      group: 'action',
      components: {
        input: WhatsAppMarketingInput,
      },
      fields: [
        {
          name: 'utmSource',
          title: 'Campaign Source (UTM Source)',
          type: 'string',
          options: {
            list: [
              { title: 'Instagram Bio Link', value: 'instagram_bio' },
              { title: 'Google Search Ads (PPC)', value: 'google_ads' },
              { title: 'Facebook Scuba Community', value: 'facebook_group' },
              { title: 'Hurghada Hotel QR Stand', value: 'hotel_qr' },
            ],
          },
          initialValue: 'instagram_bio',
        },
        {
          name: 'whatsappPhone',
          title: 'رقم الواتساب المستهدف',
          type: 'string',
          options: {
            list: [
              { title: 'الرقم الأول (01273327311)', value: '201273327311' },
              { title: 'الرقم الثاني (01550503959)', value: '201550503959' },
            ],
            layout: 'radio',
          },
          initialValue: '201273327311',
        },
        {
          name: 'customMessage',
          title: 'Customer Chat Pre-fill Template (رسالة الواتساب الجاهزة)',
          type: 'text',
          rows: 3,
          initialValue:
            'Hello The Light House Diving Center! 🤿 I want to book this adventure. Please confirm current seat availability.',
        },
      ],
    },

    // ==========================================
    // TAB 5: Media
    // ==========================================
    {
      name: 'mainCoverImage',
      title: 'Main Cover Image (Hotspot Enabled)',
      type: 'image',
      group: 'media',
      options: { hotspot: true },
    },

    // ==========================================
    // TAB 6: Page Builder Sections (الأقسام الـ 7 كاملة وكل وصف فيها يدعم التنسيق والترجمة التلقائية)
    // ==========================================
    {
      name: 'sections',
      title: 'أقسام الصفحة (Page Builder Sections)',
      type: 'array',
      group: 'sections',
      of: [
        // 1. سكشن الهيرو
        {
          type: 'object',
          name: 'heroSection',
          title: 'Hero Section (الهيرو)',
          fields: [
            createMultiLangField('badge', 'الشارة العليا (Badge)'),
            createMultiLangField('title', 'العنوان الرئيسي'),
            createMultiLangField('subtitle', 'الوصف أو العنوان الفرعي (يدعم التنسيق والترجمة التلقائية)', true),
            {
              name: 'bgImage',
              title: 'صورة الخلفية',
              type: 'image',
              options: { hotspot: true },
            },
            {
              name: 'bgVideoUrl',
              title: 'رابط فيديو خارجي للخلفية (موصى به لتفادي ثقل الموقع)',
              type: 'url',
            },
            {
              name: 'bgVideoFile',
              title: 'أو رفع فيديو للخلفية من الجهاز (تأكد أن يكون مساحته صغيرة)',
              type: 'file',
              options: { accept: 'video/*' },
            },
            ...createCtaFields(),
          ],
        },

        // 2. سكشن قسمين (Split Section)
        {
          type: 'object',
          name: 'splitSection',
          title: 'Split Section (قسم من جزأين: صورة/فيديو + نص وزر)',
          fields: [
            {
              name: 'layoutDirection',
              title: 'اتجاه العرض',
              type: 'string',
              options: {
                list: [
                  { title: 'صورة يمين / نص يسار', value: 'imageRight' },
                  { title: 'صورة يسار / نص يمين', value: 'imageLeft' },
                ],
                layout: 'radio',
              },
              initialValue: 'imageRight',
            },
            {
              name: 'mediaType',
              title: 'نوع الوسائط (صورة، فيديو مرفوع، أم رابط خارجي؟)',
              type: 'string',
              options: {
                list: [
                  { title: 'صورة', value: 'image' },
                  { title: 'فيديو مرفوع', value: 'videoFile' },
                  { title: 'رابط فيديو خارجي', value: 'videoUrl' },
                ],
                layout: 'radio',
              },
              initialValue: 'image',
            },
            {
              name: 'image',
              title: 'الصورة',
              type: 'image',
              options: { hotspot: true },
              hidden: ({ parent }: { parent?: any }) => parent?.mediaType !== 'image',
            },
            {
              name: 'videoFile',
              title: 'ملف الفيديو المرفوع',
              type: 'file',
              options: { accept: 'video/*' },
              hidden: ({ parent }: { parent?: any }) => parent?.mediaType !== 'videoFile',
            },
            {
              name: 'videoUrl',
              title: 'رابط الفيديو الخارجي',
              type: 'url',
              hidden: ({ parent }: { parent?: any }) => parent?.mediaType !== 'videoUrl',
            },
            createMultiLangField('title', 'العنوان'),
            createMultiLangField('description', 'الوصف (يدعم التنسيق والتنقيط والترجمة التلقائية)', true),
            ...createCtaFields(),
          ],
        },

        // 3. سكشن السلايدر (Moving Slider / Marquee)
        {
          type: 'object',
          name: 'sliderSection',
          title: 'Moving Slider / Marquee (السلايدر المتحرك)',
          fields: [
            createMultiLangField('sectionTitle', 'عنوان السكشن'),
            {
              name: 'slides',
              title: 'الشرائح',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    { name: 'image', title: 'صورة الشريحة', type: 'image' },
                    createMultiLangField('caption', 'عنوان فرعي'),
                    createMultiLangField('slideUrl', 'رابط الشريحة المتعدد اللغات'),
                  ],
                },
              ],
            },
          ],
        },

        // 4. سكشن شبكة الكروت (Grid Cards)
        {
          type: 'object',
          name: 'gridCardsSection',
          title: 'Grid Cards Section (شبكة الكروت والخدمات)',
          fields: [
            createMultiLangField('sectionTitle', 'عنوان السكشن'),
            {
              name: 'cards',
              title: 'الكروت أو الخدمات',
              type: 'array',
              of: [
                {
                  type: 'object',
                  title: 'كارت / خدمة',
                  fields: [
                    createMultiLangField('cardTitle', 'عنوان الكارت / الخدمة'),
                    createMultiLangField('cardDesc', 'وصف الكارت / نبذة مختصرة (يدعم التنسيق والترجمة التلقائية)', true),
                    {
                      name: 'cardImage',
                      title: 'صورة الكارت',
                      type: 'image',
                      options: { hotspot: true },
                    },
                    {
                      name: 'priceText',
                      title: 'نص السعر على الكارت (مثل: From €45)',
                      type: 'string',
                    },
                    createMultiLangField('locationText', 'نص الموقع على الخريطة (مثل: Hurghada, Red Sea)'),
                    {
                      name: 'locationMapUrl',
                      title: 'رابط خريطة الموقع (Google Maps URL)',
                      type: 'url',
                    },
                    createMultiLangField('badgeText', 'نص الشارة المميزة على الكارت (مثل: Most Popular)'),
                    {
                      name: 'badgeEmoji',
                      title: 'اختر أيقونة للشارة',
                      type: 'string',
                      options: {
                        list: BADGE_EMOJI_LIST,
                        layout: 'dropdown',
                      },
                    },
                    {
                      name: 'servicePrice',
                      title: 'سعر الخدمة (€) - رقمي (مع حاسبة العملات FX)',
                      type: 'number',
                      components: {
                        input: PriceFxInput,
                      },
                    },
                    {
                      name: 'serviceSlug',
                      title: 'معرف الخدمة في الرابط',
                      type: 'string',
                    },
                    {
                      name: 'features',
                      title: 'مميزات الكارت (Tags باللغات الأربع)',
                      type: 'array',
                      of: [
                        {
                          type: 'object',
                          fields: [
                            createMultiLangField('featureText', 'نص الميزة باللغات الأربع'),
                            {
                              name: 'emoji',
                              title: 'اختر أيقونة أو إيموجي مميز',
                              type: 'string',
                              options: {
                                list: BADGE_EMOJI_LIST,
                                layout: 'dropdown',
                              },
                            },
                          ],
                          preview: {
                            select: {
                              title: 'featureText.en',
                              subtitle: 'emoji',
                            },
                            prepare(selection: { title?: string; subtitle?: string }) {
                              return {
                                title: selection.title || 'Feature',
                                subtitle: selection.subtitle || '',
                              };
                            },
                          },
                        },
                      ],
                    },
                    createMultiLangField('cardCtaText', 'نص زر الكارت'),
                    createMultiLangField('cardCtaUrl', 'رابط زر الكارت المتعدد اللغات'),
                    {
                      name: 'showAiGuide',
                      title: 'تفعيل زر Ask AI Guide في هذا الكارت؟',
                      type: 'boolean',
                      initialValue: true,
                    },
                    {
                      name: 'showWhatsApp',
                      title: 'تفعيل زر حجز الواتساب في هذا الكارت؟',
                      type: 'boolean',
                      initialValue: true,
                    },
                    {
                      name: 'whatsappNumber',
                      title: 'اختر رقم الواتساب للتواصل',
                      type: 'string',
                      options: {
                        list: [
                          { title: 'الرقم الأول (01273327311)', value: '201273327311' },
                          { title: 'الرقم الثاني (01550503959)', value: '201550503959' },
                        ],
                        layout: 'radio',
                      },
                      initialValue: '201273327311',
                      hidden: ({ parent }: { parent?: any }) => !parent?.showWhatsApp,
                    },
                    {
                      name: 'hasMiniSlider',
                      title: 'سلايدر مصغر داخل الكارت؟',
                      type: 'boolean',
                      initialValue: false,
                    },
                    {
                      name: 'miniSliderImages',
                      title: 'صور السلايدر المصغر',
                      type: 'array',
                      of: [{ type: 'image' }],
                      hidden: ({ parent }: { parent?: any }) => !parent?.hasMiniSlider,
                    },
                  ],
                },
              ],
            },
          ],
        },

        // 5. سكشن نموذج الحجز والاستعلام
        {
          type: 'object',
          name: 'bookingFormSection',
          title: 'Booking Inquiry Form (نموذج الحجز والاستعلام)',
          fields: [
            createMultiLangField('formTitle', 'عنوان نموذج الحجز (مثل: Send an Inquiry)'),
            {
              name: 'defaultAdultPrice',
              title: 'سعر البالغ الافتراضي (€)',
              type: 'number',
              initialValue: 150,
            },
            {
              name: 'defaultChildPrice',
              title: 'سعر الطفل الافتراضي (€)',
              type: 'number',
              initialValue: 150,
            },
          ],
        },

        // 6. سكشن الروابط الداخلية
        {
          type: 'object',
          name: 'internalLinksSection',
          title: 'Related Services / Internal Links (الروابط الداخلية)',
          fields: [
            createMultiLangField('sectionTitle', 'عنوان السكشن (مثل: Discover More Services)'),
            {
              name: 'pages',
              title: 'اختر الصفحات (ابحث بالاسم وأضفها)',
              type: 'array',
              of: [
                {
                  type: 'reference',
                  to: [{ type: 'flexiblePage' }],
                },
              ],
            },
          ],
        },

        // 7. سكشن الكود المخصص (Custom HTML)
        {
          type: 'object',
          name: 'customHtmlSection',
          title: 'Custom HTML (كود مخصص / ويدجت خارجية)',
          fields: [
            createMultiLangField('sectionTitle', 'عنوان السكشن (اختياري)'),
            {
              name: 'htmlCode',
              title: 'كود HTML / Embed / iFrame',
              type: 'text',
              description: 'انسخ والصق كود الـ HTML هنا (مثل: ويدجت تقييمات جوجل، خرائط، فورم خارجية، إلخ)',
            },
          ],
          preview: {
            select: {
              title: 'sectionTitle.en',
            },
            prepare(selection: { title?: string }) {
              return {
                title: selection.title || 'Custom HTML Section',
                subtitle: 'كود مخصص',
              };
            },
          },
        },
      ],
    },

    // ==========================================
    // TAB 7: SEO Settings
    // ==========================================
    {
      name: 'seo',
      title: 'SEO Settings (إعدادات محركات البحث لكل صفحة)',
      type: 'object',
      group: 'seo',
      fields: [
        createMultiLangField('metaTitle', 'عنوان الصفحة لمحركات البحث (Meta Title)'),
        createMultiLangField('metaDescription', 'وصف الصفحة لمحركات البحث (Meta Description)'),
      ],
    },
  ],

  preview: {
    select: {
      title: 'pageTitle.en',
      slug: 'slug.current',
      price: 'basePriceEur',
      isActive: 'isActive',
      booked: 'capacityOps.bookedCapacity',
      max: 'capacityOps.maxCapacity',
      media: 'mainCoverImage',
    },
    prepare({ title, slug, price, isActive, booked, max, media }: any) {
      const statusDot = isActive === false ? '⚪' : '🟢';
      const priceTag = price ? `€${price}` : '';
      const seatsTag = booked !== undefined && max ? ` • ${booked}/${max} seats` : '';
      return {
        title: `${statusDot} ${title || 'Untitled Page'}`,
        subtitle: `${priceTag}${seatsTag} ${slug ? `(/${slug})` : ''}`.trim(),
        media,
      };
    },
  },
};