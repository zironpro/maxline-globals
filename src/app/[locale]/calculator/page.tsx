import type { Metadata } from "next";
import Script from "next/script";

import { Locale } from "next-intl";
import { setRequestLocale } from "next-intl/server";

import { siteConfig } from "@/constants/site-config";
import { CalculatorPageView } from "@/feature/calculator/calculator-page-view";
import { routing } from "@/i18n/routing";

const title = "Guangzhou to Jebel Ali Freight Calculator | Maxline Global";
const description =
	"Get instant LCL/FCL shipping rates from Guangzhou to Jebel Ali. Calculate CBM, compare volumes, and request a fast quote. Reliable GCC logistics by Maxline Global.";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
	const { locale } = await params;

	const url = `${siteConfig.site}/${locale}/calculator`;

	return {
		title,
		description,
		keywords:
			"Guangzhou to Jebel Ali freight, freight calculator, LCL FCL shipping rates, GCC logistics, Dubai warehousing, freight forwarding, Maxline Global",
		metadataBase: new URL(siteConfig.site),
		openGraph: {
			title,
			description,
			url,
			siteName: siteConfig.name,
			images: [siteConfig.image],
			locale: locale,
			type: "website",
		},
		twitter: {
			card: "summary_large_image",
			title,
			description,
			images: [siteConfig.image.url],
		},
		alternates: {
			canonical: url,
			languages: routing.locales.reduce(
				(acc, l) => {
					acc[l] = `${siteConfig.site}/${l}/calculator`;
					return acc;
				},
				{} as Record<string, string>
			),
		},
		robots: {
			index: true,
			follow: true,
			nocache: false,
			googleBot: {
				index: true,
				follow: true,
				"max-video-preview": -1,
				"max-image-preview": "large",
				"max-snippet": -1,
			},
		},
	};
}

export default async function CalculatorPage({
	params,
}: {
	params: Promise<{ locale: Locale }>;
}) {
	const { locale } = await params;
	setRequestLocale(locale);

	const url = `${siteConfig.site}/${locale}/calculator`;

	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "WebPage",
		name: title,
		description,
		url,
		isPartOf: {
			"@type": "WebSite",
			name: siteConfig.name,
			url: siteConfig.site,
		},
		breadcrumb: {
			"@type": "BreadcrumbList",
			itemListElement: [
				{
					"@type": "ListItem",
					position: 1,
					name: "Home",
					item: siteConfig.site,
				},
				{ "@type": "ListItem", position: 2, name: "Calculator", item: url },
			],
		},
		mainEntity: {
			"@type": "Service",
			name: "Guangzhou to Jebel Ali Freight Calculator",
			provider: {
				"@type": "Organization",
				name: siteConfig.name,
				url: siteConfig.site,
			},
		},
	};

	return (
		<>
			<CalculatorPageView />
			<Script suppressHydrationWarning type="application/ld+json">
				{JSON.stringify(jsonLd)}
			</Script>
		</>
	);
}
