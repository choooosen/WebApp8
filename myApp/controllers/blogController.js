const fs = require('fs');
const path = require('path');

const blogFilePath = path.join(__dirname, '../Model/blog.json');

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

exports.renderNewPostForm = (req, res) => {
  res.render('newPost');
};

exports.getAllPosts = (req, res) => {
  const blogPosts = readBlogData();

  blogPosts.forEach(post => {
    console.log(`ID: ${post.id}, Titel: ${post.title}`);
  });

  res.json({
    message: 'Alle Blog-Posts',
    totalPosts: blogPosts.length,
    posts: blogPosts.map(post => ({
      id: post.id,
      title: post.title,
      image: post.image || null
    }))
  });
};

exports.getPost = (req, res) => {
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
    console.log(`ID: ${post.id}, Titel: ${post.title}`);
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
    console.log('Kein Eintrag');
    res.status(404).json({
      message: 'Kein Eintrag'
    });
  }
};

exports.createPost = (req, res) => {
  const { author, title, text } = req.body;

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

  res.status(201).json(newPost);
};

exports.updatePost = (req, res) => {
  const postID = parseInt(req.params.postID);
  if (isNaN(postID)) {
    return res.status(400).json({
      error: 'Ungültige Post-ID'
    });
  }

  const blogPosts = readBlogData();
  const index = blogPosts.findIndex(p => p.id === postID);
  if (index === -1) {
    return res.status(404).json({ message: 'Kein Eintrag' });
  }

  const oldPost = blogPosts[index];
  blogPosts[index] = {
    ...oldPost,
    ...req.body,
    image: req.file ? `/uploads/${req.file.filename}` : oldPost.image,
    id: oldPost.id,
    date: oldPost.date
  };

  writeBlogData(blogPosts);
  res.json(blogPosts[index]);
};

exports.deletePost = (req, res) => {
  const postID = parseInt(req.params.postID);
  if (isNaN(postID)) {
    return res.status(400).json({ error: 'Ungültige Post-ID' });
  }

  const blogPosts = readBlogData();
  const index = blogPosts.findIndex(p => p.id === postID);
  if (index === -1) {
    return res.status(404).json({ message: 'Kein Eintrag' });
  }

  const deleted = blogPosts.splice(index, 1)[0];
  writeBlogData(blogPosts);
  res.json({ message: 'Post gelöscht', post: deleted });
};
