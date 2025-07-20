import React, { useState, useEffect } from "react";
import {
  Trophy,
  Medal,
  Award,
  Crown,
  Star,
  TrendingUp,
  HistoryIcon,
} from "lucide-react";
import axios from "axios";
import { baseURL } from "../../config";
import ClaimPoints from "./ClaimPoints";
import Loading from "./Loading";
import AddNewUser from "./AddNewUser";
import { useSocketConnection } from "../../hooks/useSocketConnection";
import { Link } from "react-router";
import { Button } from "../ui/button";

export interface User {
  _id: string;
  name: string;
  totalPoints: number;
}

interface ApiResponse {
  users: User[];
  message: string;
  success: boolean;
}

const Leaderboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { socket } = useSocketConnection();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async (): Promise<void> => {
    try {
      setLoading(true);

      const response = await axios.get<ApiResponse>(`${baseURL}/user`);
      const data = response.data;

      if (data.success) {
        setUsers(data.users);
      } else {
        setError("Failed to fetch users");
      }
    } catch (err) {
      setError("Error fetching users");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-amber-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-slate-400" />;
      case 3:
        return <Award className="w-6 h-6 text-orange-400" />;
      default:
        return (
          <div className="w-8 h-8 flex items-center justify-center bg-slate-100 rounded-full text-slate-600 font-semibold text-sm">
            {rank}
          </div>
        );
    }
  };

  useEffect(() => {
    if (!socket) return;

    function handleUser(data: any) {
      setUsers((prev) => {
        const newUsers = [...prev, data];
        // Sort by totalPoints in descending order
        return newUsers.sort((a, b) => b.totalPoints - a.totalPoints);
      });
    }

    function handlePoints(user: User) {
      const id = user._id;
      setUsers((prev) => {
        // Update the specific user
        const updatedUsers = prev.map((p) => (p._id === id ? user : p));
        // Sort by totalPoints in descending order after update
        return updatedUsers.sort((a, b) => b.totalPoints - a.totalPoints);
      });
      console.log(id);
    }

    socket.on("newUser", handleUser);
    socket.on("pointUpdate", handlePoints);

    // Cleanup function
    return () => {
      socket.off("newUser", handleUser);
      socket.off("pointUpdate", handlePoints);
    };
  }, [socket]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">
                Something went wrong
              </h3>
              <p className="text-red-500 mb-6">{error}</p>
              <button
                onClick={fetchUsers}
                className="px-6 py-3 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition-colors duration-200 font-medium"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">
                No Users Found
              </h3>
              <p className="text-slate-600">
                Add some users to see the leaderboard!
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center">
          <div className="inline-flex items-center gap-3 mb-4 px-6 py-3 bg-white rounded-full shadow-sm border border-slate-200">
            <Trophy className="w-6 h-6 text-amber-500" />
            <h1 className="text-2xl font-bold text-slate-800">Leaderboard</h1>
            <Trophy className="w-6 h-6 text-amber-500" />
          </div>
          <p className="text-slate-600 text-lg">
            Top performers ranked by total points
          </p>
        </div>

        {/* Claim Points Section */}
        <div className="bg-white rounded-2xl flex flex-col justify-center items-center shadow-sm border border-slate-200 p-8">
          <ClaimPoints users={users} />

          <div className="flex justify-center gap-4">
            <AddNewUser />
            <Link to={"history"}>
              <Button className="cursor-pointer mt-6 py-2 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-colors duration-200 flex items-center justify-center gap-2">
                <HistoryIcon className="w-4 h-4" />
                History
              </Button>
            </Link>
          </div>
        </div>

        {/* Top 3 Podium */}
        {users.length >= 3 && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <div className="text-center mb-8">
              <h2 className="text-xl font-bold text-slate-800 mb-2">
                Top 3 Champions
              </h2>
              <div className="flex items-center justify-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-600 font-medium">
                  Live Rankings
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {users.slice(0, 3).map((user, index) => {
                const rank = index + 1;
                const isFirst = rank === 1;
                const isSecond = rank === 2;

                return (
                  <div
                    key={user._id}
                    className={`relative ${
                      isFirst
                        ? "md:order-2"
                        : isSecond
                        ? "md:order-1"
                        : "md:order-3"
                    }`}
                  >
                    <div
                      className={`p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg ${
                        isFirst
                          ? "bg-amber-50 border-amber-200"
                          : isSecond
                          ? "bg-slate-50 border-slate-200"
                          : "bg-orange-50 border-orange-200"
                      }`}
                    >
                      {isFirst && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <div className="bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                            CHAMPION
                          </div>
                        </div>
                      )}

                      <div className="text-center">
                        <div className="flex justify-center mb-4">
                          {getRankIcon(rank)}
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-2">
                          {user.name}
                        </h3>
                        <div className="text-3xl font-bold text-slate-800 mb-2">
                          {user.totalPoints.toLocaleString()}
                        </div>
                        <div className="text-sm text-slate-500 font-medium">
                          points
                        </div>

                        {isFirst && (
                          <div className="flex items-center justify-center mt-4 gap-1">
                            <Star className="w-4 h-4 text-amber-500 fill-current" />
                            <Star className="w-4 h-4 text-amber-500 fill-current" />
                            <Star className="w-4 h-4 text-amber-500 fill-current" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Complete Rankings */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-800 p-6">
            <h2 className="text-white text-xl font-bold text-center">
              Complete Rankings
            </h2>
          </div>

          <div className="divide-y divide-slate-100">
            {users.slice(3).map((user, index) => {
              const rank = index + 4;
              const isTopThree = rank <= 3;

              return (
                <div
                  key={user._id}
                  className={`p-6 transition-colors duration-200 ${
                    isTopThree
                      ? rank === 1
                        ? "bg-amber-50 hover:bg-amber-100"
                        : rank === 2
                        ? "bg-slate-50 hover:bg-slate-100"
                        : "bg-orange-50 hover:bg-orange-100"
                      : "hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">{getRankIcon(rank)}</div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-800">
                          {user.name}
                        </h3>
                        <p className="text-sm text-slate-500">Rank #{rank}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-bold text-slate-800">
                        {user.totalPoints.toLocaleString()}
                      </div>
                      <div className="text-sm text-slate-500">points</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
