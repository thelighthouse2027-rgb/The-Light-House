import type { StructureResolver } from 'sanity/structure';

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      // 1. قسم Diving & Boat Trips المتفرع إلى 3 أقسام فرعية
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

      // 2. قسم Promo Banner (إذا كان موجوداً في schemas لديك)
      ...S.documentTypeListItems().filter(
        (item) => item.getId() !== 'flexiblePage'
      ),

      S.divider(),

      // 3. قسم Flexible Pages لعرض كافة الصفحات المرنة
      S.listItem()
        .title('📄 Flexible Pages (All Pages)')
        .child(
          S.documentTypeList('flexiblePage').title('All Flexible Pages')
        ),
    ]);