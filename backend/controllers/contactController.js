const ErrorHandler = require("../utils/errorhandler");
const catchAsyncError = require('../middleware/catchAsyncErrors');
const Contact = require('../models/contactModel');





exports.submitContact = catchAsyncError(async (req, res, next) => {
    try {
        const { name, email, message } = req.body;
    
        // Create a new contact instance
        const contact = await Contact.create({
          name,
          email,
          message,
        });
    
        // Save the contact to the database
      //   await newContact.save();
    
        // Return a success response
        return res.status(200).json({ 
          message: 'Contact form submitted successfully',
          contact 
      });
      } catch (error) {
        // Handle any errors and return an error response
        console.error(error);
        return res.status(500).json({ error: 'An error occurred while submitting the contact form' });
      }
})
