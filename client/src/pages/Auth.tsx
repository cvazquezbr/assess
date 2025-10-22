import { useState } from "react";
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
} from "@mui/material";
import { Phone as PhoneIcon, CheckCircle as CheckCircleIcon } from "@mui/icons-material";
import { trpc } from "@/lib/trpc";

type AuthStep = "phone" | "otp";

export default function Auth() {
  const [step, setStep] = useState<AuthStep>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpExpiresIn, setOtpExpiresIn] = useState(0);

  const requestOtpMutation = trpc.auth.requestOtp.useMutation();
  const verifyOtpMutation = trpc.auth.verifyOtp.useMutation();

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await requestOtpMutation.mutateAsync({
        phone: phone.replace(/\D/g, ""),
      });

      if (result.success) {
        setStep("otp");
        setOtpExpiresIn(result.expiresIn);
        
        // Start countdown timer
        const interval = setInterval(() => {
          setOtpExpiresIn((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } catch (err: any) {
      setError(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await verifyOtpMutation.mutateAsync({
        phone: phone.replace(/\D/g, ""),
        code: otp,
      });

      if (result.success) {
        // Redirect to questionnaire
        window.location.href = "/questionnaire";
      }
    } catch (err: any) {
      setError(err.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const steps = ["Número de Telefone", "Código OTP"];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 2,
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 2,
              }}
            >
              <PhoneIcon sx={{ color: "white", fontSize: 32 }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              Questionário de Campanha
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Autentique-se para preencher ou editar suas respostas
            </Typography>
          </Box>

          {/* Stepper */}
          <Stepper activeStep={step === "phone" ? 0 : 1} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Phone Step */}
          {step === "phone" && (
            <Box component="form" onSubmit={handleRequestOtp}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                Insira seu número de telefone
              </Typography>
              <TextField
                fullWidth
                label="Telefone"
                placeholder="+55 (11) 99999-9999"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={loading}
                sx={{ mb: 3 }}
                inputProps={{
                  maxLength: 20,
                }}
              />
              <Button
                fullWidth
                variant="contained"
                size="large"
                type="submit"
                disabled={!phone || loading}
                sx={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  py: 1.5,
                  fontWeight: 600,
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Enviar Código"}
              </Button>
            </Box>
          )}

          {/* OTP Step */}
          {step === "otp" && (
            <Box component="form" onSubmit={handleVerifyOtp}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                Insira o código de 6 dígitos
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Enviamos um código para <strong>{phone}</strong>
              </Typography>

              <TextField
                fullWidth
                label="Código OTP"
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                disabled={loading}
                sx={{ mb: 3 }}
                inputProps={{
                  maxLength: 6,
                  style: { fontSize: "24px", letterSpacing: "8px", textAlign: "center" },
                }}
              />

              {otpExpiresIn > 0 && (
                <Typography variant="caption" color="warning.main" sx={{ display: "block", mb: 2 }}>
                  Código expira em: <strong>{formatTime(otpExpiresIn)}</strong>
                </Typography>
              )}

              <Button
                fullWidth
                variant="contained"
                size="large"
                type="submit"
                disabled={otp.length !== 6 || loading}
                sx={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  py: 1.5,
                  fontWeight: 600,
                  mb: 2,
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Verificar Código"}
              </Button>

              <Button
                fullWidth
                variant="text"
                onClick={() => {
                  setStep("phone");
                  setOtp("");
                  setOtpExpiresIn(0);
                }}
                disabled={loading}
              >
                Voltar
              </Button>
            </Box>
          )}

          {/* Info Card */}
          <Card sx={{ mt: 4, bgcolor: "info.lighter", border: "1px solid", borderColor: "info.light" }}>
            <CardContent>
              <Typography variant="body2" color="info.dark">
                <strong>Dica:</strong> Verifique seu telefone para receber o código de autenticação. O código é válido por 10 minutos.
              </Typography>
            </CardContent>
          </Card>
        </Paper>
      </Container>
    </Box>
  );
}

