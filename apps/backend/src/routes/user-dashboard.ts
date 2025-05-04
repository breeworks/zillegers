import { Router } from "express";
import client from "@repo/db/client";
import Middleware from "../middlewares/user";
import cookieParser from "cookie-parser";

export const UserDashboardRoute = Router();
UserDashboardRoute.use(cookieParser());

UserDashboardRoute.get("/user-info",Middleware,async(req,res) => {
    try {
        const userId =  req.userId;
        console.log(userId);

        const user = await client.user.findUnique({
            where: {
              id: userId
            }
          })
          
        if(user){
            console.log(`User's info ${user.username} ${user.email}!`);
            res.status(201).json({message:`User's info ${user.username} ${user.email}!`});
            return;
        }

        const AllSocailLinks = await client.socialLink.findMany();

        if(AllSocailLinks){
            console.log(`These are all the link ${AllSocailLinks.map((link)=>`${link.url} \n and ${link.platform}`)} for platforms!`);
            res.status(201).json({message:`These are all the link ${AllSocailLinks.map((link)=>`${link.url} \n and ${link.platform}`)} for platforms!!`});
            return;
        }

    }catch (error : any) {
        console.error("user-section error:", error?.message || error);
        res.status(400).json({ error: error?.message || "Something went wrong" });
        return;
    }
})

UserDashboardRoute.post("/user-section", Middleware, async(req,res) => {
    try {
        const {PlatformLinks, Platform} = req.body
        
        const userId =  req.userId;
        console.log(userId);
        

        const CreateSocialLink = await client.socialLink.create({
            data: {
              user: {connect: {id: userId}}, 
              url: PlatformLinks,
              platform: Platform
            }
        });

        if(CreateSocialLink){
            const socialLinkId_Cookie  = res.cookie("socialLinkIdId",CreateSocialLink.id, {
                httpOnly : true,
                secure: false,
                sameSite: "lax",
                maxAge: 1000 * 60 * 60 * 24,        
            });

            console.log(` link ${PlatformLinks} for platform ${Platform} has been created!`);
            res.status(201).json({message:`Link ${PlatformLinks} for platform ${Platform} has been created!`});
            return;
        }else{
            console.error(`Error in ${PlatformLinks}`);
            res.status(400).json({message : `error in ${PlatformLinks}` });
            return;
        };
    }catch (error: any) {
        console.error("user-section error:", error?.message || error);
        res.status(400).json({ error: error?.message || "Something went wrong" });
        return;
    }
});

UserDashboardRoute.post("/update-user-section", Middleware, async(req,res) => {
    try{
        const {PlatformLinks, Platform} = req.body
        
        const userId = req.userId;
        console.log("User ID:", userId);
        
        const socialLinkIdId = req.cookies["socialLinkIdId"];
        console.log("Social Link ID from Cookie:", socialLinkIdId);

        if (!socialLinkIdId) {
            res.status(400).json({ message: "Social Link ID is missing in cookies" });
            return;
        }
        
        const UpdateSocialLink = await client.socialLink.update({
            where: {
              id: socialLinkIdId 
            },
            data: {
              url: PlatformLinks,
              platform: Platform,
              user: { connect: { id: userId } },
            }
        });
        if(UpdateSocialLink){
            console.log(`${PlatformLinks} has been updated!`);
            res.status(201).json({message:`${PlatformLinks} links has been updated!`});
            return;
        }else{
            console.error(`Error in ${PlatformLinks}`);
            res.status(400).json({message : `error in ${PlatformLinks}` });
            return;
        };    
    }catch (error: any) {
        console.error("update-user-section error:", error?.message || error);
        res.status(400).json({ error: error?.message || "Something went wrong" });
        return;
    }
});