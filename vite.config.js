import { sveltekit } from '@sveltejs/kit/vite';
import fs from 'fs';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit(), rawFonts(['.ttf'])],
	ssr: {
		// due to https://github.com/airjp73/remix-validated-form/issues/230
		noExternal: ['zod-form-data']
	}
};

function rawFonts(ext) {
	return {
		name: 'vite-plugin-raw-fonts',
		resolveId(id) {
			return ext.some((e) => id.endsWith(e)) ? id : null;
		},
		transform(code, id) {
			if (ext.some((e) => id.endsWith(e))) {
				const buffer = fs.readFileSync(id);
				return { code: `export default ${JSON.stringify(buffer)}`, map: null };
			}
		}
	};
}

export default config;
