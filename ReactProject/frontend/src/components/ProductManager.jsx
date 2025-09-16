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
  const [message, setMessage] = useState("");

  // 🔍 Search states
  const [searchId, setSearchId] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [searchError, setSearchError] = useState("");

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
        fetchProducts(); // Refresh list
        setNewProduct({
          id: "",
          name: "",
          cost: "",
          company: "",
          contact: "",
        });
        setError("");
        setMessage("✅ Product added successfully!");
      })
      .catch((err) =>
        setError(
          err.response
            ? err.response.data
            : "Failed to add product. Check console."
        )
      );
  };

  // Handle product deletion
  const handleDelete = (pid) => {
    axios
      .delete(`${config.apiBaseUrl}/delete/${pid}`)
      .then((response) => {
        setMessage(response.data); // Backend returns success or failure message
        fetchProducts(); // Refresh list
      })
      .catch(() => setError("❌ Failed to delete product"));
  };

  // Handle search by ID
  const handleSearch = () => {
    if (!searchId) {
      setSearchError("⚠ Please enter a Product ID");
      return;
    }

    axios
      .get(`${config.apiBaseUrl}/product/${searchId}`)
      .then((response) => {
        setSearchResult(response.data);
        setSearchError("");
      })
      .catch(() => {
        setSearchResult(null);
        setSearchError("❌ Product ID not found");
      });
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

      {/* Error / Success Messages */}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}

      {/* Product List */}
      <h3>Product List</h3>
      <ul>
        {products.length > 0 ? (
          products.map((p, index) => (
            <li key={p.id || index}>
              ID: {p.id} | Name: {p.name} | Cost: ₹{p.cost} | Company:{" "}
              {p.company} | Contact: {p.contact}
              {"  "}
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
                onClick={() => alert("Edit functionality coming soon!")}
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
            <strong>Result:</strong> ID: {searchResult.id} | Name:{" "}
            {searchResult.name} | Cost: ₹{searchResult.cost} | Company:{" "}
            {searchResult.company} | Contact: {searchResult.contact}
          </p>
        </div>
      )}
      {searchError && <p style={{ color: "red" }}>{searchError}</p>}
    </div>
  );
}

export default ProductManager;
