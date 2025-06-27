const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const router = express.Router();

// Pfad zur JSON-Datei
const blogFilePath = path.join(__dirname, '../Model/blog.json');

// Upload-Zielordner
const uploadFolder = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadFolder)) fs.mkdirSync(uploadFolder, { recursive: true });

// Multer-Konfiguration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadFolder),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage: storage });

// Hilfsfunktionen
function readBlogData() {
  try {
    const data = fs.readFileSync(blogFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Fehler beim Lesen der JSON-Datei:', err);
    return [];
  }
}

function writeBlogData(data) {
  try {
    fs.writeFileSync(blogFilePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Fehler beim Schreiben in die JSON-Datei:', err);
  }
}

// Formularseite anzeigen (muss vor :postID stehen)
router.get('/newpost', (req, res) => {
  res.render('newPost'); // erwartet views/newPost.ejs
});

// POST "/" - neuen Blogeintrag mit optionalem Bild speichern
router.post('/', upload.single('image'), (req, res) => {
  const { author, title, text } = req.body;

  // Validierung
  if (!author || !title || !text) {
    return res.status(400).json({
      error: 'Fehlende Daten',
      required: ['author', 'title', 'text'],
      received: req.body
    });
  }

  const blogPosts = readBlogData();
  const nextId = blogPosts.length > 0 ? Math.max(...blogPosts.map(p => p.id)) + 1 : 1;

  const newPost = {
    id: nextId,
    date: new Date().toISOString(),
    author,
    title,
    text,
    image: req.file ? `/uploads/${req.file.filename}` : null
  };

  blogPosts.push(newPost);
  writeBlogData(blogPosts);

  res.status(201).json({
    message: 'Post erfolgreich erstellt',
    post: newPost
  });
});

// GET "/" - Alle Blogeinträge anzeigen
router.get('/', (req, res) => {
  const blogPosts = readBlogData();

  res.json({
    message: 'Alle Blog-Posts',
    totalPosts: blogPosts.length,
    posts: blogPosts.map(post => ({
      id: post.id,
      title: post.title,
      image: post.image || null
    }))
  });
});

// GET "/:postID" - Einzelnen Post abrufen
router.get('/:postID', (req, res) => {
  const postID = parseInt(req.params.postID);

  if (isNaN(postID)) {
    return res.status(400).json({
      error: 'Ungültige Post-ID',
      message: 'Post-ID muss eine Zahl sein'
    });
  }

  const blogPosts = readBlogData();
  const post = blogPosts.find(p => p.id === postID);

  if (post) {
    res.json({
      message: 'Post gefunden',
      post: {
        id: post.id,
        title: post.title,
        text: post.text,
        author: post.author,
        date: post.date,
        image: post.image || null
      }
    });
  } else {
    res.status(404).json({
      message: 'Kein Eintrag'
    });
  }
});

module.exports = router;
