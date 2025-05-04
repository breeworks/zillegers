// this will take user's token and store the user id 
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

declare global {
    namespace Express {
        interface Request {
            userId?: string;
            userName?: string;
        }
    }
}

interface DecodedToken{
    id : string
    name : string
}

function Middleware(req: Request,res: Response, next: NextFunction) {
    const authHeader = req.headers["authorization"]; 

    if (!authHeader || !authHeader.startsWith("Bearer")) {
        res.status(401).json({ message: "Access token is missing or invalid" });
        return
    }
    
    const userToken = authHeader.split(" ")[1]

    console.log("Extracted Token:", userToken);
    
    try {
        const JwtSecret = "Secret";
        const decoded = jwt.verify(userToken,JwtSecret) as DecodedToken;
        req.userId = decoded.id;
        req.userName = decoded.name
        console.log(`UserId : ${req.userId}, Name : ${req.userName}`);
        
        next();
    } catch (error) {
        res.status(403).json({ message: "Invalid or expired token" });
        return;
    }
};

export default Middleware;