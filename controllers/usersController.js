import { pluralize } from 'mongoose';
import fs from 'fs/promises';
import path from 'path';
import { User } from '../models/usersModel.js';
import { signupValidation, subscriptionValidation, emailValidation } from '../validation/validation.js';
import 'dotenv/config';
import jwt from 'jsonwebtoken';
import gravatar from 'gravatar';
import bcrypt from 'bcrypt';
import { Jimp } from 'jimp';
import { sendEmail } from '../helpers/sendEmail.js';
import { nanoid } from 'nanoid';

const { SECRET_KEY, PORT } = process.env;

const signupUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const { error } = signupValidation.validate(req.body);
        if(error) {res.status(400).json({ message: 'Missing required email or password field' });}

        const existingUser = await User.findOne({ email });
        if(existingUser) {res.status(409).json({ message: 'Email in use' });}
    
        const hashedPassword = await bcrypt.hash(password, 10);
        const avatarURL = gravatar.url(email, {protocol: 'http'});

        const verificationToken = nanoid();

        await sendEmail({
            to: email,
            subject: "Action Required: Verify your Email",
            html: `<a target="_blank" href="http://localhost:${PORT}/api/users/verify/${verificationToken}> Click to verify email</a>`,
        });

        const newUser = await User.create({
            email,
            password: hashedPassword,
            avatarURL,
            verificationToken,
        });
        res.status(201).json({
            user: {
                email: newUser.email,
                password: newUser.password,
                subscription: newUser.subscription,
                avatarURL: newUser.avatarURL,
                verificationToken,
            }
        });
    } catch (error) {res.status(500).json({ message: error.message });}
}

const loginUser = async (req, res) => {
    try {
        const { error } = signupValidation.validate(req.body);
        if(error) {res.status(401).json({ message: 'Missing required email or password field' });}

        const { email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if(!existingUser) {res.status(401).json({ message: 'Email or password is wrong' });}

        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if(!isPasswordValid) {res.status(401).json({ message: 'Password is wrong' });}

        const payload = { id: existingUser._id };
        const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
        await User.findByIdAndUpdate(existingUser._id, { token });
        res.status(200).json({
            token,
            user: {
                email: existingUser.email,
                // subscription: existingUser.subscription,
            }
        });
    } catch (error) {res.status(500).json({ message: error.message });}
}

const logoutUser = async (req, res) => {
    try {
        const { _id } = req.user;
        await User.findByIdAndUpdate(_id, { token: "" });
        res.status(204).json({ message: 'User successfully logged out' });
    } catch (error) {res.status(500).json({ message: error.message });}
}

const getCurrentUser = async (req, res) => {
    try {
        const { email, subscription } = req.user;
        res.status(200).json({ email, subscription });
    } catch (error) {res.status(500).json({ message: error.message });}
}

const updateUserSubscription = async (req, res) => {
    try {
        const { error } = subscriptionValidation.validate(req.body);
        if(error) {res.status(400).json({ message: error.message });}

        const { _id } = req.user;
        const updatedUser = await User.findByIdAndUpdate(_id, req.body, { new: true, });
        res.status(200).json({
            email: updatedUser.email,
            subscription: updatedUser.subscription,
        });
    } catch (error) {res.status(500).json({ message: error.message });}
}

const updateAvatar = async (req, res) => {
    try {
        const { _id } = req.user;
        const { path: oldPath, originalname } = req.file;
        await Jimp.read(oldPath).then((image) => {
            image.resize({ w: 250, h: 250 }).write(oldPath)
        })
        .catch((error) => console.log(error));

        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const extension = path.extname(originalname);
        const filename = `${_id}${extension}`;
        // console.log("Generated Filename:", filename);

        const newPath = path.join("public", "avatars", filename);
        await fs.rename(oldPath, newPath);

        let avatarURL = path.join('/avatars', filename);
        avatarURL = avatarURL.replace(/\\/g, "/");

        // const avatarURL = path.join('/avatars', filename);

        await User.findByIdAndUpdate(_id, { avatarURL });
        res.status(200).json({ avatarURL });
    } catch (error) {res.status(500).json({ message: error.message });}
}

const verifyEmail = async (req, res) => {
    try {
        const { verificationToken } = req.params;
        const user = await User.findOne({ verificationToken });
        if(!user) {return res.status(404).json({ message: 'User not found' });}

        await User.findByIdAndUpdate(user._id, {
            verify: true,
            verificationToken: null,
        });
        res.status(200).json({ message: 'Verification successful' });
    } catch (error) {res.status(500).json({ message: 'Internal server error' });}
}

const resendVerifyEmail = async (req, res) => {
    try {
        const { email } = req.body;

        const { error } = emailValidation.validate(req.body);
        if(error) {return res.status(400).json({ message: error.message });}
    
        const user = await User.findOne({ email });
        if(!user) {return res.status(404).json({ message: 'Provided email not found' });}
    
        if(user.verify) {return res.status(400).json({ message: 'Verification already passed' });}
    
        await sendEmail({
            to: email,
            subject: "Action Required: Resent Verify your Email",
            html: `<a target="_blank" href="http://localhost:${PORT}/api/users/verify/${user.verificationToken}> Click to verify email</a>`,
        });
    
        res.status(200).json({ message: "Verification email sent" });
    } catch (error) {res.status(500).json({ message: error.message });}
}

export { signupUser, loginUser, logoutUser, getCurrentUser, updateUserSubscription, updateAvatar, verifyEmail, resendVerifyEmail };