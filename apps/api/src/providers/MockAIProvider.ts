import { AIProvider } from './AIProvider';
import {
  PlagiarismReport,
  SummaryResult,
  ImageAnalysisResult,
  OCRResult,
  ContentDetectionResult,
  GrammarResult,
  DocumentQAResponse,
} from '@aurex/shared';

export class MockAIProvider implements AIProvider {
  async summarize(text: string, length = 'Medium', style = 'Executive summary'): Promise<SummaryResult> {
    const wordCount = text.split(/\s+/).filter(Boolean).length;
    return {
      summary:
        'Artificial intelligence architectures and multi-layered transformer pipelines continue to accelerate productivity across enterprise and research workflows. Algorithmic synthesis prevents human cognitive overload while preserving core mathematical, scientific, and strategic conclusions.',
      bulletPoints: [
        'Multi-head transformer attention captures cross-document semantic dependencies.',
        'High-velocity synthesis compresses research documents into actionable executive directives.',
        'Preserves statistical metrics and operational directives with verified high fidelity.',
      ],
      keyTopics: ['Machine Intelligence', 'Transformer Models', 'Executive Synthesis'],
      keywords: ['Neural Net', 'Throughput', 'Attention', 'Semantic Embedding'],
      originalLength: wordCount || 450,
      summaryLength: 38,
      compressionRatio: 78,
      readingTimeMinutesSaved: 4.5,
    };
  }

  async analyzeImage(imageBase64?: string, imageUrl?: string): Promise<ImageAnalysisResult> {
    return {
      overview:
        'The input image demonstrates a cutting-edge creative workstation configured with dual monitors, mechanical keyboard, and hardware schematics illuminated under studio daylight.',
      detectedObjects: [
        { name: 'Laptop Computer', confidence: 0.98, category: 'Hardware' },
        { name: 'External 4K Monitor', confidence: 0.95, category: 'Display' },
        { name: 'Mechanical Keyboard', confidence: 0.93, category: 'Peripheral' },
        { name: 'Technical Notes', confidence: 0.88, category: 'Documentation' },
        { name: 'Ergonomic Desk', confidence: 0.84, category: 'Furniture' },
      ],
      sceneClassification: 'Modern Creative Studio / Tech Workspace',
      dominantColors: ['#1A1C24', '#4F46E5', '#E2E8F0', '#059669', '#D97706'],
      extractedText: 'AUREX INTELLIGENCE • SYSTEM ACTIVE • LATENCY: 22ms',
      visualInsights: [
        'High natural light illumination coming from an elevated left window aperture.',
        'Ergonomic hardware alignment reducing operator cognitive friction.',
        'High pixel fidelity and uniform focus across foreground equipment.',
      ],
    };
  }

  async detectPlagiarism(text?: string, fileName = 'Document.pdf', pages = 1): Promise<PlagiarismReport> {
    const wordCount = text ? text.split(/\s+/).filter(Boolean).length : pages * 280;
    return {
      id: `plag_${Date.now()}`,
      fileName,
      totalWords: wordCount,
      matchedWords: Math.round(wordCount * 0.27),
      overallSimilarity: 27,
      originalPercent: 73,
      riskLevel: 'Medium',
      sources: [
        {
          id: 'src_1',
          name: 'IEEE Transactions on Neural Computation (2024)',
          url: 'https://ieeexplore.ieee.org/document/892104',
          matchPercent: 12,
          matchedExcerpts: [
            {
              original: 'The distributed attention mechanism dynamically weighs intermediate activations across layers.',
              matched: 'The distributed attention mechanism dynamically weighs intermediate activation tensors in sequential layers.',
            },
          ],
        },
        {
          id: 'src_2',
          name: 'arXiv:2311.09214v2 [cs.AI]',
          url: 'https://arxiv.org/abs/2311.09214',
          matchPercent: 8,
          matchedExcerpts: [
            {
              original: 'Empirical benchmarks demonstrate a 14% improvement in inference throughput without quantization loss.',
              matched: 'Empirical benchmarks show an approximate 14% boost in inference throughput without sacrificing precision.',
            },
          ],
        },
        {
          id: 'src_3',
          name: 'MIT Technology Review: Generative Architectures',
          url: 'https://technologyreview.com/2024/02/gen-ai',
          matchPercent: 7,
          matchedExcerpts: [
            {
              original: 'Modern language pipelines leverage multi-head projection embeddings for contextual semantic alignment.',
              matched: 'Modern language models rely heavily on multi-head embeddings for contextual semantic alignment.',
            },
          ],
        },
      ],
      highlightedText:
        'Deep neural models have transformed natural language tasks. The distributed attention mechanism dynamically weighs intermediate activations across layers, allowing context retrieval over long sequences. Empirical benchmarks demonstrate a 14% improvement in inference throughput without quantization loss.',
      createdAt: new Date().toISOString(),
    };
  }

