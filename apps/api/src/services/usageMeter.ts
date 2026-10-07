import { AIRequestType, UsageMetric, UsageAnalyticsOverview } from '@aurex/shared';

export interface UsageRecord {
  id: string;
  userId: string;
  serviceType: AIRequestType;
  metric: UsageMetric;
  costINR: number;
  timestamp: string;
}

export class UsageMeter {
  private records: UsageRecord[] = [
    {
      id: 'rec_1',
      userId: 'usr_demo_01',
      serviceType: 'plagiarism',
      metric: { pages: 18, words: 4500 },
      costINR: 2.70,
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    },
    {
      id: 'rec_2',
      userId: 'usr_demo_01',
      serviceType: 'summarizer',
      metric: { words: 2450 },
      costINR: 0.49,
      timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    },
    {
      id: 'rec_3',
      userId: 'usr_demo_01',
      serviceType: 'image_analyzer',
      metric: { images: 1 },
      costINR: 1.00,
      timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    },
  ];

  recordUsage(userId: string, serviceType: AIRequestType, metric: UsageMetric, costINR: number): UsageRecord {
    const record: UsageRecord = {
      id: `rec_${Date.now()}`,
      userId,
      serviceType,
      metric,
      costINR,
      timestamp: new Date().toISOString(),
    };
    this.records.unshift(record);
    return record;
  }

  getAnalyticsOverview(userId?: string): UsageAnalyticsOverview {
    const filtered = userId ? this.records.filter((r) => r.userId === userId) : this.records;

    const totalCost = filtered.reduce((acc, curr) => acc + curr.costINR, 0);
    const docs = filtered.filter((r) => r.serviceType === 'plagiarism' || r.serviceType === 'pdf_analyzer').length;
    const images = filtered.filter((r) => r.serviceType === 'image_analyzer' || r.serviceType === 'ocr').length;

    return {
      totalAiCreditsUsed: 1245,
      documentsAnalyzed: 42 + docs,
      imagesProcessed: 18 + images,
      totalAiRequests: 326 + filtered.length,
      monthlySpendINR: parseFloat(totalCost.toFixed(2)),
      usageByTool: [
        { tool: 'Plagiarism', count: 42, spendINR: 6.30 },
        { tool: 'Summarizer', count: 85, spendINR: 4.80 },
        { tool: 'Vision AI', count: 24, spendINR: 24.00 },
        { tool: 'OCR', count: 38, spendINR: 19.00 },
        { tool: 'AI Chat', count: 120, spendINR: 6.00 },
      ],
      dailyActivity: [
        { date: 'Oct 01', requests: 12, spendINR: 1.80 },
        { date: 'Oct 02', requests: 19, spendINR: 3.20 },
        { date: 'Oct 03', requests: 8, spendINR: 0.90 },
        { date: 'Oct 04', requests: 27, spendINR: 4.50 },
        { date: 'Oct 05', requests: 34, spendINR: 5.80 },
        { date: 'Oct 06', requests: 22, spendINR: 3.40 },
        { date: 'Oct 07', requests: 45, spendINR: 8.95 },
      ],
    };
  }
}

export const usageMeter = new UsageMeter();
