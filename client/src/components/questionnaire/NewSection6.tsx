import { Box, TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Typography } from "@mui/material";

interface Section6Props {
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

export default function Section6({ data, onChange }: Section6Props) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Question 1 */}
      <Box>
        <FormControl component="fieldset" fullWidth>
          <FormLabel component="legend" sx={{ fontWeight: 600, mb: 2 }}>
            A FATTO deverá atuar também em sustentação?
          </FormLabel>
          <RadioGroup
            value={data.fattoSupport ? "yes" : "no"}
            onChange={(e) => onChange({ fattoSupport: e.target.value === "yes" })}
          >
            <FormControlLabel value="yes" control={<Radio />} label="Sim" />
            <FormControlLabel value="no" control={<Radio />} label="Não" />
          </RadioGroup>
        </FormControl>
      </Box>

      {/* Question 2 */}
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
          Quantos chamados/incidentes são abertos por mês, em média?
        </Typography>
        <TextField
          fullWidth
          type="number"
          value={data.incidentsPerMonth || ""}
          onChange={(e) => onChange({ incidentsPerMonth: e.target.value })}
          placeholder="Número"
        />
      </Box>

      {/* Question 3 */}
      <Box>
        <FormControl component="fieldset" fullWidth>
          <FormLabel component="legend" sx={{ fontWeight: 600, mb: 2 }}>
            Como é feito o suporte atualmente?
          </FormLabel>
          <RadioGroup
            value={data.currentSupportModel || ""}
            onChange={(e) => onChange({ currentSupportModel: e.target.value })}
          >
            <FormControlLabel value="internal" control={<Radio />} label="Internamente" />
            <FormControlLabel value="freelancers" control={<Radio />} label="Por freelancers" />
            <FormControlLabel value="no-process" control={<Radio />} label="Sem processo formal" />
          </RadioGroup>
        </FormControl>
      </Box>

      {/* Question 4 */}
      <Box>
        <FormControl component="fieldset" fullWidth>
          <FormLabel component="legend" sx={{ fontWeight: 600, mb: 2 }}>
            Expectativa de SLA para correções:
          </FormLabel>
          <RadioGroup
            value={data.slaExpectation || ""}
            onChange={(e) => onChange({ slaExpectation: e.target.value })}
          >
            <FormControlLabel value="24h" control={<Radio />} label="24h" />
            <FormControlLabel value="48h" control={<Radio />} label="48h" />
            <FormControlLabel value="72h" control={<Radio />} label="72h" />
            <FormControlLabel value="on-demand" control={<Radio />} label="Sob demanda / sem SLA" />
          </RadioGroup>
        </FormControl>
      </Box>

      {/* Question 5 */}
      <Box>
        <FormControl component="fieldset" fullWidth>
          <FormLabel component="legend" sx={{ fontWeight: 600, mb: 2 }}>
            Planejam roadmap contínuo de releases?
          </FormLabel>
          <RadioGroup
            value={data.continuousRoadmap || ""}
            onChange={(e) => onChange({ continuousRoadmap: e.target.value })}
          >
            <FormControlLabel value="monthly" control={<Radio />} label="Sim, liberando mensalmente" />
            <FormControlLabel value="quarterly" control={<Radio />} label="Sim, trimestralmente" />
            <FormControlLabel value="on-demand" control={<Radio />} label="Apenas sob demanda" />
            <FormControlLabel value="undefined" control={<Radio />} label="Ainda será definido" />
          </RadioGroup>
        </FormControl>
      </Box>
    </Box>
  );
}
