import { Button } from "@/components/ui/button";
import bannerOne from "../../assets/banner-1.jpg";
import bannerTwo from "../../assets/banner-2.jpg";
import bannerThree from "../../assets/banner-3.jpg";
import {
  Airplay,
  BabyIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloudLightning,
  Heater,
  Images,
  Shirt,
  ShirtIcon,
  ShoppingBasket,
  UmbrellaIcon,
  WashingMachine,
  WatchIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { ProductDetailsDialog } from "@/components/shopping-view/product-details";
import { getFeatureImages } from "@/store/common-slice";
import { useSnackbar } from "@/context/SnackbarContext";
import Footer from "@/components/shopping-view/footer";

function ShoppingHome() {
  const slides = [bannerOne, bannerTwo, bannerThree];

  const [currentSlide, setCurrentSlide] = useState(0);

  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );

  const { user } = useSelector((state) => state.auth);

  const { featureImageList } = useSelector((state) => state.commonFeature);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { showSnackbar } = useSnackbar();

  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters");

    const currentFilter = {
      [section]: [getCurrentItem.id],
    };

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate("/shop/listing");
    // check function createSearchParamsHelper in listing  -> that's where we are going to concatenate with the URL
  }

  function handleGetProductDetails(getCurrentProductId) {
    console.log("getCurrentProductId====>", getCurrentProductId);
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddToCart(getCurrentProductId) {
    console.log(
      "handleAddToCart => getCurrentProductId ====>",
      getCurrentProductId
    );
    // Calling addToCart API
    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        // Calling fetchCartItems API
        dispatch(fetchCartItems(user?.id));

        showSnackbar({
          message: "Product is added to cart",
          severity: "success",
        });
      }
    });
  }

  const categoriesWithIcon = [
    { id: "men", label: "Men", icon: ShirtIcon },
    { id: "women", label: "Women", icon: CloudLightning },
    { id: "kids", label: "Kids", icon: BabyIcon },
    { id: "accessories", label: "Accessories", icon: WatchIcon },
    { id: "footwear", label: "Footwear", icon: UmbrellaIcon },
  ];

  const brandsWithIcon = [
    { id: "nike", label: "Nike", icon: Shirt },
    { id: "adidas", label: "Adidas", icon: WashingMachine },
    { id: "puma", label: "Puma", icon: ShoppingBasket },
    { id: "levi", label: "Levi's", icon: Airplay },
    { id: "zara", label: "Zara", icon: Images },
    { id: "h&m", label: "H&M", icon: Heater },
  ];

  // Runs every time slides changes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 5000);
    // If we navigate to another page, we need to clear the interval
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-low-to-high",
      })
    );
  }, [dispatch]);

  console.log(productList);

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  useEffect(() => {
    dispatch(getFeatureImages());
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative w-full h-[250px] sm:h-[350px] md:h-[450px] lg:h-[600px] overflow-hidden">
        {/* {slides.map((slide, index) => (
                    <img src={slide}
                        key={index}
                        className={` ${index == currentSlide ? 'opacity-100' : 'opacity-0'} absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000`}
                    />
                ))} */}
        {slides.map((slide, index) => (
          <img
            src={slide}
            key={index}
            className={` ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            } absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000`}
          />
        ))}

        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) => (prevSlide - 1 + slides.length) % slides.length
            )
          }
          className="absolute top-1/2 left-2 sm:left-4 transform -translate-y-1/2 bg-grey/80"
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length)
          }
          className="absolute top-1/2 right-2 sm:right-4 transform -translate-y-1/2 bg-grey/80"
        >
          <ChevronRightIcon className="w-5 h-5" />
        </Button>
      </div>

      <section className="py-10 sm:py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">
            Shop By Category
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {categoriesWithIcon.map((categoryItem) => (
              <Card
                onClick={() =>
                  handleNavigateToListingPage(categoryItem, "category")
                }
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardContent className="flex flex-col items-center justify-center p-4 sm:p-6">
                  <categoryItem.icon className="w-8 h-8 sm:w-10 sm:h-10 mb-2 sm:mb-4 text-primary" />
                  <span className="font-semibold text-sm sm:text-base">
                    {categoryItem.label}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 mt-10 sm:mt-12">
            Shop By Brand
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {brandsWithIcon.map((brandItem) => (
              <Card
                onClick={() => handleNavigateToListingPage(brandItem, "brand")}
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardContent className="flex flex-col items-center justify-center p-4 sm:p-6">
                  <brandItem.icon className="w-8 h-8 sm:w-10 sm:h-10 mb-2 sm:mb-4 text-primary" />
                  <span className="font-semibold text-sm sm:text-base">
                    {brandItem.label}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">
            Feature Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productList && productList.length > 0
              ? productList.map((productItem) => (
                  <div
                    key={productItem.id} // Add a unique key
                    className="transition-transform transform hover:scale-105 hover:shadow-lg"
                  >
                    <ShoppingProductTile
                      handleGetProductDetails={handleGetProductDetails}
                      product={productItem}
                      handleAddToCart={handleAddToCart}
                    />
                  </div>
                ))
              : null}
          </div>
        </div>
      </section>

      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />

      <div className="flex flex-col min-h-screen">
        {/* ...existing content */}
        <Footer />
      </div>
    </div>
  );
}

export default ShoppingHome;
