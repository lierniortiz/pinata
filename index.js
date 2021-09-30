require('dotenv').config()
const express = require('express')
const cors = require("cors")
const app = express()
const bodyParser = require('body-parser')
const fs = require("fs")
const Readable = require("stream").Readable

const pinataSDK = require('@pinata/sdk');
const yourPinataApiKey = process.env.API_KEY
const yourPinataSecretApiKey = process.env.API_SECRET

const pinata = pinataSDK(yourPinataApiKey, yourPinataSecretApiKey);

app.use(cors()) //esto nos devuelve la cabecera necesaria con Access-Control-Allow-Origin
// parse application/json
app.use(bodyParser.json({limit: "50mb"}))

app.post('/upload', async function (request, response) {
	const imgBuffer = Buffer.from(request.body.base64, "base64") //Buffer es de node
	var s = new Readable()
	s.push(imgBuffer)   
	s.push(null) //para cerrar el readable
	s.pipe(fs.createWriteStream("temp.png"));

	const file = fs.createReadStream("temp.png")

	const result = await pinata.pinFileToIPFS(file, {});
  	response.json({status: "ok", cid: result.IpfsHash})
})

app.get('/', function (request, response) {
  	response.json({status: "ok"})
})
 
const port = process.env.PORT
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
}) 




pinata.testAuthentication().then((result) => {
    //handle successful authentication here
    console.log(result);
}).catch((err) => {
    //handle error here
    console.log(err);
});


/*
Access to fetch at 'http://localhost:8000/uplaod' 
from origin 'http://localhost:3000' has been blocked 
by CORS policy: No 'Access-Control-Allow-Origin' header
is present on the requested resource. If an opaque response 
serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled.
*/