import mongoose from "mongoose";
import User from "../models/user.js";
import bcrypt, { hash } from "bcrypt";
import jwt from "jsonwebtoken";
// Use .env file to store the secret key:
import dotenv from "dotenv";

// Implement Register and Login endpoints:

// Register a new user
export const register = async (req, res) => {
    try {
        //get all the data from body
        console.log(req.body);
        const { fullName, email, password } = req.body;
        console.log(fullName, email, password);
        // check that all the data should exists
        if (!(fullName && email && password)) {
            return res.status(400).send("Please enter all the information");
        }

        // check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(200).send("User already exists!");
        }
        // encrypt the password
        const hashedPassword = await bcrypt.hash(password, 4);

        console.log(hashedPassword);
        // save the user in DB
        const user = await User.create({
            fullName,
            email,
            password: hashedPassword,
        });
        console.log("User Created in DB");
        // generate a token for user and send it
        const token = jwt.sign({ id: user._id, email }, process.env.SECRET_KEY, {
            expiresIn: "1d",
        });
        user.token = token;
        user.password = undefined; // Set password to undefined to avoid exposing even the hashedPassword to the client side

        res.status(200).json({ message: "You have successfully registered!", user });
    }
    catch (error) {
        res.status(404).send(error);
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!(email && password)) {
            return res.status(400).send("Please enter all the information");
        }
        const currUser = await User.findOne({ email });
        if (!currUser) {
            return res.status(400).send("User does not exist!");
            // Redirect to register or something
        }
        const hashedPassword = await bcrypt.compare(password, currUser.password).then((match) => {
            if (!match) {
                return res.status(400).send("Invalid credentials");
            }
            // If the password is correct, generate a token:
            const token = jwt.sign({ id: currUser._id, email }, process.env.SECRET_KEY, {
                expiresIn: "1d",
            });
            currUser.token = token;
            currUser.password = undefined;
            // send cookies to the client:
            res.status(200).cookie("token", token, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
            }).json({ message: "You have successfully logged in!", currUser, token });
        });

    } catch (error) {
        console.log(error);
        res.send(error);
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie("token").send("You have successfully logged out!");
    } catch (error) {
        res.send(error).json({ message: "You ARE NOT logged out due to an internal error!" });
    }
}