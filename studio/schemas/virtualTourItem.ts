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
      title: 'posePitch',
      initialValue: 0,
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
