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

    let file = req.body.file;
    let pathToDir = `${__dirname}/certificates/${req.body.folder}`;
    console.log(req.body.CertificateNumber);
    if (!fs.existsSync(pathToDir)) {
        fs.mkdirSync(pathToDir);
    }
    let fileName = `${pathToDir}/${req.body.Certificate.CertificateNumber}.pdf`;

    let jsonContent = JSON.stringify(req.body.Certificate);
    fs.writeFile(`${pathToDir}/deviceData.json`, jsonContent, 'utf8', function (err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return res.status(500).send(err);
        } else {
            console.log("JSON file has been saved.");
            fs.writeFile(fileName, Buffer.from(file, "base64"), { encoding: 'binary' }, function (err) {
                if (err) {
                    console.log("An error occured while writing Pdf file.");
                    return res.status(500).send(err);
                } else{
                    let htmlPath = `${pathToDir}/Index.html`;
                    if (fs.existsSync(htmlPath)) {
                        fs.unlinkSync(htmlPath);
                    }
                    fs.copyFile(`${__dirname}/index.html`, `${pathToDir}/Index.html`, (err) => {
                        if (err) {
                            return res.status(500).send(err);
                        } else {
                            const url = `/certificates/${req.body.folder}/${req.body.Certificate.CertificateNumber}.pdf`;
                            res.send({ success: 1, result: url });
                        }
                    });
                }
            });
        }
    });

    

    //let htmlstring = `<!DOCTYPE html><html><head><title>TEST HTML</title></head><body><div><a target='_blank' href='/certificates/${req.body.folder}/${req.body.name}/${req.body.Certificate.CertificateNumber}.pdf'>${req.body.Certificate.CertificateNumber}</a></div></body>`
   



});


const port = 3000;
https.createServer({
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.crt')
}, app).listen(port, () => { console.log(`Listening on port ${port}...`) });
