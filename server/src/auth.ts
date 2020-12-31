import jwt from "jsonwebtoken";
import { Database } from "./db/database";
import {User} from "./graphql/generated/resolver-types";

export interface AuthenticationConfig {
    secret: string;
    expiration: string | number;
    db: Database;
}

export class Authentication {
    private config: AuthenticationConfig

    constructor(config: AuthenticationConfig) {
        this.config = config;
    }

    apollo(request: any): {isAuth: boolean, userId?: string} {
        const header = request.req.headers.authorization;

        // Header not found
        if (!header) return { isAuth: false };

        const token: any = header.split(" ");

        // Token not found
        if (!token) return { isAuth: false };

        let decodeToken: any;

        try {
            decodeToken = jwt.verify(token[1], this.config.secret);
        } catch (err) {
            return { isAuth: false };
        }

        if (!decodeToken) return { isAuth: false };

        return { isAuth: true, userId: decodeToken.userId };
    }

    generateToken(user: User) {
        const token = jwt.sign(user, this.config.secret, {
            expiresIn: this.config.expiration,
            subject: user.id.toString();
        });
    
        jwt.verify(token, this.config.secret, (err, data) => {
            console.log("Token verification:", err, data);
        });
    
        return token;
    }

    private verify(token: string, secret: string): boolean {

    }
}