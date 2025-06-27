const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const router = express.Router();

const blogController = require('../controllers/blogController');

const uploadFolder = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadFolder)) fs.mkdirSync(uploadFolder, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadFolder),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

router.get('/newpost', blogController.renderNewPostForm);

router.post('/', upload.single('image'), blogController.createPost);
router.get('/', blogController.getAllPosts);
router.get('/:postID', blogController.getPost);
router.put('/:postID', upload.single('image'), blogController.updatePost);
router.delete('/:postID', blogController.deletePost);

module.exports = router;
