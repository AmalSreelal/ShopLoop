import { useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { UploadCloudIcon } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import axios from "axios";
import { isValidFileType, isValidFileSize } from "@/utils/file-validation";
import { useSnackbar } from "@/context/SnackbarContext";

function ProductImageUpload({
  imageFile = [], // Default fallback to avoid null errors
  setImageFile,
  imageLoadingState,
  uploadedImageUrl,
  setUploadedImageUrl,
  setImageLoadingState,
  isEditMode,
  isCustomStyling = false,
  imagePreview = [], // Default fallback to avoid null errors
  setImagePreview,
}) {
  const inputRef = useRef(null);
  const [error, setError] = useState(false);
  const { showSnackbar } = useSnackbar();

  function handleImageFileChange(event) {
    const selectedFiles = Array.from(event.target.files);
    console.log("** handleImageFileChange selectedFiles **", selectedFiles);

    const maxFileSize = 5 * 1024 * 1024; // 5MB
    const allowedImageUploadFileTypes = ["image/jpeg", "image/jpg", "image/png"];

    const validFiles = selectedFiles.filter((file) => {
      if (!isValidFileType(file, allowedImageUploadFileTypes)) {
        console.log("** INVALID FILE TYPE **");
        showSnackbar({
          message: "Invalid file type, only jpg, png & jpeg are allowed.",
          severity: "error",
        });
        return false;
      }
      if (!isValidFileSize(file, maxFileSize)) {
        showSnackbar({
          message: "File exceeds 5 MB limit.",
          severity: "error",
        });
        return false;
      }
      return true;
    });

    if (validFiles && validFiles.length > 0) {
      const previews = validFiles.map((file) => URL.createObjectURL(file));
      setImageFile(validFiles);
      setImagePreview(previews);
      setError(false);
    } else {
      setImageFile([]);
      setImagePreview([]);
      setError(true);
    }

    // Reset input so same file can be selected again
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  console.log("** handleImageFileChange imageFile **", imageFile);
  console.log("** handleImageFileChange imagePreview **", imagePreview);

  function handleDragOver(event) {
    event.preventDefault(); // recommended
  }

  function handleRemoveImage(index) {
    const updatedFiles = (imageFile || []).filter((_, i) => i !== index);
    const updatedPreviews = (imagePreview || []).filter((_, i) => i !== index);
    setImageFile(updatedFiles);
    setImagePreview(updatedPreviews);

    // Reset input if all files removed
    if (updatedFiles.length === 0 && inputRef.current) {
      inputRef.current.value = "";
    }
  }

  function handleDrop(event) {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);

    const maxFileSize = 5 * 1024 * 1024; // 5MB
    const allowedImageUploadFileTypes = ["image/jpeg", "image/jpg", "image/png"];

    const validFiles = droppedFiles.filter((file) => {
      if (!isValidFileType(file, allowedImageUploadFileTypes)) {
        showSnackbar({
          message: "Invalid file type, only jpg, png & jpeg are allowed.",
          severity: "error",
        });
        return false;
      }
      if (!isValidFileSize(file, maxFileSize)) {
        showSnackbar({
          message: "File exceeds 5 MB limit.",
          severity: "error",
        });
        return false;
      }
      return true;
    });

    if (validFiles && validFiles.length > 0) {
      const previews = validFiles.map((file) => URL.createObjectURL(file));
      setImageFile(validFiles);
      setImagePreview(previews);
      setError(false);
    }

    console.log("** Inside handleDrop **", droppedFiles);
  }

  async function uploadImageToCloudinary() {
    if (!imageFile || imageFile.length === 0) {
      return;
    }
    setImageLoadingState(true);

    try {
      const data = new FormData();
      imageFile.forEach((file) => data.append("images", file));

      const response = await axios.post(
        "http://localhost:8080/api/admin/products/upload-images",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      console.log("response.data", response.data);
      setUploadedImageUrl(response.data.files);
      setError(false);
      showSnackbar({
        message: "Image(s) loaded successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      setError(true);
      showSnackbar({
        message: "Error uploading image",
        severity: "error",
      });
    } finally {
      setImageLoadingState(false);
    }
  }

  useEffect(() => {
    if (imageFile?.length > 0 && !isEditMode) {
      console.log("** Inside useEffect **", imageFile);
      uploadImageToCloudinary();
    }
  }, [imageFile]); // it will re-run whenever imageFile changes.

 
  useEffect(() => {
    // if(!error && currentPreviewImage && currentImage){
    //   setImageFile(currentImage);
    //   setImagePreview(currentPreviewImage);
    // }
  }, []); // currently doing nothing, placeholder

  return (
    <div className={`w-full mt-4 ${isCustomStyling ? "" : "max-w-md mx-auto"}`}>
      <Label className="text-lg font-semibold mb-2 block">Upload Image</Label>

      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`${isEditMode ? "opacity-60 cursor-not-allowed" : ""} border-2 border-dashed rounded-lg p-4 border-gray-300 transition-colors hover:border-gray-400`}
      >
        <div>
          <Input
            id="image-upload"
            type="file"
            multiple
            className="hidden"
            ref={inputRef}
            onChange={handleImageFileChange}
            disabled={isEditMode || imageLoadingState}
            accept="image/jpeg, image/png, image/jpg"
          />
        </div>

        {imageFile?.length === 0 ? (
          <Label
            htmlFor="image-upload"
            className={`${isEditMode ? "cursor-not-allowed" : "cursor-pointer"} flex flex-col items-center justify-center h-32`}
          >
            <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
            <span>Drag & drop to upload an image</span>
          </Label>
        ) : imageLoadingState ? (
          <Skeleton className="h-10 bg-gray-100" />
        ) : (
          <div className="flex flex-col gap-4 justify-center items-center">
            <div className="flex flex-wrap gap-6 justify-center">
              {(imageFile || []).map((file, index) => (
                <div key={index} className="flex flex-col items-center justify-center">
                  <img
                    src={imagePreview?.[index] || ""}
                    alt={`Preview ${index}`}
                    className="w-64 h-64 object-cover rounded shadow-md"
                  />
                  <p className="text-md mt-2">{file.name}</p>
                  <button
                    className="mt-2 text-red-500 hover:text-red-700 text-sm"
                    onClick={() => handleRemoveImage(index)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductImageUpload;