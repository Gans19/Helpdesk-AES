import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import DashboardPage from './pages/Dashboard';
import TicketsListPage from './pages/TicketsList';
import TicketCreatePage from './pages/TicketCreate';
import TicketDetailPage from './pages/TicketDetail';
import CategoriesPage from './pages/Categories';
import NotFoundPage from './pages/NotFound';

const App = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />

    <Route element={<Layout />}>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tickets"
        element={
          <ProtectedRoute>
            <TicketsListPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tickets/new"
        element={
          <ProtectedRoute roles={['user', 'support', 'admin']}>
            <TicketCreatePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tickets/:id"
        element={
          <ProtectedRoute>
            <TicketDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/categories"
        element={
          <ProtectedRoute roles={['admin']}>
            <CategoriesPage />
          </ProtectedRoute>
        }
      />
    </Route>

    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);

export default App;

