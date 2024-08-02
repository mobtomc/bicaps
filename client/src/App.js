import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Nav from "./Components/Nav";
import Add from "./Pages/Add";
import Records from "./Pages/Records";
import Home from "./Pages/Home";
import New from "./Pages/New";
import Entity from "./Pages/Entity";
import Update from './Pages/Update';
import Replace from './Pages/Replace';
import ProjectType from './Pages/ProjectType';
import AddProject from './Pages/AddProject';
import Timesheet from './Pages/Timesheet';
import Overview from './Pages/Overview';
import  Cost from './Pages/Cost'
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
} from "@clerk/clerk-react";

// Check for the publishable key
if (!process.env.REACT_APP_CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <SignedIn>
        <div className="App">
        
          <BrowserRouter>
            <Nav />
            <Routes>
              <Route exact path="/" element={<Home />} />
              <Route path="/Add" element={<Add />} />
              <Route path="/Records" element={<Records />} />
              <Route path="/Entity" element={<Entity />} />
              <Route path="/New" element={<New />} />
              <Route path="/update/:id" element={<Update />} />
              <Route path="/replace" element={<Replace />} />
              <Route path="/projecttype" element={<ProjectType />} />
              <Route path="/addproject" element={<AddProject />} />
              <Route path="/timesheet" element={<Timesheet/>} />
              <Route path="/overview" element={<Overview/>} />
              <Route path="/costs" element={<Cost/>} />
            </Routes>
          </BrowserRouter>
          
        </div>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </ClerkProvider>
  );
}

export default App;

