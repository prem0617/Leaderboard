import { baseURL } from "../../config";
import axios from "axios";
import { UserPlus, RefreshCw } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import toast from "react-hot-toast";

const AddNewUser = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleAddUser = async (): Promise<void> => {
    if (!userName.trim()) return;

    try {
      setIsLoading(true);

      await axios.post(`${baseURL}/user`, {
        name: userName.trim(),
      });

      setUserName("");
      setIsOpen(false);
      toast.success("User added");
    } catch (err) {
      console.error("Error adding user:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setUserName("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="mt-6 py-2 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-colors duration-200 flex items-center justify-center gap-2">
          <UserPlus className="w-4 h-4" />
          Add New User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <UserPlus className="w-5 h-5 text-emerald-600" />
            </div>
            Add New User
          </DialogTitle>
          <DialogDescription>
            Enter the name of the new user to add to the leaderboard.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label
              htmlFor="userName"
              className="text-sm font-medium text-slate-700"
            >
              User Name
            </Label>
            <Input
              id="userName"
              type="text"
              placeholder="Enter user name..."
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddUser();
                }
              }}
              className="h-11"
              disabled={isLoading}
            />
          </div>
        </div>
        <DialogFooter className="gap-3">
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleAddUser}
            disabled={!userName.trim() || isLoading}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4 mr-2" />
                Add User
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewUser;
