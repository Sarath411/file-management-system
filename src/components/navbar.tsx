// components/Navbar.tsx
import React, { useState } from "react";
import Link from "next/link";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
  Box,
  Stack,
  ListItemButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { UserButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";

const Navbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isLoaded, isSignedIn } = useUser();
  const role = user?.publicMetadata?.role ?? "user";
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const router = useRouter();
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawerLinks =
    role === "admin"
      ? [
          { name: "Dashboard", path: "/" },
          { name: "View Docboxes", path: "/docbox" },
          { name: "Create Docbox", path: "/adddocbox" },
          { name: "View Files", path: "/files" },
          { name: "Create File", path: "/addfiles" },
        ]
      : [
          { name: "Dashboard", path: "/" },
          { name: "Docbox", path: "/docbox" },
          { name: "Files", path: "/files" },
          { name: "Create File", path: "/addfiles" },
        ];
  const isPathSelected = (path: string): boolean => {
    return router.pathname === path;
  };

  const drawer = (
    <div>
      <List component="nav" aria-label="mailbox folders">
        {drawerLinks.map(({ name, path }) => (
          <Link key={name} href={path} passHref>
            <List>
              <Button
                onClick={handleDrawerToggle}
                sx={{
                  textTransform: "none",
                  textDecoration: "none",
                  justifyContent: "flex-start",
                  ...(isPathSelected(path)
                    ? {
                        backgroundColor: "#e0e0e0",
                        color: "primary.main",
                      }
                    : {}),
                }}
              >
                {name}
              </Button>
            </List>
          </Link>
        ))}
      </List>
      <div style={{ padding: "20px" }}>
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  );

  return (
    <AppBar position="static" color="default" elevation={0}>
      <Toolbar>
        <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
          FMS
        </Typography>
        {isMobile ? (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>
        ) : (
          <div>
            {isLoaded && user && (
              <Stack direction="row">
                {drawerLinks.map(({ name, path }) => (
                  <Link key={name} href={path} passHref>
                    <Button
                      color="inherit"
                      onClick={handleDrawerToggle}
                      sx={{
                        textTransform: "none",
                        textDecoration: "none",
                        ...(isPathSelected(path)
                          ? {
                              backgroundColor: "#e0e0e0",
                              color: "primary",
                            }
                          : {}),
                      }}
                    >
                      {name}
                    </Button>
                  </Link>
                ))}
                <UserButton afterSignOutUrl="/" />
              </Stack>
            )}
          </div>
        )}
      </Toolbar>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 240 },
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
