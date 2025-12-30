import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BlogHome from './pages/UserPages/BlogHome';
import AdminLayout from './pages/AdminPages/AdminLayout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BlogHome />} />
        <Route path="/admin" element={<AdminLayout />} />
      </Routes>
    </Router>
  );
}

export default App;