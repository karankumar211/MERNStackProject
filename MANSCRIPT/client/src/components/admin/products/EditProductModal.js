import React, { Fragment, useContext, useState, useEffect } from "react";
import { ProductContext } from "./index";
import { editProduct, getAllProduct } from "./FetchApi";
import { getAllCategory } from "../categories/FetchApi";
const apiURL = process.env.REACT_APP_API_URL;

const EditProductModal = (props) => {
  const { data, dispatch } = useContext(ProductContext);

  const [categories, setCategories] = useState(null);

  const alert = (msg, type) => (
    <div className={`bg-${type}-200 py-2 px-4 w-full`}>{msg}</div>
  );

  const [editFormData, setEditFormData] = useState({
    pId: "",
    pName: "",
    pDescription: "",
    pImages: null,
    pEditImages: null,
    pStatus: "",
    pCategory: "",
    pSizes: { S: 0, M: 0, L: 0, XL: 0, XXL: 0 },
    pPrice: "",
    pOffer: "",
    error: false,
    success: false,
  });

  const handleSizeQuantityChange = (size, value) => {
    setEditFormData({
      ...editFormData,
      pSizes: {
        ...editFormData.pSizes,
        [size]: value,
      },
    });
  };

  useEffect(() => {
    fetchCategoryData();
  }, []);

  const fetchCategoryData = async () => {
    let responseData = await getAllCategory();
    if (responseData.Categories) {
      setCategories(responseData.Categories);
    }
  };

  useEffect(() => {
    const product = data.editProductModal;

    const formatSizesForState = (pSizesArray) => {
      const allSizes = { S: 0, M: 0, L: 0, XL: 0, XXL: 0 };
      if (pSizesArray && Array.isArray(pSizesArray)) {
        pSizesArray.forEach((item) => {
          if (allSizes.hasOwnProperty(item.size)) {
            allSizes[item.size] = item.quantity;
          }
        });
      }
      return allSizes;
    };

    setEditFormData({
      pId: product.pId,
      pName: product.pName,
      pDescription: product.pDescription,
      pImages: product.pImages,
      pStatus: product.pStatus,
      pCategory: product.pCategory,
      pSizes: formatSizesForState(product.pSizes),
      pPrice: product.pPrice,
      pOffer: product.pOffer,
    });
  }, [data.editProductModal]);

  const fetchData = async () => {
    let responseData = await getAllProduct();
    if (responseData && responseData.Products) {
      dispatch({
        type: "fetchProductsAndChangeState",
        payload: responseData.Products,
      });
    }
  };

  const submitForm = async (e) => {
    e.preventDefault();

    const productData = { ...editFormData };

    if (productData.pCategory && typeof productData.pCategory === "object") {
      productData.pCategory = productData.pCategory._id;
    }

    try {
      let responseData = await editProduct(productData);
      if (responseData.success) {
        fetchData();
        setEditFormData({
          ...editFormData,
          success: responseData.success,
          error: false,
        });
        // --- NEW: Automatically close the modal after 2 seconds ---
        setTimeout(() => {
          dispatch({ type: "editProductModalClose", payload: false });
        }, 2000);
      } else if (responseData.error) {
        setEditFormData({
          ...editFormData,
          error: responseData.error,
          success: false,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Fragment>
      {/* Black Overlay */}
      <div
        onClick={(e) =>
          dispatch({ type: "editProductModalClose", payload: false })
        }
        className={`${
          data.editProductModal.modal ? "" : "hidden"
        } fixed top-0 left-0 z-30 w-full h-full bg-black opacity-50`}
      />
      {/* End Black Overlay */}

      <div
        className={`${
          data.editProductModal.modal ? "" : "hidden"
        } fixed inset-0 flex items-center z-30 justify-center p-4 overflow-auto`}>
        <div className="relative bg-white w-11/12 md:w-3/6 shadow-lg flex flex-col items-center space-y-4 px-4 py-4 md:px-8">
          <div className="flex items-center justify-between w-full pt-4">
            <span className="text-left font-semibold text-2xl tracking-wider">
              Edit Product
            </span>
            <span
              style={{ background: "#303031" }}
              onClick={(e) =>
                dispatch({ type: "editProductModalClose", payload: false })
              }
              className="cursor-pointer text-gray-100 py-2 px-2 rounded-full">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </span>
          </div>
          {editFormData.error ? alert(editFormData.error, "red") : ""}
          {editFormData.success ? alert(editFormData.success, "green") : ""}
          <form className="w-full" onSubmit={submitForm}>
            {/* ... all your form fields ... */}
            <div className="flex space-x-1 py-4">
              <div className="w-1/2 flex flex-col space-y-1 space-x-1">
                <label htmlFor="name">Product Name *</label>
                <input
                  value={editFormData.pName}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      pName: e.target.value,
                    })
                  }
                  className="px-4 py-2 border focus:outline-none"
                  type="text"
                />
              </div>
              <div className="w-1/2 flex flex-col space-y-1 space-x-1">
                <label htmlFor="price">Product Price *</label>
                <input
                  value={editFormData.pPrice}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      pPrice: e.target.value,
                    })
                  }
                  type="number"
                  className="px-4 py-2 border focus:outline-none"
                  id="price"
                />
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="description">Product Description *</label>
              <textarea
                value={editFormData.pDescription}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    pDescription: e.target.value,
                  })
                }
                className="px-4 py-2 border focus:outline-none"
                name="description"
                id="description"
                cols={5}
                rows={2}
              />
            </div>
            <div className="flex flex-col mt-4">
              <label htmlFor="image">Product Images *</label>
              {editFormData.pImages ? (
                <div className="flex space-x-1">
                  <img
                    className="h-16 w-16 object-cover"
                    src={`${apiURL}/uploads/products/${editFormData.pImages[0]}`}
                    alt="productImage"
                  />
                  <img
                    className="h-16 w-16 object-cover"
                    src={`${apiURL}/uploads/products/${editFormData.pImages[1]}`}
                    alt="productImage"
                  />
                </div>
              ) : (
                ""
              )}
              <span className="text-gray-600 text-xs">Must need 2 images</span>
              <input
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    pEditImages: [...e.target.files],
                  })
                }
                type="file"
                accept=".jpg, .jpeg, .png"
                className="px-4 py-2 border focus:outline-none"
                id="image"
                multiple
              />
            </div>
            <div className="flex space-x-1 py-4">
              <div className="w-1/2 flex flex-col space-y-1">
                <label htmlFor="status">Product Status *</label>
                <select
                  value={editFormData.pStatus}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      pStatus: e.target.value,
                    })
                  }
                  name="status"
                  className="px-4 py-2 border focus:outline-none"
                  id="status">
                  <option value="Active">Active</option>
                  <option value="Disabled">Disabled</option>
                </select>
              </div>
              <div className="w-1/2 flex flex-col space-y-1">
                <label htmlFor="category">Product Category *</label>
                <select
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      pCategory: e.target.value,
                    })
                  }
                  name="category"
                  className="px-4 py-2 border focus:outline-none"
                  id="category"
                  value={editFormData.pCategory?._id || editFormData.pCategory}>
                  <option disabled value="">
                    Select a category
                  </option>
                  {categories && categories.length > 0
                    ? categories.map((elem) => (
                        <option value={elem._id} key={elem._id}>
                          {elem.cName}
                        </option>
                      ))
                    : ""}
                </select>
              </div>
            </div>
            <div className="flex flex-col space-y-2 py-2">
              <label className="font-semibold">Stock per Size *</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                {Object.keys(editFormData.pSizes).map((size) => (
                  <div key={size} className="flex flex-col">
                    <label
                      htmlFor={`size-${size}`}
                      className="pb-1 text-sm font-medium">
                      {size}
                    </label>
                    <input
                      value={editFormData.pSizes[size]}
                      onChange={(e) =>
                        handleSizeQuantityChange(size, e.target.value)
                      }
                      type="number"
                      className="px-4 py-2 border focus:outline-none"
                      id={`size-${size}`}
                      placeholder="0"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="w-1/2 flex flex-col space-y-1 py-4">
              <label htmlFor="offer">Product Offer (%)</label>
              <input
                value={editFormData.pOffer}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    pOffer: e.target.value,
                  })
                }
                type="number"
                className="px-4 py-2 border focus:outline-none"
                id="offer"
              />
            </div>
            <div className="flex items-center space-x-4 w-full pb-4 md:pb-6 mt-4">
              <button
                type="button"
                onClick={(e) =>
                  dispatch({ type: "editProductModalClose", payload: false })
                }
                className="w-1/2 rounded-full bg-gray-200 text-gray-800 text-lg font-medium py-2">
                Close
              </button>
              <button
                style={{ background: "#303031" }}
                type="submit"
                className="w-1/2 rounded-full bg-gray-800 text-gray-100 text-lg font-medium py-2">
                Update product
              </button>
            </div>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default EditProductModal;
