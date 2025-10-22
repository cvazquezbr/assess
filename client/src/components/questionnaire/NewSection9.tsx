import { Box, TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Checkbox, FormGroup, Typography } from "@mui/material";

interface Section9Props {
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

export default function Section9({ data, onChange }: Section9Props) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Question 1 */}
      <Box>
        <FormControl component="fieldset" fullWidth>
          <FormLabel component="legend" sx={{ fontWeight: 600, mb: 2 }}>
            Já trabalharam com fornecedores ou freelancers para este projeto?
          </FormLabel>
          <RadioGroup
            value={data.workedWithSuppliers ? "yes" : "no"}
            onChange={(e) => onChange({ workedWithSuppliers: e.target.value === "yes" })}
          >
            <FormControlLabel value="yes" control={<Radio />} label="Sim" />
            <FormControlLabel value="no" control={<Radio />} label="Não" />
          </RadioGroup>
        </FormControl>
      </Box>

      {/* Question 2 */}
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
          Quantos fornecedores já participaram?
        </Typography>
        <TextField
          fullWidth
          type="number"
          value={data.numberOfSuppliers || ""}
          onChange={(e) => onChange({ numberOfSuppliers: e.target.value })}
          placeholder="Número"
        />
      </Box>

      {/* Question 3 */}
      <Box>
        <FormControl component="fieldset" fullWidth>
          <FormLabel component="legend" sx={{ fontWeight: 600, mb: 2 }}>
            Principais dificuldades enfrentadas:
          </FormLabel>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={(data.difficulties || []).includes("deadlines")}
                  onChange={(e) => {
                    const difficulties = data.difficulties || [];
                    if (e.target.checked) {
                      onChange({ difficulties: [...difficulties, "deadlines"] });
                    } else {
                      onChange({ difficulties: difficulties.filter((d: string) => d !== "deadlines") });
                    }
                  }}
                />
              }
              label="Prazos"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={(data.difficulties || []).includes("communication")}
                  onChange={(e) => {
                    const difficulties = data.difficulties || [];
                    if (e.target.checked) {
                      onChange({ difficulties: [...difficulties, "communication"] });
                    } else {
                      onChange({ difficulties: difficulties.filter((d: string) => d !== "communication") });
                    }
                  }}
                />
              }
              label="Comunicação"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={(data.difficulties || []).includes("technical-quality")}
                  onChange={(e) => {
                    const difficulties = data.difficulties || [];
                    if (e.target.checked) {
                      onChange({ difficulties: [...difficulties, "technical-quality"] });
                    } else {
                      onChange({ difficulties: difficulties.filter((d: string) => d !== "technical-quality") });
                    }
                  }}
                />
              }
              label="Qualidade técnica"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={(data.difficulties || []).includes("team-continuity")}
                  onChange={(e) => {
                    const difficulties = data.difficulties || [];
                    if (e.target.checked) {
                      onChange({ difficulties: [...difficulties, "team-continuity"] });
                    } else {
                      onChange({ difficulties: difficulties.filter((d: string) => d !== "team-continuity") });
                    }
                  }}
                />
              }
              label="Continuidade do time"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={(data.difficulties || []).includes("costs")}
                  onChange={(e) => {
                    const difficulties = data.difficulties || [];
                    if (e.target.checked) {
                      onChange({ difficulties: [...difficulties, "costs"] });
                    } else {
                      onChange({ difficulties: difficulties.filter((d: string) => d !== "costs") });
                    }
                  }}
                />
              }
              label="Custos"
            />
          </FormGroup>
        </FormControl>
      </Box>

      {/* Question 4 */}
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
          Lições aprendidas que desejam aplicar agora:
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          value={data.lessonsLearned || ""}
          onChange={(e) => onChange({ lessonsLearned: e.target.value })}
          placeholder="Descreva as lições aprendidas..."
        />
      </Box>
    </Box>
  );
}
