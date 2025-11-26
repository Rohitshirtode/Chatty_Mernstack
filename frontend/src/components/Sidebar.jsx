import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users } from "lucide-react";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import {
  Avatar,
  Box,
  Checkbox,
  FormControlLabel,
  List,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Typography,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton ,
} from "@mui/material";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading ,deleteUser} =
    useChatStore();

    const [openDelete, setOpenDelete] = useState(false);
const [userToDelete, setUserToDelete] = useState(null);

const confirmDelete = (user) => {
  setUserToDelete(user);
  setOpenDelete(true);
};


  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <Paper
      elevation={0}
      className="h-full w-20 lg:w-72 border-r flex flex-col bg-white"
      sx={{ borderColor: "#e5e7eb" }}
    >
      {/* HEADER */}
      <Box className="p-5 border-b" sx={{ borderColor: "#e5e7eb" }}>
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <Typography
            variant="subtitle1"
            className="hidden lg:block font-semibold"
          >
            Contacts
          </Typography>
        </div>

        {/* FILTER */}
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={showOnlineOnly}
                onChange={(e) => setShowOnlineOnly(e.target.checked)}
              />
            }
            label="Show online only"
          />

          <Typography variant="caption" className="text-gray-500">
            ({onlineUsers.length - 1} online)
          </Typography>
        </div>
      </Box>

      {/* USERS LIST */}
      <Box className="overflow-y-auto py-3">
        <List disablePadding>
          {filteredUsers.map((user) => {
            const isOnline = onlineUsers.includes(user._id);
            const isActive = selectedUser?._id === user._id;

            return (
              <ListItemButton
                key={user._id}
                onClick={() => setSelectedUser(user)}
                className={`
              *: px-3 rounded-md mx-2 my-1
               ${
                isActive
              ? "bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                     : "border border-transparent"
                       }
               hover:bg-gray-100 dark:hover:bg-gray-800
                `}
              >
                {/* Avatar */}
                <ListItemAvatar>
                  <Box className="relative">
                    <Avatar
                      src={user.profilePic || "/avatar.png"}
                      sx={{ width: 48, height: 48 }}
                    />

                    {isOnline && (
                      <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-white" />
                    )}
                  </Box>
                </ListItemAvatar>

                {/* User Info */}
                <ListItemText
                  primary={
                    <Typography
                      variant="subtitle2"
                      className="truncate font-semibold"
                    >
                      {user.fullName}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="caption" className="text-gray-500">
                      {isOnline ? "Online" : "Offline"}
                    </Typography>
                  }
                  className="hidden lg:block"
                />
                  <IconButton
  onClick={(e) => {
    e.stopPropagation();
    confirmDelete(user);
  }}
  size="small"
>
  <Trash2 className="text-red-500" size={18} />
</IconButton>
              </ListItemButton>
            );
          })}

          {filteredUsers.length === 0 && (
            <Typography
              variant="body2"
              className="text-center text-gray-500 py-4"
            >
              No online users
            </Typography>
          )}
         
        </List>
        
<Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
  <DialogTitle>Delete User</DialogTitle>

  <DialogContent>
    Are you sure you want to delete 
    <b> {userToDelete?.fullName}</b>?
    <br />
    You can undo this action from the toast.
  </DialogContent>

  <DialogActions>
    <Button onClick={() => setOpenDelete(false)}>Cancel</Button>

    <Button
  color="error"
  onClick={async () => {
    try {
      await deleteUser(userToDelete._id);
      toast.success("User deleted!");
    } catch (error) {
      toast.error("Failed to delete user");
    }
    setOpenDelete(false);
  }}
>
  Delete
</Button>

  </DialogActions>
</Dialog>

      </Box>
    </Paper>
  );
};

export default Sidebar;
