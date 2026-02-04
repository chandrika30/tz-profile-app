import React, { useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
  TextField,
  Alert,
  Divider,
  IconButton,
  Link as MUILink,
} from "@mui/material";
import LinkIcon from "@mui/icons-material/Link";
import InstagramIcon from "@mui/icons-material/Instagram";
import LanguageIcon from "@mui/icons-material/Language";
import ScheduleIcon from "@mui/icons-material/Schedule";
import PlaceIcon from "@mui/icons-material/Place";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useParams } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";

import { API_BASE_URL } from "../api";
import { Trainer } from "../models/trainer";
import { User } from "../models/user";
import { SubscriptionPlan } from "../models/subscriptionPlan";
import { GoalType, Weekday, WorkoutTimePreference } from "../enums";

interface TrainerProfileResponse {
  msg: string;
  data: {
    trainerDetails: Trainer;
    userDetails: User;
    subscriptionPlans: SubscriptionPlan[];
  };
}

interface InvitationFormValues {
  email: string;
}

const RECAPTCHA_SITE_KEY =
  import.meta.env.VITE_RECAPTCHA_SITE_KEY ??
  "6LdnIxIsAAAAAE2uHK-wvx_pmjNrm-ZxAbAc1VV8";

// ── helpers ─────────────────────────────────────────────────────────────

const formatCurrency = (amount: number, currency: string) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);

const humanize = (val: string) =>
  val
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase()
    .replace(/^\w|\s\w/g, (c) => c.toUpperCase());

const formatTimePreference = (pref: WorkoutTimePreference | string) => {
  const p = String(pref).toLowerCase();
  switch (p) {
    case "morning":
      return "Morning sessions";
    case "afternoon":
      return "Afternoon sessions";
    case "evening":
      return "Evening sessions";
    case "flexible":
      return "Flexible timing";
    default:
      return humanize(p);
  }
};

const weekdayLabel = (day: Weekday | string) => {
  const d = String(day).toLowerCase();
  switch (d) {
    case "monday":
      return "Mon";
    case "tuesday":
      return "Tue";
    case "wednesday":
      return "Wed";
    case "thursday":
      return "Thu";
    case "friday":
      return "Fri";
    case "saturday":
      return "Sat";
    case "sunday":
      return "Sun";
    default:
      return humanize(d);
  }
};

const goalLabel = (goal: GoalType | string) => {
  const g = String(goal).toLowerCase();
  switch (g) {
    case "weight_loss":
      return "Weight loss";
    case "muscle_gain":
      return "Muscle gain";
    case "general_fitness":
      return "General fitness";
    case "strength":
      return "Strength";
    case "endurance":
      return "Endurance";
    default:
      return humanize(g); // e.g. "lose_fat" -> "Lose Fat"
  }
};

const socialIcon = (name: string) => {
  const lower = name.toLowerCase();
  if (lower.includes("instagram")) return <InstagramIcon fontSize="small" />;
  if (lower.includes("site") || lower.includes("website"))
    return <LanguageIcon fontSize="small" />;
  return <LinkIcon fontSize="small" />;
};

// ── main page ───────────────────────────────────────────────────────────

