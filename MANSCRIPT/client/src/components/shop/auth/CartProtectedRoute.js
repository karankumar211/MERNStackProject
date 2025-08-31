import React from "react";
import { Route, Redirect } from "react-router-dom";
import { isAuthenticate } from "./fetchApi";

const CartProtectedRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      // Get the cart from localStorage first.
      const cart = JSON.parse(localStorage.getItem("cart"));

      // Check if the user is authenticated AND if the cart exists and is not empty.
      if (isAuthenticate() && cart && cart.length > 0) {
        return <Component {...props} />;
      } else {
        return (
          <Redirect
            to={{
              pathname: "/",
              state: { from: props.location },
            }}
          />
        );
      }
    }}
  />
);

export default CartProtectedRoute;
