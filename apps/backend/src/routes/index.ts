import { Router } from "express";
import { UserDashboardRoute } from "./user-dashboard";
import { LeavePlaygroundRoute } from "./leave-playgroung";
import { PlaygroundDashboardRoute } from "./playground-dashboard";
import { PlaygroundRoute } from "./playground";
import { WaitingRoomRoute } from "./waiting-room";
import client from "@repo/db/client";
import jwt from "jsonwebtoken";
import {compare, hash} from "../scrypt";
import { AuthSchema } from "../types";

export const router = Router();

router.post("/signup", async (req, res) => {
    const JwtSecret = process.env.JwtSecret;
    try {
      const { username, password, email } = AuthSchema.parse(req.body);
      const HashingPassword = await hash(password);

      if (!email || !username || !password) {
        res.status(400).json({ message: "Please provide all the credentials." });
        return;
      }
        
      const existingUser = await client.user.findFirst({
        where: {
          OR: [
            { username },
            { email: email || undefined },
          ],
        },
      });
  
      if (existingUser) {
        const jwtToken = jwt.sign(
          { id: existingUser.id, username: existingUser.username },
          `Secret`,
          { expiresIn: "1d" }
        );
    
        res.cookie("access_token", jwtToken, {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
          maxAge: 1000 * 60 * 60 * 24,
        });

        console.log('token->',jwtToken);
        res.status(401).json({ message: "Username or email already exists." });
        return
      }
  
      const verifiedCode = Math.floor(100000 + Math.random() * 900000); // 6-digit code
      const verifiedCodeExpireTime = new Date(Date.now() + 3600000); // 1 hour
  
      const newPlayer = await client.user.create({
        data: {
          username,
          password: HashingPassword,
          email,
          verifiedCode,
          verifiedCodeExpireTime,
          isverified: false,
        },
      });
  
      // Send email with code (replace this with actual mail service)
      console.log(`Email to ${email}: Your verification code is ${verifiedCode}`);

      res.status(201).json({
        message: `${username} registered. Please verify your email.`,
      });
      return;
    } catch (error: any) {
        console.error("Signup error:", error?.message || error);
        res.status(400).json({ error: error?.message || "Something went wrong" });
        return;
      }
});
  
router.post("/verify-email", async (req, res) => {
    try {
      const { email, code } = req.body;
  
      const user = await client.user.findUnique({
        where: { email },
      });
  
      if (!user) {
        res.status(404).json({ message: "User not found." });
        return 
      }
  
      if (user.isverified) {
        res.status(400).json({ message: "User already verified." });
        return 
      }
  
      const isCodeValid = user.verifiedCode === parseInt(code);
      const isNotExpired = user.verifiedCodeExpireTime && new Date(user.verifiedCodeExpireTime) > new Date();
  
      if (isCodeValid && isNotExpired) {
        await client.user.update({
          where: { email },
          data: { isverified: true },
        });
  
        res.status(200).json({ message: "Email verified successfully." });
        return;
      }
  
      res.status(400).json({ message: "Invalid or expired code." });
      return;
    } catch (error: any) {
        console.error("Signup error:", error?.message || error);
        res.status(400).json({ error: error?.message || "Something went wrong" });
        return;
      }
});

router.post("/signin", async (req, res) => {
    const JwtSecret = process.env.JwtSecret;
    console.log("jwt",JwtSecret);
    
    try {
      const { username, password } = AuthSchema.parse(req.body);
  
      const existingUser = await client.user.findUnique({
        where: { username },
      });
  
      if (!existingUser) {
        res.status(401).json({ message: "Invalid username" });
        return;
      }
  
      if (!existingUser.isverified) {
        res.status(403).json({ message: "Please verify your email before logging in." });
        return;
      }

      const isValidPassword = await compare(password, existingUser.password);      
      if (!isValidPassword) {
        res.status(401).json({ message: "Invalid password" });
        return;
      }
  
      const jwtToken = jwt.sign(
        { id: existingUser.id, username: existingUser.username },`Secret`,
        { expiresIn: "1d" }
      );
  
      res.cookie("access_token", jwtToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24,
      });
      
      console.log('token->',jwtToken);
  
      console.log(`${username} logged in successfully`);
      res.status(200).json({ message: "Login successful" });
      return 
    } catch (error: any) {
        console.error("Signin error:", error?.message || error);
        res.status(400).json({ error: error?.message || "Something went wrong" });
        return;
      }
});
  

router.use("/user-dashboard/",UserDashboardRoute)
router.use("/playground/",PlaygroundRoute)
router.use("/playground-dashboard/",PlaygroundDashboardRoute)
router.use("/playground-waiting-room/",WaitingRoomRoute)
router.use("/leave-playground/",LeavePlaygroundRoute)