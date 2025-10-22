import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Paper,
  Button,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import {
  Save as SaveIcon,
  CheckCircle as CheckCircleIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import NewSection1 from "@/components/questionnaire/NewSection1";
import NewSection2 from "@/components/questionnaire/NewSection2";
import NewSection3 from "@/components/questionnaire/NewSection3";
import NewSection4 from "@/components/questionnaire/NewSection4";
import NewSection5 from "@/components/questionnaire/NewSection5";
import NewSection6 from "@/components/questionnaire/NewSection6";
import NewSection7 from "@/components/questionnaire/NewSection7";
import NewSection8 from "@/components/questionnaire/NewSection8";
import NewSection9 from "@/components/questionnaire/NewSection9";
import NewSection10 from "@/components/questionnaire/NewSection10";
import NewSection11 from "@/components/questionnaire/NewSection11";

const SECTIONS = [
  "Contexto do Negócio",
  "Organização e Equipe",
  "Escopo e Ciclo",
  "Tecnologia",
  "DevOps e Entregas",
  "Suporte e Sustentação",
  "Governança",
  "Expectativas Comerciais",
  "Riscos e Aprendizados",
  "Próximos Passos",
  "Síntese",
];

const SECTION_COMPONENTS = [
  NewSection1,
  NewSection2,
  NewSection3,
  NewSection4,
  NewSection5,
  NewSection6,
  NewSection7,
  NewSection8,
  NewSection9,
  NewSection10,
  NewSection11,
];

export default function Questionnaire() {
  const { user } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);

  const getOrCreateMutation = trpc.questionnaire.getOrCreate.useQuery();
  const updateMutation = trpc.questionnaire.update.useMutation();

  // Load questionnaire data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await getOrCreateMutation.refetch();
        if (data.data) {
          setFormData(data.data);
          setActiveStep(data.data.currentStep || 0);
        }
      } catch (err: any) {
        setError("Erro ao carregar questionário");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSectionChange = (sectionData: Record<string, any>) => {
    setFormData((prev) => ({ ...prev, ...sectionData }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");

    try {
      await updateMutation.mutateAsync({
        id: formData.id,
        data: formData,
        currentStep: activeStep,
      });
    } catch (err: any) {
      setError("Erro ao salvar respostas");
    } finally {
      setSaving(false);
    }
  };

  const handleNext = async () => {
    await handleSave();
    if (activeStep < SECTIONS.length - 1) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1);
    }
  };

  const handleComplete = async () => {
    setSaving(true);
    setError("");

    try {
      await updateMutation.mutateAsync({
        id: formData.id,
        data: formData,
        currentStep: activeStep,
        isCompleted: true,
      });
      setShowCompletionDialog(true);
    } catch (err: any) {
      setError("Erro ao completar questionário");
    } finally {
      setSaving(false);
    }
  };

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

  const CurrentSection = SECTION_COMPONENTS[activeStep];
  const isLastStep = activeStep === SECTIONS.length - 1;

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "grey.50", py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Questionário de Qualificação
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Bem-vindo, <strong>{user?.name || user?.phone}</strong>. Complete o formulário abaixo.
          </Typography>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Progress Card */}
        <Card sx={{ mb: 4, bgcolor: "primary.lighter" }}>
          <CardContent>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Progresso
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {activeStep + 1} de {SECTIONS.length}
                </Typography>
              </Box>
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontWeight: 700,
                  fontSize: "24px",
                }}
              >
                {Math.round(((activeStep + 1) / SECTIONS.length) * 100)}%
              </Box>
            </Box>
            <Box sx={{ mt: 2, width: "100%", height: 8, bgcolor: "grey.200", borderRadius: 1, overflow: "hidden" }}>
              <Box
                sx={{
                  height: "100%",
                  width: `${((activeStep + 1) / SECTIONS.length) * 100}%`,
                  background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
                  transition: "width 0.3s ease",
                }}
              />
            </Box>
          </CardContent>
        </Card>

        {/* Stepper */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Stepper activeStep={activeStep} sx={{ mb: 2 }}>
            {SECTIONS.map((label, index) => (
              <Step key={label} completed={index < activeStep}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Paper>

        {/* Form Section */}
        <Paper sx={{ p: 4, mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
            {SECTIONS[activeStep]}
          </Typography>

          <CurrentSection data={formData} onChange={handleSectionChange} />
        </Paper>

        {/* Navigation Buttons */}
        <Box sx={{ display: "flex", gap: 2, justifyContent: "space-between" }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            disabled={activeStep === 0 || saving}
          >
            Anterior
          </Button>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? <CircularProgress size={20} /> : "Salvar"}
            </Button>

            {!isLastStep ? (
              <Button
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                onClick={handleNext}
                disabled={saving}
                sx={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                }}
              >
                Próximo
              </Button>
            ) : (
              <Button
                variant="contained"
                endIcon={<CheckCircleIcon />}
                onClick={handleComplete}
                disabled={saving}
                sx={{
                  background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                }}
              >
                {saving ? <CircularProgress size={20} /> : "Completar"}
              </Button>
            )}
          </Box>
        </Box>
      </Container>

      {/* Completion Dialog */}
      <Dialog open={showCompletionDialog}>
        <DialogTitle>Questionário Completado!</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Suas respostas foram salvas com sucesso. Obrigado por completar o questionário de qualificação.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setShowCompletionDialog(false);
              window.location.href = "/";
            }}
            variant="contained"
          >
            Voltar ao Início
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

