import { WhatsappFloatingButton } from "@/components/whatsapp-floating-button";

import { Cta } from "../cta";
import { Services } from "../home/sections/services";
import { BenefitsSection } from "./sections/benifits";
import { HeroSection } from "./sections/hero";
import { HowItWorksSection } from "./sections/how-it-works-section";
import { WhyThisMattersSection } from "./sections/why-matters-section";

export const CalculatorPageView = () => {
	return (
		<main>
			<HeroSection />
			{/* <CalculatorSection /> */}
			<HowItWorksSection />
			<WhyThisMattersSection />
			<Services title="End-to-End Logistics Services to your exact specifications." />
			<BenefitsSection />
			<Cta />
			<WhatsappFloatingButton />
		</main>
	);
};
