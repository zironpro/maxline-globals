import Link from "next/link";

import { IconBrandWhatsapp } from "@tabler/icons-react";

export const WhatsappFloatingButton = () => {
	// Using the UAE Head Office phone number from constants as default WhatsApp number
	const phoneNumber = "+97142822022";

	return (
		<div className="fixed right-6 bottom-6 z-50 flex h-14 w-14 items-center justify-center">
			<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
			<Link
				aria-label="Chat on WhatsApp"
				className="relative flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition-transform hover:scale-110 hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-300"
				href={`https://wa.me/${phoneNumber}`}
				rel="noopener noreferrer"
				target="_blank"
			>
				<IconBrandWhatsapp size={32} />
			</Link>
		</div>
	);
};
