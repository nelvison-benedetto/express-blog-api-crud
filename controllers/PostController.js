//controllers/PostController.js
const posts = require('../db/storeposts.js');  //custom db full of examples
const fs = require('fs');  //import fs per scrivere su file
const path = require('path');  //x path absolute of your root
const multer = require('multer');  //x upload ANY file on server(express)
const { v4: uuidv4 } = require('uuid');  //npm install uuid, id univoco +-128bit(still not using Autoincrement sql)

//req & res sono standart usati da express(IL SERVER,NON E' UN MIDDLEWARE!), forniti al myrouter quando avviene una quasiasi request http
//req contiene la richiesta x il server, res conterrà la risposta per il client
//req methods: i.e. .params(), .query(), .body(), .headers(), .ip(),....
//res methods:i.e. .send()(send custom mex), .json()(send js obj), .status(), .sendFile(path), .redirect(url)....

const dbPath = path.join(__dirname, '../db/storeposts.js');  //absolute path
const pathImagecover = path.join(__dirname, '../public/imgcover');  //absolute path 

// Set Multer to upload ANY file
const mystorage=multer.diskStorage({  //custom configuration(Multer) called 'storage'
    destination:(req,file,cb)=>{  //where save file, cb is callback(the function where operate, with Nodejs follow convention cb(manageerror-result))
      cb(null, pathImagecover);  //cb(noerrors-path) where save file
    },
    filename: (req,file,cb) => {  //how name file
      //const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);  //better x security and name conflicts
      //cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`); // Usa un nome unico generato
      cb(null, file.originalname);  ////cb(noerrors-namefile) maintain the same name
    },
});
const upload=multer({storage:mystorage});  //pass own custom configuration to Multer, and name all 'upload'


const index=(req,res)=>{    //INDEX
    return res.status(200).json({
        data : posts,
        counter : posts.length
    });
};

const show=(req,res)=>{    //SHOW
    const postIndex = posts.findIndex((item,index)=> item.id === Number(req.params.id));  //findIndex() return the index in the array (return -1 if not found),Number() converts in num
    console.log(postIndex);
    if(postIndex===-1){  
        return res.status(404).json({
            error : '404 Not Found'
        });
    }
    return res.status(200).json({
        data : posts[postIndex]
    });
};

const store=(req,res)=>{    //STORE
    //console.log(req.body);
    const filePath = req.file ? `/imgcover/${req.file.filename}` : null; //req.file(provided by Multer, contains the file uploaded), set the full path where save file in the backend
    const post = {
        id: uuidv4(),  //ID UNIVOCO +-128BIT
        slug : req.body.slug,   //important also x seo, i.e. sonic-hyperspace-rocket
        title : req.body.title,
        content : req.body.content,
        price : Number(req.body.price),
        file : filePath,  //THE NAME OF THE FIELD IS 'FILE' foundamental x 'upload.single('file')'
        category: req.body.category,
        tags : JSON.parse(req.body.tags),  //CONVERT THIS JSON IN ORGINAL ARRAY! USE ARRAY+FORMDATAtype IS IMPORTANT
        visibility: req.body.visibility,
    };
    posts.push(post);  //add the new post
    try{  
        fs.writeFileSync(dbPath,`module.exports = ${JSON.stringify(posts,null,4)}`);  //overwrite my db example
          //overwrite posts.js file, with string 'module.exports ='+${JSON.stringify(posts,null,4)}
          //json.stringify(thearray-mask(none here)-indentation spaces(crea formattazione nidificazione verso destra))
        return res.status(201).json({  //201 = created
            data : posts,
            counter : posts.length
        });
    }
    catch{
        return res.status(500).json({ error:'Error storing the post data.'});
    }
};
//test with PostMan software (new>body:raw,Json)(x img files use body:formdata)

const update=(req,res)=>{    //UPDATE
    const postIndex = posts.findIndex((intem,index)=> intem.id === Number(req.params.id));
    console.log(postIndex);
    if(postIndex===-1){
        return res.status(404).json({
            error : '404 Not Found'
        });
    }
    const newpost = {
        ...posts[postIndex], //create copy of the post target, if a field is declared >1 time, the last dichiaration wins!
        title: req.body.title || posts[postIndex].title,  //upload the field with the new value(if exists)
        slug: req.body.slug || posts[postIndex].slug,
        content: req.body.content || posts[postIndex].content,
        image: req.body.image || posts[postIndex].image,
        tags: req.body.tags || posts[postIndex].tags
    }
    posts[postIndex] = newpost;  //upload the target index with the new created post
    try{
        fs.writeFileSync('../db/storeposts.js',`module.exports=${JSON.stringify(posts,null,4)}`);
        return res.status(200).json({
            data : newpost,
        });
    }
    catch{
        return res.status(500).json({error:'Error updating the post data.'});
    }
};

const destroy=(req,res)=>{    //DESTROY
    const postIndex = posts.findIndex((intem,index)=> intem.id === Number(req.params.id));
    if(postIndex===-1){  
        return res.status(404).json({
            error : '404 Not Found'
        });
    }
    posts.splice(postIndex, 1);  //splice(index-nums) remove element from the array, lascia buchi xk non puoi riutilizzare in nuovi post same index of deleted posts!
    try{
        fs.writeFileSync('../db/storeposts.js',`module.exports=${JSON.stringify(posts,null,4)}`);
        return res.status(200).json({
            data : posts,
            counter : posts.length
        });
    }
    catch{
        return res.status(500).json({ error:'Error deleting the post data.'});
    }
};

module.exports={  //export your functions
    index,
    show,
    store,
    update,
    destroy,
    upload,  //export also upload!
}


