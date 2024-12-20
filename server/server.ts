import express from 'express';
import multer from 'multer';
import sharp from 'sharp';
import cors from 'cors';

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

// Add CORS preflight options
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// Use cors middleware after custom headers
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware to parse JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/', (req, res) => {
  res.send('Server is running');
});

app.post('/edit-image', upload.fields([
  { name: 'inputImage', maxCount: 1 },
  { name: 'referenceImage', maxCount: 1 }
]), async (req, res) => {
  try {
    console.log('Received request for image editing');
    
    if (!req.files || !('inputImage' in req.files) || !('referenceImage' in req.files)) {
      console.error('Missing files in request');
      return res.status(400).json({ error: 'Both input and reference images are required.' });
    }

    const inputFile = req.files['inputImage'][0];
    const referenceFile = req.files['referenceImage'][0];
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
        brightness: brightnessAdjustment / 128,
        saturation: saturationAdjustment
      })
      .linear([redAdjustment, greenAdjustment, blueAdjustment], [0, 0, 0])
      .resize(refMetadata.width, refMetadata.height)
      .toBuffer();

    // Convert the buffer to base64
    const base64Image = editedImage.toString('base64');
    const processedImageUrl = `data:image/${refMetadata.format};base64,${base64Image}`;

    res.json({
      processedImageUrl,
      message: 'Image processed successfully'
    });

  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).json({ error: 'Failed to process image' });
  }
});

const PORT = process.env.PORT || 3000;
const CORS_ORIGIN = 'http://localhost:5173';

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Allowed origins:', CORS_ORIGIN);
});
