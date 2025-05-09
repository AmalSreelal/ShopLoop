import { useEffect, useState } from "react";
import CommonForm from "../common/form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { addressFormControls } from "@/config";
import { useDispatch, useSelector } from "react-redux";
import { addNewAddress, deleteAddress, editAddress, fetchAllAddresses } from "@/store/shop/address-slice";
import AddressCard from "./address-card";
import { useSnackbar } from "@/context/SnackbarContext";


function Address({ setCurrentSelectedAddress, selectedId }) {

    const initialAddressFormData = {
        address: "",
        city: "",
        phone: "",
        pincode: "",
        notes: "",
    }

    const [formData, setFormData] = useState(initialAddressFormData)

    const dispatch = useDispatch();

    const { user } = useSelector((state) => state.auth);

    const [currentEditedId, setCurrentEditedId] = useState(null);

    const { addressList } = useSelector((state) => state.shopAddress);

    const { showSnackbar } = useSnackbar();

    function handleManageAddress(event) {
        event.preventDefault();

        if (addressList.length >= 3 && currentEditedId === null) {
            setFormData(initialAddressFormData);

            showSnackbar({
                message : "You can add max 3 addresses only",
                severity : "error"                
              })
            return;
        }
        console.log("** formData=====> handleManageAddress ", formData);

        // const { userId, addressId } = req.params;
        // const formData = req.body;

        currentEditedId !== null ?

            dispatch(editAddress({ userId: user?.id, addressId: currentEditedId, formData })).then((data) => {

                if (data?.payload?.success) {
                    dispatch(fetchAllAddresses(user?.id));
                    setFormData(initialAddressFormData);
                    setCurrentEditedId(null);
                    showSnackbar({
                        message : "Address Updated Successfully",
                        severity : "success"
                    })

                }

            }) :

            dispatch(addNewAddress({
                ...formData,
                userId: user?.id,
            })).then((data) => {
                console.log(data);
                if (data?.payload?.success) {
                    dispatch(fetchAllAddresses(user?.id));
                    setFormData(initialAddressFormData);
                    showSnackbar({
                        message : "Address Added Successfully",
                        severity : "success"
                    })
                }

            })
    }

    // check if all fields are filled or not
    function isFoundValid() {
        return Object.keys(formData)
            .map((key) => formData[key] !== "")
            .every((item) => item);
    }

    console.log("** addressList **", addressList);

    function handleEditAddress(getCurrentAddress) {
        // print it and see what data we need to fetch
        console.log("Edit Address", getCurrentAddress);
        console.log("**formData", formData);
        setFormData({
            ...formData,
            address: getCurrentAddress?.address,
            city: getCurrentAddress?.city,
            phone: getCurrentAddress?.phone,
            pincode: getCurrentAddress?.pincode,
            landmark: getCurrentAddress?.landmark,
        });
        setCurrentEditedId(getCurrentAddress._id);
    }

    function handleDeleteAddress(getCurrentAddress) {
        // print it and see what data we need to fetch 
        console.log("**Delete Address**", getCurrentAddress);

        //const { userId, addressId : _id} = getCurrentAddress;

        // Call Delete API & then fetch all addresses, empty the form data
        dispatch(deleteAddress({ userId: user?.id, addressId: getCurrentAddress._id }))
            .then((data) => {
                console.log(data);
                if (data?.payload?.success) {
                    dispatch(fetchAllAddresses(user?.id));
                    setFormData(initialAddressFormData);

                    showSnackbar({
                        message : "Address deleted Successfully",
                        severity : "success"
                    })
                    
                }
            })
    }


    useEffect(() => {
        console.log("useEffect");
        dispatch(fetchAllAddresses(user?.id));
    }, [dispatch]);

    return (
        <Card>
            {/* <div>
                Address List
            </div> */}

            <div className="mb-5 p-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">

                {
                    addressList && addressList.length > 0 ?
                        addressList?.map((singleAddress) =>
                            <AddressCard selectedId={selectedId} handleDeleteAddress={handleDeleteAddress}
                                handleEditAddress={handleEditAddress}
                                setCurrentSelectedAddress = {setCurrentSelectedAddress}

                                addressInfo={singleAddress} />) : null
                }

            </div>

            <CardHeader>
                <CardTitle>
                    {
                        currentEditedId ? "Edit Address" : "Add Address"
                    }
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
                <CommonForm formControls={addressFormControls}
                    formData={formData}
                    setFormData={setFormData}
                    buttonText={currentEditedId ? "Update Address" : "Add Address"}
                    onSubmit={handleManageAddress}
                    isBtnDisabled={!isFoundValid()}
                />
            </CardContent>

        </Card>
    );
}

export default Address;