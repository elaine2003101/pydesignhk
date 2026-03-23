export type LeadRequestType = "moodboard" | "consultation" | "both";
export type LeadStage = "new" | "contacted" | "qualified" | "quoted";

export interface IdeaStarterLead {
  id: string;
  name: string;
  email: string;
  contact: string;
  requestType: LeadRequestType;
  notes: string;
  room: string;
  budget: string;
  style: string;
  createdAt: string;
  stage: LeadStage;
  source: "idea-starter";
}

export interface LeadDestinationSettings {
  emailRecipients: string;
  googleSheetsWebhookUrl: string;
  airtableWebhookUrl: string;
  openMailClient: boolean;
}

export interface EstimateLeadDraft {
  clientName: string;
  clientEmail: string;
  projectBrief: string;
  renovationType: string;
  materialTier: string;
  addOns: string[];
}

const LEADS_STORAGE_KEY = "ideaStarterLeads";
const LEAD_SETTINGS_STORAGE_KEY = "leadDestinationSettings";
const SELECTED_LEAD_STORAGE_KEY = "selectedLeadForEstimate";

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function createLeadId() {
  return `lead-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function getIdeaStarterLeads() {
  return readJson<IdeaStarterLead[]>(LEADS_STORAGE_KEY, []);
}

export function saveIdeaStarterLead(lead: IdeaStarterLead) {
  const leads = getIdeaStarterLeads();
  writeJson(LEADS_STORAGE_KEY, [lead, ...leads]);
  return lead;
}

export function updateIdeaStarterLead(
  leadId: string,
  patch: Partial<IdeaStarterLead>,
) {
  const updatedLeads = getIdeaStarterLeads().map((lead) =>
    lead.id === leadId ? { ...lead, ...patch } : lead,
  );

  writeJson(LEADS_STORAGE_KEY, updatedLeads);
  return updatedLeads.find((lead) => lead.id === leadId) ?? null;
}

export function getLeadById(leadId: string) {
  return getIdeaStarterLeads().find((lead) => lead.id === leadId) ?? null;
}

export function getLeadDestinationSettings(): LeadDestinationSettings {
  return readJson<LeadDestinationSettings>(LEAD_SETTINGS_STORAGE_KEY, {
    emailRecipients: "",
    googleSheetsWebhookUrl: "",
    airtableWebhookUrl: "",
    openMailClient: false,
  });
}

export function saveLeadDestinationSettings(settings: LeadDestinationSettings) {
  writeJson(LEAD_SETTINGS_STORAGE_KEY, settings);
}

export function queueLeadForEstimate(leadId: string) {
  localStorage.setItem(SELECTED_LEAD_STORAGE_KEY, leadId);
}

export function consumeQueuedLeadForEstimate() {
  const leadId = localStorage.getItem(SELECTED_LEAD_STORAGE_KEY);
  if (!leadId) {
    return null;
  }

  localStorage.removeItem(SELECTED_LEAD_STORAGE_KEY);
  return getLeadById(leadId);
}

function buildEmailBody(lead: IdeaStarterLead) {
  return [
    `New lead from ${lead.source}`,
    "",
    `Name: ${lead.name}`,
    `Email: ${lead.email}`,
    `Phone / WhatsApp: ${lead.contact || "-"}`,
    `Request type: ${lead.requestType}`,
    `Stage: ${lead.stage}`,
    `Room: ${lead.room}`,
    `Budget: ${lead.budget}`,
    `Style: ${lead.style}`,
    `Notes: ${lead.notes || "-"}`,
    `Created at: ${new Date(lead.createdAt).toLocaleString("en-US")}`,
  ].join("\n");
}

function openLeadEmailDraft(lead: IdeaStarterLead, recipients: string) {
  const subject = encodeURIComponent(`New renovation lead: ${lead.name}`);
  const body = encodeURIComponent(buildEmailBody(lead));
  window.open(`mailto:${recipients}?subject=${subject}&body=${body}`, "_blank");
}

async function postLeadToWebhook(url: string, lead: IdeaStarterLead) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(lead),
  });

  if (!response.ok) {
    throw new Error(`Webhook returned ${response.status}`);
  }
}

export async function submitLeadToDestinations(
  lead: IdeaStarterLead,
  settings: LeadDestinationSettings,
) {
  const actions: string[] = [];
  const errors: string[] = [];

  if (settings.emailRecipients.trim() && settings.openMailClient) {
    openLeadEmailDraft(lead, settings.emailRecipients.trim());
    actions.push("email");
  }

  if (settings.googleSheetsWebhookUrl.trim()) {
    try {
      await postLeadToWebhook(settings.googleSheetsWebhookUrl.trim(), lead);
      actions.push("google sheets");
    } catch (error) {
      errors.push(
        `Google Sheets webhook failed: ${
          error instanceof Error ? error.message : "unknown error"
        }`,
      );
    }
  }

  if (settings.airtableWebhookUrl.trim()) {
    try {
      await postLeadToWebhook(settings.airtableWebhookUrl.trim(), lead);
      actions.push("airtable");
    } catch (error) {
      errors.push(
        `Airtable webhook failed: ${
          error instanceof Error ? error.message : "unknown error"
        }`,
      );
    }
  }

  return { actions, errors };
}

export function mapLeadToEstimateDraft(lead: IdeaStarterLead): EstimateLeadDraft {
  const renovationType =
    lead.room === "Kitchen"
      ? "kitchen"
      : lead.room === "Bathroom"
        ? "bathroom"
        : "full";

  const materialTier =
    lead.budget === "Starter Refresh"
      ? "basic"
      : lead.budget === "Family Upgrade"
        ? "standard"
        : "premium";

  const addOns = lead.style === "Storage-Focused" ? ["Custom Carpentry"] : [];

  return {
    clientName: lead.name,
    clientEmail: lead.email,
    projectBrief: [
      `Lead source: Idea Starter`,
      `Room: ${lead.room}`,
      `Budget direction: ${lead.budget}`,
      `Style: ${lead.style}`,
      lead.notes ? `Client notes: ${lead.notes}` : "",
    ]
      .filter(Boolean)
      .join("\n"),
    renovationType,
    materialTier,
    addOns,
  };
}
