import { Request, Response } from 'express';
import { MockAIProvider } from '../providers/MockAIProvider';
import { usageMeter } from '../services/usageMeter';

const aiProvider = new MockAIProvider();

export const checkPlagiarism = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || 'usr_demo_01';
    const { text, fileName, pages } = req.body;
    const report = await aiProvider.detectPlagiarism(text, fileName, pages || 1);
    usageMeter.recordUsage(userId, 'plagiarism', { pages: pages || 1 }, (pages || 1) * 0.15);
    return res.status(200).json(report);
  } catch (err: any) {
    return res.status(500).json({ message: err.message || 'Plagiarism scan failed.' });
  }
};

export const summarizeText = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || 'usr_demo_01';
    const { text, length, style } = req.body;
    const summary = await aiProvider.summarize(text || '', length, style);
    const words = text ? text.split(/\s+/).filter(Boolean).length : 500;
    usageMeter.recordUsage(userId, 'summarizer', { words }, parseFloat(((words / 1000) * 0.20).toFixed(2)));
    return res.status(200).json(summary);
  } catch (err: any) {
    return res.status(500).json({ message: err.message || 'Summarization failed.' });
  }
};

export const analyzeImage = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || 'usr_demo_01';
    const { imageBase64, imageUrl } = req.body;
    const result = await aiProvider.analyzeImage(imageBase64, imageUrl);
    usageMeter.recordUsage(userId, 'image_analyzer', { images: 1 }, 1.00);
    return res.status(200).json(result);
  } catch (err: any) {
    return res.status(500).json({ message: err.message || 'Image analysis failed.' });
  }
};

export const performOCR = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || 'usr_demo_01';
    const { imageBase64 } = req.body;
    const result = await aiProvider.extractText(imageBase64);
    usageMeter.recordUsage(userId, 'ocr', { images: 1 }, 0.50);
    return res.status(200).json(result);
  } catch (err: any) {
    return res.status(500).json({ message: err.message || 'OCR extraction failed.' });
  }
};

export const detectContent = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || 'usr_demo_01';
    const { text } = req.body;
    const result = await aiProvider.detectContent(text || '');
    usageMeter.recordUsage(userId, 'content_detector', { words: 500 }, 0.10);
    return res.status(200).json(result);
  } catch (err: any) {
    return res.status(500).json({ message: err.message || 'Content detection failed.' });
  }
};

export const improveGrammar = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || 'usr_demo_01';
    const { text } = req.body;
    const result = await aiProvider.improveGrammar(text || '');
    usageMeter.recordUsage(userId, 'grammar', { words: 300 }, 0.15);
    return res.status(200).json(result);
  } catch (err: any) {
    return res.status(500).json({ message: err.message || 'Grammar improvement failed.' });
  }
};

export const askDocumentQA = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || 'usr_demo_01';
    const { question, context } = req.body;
    const result = await aiProvider.answerDocumentQuestion(question || '', context);
    usageMeter.recordUsage(userId, 'document_qa', { apiCalls: 1 }, 0.25);
    return res.status(200).json(result);
  } catch (err: any) {
    return res.status(500).json({ message: err.message || 'Document Q&A failed.' });
  }
};
