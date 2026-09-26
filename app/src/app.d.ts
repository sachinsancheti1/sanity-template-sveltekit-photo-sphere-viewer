// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		interface PageState {
			/** Tour scene shown for this history entry (shallow routing, see routes/+page.svelte) */
			nodeId?: string;
		}
		// interface Platform {}
	}
}

export {};
