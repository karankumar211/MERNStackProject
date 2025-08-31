import React, { Fragment, useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { ProductDetailsContext } from "./index";
import { LayoutContext } from "../layout";
import Submenu from "./Submenu";
import ProductDetailsSectionTwo from "./ProductDetailsSectionTwo";

import { getSingleProduct } from "./FetchApi";
import { cartListProduct } from "../partials/FetchApi";

import { isWishReq, unWishReq, isWish } from "../home/Mixins";
import { updateQuantity, slideImage, addToCart, cartList } from "./Mixins";
import { totalCost } from "../partials/Mixins";

const apiURL = process.env.REACT_APP_API_URL;

const ProductDetailsSection = (props) => {
  let { id } = useParams();

  const { data, dispatch } = useContext(ProductDetailsContext);
  const { data: layoutData, dispatch: layoutDispatch } =
    useContext(LayoutContext); // Layout Context

  const sProduct = layoutData.singleProductDetail;
  const [pImages, setPimages] = useState(null);
  const [count, setCount] = useState(0);

  // State for size and stock management
  const [selectedSize, setSelectedSize] = useState(null);
  const [availableStock, setAvailableStock] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [, setAlertq] = useState(false);

  const [wList, setWlist] = useState(
    JSON.parse(localStorage.getItem("wishList"))
  );

  // This effect updates the available stock when a size is selected
  useEffect(() => {
    if (selectedSize && sProduct && sProduct.pSizes) {
      const sizeInfo = sProduct.pSizes.find(
        (item) => item.size === selectedSize
      );
      if (sizeInfo) {
        setAvailableStock(sizeInfo.quantity);
        if (quantity > sizeInfo.quantity) {
          setQuantity(1); // Reset quantity if it's too high for the new size
        }
      }
    } else {
      // If no size is selected, or product has no sizes, stock is 0
      setAvailableStock(0);
    }
  }, [selectedSize, sProduct, quantity]);

  // --- CRITICAL FIX: This useEffect now re-runs whenever the product 'id' changes ---
  useEffect(() => {
    fetchData();
    // By adding [id] here, we tell React to re-run this function
    // every time the user navigates to a new product page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchData = async () => {
    dispatch({ type: "loading", payload: true });
    try {
      let responseData = await getSingleProduct(id);
      if (responseData && responseData.Product) {
        layoutDispatch({
          type: "singleProductDetail",
          payload: responseData.Product,
        });
        setPimages(responseData.Product.pImages);
        layoutDispatch({ type: "inCart", payload: cartList() });
      }
    } catch (error) {
      console.log(error);
    } finally {
      dispatch({ type: "loading", payload: false });
    }
  };

  if (data.loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <svg
          className="w-12 h-12 animate-spin text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
        </svg>
      </div>
    );
  } else if (!sProduct) {
    return (
      <div className="flex items-center justify-center h-screen">
        Product not found.
      </div>
    );
  }

  return (
    <Fragment>
      <Submenu
        value={{
          categoryId: sProduct.pCategory?._id,
          product: sProduct.pName,
          category: sProduct.pCategory?.cName,
        }}
      />
      <section className="m-4 md:mx-12 md:my-6">
        <div className="grid grid-cols-2 md:grid-cols-12">
          {/* Image slider section */}
          <div className="hidden md:block md:col-span-1 md:flex md:flex-col md:space-y-4 md:mr-2">
            {sProduct.pImages.map((img, index) => (
              <img
                key={index}
                onClick={() => setCount(index)}
                className={`${
                  count === index ? "border-2 border-yellow-700" : ""
                } cursor-pointer w-20 h-20 object-cover object-center`}
                src={`${apiURL}/uploads/products/${img}`}
                alt="pic"
              />
            ))}
          </div>
          <div className="col-span-2 md:col-span-7">
            <div className="relative">
              <img
                className="w-full h-auto object-cover object-center"
                src={`${apiURL}/uploads/products/${sProduct.pImages[count]}`}
                alt="Pic"
              />
            </div>
          </div>
          {/* Product details section */}
          <div className="col-span-2 mt-8 md:mt-0 md:col-span-4 md:ml-6 lg:ml-12">
            <div className="flex flex-col leading-8">
              <div className="text-2xl tracking-wider">{sProduct.pName}</div>
              <div className="flex justify-between items-center">
                <span className="text-xl tracking-wider text-yellow-700">
                  ${sProduct.pPrice}.00
                </span>
                {/* Wishlist icons */}
              </div>
            </div>
            <div className="my-4 md:my-6 text-gray-600">
              {sProduct.pDescription}
            </div>

            {/* Size Selection */}
            <div className="my-4 md:my-6">
              <h3 className="text-sm font-medium text-gray-800">Select Size</h3>
              <div className="flex items-center space-x-2 mt-2">
                {sProduct.pSizes && sProduct.pSizes.length > 0 ? (
                  sProduct.pSizes.map(({ size, quantity: sizeQty }) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      disabled={sizeQty === 0}
                      className={`px-4 py-2 border rounded-md transition-colors duration-200 ${
                        selectedSize === size
                          ? "bg-black text-white border-black"
                          : "bg-white text-black hover:bg-gray-100"
                      } ${
                        sizeQty === 0
                          ? "bg-gray-200 text-gray-400 line-through cursor-not-allowed"
                          : ""
                      }`}>
                      {size}
                    </button>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">
                    No sizes available for this product.
                  </p>
                )}
              </div>
            </div>

            {/* Quantity Section */}
            <div className="my-4 md:my-6">
              {selectedSize &&
              quantity >= availableStock &&
              availableStock > 0 ? (
                <span className="text-xs text-red-500">
                  Only {availableStock} left in stock for size {selectedSize}
                </span>
              ) : (
                ""
              )}
              <div className="flex justify-between items-center px-4 py-2 border">
                <div>Quantity</div>
                <div className="flex items-center space-x-2">
                  <span
                    onClick={() =>
                      updateQuantity(
                        "decrease",
                        availableStock,
                        quantity,
                        setQuantity,
                        setAlertq
                      )
                    }
                    className="cursor-pointer">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  <span className="font-semibold">{quantity}</span>
                  <span
                    onClick={() =>
                      updateQuantity(
                        "increase",
                        availableStock,
                        quantity,
                        setQuantity,
                        setAlertq
                      )
                    }
                    className="cursor-pointer">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={() => {
                  addToCart(
                    sProduct._id,
                    quantity,
                    sProduct.pPrice,
                    selectedSize,
                    layoutDispatch
                  );
                  fetchData();
                }}
                disabled={
                  !selectedSize ||
                  availableStock === 0 ||
                  (layoutData.inCart &&
                    layoutData.inCart.find(
                      (item) =>
                        item.id === sProduct._id && item.size === selectedSize
                    ))
                }
                style={{ background: "#303031" }}
                className="mt-4 w-full px-4 py-2 text-white text-center uppercase disabled:opacity-50 disabled:cursor-not-allowed">
                {!selectedSize
                  ? "Select a size"
                  : availableStock === 0
                  ? "Out of stock"
                  : layoutData.inCart &&
                    layoutData.inCart.find(
                      (item) =>
                        item.id === sProduct._id && item.size === selectedSize
                    )
                  ? "In cart"
                  : "Add to cart"}
              </button>
            </div>
          </div>
        </div>
      </section>
      <ProductDetailsSectionTwo />
    </Fragment>
  );
};

export default ProductDetailsSection;
