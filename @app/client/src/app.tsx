import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import EmployeeDetails from './employee-details';
import Home from './home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/employee/:id" element={<EmployeeDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
