import type { MetadataRoute } from "next";

import { siteConfig } from "@/constants/site-config";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: [
			{
				userAgent: "*",
				allow: "/",
				disallow: [
					"/wp-admin/",
					"/wp-login.php",
					"/xmlrpc.php",
					"/readme.html",
					"/*?s=",
					"/search/",
					"/feed/",
					"/*/feed/",
					"/api/",
					"/_next/",
					"/admin/",
					"/private/",
				],
			},
			{
				userAgent: [
					"GPTBot",
					"OAI-SearchBot",
					"ClaudeBot",
					"PerplexityBot",
					"Google-Extended",
				],
				allow: "/",
			},
			{
				userAgent: ["CCBot", "anthropic-ai"],
				disallow: "/",
			},
		],
		sitemap: `${siteConfig.site}/sitemap.xml`,
		host: siteConfig.site,
	};
}
