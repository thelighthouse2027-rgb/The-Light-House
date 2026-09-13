const createMultiLangField = (name: string, title: string, isTextarea: boolean = false) => ({
  name,
  title,
  type: 'object',
  fields: ['en', 'de', 'fr', 'pl'].map((langCode) => ({
    name: langCode,
    title: langCode.toUpperCase(),
    type: isTextarea ? 'text' : 'string',
  }))
});

export default {
  name: 'homeSeo',
  title: 'Home SEO Settings (إعدادات وميتا الصفحة الرئيسية)',
  type: 'document',
  fields: [
    createMultiLangField('metaTitle', 'عنوان محركات البحث (Meta Title)'),
    createMultiLangField('metaDescription', 'وصف محركات البحث (Meta Description - حتى 160 حرف)', true),
  ],
  preview: {
    prepare() {
      return {
        title: 'Home Page SEO Settings'
      }
    }
  }
};