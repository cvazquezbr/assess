import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  Chip,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Visibility as VisibilityIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [selectedResponse, setSelectedResponse] = useState<any>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const listAllMutation = trpc.questionnaire.listAll.useQuery();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await listAllMutation.refetch();
      } catch (err: any) {
        setError("Erro ao carregar questionários");
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === "admin") {
      loadData();
    } else {
      navigate("/");
    }
  }, [user]);

  if (!user || user.role !== "admin") {
    return null;
  }

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const responses = listAllMutation.data || [];

  const getStatusColor = (isCompleted: boolean) => {
    return isCompleted ? "success" : "warning";
  };

  const getStatusLabel = (isCompleted: boolean) => {
    return isCompleted ? "Completo" : "Em Progresso";
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "grey.50", py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              Painel Administrativo
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Visualize e gerencie todos os questionários preenchidos
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/")}
          >
            Voltar
          </Button>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Summary Cards */}
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" }, gap: 3, mb: 4 }}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total de Respostas
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {responses.length}
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Completos
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, color: "success.main" }}>
                {responses.filter((r) => r.isCompleted).length}
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Em Progresso
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, color: "warning.main" }}>
                {responses.filter((r) => !r.isCompleted).length}
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Responses Table */}
        <Paper sx={{ mb: 4 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "grey.100" }}>
                  <TableCell sx={{ fontWeight: 700 }}>Usuário</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Telefone</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Progresso</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Atualizado em</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">
                    Ações
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {responses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">Nenhum questionário encontrado</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  responses.map((response) => (
                    <TableRow key={response.id} sx={{ "&:hover": { bgcolor: "grey.50" } }}>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {response.userId}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{response.userId}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getStatusLabel(response.isCompleted)}
                          color={getStatusColor(response.isCompleted)}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {response.currentStep + 1}/11
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{formatDate(response.updatedAt)}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          size="small"
                          startIcon={<VisibilityIcon />}
                          onClick={() => {
                            setSelectedResponse(response);
                            setShowDetailsDialog(true);
                          }}
                        >
                          Visualizar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>

      {/* Details Dialog */}
      <Dialog open={showDetailsDialog} onClose={() => setShowDetailsDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Detalhes do Questionário</DialogTitle>
        <DialogContent>
          {selectedResponse && (
            <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  ID do Usuário
                </Typography>
                <Typography variant="body2">{selectedResponse.userId}</Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Status
                </Typography>
                <Chip
                  label={getStatusLabel(selectedResponse.isCompleted)}
                  color={getStatusColor(selectedResponse.isCompleted)}
                  size="small"
                  variant="outlined"
                />
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Progresso
                </Typography>
                <Typography variant="body2">
                  {selectedResponse.currentStep + 1} de 11 seções
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Criado em
                </Typography>
                <Typography variant="body2">{formatDate(selectedResponse.createdAt)}</Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Atualizado em
                </Typography>
                <Typography variant="body2">{formatDate(selectedResponse.updatedAt)}</Typography>
              </Box>

              {selectedResponse.isCompleted && (
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Completado em
                  </Typography>
                  <Typography variant="body2">{formatDate(selectedResponse.completedAt)}</Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDetailsDialog(false)}>Fechar</Button>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={() => {
              // TODO: Implement export functionality
              setShowDetailsDialog(false);
            }}
          >
            Exportar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

