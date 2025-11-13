import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import api from '../services/api';

const defaultForm = {
  title: '',
  description: '',
  categoryId: '',
  priority: 'medium',
  attachment: null
};

const TicketCreatePage = () => {
  const navigate = useNavigate();
  const { setNotification } = useOutletContext();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      const res = await api.get('/categories');
      setCategories(res.data.data);
    };
    loadCategories();
  }, []);

  const handleInput = (event) => {
    const { name, value, files } = event.target;
    if (files) {
      setForm({ ...form, [name]: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.title.trim()) nextErrors.title = 'Title required';
    if (!form.description.trim()) nextErrors.description = 'Description required';
    if (!form.categoryId) nextErrors.categoryId = 'Category required';
    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validation = validate();
    setErrors(validation);
    if (Object.keys(validation).length) return;

    const payload = new FormData();
    payload.append('title', form.title);
    payload.append('description', form.description);
    payload.append('priority', form.priority);
    payload.append('categoryId', form.categoryId);
    if (form.attachment) {
      payload.append('attachment', form.attachment);
    }

    try {
      setSubmitting(true);
      await api.post('/tickets', payload);
      setNotification({
        type: 'success',
        message: 'Ticket created successfully'
      });
      navigate('/tickets');
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create ticket';
      setNotification({ type: 'error', message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page">
      <header className="page-header">
        <h2>New ticket</h2>
      </header>

      <form className="card form" onSubmit={handleSubmit}>
        <label htmlFor="title">
          Title
          {errors.title && <span className="field-error">{errors.title}</span>}
        </label>
        <input id="title" name="title" value={form.title} onChange={handleInput} />

        <label htmlFor="description">
          Description
          {errors.description && <span className="field-error">{errors.description}</span>}
        </label>
        <textarea
          id="description"
          name="description"
          rows={5}
          value={form.description}
          onChange={handleInput}
        />

        <label htmlFor="categoryId">
          Category
          {errors.categoryId && <span className="field-error">{errors.categoryId}</span>}
        </label>
        <select id="categoryId" name="categoryId" value={form.categoryId} onChange={handleInput}>
          <option value="">Select category</option>
          {categories.map((category) => (
            <option value={category.id} key={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <label htmlFor="priority">Priority</label>
        <select id="priority" name="priority" value={form.priority} onChange={handleInput}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <label htmlFor="attachment">Attachment (optional)</label>
        <input id="attachment" name="attachment" type="file" onChange={handleInput} />

        <button type="submit" className="primary-btn" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Create ticket'}
        </button>
      </form>
    </div>
  );
};

export default TicketCreatePage;

