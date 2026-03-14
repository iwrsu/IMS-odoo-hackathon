import React from "react";
import {
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Grid,
  Card,
  CardContent,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Stack
} from "@mui/material";

import HomeIcon from "@mui/icons-material/Home";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import BarChartIcon from "@mui/icons-material/BarChart";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import PersonIcon from "@mui/icons-material/Person";
import StorageIcon from "@mui/icons-material/Storage";
import InsightsIcon from "@mui/icons-material/Insights";

export default function App() {
  const [nav, setNav] = React.useState(0);

  const features = [
    {
      icon: <StorageIcon sx={{ fontSize: 40 }} />,
      title: "Smart Inventory",
      text: "Manage products and stock levels with real-time updates."
    },
    {
      icon: <InsightsIcon sx={{ fontSize: 40 }} />,
      title: "Analytics Dashboard",
      text: "Powerful visual reports to monitor inventory trends."
    },
    {
      icon: <NotificationsActiveIcon sx={{ fontSize: 40 }} />,
      title: "Auto Alerts",
      text: "Get instant alerts when stock levels run low."
    }
  ];

  return (
    <>
      <CssBaseline />

      {/* BACKGROUND GRADIENT */}
      <Box
        sx={{
          position: "fixed",
          width: "100%",
          height: "100%",
          zIndex: -1,
          background:
            "radial-gradient(circle at 20% 30%, #6a11cb 0%, transparent 40%), radial-gradient(circle at 80% 70%, #2575fc 0%, transparent 40%), #0f172a"
        }}
      />

      {/* NAVBAR */}
      <AppBar
        position="sticky"
        sx={{
          backdropFilter: "blur(10px)",
          background: "rgba(255,255,255,0.05)"
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" fontWeight="bold">
            StockFlow
          </Typography>

          <Stack direction="row" spacing={2} sx={{ display: { xs: "none", md: "flex" } }}>
            <Button color="inherit">Features</Button>
            <Button color="inherit">Pricing</Button>
            <Button color="inherit">Docs</Button>
            <Button variant="contained">Login</Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg">

        {/* HERO */}
        <Box sx={{ py: 12, textAlign: "center", color: "white" }}>
          <Typography
            variant="h2"
            fontWeight="bold"
            sx={{
              background: "linear-gradient(90deg,#fff,#cbd5ff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}
          >
            Next-Gen Inventory Management
          </Typography>

          <Typography
            sx={{
              mt: 3,
              color: "rgba(255,255,255,0.8)",
              maxWidth: 600,
              mx: "auto"
            }}
          >
            Track products, monitor stock, and automate your inventory
            workflow with a powerful modern dashboard.
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="center"
            sx={{ mt: 5 }}
          >
            <Button size="large" variant="contained">
              Start Free
            </Button>

            <Button
              size="large"
              variant="outlined"
              sx={{ color: "white", borderColor: "white" }}
            >
              Live Demo
            </Button>
          </Stack>

          {/* DASHBOARD MOCK */}
          <Box
            sx={{
              mt: 8,
              height: 320,
              borderRadius: 4,
              backdropFilter: "blur(20px)",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 20px 80px rgba(0,0,0,0.5)"
            }}
          />
        </Box>

        {/* FEATURES */}
        <Grid container spacing={4} sx={{ pb: 10 }}>
          {features.map((f, i) => (
            <Grid item xs={12} md={4} key={i}>
              <Card
                sx={{
                  textAlign: "center",
                  p: 4,
                  borderRadius: 4,
                  backdropFilter: "blur(20px)",
                  background: "rgba(255,255,255,0.05)",
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.1)",
                  transition: "0.3s",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 10px 40px rgba(0,0,0,0.6)"
                  }
                }}
              >
                <CardContent>
                  {f.icon}

                  <Typography variant="h6" sx={{ mt: 2 }}>
                    {f.title}
                  </Typography>

                  <Typography sx={{ mt: 1, opacity: 0.8 }}>
                    {f.text}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* CTA */}
        <Box
          sx={{
            textAlign: "center",
            pb: 12,
            color: "white"
          }}
        >
          <Typography variant="h4" fontWeight="bold">
            Start Managing Inventory Smarter
          </Typography>

          <Typography sx={{ mt: 2, opacity: 0.8 }}>
            Built for startups, warehouses, and growing businesses.
          </Typography>

          <Button
            size="large"
            variant="contained"
            sx={{ mt: 4 }}
          >
            Create Free Account
          </Button>
        </Box>
      </Container>

      {/* FOOTER */}
      <Box
        sx={{
          textAlign: "center",
          py: 4,
          color: "white",
          borderTop: "1px solid rgba(255,255,255,0.1)"
        }}
      >
        <Typography variant="body2">
          © 2026 StockFlow • Smart Inventory Platform
        </Typography>
      </Box>

      {/* MOBILE NAVIGATION */}
      <Paper
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          display: { xs: "block", md: "none" },
          background: "#0f172a"
        }}
      >
        <BottomNavigation
          value={nav}
          onChange={(e, v) => setNav(v)}
          showLabels
        >
          <BottomNavigationAction label="Home" icon={<HomeIcon />} />
          <BottomNavigationAction label="Inventory" icon={<Inventory2Icon />} />
          <BottomNavigationAction label="Analytics" icon={<BarChartIcon />} />
          <BottomNavigationAction label="Account" icon={<PersonIcon />} />
        </BottomNavigation>
      </Paper>
    </>
  );
}