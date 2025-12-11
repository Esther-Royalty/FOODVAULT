import crypto from "crypto"

const webhook =async(req,res)=>{
     const hash = crypto.createHmac('sha512', secret).update(JSON.stringify(req.body)).digest('hex');
     if (hash !== req.headers['x-paystack-signature']){
        return res.status(200).send("Invalid Signature")
     }

     const {event}=req.body;

     

}