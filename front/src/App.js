import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginRegistration from "./LoginRegistration/LoginRegistration";
import Home from "./Home/Home";
import Movie from "./Movie/Movie";
import PrivateRoute from "./PrivateRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginRegistration />} />

        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />

        <Route
          path="/movie/:id"
          element={
            <PrivateRoute>
              <Movie />
            </PrivateRoute>
          }
        />

        <Route
          path="/"
          element={
            localStorage.getItem("token") ? (
              <Navigate to="/home" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
