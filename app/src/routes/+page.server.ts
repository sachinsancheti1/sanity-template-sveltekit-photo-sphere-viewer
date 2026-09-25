import { virtualTourItem, virtualTourPageBlocks } from '$lib/utils/sanity';
import type { PageServerLoad } from './$types';
import type { VirtualTourData } from '$lib/types/sanity';
import { error } from '@sveltejs/kit';
import { sanityClient } from '$lib/server/sanityClient';
import { resolveInitialNodeId } from '$lib/utils/psv';

export const load: PageServerLoad = async ({ url }) => {
	let data: VirtualTourData;
	try {
		data = await sanityClient.fetch<VirtualTourData>(`{
        "virtualTourPageBlocks": ${virtualTourPageBlocks()}[0],
        "virtualTourItem": ${virtualTourItem()}
      }`);
	} catch (err) {
		console.error(err);
		error(500, 'Failed to load tour data');
	}

	const startId = data.virtualTourPageBlocks.start?.id;
	const initialNodeId = startId
		? resolveInitialNodeId(url.searchParams.get('node'), data.virtualTourItem, startId)
		: null;

	return { tour: data, initialNodeId };
};
