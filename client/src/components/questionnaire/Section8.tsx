import { Box, TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Checkbox, FormGroup, Typography } from "@mui/material";

interface SectionProps {
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

export default function Section({ data, onChange }: SectionProps) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Typography variant="body2" color="text.secondary">
        Seção em desenvolvimento. Você pode preencher as informações aqui.
      </Typography>
      <TextField
        fullWidth
        multiline
        rows={4}
        label="Notas"
        placeholder="Adicione suas informações..."
      />
    </Box>
  );
}
