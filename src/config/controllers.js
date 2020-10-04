const bcrypt= require('bcryptjs');
const User = require('../models/User');
const crypto=require('crypto');

const resetMailer=require('../mailer/resetPasswordmailer');
const resetSuccess=require('../mailer/resetPasswordSuccess');





//it will redirect to the change password page where we will change password when user is login by updating his password
module.exports.resetPage=function(req,res){
    return res.render('users/reset',{
        title: 'Reset Page'
    });
}


//it will take to the reset password where user wants to give email as input
module.exports.forgot=function(req,res){
    return res.render('users/inputreset',{
        title: 'Reset Page'
    });
}

//when submitting the email it generate accesstoken and expiray of accesstoken and send a mail to user with that reset link
module.exports.forgotPassword=async function(req,res){
    try{
        let user=await User.findOne({email: req.body.email});

        if(!user){
            req.flash('error', 'No account with that email address exists.');
            return res.redirect('back');
        }

        //here we generate the accesstoken
        let token=await crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken=token;
        //here we set the expiray of accesstoken
        user.resetPasswordExpires=Date.now() + 300000;
        await user.save();

        //here we send the mail using nodemailer with reset link
        resetMailer.resetPassword(user,token);
        req.flash('success','An e-mail has been sent '+user.email+'to with further instructions.');
        return res.redirect('/');
    }catch(err){
        console.log("error",err);
    }
    
}

 












module.exports.renderResetPage=function(req,res){
    //here find the user by accsestoken
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user){
        if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('/user/forgot');
        }
        return res.render('users/reset',{
            title: 'Reset Page',
            User: user
        }); 
    })

   
}


//when submitting the email it generate accesstoken and expiray of accesstoken and send a mail to user with that reset link
module.exports.forgotPassword=async function(req,res){
    try{
        let user=await User.findOne({email: req.body.email});

        if(!user){
            req.flash('error', 'No account with that email address exists.');
            return res.redirect('back');
        }

        //here we generate the accesstoken
        let token=await crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken=token;
        //here we set the expiray of accesstoken
        user.resetPasswordExpires=Date.now() + 300000;
        await user.save();

        //here we send the mail using nodemailer with reset link
        resetMailer.resetPassword(user,token);
        req.flash('success','An e-mail has been sent '+user.email+'to with further instructions.');
        return res.redirect('/');
    }catch(err){
        console.log("error",err);
    }
    
}



module.exports.forgotSuccess =async function(req,res){
    try{
        //here find the user by accsesstoken
        let user=await User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } });
        if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('back');
        }

        //here it will decrypt thee password
        let hashPassword=await bcrypt.hash(req.body.resetPassword, BCRYPT_SALT_ROUNDS);
        user.password = hashPassword;
        //after password change set the accesstoken as null
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        //send confirm mail
        resetSuccess.resetPasswordSuccss(user);
        req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        return res.redirect('/users/signin');
    }catch(err){
        if(err){
            console.log('error',err);
        }
    }
        
}

















var BCRYPT_SALT_ROUNDS = 12;

//here is the reset password when user is login using update
module.exports.resetPassword=async function(req,res){
    try{
        console.log(req.body);
        if(req.body.resetPassword!=req.body.repeatresetPassword){
            req.flash('error','Password and repeat password does not match');
            return res.redirect('back');
        }
        console.log("password match");
        //here decypt the password
        let hashPassword=await bcrypt.hash(req.body.resetPassword, BCRYPT_SALT_ROUNDS);
        console.log(hashPassword);
        console.log(req.user.id);
        let user=await User.findByIdAndUpdate(req.user.id,{password: hashPassword});
        console.log("Password update successfully");
        req.flash('success','Your password is updated successfully');
        return res.redirect('/users/signin');
    }catch(err){
        req.flash('error',err);
        return;
    }
    
}
