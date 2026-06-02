import User from "../schema/user";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";


const secretKey = process.env.JWT_SECRET;
const expiresIn = process.env.JWT_EXPIRETIME || "3d";

const generateToken =  (email) => {

    const token  =  jwt.sign(email,secretKey,{
            expiresIn: expiresIn
        })

        return token;
    
}
export const singUp = async (req,res)=>{

    const {name,email,password} = req.body;
    try {

        if(!name || !email || !password){

            res.status(404).send("Please enter email, name or password!");
        }

        const isUserExists = await User.findOne({email});

        if(isUserExists){

            res.status(404).send("Account already exists!");
        }

        const hashed = bcrypt.hash(password,12);
        const user = User.insertOne({email,name,password:hashed});

        const token = generateToken(email);

        res.status(200).json({message:"Account created successfully!", token});


        
    } catch (error) {
        
        console.log("There is an error at server side auth singuo:", error);
        res.status(500).json("Internal server error");
    }

};


export const login = async (req,res) =>{

    const {email,password} = req.body
    try {
        
      if(!email || !password){

          res.status(404).json("Please enter email or password!");
      }

      const user = await User.findOne({email});

      if(!user){

        res.status(404).json("Please enter valid email!");
      }

      const isMatched = await bcrypt.compare(password,user.password);

      if(!isMatched) res.status(404).json("Invalid password!");

      res.status(200).send("Login succesfull!");

    } catch (error) {

        console.log("There is an error at server side auth login:", error);
        res.status(500).json("Internal server error");
    }
};