import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import promoBanner from './sanity/schemas/promoBanner';
import flexiblePage from './sanity/schemas/flexiblePage';
import homeSeo from './sanity/schemas/homeSeo'; 
import review from './sanity/schemas/review'; // 1. استورد ملف التقييمات الجديد هنا

export default defineConfig({
  name: 'default',
  title: 'The Light House CMS',
  projectId: 'q348evxi',
  dataset: 'production',
  plugins: [structureTool(), visionTool()],
  schema: {
    types: [promoBanner, flexiblePage, homeSeo, review], // 2. أضف review هنا داخل المصفوفة
  },
});