import { PlanCategory, PlanPeriod } from "../enums";

export interface SubscriptionPlanMeta {
  trainerId?: string;
  sessionsIncludedPerMonth: number;
  freeTrialSessions?: number;
}

export interface SubscriptionPlan {
  _id: string;
  category: PlanCategory;

  rzpPlanId?: string;
  name: string;
  amount: number;
  currency: string;

  period: PlanPeriod;
  interval: number;
  meta?: SubscriptionPlanMeta;

  issuer: string;

  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
