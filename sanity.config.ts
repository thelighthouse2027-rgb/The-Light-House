import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import promoBanner from './sanity/schemas/promoBanner';
import flexiblePage from './sanity/schemas/flexiblePage';

export default defineConfig({
  name: 'default',
  title: 'The Light House CMS',
  projectId: 'q348evxi',
  dataset: 'production',
  plugins: [structureTool(), visionTool()],
  schema: {
    types: [promoBanner, flexiblePage],
  },
});