import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {schemaTypes} from './schemas'
import {structure} from './deskStructure'
import {dashboardConfig} from './dashboardConfig.js'
import {media} from 'sanity-plugin-media'

export const projectId = process.env.SANITY_STUDIO_PROJECT_ID!
export const dataset = process.env.SANITY_STUDIO_DATASET!

export default defineConfig({
  name: 'virtual-tour-studio',
  title: 'Virtual Tour Studio',
  projectId,
  dataset,
  plugins: [
    dashboardConfig,
    media(),
    structureTool({
      structure,
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
})
