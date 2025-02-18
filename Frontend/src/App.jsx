import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import BoardDetail from "./component/Board/BoardDetail";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/*" element={<Home />} />  {/* All routing inside Home */}
        <Route path="/boards/:boardId" element={<BoardDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
