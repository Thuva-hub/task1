const express = require('express');
const bcrypt = require('bcryptjs')
const {  decodeToken,
    generateToken,
    hashPassword,
    validateToken,
    validPassword,} = require('../helper')
const securitySchema = require('../models/security')

const router = express.Router();

router.get('/',(req,res)=>{
    res.json("jhjkdjfkd")
})

router.post("/register", async (req, res) => {
    try {
      console.log(req.body)
      const secData = await securitySchema.findOne( {email:req.body.email} );
   
      if (secData) {
        return res.status(400).json("email already exists");
      }
      const hashPwd = await hashPassword(req.body.password);
      console.log(hashPassword)
      const postData = await new securitySchema({
        firstName:req.body.firstName,
        nic:req.body.nic,
        lastName:req.body.lastName,
        email:req.body.email,
        jobtype:req.body.jobtype,
        mobilenumber:req.body.mobilenumber,
        Address:req.body.Address,
        Staffid:req.body.Staffid,
        password: hashPwd,
      });
      const postUser = await postData.save();
      if (postUser) {
        return res.status(200).json("Registered successfully");
      }
    } catch (err) {
        // console.log(err)
        if(err.code===0){
            return res.status(400).json([err,"duplicate key found"]);
      }if(err.code===11000){
        return res.status(400).json(err);

      }
      return res.status(400).json(err);
    }
  });


  router.post("/login", async (req, res) => {
    try {
      const validData = await securitySchema.findOne({ email: req.body.email }).select('+password');
      if (!validData) {
        return res.status(400).json("Invalid email");
      }
    //   console.log(validData.password)
      const validPass = await bcrypt.compare(req.body.password, validData.password);

      if (validPass) {
        const userToken = await generateToken(validData);
        res.header(process.env.TOKEN_KEY, userToken).json(userToken);
      } else {
        return res.status(400).json("Invalid password");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  });


  router.get("/detail", validateToken, async (req, res) => {
    try {
      const uid = decodeToken(req.headers.loginToken)?._id;
      const user = await securitySchema.findOne({ _id: uid })
        .select("-password")
        .exec();
    
      res.status(200).json({ user });
    } catch (err) {
      res.status(500).json(err);
    }
  });
    router.get("/one/:email",async(req,res)=>{
      try {
          const security = await securitySchema.findOne({email:req.params.email})
          if(!security){
              return res.status(200).json("no security data available")
      
          }else{
            return res.status(200).json({security})
      
          }
      } catch (error) {
          return res.status(400).json(error)
      }
      })
  module.exports=router;