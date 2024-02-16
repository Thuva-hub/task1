const express = require('express');
const router = express.Router();
const staffSchema = require('../models/task')

router.post("/create", async (req, res) => {
    try {
      console.log(req.body)
      const secData = await staffSchema.findOne( {StaffID:req.body.StaffID} );
   
      if (secData) {
        return res.status(400).json("StaffID already exists");
      }

      const postData = await new staffSchema({
        StaffID:req.body.StaffID,
        firstName:req.body.firstName,
        nic:req.body.nic,
        lastName:req.body.lastName,
        description:req.body.description,
        vehicleType:req.body.vehicleType,
        licenceNo:req.body.licenceNo,
        checkIn:req.body.checkIn,
        checkout:req.body.checkout,
          });
      const postUser = await postData.save();
      if (postUser) {
        return res.status(200).json({success:true,
          message:"visiter added successfully"});
      }
    } catch (err) {
        // console.log(err)
        if(err.code===0){
            return res.status(400).json([err,"duplicate key found"]);
      }if(err.code===11000){
        return res.status(400).json(err);

      }
      return res.status(400).json({success:false,
        mesage:err});
    }
  });

router.get("/allStaff",async(req,res)=>{
try {
    const Staff = await staffSchema.find();
    if(!Staff){
        return res.status(200).json("no Staff data available")

    }else{
      return res.status(200).json({Staff})

    }
} catch (error) {
    return res.status(200).json({error})
}
})
router.get("/one/:StaffID",async(req,res)=>{
  try {
      const Staff = await staffSchema.findOne({StaffID:req.params.StaffID});
      if(!Staff){
          return res.status(200).json("no Staff data available")
  
      }else{
        return res.status(200).json({Staff})
  
      }
  } catch (error) {
      return res.status(400).json(error)
  }
  })
router.put('/update/:id', async (req, res) => {
    try {
  
        const Onevistor = await staffSchema.findById(req.params.id)
        if(!Onevistor) {
            return res.status(200).json("Staff not found")
        }
        const   StaffID =req.params.StaffID
        const updateEmp = await staffSchema.findByIdAndUpdate(req.params.id,req.body,{ new: true });
        res.status(200).json({ message:"Staff updated successfully", updateEmp});
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: 'An error occurred while updating the Staff.' });
    }

});


router.delete('/delete/:id',async(req,res)=>{
try {
    const deleteStaff= await staffSchema.findById(req.params.id);
    if(!deleteStaff) {
        return res.status(200).json("Staff not found")
    }

    const dvis= await staffSchema.findByIdAndDelete(req.params.id)
    res.status(200).json({ message:"Staff delete successfully", dvis});

} catch (error) {
    res.status(400).json({ error: 'staff not deleted ' });

}
})
module.exports=router;
