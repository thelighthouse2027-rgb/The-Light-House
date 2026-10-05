import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'review',
  title: 'التقييمات (Reviews)',
  type: 'document',
  fields: [
    defineField({
      name: 'authorName',
      title: 'اسم العميل',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'authorPhoto',
      title: 'صورة العميل',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'rating',
      title: 'التقييم (من 1 إلى 5)',
      type: 'number',
      initialValue: 5,
      validation: (Rule) => Rule.required().min(1).max(5),
    }),
    defineField({
      name: 'dateDescription',
      title: 'تاريخ التقييم / مضى عليه (مثل: قبل شهر)',
      type: 'string',
    }),
    defineField({
      name: 'reviewText',
      title: 'نص التقييم',
      type: 'text',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'googleUrl',
      title: 'رابط التقييم على Google Maps',
      type: 'url',
    }),
  ],
  preview: {
    select: {
      title: 'authorName',
      subtitle: 'reviewText',
      media: 'authorPhoto',
    },
  },
});