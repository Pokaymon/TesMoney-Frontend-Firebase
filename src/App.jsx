import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage, ClientPage, RegisterPage, LoginPage, PocketPage, PlansPage } from './views';
import { ToastWrapper } from './services/toastConfig.jsx';
import ProtectedRoute from './components/Utils/protectedRoute.jsx';

function App() {
  return (
    <Router>
      <ToastWrapper />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={ <ProtectedRoute> <ClientPage /> </ProtectedRoute> } />
          <Route path="/home/pocket" element={ <ProtectedRoute> <PocketPage /> </ProtectedRoute> } />
          <Route path="/plans" element={ <ProtectedRoute> <PlansPage /> </ProtectedRoute>}/>
        </Routes>
    </Router>
  );
}
export default App;