import { virtualTourItem, virtualTourPageBlocks } from '$lib/utils/sanity';
import type { PageServerLoad } from './$types';
import type { VirtualTourData } from '$lib/types/sanity';
import { error } from '@sveltejs/kit';
import { sanityClient } from '$lib/server/sanityClient';
import { resolveInitialNodeId } from '$lib/utils/psv';
import { parseView } from '$lib/utils/view';

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

	// A fresh project has no tour page or start scene yet: show setup guidance, not a blank page
	const startId = data.virtualTourPageBlocks?.start?.id;
	if (!startId) {
		return {
			tour: data,
			initialNodeId: null,
			initialView: null,
			setupIssue: data.virtualTourPageBlocks
				? ('no-start-scene' as const)
				: ('no-tour-page' as const)
		};
	}

	const requestedNode = url.searchParams.get('node');
	const initialNodeId = resolveInitialNodeId(requestedNode, data.virtualTourItem, startId);
	// A shared view (?yaw=&pitch=&zoom=) only applies to the scene it was shared from
	const initialView = requestedNode === initialNodeId ? parseView(url.searchParams) : null;

	setHeaders(CACHE_HEADERS);
	return { tour: data, initialNodeId, initialView, setupIssue: null };
};
