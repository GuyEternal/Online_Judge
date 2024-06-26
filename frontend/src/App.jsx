import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home.jsx";
import Register from "./pages/Register/register.jsx";
import Login from "./pages/Login/login.jsx";
import ProblemSet from "./pages/ProblemSet/ProblemSet.jsx";
import Problem from "./pages/Problem/Problem.jsx";
import NotFound from "./pages/NotFound/NotFound.jsx";
import Submissions from "./pages/Submissions/Submissions.jsx";
import AddProblem from "./pages/AddProblem/AddProblem.jsx";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route index element={<Home />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/problemset" element={<ProblemSet />} />
          <Route path="/problem/:pid" element={<Problem />} />
          <Route path="/problem/add" element={<AddProblem />} />
          <Route path="/submissions/:username?" element={<Submissions />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
