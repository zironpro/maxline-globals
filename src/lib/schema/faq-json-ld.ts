export type FaqSchemaEntry = {
	question: string;
	answer: string;
};

export function buildFaqPageJsonLd(entries: FaqSchemaEntry[]) {
	return {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		mainEntity: entries.map((faq) => ({
			"@type": "Question",
			name: faq.question,
			acceptedAnswer: {
				"@type": "Answer",
				text: faq.answer,
			},
		})),
	};
}
