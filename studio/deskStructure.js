export const structure = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Virtual Tour')
        .child(
          S.list()
            .title('Virtual Tour')
            .items([
              S.listItem()
                .title('Virtual Tour Section')
                .child(
                  S.editor()
                    .id('virtualTourPageBlocks')
                    .schemaType('virtualTourPageBlocks')
                    .documentId('virtualTourPageBlocks')
                    .title('Virtual Tour Sections'),
                ),
              S.listItem()
                .title('Virtual Tour Items')
                .schemaType('virtualTourItem')
                .child(S.documentTypeList('virtualTourItem').title('Virtual Tour Item')),
            ]),
        ),
    ])
