import About from '../models/About.model.js';

// Get about content (Public)
export const getAbout = async (req, res) => {
  try {
    let about = await About.findOne();
    
    // If no about content exists, return default structure
    if (!about) {
      about = new About({});
      await about.save();
    }

    res.json({
      success: true,
      data: about
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch about content',
      error: error.message
    });
  }
};

// Update about content (Admin only)
export const updateAbout = async (req, res) => {
  try {
    let about = await About.findOne();
    
    if (!about) {
      about = new About(req.body);
      await about.save();
    } else {
      about = await About.findOneAndUpdate(
        {},
        req.body,
        { new: true, runValidators: true, upsert: true }
      );
    }

    res.json({
      success: true,
      message: 'About content updated successfully',
      data: about
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update about content',
      error: error.message
    });
  }
};

