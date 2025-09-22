import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "./config.js";
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
  const [searchId, setSearchId] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [searchError, setSearchError] = useState("");
  const [editProduct, setEditProduct] = useState(null);

  // Fetch Products
  const fetchProducts = () => {
    axios
      .get(`${config.apiBaseUrl}/viewall`)
      .then((response) => {
        const data = Array.isArray(response.data) ? response.data : [response.data];
        setProducts(data);
        setError("");
      })
      .catch(() => setError("❌ Failed to load products"));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Add Product Handler
  const handleAddProduct = (e) => {
    e.preventDefault();
    setError(""); setMessage("");
    const productToSend = {
      ...newProduct,
      id: parseInt(newProduct.id),
      cost: parseFloat(newProduct.cost),
    };
    if (!productToSend.id || !productToSend.name || !productToSend.company || !productToSend.cost || !productToSend.contact) {
      setError("⚠ Please fill all fields for product");
      return;
    }
    axios
      .post(`${config.apiBaseUrl}/add`, productToSend, {
        headers: { "Content-Type": "application/json" },
      })
      .then(() => {
        fetchProducts();
        setNewProduct({ id: "", name: "", cost: "", company: "", contact: "" });
        setMessage("✅ Product added successfully!");
      })
      .catch((err) =>
        setError(
          err.response ? err.response.data : "❌ Failed to add product. Check server console."
        )
      );
  };

  // Delete Product Handler
  const handleDelete = (pid) => {
    setError(""); setMessage("");
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
    setSearchError(""); setSearchResult(null);
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

  // Edit Handlers
  const handleEdit = (product) => {
    setEditProduct({ ...product });
    setError(""); setMessage("");
  };

  // Save Edit Handler
  const handleSaveEdit = () => {
    setError(""); setMessage("");
    if (
      !editProduct.id ||
      !editProduct.name ||
      !editProduct.company ||
      !editProduct.cost ||
      !editProduct.contact
    ) {
      setError("⚠ All fields are required for update");
      return;
    }
    axios
      .put(`${config.apiBaseUrl}/update/${editProduct.id}`, editProduct, {
        headers: { "Content-Type": "application/json" },
      })
      .then(() => {
        fetchProducts();
        setEditProduct(null);
        setMessage("✅ Product updated successfully!");
      })
      .catch(() => setError("❌ Failed to update product"));
  };

  // Cancel Edit Handler
  const handleCancelEdit = () => {
    setEditProduct(null);
    setError(""); setMessage("");
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
          onChange={(e) => setNewProduct({ ...newProduct, id: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Product Name"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Cost"
          value={newProduct.cost}
          onChange={(e) => setNewProduct({ ...newProduct, cost: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Company"
          value={newProduct.company}
          onChange={(e) => setNewProduct({ ...newProduct, company: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Contact"
          value={newProduct.contact}
          onChange={(e) => setNewProduct({ ...newProduct, contact: e.target.value })}
          required
        />
        <button type="submit">Add Product</button>
      </form>
      {/* Error / Success */}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}
      {/* Product List */}
      <h3>Product List</h3>
      <ul>
        {products.length > 0 ? (
          products.map((p) =>
            editProduct && editProduct.id === p.id ? (
              <li key={p.id}>
                ID: {p.id} |{" "}
                <input
                  type="text"
                  value={editProduct.name}
                  onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                />
                <input
                  type="number"
                  value={editProduct.cost}
                  onChange={(e) => setEditProduct({ ...editProduct, cost: e.target.value })}
                />
                <input
                  type="text"
                  value={editProduct.company}
                  onChange={(e) => setEditProduct({ ...editProduct, company: e.target.value })}
                />
                <input
                  type="text"
                  value={editProduct.contact}
                  onChange={(e) => setEditProduct({ ...editProduct, contact: e.target.value })}
                />
                <button onClick={handleSaveEdit}>Save</button>
                <button onClick={handleCancelEdit}>Cancel</button>
              </li>
            ) : (
              <li key={p.id}>
                ID: {p.id} | Name: {p.name} | Cost: ₹{p.cost} | Company: {p.company} | Contact: {p.contact}
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
            )
          )
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
            <strong>Result:</strong> ID: {searchResult.id} | Name: {searchResult.name} | Cost: ₹{searchResult.cost} | Company: {searchResult.company} | Contact: {searchResult.contact}
          </p>
        </div>
      )}
      {searchError && <p style={{ color: "red" }}>{searchError}</p>}
    </div>
  );
}

export default ProductManager;
