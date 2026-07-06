/** Slug segment from `/services/{slug}` → key in services.{locale}.json */
export const SLUG_TO_SERVICE_DICT_KEY: Record<string, string> = {
	"land-freight-services-dubai": "landFreight",
	"air-freight-tracking-dubai": "airFreight",
	"international-sea-freight-services-dubai": "seaFreight",
	"project-cargo-services-dubai": "projectCargo",
	"export-packing-services-dubai": "packing",
	"warehouse-storage-services-dubai": "warehousing",
	"exhibition-logistics-services-dubai": "exhibitionCargo",
	"movers-lashing": "moversLashing",
};

export function serviceDictKeyFromHref(href: string): string | undefined {
	const slug = href.split("/").filter(Boolean).pop();
	if (!slug) return undefined;
	return SLUG_TO_SERVICE_DICT_KEY[slug];
}
