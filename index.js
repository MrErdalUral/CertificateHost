const express = require('express')
const fileUpload = require('express-fileupload');
const fs = require('fs');
const https = require('https');
var cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
}));
app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
});

// app.get('/Certificates', (req, res) => {
//     fs.readdir('./certificates', (err, files) => {
//         if (err) {
//             res.send(err);
//         } else {
//             res.send(files);
//         }
//     })
// });
// app.get('/Certificates/:dir', (req, res) => {
//     fs.readdir(`./certificates/${req.params.dir}`, (err, files) => {
//         if (err) {
//             res.send(err);
//         } else {
//             res.send(files);
//         }
//     })
// });



app.post('/upload', (req, res) => {

    console.log(req.body.name);
    console.log(req.body.CustomerDevice.Name)
    console.log(req.body.CustomerDevice.Brand)
    console.log(req.body.CustomerDevice.Type)
    console.log(req.body.CustomerDevice.SerialNumber)
    console.log(req.body.CustomerDevice.SimkalNumber)
    console.log(req.body.CustomerDevice.InventoryNumber)
    console.log(req.body.Certificate.CertificateNumber)
    let file = req.body.file;
    let pathToDir = `${__dirname}/certificates/${req.body.folder}`;
    
    if (!fs.existsSync(pathToDir)) {
        fs.mkdirSync(pathToDir);
    }
    pathToDir = `${__dirname}/certificates/${req.body.folder}/${req.body.name}`;
    if (!fs.existsSync(pathToDir)) {
        fs.mkdirSync(pathToDir);
    }
    let fileName = `${pathToDir}/${req.body.Certificate.CertificateNumber}.pdf`;
    fs.writeFile(fileName, Buffer.from(file, "base64"), { encoding: 'binary' }, function (err) {
        if (err) {
            return res.status(500).send(err);
        } else {
            let htmlstring = `<!DOCTYPE html><html><head><title>TEST HTML</title></head><body><div><a href='/certificates/${fileName}</a></div></body>`
            fs.writeFile(`${pathToDir}/Index.html`, htmlstring, function (err) {
                if (err) {
                    return res.status(500).send(err);
                } else {
                    const url = `/certificates/${req.body.folder}/${req.body.name}/Index.html`;
                    res.send({ success: 1, result: url });
                }
            });
            
        }
    });
});

const port = 3000;
https.createServer({
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert')
  }, app).listen(port, () => { console.log(`Listening on port ${port}...`) });
