const express = require('express');
const fs = require('fs');
const Docxtemplater = require('docxtemplater');
const path = require('path');
const JSZip = require('jszip');
const brreg = require('brreg')


const router = express.Router();

router.get('/', (req, res) => {
  fs.readFile(path.join(__dirname, '..', 'public', 'index.html'), (err, file) => {
    if (err) {
      res.writeHead(500, { 'content-Type': 'text/html' });
      res.end('<h1> Internal server Error </h1>');
    } else {
      res.writeHead(200, { 'content-Type': 'text/html' });
      res.end(file);
    }
  });
});

router.post('/surve-contract', (req, res) => {
  const inputsValues = req.body
  const content = fs
      .readFileSync(path.join(__dirname, 'template.docx'), "binary");

  const zip = new JSZip(content);
  const doc = new Docxtemplater().loadZip(zip)

  doc.setData(inputsValues);
  try {
    doc.render()
  }
  catch (error) {
    var e = {
        message: error.message,
        name: error.name,
        stack: error.stack,
        properties: error.properties,
    }
    console.log(e.properties.errors);
  }

  const buf = doc.getZip()
               .generate({type:"nodebuffer"});

  fs.writeFileSync(__dirname+"/contract.docx",buf);
  res.download(path.join(__dirname, 'contract.docx'))
});

router.post('/search-org', (req, res) => {
  const { orgNum } = req.body;

  const options = {
    query:orgNum
  }

  let requiredData = {}
  brreg(options)
  .then((result) => {
    const orgData = result.enhetsregisteret.data.entries[0];
    requiredData = {
      org_name: orgData.navn,
      org_city: orgData.ppoststed,
      org_address: orgData.postadresse,
    }
    res.end()
  })
  .catch((err) => {
    console.log(err);
  })
})
module.exports = router;
