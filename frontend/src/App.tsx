import Leaderboard from "./components/custom/Leaderboard";
import { useSocketConnection } from "./hooks/useSocketConnection";

function App() {
  useSocketConnection();
  return (
    <>
      <Leaderboard />
    </>
  );
}

export default App;
