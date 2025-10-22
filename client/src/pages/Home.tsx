import { useAuth } from "@/_core/hooks/useAuth";
import { APP_TITLE } from "@/const";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Paper,
  Button,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  Edit as EditIcon,
  Dashboard as DashboardIcon,
  Security as SecurityIcon,
} from "@mui/icons-material";
import { useLocation } from "wouter";

export default function Home() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [, navigate] = useLocation();

  if (loading) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Typography>Carregando...</Typography>
      </Box>
    );
  }

  if (isAuthenticated && user) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "grey.50" }}>
        {/* Header */}
        <Box
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            py: 4,
          }}
        >
          <Container maxWidth="lg">
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  {APP_TITLE}
                </Typography>
                <Typography variant="body1">
                  Bem-vindo, <strong>{user.name || user.phone}</strong>
                </Typography>
              </Box>
              <Button
                onClick={() => logout()}
                variant="outlined"
                sx={{
                  color: "white",
                  borderColor: "white",
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.1)",
                  },
                }}
              >
                Sair
              </Button>
            </Box>
          </Container>
        </Box>

        {/* Main Content */}
        <Container maxWidth="lg" sx={{ py: 6 }}>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3, mb: 8 }}>
            {/* Questionnaire Card */}
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: 4,
                  transform: "translateY(-4px)",
                },
              }}
              onClick={() => navigate("/questionnaire")}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box
                  sx={{
                    width: 50,
                    height: 50,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    mb: 2,
                  }}
                >
                  <EditIcon />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  Meu Questionário
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Preencha ou edite suas respostas para o questionário de qualificação.
                </Typography>
                <Button
                  variant="contained"
                  sx={{
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  }}
                >
                  Acessar Questionário
                </Button>
              </CardContent>
            </Card>

            {/* Admin Dashboard Card (if admin) */}
            {user.role === "admin" && (
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: 4,
                    transform: "translateY(-4px)",
                  },
                }}
                onClick={() => navigate("/admin")}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      mb: 2,
                    }}
                  >
                    <DashboardIcon />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                    Painel Administrativo
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Visualize e gerencie todos os questionários preenchidos.
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{
                      background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                    }}
                  >
                    Acessar Painel
                  </Button>
                </CardContent>
              </Card>
            )}
          </Box>

          {/* Features Section */}
          <Box sx={{ mt: 8 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 4, textAlign: "center" }}>
              Recursos da Plataforma
            </Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr 1fr" }, gap: 3 }}>
              <Paper sx={{ p: 3, textAlign: "center" }}>
                <SecurityIcon sx={{ fontSize: 40, color: "primary.main", mb: 1 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Autenticação OTP
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Login seguro via código de verificação
                </Typography>
              </Paper>

              <Paper sx={{ p: 3, textAlign: "center" }}>
                <EditIcon sx={{ fontSize: 40, color: "primary.main", mb: 1 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Formulário Multi-Etapas
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  11 seções bem organizadas
                </Typography>
              </Paper>

              <Paper sx={{ p: 3, textAlign: "center" }}>
                <CheckCircleIcon sx={{ fontSize: 40, color: "primary.main", mb: 1 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Salvamento Automático
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Suas respostas são salvas a cada etapa
                </Typography>
              </Paper>

              <Paper sx={{ p: 3, textAlign: "center" }}>
                <DashboardIcon sx={{ fontSize: 40, color: "primary.main", mb: 1 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Painel Admin
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Visualize todos os questionários
                </Typography>
              </Paper>
            </Box>
          </Box>
        </Container>
      </Box>
    );
  }

  // Not authenticated - show login prompt
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
            textAlign: "center",
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 3,
            }}
          >
            <SecurityIcon sx={{ color: "white", fontSize: 48 }} />
          </Box>

          <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
            {APP_TITLE}
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Preencha o questionário de qualificação para a parceria FATTO ↔ RAVYZ. Autentique-se com seu número de telefone para começar.
          </Typography>

          <Button
            variant="contained"
            onClick={() => navigate("/auth")}
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              py: 1.5,
              px: 4,
              fontWeight: 600,
              fontSize: "1rem",
            }}
          >
            Começar Agora
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}

