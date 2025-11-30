import { useState, useEffect } from 'react';
import { Plus, Package } from 'lucide-react';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({ name: '', category: 'General', price: '', stock: '' });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(data);
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        if (!newProduct.name || !newProduct.price) return;

        await fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...newProduct,
                price: parseFloat(newProduct.price),
                stock: parseInt(newProduct.stock)
            })
        });
        setNewProduct({ name: '', category: 'General', price: '', stock: '' });
        fetchProducts();
    };

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Product Inventory</h1>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
                <div className="card">
                    <div className="card-header">
                        <h2 className="card-title">Inventory List</h2>
                    </div>
                    <div className="card-content">
                        <table style={{ width: '100%' }}>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Category</th>
                                    <th style={{ textAlign: 'right' }}>Price</th>
                                    <th style={{ textAlign: 'right' }}>Stock</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(product => (
                                    <tr key={product.id}>
                                        <td style={{ fontWeight: '500' }}>{product.name}</td>
                                        <td>{product.category}</td>
                                        <td style={{ textAlign: 'right', color: 'var(--primary)' }}>₹{product.price.toFixed(2)}</td>
                                        <td style={{ textAlign: 'right' }}>
                                            <span style={{
                                                padding: '0.2rem 0.5rem',
                                                borderRadius: '4px',
                                                background: product.stock < 5 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                                                color: product.stock < 5 ? '#ef4444' : 'inherit'
                                            }}>
                                                {product.stock}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="card" style={{ height: 'fit-content' }}>
                    <div className="card-header">
                        <h2 className="card-title">Add New Product</h2>
                    </div>
                    <div className="card-content">
                        <form onSubmit={handleAddProduct} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Name</label>
                                <input
                                    type="text"
                                    className="input"
                                    value={newProduct.name}
                                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                    placeholder="e.g. Shampoo"
                                    required
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Category</label>
                                <input
                                    type="text"
                                    className="input"
                                    value={newProduct.category}
                                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                                    placeholder="e.g. Hair Care"
                                />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Price (₹)</label>
                                    <input
                                        type="number"
                                        className="input"
                                        value={newProduct.price}
                                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Stock</label>
                                    <input
                                        type="number"
                                        className="input"
                                        value={newProduct.stock}
                                        onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary">
                                <Plus size={18} style={{ marginRight: '0.5rem' }} />
                                Add Product
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Products;
