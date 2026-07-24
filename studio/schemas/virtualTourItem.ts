import {defineField, defineType, defineArrayMember} from 'sanity'

export default defineType({
  name: 'virtualTourItem',
  type: 'document',
  title: 'Virtual Tour Item',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
    }),
    defineField({
      name: 'caption',
      type: 'string',
      title: 'Caption',
    }),
    defineField({
      name: 'image',
      type: 'image',
    }),
    defineField({
      name: 'links',
      type: 'array',
      title: 'Links to other Locations',
      of: [defineArrayMember({type: 'virtualTourLink'})],
    }),
    defineField({
      name: 'poseHeading',
      type: 'number',
      title: 'Pose Heading',
      initialValue: 180,
    }),
    defineField({
      name: 'posePitch',
      type: 'number',
      title: 'Pose Pitch',
      initialValue: 0,
    }),
    defineField({
      name: 'description',
      type: 'text',
      title: 'Description',
      description: 'Longer description shown in the viewer tooltip and info panel.',
      rows: 3,
    }),
    defineField({
      name: 'showInGallery',
      type: 'boolean',
      title: 'Show in Gallery',
      description: 'Uncheck to hide this node from the gallery thumbnail strip.',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'image',
      subtitle: 'caption',
    },
  },
})
