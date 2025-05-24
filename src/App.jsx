import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Message from './Message';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Message />}/>
      </Routes>
    </Router>
  );
}

export default App;