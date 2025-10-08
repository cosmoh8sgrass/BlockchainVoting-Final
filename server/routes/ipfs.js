const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const { create } = require('ipfs-http-client');
const router = express.Router();

// Initialize IPFS client
const ipfs = create({
  host: process.env.IPFS_HOST || 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: `Basic ${Buffer.from(
      `${process.env.IPFS_PROJECT_ID}:${process.env.IPFS_PROJECT_SECRET}`
    ).toString('base64')}`
  }
});

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Upload image to IPFS
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'No image file provided'
      });
    }

    // Process image with Sharp
    const processedImage = await sharp(req.file.buffer)
      .resize(400, 400, { fit: 'cover' })
      .jpeg({ quality: 80 })
      .toBuffer();

    // Upload to IPFS
    const result = await ipfs.add(processedImage);
    const hash = result.path;

    res.json({
      success: true,
      hash,
      url: `https://ipfs.io/ipfs/${hash}`,
      size: processedImage.length
    });

  } catch (error) {
    console.error('IPFS upload error:', error);
    res.status(500).json({
      error: 'Failed to upload image to IPFS',
      message: error.message
    });
  }
});

// Get image from IPFS
router.get('/image/:hash', async (req, res) => {
  try {
    const { hash } = req.params;
    
    // Validate hash format
    if (!hash || hash.length !== 46) {
      return res.status(400).json({
        error: 'Invalid IPFS hash'
      });
    }

    // Get file from IPFS
    const chunks = [];
    for await (const chunk of ipfs.cat(hash)) {
      chunks.push(chunk);
    }
    
    const fileBuffer = Buffer.concat(chunks);
    
    // Set appropriate headers
    res.set({
      'Content-Type': 'image/jpeg',
      'Content-Length': fileBuffer.length,
      'Cache-Control': 'public, max-age=31536000' // 1 year cache
    });
    
    res.send(fileBuffer);

  } catch (error) {
    console.error('IPFS retrieval error:', error);
    res.status(500).json({
      error: 'Failed to retrieve image from IPFS',
      message: error.message
    });
  }
});

// Get file info from IPFS
router.get('/info/:hash', async (req, res) => {
  try {
    const { hash } = req.params;
    
    // Validate hash format
    if (!hash || hash.length !== 46) {
      return res.status(400).json({
        error: 'Invalid IPFS hash'
      });
    }

    // Get file stats from IPFS
    const stats = await ipfs.files.stat(`/ipfs/${hash}`);
    
    res.json({
      success: true,
      hash,
      size: stats.size,
      url: `https://ipfs.io/ipfs/${hash}`,
      type: stats.type
    });

  } catch (error) {
    console.error('IPFS info error:', error);
    res.status(500).json({
      error: 'Failed to get file info from IPFS',
      message: error.message
    });
  }
});

// Pin file to IPFS (ensure it stays available)
router.post('/pin/:hash', async (req, res) => {
  try {
    const { hash } = req.params;
    
    // Validate hash format
    if (!hash || hash.length !== 46) {
      return res.status(400).json({
        error: 'Invalid IPFS hash'
      });
    }

    // Pin the file
    await ipfs.pin.add(hash);
    
    res.json({
      success: true,
      message: 'File pinned successfully',
      hash
    });

  } catch (error) {
    console.error('IPFS pin error:', error);
    res.status(500).json({
      error: 'Failed to pin file to IPFS',
      message: error.message
    });
  }
});

// Unpin file from IPFS
router.delete('/pin/:hash', async (req, res) => {
  try {
    const { hash } = req.params;
    
    // Validate hash format
    if (!hash || hash.length !== 46) {
      return res.status(400).json({
        error: 'Invalid IPFS hash'
      });
    }

    // Unpin the file
    await ipfs.pin.rm(hash);
    
    res.json({
      success: true,
      message: 'File unpinned successfully',
      hash
    });

  } catch (error) {
    console.error('IPFS unpin error:', error);
    res.status(500).json({
      error: 'Failed to unpin file from IPFS',
      message: error.message
    });
  }
});

// Get IPFS node info
router.get('/node-info', async (req, res) => {
  try {
    const id = await ipfs.id();
    const version = await ipfs.version();
    
    res.json({
      success: true,
      node: {
        id: id.id,
        addresses: id.addresses,
        agentVersion: id.agentVersion,
        protocolVersion: id.protocolVersion,
        version: version.version
      }
    });

  } catch (error) {
    console.error('IPFS node info error:', error);
    res.status(500).json({
      error: 'Failed to get IPFS node info',
      message: error.message
    });
  }
});

module.exports = router;