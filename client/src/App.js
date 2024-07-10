
import { BrowserRouter, Routes,Route } from 'react-router-dom';
import './App.css';
import Nav from "./Components/Nav";
import Add from "./Pages/Add";
import Records from "./Pages/Records"
import Home from "./Pages/Home"
import New from "./Pages/New"
import Entity from "./Pages/Entity"
import Update from './Pages/Update'
import Replace from './Pages/Replace'
function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Nav/>
      <Routes>
      <Route exact path="/" element={<Home />}></Route>
          <Route path="/Add" element={<Add/>}></Route>
          <Route path="/Records" element={<Records />}></Route>
          <Route path="/Entity" element={<Entity/>}></Route>
          <Route path="/New" element={<New />}></Route>
          <Route path="/update/:id" element={<Update/>} />
          <Route path="/replace" element={<Replace/>}></Route>
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
