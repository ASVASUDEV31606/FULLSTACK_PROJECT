import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "./config.js";
import "./style.css";

function ProductManager() {
  const [products, setProducts] = useState([]);
  const [formProduct, setFormProduct] = useState({
    id: "",
    name: "",
    cost: "",
    company: "",
    contact: "",
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [searchId, setSearchId] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [searchError, setSearchError] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Fetch Products
  const fetchProducts = () => {
    axios
      .get(`${config.apiBaseUrl}/viewall`)
      .then((response) => {
        const data = Array.isArray(response.data)
          ? response.data
          : [response.data];
        setProducts(data);
        setError("");
      })
      .catch(() => setError("❌ Failed to load products"));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle form change
  const handleChange = (e) => {
    setFormProduct({ ...formProduct, [e.target.name]: e.target.value });
  };

  // Submit form (Add or Update)
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const productToSend = {
      ...formProduct,
      id: parseInt(formProduct.id),
      cost: parseFloat(formProduct.cost),
    };

    if (
      !productToSend.id ||
      !productToSend.name ||
      !productToSend.company ||
      !productToSend.cost ||
      !productToSend.contact
    ) {
      setError("⚠ Please fill all fields");
      return;
    }

    if (isEditing) {
      // UPDATE
      axios
        .put(`${config.apiBaseUrl}/updateproduct`, productToSend, {
          headers: { "Content-Type": "application/json" },
        })
        .then(() => {
          fetchProducts();
          setFormProduct({
            id: "",
            name: "",
            cost: "",
            company: "",
            contact: "",
          });
          setIsEditing(false);
          setMessage("✅ Product updated successfully!");
        })
        .catch(() => setError("❌ Failed to update product"));
    } else {
      // ADD
      axios
        .post(`${config.apiBaseUrl}/add`, productToSend, {
          headers: { "Content-Type": "application/json" },
        })
        .then(() => {
          fetchProducts();
          setFormProduct({
            id: "",
            name: "",
            cost: "",
            company: "",
            contact: "",
          });
          setMessage("✅ Product added successfully!");
        })
        .catch((err) =>
          setError(
            err.response
              ? err.response.data
              : "❌ Failed to add product. Check server console."
          )
        );
    }
  };

  // Delete Product Handler
  const handleDelete = (pid) => {
    setError("");
    setMessage("");
    axios
      .delete(`${config.apiBaseUrl}/delete/${pid}`)
      .then((response) => {
        setMessage("✅ " + response.data);
        fetchProducts();
      })
      .catch(() => setError("❌ Failed to delete product"));
  };

  // Search Handler
  const handleSearch = () => {
    setSearchError("");
    setSearchResult(null);
    if (!searchId) {
      setSearchError("⚠ Please enter a Product ID");
      return;
    }
    axios
      .get(`${config.apiBaseUrl}/product/${searchId}`)
      .then((response) => {
        setSearchResult(response.data);
      })
      .catch(() => {
        setSearchError("❌ Product ID not found");
      });
  };

  // Edit Handler
  const handleEdit = (product) => {
    setFormProduct({ ...product });
    setIsEditing(true);
    setError("");
    setMessage("");
  };

  return (
    <div className="product-container">
      <h2>Product Manager</h2>

      {/* Add / Update Product Form */}
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          name="id"
          placeholder="Product ID"
          value={formProduct.id}
          onChange={handleChange}
          required
          disabled={isEditing} // ID should not change when editing
        />
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={formProduct.name}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="cost"
          placeholder="Cost"
          value={formProduct.cost}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="company"
          placeholder="Company"
          value={formProduct.company}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="contact"
          placeholder="Contact"
          value={formProduct.contact}
          onChange={handleChange}
          required
        />
        <button type="submit">{isEditing ? "Update Product" : "Add Product"}</button>
        {isEditing && (
          <button
            type="button"
            onClick={() => {
              setFormProduct({
                id: "",
                name: "",
                cost: "",
                company: "",
                contact: "",
              });
              setIsEditing(false);
              setError("");
              setMessage("");
            }}
            style={{ marginLeft: "10px", backgroundColor: "gray", color: "white" }}
          >
            Cancel
          </button>
        )}
      </form>

      {/* Error / Success */}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}

      {/* Product List */}
      <h3>Product List</h3>
      <ul>
        {products.length > 0 ? (
          products.map((p) => (
            <li key={p.id}>
              ID: {p.id} | Name: {p.name} | Cost: ₹{p.cost} | Company: {p.company} | Contact:{" "}
              {p.contact}
              <button
                style={{
                  marginLeft: "10px",
                  backgroundColor: "red",
                  color: "white",
                  border: "none",
                  padding: "4px 8px",
                  cursor: "pointer",
                }}
                onClick={() => handleDelete(p.id)}
              >
                Delete
              </button>
              <button
                style={{
                  marginLeft: "10px",
                  backgroundColor: "blue",
                  color: "white",
                  border: "none",
                  padding: "4px 8px",
                  cursor: "pointer",
                }}
                onClick={() => handleEdit(p)}
              >
                Edit
              </button>
            </li>
          ))
        ) : (
          <li>No products found</li>
        )}
      </ul>

      {/* Search Product By ID */}
      <h3>Search Product By ID</h3>
      <div>
        <input
          type="number"
          placeholder="Enter Product ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
        <button
          onClick={handleSearch}
          style={{
            marginLeft: "10px",
            backgroundColor: "green",
            color: "white",
            border: "none",
            padding: "4px 8px",
            cursor: "pointer",
          }}
        >
          Search
        </button>
      </div>
      {searchResult && (
        <div style={{ marginTop: "10px" }}>
          <p>
            <strong>Result:</strong> ID: {searchResult.id} | Name: {searchResult.name} | Cost: ₹
            {searchResult.cost} | Company: {searchResult.company} | Contact: {searchResult.contact}
          </p>
        </div>
      )}
      {searchError && <p style={{ color: "red" }}>{searchError}</p>}
    </div>
  );
}

export default ProductManager;
