import { defineConfig } from 'sanity';
import { structureTool, type StructureResolver } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import promoBanner from './sanity/schemas/promoBanner';
import flexiblePage from './sanity/schemas/flexiblePage';
import homeSeo from './sanity/schemas/homeSeo'; 
import review from './sanity/schemas/review';

// هيكلة القوائم الجانبية (Desk Structure) كما في تصميم العميل
const customStructure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      // 1. قسم الغوص والرحلات المتفرع إلى 3 تصنيفات فرعية
      S.listItem()
        .title('⚓ Diving & Boat Trips')
        .child(
          S.list()
            .title('Services & Trips')
            .items([
              S.listItem()
                .title('🎓 Courses & Specialties')
                .child(
                  S.documentList()
                    .title('Courses & Specialties')
                    .filter('_type == "flexiblePage" && pageCategory == "courses"')
                ),
              S.listItem()
                .title('🧭 Daily Diving & Snorkel')
                .child(
                  S.documentList()
                    .title('Daily Diving & Snorkel')
                    .filter('_type == "flexiblePage" && pageCategory == "daily"')
                ),
              S.listItem()
                .title('🛥️ Boat Trips & Safaris')
                .child(
                  S.documentList()
                    .title('Boat Trips & Safaris')
                    .filter('_type == "flexiblePage" && pageCategory == "trips"')
                ),
            ])
        ),

      S.divider(),

      // 2. إعدادات الموقع و SEO الرئيسية
      S.listItem()
        .title('⚙️ Site Settings & Home SEO')
        .child(
          S.documentTypeList('homeSeo').title('Site Settings & Home SEO')
        ),

      // 3. البانر الترويجي
      S.listItem()
        .title('📢 Promo Banner')
        .child(
          S.documentTypeList('promoBanner').title('Promo Banner')
        ),

      S.divider(),

      // 4. تقييمات العملاء
      S.listItem()
        .title('⭐ Customer Reviews')
        .child(
          S.documentTypeList('review').title('Customer Reviews')
        ),

      // 5. جميع الصفحات المرنة (شاملة كل التصنيفات)
      S.listItem()
        .title('📄 Flexible Pages (All)')
        .child(
          S.documentTypeList('flexiblePage').title('All Flexible Pages')
        ),
    ]);

export default defineConfig({
  name: 'default',
  title: 'The Light House Studio',
  projectId: 'q348evxi',
  dataset: 'production',
  plugins: [
    structureTool({
      structure: customStructure,
    }),
    visionTool(),
  ],
  schema: {
    types: [promoBanner, flexiblePage, homeSeo, review],
  },
});