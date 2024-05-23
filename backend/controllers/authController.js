import mongoose from "mongoose";
import User from "../models/user.js";
import bcrypt, { hash } from "bcrypt";
import jwt from "jsonwebtoken";
import cookies from "cookie-parser"
// Use .env file to store the secret key:
import dotenv from "dotenv";
import { verifyToken } from "../middleware/verifyToken.js";

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

        res.status(200).json({ success: true, message: "You have successfully registered!", user });
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
            let oid = mongoose.Types.ObjectId;
            oid = currUser._id;
            let id = oid.toString();
            // console.log(id_str);
            res.status(200).cookie("token", token, {
                httpOnly: true,
                secure: false,
                sameSite: "none",
            }).json({ message: "You have successfully logged in!", currUser, id, token, success: true });
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
        return res.status(200).json({ success: true, message: "You are authenticated!" });
    } catch (error) {
        return res.status(200).json({ success: false, message: "Not authenticated" });
    }
}
