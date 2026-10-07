import { Router } from 'express';
import { handleFileUpload } from '../controllers/uploadController';
import { upload } from '../middleware/uploadMiddleware';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.post('/', authenticateToken, upload.single('file'), handleFileUpload);

export default router;
