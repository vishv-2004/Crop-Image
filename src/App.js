import "./App.css";
import { useState, useCallback, useEffect } from "react";
import Cropper from "react-easy-crop";
import { FiEdit } from "react-icons/fi";
import { toast } from "react-hot-toast";

function App() {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [CropShape, setCropShape] = useState("rect");
  const [File, setFile] = useState("");
  const [CropimageData, setCropimageData] = useState(null);
  const [DownloadState, setDownloadState] = useState(false);
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    console.log(croppedArea, croppedAreaPixels);
    setCropimageData({ ...croppedArea });
    setDownloadState(false);
  }, []);

  function reset(){
    setDownloadState(false);
    setFile("");
    setCropimageData(null);
    setCrop({x:0,y:0})
    setZoom(1);

  }
  useEffect(() => {
    console.log("This is main function", CropimageData);
  }, [CropimageData]);

  const onFileChange = (event) => {
    setDownloadState(false);
    const selectedFile = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onload = (e) => {
      setFile(reader.result);
    };
  };

  const saveImage = () => {
    if (DownloadState) {
      toast.success("your image is alredy downloaded");
      return;
    }
    if (!CropimageData) {
      toast.error("Please Edit the image");
      return;
    }

    const img = new Image();
    img.src = File;
    console.log("This is image data", img);
    const cropData = {
      x: (CropimageData.x * img.width) / 100,
      y: (CropimageData.y * img.height) / 100,
      width: (CropimageData.width * img.width) / 100,
      height: (CropimageData.height * img.height) / 100,
    };

    const canvas = document.createElement("canvas");
    canvas.width = cropData.width;
    canvas.height = cropData.height;

    const ctx = canvas.getContext("2d");
    if (CropShape === "round") {
      ctx.beginPath();
      ctx.ellipse(
        cropData.width / 2,
        cropData.height / 2,
        cropData.width / 2,
        cropData.height / 2,
        Math.PI / 4,
        0,
        2 * Math.PI
      );
      ctx.closePath();
      ctx.clip();
    }
    ctx.drawImage(
      img,
      cropData.x,
      cropData.y,
      cropData.width,
      cropData.height,
      0,
      0,
      cropData.width,
      cropData.height
    );

    try {
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = "cropped_image.png";
        link.click();

        URL.revokeObjectURL(url);
      }, "image/png");
      setDownloadState(true);
    } catch (error) {
      toast.error("Image not download ,Please try again later");
      console.log("error When image download.....", error);
    }
  };

  return (
    <div>
      <div className="sm:text-3xl text-xl font-semibold text-center mt-10 flex items-center justify-center cursor-pointer gap-2">
        Edit The Image <FiEdit />
      </div>
      {!File && (
        <label>
          <input
            type="file"
            accept="image/*"
            onChange={onFileChange}
            className="hidden"
          />
          <div className="flex justify-center sm:w-[60%] w-[90%] mx-auto my-10 h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
            <span className="flex items-center space-x-2 cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <span className="font-medium text-gray-600">
                Drop files to Attach, or
                <span className="text-blue-600 underline">browse</span>
              </span>
            </span>
          </div>
        </label>
      )}
      {File && (
        <div className="flex gap-4 items-center mb-5 mt-4 w-11/12 mx-auto sm:flex-row flex-col">
          Select The Crop Shape :
          <button
            onClick={() => {
              setCropShape("rect");
              setDownloadState(false);
            }}
            className={`${
              CropShape === "rect" ? "bg-[#2827CC] text-white" : "bg-[rgba(0,0,0,0.2)]"
            }  rounded-lg px-7 py-1`}
          >
            {" "}
            Rectangle{" "}
          </button>
          <button
            onClick={() => {
              setCropShape("round");
              setDownloadState(false);
            }}
            className={`${
              CropShape === "round" ? "bg-[#2827CC] text-white" : "bg-[rgba(0,0,0,0.2)]"
            }  rounded-lg px-7 py-1`}
          >
            Round
          </button>
          <button
            className="bg-[#3DBE29] text-white rounded-lg px-7 py-1"
            onClick={saveImage}
          >
            {" "}
            Save{" "}
          </button>
          <button onClick={reset}>
            Reset
          </button>
        </div>
      )}
      {File && (
        <div className="relative">
          <div className="h-[80vh]">
            <Cropper
              style={{ top: 25 }}
              image={File}
              crop={crop}
              zoom={zoom}
              aspect={4 / 3}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
              cropShape={CropShape}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
// This is code with cloudinary but it doesn't work properly cuz cordinate of the cloudinary and react-crop-image are diff
// const cloud_Name = "dttznokg7";
// const cloud_api_key = "597354586883639";
// const api_sec = "kIZi-8pOLRwcS6HfLJE66t6z7ec";
// const folderName = "Vishv_2004";
// const saveImage = async()=>{

//   if(!CropimageData)
//   {
//     toast.error("Please Edit the image");
//     return
//   }
//   const toastId=  toast.loading("Loading...");
//   const formData = new FormData();
//   formData.append("file",SelectedFile);
//   // formData.append('Upload preset',"ml_default");
//   formData.append('upload_preset',"stebm6jb");
//   try {
//     const data = await axios.post(`https://api.cloudinary.com/v1_1/${cloud_Name}/image/upload`,formData);

//     console.log("Check it out",data)

//     const croppedUrl = `https://res.cloudinary.com/${cloud_Name}/image/upload/c_crop,x_${Math.round(CropimageData.x)},y_${Math.round(CropimageData.y) },w_${Math.round(((CropimageData.width/100)*800)) },h_${Math.round(CropimageData.height)}/${data.data.public_id}.${data.data.format}`;

//     console.log("This is final url of the image",croppedUrl);

//   } catch (error) {
//     console.log("Error",error);
//     toast.error("Image not upload");
//   }

//   toast.dismiss(toastId);
// }
