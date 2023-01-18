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

app.get('/Certificates', (req, res) => {
    fs.readdir('./certificates', (err, files) => {
        if (err) {
            res.send(err);
        } else {
            res.send(files);
        }
    })
});

app.get('/Certificates/:dir', (req, res) => {
    fs.readdir(`./certificates/${req.params.dir}`, (err, files) => {
        if (err) {
            res.send(err);
        } else {
            res.send(files);
        }
    })
});

app.get('/Certificates/:dir/:name', (req, res) => {
    fs.readFile(`./certificates/${req.params.dir}/${req.params.name}`, (err, file) => {
        if (err) {
            if (err.errno === -4058) {
                res.status(404).send(`${req.params.name} kodlu dosya bulunamadı!`);
            } else {
                res.send(err);
            }
        } else {
            res.sendFile(`${__dirname}/certificates/${req.params.dir}/${req.params.name}`);
        }
    });
});

app.get('/.well-known/pki-validation/:name', (req, res) => {
    fs.readFile(`./.well-known/pki-validation/${req.params.name}`, (err, file) => {
        if (err) {
            if (err.errno === -4058) {
                res.status(404).send(`${req.params.name} kodlu dosya bulunamadı!`);
            } else {
                res.send(err);
            }
        } else {
            res.sendFile(`${__dirname}/.well-known/pki-validation/${req.params.name}`);
        }
    });
});


const port = 443;
https.createServer({
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.crt')
  }, app).listen(port, () => { console.log(`Listening on port ${port}...`) });
