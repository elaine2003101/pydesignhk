import type { PricingTier, StyleDirection } from "./boqEstimate";

export const IDEA_ESTIMATE_DRAFT_KEY = "pydesignhk-ideas-estimate-draft";

export type IdeaEstimateDraft = {
  propertySize: string;
  pricingTier: PricingTier;
  style: StyleDirection;
  projectBrief: string;
};
