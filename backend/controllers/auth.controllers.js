import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const signup = async (req,res)=> {
    try {
        const {fullName, username, password, confirmPassword, gender} = req.body;

        if(password !== confirmPassword){
           return res.status(400).json({error: "password don't match"})
        }

        const user= await User.findOne({username});

        if(user) {
           return  res.status(400).json({error: "user already exists"})
        }

        // HASH PWD HERE 
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);
        // Profile random boy/girl

        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

        const newUser = new User ({
            fullName,
            username,
            password:hashedPassword,
            gender,
            profilePic: gender === "male" ? boyProfilePic:girlProfilePic
        });
        if(newUser){
            //Generate JWT token
            generateTokenAndSetCookie(newUser._id, res);
            await newUser.save();

        res.status(201).json({
            _id:newUser._id,
            fullName:newUser.fullName,
            username:newUser.username,
            profilePic:newUser.profilePic,
        })
        }
        else{
            res.status(400).json({error:"user data invalid"})
        }
    } catch (error) {
        console.log("error in signup controller");
        res.status(500).json({error: "Internal server error"});
    }
}


export const login = async (req,res)=>{
    try {
        const {username, password} = req.body;
        const user= await User.findOne({username});
        const isPasswordCorrect= await bcryptjs.compare(password,user?.password || "");
        if(!user || !isPasswordCorrect) {
            res.status(400).json({error: "Invalid crdentials"})
        }
        generateTokenAndSetCookie(user._id,res);
        res.status(200).json({
            _id:user._id,
            fullName:user.fullName,
            username:user.username,
            profilePic:user.profilePic
        })

    } catch (error) {
        console.log("error in login controller");
        res.status(500).json({error: "Internal server error"});
    }
}

export const logout = async (req,res)=>{
    try {
        res.cookie("jwt","",{maxAge:0});
        res.status(200).json({messagae:"Logged out successfuly"})
    } catch (error) {
        console.log("error in logout controller");
        res.status(500).json({error: "Internal server error"});
    }
}