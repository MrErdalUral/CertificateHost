const express = require('express')
const fileUpload = require('express-fileupload');
const fs = require('fs');
var cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
}));
// app.get('/', (req, res) => {
//     res.sendFile(`${__dirname}/index.html`);
// });

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

app.get('/Certificates/:dir/:name', (req, res) => {
    fs.readFile(`./certificates/${req.params.dir}/${req.params.name}`, (err, file) => {
        if (err) {
            if (err.errno === -4058) {
                res.status(404).send(`${req.params.name} kodlu sertifika bulunamadı!`);
            } else {
                res.send(err);
            }
        } else {
            res.send(file);
        }
    });
});

app.post('/upload', (req, res) => {

    console.log(req.body.name);
    // console.log(req.body.files);
    // console.log(req.body.name);
    // console.log(req.body.folder);

    let file = req.body.file;
    const pathToDir = `${__dirname}/certificates/${req.body.folder}`;
    if (!fs.existsSync(pathToDir)) {
        fs.mkdirSync(pathToDir);
    }
    fs.writeFile(`${pathToDir}/${req.body.name}`, Buffer.from(file, "base64"), { encoding: 'binary' }, function (err) {
        if (err) {
            return res.status(500).send(err);
        } else {
            const url = `/Certificates/${pathToDir}/${req.body.name}`;
            res.send({ success: 1, result: url })
        }
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => { console.log(`Listening on port ${port}...`) });
