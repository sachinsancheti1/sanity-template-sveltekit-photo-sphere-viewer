import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'virtualTourPageBlocks',
  type: 'document',
  title: 'Virtual Tour Page Blocks',
  groups: [
    {name: 'tour', title: 'Tour Info', default: true},
    {name: 'viewer', title: 'Viewer Settings'},
    {name: 'autorotate', title: 'Auto-rotate'},
  ],
  fields: [
    // ── Tour Info ──────────────────────────────────────────────────
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
      group: 'tour',
    }),
    defineField({
      name: 'description',
      type: 'string',
      title: 'Description',
      description: 'For SEO, more than 100 char, less than 160 char',
      group: 'tour',
      validation: (Rule) => [
        Rule.required().min(100).warning('You need more characters'),
        Rule.max(160).warning('Too many characters'),
      ],
    }),
    defineField({
      name: 'loader',
      type: 'file',
      title: 'Loader Image or GIF',
      description: 'Displayed while panoramas are loading.',
      group: 'tour',
    }),
    defineField({
      name: 'start',
      type: 'reference',
      title: 'Starting Node',
      description: 'The panorama node shown when the tour first loads.',
      group: 'tour',
      validation: (Rule) => Rule.required(),
      to: {type: 'virtualTourItem'},
    }),

    // ── Viewer Settings ────────────────────────────────────────────
    defineField({
      name: 'defaultZoomLvl',
      type: 'number',
      title: 'Default Zoom Level',
      description: 'Starting zoom level. 0 = fully zoomed out, 100 = fully zoomed in. Default: 50',
      group: 'viewer',
      initialValue: 50,
      validation: (Rule) => Rule.min(0).max(100).integer(),
    }),
    defineField({
      name: 'minFov',
      type: 'number',
      title: 'Minimum Field of View (degrees)',
      description: 'How far the viewer can zoom in. Lower value = more zoom. Default: 30',
      group: 'viewer',
      initialValue: 30,
      validation: (Rule) => Rule.min(1).max(179),
    }),
    defineField({
      name: 'maxFov',
      type: 'number',
      title: 'Maximum Field of View (degrees)',
      description: 'How far the viewer can zoom out. Higher value = less zoom. Default: 90',
      group: 'viewer',
      initialValue: 90,
      validation: (Rule) => Rule.min(1).max(179),
    }),
    defineField({
      name: 'showGalleryOnLoad',
      type: 'boolean',
      title: 'Show Gallery on Load',
      description: 'Open the thumbnail gallery strip automatically when the tour loads.',
      group: 'viewer',
      initialValue: false,
    }),
    defineField({
      name: 'transitionSpeed',
      type: 'string',
      title: 'Node Transition Speed',
      description: 'Animated rotation speed when navigating between nodes, e.g. "20rpm". Default: "20rpm"',
      group: 'viewer',
      initialValue: '20rpm',
    }),

    // ── Auto-rotate ────────────────────────────────────────────────
    defineField({
      name: 'autorotateEnabled',
      type: 'boolean',
      title: 'Enable Auto-rotate',
      description: 'Automatically rotate the panorama when the viewer is idle.',
      group: 'autorotate',
      initialValue: true,
    }),
    defineField({
      name: 'autorotateDelay',
      type: 'number',
      title: 'Auto-rotate Start Delay (ms)',
      description: 'Milliseconds of idle time before rotation starts. Default: 3000',
      group: 'autorotate',
      initialValue: 3000,
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'autorotateSpeed',
      type: 'string',
      title: 'Auto-rotate Speed',
      description: 'Rotation speed, e.g. "2rpm" (revolutions per minute) or "10dps" (degrees per second). Prefix with "-" to reverse direction. Default: "2rpm"',
      group: 'autorotate',
      initialValue: '2rpm',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
    },
  },
})
