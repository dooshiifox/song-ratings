import * as fs from "node:fs/promises";
import type { PageServerLoad } from "./$types";

export const prerender = true;

export type Rating = {
	file: string;
	rating: number | null;
	base_bias: number;
	bias: number;
	play_count: number;
	artist: string | null;
	album: string | null;
	title: string | null;
	disc: number | null;
	track: number | null;
	duration: number;
	year: number | null;
};

export const load: PageServerLoad = async () => {
	const file = await fs.readFile("src/data.csv", "utf8");

	const lines = file.split("\n");
	const checkline = lines.shift();
	if (
		checkline !==
		"file,rating,base_bias,play_count,artist,album,title,disc,track,duration,year"
	) {
		throw new Error("Checkline is not correct!");
	}

	const ratings: Array<Rating> = [];
	for (const line of lines) {
		const [
			file = null,
			rating = null,
			base_bias = null,
			play_count = null,
			artist = null,
			album = null,
			title = null,
			disc = null,
			track = null,
			duration = null,
			year = null
		] = get_csv_line(line);

		const BIAS = [0, 0, 0, 0, 0, 0.1, 0.3, 0.8, 1, 0.9, 0.6];
		const rating_int = rating === null ? null : parseInt(rating);
		const base_bias_int = parseFloat(base_bias ?? "1");
		const bias = BIAS[rating_int ?? 0]! * base_bias_int;

		ratings.push({
			file: file ?? "UNKNOWN FILE",
			rating: rating_int,
			base_bias: base_bias_int,
			bias,
			play_count: parseInt(play_count ?? "0"),
			artist,
			album,
			title,
			disc: disc === null ? null : parseInt(disc),
			track: track === null ? null : parseInt(track),
			duration: parseFloat(duration ?? "0"),
			year: year === null ? null : parseInt(year)
		});
	}

	return {
		ratings
	};
};

function get_csv_line(line: string): Array<string | null> {
	let i = 0;
	const entries = [];

	// Get the next entry
	while (i < line.length) {
		if (line[i] === '"') {
			// Escaped entry
			i++;
			const startIndex = i;
			// Until we reach a `"` with no second `"` after it, this is part
			// of the same string.
			while (i < line.length) {
				if (line[i] === '"') {
					if (line[i + 1] === '"') {
						i += 2;
					} else {
						break;
					}
				} else {
					i++;
				}
			}
			// `|| null` handles the case where it was empty.
			entries.push(line.substring(startIndex, i).replace(/""/g, '"') || null);
			// Skip over the closing quote and comma
			i += 2;
		} else {
			const startIndex = i;
			// Read up to the next comma
			while (i < line.length && line[i] !== ",") {
				i++;
			}
			// `|| null` handles the case where it was empty.
			entries.push(line.substring(startIndex, i) || null);
			// Skip over the comma
			i++;
		}
	}

	if (line[line.length - 1] === ",") {
		// Last entry was empty
		entries.push(null);
	}

	return entries;
}
