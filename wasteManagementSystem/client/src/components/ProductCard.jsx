import React from 'react';

const ProductCard = ({ product }) => {
  // Defensive check: If product is null, return nothing
  if (!product) return null;

  const { title, price, description, category, image, rating } = product;

  return (
    <div style={styles.card}>
      <div style={styles.imageContainer}>
        <img src={image} alt={title} style={styles.image} />
        <span style={styles.categoryBadge}>{category}</span>
      </div>

      <div style={styles.content}>
        <h3 style={styles.title} title={title}>
          {title.length > 50 ? title.substring(0, 47) + "..." : title}
        </h3>
        
        <div style={styles.ratingRow}>
          <span style={styles.stars}>⭐ {rating.rate}</span>
          <span style={styles.count}>({rating.count} reviews)</span>
        </div>

        <p style={styles.description}>
          {description.substring(0, 100)}...
        </p>

        <div style={styles.footer}>
          <span style={styles.price}>${price.toFixed(2)}</span>
          <button 
            style={styles.button}
            onClick={() => console.log(`Added ${title} to cart`)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

// Senior Tip: Move styles outside the component to prevent re-creation on every render
const styles = {
  card: {
    width: "300px",
    border: "1px solid #eee",
    borderRadius: "12px",
    overflow: "hidden",
    backgroundColor: "#fff",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    transition: "transform 0.2s",
    display: "flex",
    flexDirection: "column",
    margin: "10px"
  },
  imageContainer: {
    position: "relative",
    height: "200px",
    padding: "20px",
    backgroundColor: "#fff",
    display: "flex",
    justifyContent: "center"
  },
  image: {
    maxHeight: "100%",
    maxWidth: "100%",
    objectFit: "contain"
  },
  categoryBadge: {
    position: "absolute",
    top: "10px",
    left: "10px",
    backgroundColor: "#f3f4f6",
    padding: "4px 8px",
    borderRadius: "20px",
    fontSize: "12px",
    textTransform: "uppercase",
    fontWeight: "bold",
    color: "#6b7280"
  },
  content: {
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },
  title: {
    fontSize: "16px",
    fontWeight: "600",
    margin: "0",
    color: "#111827",
    height: "40px",
    overflow: "hidden"
  },
  ratingRow: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    fontSize: "14px"
  },
  stars: {
    color: "#f59e0b",
    fontWeight: "bold"
  },
  count: {
    color: "#9ca3af"
  },
  description: {
    fontSize: "14px",
    color: "#4b5563",
    lineHeight: "1.5",
    height: "60px",
    margin: "0"
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "10px"
  },
  price: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#059669"
  },
  button: {
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "500"
  }
};

export default ProductCard;