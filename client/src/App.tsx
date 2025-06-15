import { BrowserRouter, Routes, Route } from "react-router-dom";
import ChattingWindow from "./pages/ChattingWindow";
import { Join } from "./pages/Join";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Join />} />
          <Route path="/rooms" element={<ChattingWindow />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
