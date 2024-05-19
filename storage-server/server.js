const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors');
const fs= require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
const port =3000;

app.use(cors());
app.use(bodyParser.json());

const storage = multer.diskStorage(
    {
        destination : function(req,file,cb) {
            cb(null , 'uploads/');
        },
        filename : function(req,file,cb){
            cb(null,file.originalname);
        }
    }
);

const upload = multer({storage:storage}).array('files',10);

app.use('/uploads',express.static(path.join(__dirname,'uploads')))

app.post('/upload',(req,res)=>{
    upload(req,res,(err)=>{
        if(err instanceof multer.MulterError)
            return res.status(500).json({err:err.message})
        else if(err)
            return res.status(500).json({err:err.message})
        return res.status(200).send('file are uploaded successfully')
    })
})

app.get('/uploadedFiles',(req,res)=>{
    const dirpath = path.join(__dirname,'uploads');
    fs.readdir(dirpath,(err,files)=>{
        if(err)
            return res.status(500).send('unable to send the files');
        const fileDetails = files.map(file =>({
            name:file,
            url : `http://localhost:${port}/uploads/${file}`
        }))
        res.json(fileDetails)
    })
})

app.listen(port,()=>{
    console.log(`server is running on http://localhost:${port}`)
})