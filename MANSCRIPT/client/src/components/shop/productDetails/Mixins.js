// This function now returns the full cart array with size information.
export const cartList = () => {
  let cart = localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart"))
    : [];
  return cart;
};

// This function is now corrected to work with the available stock of the selected size.
export const updateQuantity = (type, availableStock, quantity, setQuantity) => {
  if (type === "increase") {
    // Prevent increasing quantity beyond the available stock for the selected size
    if (quantity < availableStock) {
      setQuantity(quantity + 1);
    }
  } else if (type === "decrease") {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  }
};

// This function remains the same.
export const slideImage = (type, active, count, setCount, pImages) => {
  if (active === count) {
    return true;
  }
  if (type === "increase") {
    if (count === pImages.length - 1) {
      setCount(0);
    } else if (count < pImages.length) {
      setCount(count + 1);
    }
  }
};

// This old inCart function is no longer needed. The logic is now handled in the component.

// This is the new, corrected addToCart function.
// It accepts 'size' and no longer causes the page to freeze.
export const addToCart = (
  id,
  quantity,
  price,
  size, // New parameter for the selected size
  layoutDispatch,
  totalCost // Assuming totalCost is another mixin function
) => {
  // Get the current cart from localStorage
  let cart = localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart"))
    : [];

  // Check if the item with the same ID and size already exists
  const isItemExist = cart.find((item) => item.id === id && item.size === size);

  if (isItemExist) {
    // If it exists, you might want to update its quantity, but for now, we'll do nothing.
    // Or you could show a message: "Item is already in your cart"
    return;
  }

  // If the item doesn't exist, add it to the cart
  cart.push({ id, quantity, price, size });
  localStorage.setItem("cart", JSON.stringify(cart));

  // Update the global state in your layout context
  layoutDispatch({ type: "inCart", payload: cartList() });
  // You might need to update the total cost as well
  // layoutDispatch({ type: "cartTotalCost", payload: totalCost() });
};
