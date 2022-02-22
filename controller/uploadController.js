const fsPromises = require("fs/promises");
const path = require('path');


const getAvatar = async (req, res, next) => {
    const options = {
        root: process.cwd()
    };

    const {fileName} = req.params;

    res.sendFile(`upload/avatar/${fileName}`, options);
}

module.exports = {
    getAvatar
}