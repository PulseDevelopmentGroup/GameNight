import jwt from "jsonwebtoken";
import {User} from "../graphql/generated/resolver-types";
import {env} from "../config";


export function generateToken(user: User) {
    const token = jwt.sign(user, env.httpScrt, {
        expiresIn: "1y",
        subject: user.id.toString();
    });

    jwt.verify(token, env.httpScrt, (err, data) => {
        console.log("Token verification:", err, data);
    });

    return token;
}

export function verifyToken(token: String, user: User) {}