import ProductImageUpload from "@/components/admin-view/image-upload";
import AdminProductTile from "@/components/admin-view/product-tile";
import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { addProductFormElements } from "@/config";
import { useSnackbar } from "@/context/SnackbarContext";
import {
  addNewProduct,
  deleteProduct,
  editProduct,
  fetchAllProducts,
} from "@/store/admin/products-slice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const initialFormData = {
  image: null,
  title: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  salePrice: "",
  totalStock: "",
};

const AdminProducts = () => {
  const [openCreateProductsDialog, setOpenCreateProductsDialog] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState([]);
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);

  const dispatch = useDispatch();
  const { showSnackbar } = useSnackbar();
  const { productList } = useSelector((state) => state.adminProducts);

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  function isFormValid() {
    return (
      formData.title &&
      formData.description &&
      formData.category &&
      formData.brand &&
      !isNaN(parseFloat(formData.price)) &&
      !isNaN(parseFloat(formData.salePrice)) &&
      !isNaN(parseInt(formData.totalStock)) &&
      (uploadedImageUrl.length > 0 || currentEditedId !== null)
    );
  }

  function handleDelete(productId) {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    dispatch(deleteProduct(productId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts());
        showSnackbar({
          message: "Product deleted successfully!",
          severity: "success",
        });
      }
    });
  }

  function onSubmit(event) {
    event.preventDefault();

    const payload = {
      ...formData,
      image: uploadedImageUrl[0], // <-- use first image from Cloudinary
    };

    if (currentEditedId !== null) {
      dispatch(editProduct({ id: currentEditedId, formData: payload })).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllProducts());
          setFormData(initialFormData);
          setOpenCreateProductsDialog(false);
          setCurrentEditedId(null);
          setUploadedImageUrl([]);
          setImageFile(null);
          showSnackbar({
            message: "Product updated successfully!",
            severity: "success",
          });
        }
      });
    } else {
      dispatch(addNewProduct(payload))
        .then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllProducts());
            setOpenCreateProductsDialog(false);
            setImageFile(null);
            setUploadedImageUrl([]);
            setFormData(initialFormData);
            showSnackbar({
              message: "Product added successfully!",
              severity: "success",
            });
          }
        })
        .catch((error) => {
          console.log(error);
          showSnackbar({
            message: "Error adding a product",
            severity: "error",
          });
        });
    }
  }

  return (
    <>
      <div className="mb-5 flex justify-end">
        <Button
          onClick={() => {
            setOpenCreateProductsDialog(true);
            setFormData(initialFormData);
            setUploadedImageUrl([]);
            setImageFile(null);
          }}
          className="bg-black text-white px-4 py-2 rounded-[5px] hover:bg-gray-800"
        >
          Add New Product
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {!productList ? (
          <p>Loading products...</p>
        ) : productList.length === 0 ? (
          <p>No products found.</p>
        ) : (
          productList.map((productItem) => (
            <AdminProductTile
              key={productItem._id}
              setFormData={(data) => {
                setFormData(data);
                setUploadedImageUrl([data.image]); // wrap in array for consistency
                setOpenCreateProductsDialog(true);
                setCurrentEditedId(productItem._id);
              }}
              setOpenCreateProductsDialog={setOpenCreateProductsDialog}
              setCurrentEditedId={setCurrentEditedId}
              product={productItem}
              handleDelete={handleDelete}
            />
          ))
        )}
      </div>

      <Sheet
        open={openCreateProductsDialog}
        onOpenChange={() => {
          setOpenCreateProductsDialog(false);
          setCurrentEditedId(null);
          setFormData(initialFormData);
          setUploadedImageUrl([]);
          setImageFile(null);
        }}
      >
        <SheetContent side="right" className="overflow-auto bg-white">
          <SheetHeader>
            <SheetTitle>
              {currentEditedId !== null ? "Edit Product" : "Add New Product"}
            </SheetTitle>
          </SheetHeader>

          <ProductImageUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            setImageLoadingState={setImageLoadingState}
            imageLoadingState={imageLoadingState}
            isEditMode={currentEditedId !== null}
          />

          <div className="py-6">
            <CommonForm
              onSubmit={onSubmit}
              formData={formData}
              setFormData={setFormData}
              buttonText={currentEditedId !== null ? "Update" : "Add"}
              formControls={addProductFormElements}
              isBtnDisabled={!isFormValid()}
            />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default AdminProducts;
