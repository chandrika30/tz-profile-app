import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#2563eb", // blue-600
    },
    secondary: {
      main: "#6366f1", // indigo-500
    },
    background: {
      default: "#f3f4f6", // gray-100
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", system-ui, -sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 18,
          boxShadow:
            "0 12px 30px rgba(15, 23, 42, 0.08), 0 1px 3px rgba(15,23,42,0.08)",
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 999,
        },
      },
    },
  },
});

export default theme;
