import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "./config.js"; // Ensure this exports apiBaseUrl
import "./style.css";

function ProductManager() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    id: "",
    name: "",
    cost: "",
    company: "",
    contact: "",
  });
  const [error, setError] = useState("");

  // Function to fetch all products
  const fetchProducts = () => {
    axios
      .get(`${config.apiBaseUrl}/viewall`)
      .then((response) => {
        const data = Array.isArray(response.data)
          ? response.data
          : [response.data];
        setProducts(data);
      })
      .catch(() => setError("Failed to load products"));
  };

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle form submission
  const handleAddProduct = (e) => {
    e.preventDefault();

    // Convert numeric fields before sending
    const productToSend = {
      ...newProduct,
      id: parseInt(newProduct.id),
      cost: parseFloat(newProduct.cost),
    };

    axios
      .post(`${config.apiBaseUrl}/add`, productToSend, {
        headers: { "Content-Type": "application/json" },
      })
      .then(() => {
        // Refetch updated product list
        fetchProducts();

        // Clear the form
        setNewProduct({
          id: "",
          name: "",
          cost: "",
          company: "",
          contact: "",
        });
        setError("");
      })
      .catch((err) =>
        setError(
          err.response
            ? err.response.data
            : "Failed to add product. Check console."
        )
      );
  };

  return (
    <div className="product-container">
      <h2>Product Manager</h2>

      {/* Add Product Form */}
      <form onSubmit={handleAddProduct}>
        <input
          type="number"
          placeholder="Product ID"
          value={newProduct.id}
          onChange={(e) =>
            setNewProduct({ ...newProduct, id: e.target.value })
          }
          required
        />
        <input
          type="text"
          placeholder="Product Name"
          value={newProduct.name}
          onChange={(e) =>
            setNewProduct({ ...newProduct, name: e.target.value })
          }
          required
        />
        <input
          type="number"
          placeholder="Cost"
          value={newProduct.cost}
          onChange={(e) =>
            setNewProduct({ ...newProduct, cost: e.target.value })
          }
          required
        />
        <input
          type="text"
          placeholder="Company"
          value={newProduct.company}
          onChange={(e) =>
            setNewProduct({ ...newProduct, company: e.target.value })
          }
          required
        />
        <input
          type="text"
          placeholder="Contact"
          value={newProduct.contact}
          onChange={(e) =>
            setNewProduct({ ...newProduct, contact: e.target.value })
          }
          required
        />
        <button type="submit">Add Product</button>
      </form>

      {/* Error message */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Product List */}
      <h3>Product List</h3>
      <ul>
        {products.length > 0 ? (
          products.map((p, index) => (
            <li key={p.id || index}>
              ID: {p.id} | Name: {p.name} | Cost: ₹{p.cost} | Company:{" "}
              {p.company} | Contact: {p.contact}
            </li>
          ))
        ) : (
          <li>No products found</li>
        )}
      </ul>
    </div>
  );
}

export default ProductManager;
