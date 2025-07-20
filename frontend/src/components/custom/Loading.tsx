import { RefreshCw } from "lucide-react";

const Loading = () => {
  return (
    <div className="min-h-screen flex justify-center items-center p-6">
      <div className="bg-white">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-slate-400 mx-auto mb-4" />
          <p className="text-slate-600 text-lg">Loading leaderboard...</p>
        </div>
      </div>
    </div>
  );
};

export default Loading;
