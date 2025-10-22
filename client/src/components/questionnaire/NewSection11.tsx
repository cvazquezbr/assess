import { Box, TextField, Typography } from "@mui/material";

interface Section11Props {
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

export default function Section11({ data, onChange }: Section11Props) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Question 1 */}
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
          Síntese e Observações
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={6}
          value={data.synthesisAndObservations || ""}
          onChange={(e) => onChange({ synthesisAndObservations: e.target.value })}
          placeholder="Campo livre para anotações do analista FATTO..."
        />
      </Box>
    </Box>
  );
}
