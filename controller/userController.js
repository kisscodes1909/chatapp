const {addUser, getUserByEmail} = require('../model/user');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const {generateUserAvatar} = require('../core-functions/user');

function validateRegisterForm(data) {
    let errors = [];

    if(data.password !== data.repassword) {
        errors.push('Your password is not same!');
    }

    return errors;
}


const createNewUser = async (req, res, next) => {
    const formData = req.body;
    let status = {
        code: 200,
        messages: ['Register success']
    };


    // Validate form
    const errors = validateRegisterForm(formData);

    if(errors.length > 0) {
        status = {
            code: 400,
            messages: errors
        }

        res.render('register', {
            status,
            formData
        },);
    
    }

    // Is user exist already ?

    const user = await getUserByEmail(formData.email);

    if( user ) {
        status = {
            code: 400,
            messages: ['Please user another email to register!']
        }

        res.render('register', {
            status,
            formData
        });

        // res.sendStatus(200);
        
        return;
    }
    
    //Insert to database
    try {

        // Hash pasword..
        const hashPasword = await bcrypt.hash(formData.password, saltRounds);

        // Generate random avatar

        const avatar = await generateUserAvatar(formData.firstName);


        //console.log(hashPasword);

        const response =  await addUser({
            firstname: formData.firstName,
            lastname: formData.lastName,
            password: hashPasword,
            email: formData.email,
            avatar
        });

        // Store user to session
        req.session.user = response;

        res.redirect('/');

        // status = {
        //     code: 200,
        //     messages: ['Register success, redirect...']
        // }

        // //console.log(response);


        
        // res.render('register', {
        //     status,
        //     formData
        // });
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

const login = async function(req, res, next) {
    const formData  = req.body;
    let status    = {}
    
    const user = await getUserByEmail(formData.email);

    if( user === null ) {
        status = {
            code: 400,
            messages: ['Your email is not exist! Please register a new account.']
        }
    }
    
    // Compare password
    try {
        const comparePassResult = await bcrypt.compare(formData.password, user.password);

        if(comparePassResult === true) {
            status = {
                code: 200,
                messages: ['Login successfully']
            }

            // Store user to session
            req.session.user = user;

            // Redirect to home

            res.redirect('/');

        } else {
            status = {
                code: 400,
                messages: ['Your password is incorrect!']
            } 

            res.render('login', {
                status,
                formData
            });
        }

    } catch (error) {
        console.log(error);
    }
}

const logout = async (req, res) => {
    req.session.destroy();
    res.redirect('/user/login');
}

module.exports = {
    createNewUser,
    login,
    logout
}