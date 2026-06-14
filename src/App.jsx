import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/landingpage';
import LoginPage from './pages/LoginPage';
import { Provider } from 'react-redux';
import store from './store/appStore';
import Body from './pages/Body';
import { Navigate } from 'react-router-dom';
import Meetings from "./pages/Meetings";
import PublicRoute from './components/PublicRoute';
import MeetingRoom from "./pages/MeetingRoom";
import MeetingProtectedRoute from './components/MeetingProtectedRoute';

function App() {
  return(
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<PublicRoute><LoginPage/></PublicRoute>} />

           {/* Meeting Link Route */}
          <Route path="/meetings/:meetingId" element={<MeetingProtectedRoute><MeetingRoom /></MeetingProtectedRoute>}/>

          <Route element={<Body />}>
            <Route path="/home" element={<Navigate to="/home/meetings" />} />
            <Route path="/home/meetings" element={<Meetings />} />
            {/* <Route path="/home/schedule" element={<ScheduleMeeting />} />
            <Route path="/home/whiteboard" element={<Whiteboard />} />
            <Route path="/home/summary" element={<AISummary />} />
            <Route path="/home/notes" element={<MeetingNotes />} />
            <Route path="/home/assistant" element={<AIAssistant />} />
            <Route path="/home/recordings" element={<Recordings />} />
            <Route path="/home/workspace" element={<Workspace />} />
            <Route path="/home/settings" element={<Settings />} /> */}
          </Route>
        </Routes>
      </BrowserRouter>
  </Provider>
  )
}

export default App
