import express from 'express';
import { Subject } from '../Models/subject.model.js'; // Assuming Subject model is defined in the models folder
import { asyncHandler } from '../Utils/AsyncHandler.js'; // Optional: If you have a utility for async error handling
import { ApiError } from '../Utils/apiError.js'; // Optional: Custom error handler
import { ApiResponse } from '../Utils/ApiResponse.js'; // Optional: Custom response format

const router = express.Router();

// GET /api/subjects/:id - Get subject by ID
router.get('/subjects/:id', async (req, res) => {
    try {
      const subject = await Subject.findById(req.params.id); // Fetch subject by ID
      if (!subject) {
        // If subject not found, return a 404 status with a proper error message
        return res.status(404).json({ error: 'Subject not found' });
      }
      res.status(200).json(subject); // Send subject details if found
    } catch (err) {
      // Catch any unexpected errors and return a 500 status
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  });

export default router;
