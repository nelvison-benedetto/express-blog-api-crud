require('dotenv').config();  //upload env vars from .env file
const HOST = process.env.HOST;  //localhost (.env var)
const PORT = process.env.PORT;  //port (.env var)

const express = require('express');  //import express
const app = express();  //create 'express' application

const cors = require('cors');  //abilitate cross-orgin x requests from differents domains(i.e. front-end localhost:3000 and back-end localhost:5000)
const path = require('path');  //lib built-in Node.js x manage path's files

app.use(express.json());  //abilitate parsing Json in the requests body (obj js accessible with "req.body")
app.use(cors());  //!abilitate ANY domain(i.e. xyz.com) to make http requests to this express server!
app.use(express.static('public'));  //serve the static files from folder 'public'
   //i.e. /immagini/foto.jpg -> public/immagini/foto.jpg

const PostsRouter = require('./routers/posts.js');  //import the router posts.js and name it 'PostsRouter'
const notFoundMiddleware = require('./middlewares/notFoundMiddleware.js');  //import the middleware


app.use('/imgcover', express.static(path.join(__dirname, 'public/imgcover')));
  //__dirname is THE PATH OF THIS RUN FILE!(obviously without the name of this script)  
  //MORE SPECIFIC than 'public',serve the static files from folder 'public/imgcover' ONLY WHEN requested '/imgcover'
  //.static() serve the static files in the target path
  //.use('/imgcover',...) when request contains '/imgcover' express serve files from the target path
// app.use('/posts',(req,res,next) => {  //is url more specific than /:slug !
//     throw new Error("You broke everything dude!"); //generic error with mex
// }); 
app.use('/posts',PostsRouter);  //SPECIFIC ROUTE!
app.get('/',(req,res)=>{   //route url '/'
    res.send('Crud Main Page');  //show this
});
app.get('/:slug',(req, res)=>{   //DYNAMIC ROUTE, non puo essere usata per rotte specifiche(like those in POSTCONTROLLER.JS) !!
    res.send(`Hai richiesto la pagina con slug: ${req.params.slug}`);
});
app.use(notFoundMiddleware);
//the order here is very important(metti le rotte SPECIFICHE PRIMA delle rotte GENERICHE(index,show,ect))(x evitare problemi)!
//test with PostMan software (new>body:raw,Json)(x img files use body:formdata)

app.listen(PORT, () => {  //server running(AT THE END OF THE LOGIC FLOW/ROUTES DEFINITION!) using the HOST-PORT specified
    console.log(`Server running on ${HOST}:${PORT}`);
});