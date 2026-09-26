import { describe, it, expect } from 'vitest';
import { buildShareUrl, parseView } from './view';

const params = (query: string) => new URLSearchParams(query);

describe('parseView', () => {
	it('reads yaw, pitch, and zoom', () => {
		expect(parseView(params('yaw=123.4&pitch=-5.2&zoom=40'))).toEqual({
			yaw: 123.4,
			pitch: -5.2,
			zoom: 40
		});
	});

	it('treats zoom as optional', () => {
		expect(parseView(params('yaw=10&pitch=0'))).toEqual({ yaw: 10, pitch: 0 });
	});

	it('needs both yaw and pitch as numbers', () => {
		expect(parseView(params(''))).toBeNull();
		expect(parseView(params('yaw=10'))).toBeNull();
		expect(parseView(params('pitch=10'))).toBeNull();
		expect(parseView(params('yaw=abc&pitch=0'))).toBeNull();
		expect(parseView(params('yaw=&pitch=0'))).toBeNull();
		expect(parseView(params('yaw=Infinity&pitch=0'))).toBeNull();
	});

	it('normalizes out-of-range values from hand-edited links', () => {
		expect(parseView(params('yaw=370&pitch=120&zoom=250'))).toEqual({
			yaw: 10,
			pitch: 90,
			zoom: 100
		});
		expect(parseView(params('yaw=-90&pitch=-100&zoom=-5'))).toEqual({
			yaw: 270,
			pitch: -90,
			zoom: 0
		});
	});

	it('ignores an invalid zoom but keeps the direction', () => {
		expect(parseView(params('yaw=10&pitch=5&zoom=big'))).toEqual({ yaw: 10, pitch: 5 });
	});
});

describe('buildShareUrl', () => {
	const base = new URL('https://tour.example/?node=old&yaw=1&pitch=2&utm_source=x');

	it('encodes scene and view in degrees, dropping other params', () => {
		const url = new URL(
			buildShareUrl(base, 'lobby', { yaw: Math.PI / 2, pitch: -Math.PI / 12 }, 37.6)
		);
		expect(url.origin + url.pathname).toBe('https://tour.example/');
		expect(Object.fromEntries(url.searchParams)).toEqual({
			node: 'lobby',
			yaw: '90',
			pitch: '-15',
			zoom: '38'
		});
	});

	it('round-trips through parseView', () => {
		const url = new URL(buildShareUrl(base, 'lobby', { yaw: 5.5, pitch: 0.3 }, 50));
		const view = parseView(url.searchParams)!;
		expect(view.yaw).toBeCloseTo((5.5 * 180) / Math.PI, 1);
		expect(view.pitch).toBeCloseTo((0.3 * 180) / Math.PI, 1);
		expect(view.zoom).toBe(50);
	});
});
