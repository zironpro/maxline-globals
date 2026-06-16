"use server";

import { cookies, headers } from "next/headers";

import { render } from "@react-email/components";

import { LeadEmail } from "@/emails/lead-template";
import { saveLead } from "@/lib/db";
import { sendMetaCapiEvent } from "@/lib/meta-pixel";
import { sendMicrosoftEmail } from "@/lib/transporter";

export async function sendLeadEmail(data: {
	name: string;
	email: string;
	phone: string;
	companyName?: string;
	grossWeight: string;
	volume: string;
	chargeableVolume: number;
	totalCost: number;
	localDoc: boolean;
	eventSourceUrl: string;
}) {
	try {
		// 1. Save lead in database
		const savedLead = await saveLead({
			name: data.name,
			email: data.email,
			phone: data.phone,
			company_name: data.companyName || "",
			weight: Number.parseFloat(data.grossWeight) || 0,
			cbm: Number.parseFloat(data.volume) || 0,
			documentation_required: data.localDoc,
			calculated_price: data.totalCost,
		});

		// Event ID matches database ID for deduplication
		const eventId = `lead_${savedLead.id}`;

		// 2. Extract client identifiers for Conversions API (CAPI)
		const cookieStore = await cookies();
		const fbp = cookieStore.get("_fbp")?.value;
		const fbc = cookieStore.get("_fbc")?.value;

		const headersList = await headers();
		const userAgent = headersList.get("user-agent") || "";
		// Extract IP from forward headers
		const ip =
			headersList.get("x-forwarded-for")?.split(",")[0].trim() ||
			headersList.get("x-real-ip") ||
			"127.0.0.1";

		// 3. Send CAPI Lead Event
		await sendMetaCapiEvent({
			eventName: "Lead",
			eventId: eventId,
			eventSourceUrl: data.eventSourceUrl,
			userData: {
				email: data.email,
				phone: data.phone,
				clientIpAddress: ip,
				clientUserAgent: userAgent,
				fbp,
				fbc,
			},
		});

		// 4. Send email notification
		const html = await render(<LeadEmail data={data} />);

		await sendMicrosoftEmail({
			subject: `New Calculator Lead: ${data.name}`,
			html,
			name: data.name,
			replyToEmail: data.email,
		});

		return { success: true, eventId };
	} catch (error) {
		console.error("[sendLeadEmail] Failed to process lead:", error);
		return { success: false, error: "Failed to process lead" };
	}
}
