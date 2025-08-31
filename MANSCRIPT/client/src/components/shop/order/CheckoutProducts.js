import React, { Fragment, useEffect, useContext, useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { LayoutContext } from "../layout";
import { totalCost } from "../partials/Mixins";
import { cartList } from "../productDetails/Mixins";
import { cartListProduct } from "../partials/FetchApi";
import { fetchData } from "./Action";
import axios from "axios";

const apiURL = "http://localhost:8000";

export const CheckoutComponent = (props) => {
  const history = useHistory();
  const { data, dispatch } = useContext(LayoutContext);

  const [state, setState] = useState({ address: "", phone: "", error: false });
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const localCart = cartList();
    const productDetails = data.cartProduct;
    if (productDetails && localCart) {
      const combinedData = localCart.map(cartItem => {
        const details = productDetails.find(p => p._id === cartItem.id);
        return details ? { ...cartItem, pName: details.pName, pImages: details.pImages } : null;
      }).filter(item => item !== null);
      setCheckoutItems(combinedData);
    }
  }, [data.cartProduct]);

  useEffect(() => {
    setTotal(totalCost());
  }, [checkoutItems]);

  useEffect(() => {
    fetchData(cartListProduct, dispatch).then(() => setLoading(false));
  }, []);

  const handleRazorpayPayment = async () => {
    if (!state.address || !state.phone) {
      setState({ ...state, error: "Address and Phone are required." });
      return;
    }
    try {
      const amount = totalCost();
      const { data: order } = await axios.post(`${apiURL}/api/razorpay/orders`, { amount });
      const razorpayKeyId = "rzp_test_Q3aYP4TASRTjJm";

      const options = {
        key: razorpayKeyId,
        amount: order.amount,
        currency: "INR",
        name: "Manscript",
        order_id: order.id,
        handler: async function (response) {
          const verificationData = {
            ...response,
            amount: totalCost(),
            allProduct: cartList(),
            user: JSON.parse(localStorage.getItem("jwt")).user._id,
            address: state.address,
            phone: state.phone,
          };
          const { data: verificationResult } = await axios.post(`${apiURL}/api/razorpay/verify`, verificationData);
          if (verificationResult.success) {
            localStorage.removeItem("cart");
            dispatch({ type: "cartProduct", payload: [] });
            dispatch({ type: "inCart", payload: [] });
            dispatch({ type: "cartTotalCost", payload: 0 });
            history.push("/user/orders");
          } else {
            setState({ ...state, error: "Payment verification failed." });
          }
        },
        prefill: {
          name: JSON.parse(localStorage.getItem("jwt")).user.name,
          email: JSON.parse(localStorage.getItem("jwt")).user.email,
          contact: state.phone,
        },
        notes: { address: state.address },
        theme: { color: "#303031" },
      };
      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      setState({ ...state, error: "An error occurred during payment." });
    }
  };

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (checkoutItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-semibold mb-4">Your cart is empty</h1>
        <Link to="/" className="px-4 py-2 bg-black text-white rounded-md">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <Fragment>
      <section className="mx-4 mt-20 md:mx-12 md:mt-32 lg:mt-24">
        <div className="text-2xl mx-2">Order</div>
        <div className="flex flex-col md:flex md:space-x-2 md:flex-row">
          <div className="md:w-1/2"><CheckoutProducts products={checkoutItems} /></div>
          <div className="w-full order-first md:order-last md:w-1/2">
            <div className="p-4 md:p-8">
              {state.error && <div className="bg-red-200 p-2 rounded mb-4">{state.error}</div>}
              <div className="flex flex-col py-2">
                <label htmlFor="address" className="pb-2">Delivery Address</label>
                <input value={state.address} onChange={(e) => setState({ ...state, address: e.target.value, error: false })} type="text" id="address" className="border px-4 py-2" placeholder="Address..." />
              </div>
              <div className="flex flex-col py-2 mb-2">
                <label htmlFor="phone" className="pb-2">Phone</label>
                <input value={state.phone} onChange={(e) => setState({ ...state, phone: e.target.value, error: false })} type="number" id="phone" className="border px-4 py-2" placeholder="+91" />
              </div>
              <div className="flex items-center justify-between my-4 py-4 border-t border-b">
                <div className="text-xl font-semibold">Total</div>
                <div className="text-xl font-bold">₹{total}</div>
              </div>
              <div onClick={handleRazorpayPayment} className="w-full px-4 py-2 text-center text-white font-semibold cursor-pointer" style={{ background: "#303031" }}>
                Pay with Razorpay
              </div>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  );
};

const CheckoutProducts = ({ products }) => {
  const history = useHistory();
  return (
    <Fragment>
      <div className="grid grid-cols-1">
        {products && products.length > 0 ? (
          products.map((product, index) => (
            <div key={index} className="col-span-1 m-2 md:py-6 md:border-t md:border-b md:my-2 md:mx-0 md:flex md:items-center md:justify-between">
              <div className="md:flex md:items-center md:space-x-4">
                <img onClick={() => history.push(`/products/${product.id}`)} className="cursor-pointer md:h-20 md:w-20 object-cover object-center" src={product.pImages ? `${apiURL}/uploads/products/${product.pImages[0]}` : "https://via.placeholder.com/150"} alt="product" />
                <div className="flex-grow">
                  <div className="text-lg md:ml-6 truncate">{product.pName}</div>
                  <div className="text-sm text-gray-500 md:ml-6">Size: {product.size}</div>
                </div>
                <div className="md:ml-6 font-semibold text-gray-600 text-sm">Quantity: {product.quantity}</div>
                <div className="font-semibold text-gray-600 text-sm">Subtotal: ₹{product.quantity * product.price}</div>
              </div>
            </div>
          ))
        ) : (
          <div>No products found for checkout</div>
        )}
      </div>
    </Fragment>
  );
};

export default CheckoutComponent;
