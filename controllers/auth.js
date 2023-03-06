const userSchema = require("../models/user")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")

module.exports.signUp = async(req,res)=>{
try{
  
    if (req.body.auth_type == "email"){
        const user = await userSchema.find({email:req.body.email})
        if(user.length == 0){

                const data = new userSchema({
                    email:req.body.email,
                    role:"user",
    
                    })
                   await data.save()            
    
                   const token = jwt.sign(
                    { id: data._id },
                    process.env.JWT_TOKEN,
                    {
                      expiresIn: "10d",
                    }
                  )
            
           return res.status(200).json({
                success:true,
                message:"signed up successfully",
                token:token
            })
    
        } 
        else{

            return res.status(403).json({
                success:false,
                message:"email already exists"
            })
        }  
    }
    else{
        const user = await userSchema.find({username:req.body.username})
        if(user.length == 0){

            bcrypt.hash(req.body.password, 4, async function(err, hash) {
                const data = new userSchema({
                    email:req.body.email,
                    username:req.body.username,
                    role:"user",
                    password:hash
    
                    })
                   await data.save()            
    
                   const token = jwt.sign(
                    { id: data._id },
                    process.env.JWT_TOKEN,
                    {
                      expiresIn: "10d",
                    }
                  )
            });
            
           return res.status(200).json({
                success:true,
                message:"signed up successfully",
                token:token
            })
    
        } 
        else{

            return res.status(403).json({
                success:false,
                message:"user already exists"
            })
        }  
       
    }
       
    }
    
    
    
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Internal server error "+error,
            data:null
        })
    }   
}


module.exports.login = async(req,res)=>{

try{
    if(req.body.auth_type == "email"){
        const user = await userSchema.find({email:req.body.email})
        if(user.length == 0){
            return res.status(404).json({
                success:false,
                message:"Email doesn't exist",
                
            })
        }
        else{
    
            const token = jwt.sign(
                { id: user[0]._id },
                process.env.JWT_TOKEN,
                {
                  expiresIn: "10d",
                }
              )
            
           return res.status(200).json({
                success:true,
                message:"logged in successfully",
                token:token
            })
           
            
    }
    
    }
    else{

        const user = await userSchema.find({username:req.body.username})
        if(user.length == 0){
            return res.status(404).json({
                success:false,
                message:"Username doesn't exist",
                
            })
        }
        else{
            if(bcrypt.compareSync(req.body.password,user[0].password)){
                const token = jwt.sign(
                    { id: user[0]._id },
                    process.env.JWT_TOKEN,
                    {
                      expiresIn: "10d",
                    }
                  )
                
               return res.status(200).json({
                    success:true,
                    message:"logged in successfully",
                    token:token
                })
            }
            return res.status(401).json({
                success:false,
                message:"Incorrect password"
            })
            
           
            
    }
    
    }
}

catch(error){
    return res.status(500).json({
        success:false,
        message:"Internal server error "+error,
        data:null
    })
}
}

module.exports.logout = async(req,res)=>{
    try{
        res.clearCookie("token");
        return res.status(200).json({
        success: true,
        message: "Logout successful",
        data: null,
        });
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Internal server error "+error,
            data:null
        })
    }
}
