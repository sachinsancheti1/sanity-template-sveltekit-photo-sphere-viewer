/** A camera view encoded in a share link: yaw/pitch in degrees, zoom 0–100 (PSV zoom level). */
export type TourView = {
	yaw: number;
	pitch: number;
	zoom?: number;
};

/** Query params that describe a view; dropped once the visitor moves to another scene. */
export const VIEW_PARAMS = ['yaw', 'pitch', 'zoom'] as const;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const round1 = (value: number) => Math.round(value * 10) / 10;

function readNumber(params: URLSearchParams, key: string): number | undefined {
	const raw = params.get(key);
	if (raw === null || raw.trim() === '') return undefined;
	const value = Number(raw);
	return Number.isFinite(value) ? value : undefined;
}

/**
 * Read the view from a share link. Needs both yaw and pitch; out-of-range values are normalized
 * (yaw wraps to 0–360, pitch and zoom are clamped) so a hand-edited link still opens sensibly.
 */
export function parseView(params: URLSearchParams): TourView | null {
	const yaw = readNumber(params, 'yaw');
	const pitch = readNumber(params, 'pitch');
	if (yaw === undefined || pitch === undefined) return null;

	const view: TourView = {
		yaw: round1(((yaw % 360) + 360) % 360),
		pitch: round1(clamp(pitch, -90, 90))
	};
	const zoom = readNumber(params, 'zoom');
	if (zoom !== undefined) view.zoom = Math.round(clamp(zoom, 0, 100));
	return view;
}

/** Link that opens `nodeId` looking where the visitor is looking (PSV positions are radians). */
export function buildShareUrl(
	base: URL,
	nodeId: string,
	position: { yaw: number; pitch: number },
	zoom: number
): string {
	const url = new URL(base.pathname, base.origin);
	const toDegrees = (radians: number) => (radians * 180) / Math.PI;
	url.searchParams.set('node', nodeId);
	url.searchParams.set('yaw', String(round1(((toDegrees(position.yaw) % 360) + 360) % 360)));
	url.searchParams.set('pitch', String(round1(clamp(toDegrees(position.pitch), -90, 90))));
	url.searchParams.set('zoom', String(Math.round(clamp(zoom, 0, 100))));
	return url.href;
}
