const ComicBook = require('../models/ComicBook');

// Create a new comic book
exports.createComicBook = async (req, res, next) => {
    try {
        const comicBook = new ComicBook(req.body);
        const savedComicBook = await comicBook.save();
        res.status(201).json(savedComicBook);
    } catch (error) {
        next(error); // Pass to global error handler
    }
};

// Edit a comic book
exports.editComicBook = async (req, res, next) => {
    try {
        const updatedComicBook = await ComicBook.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedComicBook) {
            return res.status(404).json({ message: 'Comic book not found' });
        }
        res.json(updatedComicBook);
    } catch (error) {
        next(error); // Pass to global error handler
    }
};

// Delete a comic book
exports.deleteComicBook = async (req, res, next) => {
    try {
        const deletedComicBook = await ComicBook.findByIdAndDelete(req.params.id);
        if (!deletedComicBook) {
            return res.status(404).json({ message: 'Comic book not found' });
        }
        res.json({ message: 'Comic book deleted' });
    } catch (error) {
        next(error); // Pass to global error handler
    }
};

// Fetch inventory list with pagination, filtering, and sorting
exports.fetchComicBooks = async (req, res, next) => {
    const { page = 1, limit = 10, sortBy = 'bookName', order = 'asc', ...filters } = req.query;
    const sortOrder = order === 'asc' ? 1 : -1;

    try {
        const comicBooks = await ComicBook.find(filters)
            .sort({ [sortBy]: sortOrder })
            .limit(limit * 1)
            .skip((page - 1) * limit);
        
        const totalComicBooks = await ComicBook.countDocuments(filters);

        res.json({
            comicBooks,
            totalPages: Math.ceil(totalComicBooks / limit),
            currentPage: page
        });
    } catch (error) {
        next(error); // Pass to global error handler
    }
};

// Get comic book details by ID
exports.getComicBookDetails = async (req, res, next) => {
    try {
        const comicBook = await ComicBook.findById(req.params.id);
        if (!comicBook) {
            return res.status(404).json({ message: 'Comic book not found' });
        }
        res.json(comicBook);
    } catch (error) {
        next(error); // Pass to global error handler
    }
};
