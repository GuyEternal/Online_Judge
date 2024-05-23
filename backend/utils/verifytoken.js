import jwt from "jsonwebtoken";
import createError from "../utils/createError.js";

export const verify = async (token) => {
    jwt.verify(token, process.env.SECRET_KEY, (err, payload) => {
        if (err) {
            return createError(403, "Token is not valid!");
        }
        return payload._id;
    });
}