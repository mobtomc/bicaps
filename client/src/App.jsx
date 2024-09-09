import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
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
import Cost from './Pages/Cost';
import Live from './Pages/Live';
import Unauthorized from './Pages/Unauthorized';
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
  useUser,
} from "@clerk/clerk-react";

// Check for the publishable key
if (!process.env.REACT_APP_CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

function MainApp() {
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      logAttendance(user);
    }
  }, [user]);

  const logAttendance = async (user) => {
    try {
      const userName = user.firstName + ' ' + user.lastName; 
      await axios.post('https://bicaps.onrender.com/api/attendance-log', {
        userId: user.id,
        userName: userName,
        email: user.emailAddresses[0].emailAddress,
      });
    } catch (error) {
      console.error('Failed to log attendance:', error);
      console.log('Routes are being used at /api');
    }
  };

  return (
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
          <Route path="/timesheet" element={<Timesheet />} />
          <Route path="/overview" element={<Overview />} />
          <Route path="/costs" element={<Cost />} />
          <Route path="/live" element={<Live />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <SignedIn>
        <MainApp />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </ClerkProvider>
  );
}

export default App;

