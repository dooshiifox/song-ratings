import type { PageServerLoad } from "./$types";
import { readRatingFiles } from "./ratingReader";

export const prerender = true;

export const load: PageServerLoad = async () => {
	return {
		ratings: readRatingFiles()
	};
};
