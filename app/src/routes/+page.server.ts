import { virtualTourItem, virtualTourPageBlocks } from '$lib/utils/sanity';
import type { PageServerLoad } from './$types';
import type { VirtualTourData } from '$lib/types/sanity';
import { error } from '@sveltejs/kit';
import { sanityClient } from '$lib/server/sanityClient';
import { resolveInitialNodeId } from '$lib/utils/psv';

// Edge-cache the rendered tour for a minute (serving stale while refreshing), so repeat visits
// skip the Sanity round-trip; published edits appear within ~60s. Browsers don't cache it.
const CACHE_HEADERS = {
	'cache-control': 'public, max-age=0, s-maxage=60, stale-while-revalidate=600',
	'cdn-cache-control': 'public, max-age=60, stale-while-revalidate=600'
};

export const load: PageServerLoad = async ({ url, setHeaders }) => {
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

	setHeaders(CACHE_HEADERS);
	return { tour: data, initialNodeId };
};
