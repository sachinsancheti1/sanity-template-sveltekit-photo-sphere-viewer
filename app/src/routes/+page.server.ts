import { virtualTourItem, virtualTourPageBlocks } from '$lib/utils/sanity';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { sanityClient } from '$lib/server/sanityClient';

export const load: PageServerLoad = async () => {
	try {
		const e = await sanityClient.fetch(`{
        "virtualTourPageBlocks": ${virtualTourPageBlocks()}[0],
        "virtualTourItem": ${virtualTourItem()}
      }`);
		// console.log(e);
		return {
			e
		};
	} catch (e) {
		console.log(e);
		error(404, 'Not found');
	}
};
