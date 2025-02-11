//router/posts.js
const express = require('express');  //import express
const router =  express.Router();  //create router, x define multiple url routes
const PostController = require('../controllers/PostController.js');  //import the controller (x the CRUD logic)

const {upload} = PostController; // Import Multer configurated for upload of files
//extract my function upload(with my custom settings x Multer) from PostController

//'/posts/' default
router.get('/', PostController.index);
router.get('/:id', PostController.show);
//router.post('/posts', PostController.store);
router.post('/', upload.single('file'), PostController.store);   
  //search a file in the field 'file' of the form data->add the file on my backend-> add the OBJ(not web obj) file in req.file-> continue on PostController.store 
  //so Multer works as a middleware
router.put('/:id', PostController.update);
router.delete('/:id', PostController.destroy);

module.exports = router;

//the order here is very important(metti le rotte SPECIFICHE PRIMA delle rotte GENERICHE(index,show,ect))(x evitare problemi)!
//test with PostMan software (new>body:raw,Json)(x img files use body:formdata)