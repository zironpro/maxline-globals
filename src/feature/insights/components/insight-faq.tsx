"use client";

import {
	Children,
	isValidElement,
	type ReactElement,
	type ReactNode,
} from "react";

import Script from "next/script";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { buildFaqPageJsonLd } from "@/lib/schema/faq-json-ld";
import { cn } from "@/lib/utils";

export type InsightFaqItemProps = {
	question: string;
	schemaAnswer: string;
	children: ReactNode;
};

/** Collected by `InsightFaq`; not rendered on its own. */
export function InsightFaqItem(_props: InsightFaqItemProps) {
	return null;
}

InsightFaqItem.displayName = "InsightFaqItem";

type InsightFaqProps = {
	title?: string;
	children: ReactNode;
	className?: string;
};

function isFaqItemElement(
	child: ReactNode
): child is ReactElement<InsightFaqItemProps> {
	if (!isValidElement(child)) return false;

	const props = child.props as Partial<InsightFaqItemProps>;

	return (
		typeof props.question === "string" &&
		typeof props.schemaAnswer === "string"
	);
}

function collectFaqItems(children: ReactNode) {
	return Children.toArray(children)
		.filter(isFaqItemElement)
		.map((child) => ({
			question: child.props.question,
			schemaAnswer: child.props.schemaAnswer,
			answer: child.props.children,
		}));
}

export function InsightFaq({
	title = "FAQ",
	children,
	className,
}: InsightFaqProps) {
	const items = collectFaqItems(children);

	if (items.length === 0) return null;

	const faqSchema = buildFaqPageJsonLd(
		items.map((item) => ({
			question: item.question,
			answer: item.schemaAnswer,
		}))
	);

	return (
		<section
			aria-labelledby="insight-faq-heading"
			className={cn("not-prose my-10", className)}
		>
			<Script id="insight-faq-schema" type="application/ld+json">
				{JSON.stringify(faqSchema)}
			</Script>

			<h3
				className="mb-4 font-display font-semibold text-2xl text-accent-tertiary md:text-3xl"
				id="insight-faq-heading"
			>
				{title}
			</h3>

			<Accordion
				collapsible
				defaultValue={items[0].question}
				type="single"
			>
				{items.map((item) => (
					<AccordionItem
						className="border-border/50 md:py-2"
						key={item.question}
						value={item.question}
					>
						<AccordionTrigger className="cursor-pointer py-2 text-start font-medium text-base hover:no-underline md:text-lg">
							{item.question}
						</AccordionTrigger>
						<AccordionContent className="pb-2 font-light text-base text-muted-foreground md:text-lg">
							{item.answer}
						</AccordionContent>
					</AccordionItem>
				))}
			</Accordion>
		</section>
	);
}
