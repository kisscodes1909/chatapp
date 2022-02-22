const axios = require('axios');
const fsPromises = require("fs/promises");

const getCurrentUser = (req) => {
    return req.session.user ? req.session.user : null
}

const isUserLoggedIn = (req, res, next) => {
    return req.session.user ? true : false;
}

const getRandomAvatar = async (name) => {
    try {
        const reps = await axios.get(`https://avatars.dicebear.com/api/avataaars/${name}.svg`);
        return reps.data;
    } catch (error) {
        console.log(error);
    }
}

const generateUserAvatar = async (name) => {
    try {
        const randomAvatarSVG = await getRandomAvatar(name);

        const fileName = `${name}-${Date.now()}.svg`;

        // console.log(randomAvatarSVG);

        await fsPromises.writeFile(`./upload/avatar/${fileName}`, randomAvatarSVG);

        return fileName;
    } catch (error) {
        console.log(error);
    }
}

const getUserAvatar =(req, fileName) => {
    return `//${req.get('host')}/upload/avatar/${fileName}`
}

module.exports = {
    getCurrentUser,
    isUserLoggedIn,
    generateUserAvatar,
    getUserAvatar
}