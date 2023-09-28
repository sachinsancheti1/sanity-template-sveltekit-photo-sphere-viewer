import { virtualTourPageBlocks, virtualTourItem } from '$lib/utils/sanity';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { createClient } from '@sanity/client';
import groq from 'groq';

import { PUBLIC_SANITY_DATASET, PUBLIC_SANITY_PROJECT_ID } from '$env/static/public';

if (!PUBLIC_SANITY_PROJECT_ID || !PUBLIC_SANITY_DATASET) {
  throw new Error('Did you forget to run sanity init --env?\n Did you add the .env file?\nDid you add http://localhost:5173/ to https://www.sanity.io/manage/personal/project/$projectId/api?\n');
}

const client = createClient({
  projectId: PUBLIC_SANITY_PROJECT_ID,
  dataset: PUBLIC_SANITY_DATASET,
  useCdn: false, // `false` if you want to ensure fresh data
  apiVersion: '2023-03-20', // date of setup
  perspective: 'published'
});


  export const load = (async() => {
    try {
      const e = await client.fetch(`{
        "virtualTourPageBlocks": ${virtualTourPageBlocks()}[0],
        "virtualTourItem": ${virtualTourItem()}
      }`)
      console.log(e)
      return {
        e
      }
    } catch (e) {
      console.log(e)
      throw error(404, 'Not found')
    }
  })  satisfies PageLoad;
  