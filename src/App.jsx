import { BrowserRouter as Router, Routes, Route } from "react-router";

import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Protected from "./components/Protected";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        
        <Route element={<Protected />}>
          <Route path='/app' element={<Dashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App