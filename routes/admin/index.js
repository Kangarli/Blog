const express = require('express')
const Category = require('../../models/Category')

const Post = require('../../models/Post')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('admin/index');
})

router.get('/categories', (req, res) => {
    Category.find({}).sort({ $natural: -1 }).then(categories => {
        res.render('admin/categories', { categories: categories })
    })
})

router.delete('/categories/:id', (req, res) => {
    Category.remove({ _id: req.params.id }).then(() => {
        res.redirect('/admin/categories')
    })
})

router.post('/categories', (req, res) => {
    Category.create(req.body, (error, category) => {
        if (!error) {
            res.redirect('categories')
        }
    })
})


router.get('/posts', (req, res) => {
    Post.find({}).populate({ path: 'category', model: Category }).sort({ $natural: -1 }).then(posts => {
        res.render('admin/posts', { posts: posts })
    })
})

router.delete('/posts/:id', (req, res) => {
    Post.remove({ _id: req.params.id }).then(() => {
        res.redirect('/admin/posts')
    })
})

router.get('/posts/edit/:id', (req, res) => {
    Post.findOne({_id: req.params.id}).then(post => {
        Category.find({}).then(categories => {
            res.render('admin/editpost', {post: post, categories: categories})
        })
    })
})

router.put('posts/:id', (req, res) => {
    
})

module.exports = router