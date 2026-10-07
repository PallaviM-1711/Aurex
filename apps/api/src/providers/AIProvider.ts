import {
  PlagiarismReport,
  SummaryResult,
  ImageAnalysisResult,
  OCRResult,
  ContentDetectionResult,
  GrammarResult,
  DocumentQAResponse,
} from '@aurex/shared';

export interface AIProvider {
  summarize(text: string, length?: string, style?: string): Promise<SummaryResult>;
  analyzeImage(imageBase64?: string, imageUrl?: string): Promise<ImageAnalysisResult>;
  detectPlagiarism(text?: string, fileName?: string, pages?: number): Promise<PlagiarismReport>;
  extractText(imageBase64?: string): Promise<OCRResult>;
  answerDocumentQuestion(question: string, context?: string): Promise<DocumentQAResponse>;
  detectContent(text: string): Promise<ContentDetectionResult>;
  improveGrammar(text: string): Promise<GrammarResult>;
}
