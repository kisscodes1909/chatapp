const getCurrentUser = (req) => {
    return req.session.user ? req.session.user : null
}

const isUserLoggedIn = (req, res, next) => {
    return req.session.user ? true : false;
}
 
const signInChecker = (req, res, next) => {
    if(!req.session.user){
        next();     //If session exists, proceed to page
     } else {
        res.redirect('/')//Error, trying to access unauthorized page!
     }
}


module.exports = {
    getCurrentUser,
    isUserLoggedIn,
    signInChecker
}