<script lang="ts" context="module">
	export type SortBy =
		| "track-album-artist"
		| "rating"
		| "bias"
		| "file"
		| "base_bias"
		| "play_count"
		| "artist"
		| "album"
		| "title"
		| "duration"
		| "year";
	export type SortOrder = "asc" | "desc";
</script>

<script lang="ts">
	import { formatDuration } from "albtc";
	import type { Rating } from "./+page.server";

	let {
		data,
		sort_by = $bindable(),
		sort_order = $bindable()
	}: {
		data: Array<Rating>;
		sort_by: SortBy;
		sort_order: SortOrder;
	} = $props();

	let page = $state(0);
	const PER_PAGE = 100;
	let max_pages = $derived(Math.max(Math.ceil(data.length / PER_PAGE) - 1, 0));
	$effect(() => {
		data;
		page = Math.max(Math.min(max_pages, page), 0);
	});

	let on_page = $derived(data.slice(page * PER_PAGE, (page + 1) * PER_PAGE));

	export function getEstimatedMetadataFromPath(path: string): {
		album: string;
		artist: string;
		title: string;
	} {
		const split = path.split("/");
		// Remove the extension from the track name (.mp3, .flac, etc)
		const title = split.pop()!.replace(/\.[^.]+$/, "");
		const [artist, ...album] = (split[0] ?? "").split("-");
		return { title, artist: artist?.trim() ?? "", album: album.join("-") };
	}

	function sensibleNumber(num: number) {
		return (num * 10).toPrecision(4).replace(/0*$/g, "").replace(/\.$/, "");
	}

	$inspect(sort_by);
</script>

