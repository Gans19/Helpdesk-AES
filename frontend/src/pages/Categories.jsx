import { useEffect, useState } from 'react';
import api from '../services/api';
import { useToast } from '../hooks/useToast';

const emptyCategory = { name: '', description: '' };

const CategoriesPage = () => {
  const toast = useToast();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyCategory);
  const [editingId, setEditingId] = useState(null);

  const loadCategories = async () => {
    const res = await api.get('/categories');
    setCategories(res.data.data);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (editingId) {
        await api.put(`/categories/${editingId}`, form);
        toast.showSuccess('Category updated successfully');
      } else {
        await api.post('/categories', form);
        toast.showSuccess('Category created successfully');
      }
      setForm(emptyCategory);
      setEditingId(null);
      loadCategories();
    } catch (err) {
      toast.showError(err.response?.data?.message || 'Failed to save category');
    }
  };

  const editCategory = (category) => {
    setEditingId(category.id);
    setForm({
      name: category.name,
      description: category.description || ''
    });
  };

  const deleteCategory = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await api.delete(`/categories/${id}`);
      toast.showSuccess('Category deleted successfully');
      loadCategories();
    } catch (err) {
      toast.showError(err.response?.data?.message || 'Failed to delete category');
    }
  };

  return (
    <div className="page">
      <header className="page-header">
        <h2>Categories</h2>
        <p className="muted">Manage ticket categories.</p>
      </header>

      <section className="card form">
        <h3>{editingId ? 'Edit category' : 'New category'}</h3>
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Name</label>
          <input id="name" name="name" value={form.name} onChange={handleChange} required />

          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            rows={3}
            value={form.description}
            onChange={handleChange}
          />

          <div className="form-actions">
            <button type="submit" className="primary-btn">
              {editingId ? 'Update' : 'Create'}
            </button>
            {editingId && (
              <button
                type="button"
                className="outline-btn"
                onClick={() => {
                  setEditingId(null);
                  setForm(emptyCategory);
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="card">
        <h3>Existing categories</h3>
        <div className="table-wrapper">
          <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id}>
                <td>{category.name}</td>
                <td>{category.description}</td>
                <td className="actions">
                  <button type="button" onClick={() => editCategory(category)} className="link-btn">
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteCategory(category.id)}
                    className="link-btn danger"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {!categories.length && (
              <tr>
                <td colSpan={3} className="muted">
                  No categories yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </section>
    </div>
  );
};

export default CategoriesPage;

