// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

declare module '*.webp' {
	const value: string;
	export default value;
}

declare module '*.png' {
	const value: string;
	export default value;
}

export {};
