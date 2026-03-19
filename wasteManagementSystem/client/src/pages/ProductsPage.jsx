import React, { useEffect, useState } from 'react';
import { getProducts } from '../api/ProductApi'; 
import ProductCard from '../components/ProductCard';
const ProductsPage = () => {
  const [products, setProducts] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProduct = async () => { 
    setLoading(true);
    setError(null); 
    try { 
      const data = await getProducts(); 
      
      setProducts(data);
    } catch (err) {
      setError("Failed to fetch products. Check your connection.");
      console.error("Fetch Error:", err);
    } finally { 
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchProduct();
  }, []); 

  useEffect(() => {
    if (products) {
      console.log("State updated with products:", products);
    }
  }, [products]);

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>Product Catalog</h1>
      
      {loading && <p>Searching for items...</p>}
      
      {error && (
        <div style={{ color: "red", marginBottom: "10px" }}>
          {error}
          <button onClick={fetchProduct} style={{ marginLeft: "10px" }}>Retry</button>
        </div>
      )}

      {products && (
        <div style={gridStyle}>
          {products.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      )}
    </div>
  );
};
 const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
  gap: "20px",
  padding: "20px 0",
};
export default ProductsPage;