  async extractText(imageBase64?: string): Promise<OCRResult> {
    return {
      extractedText:
        'INVOICE #INV-2026-8910\nDATE: 07-OCT-2026\nCLIENT: ACME AEROSPACE LABS\nDESCRIPTION: QUANTUM SENSOR PROTOTYPE v2\nHOURS: 42.5\nRATE: ₹1,500.00 / HR\nSUBTOTAL: ₹63,750.00\nTAX (18% GST): ₹11,475.00\nTOTAL AMOUNT DUE: ₹75,225.00\nPAYMENT METHOD: AUREX ENTERPRISE LEDGER\nSTATUS: VERIFIED & CONFIRMED',
      confidence: 0.992,
      wordsCount: 48,
      linesCount: 11,
    };
  }

  async answerDocumentQuestion(question: string, context?: string): Promise<DocumentQAResponse> {
    return {
      question,
      answer:
        'The main objective is to design a high-throughput, low-latency zero-knowledge computation pipeline that reduces proof generation times by 3.8x while preserving deterministic cryptographic verifiability on commodity hardware.',
      pageReferences: [2, 14],
      relevantSnippets: [
        '"We present an optimized polynomial commitment scheme targeted for resource-constrained sequencers..." (p. 2)',
        '"Experimental benchmarks confirm proof latency reduction from 8.2s to 2.1s..." (p. 14)',
      ],
      confidence: 0.96,
    };
  }

  async detectContent(text: string): Promise<ContentDetectionResult> {
    return {
      aiProbability: 88,
      humanProbability: 12,
      verdict: 'Highly Likely AI',
      confidenceScore: 0.94,
      sentences: [
        {
          text: 'In recent years, the acceleration of computational linguistics has propelled algorithmic synthesis to unprecedented thresholds.',
          isAiGenerated: true,
          aiScore: 92,
        },
        {
          text: 'Consequently, multi-layered transformer networks dynamically allocate intermediate activation vectors across deep latent parameters.',
          isAiGenerated: true,
          aiScore: 84,
        },
      ],
    };
  }

  async improveGrammar(text: string): Promise<GrammarResult> {
    return {
      originalText: text,
      improvedText:
        'There are several mistakes in this proposal that make the document difficult to understand.',
      readabilityScore: 92,
      suggestionsCount: 3,
      suggestions: [
        {
          original: 'Their is',
          suggestion: 'There are',
          category: 'Grammar',
          explanation: 'Homophone correction: "There are" refers to existence, pluralized with "mistakes".',
        },
        {
          original: 'makes',
          suggestion: 'make',
          category: 'Grammar',
          explanation: 'Subject-verb agreement: "mistakes" is plural and requires plural verb "make".',
        },
        {
          original: 'for understanding',
          suggestion: 'to understand',
          category: 'Clarity',
          explanation: 'Infinitive phrase improves natural executive readability.',
        },
      ],
    };
  }
}
