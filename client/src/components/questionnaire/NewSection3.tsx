import { Box, TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Typography } from "@mui/material";

interface Section3Props {
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

export default function Section3({ data, onChange }: Section3Props) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Question 1 */}
      <Box>
        <FormControl component="fieldset" fullWidth>
          <FormLabel component="legend" sx={{ fontWeight: 600, mb: 2 }}>
            Em que momento a FATTO entraria no processo?
          </FormLabel>
          <RadioGroup
            value={data.fattoEntrypoint || ""}
            onChange={(e) => onChange({ fattoEntrypoint: e.target.value })}
          >
            <FormControlLabel value="specs" control={<Radio />} label="A partir de especificações já definidas (execução)" />
            <FormControlLabel value="ux" control={<Radio />} label="Desde a concepção da UX e desenho funcional" />
            <FormControlLabel value="ui" control={<Radio />} label="No design da UI e desenvolvimento" />
            <FormControlLabel value="full-cycle" control={<Radio />} label="Em todo o ciclo (descoberta → entrega → sustentação)" />
          </RadioGroup>
        </FormControl>
      </Box>

      {/* Question 2 */}
      <Box>
        <FormControl component="fieldset" fullWidth>
          <FormLabel component="legend" sx={{ fontWeight: 600, mb: 2 }}>
            Existe processo formal de requisitos?
          </FormLabel>
          <RadioGroup
            value={data.requirementsProcess || ""}
            onChange={(e) => onChange({ requirementsProcess: e.target.value })}
          >
            <FormControlLabel value="documented" control={<Radio />} label="Sim, documentado" />
            <FormControlLabel value="partial" control={<Radio />} label="Parcialmente estruturado" />
            <FormControlLabel value="none" control={<Radio />} label="Não, depende de reuniões e validações" />
          </RadioGroup>
        </FormControl>
      </Box>

      {/* Question 3 */}
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
          Quantas funcionalidades ou módulos estão planejados até o momento?
        </Typography>
        <TextField
          fullWidth
          type="number"
          value={data.numberOfFeatures || ""}
          onChange={(e) => onChange({ numberOfFeatures: e.target.value })}
          placeholder="Número estimado"
        />
      </Box>

      {/* Question 4 */}
      <Box>
        <FormControl component="fieldset" fullWidth>
          <FormLabel component="legend" sx={{ fontWeight: 600, mb: 2 }}>
            Como ocorre a validação das funcionalidades?
          </FormLabel>
          <RadioGroup
            value={data.featureValidation || ""}
            onChange={(e) => onChange({ featureValidation: e.target.value })}
          >
            <FormControlLabel value="internal" control={<Radio />} label="Testes internos" />
            <FormControlLabel value="user" control={<Radio />} label="Validação com usuários" />
            <FormControlLabel value="none" control={<Radio />} label="Nenhum processo formal ainda definido" />
          </RadioGroup>
        </FormControl>
      </Box>
    </Box>
  );
}
