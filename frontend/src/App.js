import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE_URL = 'https://backend-mwb65pfva-kamal-agraharis-projects.vercel.app';

function App() {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [activeTab, setActiveTab] = useState('categories');
  const [loading, setLoading] = useState(false);

  // Form states
  const [categoryForm, setCategoryForm] = useState({
    name: '', image: '', description: '', taxApplicability: false, tax: 0, taxType: ''
  });
  const [subcategoryForm, setSubcategoryForm] = useState({
    name: '', image: '', description: '', categoryId: '', taxApplicability: false, tax: 0
  });
  const [itemForm, setItemForm] = useState({
    name: '', image: '', description: '', taxApplicability: false, tax: 0,
    baseAmount: 0, discount: 0, categoryId: '', subcategoryId: ''
  });

  useEffect(() => {
    fetchCategories();
    fetchSubcategories();
    fetchItems();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchSubcategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/subcategories`);
      setSubcategories(response.data);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  };

  const fetchItems = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/items`);
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/items/search/${searchTerm}`);
      setSearchResults(response.data);
      setActiveTab('search');
    } catch (error) {
      console.error('Error searching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/api/categories`, categoryForm);
      setCategoryForm({ name: '', image: '', description: '', taxApplicability: false, tax: 0, taxType: '' });
      fetchCategories();
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  const handleCreateSubcategory = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/api/subcategories`, subcategoryForm);
      setSubcategoryForm({ name: '', image: '', description: '', categoryId: '', taxApplicability: false, tax: 0 });
      fetchSubcategories();
    } catch (error) {
      console.error('Error creating subcategory:', error);
    }
  };

  const handleCreateItem = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/api/items`, itemForm);
      setItemForm({
        name: '', image: '', description: '', taxApplicability: false, tax: 0,
        baseAmount: 0, discount: 0, categoryId: '', subcategoryId: ''
      });
      fetchItems();
    } catch (error) {
      console.error('Error creating item:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Menu Management System</h1>
        <p>Manage your restaurant menu with categories, subcategories, and items</p>
      </header>

      <nav className="navbar">
        <button
          className={activeTab === 'categories' ? 'active' : ''}
          onClick={() => setActiveTab('categories')}
        >
          Categories ({categories.length})
        </button>
        <button
          className={activeTab === 'subcategories' ? 'active' : ''}
          onClick={() => setActiveTab('subcategories')}
        >
          Subcategories ({subcategories.length})
        </button>
        <button
          className={activeTab === 'items' ? 'active' : ''}
          onClick={() => setActiveTab('items')}
        >
          Items ({items.length})
        </button>
        <button
          className={activeTab === 'create' ? 'active' : ''}
          onClick={() => setActiveTab('create')}
        >
          Create New
        </button>
      </nav>

      <div className="search-bar">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search items by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>
      </div>

      <main className="main-content">
        {activeTab === 'categories' && (
          <div className="tab-content">
            <h2>Categories</h2>
            <div className="grid">
              {categories.map(category => (
                <div key={category._id} className="card">
                  <img src={category.image} alt={category.name} />
                  <h3>{category.name}</h3>
                  <p>{category.description}</p>
                  <div className="tax-info">
                    <span>Tax: {category.taxApplicability ? `${category.tax}% ${category.taxType}` : 'No tax'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'subcategories' && (
          <div className="tab-content">
            <h2>Subcategories</h2>
            <div className="grid">
              {subcategories.map(subcategory => (
                <div key={subcategory._id} className="card">
                  <img src={subcategory.image} alt={subcategory.name} />
                  <h3>{subcategory.name}</h3>
                  <p>{subcategory.description}</p>
                  <div className="category-ref">
                    <small>Category: {subcategory.category?.name}</small>
                  </div>
                  <div className="tax-info">
                    <span>Tax: {subcategory.taxApplicability ? `${subcategory.tax}%` : 'Inherits from category'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'items' && (
          <div className="tab-content">
            <h2>Items</h2>
            <div className="grid">
              {items.map(item => (
                <div key={item._id} className="card">
                  <img src={item.image} alt={item.name} />
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <div className="price-info">
                    <span className="base-price">₹{item.baseAmount}</span>
                    {item.discount > 0 && <span className="discount"> - ₹{item.discount}</span>}
                    <span className="total-price"> = ₹{item.totalAmount}</span>
                  </div>
                  <div className="category-ref">
                    <small>Category: {item.category?.name}</small>
                    {item.subcategory && <small> | Subcategory: {item.subcategory.name}</small>}
                  </div>
                  <div className="tax-info">
                    <span>Tax: {item.taxApplicability ? `${item.tax}%` : 'No tax'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'search' && (
          <div className="tab-content">
            <h2>Search Results for "{searchTerm}"</h2>
            {searchResults.length > 0 ? (
              <div className="grid">
                {searchResults.map(item => (
                  <div key={item._id} className="card">
                    <img src={item.image} alt={item.name} />
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                    <div className="price-info">
                      <span className="base-price">₹{item.baseAmount}</span>
                      {item.discount > 0 && <span className="discount"> - ₹{item.discount}</span>}
                      <span className="total-price"> = ₹{item.totalPrice}</span>
                    </div>
                    <div className="category-ref">
                      <small>Category: {item.category?.name}</small>
                      {item.subcategory && <small> | Subcategory: {item.subcategory.name}</small>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No items found matching "{searchTerm}"</p>
            )}
          </div>
        )}

        {activeTab === 'create' && (
          <div className="tab-content">
            <h2>Create New</h2>
            <div className="forms-container">
              <div className="form-section">
                <h3>Create Category</h3>
                <form onSubmit={handleCreateCategory}>
                  <input
                    type="text"
                    placeholder="Name"
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
                    required
                  />
                  <input
                    type="url"
                    placeholder="Image URL"
                    value={categoryForm.image}
                    onChange={(e) => setCategoryForm({...categoryForm, image: e.target.value})}
                    required
                  />
                  <textarea
                    placeholder="Description"
                    value={categoryForm.description}
                    onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})}
                    required
                  />
                  <label>
                    <input
                      type="checkbox"
                      checked={categoryForm.taxApplicability}
                      onChange={(e) => setCategoryForm({...categoryForm, taxApplicability: e.target.checked})}
                    />
                    Tax Applicable
                  </label>
                  {categoryForm.taxApplicability && (
                    <>
                      <input
                        type="number"
                        placeholder="Tax %"
                        value={categoryForm.tax}
                        onChange={(e) => setCategoryForm({...categoryForm, tax: parseFloat(e.target.value)})}
                        required
                      />
                      <input
                        type="text"
                        placeholder="Tax Type (e.g., GST)"
                        value={categoryForm.taxType}
                        onChange={(e) => setCategoryForm({...categoryForm, taxType: e.target.value})}
                        required
                      />
                    </>
                  )}
                  <button type="submit">Create Category</button>
                </form>
              </div>

              <div className="form-section">
                <h3>Create Subcategory</h3>
                <form onSubmit={handleCreateSubcategory}>
                  <input
                    type="text"
                    placeholder="Name"
                    value={subcategoryForm.name}
                    onChange={(e) => setSubcategoryForm({...subcategoryForm, name: e.target.value})}
                    required
                  />
                  <input
                    type="url"
                    placeholder="Image URL"
                    value={subcategoryForm.image}
                    onChange={(e) => setSubcategoryForm({...subcategoryForm, image: e.target.value})}
                    required
                  />
                  <textarea
                    placeholder="Description"
                    value={subcategoryForm.description}
                    onChange={(e) => setSubcategoryForm({...subcategoryForm, description: e.target.value})}
                    required
                  />
                  <select
                    value={subcategoryForm.categoryId}
                    onChange={(e) => setSubcategoryForm({...subcategoryForm, categoryId: e.target.value})}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                  <button type="submit">Create Subcategory</button>
                </form>
              </div>

              <div className="form-section">
                <h3>Create Item</h3>
                <form onSubmit={handleCreateItem}>
                  <input
                    type="text"
                    placeholder="Name"
                    value={itemForm.name}
                    onChange={(e) => setItemForm({...itemForm, name: e.target.value})}
                    required
                  />
                  <input
                    type="url"
                    placeholder="Image URL"
                    value={itemForm.image}
                    onChange={(e) => setItemForm({...itemForm, image: e.target.value})}
                    required
                  />
                  <textarea
                    placeholder="Description"
                    value={itemForm.description}
                    onChange={(e) => setItemForm({...itemForm, description: e.target.value})}
                    required
                  />
                  <select
                    value={itemForm.categoryId}
                    onChange={(e) => setItemForm({...itemForm, categoryId: e.target.value})}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                  <select
                    value={itemForm.subcategoryId}
                    onChange={(e) => setItemForm({...itemForm, subcategoryId: e.target.value})}
                  >
                    <option value="">Select Subcategory (Optional)</option>
                    {subcategories
                      .filter(sub => sub.category._id === itemForm.categoryId)
                      .map(sub => (
                        <option key={sub._id} value={sub._id}>{sub.name}</option>
                      ))}
                  </select>
                  <label>
                    <input
                      type="checkbox"
                      checked={itemForm.taxApplicability}
                      onChange={(e) => setItemForm({...itemForm, taxApplicability: e.target.checked})}
                    />
                    Tax Applicable
                  </label>
                  {itemForm.taxApplicability && (
                    <input
                      type="number"
                      placeholder="Tax %"
                      value={itemForm.tax}
                      onChange={(e) => setItemForm({...itemForm, tax: parseFloat(e.target.value)})}
                      required
                    />
                  )}
                  <input
                    type="number"
                    placeholder="Base Amount"
                    value={itemForm.baseAmount}
                    onChange={(e) => setItemForm({...itemForm, baseAmount: parseFloat(e.target.value)})}
                    required
                  />
                  <input
                    type="number"
                    placeholder="Discount"
                    value={itemForm.discount}
                    onChange={(e) => setItemForm({...itemForm, discount: parseFloat(e.target.value)})}
                  />
                  <div className="total-preview">
                    Total: ₹{(itemForm.baseAmount - itemForm.discount).toFixed(2)}
                  </div>
                  <button type="submit">Create Item</button>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
