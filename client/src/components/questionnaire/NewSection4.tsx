import { Box, TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Typography } from "@mui/material";

interface Section4Props {
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

export default function Section4({ data, onChange }: Section4Props) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Question 1 */}
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
          Tecnologias e linguagens principais utilizadas:
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          value={data.techStack || ""}
          onChange={(e) => onChange({ techStack: e.target.value })}
          placeholder="Descreva as tecnologias..."
        />
      </Box>

      {/* Question 2 */}
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
          Quantos sistemas, microsserviços ou aplicações compõem a solução atual?
        </Typography>
        <TextField
          fullWidth
          type="number"
          value={data.numberOfSystems || ""}
          onChange={(e) => onChange({ numberOfSystems: e.target.value })}
          placeholder="Número"
        />
      </Box>

      {/* Question 3 */}
      <Box>
        <FormControl component="fieldset" fullWidth>
          <FormLabel component="legend" sx={{ fontWeight: 600, mb: 2 }}>
            Modelo de arquitetura adotado:
          </FormLabel>
          <RadioGroup
            value={data.architectureModel || ""}
            onChange={(e) => onChange({ architectureModel: e.target.value })}
          >
            <FormControlLabel value="monolithic" control={<Radio />} label="Monolítica" />
            <FormControlLabel value="microservices" control={<Radio />} label="Microserviços" />
            <FormControlLabel value="serverless" control={<Radio />} label="Serverless" />
            <FormControlLabel value="undefined" control={<Radio />} label="Em avaliação / indefinida" />
          </RadioGroup>
        </FormControl>
      </Box>

      {/* Question 4 */}
      <Box>
        <FormControl component="fieldset" fullWidth>
          <FormLabel component="legend" sx={{ fontWeight: 600, mb: 2 }}>
            A FATTO poderá propor ajustes de arquitetura?
          </FormLabel>
          <RadioGroup
            value={data.architectureAdjustments || ""}
            onChange={(e) => onChange({ architectureAdjustments: e.target.value })}
          >
            <FormControlLabel value="yes-autonomy" control={<Radio />} label="Sim, com autonomia técnica" />
            <FormControlLabel value="yes-approval" control={<Radio />} label="Sim, mediante aprovação prévia" />
            <FormControlLabel value="no" control={<Radio />} label="Não, arquitetura será mantida" />
          </RadioGroup>
        </FormControl>
      </Box>

      {/* Question 5 */}
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
          Quantas integrações externas (APIs, gateways, webhooks) existem atualmente?
        </Typography>
        <TextField
          fullWidth
          type="number"
          value={data.externalIntegrations || ""}
          onChange={(e) => onChange({ externalIntegrations: e.target.value })}
          placeholder="Número"
        />
      </Box>

      {/* Question 6 */}
      <Box>
        <FormControl component="fieldset" fullWidth>
          <FormLabel component="legend" sx={{ fontWeight: 600, mb: 2 }}>
            Existem integrações críticas (pagamentos, ERP, etc.)?
          </FormLabel>
          <RadioGroup
            value={data.hasCriticalIntegrations ? "yes" : "no"}
            onChange={(e) => onChange({ hasCriticalIntegrations: e.target.value === "yes" })}
          >
            <FormControlLabel value="yes" control={<Radio />} label="Sim" />
            <FormControlLabel value="no" control={<Radio />} label="Não" />
          </RadioGroup>
        </FormControl>
      </Box>

      {/* Question 6 - Details */}
      {data.hasCriticalIntegrations && (
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
            Se sim, especificar quais
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={data.criticalIntegrationsDetails || ""}
            onChange={(e) => onChange({ criticalIntegrationsDetails: e.target.value })}
            placeholder="Descreva as integrações críticas..."
          />
        </Box>
      )}
    </Box>
  );
}
