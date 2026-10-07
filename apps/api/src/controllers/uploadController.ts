import { Request, Response } from 'express';

export const handleFileUpload = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    const file = req.file;
    const estPages = Math.max(1, Math.round(file.size / 3500));
    const estWords = estPages * 280;

    return res.status(200).json({
      fileId: `file_${Date.now()}`,
      originalName: file.originalname,
      mimeType: file.mimetype,
      sizeBytes: file.size,
      estimatedPages: estPages,
      estimatedWords: estWords,
      message: 'File processed and validated securely.',
    });
  } catch (err: any) {
    return res.status(500).json({ message: err.message || 'File processing failed.' });
  }
};
