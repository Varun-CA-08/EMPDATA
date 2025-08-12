import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import EmployeeNotifications from './components/EmployeeNotifications.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <EmployeeNotifications/> */}
    <App />
  </StrictMode>,
)
