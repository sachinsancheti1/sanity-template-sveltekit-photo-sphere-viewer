import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'virtualTourPageBlocks',
  type: 'document',
  title: 'Virtual Tour Page Blocks',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
    }),
    defineField({
      name: 'description',
      type: 'string',
      title: 'Description',
      description: 'For SEO, more than 100 char, less than 160 char',
      validation: (Rule) => [
        Rule.required().min(100).warning('You need more characters'),
        Rule.max(160).warning('Too many characters'),
      ],
    }),
    defineField({
      name: 'loader',
      type: 'file',
      title: 'Loader Image or GIF',
    }),
    defineField({
      name: 'start',
      type: 'reference',
      title: 'Start',
      validation: (Rule) => Rule.required(),
      to: {
        type: 'virtualTourItem',
      },
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
    },
  },
})
