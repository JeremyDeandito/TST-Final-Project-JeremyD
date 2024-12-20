import express from 'express';
import multer from 'multer';
import sharp from 'sharp';
import cors from 'cors';

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors({
  origin: [
    'https://jeremydeandito.github.io',
    'http://localhost:3000'
  ],
  credentials: true
}));

// Tambahkan route untuk root path
app.get('/', (req, res) => {
  res.send('Welcome to the Image Editor API');
});

app.post('/extract-metadata', upload.single('image'), async (req, res) => {
  if (!req.file) {
    res.status(400).send('No file uploaded.');
    return;
  }

  try {
    const image = sharp(req.file.buffer);
    const metadata = await image.metadata();

    const stats = await image.stats();
    const averageBrightness = (stats.channels[0].mean + stats.channels[1].mean + stats.channels[2].mean) / (3 * 255);

    const result = {
      filename: req.file.originalname,
      format: metadata.format,
      width: metadata.width,
      height: metadata.height,
      averageBrightness: averageBrightness
    };

    res.json(result);
  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).send('Error processing image');
  }
});

app.post('/edit-image', upload.fields([
  { name: 'input', maxCount: 1 },
  { name: 'reference', maxCount: 1 }
]), async (req, res) => {
  if (!req.files || !('input' in req.files) || !('reference' in req.files)) {
    res.status(400).send('Both input and reference images are required.');
    return;
  }

  try {
    const inputFile = req.files['input'][0];
    const referenceFile = req.files['reference'][0];
    const inputImage = sharp(inputFile.buffer);
    const referenceImage = sharp(referenceFile.buffer);

    // Analyze reference image
    const refStats = await referenceImage.stats();
    const refMetadata = await referenceImage.metadata();
    const inputStats = await inputImage.stats();

    // Calculate adjustments
    const brightnessAdjustment = (refStats.channels[0].mean + refStats.channels[1].mean + refStats.channels[2].mean) / 3;
    const saturationAdjustment = Math.max(...refStats.channels.map(c => c.stdev)) / 128;

    // Calculate color balance adjustments
    const redAdjustment = refStats.channels[0].mean / inputStats.channels[0].mean;
    const greenAdjustment = refStats.channels[1].mean / inputStats.channels[1].mean;
    const blueAdjustment = refStats.channels[2].mean / inputStats.channels[2].mean;

    // Apply adjustments to input image
    const editedImage = await inputImage
      .modulate({
        brightness: brightnessAdjustment / 128, // Normalize to Sharp's expected range
        saturation: saturationAdjustment
      })
      .linear([redAdjustment, greenAdjustment, blueAdjustment], [0, 0, 0]) // Apply color balance adjustments
      .resize(refMetadata.width, refMetadata.height) // Match size of reference image
      .toBuffer();

    res.contentType(`image/${refMetadata.format}`);
    res.send(editedImage);
  } catch (error) {
    console.error('Error editing image:', error);
    res.status(500).send('Error editing image');
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
