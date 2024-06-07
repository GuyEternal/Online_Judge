import mongoose from "mongoose";
import User from "../models/user.js";
import bcrypt, { hash } from "bcrypt";
import jwt from "jsonwebtoken";
// Use .env file to store the secret key:
import dotenv from "dotenv";
import { verifyToken } from "../middleware/verifyToken.js";

// Implement Register and Login endpoints:

// Register a new user
export const register = async (req, res) => {
    try {
        //get all the data from body
        console.log(req.body);
        const { fullName, username, email, password } = req.body;
        console.log(fullName, username, email, password);
        // check that all the data should exists
        if (!(fullName && username && email && password)) {
            return res.status(400).send("Please enter all the information");
        }
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).send("Username already taken");
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).send("Email already in use");
        }

        // encrypt the password
        const hashedPassword = await bcrypt.hash(password, 4);

        console.log(hashedPassword);
        // save the user in DB
        const user = await User.create({
            fullName,
            username,
            email,
            password: hashedPassword,
        });
        console.log("User Created in DB");
        res.status(200).json({ success: true, message: "You have successfully registered!", user });
    }
    catch (error) {
        res.status(404).send(error);
    }
};

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const redirectURL = req.query.redirect; // get the redirect URL from the query parameters
        if (!(username && password)) {
            return res.status(400).send("Please enter all the information");
        }
        const currUser = await User.findOne({ username });
        if (!currUser) {
            return res.status(400).send("User does not exist!");
            // Redirect to register or something
        }
        const hashedPassword = await bcrypt.compare(password, currUser.password).then((match) => {
            if (!match) {
                return res.status(400).send("Invalid credentials");
            }
            // If the password is correct, generate a token:
            const token = jwt.sign({ id: currUser._id, username, email: currUser.email }, process.env.SECRET_KEY, {
                expiresIn: "1d",
            });
            currUser.token = token;
            currUser.password = undefined;
            // send cookies to the client:
            let oid = mongoose.Types.ObjectId;
            oid = currUser._id;
            let id = oid.toString();
            res.status(200).cookie("token", token, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000,
            }).send({ message: "You have successfully logged in!", currUser, id, token, success: true, redirect: redirectURL });
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

const verifyCheckAuth = (req, res, token) => {
    return new Promise((resolve, reject) => {
        if (!token) {
            reject(new Error("No token provided"));
        }
        jwt.verify(token, process.env.SECRET_KEY, (err, payload) => {
            if (err) {
                console.log("This is the error when token is verified unseucde: ", err);
                reject(new Error("Token verification failed"));
            } else {
                console.log("This is when token is verified successfully:");
                req.userID = payload.id;
                req.username = payload.username;
                resolve();
            }
        });
    });
}

export const checkAuth = async (req, res) => {
    try {
        const token = req.cookies.token; // You need to get the token from the request
        if (!token) {
            return res.status(200).json({ success: false, message: "No token provided" });
        }
        console.log(token, req.userID);
        await verifyCheckAuth(req, res, token);
        return res.status(200).json({
            success: true,
            message: "You are authenticated!",
            userID: req.userID,
            username: req.username
        });
    } catch (error) {
        return res.status(200).json({ success: false, message: "Not authenticated" });
    }
}