const TrainerProfilePage: React.FC = () => {
  const { trainerSlug  } = useParams<{ trainerSlug : string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trainer, setTrainer] = useState<Trainer | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);

  const theme = useTheme();
  const isSmDown = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (!trainerSlug ) {
      setError("Trainer not found.");
    
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${API_BASE_URL}/${trainerSlug}`);
        if (!res.ok) {
          throw new Error(`Failed to fetch trainer: ${res.status}`);
        }
        const json: TrainerProfileResponse = await res.json();
        setTrainer(json.data.trainerDetails);
        setUser(json.data.userDetails);
        setPlans(json.data.subscriptionPlans || []);
      } catch (err: any) {
        console.error("Error fetching trainer profile", err);
        setError(
          err?.message || "Something went wrong fetching trainer profile."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [trainerSlug]);

  const heroTitle = useMemo(() => user?.name || "Trainer", [user?.name]);

  if (loading) {
    return (
      <Box
        minHeight="80vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || !trainer || !user) {
    console.log(error, trainer, user);
    return (
      <Box
        minHeight="80vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Alert severity="error">
          {error ?? "Unable to load trainer profile."}
        </Alert>
      </Box>
    );
  }

  const primaryGallery = trainer.professional.gallery || [];
  const heroBgImage =
    primaryGallery[0] || trainer.professional.profilePhoto || user.avatarUrl;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        pb: 8,
        backgroundColor: "#0b1020",
        color: "common.white",
      }}
    >
      {/* HERO SECTION WITH BACKGROUND IMAGE */}
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          borderBottom: "1px solid rgba(148,163,184,0.40)",
        }}
      >
        {/* Blurred background image */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${heroBgImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(24px)",
            transform: "scale(1.1)",
            opacity: 0.55,
          }}
        />
        {/* Gradient overlay */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at top left, rgba(15,23,42,0.9) 10%, transparent 55%), linear-gradient(to bottom, rgba(15,23,42,0.95), rgba(15,23,42,0.98))",
          }}
        />

        <Container sx={{ position: "relative", zIndex: 1, py: 6 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={4}>
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{ mb: 3 }}
              >
                <Avatar
                  src={trainer.professional.profilePhoto}
                  alt={heroTitle}
                  sx={{
                    width: isSmDown ? 110 : 140,
                    height: isSmDown ? 110 : 140,
                    border: "3px solid rgba(248,250,252,0.9)",
                    boxShadow: "0 20px 45px rgba(15,23,42,0.7)",
                  }}
                />
                <Avatar
                  src={user.avatarUrl}
                  alt={user.name}
                  sx={{
                    width: 40,
                    height: 40,
                    border: "2px solid rgba(248,250,252,0.85)",
                    boxShadow: "0 10px 25px rgba(15,23,42,0.6)",
                  }}
                />
              </Stack>
              <Stack spacing={1.2}>
                <Typography variant={isSmDown ? "h5" : "h4"} fontWeight={700}>
                  {heroTitle}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(203,213,225,0.9)" }}
                >
                  Certified fitness professional ·{" "}
                  {trainer.professional.yearsOfExperience}+ years experience
                </Typography>

                <Stack direction="row" spacing={1} flexWrap="wrap" mt={1}>
                  {trainer.professional.specialties.map((spec) => (
                    <Chip
                      key={spec}
                      label={humanize(spec)}
                      size="small"
                      sx={{
                        borderRadius: 999,
                        backgroundColor: "rgba(15,118,110,0.12)",
                        borderColor: "rgba(45,212,191,0.6)",
                        color: "rgba(209,250,229,1)",
                      }}
                      variant="outlined"
                    />
                  ))}
                </Stack>
              </Stack>
            </Grid>

            <Grid item xs={12} md={8}>
              <Stack spacing={2}>
                <Typography
                  variant="body1"
                  sx={{
                    maxWidth: 720,
                    color: "rgba(226,232,240,0.95)",
                    lineHeight: 1.6,
                  }}
                >
                  {trainer.professional.bio ??
                    "Personalised coaching tailored to your goals, schedule, and lifestyle. Evidence-based training, habit-focused nutrition, and sustainable progress."}
                </Typography>

                <Grid container spacing={2} mt={1}>
                  <Grid item xs={12} sm={4}>
                    <StatChip
                      icon={<ScheduleIcon fontSize="small" />}
                      label="Preferred Time"
                      value={formatTimePreference(
                        trainer.availability.preferredTime
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <StatChip
                      icon={<PlaceIcon fontSize="small" />}
                      label="Based In"
                      value={[
                        trainer.contact.city,
                        trainer.contact.state,
                        trainer.contact.country,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <StatChip
                      icon={<CheckCircleIcon fontSize="small" />}
                      label="Languages"
                      value={trainer.professional.languages.join(", ")}
                    />
                  </Grid>
                </Grid>
              </Stack>
            </Grid>
          </Grid>

          {/* Image strip from gallery */}
          {primaryGallery.length > 0 && (
            <Box sx={{ mt: 5 }}>
              <Typography
                variant="caption"
                sx={{ color: "rgba(148,163,184,0.9)", mb: 1, display: "block" }}
              >
                Training environment
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  gap: 1.5,
                  overflowX: "auto",
                  pb: 0.5,
                  "&::-webkit-scrollbar": { height: 4 },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "rgba(148,163,184,0.6)",
                    borderRadius: 999,
                  },
                }}
              >
                {primaryGallery.map((src, idx) => (
                  <Box
                    key={src + idx}
                    sx={{
                      minWidth: 160,
                      height: 110,
                      borderRadius: 10,
                      overflow: "hidden",
                      border: "1px solid rgba(148,163,184,0.4)",
                      backgroundColor: "rgba(15,23,42,0.8)",
                    }}
                  >
                    <Box
                      component="img"
                      src={src}
                      alt={`Gallery ${idx + 1}`}
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </Container>
      </Box>

      {/* MAIN CONTENT */}
      <Container maxWidth="lg" sx={{ mt: 5 }}>
        <Grid container spacing={4} alignItems="flex-start">
          {/* LEFT COLUMN */}
          <Grid item xs={12} md={8}>
            {/* About + Certifications */}
            <Card
              sx={{
                mb: 3,
                backgroundColor: "rgba(15,23,42,0.95)",
                border: "1px solid rgba(51,65,85,0.9)",
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom color="#e5e7eb">
                  About {heroTitle}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "rgba(148,163,184,0.95)",
                    mb: 2,
                    lineHeight: 1.7,
                  }}
                >
                  {trainer.professional.bio ??
                    "This trainer is committed to helping you build sustainable fitness habits, balancing effective training with practical nutrition and recovery."}
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="subtitle2"
                      sx={{ color: "rgba(203,213,225,0.9)", mb: 1 }}
                    >
                      Certifications
                    </Typography>
                    {trainer.professional.certifications?.length ? (
                      <Stack direction="row" spacing={1} flexWrap="wrap">
                        {trainer.professional.certifications.map((cert) => (
                          <Chip
                            key={cert}
                            label={cert}
                            size="small"
                            sx={{
                              backgroundColor: "rgba(30,64,175,0.2)",
                              color: "rgba(191,219,254,1)",
                              borderColor: "rgba(96,165,250,0.7)",
                            }}
                            variant="outlined"
                          />
                        ))}
                      </Stack>
                    ) : (
                      <Typography
                        variant="body2"
                        sx={{ color: "rgba(148,163,184,0.8)" }}
                      >
                        Certifications will be added soon.
                      </Typography>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="subtitle2"
                      sx={{ color: "rgba(203,213,225,0.9)", mb: 1 }}
                    >
                      Contact
                    </Typography>
                    <Stack spacing={0.5}>
                      <Typography
                        variant="body2"
                        sx={{ color: "rgba(148,163,184,0.95)" }}
                      >
                        {trainer.contact.phone}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "rgba(148,163,184,0.85)" }}
                      >
                        {trainer.contact.addressLine1}
                        {trainer.contact.addressLine2
                          ? `, ${trainer.contact.addressLine2}`
                          : ""}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "rgba(148,163,184,0.85)" }}
                      >
                        {[
                          trainer.contact.city,
                          trainer.contact.state,
                          trainer.contact.country,
                          trainer.contact.postalCode,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </Typography>
                    </Stack>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Availability */}
            <Card
              sx={{
                mb: 3,
                backgroundColor: "rgba(15,23,42,0.96)",
                border: "1px solid rgba(51,65,85,0.9)",
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom color="#e5e7eb">
                  Availability & Schedule
                </Typography>
                <Stack spacing={2} mb={2}>
                  <Typography
                    variant="body2"
                    sx={{ color: "rgba(148,163,184,0.96)" }}
                  >
                    <strong>Preferred time:</strong>{" "}
                    {formatTimePreference(trainer.availability.preferredTime)}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "rgba(148,163,184,0.96)" }}
                  >
                    <strong>Working hours:</strong>{" "}
                    {trainer.availability.checkIn} –{" "}
                    {trainer.availability.checkOut} (
                    {trainer.availability.timezone})
                  </Typography>
                </Stack>
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  sx={{ color: "rgba(203,213,225,0.95)" }}
                >
                  Days available
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {trainer.availability.daysAvailable.map((day) => (
                    <Chip
                      key={day}
                      label={weekdayLabel(day)}
                      size="small"
                      sx={{
                        borderRadius: 999,
                        color: "rgba(226,232,240,1)",
                        borderColor: "rgba(148,163,184,0.8)",
                      }}
                      variant="outlined"
                    />
                  ))}
                </Stack>
              </CardContent>
            </Card>

            {/* Transformations WITH IMAGES */}
            {trainer.transformations && trainer.transformations.length > 0 && (
              <Card
                sx={{
                  mb: 3,
                  backgroundColor: "rgba(15,23,42,0.97)",
                  border: "1px solid rgba(51,65,85,0.9)",
                }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom color="#e5e7eb">
                    Client Transformations
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "rgba(148,163,184,0.9)",
                      mb: 2,
                    }}
                  >
                    Real results from real clients. Before/after photos shared
                    with permission.
                  </Typography>
                  <Stack spacing={3}>
                    {trainer.transformations.map((t) => (
                      <Box
                        key={`${t.clientName}-${t.timeline}`}
                        sx={{
                          borderRadius: 2,
                          border: "1px solid rgba(51,65,85,0.9)",
                          overflow: "hidden",
                          background:
                            "radial-gradient(circle at top, rgba(30,64,175,0.35), rgba(15,23,42,1))",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: { xs: "column", sm: "row" },
                          }}
                        >
                          {/* Before */}
                          <Box
                            sx={{
                              flex: 1,
                              position: "relative",
                              borderRight: {
                                xs: "none",
                                sm: "1px solid rgba(30,64,175,0.5)",
                              },
                              borderBottom: {
                                xs: "1px solid rgba(30,64,175,0.5)",
                                sm: "none",
                              },
                            }}
                          >
                            {t.beforeImages?.[0] && (
                              <Box
                                component="img"
                                src={t.beforeImages[0]}
                                alt={`${t.clientName} before`}
                                sx={{
                                  width: "100%",
                                  height: 220,
                                  objectFit: "cover",
                                  display: "block",
                                }}
                              />
                            )}
                            <Box
                              sx={{
                                position: "absolute",
                                top: 10,
                                left: 10,
                                px: 1.4,
                                py: 0.4,
                                borderRadius: 999,
                                backgroundColor: "rgba(15,23,42,0.85)",
                                color: "rgba(254,226,226,1)",
                                fontSize: 11,
                                fontWeight: 600,
                                textTransform: "uppercase",
                                letterSpacing: 0.6,
                                border: "1px solid rgba(248,113,113,0.8)",
                              }}
                            >
                              Before
                            </Box>
                          </Box>

                          {/* After */}
                          <Box sx={{ flex: 1, position: "relative" }}>
                            {t.afterImages?.[0] && (
                              <Box
                                component="img"
                                src={t.afterImages[0]}
                                alt={`${t.clientName} after`}
                                sx={{
                                  width: "100%",
                                  height: 220,
                                  objectFit: "cover",
                                  display: "block",
                                }}
                              />
                            )}
                            <Box
                              sx={{
                                position: "absolute",
                                top: 10,
                                left: 10,
                                px: 1.4,
                                py: 0.4,
                                borderRadius: 999,
                                backgroundColor: "rgba(22,101,52,0.95)",
                                color: "rgba(220,252,231,1)",
                                fontSize: 11,
                                fontWeight: 600,
                                textTransform: "uppercase",
                                letterSpacing: 0.6,
                                border: "1px solid rgba(74,222,128,0.9)",
                              }}
                            >
                              After
                            </Box>
                          </Box>
                        </Box>

                        <Box sx={{ p: 2 }}>
                          <Stack
                            direction={{ xs: "column", sm: "row" }}
                            justifyContent="space-between"
                            alignItems={{ xs: "flex-start", sm: "center" }}
                            spacing={1}
                            mb={1}
                          >
                            <Typography
                              variant="subtitle1"
                              sx={{ color: "#e5e7eb" }}
                            >
                              {t.clientName}
                            </Typography>
                            <Stack
                              direction="row"
                              spacing={1}
                              alignItems="center"
                            >
                              <Chip
                                label={goalLabel(t.transformationGoal)}
                                size="small"
                                sx={{
                                  borderRadius: 999,
                                  backgroundColor: "rgba(6,95,70,0.4)",
                                  borderColor: "rgba(52,211,153,0.9)",
                                  color: "rgba(209,250,229,1)",
                                }}
                                variant="outlined"
                              />
                              <Typography
                                variant="caption"
                                sx={{ color: "rgba(148,163,184,0.9)" }}
                              >
                                {t.timeline}
                              </Typography>
                            </Stack>
                          </Stack>
                          {t.resultsAndAchievements?.length > 0 && (
                            <ul
                              style={{
                                margin: 0,
                                paddingLeft: 18,
                                color: "rgba(148,163,184,0.96)",
                              }}
                            >
                              {t.resultsAndAchievements.map((r) => (
                                <li key={r}>
                                  <Typography variant="body2">{r}</Typography>
                                </li>
                              ))}
                            </ul>
                          )}
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            )}

            {/* Testimonials */}
            {trainer.testimonials && trainer.testimonials.length > 0 && (
              <Card
                sx={{
                  mb: 3,
                  backgroundColor: "rgba(15,23,42,0.97)",
                  border: "1px solid rgba(51,65,85,0.9)",
                }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom color="#e5e7eb">
                    What clients say
                  </Typography>
                  <Stack spacing={2.5}>
                    {trainer.testimonials.map((test) => (
                      <Box
                        key={test.clientName + test.note.slice(0, 10)}
                        sx={{
                          display: "flex",
                          gap: 1.5,
                          p: 1.5,
                          borderRadius: 2,
                          backgroundColor: "rgba(15,23,42,0.9)",
                          border: "1px solid rgba(51,65,85,0.85)",
                        }}
                      >
                        <Avatar
                          src={test.profileImage}
                          alt={test.clientName}
                          sx={{ width: 44, height: 44 }}
                        />
                        <Box>
                          <Typography
                            variant="subtitle2"
                            sx={{ color: "#e5e7eb" }}
                          >
                            {test.clientName}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ color: "rgba(148,163,184,0.96)", mt: 0.5 }}
                          >
                            “{test.note}”
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            )}
          </Grid>

          {/* RIGHT COLUMN / SIDEBAR */}
          <Grid item xs={12} md={4}>
            <Stack
              spacing={3}
              sx={{
                position: { md: "sticky" },
                top: { md: 88 },
              }}
            >
              {/* Coaching plans */}
              <Card
                sx={{
                  backgroundColor: "rgba(15,23,42,0.98)",
                  border: "1px solid rgba(51,65,85,0.9)",
                }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom color="#e5e7eb">
                    Coaching Plans
                  </Typography>
                  {plans.length === 0 ? (
                    <Typography
                      variant="body2"
                      sx={{ color: "rgba(148,163,184,0.9)" }}
                    >
                      Pricing is tailored based on your goals and training
                      frequency. Send a request to receive a personalised plan.
                    </Typography>
                  ) : (
                    <Stack spacing={2}>
                      {plans.map((plan) => (
                        <Box
                          key={plan._id}
                          sx={{
                            borderRadius: 2,
                            border: "1px solid rgba(51,65,85,0.9)",
                            p: 1.5,
                            backgroundColor: "rgba(15,23,42,0.9)",
                          }}
                        >
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="baseline"
                            mb={0.5}
                          >
                            <Typography
                              variant="subtitle1"
                              sx={{ color: "#e5e7eb" }}
                            >
                              {plan.name}
                            </Typography>
                            <Typography
                              variant="subtitle1"
                              fontWeight={700}
                              sx={{ color: "#bfdbfe" }}
                            >
                              {formatCurrency(plan.amount / 100, plan.currency)}
                            </Typography>
                          </Stack>
                          <Typography
                            variant="caption"
                            sx={{ color: "rgba(148,163,184,0.9)" }}
                          >
                            Every {plan.interval}{" "}
                            {plan.period.toString().toLowerCase()}
                            {plan.interval > 1 ? "s" : ""}
                          </Typography>
                          {plan.meta && (
                            <Typography
                              variant="caption"
                              display="block"
                              sx={{ color: "rgba(148,163,184,0.9)", mt: 0.5 }}
                            >
                              {plan.meta.sessionsIncludedPerMonth} sessions /
                              month
                              {plan.meta.freeTrialSessions
                                ? ` • ${plan.meta.freeTrialSessions} trial session(s)`
                                : ""}
                            </Typography>
                          )}
                          {plan.description && (
                            <Typography
                              variant="body2"
                              sx={{
                                color: "rgba(148,163,184,0.96)",
                                mt: 0.5,
                              }}
                            >
                              {plan.description}
                            </Typography>
                          )}
                        </Box>
                      ))}
                    </Stack>
                  )}
                </CardContent>
              </Card>

              {/* Social links */}
              {trainer.professional.socialLinks &&
                trainer.professional.socialLinks.length > 0 && (
                  <Card
                    sx={{
                      backgroundColor: "rgba(15,23,42,0.98)",
                      border: "1px solid rgba(51,65,85,0.9)",
                    }}
                  >
                    <CardContent>
                      <Typography variant="subtitle1" color="#e5e7eb" mb={1}>
                        Online presence
                      </Typography>
                      <Stack spacing={1}>
                        {trainer.professional.socialLinks.map((s) => (
                          <Stack
                            key={s.name + s.link}
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            <IconButton
                              size="small"
                              sx={{
                                color: "rgba(248,250,252,0.9)",
                                backgroundColor: "rgba(15,23,42,0.9)",
                                border: "1px solid rgba(51,65,85,0.9)",
                              }}
                            >
                              {socialIcon(s.name)}
                            </IconButton>
                            <MUILink
                              href={s.link}
                              target="_blank"
                              rel="noreferrer"
                              underline="hover"
                              sx={{
                                color: "rgba(191,219,254,1)",
                                fontSize: 14,
                              }}
                            >
                              {s.name}
                            </MUILink>
                          </Stack>
                        ))}
                      </Stack>
                    </CardContent>
                  </Card>
                )}

              {/* Invitation form */}
              <InvitationRequestCard
                trainerSlug={trainer.publicSlug}
                trainerName={heroTitle}
              />
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

// small stat chip in hero
const StatChip: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
}> = ({ icon, label, value }) => (
  <Box
    sx={{
      p: 1.5,
      borderRadius: 2,
      border: "1px solid rgba(51,65,85,0.85)",
      backgroundColor: "rgba(15,23,42,0.9)",
    }}
  >
    <Stack direction="row" spacing={1.2} alignItems="flex-start">
      <Box sx={{ mt: 0.3, color: "rgba(129,140,248,1)" }}>{icon}</Box>
      <Box>
        <Typography
          variant="caption"
          sx={{ color: "rgba(148,163,184,0.95)", textTransform: "uppercase" }}
        >
          {label}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "rgba(226,232,240,0.98)", fontWeight: 500 }}
        >
          {value}
        </Typography>
      </Box>
    </Stack>
  </Box>
);

// ── Invitation card with reCAPTCHA ─────────────────────────────────────

interface InvitationRequestCardProps {
  trainerSlug: string;
  trainerName: string;
}

const InvitationRequestCard: React.FC<InvitationRequestCardProps> = ({
  trainerSlug,
  trainerName,
}) => {
  const [values, setValues] = useState<InvitationFormValues>({ email: "" });
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const recaptchaRef = React.useRef<ReCAPTCHA | null>(null);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!values.email.trim()) {
      setErrorMsg("Please enter your email.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    if (!recaptchaToken) {
      setErrorMsg("Please complete the reCAPTCHA.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch(`${API_BASE_URL}/invitation/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trainerSlug,
          email: values.email.trim(),
          recaptchaToken,
        }),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(
          json?.error || `Request failed with status ${res.status}`
        );
      }

      setSuccessMsg(
        "Invitation request sent successfully. The trainer will contact you soon."
      );
      setValues({ email: "" });
      setRecaptchaToken(null);
      if (recaptchaRef.current) recaptchaRef.current.reset();
    } catch (err: any) {
      console.error("Invitation request error", err);
      setErrorMsg(err?.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card
      sx={{
        backgroundColor: "rgba(15,23,42,0.98)",
        border: "1px solid rgba(51,65,85,0.9)",
      }}
    >
      <CardContent>
        <Typography variant="h6" gutterBottom color="#e5e7eb">
          Request coaching with {trainerName}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "rgba(148,163,184,0.96)", mb: 2 }}
        >
          Share your email to request an invitation. You’ll receive a response
          with availability, pricing, and next steps.
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Stack spacing={2}>
            <TextField
              name="email"
              label="Email address"
              type="email"
              size="small"
              value={values.email}
              onChange={handleChange}
              fullWidth
              placeholder="you@example.com"
              InputLabelProps={{
                sx: { color: "rgba(148,163,184,0.9)" },
              }}
              InputProps={{
                sx: {
                  color: "rgba(226,232,240,0.98)",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(75,85,99,0.9)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(148,163,184,0.9)",
                  },
                },
              }}
            />

            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={RECAPTCHA_SITE_KEY}
              onChange={(token) => setRecaptchaToken(token)}
            />

            {errorMsg && (
              <Alert severity="error" variant="outlined">
                {errorMsg}
              </Alert>
            )}
            {successMsg && (
              <Alert severity="success" variant="outlined">
                {successMsg}
              </Alert>
            )}

            <Divider sx={{ mt: 1, borderColor: "rgba(55,65,81,0.9)" }} />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={submitting}
              sx={{
                mt: 0.5,
                textTransform: "none",
                fontWeight: 600,
                borderRadius: 999,
              }}
            >
              {submitting ? "Sending request…" : "Request Invitation"}
            </Button>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TrainerProfilePage;
