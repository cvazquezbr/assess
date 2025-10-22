import { Box, TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Typography } from "@mui/material";

interface Section8Props {
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

export default function Section8({ data, onChange }: Section8Props) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Question 1 */}
      <Box>
        <FormControl component="fieldset" fullWidth>
          <FormLabel component="legend" sx={{ fontWeight: 600, mb: 2 }}>
            Modelo contratual desejado:
          </FormLabel>
          <RadioGroup
            value={data.contractModel || ""}
            onChange={(e) => onChange({ contractModel: e.target.value })}
          >
            <FormControlLabel value="fixed-scope" control={<Radio />} label="Escopo fechado (projeto)" />
            <FormControlLabel value="dedicated-team" control={<Radio />} label="Alocação de equipe dedicada" />
            <FormControlLabel value="time-bank" control={<Radio />} label="Banco de horas" />
            <FormControlLabel value="hybrid" control={<Radio />} label="Contrato híbrido" />
          </RadioGroup>
        </FormControl>
      </Box>

      {/* Question 2 */}
      <Box>
        <FormControl component="fieldset" fullWidth>
          <FormLabel component="legend" sx={{ fontWeight: 600, mb: 2 }}>
            Tipo de faturamento preferido:
          </FormLabel>
          <RadioGroup
            value={data.billingType || ""}
            onChange={(e) => onChange({ billingType: e.target.value })}
          >
            <FormControlLabel value="fixed-monthly" control={<Radio />} label="Fixo mensal" />
            <FormControlLabel value="per-delivery" control={<Radio />} label="Por entrega" />
            <FormControlLabel value="per-hour" control={<Radio />} label="Por hora" />
          </RadioGroup>
        </FormControl>
      </Box>

      {/* Question 3 */}
      <Box>
        <FormControl component="fieldset" fullWidth>
          <FormLabel component="legend" sx={{ fontWeight: 600, mb: 2 }}>
            Prazo-alvo para início:
          </FormLabel>
          <RadioGroup
            value={data.startDate || ""}
            onChange={(e) => onChange({ startDate: e.target.value })}
          >
            <FormControlLabel value="immediate" control={<Radio />} label="Imediato" />
            <FormControlLabel value="30-days" control={<Radio />} label="Até 30 dias" />
            <FormControlLabel value="90-days" control={<Radio />} label="Até 90 dias" />
            <FormControlLabel value="undefined" control={<Radio />} label="Ainda indefinido" />
          </RadioGroup>
        </FormControl>
      </Box>

      {/* Question 4 */}
      <Box>
        <FormControl component="fieldset" fullWidth>
          <FormLabel component="legend" sx={{ fontWeight: 600, mb: 2 }}>
            Faixa orçamentária estimada:
          </FormLabel>
          <RadioGroup
            value={data.budgetRange || ""}
            onChange={(e) => onChange({ budgetRange: e.target.value })}
          >
            <FormControlLabel value="50k" control={<Radio />} label="Até R$ 50 mil" />
            <FormControlLabel value="50-150k" control={<Radio />} label="R$ 50–150 mil" />
            <FormControlLabel value="150-300k" control={<Radio />} label="R$ 150–300 mil" />
            <FormControlLabel value="300k+" control={<Radio />} label="Acima de R$ 300 mil" />
            <FormControlLabel value="tbd" control={<Radio />} label="A definir" />
          </RadioGroup>
        </FormControl>
      </Box>

      {/* Question 5 */}
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
          Quantas pessoas da FATTO seriam necessárias inicialmente (estimativa)?
        </Typography>
        <TextField
          fullWidth
          type="number"
          value={data.numberOfFattoPeople || ""}
          onChange={(e) => onChange({ numberOfFattoPeople: e.target.value })}
          placeholder="Número"
        />
      </Box>
    </Box>
  );
}
