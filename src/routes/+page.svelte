<script lang="ts">
	import { SEARCH_PRIORITIES, filterByString } from "albtc";
	import Table, { type SortOrder, type SortBy } from "./Table.svelte";

	let { data } = $props();

	function compare(a: string | number | null, b: string | number | null) {
		// negative means b comes first, else a comes first
		if (a === b) return 0;
		if (a === null) return 1;
		if (b === null) return -1;
		if (typeof a === "string") return a.localeCompare(b as string);
		return (b as number) - a;
	}

	let search = $state("");
	let sort_by = $state<SortBy>("track-album-artist");
	let sort_order = $state<SortOrder>("desc");

	function toSorted<T>(arr: Array<T>, fn: (a: T, b: T) => number): Array<T> {
		if (typeof Array.prototype.toSorted === "function") return arr.toSorted(fn);
		return arr.slice().sort(fn);
	}
	function toReversed<T>(arr: Array<T>): Array<T> {
		if (typeof Array.prototype.toReversed === "function")
			return arr.toReversed();
		return arr.slice().reverse();
	}

	let sorted_data = $derived.by(() => {
		if (sort_by === "track-album-artist") {
			return toSorted(
				data.ratings,
				(a, b) =>
					compare(a.album, b.album) ||
					// Yes this reversal is intentional
					compare(b.disc, a.disc) ||
					compare(b.track, a.track) ||
					compare(a.title, b.title) ||
					compare(a.file, b.file)
			);
		}

		const sort_by_but_typed_correctly = sort_by;
		return toSorted(data.ratings, (a, b) =>
			compare(a[sort_by_but_typed_correctly], b[sort_by_but_typed_correctly])
		);
	});
	let sorted_ordered_data = $derived(
		sort_order === "desc" ? sorted_data : toReversed(sorted_data)
	);
	let search_results = $derived(
		filterByString(search, sorted_ordered_data, (item) => [
			{
				bias: 1,
				value: item.rating?.toString() ?? "",
				minPriority: SEARCH_PRIORITIES.EXACT_MATCH
			},
			{
				bias: 1,
				value: item.title ?? "",
				minPriority: SEARCH_PRIORITIES.INCLUDES
			},
			{
				bias: 1,
				value: item.album ?? "",
				minPriority: SEARCH_PRIORITIES.INCLUDES
			},
			{
				bias: 1,
				value: item.artist ?? "",
				minPriority: SEARCH_PRIORITIES.INCLUDES
			},
			{
				bias: 1,
				value: item.file,
				minPriority: SEARCH_PRIORITIES.EXACT_MATCH
			}
		])
	);
</script>

<svelte:head>
	<title>da best songs eva</title>
</svelte:head>

<div class="min-h-dvh bg-slate-200 px-4 pb-80 pt-16 text-xl text-slate-900">
	<div class="mx-auto max-2xl:max-w-2xl 2xl:w-[1400px]">
		<h1 class="w-full scale-x-110 px-8 text-center text-5xl font-extrabold">
			Songs that are good.
		</h1>
		<h2 class="mt-2 text-center text-2xl">My list of song ratings.</h2>

		<main class="mt-12 flex w-full flex-col gap-24">
			<div class="w-full">
				<input
					class="w-full rounded-xl border border-slate-400 bg-transparent px-8 py-2 text-2xl font-bold transition-all placeholder:font-normal placeholder:text-slate-400 focus:bg-slate-100 focus:outline focus:outline-amber-500"
					placeholder="Search&hellip;"
					type="text"
					autocomplete="off"
					bind:value={search}
				/>
				<p class="ml-4 mt-1 text-base text-slate-700">
					Try search a title, album, rating, etc.
				</p>

				{#if search_results.length === 0}
					<div class="mt-8 text-center text-2xl text-slate-700">
						No results found.
					</div>
				{:else}
					{#if search === ""}
						<p class="ml-4 mt-1 text-base text-slate-700">
							Showing all <span class="font-bold">{data.ratings.length}</span> ratings.
						</p>
					{:else}
						<p class="ml-4 mt-1 text-base text-slate-700">
							Search matched <span class="font-bold"
								>{search_results.length}</span
							>
							of {data.ratings.length} ratings.
						</p>
					{/if}

					<div class="mt-8 text-base max-md:-mx-2">
						<Table data={search_results} bind:sort_by bind:sort_order />
					</div>
				{/if}
			</div>
		</main>
	</div>
</div>
