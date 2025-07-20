import { baseURL } from "../../config";
import axios from "axios";
import { Gift, Plus, RefreshCw } from "lucide-react";
import { useState } from "react";
import type { User } from "./Leaderboard";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import { Button } from "../ui/button";
import toast from "react-hot-toast";

interface ClaimPointProps {
  users: User[];
}

const ClaimPoints = ({ users }: ClaimPointProps) => {
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [claimLoading, setClaimLoading] = useState<boolean>(false);
  const claimPoints = async (): Promise<void> => {
    if (!selectedUserId) return;

    try {
      setClaimLoading(true);

      // const response =
      await axios.post(`${baseURL}/user/claimPoint`, {
        userId: selectedUserId,
      });
      // console.log(response);
      toast.success("Point added successfully");
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setSelectedUserId("");
      setClaimLoading(false);
    }
  };
  return (
    <>
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="p-2 bg-indigo-50 rounded-lg">
            <Gift className="w-6 h-6 text-indigo-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Claim Points</h2>
        </div>
        <p className="text-slate-600">
          Select a user and claim random points (1-10)
        </p>
      </div>

      <div className="max-w-md mx-auto">
        <div className="flex justify-center items-center gap-3">
          <div className="flex-1">
            <Select
              value={selectedUserId}
              onValueChange={(value) => setSelectedUserId(value)}
            >
              <SelectTrigger className="w-full h-12">
                <SelectValue placeholder="Select a user..." />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user._id} value={user._id}>
                    {user.name} ({user.totalPoints.toLocaleString()} pts)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            size={"sm"}
            onClick={claimPoints}
            disabled={!selectedUserId || claimLoading}
            className="py-2 px-6 bg-emerald-600 hover:bg-emerald-700 disabled:cursor-not-allowed text-white font-medium transition-colors duration-200 flex items-center gap-2"
          >
            {claimLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Claiming...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Claim
              </>
            )}
          </Button>
        </div>
      </div>
    </>
  );
};

export default ClaimPoints;
