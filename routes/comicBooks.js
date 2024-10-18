const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const comicBookController = require('../controllers/comicBookController');

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Validation error', errors: errors.array() });
    }
    next();
};

// Validation rules for comic book creation and editing
const validateComicBook = [
    check('bookName').isString().isLength({ min: 3, max: 255 }).withMessage('Book name must be between 3 and 255 characters'),
    check('authorName').isString().isLength({ min: 3, max: 255 }).withMessage('Author name must be between 3 and 255 characters'),
    check('yearOfPublication').isInt({ min: 1800, max: new Date().getFullYear() }).withMessage('Year must be between 1800 and the current year'),
    check('price').isFloat({ min: 0 }).withMessage('Price must be a number greater than or equal to 0'),
    check('discount').optional().isFloat({ min: 0, max: 100 }).withMessage('Discount must be a number between 0 and 100'),
    check('numberOfPages').isInt({ min: 1 }).withMessage('Number of pages must be an integer greater than 0'),
    check('condition').isIn(['new', 'used']).withMessage('Condition must be either new or used'),
    check('description').optional().isString().isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
    handleValidationErrors
];

// Comic Book Management
router.post('/', validateComicBook, comicBookController.createComicBook);
router.put('/:id', validateComicBook, comicBookController.editComicBook);
router.delete('/:id', comicBookController.deleteComicBook);

// Fetch Inventory and Details
router.get('/', comicBookController.fetchComicBooks);
router.get('/:id', comicBookController.getComicBookDetails);

module.exports = router;
