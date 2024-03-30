import adapterCloudflare from "@sveltejs/adapter-cloudflare";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {Record<string, string>} */
const IMPORT_ALIASES = {
	$: "./src",
	"@": "./src/components",
	$routes: "./src/routes"
};

/** Counts the number of times `substr` occurs in `str`
 * @param {string} str
 * @param {string} substr
 * @returns {number}
 */
function occurances(str, substr) {
	return str.split(substr).length - 1;
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapterCloudflare(),
		// In vscode auto-import, things higher to the top are more likely
		// to be recommended. As such, put the deepest imports at the top.
		// E.g.,
		// { "$": "./src", "$utils": "./src/utils" } would recommend
		// `$/utils/file.ts` and not `$utils/file.ts`.
		// { "$utils": "./src/utils", "$": "./src" } would recommend
		// `$utils/file.ts`, the preferred one.
		alias: Object.fromEntries(
			Object.entries(IMPORT_ALIASES).sort(
				([_, a], [__, b]) => occurances(b, "/") - occurances(a, "/")
			)
		)
	}
};

// eslint-disable-next-line import/no-default-export
export default config;
