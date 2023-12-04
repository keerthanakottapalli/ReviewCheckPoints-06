import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import EmployeeReviewPage from './EmployeeReviewPage';
function App() {
  return (
    <div className="App">
    <Router>
      <Routes>
        <Route path='/review' element={< EmployeeReviewPage/>} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;
