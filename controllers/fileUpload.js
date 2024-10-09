const File=require("../models/File");

const cloudinary=require("cloudinary").v2;

//local file upload->handler function create

exports.localFileUpload=async (req,res)=>{
    try{
        //fetch file
        const file=req.files.file;
        console.log(" ",file);

        let path=__dirname + "/files/" + Date.now() + `.${file.name.split('.')[1]}`; //foe extension ..used split

        file.mv(path,(err) =>{
            console.log(err);
        });

        res.json({
            success:true,
            message:'local file uploaded successfully',
        });



    }
    catch(error){
        console.log(error);

    }
}
function isFileTypeSupported(type,supportedTypes){
    return supportedTypes.includes(type);

 }
async function uploadFileToCloudinary(file,folder){
    const options={folder};
   return await cloudinary.uploader.upload(file.tempFilePath,options);

 }

//image upload handler
exports.imageUpload=async (req,res)=>{
    try{
        //data fetch
        const{name,tags,email}=req.body;
        console.log(name,tags,email);

        const file=req.files.imageFile;
        console.log(file);

        //validation
        const supportedTypes=["jpg","jpeg","png"];
        const fileType=file.name.split('.')[1].toLowerCase();

        if(!isFileTypeSupported(fileType,supportedTypes)){
            return res.status(400).json({
                success:false,
                message:"file format not supported",
            })
        }
        //if file formated supported then upload in cloudinary
        const response=await uploadFileToCloudinary(file,"tushar");
        console.log(response);
        //save entry in db
        const fileData=await File.create({
            name,
            tags,
            email,
            imgaeUrl:response.secure_url,

        });
        res.json({
            success:true,
            imgaeUrl:response.secure_url,
            message:"image successfully uploaded",
        })


    }
    catch(error){
        console.log(error);
        res.status(400).json({
            success:false,
            message:"something went wrong"
        })

    }
}

