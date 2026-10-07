import { AIRequestType, PricingRule, UsageMetric, DEFAULT_PRICING_RULES } from '@aurex/shared';

export class PricingEngine {
  private rules: Record<AIRequestType, PricingRule>;

  constructor() {
    this.rules = { ...DEFAULT_PRICING_RULES };
  }

  getRule(serviceType: AIRequestType): PricingRule {
    return this.rules[serviceType] || this.rules.summarizer;
  }

  getAllRules(): Record<AIRequestType, PricingRule> {
    return this.rules;
  }

  updateRule(serviceType: AIRequestType, update: Partial<PricingRule>): PricingRule {
    if (this.rules[serviceType]) {
      this.rules[serviceType] = { ...this.rules[serviceType], ...update };
    }
    return this.rules[serviceType];
  }

  calculateCost(serviceType: AIRequestType, metric: UsageMetric): number {
    const rule = this.getRule(serviceType);
    let amount = 0;

    switch (rule.unit) {
      case 'page':
        amount = (metric.pages || 1) * rule.rateINR;
        break;
      case 'word':
        amount = ((metric.words || 500) / rule.unitMultiplier) * rule.rateINR;
        break;
      case 'image':
        amount = (metric.images || 1) * rule.rateINR;
        break;
      case 'token':
        amount = ((metric.tokens || 1000) / rule.unitMultiplier) * rule.rateINR;
        break;
      case 'request':
        amount = (metric.apiCalls || 1) * rule.rateINR;
        break;
      default:
        amount = rule.rateINR;
    }

    return Math.max(rule.minChargeINR, parseFloat(amount.toFixed(2)));
  }
}

export const pricingEngine = new PricingEngine();
