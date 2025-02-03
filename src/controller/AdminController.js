import Admin from "../model/Admin.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// login 

export const adminLogin = async (req, res) => {
  try {
    let checkAdmin = await Admin.findOne({ email: req.body.email });
    if (!checkAdmin) {
      return res.json({
        status: 400,
        message: "user is not found",
        data: [],
      });
    }
    let userPassword = req.body.password;
    let dataPassword = checkAdmin.password;
    let comparePassword = await bcryptjs.compare(userPassword, dataPassword);
    if (comparePassword) {
      let payload = {
        adminrole: checkAdmin.adminrole,
        email: checkAdmin.email,
        id: checkAdmin._id,
      };
     
      const token = await generateToken(payload)
      const refershToken = await genrateRefreshToken(payload)
      return res.json({
        status: 200,
        message: "Login successfully",
        data: checkAdmin,
        token: token,
        refershToken
      });
    } else {
      return res.json({
        status: 400,
        message: "password is not match",
        data: [],
      });
    }
  } catch (error) {
    return res.status(500).json({
      status:500,
      message:"Internal server error",
      data:[]
    })
  }
};
// subAdmin register
export const subAdminRegister = async (req, res) => {
  try {
    const checkSubAdmin = await Admin.findOne({
      $or: [{ email: req.body.email }, { number: req.body.number }],
    });

    if (checkSubAdmin) {
      if (checkSubAdmin.email == req.body.email) {
        return res.json({
          status: 400,
          message: "this email already used",
          data: [],
        });
      } else if (checkSubAdmin.number == req.body.number) {
        return res.json({
          status: 400,
          message: "this number already used",
          data: [],
        });
      }
    }
  
    const adminId = req.admin;
    const findSuperAdmin = await Admin.findOne({
      _id: adminId,
      isVerified: true,
    });
   
    if (!findSuperAdmin) {
      return res.json({
        status: 400,
        message: "super admin is not found",
        data: [],
      });
    }


    if (findSuperAdmin.adminrole == "superadmin") {
      let saltCount = 10;
      let adminPassword = req.body.password;
      let hashPassword = await bcryptjs.hash(adminPassword, saltCount);
      const addSubAdmin = new Admin({
        name: req.body.name,
        email: req.body.email,
        number: req.body.number,
        adminrole: req.body.adminrole,
        password: hashPassword,
      });
      const subAdminRegister = await addSubAdmin.save();
      return res.json({
        status: 201,
        message: "Sub Admin   register successfully",
        data: subAdminRegister,
      });
    }
  } catch (error) {
    return res.status(500).json({
      status:500,
      message:"Internal server error",
      data:[]
    })
  }
};
// get all subAdmin 
export const  getAllSubAdmin = async (req,res)=>{
  try{
    let  adminId  = req.admin
    let CheckSuperAdmin = await Admin.findOne({_id:adminId, isVerified: true}) 
    if(!CheckSuperAdmin){
      return res.json({
        status: 401,
        message: "super admin is not found",
        data:[],
      });
    }
    if(CheckSuperAdmin.adminrole == "superadmin"){
      let findAllSubAdmin =  await Admin.find()
      return res.json({
        status: 200,
        message: " get all subadmin data successfully",
        data: findAllSubAdmin,
      });
    }
  }catch(error){
    return res.status(500).json({
      status:500,
      message:"Internal server error",
      data:[]
    })
  }
}
// get one subAdmin 
export const  getOneSubAdmin = async (req,res)=>{
  try{
    let  adminId  = req.admin
    let CheckSuperAdmin = await Admin.findOne({_id:adminId, isVerified: true}) 
    if(!CheckSuperAdmin){
      return res.json({
        status: 401,
        message: "super admin is not found",
        data:[],
      });
    }
    if(CheckSuperAdmin.adminrole == "superadmin"){
      let findOneSubAdmin =  await Admin.findOne({_id:req.body.id})
      return res.json({
        status: 200,
        message: "get  admin data successfully",
        data: findOneSubAdmin,
      });
    }
  }catch(error){
    return res.status(500).json({
      status:500,
      message:"Internal server error",
      data:[]
    })
  }
}
// update one subAdmin 
export const  updateOneSubAdmin = async (req,res)=>{
  try{
    let  adminId  = req.admin
    let CheckSuperAdmin = await Admin.findOne({_id:adminId, isVerified: true}) 
    if(!CheckSuperAdmin){
      return res.json({
        status: 401,
        message: "super admin is not found",
        data:[],
      });
    }
    if(CheckSuperAdmin.adminrole == "superadmin"){
      let updateOneSubAdmin =  await Admin.updateOne(
        {_id:req.body.id},
        {$set:{number:req.body.number}},
        {new:true}
      )
      return res.json({
        status: 200,
        message: " update subadmin  successfully ",
        data: updateOneSubAdmin,
      });
    }
  }catch(error){
    return res.status(500).json({
      status:500,
      message:"Internal server error",
      data:[]
    })
  }
}

// delete one subAdmin 
export const  deleteOneSubAdmin = async (req,res)=>{
  try{
    let  adminId  = req.admin
    let CheckSuperAdmin = await Admin.findOne({_id:adminId, isVerified: true}) 
    if(!CheckSuperAdmin){
      return res.json({
        status: 401,
        message: "super admin is not found",
        data:[],
      });
    }
    if(CheckSuperAdmin.adminrole == "superadmin"){
      let deleteOneSubAdmin =  await Admin.deleteOne({_id:req.body.id})
      return res.json({
        status: 200,
        message: " delete subadmin data successfully ",
        data: [],
      });
    }
  }catch(error){
    return res.status(500).json({
      status:500,
      message:"Internal server error",
      data:[]
    })
  }
}

//generatetoken function

export const generateToken = (payload) => {
  try{
    const token = jwt.sign(payload, process.env.SCRECT_KEY, {
      expiresIn: "8h",
    })
    return token;
  }catch(error){
    return res.status(500).json({
      status:500,
      message:"Internal server error",
      data:[]
    })
  }
}

// generateRefreshToken
export const genrateRefreshToken = (payload) => {
  try{
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_KEY, {
      expiresIn: "30d",
    })
    return refreshToken;
  }catch(error){
    return res.status(500).json({
      status:500,
      message:"Internal server error",
      data:[]
    })
  }
}
//refreshToken 
export const refreshToken = async (req,res) => {
  try{
    const {refreshToken} = req.body;
    const {adminrole,email,id} = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY);

    const token = await generateToken({adminrole,email,id});
    
    return res.status(200).json({
      status : 200,
      message : "Token refresh success",
      token : token 
    })
  }catch(error){
    return res.status(500).json({
      status : 500,
      message : "refreshToken expiry",
      data : []
    })
  }
}
