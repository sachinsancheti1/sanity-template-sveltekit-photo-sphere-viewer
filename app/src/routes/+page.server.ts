import { virtualTourItem, virtualTourPageBlocks } from '$lib/utils/sanity';
import type { PageServerLoad } from './$types';
import type { VirtualTourData } from '$lib/types/sanity';
import { error } from '@sveltejs/kit';
import { sanityClient } from '$lib/server/sanityClient';

export const load: PageServerLoad = async () => {
	try {
		const data = await sanityClient.fetch<VirtualTourData>(`{
        "virtualTourPageBlocks": ${virtualTourPageBlocks()}[0],
        "virtualTourItem": ${virtualTourItem()}
      }`);
		return { tour: data };
	} catch (err) {
		console.error(err);
		error(500, 'Failed to load tour data');
	}
};
