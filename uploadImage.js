const fetch = require('node-fetch');
const axios = require('axios')
const FormData = require('form-data');
const { fromBuffer } = require('file-type');

/**
 * Upload file to https://i.supa.codes
 * @returns {string|null|(string|null)[]}
 */
const supa = async (buffer) => {
let { ext } = await fromBuffer(buffer);
    let bodyForm = new FormData();
    bodyForm.append("file", buffer, "file." + ext);
    let res = await fetch("https://i.supa.codes/api/upload", {
        method: "post",
        body: bodyForm,
    });
    let data = await res.json();
    let resultUrl = data
    return resultUrl.link
}


const api8030 = async (buffer) => {
    let { ext } = await fromBuffer(buffer);
    let bodyForm = new FormData();
    bodyForm.append("file", buffer, "file." + ext);
    let res = await fetch("https://8030.us.kg/api/upload.php", {
        method: "post",
        body: bodyForm,
    });
    let data = await res.json();
    let resultUrl = data.result ? data.result.url : '';
    return resultUrl;
}

/**
 * Upload file to https://catbox.moe
 * @returns {string|null|(string|null)[]}
 */
 const catbox = async (buffer) => {
  let { ext } = await fromBuffer(buffer);
  let bodyForm = new FormData();
  bodyForm.append("fileToUpload", buffer, "file." + ext);
  bodyForm.append("reqtype", "fileupload");

  let res = await fetch("https://catbox.moe/user/api.php", {
    method: "POST",
    body: bodyForm,
  });

  let data = await res.text();
  return data;
  }


/**
 * Upload file to https://qu.ax
 * @returns {string|null|(string|null)[]}
 */

const quax = async (buffer) => {
let { ext, mime } = await fromBuffer(buffer);
    const form = new FormData();
    form.append('files[]', buffer, {
        filename: 'tmp.' + ext,
        contentType: mime,
    });

    const { data } = await axios.post(
        "https://qu.ax/upload.php",
        form,
        {
            headers: {
                ...form.getHeaders(),
            }
        }
    );

    return data.files[0].url;
};

/**
 * Upload epheremal file to file.io
 * `Expired in 1 day`
 * `100MB Max Filesize`
 * @param {Buffer} buffer File Buffer
 */
const fileIO = async (buffer) => {
  const { ext } = await fromBuffer(buffer) || {};
  const form = new FormData();
  form.append('file', buffer, `tmp.${ext}`);
  const res = await fetch('https://file.io/?expires=1d', { // 1 Day Expiry Date
    method: 'POST',
    body: form
  });
  const json = await res.json();
  if (!json.success) throw json;
  return json.link;
};


/**
 * Upload file to https://file.btch.rf.gd
 * @returns {string|null|(string|null)[]}
 */
const api = async (buffer) => {
  let { ext } = await fromBuffer(buffer);
  let bodyForm = new FormData();
  bodyForm.append("file", buffer, "file." + ext);
  let res = await fetch("https://file.btch.rf.gd/api/upload.php", {
    method: "post",
    body: bodyForm,
  });
  let data = await res.json();
  let resultUrl = data.result ? data.result.url : '';
  return resultUrl;
}

module.exports = async function (inp) {
  let err = false;
  for (const upload of [supa, api8030, catbox, quax, api, fileIO]) {
    try {
      return await upload(inp);
    } catch (e) {
      err = e;
    }
  }
  if (err) throw err;
};