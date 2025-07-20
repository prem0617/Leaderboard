import { Route, Routes } from "react-router";
import Leaderboard from "./components/custom/Leaderboard";
import { useSocketConnection } from "./hooks/useSocketConnection";
import DisplayHistory from "./pages/DisplayHistory";

function App() {
  useSocketConnection();
  return (
    <Routes>
      <Route path="/" element={<Leaderboard />} />
      <Route path="/history" element={<DisplayHistory />} />
    </Routes>
  );
}

export default App;
