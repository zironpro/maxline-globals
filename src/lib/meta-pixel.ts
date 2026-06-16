import crypto from "crypto";

export function sha256(value: string): string {
	return crypto.createHash("sha256").update(value).digest("hex");
}

export function hashEmail(email: string): string {
	return sha256(email.trim().toLowerCase());
}

export function hashPhone(phone: string): string {
	const cleaned = phone.replace(/\D/g, ""); // Keep only digits
	return sha256(cleaned);
}

export interface MetaCapiUserParams {
	email: string;
	phone: string;
	clientIpAddress: string;
	clientUserAgent: string;
	fbp?: string;
	fbc?: string;
}

export async function sendMetaCapiEvent(params: {
	eventName: string;
	eventId: string;
	eventSourceUrl: string;
	userData: MetaCapiUserParams;
}) {
	const pixelId = process.env.META_PIXEL_ID || "2267491257388701";
	const accessToken = process.env.META_ACCESS_TOKEN;

	const hashedEmail = hashEmail(params.userData.email);
	const hashedPhone = hashPhone(params.userData.phone);

	const userDataPayload: Record<string, unknown> = {
		em: [hashedEmail],
		ph: [hashedPhone],
		client_ip_address: params.userData.clientIpAddress,
		client_user_agent: params.userData.clientUserAgent,
	};

	if (params.userData.fbp) {
		userDataPayload.fbp = params.userData.fbp;
	}
	if (params.userData.fbc) {
		userDataPayload.fbc = params.userData.fbc;
	}

	const eventData = {
		event_name: params.eventName,
		event_time: Math.floor(Date.now() / 1000),
		action_source: "website",
		event_id: params.eventId,
		event_source_url: params.eventSourceUrl,
		user_data: userDataPayload,
	};

	const payload: Record<string, unknown> = {
		data: [eventData],
	};

	// Add test event code if configured for Testing in Events Manager
	if (process.env.META_TEST_EVENT_CODE) {
		payload.test_event_code = process.env.META_TEST_EVENT_CODE;
	}

	console.log(
		`[Meta CAPI] Preparing event: ${params.eventName} with ID: ${params.eventId}`
	);
	console.log(
		"[Meta CAPI] Payload structure:",
		JSON.stringify(payload, null, 2)
	);

	if (!accessToken) {
		console.warn(
			"[Meta CAPI] META_ACCESS_TOKEN is missing in environment variables. CAPI request skipped."
		);
		return { success: false, reason: "META_ACCESS_TOKEN missing" };
	}

	try {
		const url = `https://graph.facebook.com/v23.0/${pixelId}/events?access_token=${accessToken}`;
		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(payload),
		});

		const resData = await response.json();
		console.log("[Meta CAPI] API Response:", JSON.stringify(resData, null, 2));

		if (!response.ok) {
			console.error("[Meta CAPI] API Error Response Status:", response.status);
			return { success: false, error: resData };
		}

		return { success: true, response: resData };
	} catch (err) {
		console.error("[Meta CAPI] Fetch request failed:", err);
		return { success: false, error: err };
	}
}