<div>
	<div
		class="sticky top-0 -mx-12 border-b border-b-slate-400 bg-slate-200/30 px-12 pb-0.5 pt-4 backdrop-blur-lg"
	>
		<div class="mb-2 flex flex-row items-center justify-end gap-4">
			<select bind:value={sort_by} class="rounded bg-slate-100 px-4 py-1">
				<option value="track-album-artist">Default</option>
				<option value="rating">Rating</option>
				<option value="duration">Duration</option>

				<option value="bias">Bias</option>
				<option value="file">Filename</option>
				<option value="base_bias">Base Bias</option>
				<option value="play_count">Play Count</option>
				<option value="artist">Artist</option>
				<option value="album">Album</option>
				<option value="title">Title</option>
				<option value="year">Year</option>
			</select>

			<button
				onclick={() => (sort_order = sort_order === "asc" ? "desc" : "asc")}
				class="rounded p-2 hover:bg-slate-300 active:bg-slate-400 disabled:hover:bg-transparent"
			>
				{#if sort_order === "asc"}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
						class="size-5"
					>
						<path
							fill-rule="evenodd"
							d="M2 3.75A.75.75 0 0 1 2.75 3h11.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 3.75ZM2 7.5a.75.75 0 0 1 .75-.75h6.365a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 7.5ZM14 7a.75.75 0 0 1 .55.24l3.25 3.5a.75.75 0 1 1-1.1 1.02l-1.95-2.1v6.59a.75.75 0 0 1-1.5 0V9.66l-1.95 2.1a.75.75 0 1 1-1.1-1.02l3.25-3.5A.75.75 0 0 1 14 7ZM2 11.25a.75.75 0 0 1 .75-.75H7A.75.75 0 0 1 7 12H2.75a.75.75 0 0 1-.75-.75Z"
							clip-rule="evenodd"
						/>
					</svg>
				{:else}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
						class="size-5"
					>
						<path
							fill-rule="evenodd"
							d="M2 3.75A.75.75 0 0 1 2.75 3h11.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 3.75ZM2 7.5a.75.75 0 0 1 .75-.75h7.508a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 7.5ZM14 7a.75.75 0 0 1 .75.75v6.59l1.95-2.1a.75.75 0 1 1 1.1 1.02l-3.25 3.5a.75.75 0 0 1-1.1 0l-3.25-3.5a.75.75 0 1 1 1.1-1.02l1.95 2.1V7.75A.75.75 0 0 1 14 7ZM2 11.25a.75.75 0 0 1 .75-.75h4.562a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1-.75-.75Z"
							clip-rule="evenodd"
						/>
					</svg>
				{/if}
			</button>

			<div class="w-8"></div>

			<button
				onclick={() => (page = Math.max(page - 1, 0))}
				disabled={page === 0}
				class="rounded p-2 hover:bg-slate-300 active:bg-slate-400 disabled:hover:bg-transparent"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
					fill="currentColor"
					class="size-5"
				>
					<path
						fill-rule="evenodd"
						d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
						clip-rule="evenodd"
					/>
				</svg>
			</button>

			<p class="text-slate-900">
				Page <span class="inline-block w-[2ch] text-center font-bold"
					>{page + 1}</span
				>
				of <span class="inline-block w-[2ch] text-center">{max_pages}</span>
			</p>

			<button
				onclick={() => (page = Math.min(page + 1, max_pages))}
				disabled={page === max_pages}
				class="rounded p-2 hover:bg-slate-300 active:bg-slate-400 disabled:hover:bg-transparent"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
					fill="currentColor"
					class="size-5"
				>
					<path
						fill-rule="evenodd"
						d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
						clip-rule="evenodd"
					/>
				</svg>
			</button>
		</div>

		<div
			class="grid-display grid w-full gap-x-4 text-sm font-medium uppercase text-slate-900"
		>
			<p>Title</p>
			<p>Track</p>
			<p>Album</p>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
				fill="currentColor"
				class="mr-2 size-5 justify-self-end"
			>
				<path
					fill-rule="evenodd"
					d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-13a.75.75 0 0 0-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 0 0 0-1.5h-3.25V5Z"
					clip-rule="evenodd"
				/>
			</svg>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
				fill="currentColor"
				class="mr-2 size-5 justify-self-end"
			>
				<path
					fill-rule="evenodd"
					d="M17.721 1.599a.75.75 0 0 1 .279.583v11.29a2.25 2.25 0 0 1-1.774 2.2l-2.041.44a2.216 2.216 0 0 1-.938-4.332l2.662-.577a.75.75 0 0 0 .591-.733V6.112l-8 1.73v7.684a2.25 2.25 0 0 1-1.774 2.2l-2.042.44a2.216 2.216 0 1 1-.935-4.331l2.659-.573A.75.75 0 0 0 7 12.529V4.236a.75.75 0 0 1 .591-.733l9.5-2.054a.75.75 0 0 1 .63.15Z"
					clip-rule="evenodd"
				/>
			</svg>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
				fill="currentColor"
				class="mr-2 size-5 justify-self-end"
			>
				<path
					fill-rule="evenodd"
					d="M5.75 2a.75.75 0 0 1 .75.75V4h7V2.75a.75.75 0 0 1 1.5 0V4h.25A2.75 2.75 0 0 1 18 6.75v8.5A2.75 2.75 0 0 1 15.25 18H4.75A2.75 2.75 0 0 1 2 15.25v-8.5A2.75 2.75 0 0 1 4.75 4H5V2.75A.75.75 0 0 1 5.75 2Zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75Z"
					clip-rule="evenodd"
				/>
			</svg>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
				fill="currentColor"
				class="mr-2 size-5 justify-self-end"
			>
				<path
					fill-rule="evenodd"
					d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z"
					clip-rule="evenodd"
				/>
			</svg>
		</div>
	</div>

	{#each on_page as song}
		<div class="grid-display my-2 grid w-full items-center gap-x-4">
			<div class="flex shrink grow flex-col overflow-hidden">
				<p
					class="truncate font-medium text-slate-950"
					class:italic={song.title === null}
				>
					{song.title ?? getEstimatedMetadataFromPath(song.file).title}
				</p>
				<p class="truncate text-slate-600" class:italic={song.artist === null}>
					{song.artist ?? getEstimatedMetadataFromPath(song.file).artist}
				</p>
			</div>

			<p class="truncate text-right font-mono text-slate-600">
				{#if song.disc !== null}
					{song.disc}.{song.track ?? "?"}
				{:else if song.track !== null}
					{song.track}
				{/if}
			</p>

			<p class="truncate text-slate-800" class:italic={song.album === null}>
				{song.album ?? getEstimatedMetadataFromPath(song.file).album}
			</p>

			<p class="truncate text-right font-mono font-medium text-slate-600">
				{formatDuration(song.duration * 1000)}
			</p>

			<p class="truncate text-right font-mono font-medium text-slate-600">
				{song.play_count}
			</p>

			<p class="truncate text-right font-mono font-medium text-slate-600">
				{song.year}
			</p>

			<div class="flex flex-row items-center justify-end gap-4">
				<div class="flex flex-col items-end">
					<p class="font-mono text-[10px] font-medium leading-3 text-slate-600">
						{song.base_bias}
					</p>
					<p class="font-mono text-[10px] font-medium leading-3 text-slate-600">
						{sensibleNumber(song.bias)}
					</p>
				</div>

				<p
					class="w-[2ch] text-right font-mono text-lg font-medium text-slate-950"
				>
					{song.rating}
				</p>
			</div>
		</div>
	{/each}
</div>

<style>
	.grid-display {
		grid-template-columns:
			[title] minmax(200px, 6fr) [trackDisc] 48px [album] minmax(200px, 4fr)
			[duration] minmax(80px, 1fr) [playcount] minmax(80px, 1fr)
			[year] minmax(80px, 1fr) [rating] minmax(80px, 1fr);
	}
</style>
