import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
// import EmployeeReviewPage from './EmployeeReviewPage';
import AdminData from './AdminData';
import EmployeePortal from './EmployeePortal';
import RegistrationForm from './Registration';
import LoginForm from './Login';
import ManagerPortal from './ManagerPortal';
import ManagerEmployeeReview from './ManagerEmployeeReview';
import ManagerCommentsGet from './ManagerCommentsGet';
import EmployeeMainView from './EmployeeMainView';
import EmployeeGet from './EmployeeGet';
import Preview from './Preview';
import Main from './Main';
function App() {
  return (
    <div className="App">
    <Router>
      <Routes>
        {/* <Route path='/review' element={< EmployeeReviewPage/>} /> */}
        <Route path='/admin' element={< AdminData/>} />
        <Route path='/employee' element={< EmployeePortal/>} />
        <Route path='/registration' element={< RegistrationForm/>} />
        <Route path='/loginform' element={< LoginForm/>} />
        <Route path='/mview' element={< ManagerPortal/>} />
        <Route path='/ManagerEmployeeReview/:Empid' element={< ManagerEmployeeReview/>} />
        <Route path='/ManagerCommentsGet/:Empid' element={< ManagerCommentsGet/>} />
        <Route path='/EmployeeMainView' element={< EmployeeMainView/>} />
        <Route path='/EmployeeGet/:Empid' element={< EmployeeGet/>} />
        <Route path='/Preview' element={< Preview/>} />
        <Route path='/' element={< Main/>} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;
