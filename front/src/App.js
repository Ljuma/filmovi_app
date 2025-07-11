import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginRegistration from "./LoginRegistration/LoginRegistration";
import Home from "./Home/Home";
import Movie from "./Movie/Movie";
import Movies from "./Movies/Movies";
import UserProfile from "./UserProfile/UserProfile";
import List from "./List/List";
import AddEditMovie from "./AddEditMovie/AddEditMovie";
import PrivateRoute from "./PrivateRoute";
import AdminPrivateRoute from "./AdminPrivateRoute";

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
          path="/editmovie/:id"
          element={
            <AdminPrivateRoute>
              <AddEditMovie />
            </AdminPrivateRoute>
          }
        />

        <Route
          path="/addmovie"
          element={
            <AdminPrivateRoute>
              <AddEditMovie />
            </AdminPrivateRoute>
          }
        />

        <Route
          path="/user/:id"
          element={
            <PrivateRoute>
              <UserProfile />
            </PrivateRoute>
          }
        />

        <Route
          path="/list/:id"
          element={
            <PrivateRoute>
              <List />
            </PrivateRoute>
          }
        />

        <Route
          path="/movies"
          element={
            <PrivateRoute>
              <Movies />
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
