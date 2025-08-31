import React, { Fragment } from "react";
import Layout from "../layout";
import { CheckoutComponent } from "./CheckoutProducts";

// Add this import with your other imports
import { initiatePhonePePayment } from "./FetchApi";
const CheckoutPage = (props) => {
  return (
    <Fragment>
      <Layout children={<CheckoutComponent />} />
    </Fragment>
  );
};

export default CheckoutPage;
