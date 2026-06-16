import fs from "fs";
import path from "path";

export interface Lead {
	id: number;
	name: string;
	email: string;
	phone: string;
	company_name: string;
	weight: number;
	cbm: number;
	documentation_required: boolean;
	calculated_price: number;
	created_at: string;
}

const DB_FILE = path.join(process.cwd(), "data", "leads.json");

function ensureDb() {
	const dir = path.dirname(DB_FILE);
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true });
	}
	if (!fs.existsSync(DB_FILE)) {
		fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2), "utf-8");
	}
}

export async function saveLead(
	leadData: Omit<Lead, "id" | "created_at">
): Promise<Lead> {
	ensureDb();

	const data = await fs.promises.readFile(DB_FILE, "utf-8");
	const leads: Lead[] = JSON.parse(data);

	// Generate next id (starting at 10001)
	const nextId =
		leads.length > 0 ? Math.max(...leads.map((l) => l.id)) + 1 : 10001;

	const newLead: Lead = {
		id: nextId,
		...leadData,
		created_at: new Date().toISOString(),
	};

	leads.push(newLead);

	await fs.promises.writeFile(DB_FILE, JSON.stringify(leads, null, 2), "utf-8");

	return newLead;
}

export async function getLeads(): Promise<Lead[]> {
	ensureDb();
	const data = await fs.promises.readFile(DB_FILE, "utf-8");
	return JSON.parse(data);
}
