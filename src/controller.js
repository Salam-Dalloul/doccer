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
      return res.status(500).json({ failed: true });
    } else {
      res.writeHead(200, { 'content-Type': 'text/html' });
      return res.send(file);
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
  } catch(err) {
    return res.status(500).json({ failed: true });
  }

  const buf = doc.getZip()
               .generate({type:"nodebuffer"});

  const fileName = "contract.docx";
  const filePath = path.join(__dirname, '..', 'public','contract.docx');

  fs.writeFileSync(filePath, buf);

  return res.json({status: true});
});


router.post('/search-org', (req, res) => {
  const { orgNum } = req.body;

  const options = {
    query:orgNum
  }

  let requiredData = {}

  brreg(options)
  .then((result) => {
    const data = result.enhetsregisteret.data.entries
    if (!data.length) {
      return res.status(400).json({ failed: true });
    }
    const orgData = data[0];
    requiredData = {
      org_name: orgData.navn,
      org_city: orgData.forradrpoststed,
      org_address: orgData.forretningsadr,
      org_postnr: orgData.forradrpostnr
    };
    return res.json(requiredData);
  })
  .catch((err) => {
    return res.status(504).json({ failed: true });
  })
})

module.exports = router;
