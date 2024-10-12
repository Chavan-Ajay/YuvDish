import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Navbar from './components/shared/Navbar'

import Home from './components/Home'
import Jobs from './components/Jobs'
import Browse from './components/Browse'
import Profile from './components/Profile'
import JobDescription from './components/JobDescription'
import Companies from './components/admin/Companies'
import CompanyCreate from './components/admin/CompanyCreate'
import CompanySetup from './components/admin/CompanySetup'
import AdminJobs from "./components/admin/AdminJobs";
import PostJob from './components/admin/PostJob'
import Applicants from './components/admin/Applicants'
import ProtectedRoute from './components/admin/ProtectedRoute'
import JobSeekerLogin from './components/auth/jobSeeker/JobSeekerLogin'
import JobSeekerSignup from './components/auth/jobSeeker/JobSeekerSignup'
import RecruiterLogin from './components/auth/recruiter/RecruiterLogin'
import RecruiterSignup from './components/auth/recruiter/RecruiterSignup'
import AuthLogin from './components/auth/AuthLogin'
import AuthSignup from './components/auth/AuthSignup'


const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/login',
    element: <AuthLogin/>
  },
  {
    path: '/signup',
    element: <AuthSignup/>
  },
  {
    path: "/jobs",
    element: <Jobs />
  },
  {
    path: "/description/:id",
    element: <JobDescription />
  },
  {
    path: "/browse",
    element: <Browse />
  },
  {
    path: "/profile",
    element: <Profile />
  },
// --------------------------
  {
    path: "/jobSeeker/signup",
    element: <JobSeekerSignup/>
  },
  {
    path: "/jobSeeker/login",
    element: <JobSeekerLogin/>
  },
  {
    path: "/recruiter/login",
    element: <RecruiterLogin/>
  },
  {
    path: "/recruiter/signup",
    element: <RecruiterSignup/>
  },
  









  // admin ke liye yha se start hoga
  {
    path:"/admin/companies",
    element: <ProtectedRoute><Companies/></ProtectedRoute>
  },
  {
    path:"/admin/companies/create",
    element: <ProtectedRoute><CompanyCreate/></ProtectedRoute> 
  },
  {
    path:"/admin/companies/:id",
    element:<ProtectedRoute><CompanySetup/></ProtectedRoute> 
  },
  {
    path:"/admin/jobs",
    element:<ProtectedRoute><AdminJobs/></ProtectedRoute> 
  },
  {
    path:"/admin/jobs/create",
    element:<ProtectedRoute><PostJob/></ProtectedRoute> 
  },
  {
    path:"/admin/jobs/applicants/:id",
    element:<ProtectedRoute><Applicants/></ProtectedRoute> 
  },

])
function App() {

  return (
    <div>
      <RouterProvider router={appRouter} />
    </div>
  )
}

export default App
