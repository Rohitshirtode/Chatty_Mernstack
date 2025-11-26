import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, MessageSquare, Settings, User } from "lucide-react";

import { AppBar, Toolbar, Button, IconButton, Box, Typography, Paper } from "@mui/material";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent, //logout button 
  DialogActions,

} from "@mui/material";
const Navbar = () => {
  const { logout, authUser } = useAuthStore();
const navigate = useNavigate();
const { pathname } = useLocation();
const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

const handleOpenLogout = () => setOpenLogoutDialog(true);
const handleCloseLogout = () => setOpenLogoutDialog(false);

const handleConfirmLogout = () => {
  logout();       // your logout function
  handleCloseLogout();
};

  return (
    <AppBar
      position="fixed"
    
  elevation={0}
  sx={{
    backgroundImage: "linear-gradient(135deg, #6a11cb 70%, #2575fc 100%)",
    backgroundColor: "transparent !important",
    boxShadow: "none",
    borderBottom: "1px solid #e5e7eb",
  }}
  className="backdrop-blur-lg"
>
      {/* <Toolbar className="container mx-auto px-4 flex justify-between"> */}
      <Toolbar className="container mx-auto px-4" sx={{ display: "flex", justifyContent: "space-between" }}>
      
       <Dialog open={openLogoutDialog} onClose={handleCloseLogout}>
  <DialogTitle>Confirm Logout</DialogTitle>

  <DialogContent>
    Are you sure you want to logout?
  </DialogContent>

  <DialogActions>
    <Button onClick={handleCloseLogout} color="primary">
      Cancel
    </Button>

    <Button onClick={handleConfirmLogout} color="error" variant="contained">
      Logout
    </Button>
  </DialogActions>
</Dialog>




<div className="flex items-center gap-2.5">

{pathname !== "/" && (
  <IconButton
    onClick={() => navigate(-1)}
    className="mr-2"
    sx={{
      color: "#374151",
      padding: "6px",
    }}
  >
    <ArrowLeft className="w-5 h-5" />
  </IconButton>
)}

        {/* LEFT LOGO */}
        <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
          <Paper
            elevation={2}
            className="size-9 rounded-lg flex items-center justify-center"
            sx={{ backgroundColor: "rgba(59,130,246,0.1)" }} // primary/10
          >
            <MessageSquare className="w-5 h-5 text-black-600" />
          </Paper>

          <Typography variant="h6" className="font-bold">
            Chatty
          </Typography>
        </Link>
</div>
        {/* RIGHT BUTTONS */}
        <Box className="flex items-center gap-2">

          {/* Settings */}
          <Button
            component={Link}
            to="/settings"
            size="small"
            variant="outlined"
            startIcon={<Settings className="w-4 h-4" />}
            className="hidden sm:flex"
            sx={{
              textTransform: "none",
              borderColor: "#d1d5db",
              color: "#000000",
            }}
          >
            Settings
          </Button>

          {authUser && (
            <>
              {/* Profile */}
              <Button
                component={Link}
                to="/profile"
                size="small"
                variant="outlined"
                startIcon={<User className="w-4 h-4" />}
                className="hidden sm:flex"
                sx={{
                  textTransform: "none",
                  borderColor: "#d1d5db",
                  color: "#000000",
                }}
              >
                Profile
              </Button>

              {/* Logout */}
              <Button
                size="small"
                onClick={handleOpenLogout}
                startIcon={<LogOut className="w-4 h-4" />}
                sx={{
                  textTransform: "none",
                  color: "#000000",
                }}
              >
                <span className="show sm:inline">Logout</span>
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
