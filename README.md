# marvel-by-year

A site to browse the Marvel Unlimited reading service by release year. Built with [SvelteKit](https://kit.svelte.dev/), TypeScript, Redis (via [Upstash](https://upstash.com/)), and [Open Props](https://open-props.style/), and hosted on Netlify.

For more about how and why I built this, see my [blog post](https://geoffrich.net/posts/marvel-unlimited-by-year/).

## Commands

- `npm run dev` run dev server
- `npm run build` build for production

See also the [SvelteKit CLI docs](https://kit.svelte.dev/docs#command-line-interface).

## Marvel API

To develop this site, you will need to sign up for a [Marvel API key](https://developer.marvel.com/documentation/getting_started). Once you have the keys, create a `.env` file and store the keys in environment variables.

```
MARVEL_PRIVATE_KEY=key_goes_here
MARVEL_PUBLIC_KEY=key_goes_here
```

## Redis

This site caches the Marvel API responses in Redis. You do not need a valid Redis connection to develop, though setting one up will prevent reaching the Marvel API rate limit. Either provide a REDIS_CONNECTION environment variable or start a [local Redis server](https://redis.io/topics/quickstart).
