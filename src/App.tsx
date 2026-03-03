import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Container,
  IconButton,
} from "@mui/material";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import {
  Routes,
  Route,
  Navigate,
  useParams,
  Link as RouterLink,
} from "react-router-dom";
import TrainerProfilePage from "./pages/TrainerProfilePage";

const AppHeader: React.FC = () => (
  <AppBar
    position="sticky"
    elevation={0}
    sx={{
      backgroundColor: "rgba(15,23,42,0.95)",
      backdropFilter: "blur(10px)",
    }}
  >
    <Toolbar
      sx={{ minHeight: 64, display: "flex", justifyContent: "space-between" }}
    >
      <Box
        component={RouterLink}
        to="/"
        sx={{
          display: "flex",
          alignItems: "center",
          textDecoration: "none",
          color: "inherit",
        }}
      >
        <IconButton edge="start" color="inherit" sx={{ mr: 1 }}>
          <FitnessCenterIcon />
        </IconButton>
        <Typography variant="h6" fontWeight={700}>
          TrainZilla Profiles
        </Typography>
      </Box>
      <Typography variant="body2" color="grey.300">
        Trusted trainers. Real results.
      </Typography>
    </Toolbar>
  </AppBar>
);

const LandingPlaceholder: React.FC = () => {
  // Simple landing that asks for a trainerId in URL
  return (
    <Container sx={{ py: 10 }}>
      <Typography variant="h4" gutterBottom fontWeight={700}>
        Trainer Profiles
      </Typography>
      <Typography variant="body1" color="text.secondary" maxWidth={480}>
        Use a link like <strong>/&lt;trainerId&gt;</strong> to share a public,
        professional profile page with clients. This page is usually opened from
        invite links, marketing pages, or your main app.
      </Typography>
    </Container>
  );
};

const TrainerProfileRouteWrapper: React.FC = () => {
const { trainerSlug } = useParams<{ trainerSlug: string }>();
  if (!trainerSlug) return <LandingPlaceholder />;
  return <TrainerProfilePage />;
};

const App: React.FC = () => {
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <AppHeader />
      <Box sx={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<LandingPlaceholder />} />
          <Route path="/:trainerSlug" element={<TrainerProfileRouteWrapper />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default App;
