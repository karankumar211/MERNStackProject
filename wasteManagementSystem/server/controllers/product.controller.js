// server/controllers/productController.js

import Product from "../models/Product.model.js";


export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};


export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};


export const createProduct = async (req, res) => {
  const { name, description, price, imageUrl, stock } = req.body;

  try {
    const newProduct = new Product({
      name,
      description,
      price,
      imageUrl,
      stock,
    });

    const product = await newProduct.save();
    res.status(201).json(product);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};
