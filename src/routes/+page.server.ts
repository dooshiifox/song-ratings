import * as yaml from "js-yaml";
import * as fs from "node:fs/promises";
import * as v from "valibot";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
	// Read all files in the `src/data` directory
	const files = await fs.readdir("src/data");

	return {
		// Read the rating file for each file
		ratings: Promise.allSettled(
			files.map((file) => {
				return read_rating_file(`src/data/${file}`);
			})
		)
	};
};

const META_STRUCTURE = v.object(
	{
		name: v.string(),
		subtitle: v.optional(v.string()),
		rating: v.picklist([
			10, 9.5, 9, 8.5, 8, 7.5, 7, 6.5, 6, 5.5, 5, 4.5, 4, 3.5, 3, 2.5, 2, 1, 0
		]),
		finished: v.optional(v.nullable(v.boolean()), null),
		tags: v.optional(v.array(v.string()), [])
	},
	v.never()
);

export type Rating = Awaited<ReturnType<typeof read_rating_file>>;
async function read_rating_file(file: string) {
	const contents = await fs.readFile(file, "utf8");

	// The file is formatted like an astro component,
	// where metadata is at the top of the file surrounded
	// in `---`. The rest is markdown content.
	const [nothing_hopefully, metadata, content] = contents.split("---");
	if (nothing_hopefully !== "") {
		throw new Error(`Expected nothing before first '---' in '${file}'`);
	}
	if (metadata === undefined || metadata === "") {
		throw new Error(`Expected metadata in '${file}'`);
	}
	if (content === undefined || content === "") {
		throw new Error(`Expected content after metadata in '${file}'`);
	}

	// Parse the metadata into an object
	const metaYaml = yaml.load(metadata.trim());
	const metaParsed = v.safeParse(META_STRUCTURE, metaYaml);
	if (!metaParsed.success) {
		console.warn(metaParsed.issues);
		throw new Error(`Invalid metadata in '${file}'`);
	}

	return {
		id: file.split("/").pop()!.split(".").shift()!,
		meta: metaParsed.output,
		content: content.trim()
	};
}
