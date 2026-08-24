export default {
  name: 'promoBanner',
  title: 'Promo Banner (البانر المسطيل)',
  type: 'document',
  fields: [
    {
      name: 'isActive',
      title: 'تفعيل العرض في الموقع (Active)',
      type: 'boolean',
      initialValue: true,
    },
    {
      name: 'title',
      title: 'العنوان (Titles in 4 Languages)',
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
      title: 'الوصف (Descriptions)',
      type: 'object',
      fields: [
        { name: 'en', title: 'English', type: 'text' },
        { name: 'de', title: 'German', type: 'text' },
        { name: 'fr', title: 'French', type: 'text' },
        { name: 'pl', title: 'Polish', type: 'text' },
      ]
    },
    {
      name: 'discountBadge',
      title: 'نص الخصم / الشارة (مثل: خصم 20%)',
      type: 'object',
      fields: [
        { name: 'en', title: 'English', type: 'string' },
        { name: 'de', title: 'German', type: 'string' },
        { name: 'fr', title: 'French', type: 'string' },
        { name: 'pl', title: 'Polish', type: 'string' },
      ]
    },
    {
      name: 'mediaType',
      title: 'نوع الوسائط',
      type: 'string',
      options: {
        list: [
          { title: 'صورة (Image)', value: 'image' },
          { title: 'فيديو (Video / YouTube)', value: 'video' },
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
      title: 'ملف الفيديو (MP4 من الجهاز)',
      type: 'file',
      options: { accept: 'video/*' },
      hidden: ({ parent }: { parent?: any }) => parent?.mediaType !== 'video'
    },
    {
      name: 'ctaText',
      title: 'نص زر التفاعل (Call to Action)',
      type: 'object',
      fields: [
        { name: 'en', title: 'English', type: 'string' },
        { name: 'de', title: 'German', type: 'string' },
        { name: 'fr', title: 'French', type: 'string' },
        { name: 'pl', title: 'Polish', type: 'string' },
      ]
    },
    {
      name: 'ctaLink',
      title: 'رابط زر التفاعل',
      type: 'string',
    }
  ]
}