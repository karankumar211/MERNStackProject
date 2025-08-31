export const subTotal = (id, price) => {
  let subTotalCost = 0;
  // Use a default empty array to prevent errors if cart is null
  let carts = JSON.parse(localStorage.getItem("cart")) || [];

  carts.forEach((item) => {
    if (item.id === id) {
      // CORRECTED: Changed "quantitiy" to "quantity"
      subTotalCost = item.quantity * price;
    }
  });
  return subTotalCost;
};

export const quantity = (id) => {
  let productQuantity = 0;
  // Use a default empty array to prevent errors if cart is null
  let carts = JSON.parse(localStorage.getItem("cart")) || [];

  carts.forEach((item) => {
    if (item.id === id) {
      // CORRECTED: Changed "quantitiy" to "quantity"
      productQuantity = item.quantity;
    }
  });
  return productQuantity;
};

export const totalCost = () => {
  let totalCost = 0;
  // Use a default empty array to prevent errors if cart is null
  let carts = JSON.parse(localStorage.getItem("cart")) || [];

  carts.forEach((item) => {
    // CORRECTED: Changed "quantitiy" to "quantity"
    totalCost += item.quantity * item.price;
  });
  return totalCost;
};
