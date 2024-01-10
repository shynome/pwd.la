import { writable } from 'svelte/store';

export const WithPending = (pending = false) => {
	const { subscribe, update, set } = writable(pending);
	const call = (f: () => any) => {
		update((pending) => {
			if (pending) {
				return true;
			}
			Promise.resolve()
				.then(f)
				.finally(() => {
					set(false);
					return;
				});
			return true;
		});
	};
	return {
		subscribe,
		call: call
	};
};

export default WithPending;
