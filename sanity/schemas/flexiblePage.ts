export default {
  name: 'flexiblePage',
  title: 'Flexible Pages (الصفحات المرنة)',
  type: 'document',
  fields: [
    {
      name: 'pageTitle',
      title: 'اسم الصفحة (داخلي لوحة التحكم)',
      type: 'string',
    },
    {
      name: 'slug',
      title: 'رابط الصفحة (Slug)',
      type: 'slug',
      options: { source: 'pageTitle', maxLength: 96 }
    },
    {
      name: 'sections',
      title: 'أقسام الصفحة (Page Builder Sections)',
      type: 'array',
      of: [
        // 1. سكشن الهيرو
        {
          type: 'object',
          name: 'heroSection',
          title: 'Hero Section (الهيرو)',
          fields: [
            {
              name: 'badge',
              title: 'الشارة العليا (Badge)',
              type: 'object',
              fields: [
                { name: 'en', title: 'English', type: 'string' },
                { name: 'de', title: 'German', type: 'string' },
                { name: 'fr', title: 'French', type: 'string' },
                { name: 'pl', title: 'Polish', type: 'string' },
              ]
            },
            {
              name: 'title',
              title: 'العنوان الرئيسي',
              type: 'object',
              fields: [
                { name: 'en', title: 'English', type: 'string' },
                { name: 'de', title: 'German', type: 'string' },
                { name: 'fr', title: 'French', type: 'string' },
                { name: 'pl', title: 'Polish', type: 'string' },
              ]
            },
            {
              name: 'subtitle',
              title: 'الوصف أو العنوان الفرعي',
              type: 'object',
              fields: [
                { name: 'en', title: 'English', type: 'array', of: [{ type: 'block' }] },
                { name: 'de', title: 'German', type: 'array', of: [{ type: 'block' }] },
                { name: 'fr', title: 'French', type: 'array', of: [{ type: 'block' }] },
                { name: 'pl', title: 'Polish', type: 'array', of: [{ type: 'block' }] },
              ]
            },
            {
              name: 'bgImage',
              title: 'صورة الخلفية',
              type: 'image',
              options: { hotspot: true }
            },
            {
              name: 'bgVideoUrl',
              title: 'رابط فيديو خارجي للخلفية (موصى به لتفادي ثقل الموقع)',
              type: 'url'
            },
            {
              name: 'bgVideoFile',
              title: 'أو رفع فيديو للخلفية من الجهاز (تأكد أن يكون مساحته صغيرة)',
              type: 'file',
              options: { accept: 'video/*' }
            },
            {
              name: 'ctaText',
              title: 'نص زر الانتقال (CTA Text)',
              type: 'object',
              fields: [
                { name: 'en', title: 'English', type: 'string' },
                { name: 'de', title: 'German', type: 'string' },
                { name: 'fr', title: 'French', type: 'string' },
                { name: 'pl', title: 'Polish', type: 'string' },
              ]
            },
            {
              name: 'ctaUrl',
              title: 'رابط زر الانتقال المتعدد اللغات (URL)',
              type: 'object',
              fields: [
                { name: 'en', title: 'English URL', type: 'string' },
                { name: 'de', title: 'German URL', type: 'string' },
                { name: 'fr', title: 'French URL', type: 'string' },
                { name: 'pl', title: 'Polish URL', type: 'string' },
              ]
            }
          ]
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
                  { title: 'صورة يسار / نص يمين', value: 'imageLeft' }
                ],
                layout: 'radio'
              },
              initialValue: 'imageRight'
            },
            {
              name: 'mediaType',
              title: 'نوع الوسائط (صورة، فيديو مرفوع، أم رابط خارجي؟)',
              type: 'string',
              options: {
                list: [
                  { title: 'صورة', value: 'image' },
                  { title: 'فيديو مرفوع', value: 'videoFile' },
                  { title: 'رابط فيديو خارجي', value: 'videoUrl' }
                ],
                layout: 'radio'
              },
              initialValue: 'image'
            },
            {
              name: 'image',
              title: 'الصورة',
              type: 'image',
              options: { hotspot: true },
              hidden: ({ parent }: { parent?: any }) => parent?.mediaType !== 'image'
            },
            {
              name: 'videoFile',
              title: 'ملف الفيديو المرفوع',
              type: 'file',
              options: { accept: 'video/*' },
              hidden: ({ parent }: { parent?: any }) => parent?.mediaType !== 'videoFile'
            },
            {
              name: 'videoUrl',
              title: 'رابط الفيديو الخارجي',
              type: 'url',
              hidden: ({ parent }: { parent?: any }) => parent?.mediaType !== 'videoUrl'
            },
            {
              name: 'title',
              title: 'العنوان',
              type: 'object',
              fields: [
                { name: 'en', title: 'English', type: 'string' },
                { name: 'de', title: 'German', type: 'string' },
                { name: 'fr', title: 'French', type: 'string' },
                { name: 'pl', title: 'Polish', type: 'string' },
              ]
            },
            {
              name: 'description',
              title: 'الوصف (يدعم التنسيق والتنقيط)',
              type: 'object',
              fields: [
                { name: 'en', title: 'English', type: 'array', of: [{ type: 'block' }] },
                { name: 'de', title: 'German', type: 'array', of: [{ type: 'block' }] },
                { name: 'fr', title: 'French', type: 'array', of: [{ type: 'block' }] },
                { name: 'pl', title: 'Polish', type: 'array', of: [{ type: 'block' }] },
              ]
            },
            {
              name: 'ctaText',
              title: 'نص الزر (CTA Text)',
              type: 'object',
              fields: [
                { name: 'en', title: 'English', type: 'string' },
                { name: 'de', title: 'German', type: 'string' },
                { name: 'fr', title: 'French', type: 'string' },
                { name: 'pl', title: 'Polish', type: 'string' },
              ]
            },
            {
              name: 'ctaUrl',
              title: 'رابط الزر المتعدد اللغات (URL)',
              type: 'object',
              fields: [
                { name: 'en', title: 'English URL', type: 'string' },
                { name: 'de', title: 'German URL', type: 'string' },
                { name: 'fr', title: 'French URL', type: 'string' },
                { name: 'pl', title: 'Polish URL', type: 'string' },
              ]
            }
          ]
        },

        // 3. سكشن السلايدر (Moving Slider / Marquee)
        {
          type: 'object',
          name: 'sliderSection',
          title: 'Moving Slider / Marquee (السلايدر المتحرك)',
          fields: [
            {
              name: 'sectionTitle',
              title: 'عنوان السكشن',
              type: 'object',
              fields: [
                { name: 'en', title: 'English', type: 'string' },
                { name: 'de', title: 'German', type: 'string' },
                { name: 'fr', title: 'French', type: 'string' },
                { name: 'pl', title: 'Polish', type: 'string' },
              ]
            },
            {
              name: 'slides',
              title: 'الشرائح',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    { name: 'image', title: 'صورة الشريحة', type: 'image' },
                    { 
                      name: 'caption', 
                      title: 'عنوان فرعي', 
                      type: 'object',
                      fields: [
                        { name: 'en', title: 'English', type: 'string' },
                        { name: 'de', title: 'German', type: 'string' },
                        { name: 'fr', title: 'French', type: 'string' },
                        { name: 'pl', title: 'Polish', type: 'string' },
                      ]
                    },
                    {
                      name: 'slideUrl',
                      title: 'رابط الشريحة المتعدد اللغات',
                      type: 'object',
                      fields: [
                        { name: 'en', title: 'English URL', type: 'string' },
                        { name: 'de', title: 'German URL', type: 'string' },
                        { name: 'fr', title: 'French URL', type: 'string' },
                        { name: 'pl', title: 'Polish URL', type: 'string' },
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },

        // 4. سكشن شبكة الكروت (Grid Cards) - محدث لدعم الحجز والدفع
        {
          type: 'object',
          name: 'gridCardsSection',
          title: 'Grid Cards Section (شبكة الكروت والخدمات)',
          fields: [
            {
              name: 'sectionTitle',
              title: 'عنوان السكشن',
              type: 'object',
              fields: [
                { name: 'en', title: 'English', type: 'string' },
                { name: 'de', title: 'German', type: 'string' },
                { name: 'fr', title: 'French', type: 'string' },
                { name: 'pl', title: 'Polish', type: 'string' },
              ]
            },
            {
              name: 'cards',
              title: 'الكروت أو الخدمات',
              type: 'array',
              of: [
                {
                  type: 'object',
                  title: 'كارت / خدمة',
                  fields: [
                    {
                      name: 'cardTitle',
                      title: 'عنوان الكارت / الخدمة',
                      type: 'object',
                      fields: [
                        { name: 'en', title: 'English', type: 'string' },
                        { name: 'de', title: 'German', type: 'string' },
                        { name: 'fr', title: 'French', type: 'string' },
                        { name: 'pl', title: 'Polish', type: 'string' },
                      ]
                    },
                    {
                      name: 'cardDesc',
                      title: 'وصف الكارت / نبذة مختصرة (يدعم التنسيق والتنقيط)',
                      type: 'object',
                      fields: [
                        { name: 'en', title: 'English', type: 'array', of: [{ type: 'block' }] },
                        { name: 'de', title: 'German', type: 'array', of: [{ type: 'block' }] },
                        { name: 'fr', title: 'French', type: 'array', of: [{ type: 'block' }] },
                        { name: 'pl', title: 'Polish', type: 'array', of: [{ type: 'block' }] },
                      ]
                    },
                    {
                      name: 'cardImage',
                      title: 'صورة الكارت',
                      type: 'image',
                      options: { hotspot: true }
                    },
                    {
                      name: 'servicePrice',
                      title: 'سعر الخدمة ($)',
                      type: 'number'
                    },
                    {
                      name: 'serviceSlug',
                      title: 'معرف الخدمة في الرابط (مثل: diving-courses أو boat-trips)',
                      type: 'string'
                    },
                    {
                      name: 'cardCtaText',
                      title: 'نص زر الكارت (CTA مثل: Book Now)',
                      type: 'object',
                      fields: [
                        { name: 'en', title: 'English', type: 'string' },
                        { name: 'de', title: 'German', type: 'string' },
                        { name: 'fr', title: 'French', type: 'string' },
                        { name: 'pl', title: 'Polish', type: 'string' },
                      ]
                    },
                    {
                      name: 'cardCtaUrl',
                      title: 'رابط زر الكارت المتعدد اللغات (URL)',
                      type: 'object',
                      fields: [
                        { name: 'en', title: 'English URL', type: 'string' },
                        { name: 'de', title: 'German URL', type: 'string' },
                        { name: 'fr', title: 'French URL', type: 'string' },
                        { name: 'pl', title: 'Polish URL', type: 'string' },
                      ]
                    },
                    {
                      name: 'hasMiniSlider',
                      title: 'سلايدر مصغر داخل الكارت؟',
                      type: 'boolean',
                      initialValue: false
                    },
                    {
                      name: 'miniSliderImages',
                      title: 'صور السلايدر المصغر',
                      type: 'array',
                      of: [{ type: 'image' }],
                      hidden: ({ parent }: { parent?: any }) => !parent?.hasMiniSlider
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};