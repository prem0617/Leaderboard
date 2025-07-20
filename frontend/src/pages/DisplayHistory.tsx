import {
  HistoryIcon,
  Clock,
  TrendingUp,
  User,
  Award,
  Calendar,
  ArrowLeftIcon,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { useEffect, useState } from "react";
import axios from "axios";
import { baseURL } from "../config";
import Loading from "../components/custom/Loading";
import { Link } from "react-router";

interface HistoryItem {
  _id: string;
  claimedAt: string;
  createdAt: string;
  pointsClaimed: number;
  updatedAt: string;
  userId: {
    name: string;
    _id: string;
  } | null;
  __v: number;
}

interface HistoryResponse {
  data: HistoryItem[];
  message: string;
  success: boolean;
}

const DisplayHistory = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [error, setError] = useState<string | null>(null);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get<HistoryResponse>(`${baseURL}/history`);
      console.log(response);

      if (response.data.success) {
        // Sort history by claimedAt in descending order (most recent first)
        const sortedHistory = response.data.data.sort(
          (a, b) =>
            new Date(b.claimedAt).getTime() - new Date(a.claimedAt).getTime()
        );
        setHistory(sortedHistory);
      } else {
        setError("Failed to fetch history");
      }
    } catch (error) {
      console.log(error);
      setError("Error fetching history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const claimedDate = new Date(dateString);
    const diffInSeconds = Math.floor(
      (now.getTime() - claimedDate.getTime()) / 1000
    );

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <div className="mt-6 w-full max-w-6xl mx-auto space-y-6">
      {/* History Header */}
      <Link to={"/"}>
        <div className="flex gap-3 text-blue-500">
          <ArrowLeftIcon /> Back
        </div>
      </Link>
      <div className="text-center">
        <div className="inline-flex items-center gap-3 mb-4 px-6 py-3 bg-white rounded-full shadow-sm border border-slate-200">
          <Clock className="w-6 h-6 text-emerald-500" />
          <h2 className="text-2xl font-bold text-slate-800">Points History</h2>
          <Clock className="w-6 h-6 text-emerald-500" />
        </div>

        <p className="text-slate-600 text-lg">
          Complete history of all point claims
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12">
          <Loading />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <HistoryIcon className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">
              Something went wrong
            </h3>
            <p className="text-red-500 mb-6">{error}</p>
            <Button
              onClick={fetchHistory}
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors duration-200"
            >
              Try Again
            </Button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && history.length === 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <HistoryIcon className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">
              No History Found
            </h3>
            <p className="text-slate-600">
              No point claims have been made yet!
            </p>
          </div>
        </div>
      )}

      {/* History Stats */}
      {!loading && !error && history.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-emerald-50 rounded-2xl border border-emerald-200 p-6 text-center">
            <Award className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-emerald-800">
              {history.length}
            </div>
            <div className="text-sm text-emerald-600 font-medium">
              Total Claims
            </div>
          </div>

          <div className="bg-amber-50 rounded-2xl border border-amber-200 p-6 text-center">
            <TrendingUp className="w-8 h-8 text-amber-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-amber-800">
              {history
                .reduce((sum, item) => sum + item.pointsClaimed, 0)
                .toLocaleString()}
            </div>
            <div className="text-sm text-amber-600 font-medium">
              Total Points
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 text-center">
            <User className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-slate-800">
              {
                new Set(
                  history
                    .filter((item) => item.userId)
                    .map((item) => item.userId!._id)
                ).size
              }
            </div>
            <div className="text-sm text-slate-600 font-medium">
              Active Users
            </div>
          </div>
        </div>
      )}

      {/* History List */}
      {!loading && !error && history.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-800 p-6">
            <h3 className="text-white text-xl font-bold text-center">
              Recent Activity
            </h3>
          </div>

          <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
            {history.map((item) => (
              <div
                key={item._id}
                className="p-6 hover:bg-slate-50 transition-colors duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                        <Award className="w-5 h-5 text-emerald-600" />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-lg font-semibold text-slate-800">
                          {item.userId ? item.userId.name : "Unknown User"}
                        </h4>
                        {!item.userId && (
                          <span className="px-2 py-1 text-xs bg-red-100 text-red-600 rounded-full font-medium">
                            Deleted User
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(item.claimedAt)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatTime(item.claimedAt)}
                        </div>
                        <span className="text-emerald-600 font-medium">
                          {getTimeAgo(item.claimedAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-bold text-emerald-600">
                      +{item.pointsClaimed}
                    </div>
                    <div className="text-sm text-slate-500">points</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Refresh Button */}
          <div className="p-6 bg-slate-50 border-t border-slate-200">
            <div className="flex justify-center">
              <Button
                onClick={fetchHistory}
                disabled={loading}
                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-colors duration-200 flex items-center gap-2"
              >
                <TrendingUp className="w-4 h-4" />
                {loading ? "Refreshing..." : "Refresh History"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisplayHistory;
