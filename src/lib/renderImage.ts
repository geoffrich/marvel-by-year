import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { html as toReactNode } from 'satori-html';

// we use a Vite plugin to turn this import into the result of fs.readFileSync during build
import roboto from '$lib/fonts/Roboto-Regular.ttf';
import { dev } from '$app/environment';

export async function componentToPng(component, props, height, width) {
	const result = component.render(props);
	const markup = toReactNode(result.html);

	const svg = await satori(markup, {
		fonts: [
			{
				name: 'Noto',
				data: Buffer.from(roboto),
				style: 'normal'
			}
		],
		height: +height,
		width: +width
	});

	const resvg = new Resvg(svg, {
		fitTo: {
			mode: 'width',
			value: +width
		}
	});

	const png = resvg.render();

	return new Response(png.asPng(), {
		headers: {
			'content-type': 'image/png',
			'cache-control': dev ? 'no-cache, no-store' : 'public, immutable, no-transform, max-age=86400'
		}
	});
}
