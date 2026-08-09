import { describe, it, expect } from 'vitest';
import { toPsvNodes } from './psv';
import type { VirtualTourItem, VirtualTourLink } from '../types/sanity';

function makeItem(overrides: Partial<VirtualTourItem> = {}): VirtualTourItem {
	return {
		id: 'node-1',
		name: 'Lobby',
		caption: 'The lobby',
		description: 'Main entrance',
		panorama: 'https://cdn.sanity.io/pano.jpg',
		thumbnail: 'https://cdn.sanity.io/pano.jpg?w=200',
		showInGallery: true,
		links: [],
		panoData: { poseHeading: 180, posePitch: 0 },
		...overrides
	};
}

function makeLink(overrides: Partial<VirtualTourLink> = {}): VirtualTourLink {
	return {
		nodeId: 'node-2',
		position: { textureX: 100, textureY: 200 },
		name: 'To hallway',
		data: { arrivalPitch: 0.1, arrivalZoom: 40 },
		...overrides
	};
}

describe('toPsvNodes', () => {
	it('maps a complete item to a PSV node', () => {
		const [node] = toPsvNodes([makeItem({ links: [makeLink()] })]);
		expect(node).toEqual({
			id: 'node-1',
			name: 'Lobby',
			caption: 'The lobby',
			description: 'Main entrance',
			panorama: 'https://cdn.sanity.io/pano.jpg',
			thumbnail: 'https://cdn.sanity.io/pano.jpg?w=200',
			showInGallery: true,
			panoData: { poseHeading: 180, posePitch: 0 },
			links: [
				{
					nodeId: 'node-2',
					position: { textureX: 100, textureY: 200 },
					name: 'To hallway',
					data: { arrivalPitch: 0.1, arrivalZoom: 40 }
				}
			]
		});
	});

	it('converts null fields to undefined so PSV defaults apply', () => {
		const [node] = toPsvNodes([
			makeItem({ name: null, caption: null, description: null, panorama: null, thumbnail: null })
		]);
		expect(node.name).toBeUndefined();
		expect(node.caption).toBeUndefined();
		expect(node.description).toBeUndefined();
		expect(node.panorama).toBeUndefined();
		expect(node.thumbnail).toBeUndefined();
	});

	it('drops links missing a target node or texture coordinates', () => {
		const [node] = toPsvNodes([
			makeItem({
				links: [
					makeLink({ nodeId: null }),
					makeLink({ position: { textureX: null, textureY: 200 } }),
					makeLink({ position: { textureX: 100, textureY: null } }),
					makeLink({ nodeId: 'node-3' })
				]
			})
		]);
		expect(node.links).toHaveLength(1);
		expect(node.links[0].nodeId).toBe('node-3');
	});

	it('treats textureX/textureY of 0 as valid coordinates', () => {
		const [node] = toPsvNodes([
			makeItem({ links: [makeLink({ position: { textureX: 0, textureY: 0 } })] })
		]);
		expect(node.links).toHaveLength(1);
		expect(node.links[0].position).toEqual({ textureX: 0, textureY: 0 });
	});

	it('returns an empty links array when links is null', () => {
		const [node] = toPsvNodes([makeItem({ links: null })]);
		expect(node.links).toEqual([]);
	});

	it('omits panoData when absent and nulls pose fields individually', () => {
		const [noPose, partialPose] = toPsvNodes([
			makeItem({ panoData: null }),
			makeItem({ panoData: { poseHeading: 90, posePitch: null } })
		]);
		expect(noPose.panoData).toBeUndefined();
		expect(partialPose.panoData).toEqual({ poseHeading: 90, posePitch: undefined });
	});

	it('converts null link name and data to undefined', () => {
		const [node] = toPsvNodes([makeItem({ links: [makeLink({ name: null, data: null })] })]);
		expect(node.links[0].name).toBeUndefined();
		expect(node.links[0].data).toBeUndefined();
	});

	it('preserves showInGallery: false', () => {
		const [node] = toPsvNodes([makeItem({ showInGallery: false })]);
		expect(node.showInGallery).toBe(false);
	});
});
