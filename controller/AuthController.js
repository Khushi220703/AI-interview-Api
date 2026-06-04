import User from "../schema/user";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";


const secretKey = process.env.JWT_SECRET;
const expiresIn = process.env.JWT_EXPIRETIME || "3d";

const generateToken = (email) => {

    const token = jwt.sign(email, secretKey, {
        expiresIn: expiresIn
    })

    return token;

}
export const singUp = async (req, res) => {

    const { name, email, password } = req.body;
    try {

        if (!name || !email || !password) {

            res.status(404).send("Please enter email, name or password!");
        }

        const isUserExists = await User.findOne({ email });

        if (isUserExists) {

            res.status(404).send("Account already exists!");
        }

        const hashed = bcrypt.hash(password, 12);
        const user = User.insertOne({ email, name, password: hashed });

        const token = generateToken(email);

        res.status(200).json({ message: "Account created successfully!", token });



    } catch (error) {

        console.log("There is an error at server side auth singuo:", error);
        res.status(500).json("Internal server error");
    }

};


export const login = async (req, res) => {

    const { email, password } = req.body
    try {

        if (!email || !password) {

            res.status(404).json("Please enter email or password!");
        }

        const user = await User.findOne({ email });

        if (!user) {

            res.status(404).json("Please enter valid email!");
        }

        const isMatched = await bcrypt.compare(password, user.password);

        if (!isMatched) res.status(404).json("Invalid password!");

        res.status(200).send("Login succesfull!");

    } catch (error) {

        console.log("There is an error at server side auth login:", error);
        res.status(500).json("Internal server error");
    }
};

export const forgotPassword = async (req, res) => {
    const { email, newPassword } = req.body;

    try {

        if (!email || !newPassword) res.status(404).json("Please enter email and new password!");
        const user = await User.findOne({ email });
        const hashed = bcrypt.hash(newPassword, 12);
        await User.updateOne({ email }, { password: hashed });

        if (!user) res.status(404).json("Please enter valid email!");
    } catch (error) {
        console.log("There is an error at server side auth forgot password:", error);
        res.status(500).json("Internal server error");
    }
}

export const deleteUser = async (req, res) => {
    const { email } = req.body; 
    try {
        if (!email) res.status(404).json("Please enter email!");
        const user = await User.findOne({ email });
        if (!user) res.status(404).json("Please enter valid email!");
        await User.deleteOne({ email });
        res.status(200).json("User deleted successfully!");
    } catch (error) {
        console.log("There is an error at server side auth delete user:", error);
        res.status(500).json("Internal server error");
    }
}
export const onBoarding = async (req, res) => {
    const { email, skills, experience } = req.body;
    try {
        if (!email || !skills || !experience) res.status(404).json("Please enter email, skills and experience!");
        const user = await User.findOne({ email });
        if (!user) res.status(404).json("Please enter valid email!");
        await User.updateOne({ email }, { skills, experience });
        res.status(200).json("Onboarding completed successfully!");
    } catch (error) {
        console.log("There is an error at server side auth onboarding:", error);
        res.status(500).json("Internal server error");
    }
}