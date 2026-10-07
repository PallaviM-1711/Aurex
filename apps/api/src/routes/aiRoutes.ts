import { Router } from 'express';
import {
  checkPlagiarism,
  summarizeText,
  analyzeImage,
  performOCR,
  detectContent,
  improveGrammar,
  askDocumentQA,
} from '../controllers/aiController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.post('/plagiarism', authenticateToken, checkPlagiarism);
router.post('/summarize', authenticateToken, summarizeText);
router.post('/image-analyze', authenticateToken, analyzeImage);
router.post('/ocr', authenticateToken, performOCR);
router.post('/content-detector', authenticateToken, detectContent);
router.post('/grammar', authenticateToken, improveGrammar);
router.post('/document-qa', authenticateToken, askDocumentQA);

export default router;
