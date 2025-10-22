import { Box, TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Checkbox, FormGroup, Typography } from "@mui/material";

interface Section5Props {
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

export default function Section5({ data, onChange }: Section5Props) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Question 1 */}
      <Box>
        <FormControl component="fieldset" fullWidth>
          <FormLabel component="legend" sx={{ fontWeight: 600, mb: 2 }}>
            Quais ambientes estão configurados?
          </FormLabel>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={(data.configuredEnvironments || []).includes("dev")}
                  onChange={(e) => {
                    const envs = data.configuredEnvironments || [];
                    if (e.target.checked) {
                      onChange({ configuredEnvironments: [...envs, "dev"] });
                    } else {
                      onChange({ configuredEnvironments: envs.filter((env: string) => env !== "dev") });
                    }
                  }}
                />
              }
              label="DEV"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={(data.configuredEnvironments || []).includes("homologation")}
                  onChange={(e) => {
                    const envs = data.configuredEnvironments || [];
                    if (e.target.checked) {
                      onChange({ configuredEnvironments: [...envs, "homologation"] });
                    } else {
                      onChange({ configuredEnvironments: envs.filter((env: string) => env !== "homologation") });
                    }
                  }}
                />
              }
              label="HOMOLOGAÇÃO"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={(data.configuredEnvironments || []).includes("production")}
                  onChange={(e) => {
                    const envs = data.configuredEnvironments || [];
                    if (e.target.checked) {
                      onChange({ configuredEnvironments: [...envs, "production"] });
                    } else {
                      onChange({ configuredEnvironments: envs.filter((env: string) => env !== "production") });
                    }
                  }}
                />
              }
              label="PRODUÇÃO"
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
              <Typography>Outros:</Typography>
              <TextField
                value={data.otherEnvironments || ""}
                onChange={(e) => onChange({ otherEnvironments: e.target.value })}
                placeholder="Especifique"
              />
            </Box>
          </FormGroup>
        </FormControl>
      </Box>

      {/* Question 2 */}
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
          Quantos ambientes ativos existem hoje?
        </Typography>
        <TextField
          fullWidth
          type="number"
          value={data.activeEnvironments || ""}
          onChange={(e) => onChange({ activeEnvironments: e.target.value })}
          placeholder="Número"
        />
      </Box>

      {/* Question 3 */}
      <Box>
        <FormControl component="fieldset" fullWidth>
          <FormLabel component="legend" sx={{ fontWeight: 600, mb: 2 }}>
            Responsável atual pelo provisionamento e monitoramento:
          </FormLabel>
          <RadioGroup
            value={data.provisioningResponsible || ""}
            onChange={(e) => onChange({ provisioningResponsible: e.target.value })}
          >
            <FormControlLabel value="internal" control={<Radio />} label="Equipe interna" />
            <FormControlLabel value="freelancers" control={<Radio />} label="Freelancers" />
            <FormControlLabel value="external" control={<Radio />} label="Fornecedor externo" />
            <FormControlLabel value="undefined" control={<Radio />} label="Indefinido" />
          </RadioGroup>
        </FormControl>
      </Box>

      {/* Question 4 */}
      <Box>
        <FormControl component="fieldset" fullWidth>
          <FormLabel component="legend" sx={{ fontWeight: 600, mb: 2 }}>
            Há pipeline CI/CD implementado?
          </FormLabel>
          <RadioGroup
            value={data.ciCdImplemented || ""}
            onChange={(e) => onChange({ ciCdImplemented: e.target.value })}
          >
            <FormControlLabel value="yes" control={<Radio />} label="Sim" />
            <FormControlLabel value="partially" control={<Radio />} label="Parcialmente" />
            <FormControlLabel value="no" control={<Radio />} label="Não" />
          </RadioGroup>
        </FormControl>
      </Box>

      {/* Question 5 */}
      <Box>
        <FormControl component="fieldset" fullWidth>
          <FormLabel component="legend" sx={{ fontWeight: 600, mb: 2 }}>
            Ferramentas de entrega:
          </FormLabel>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={(data.deliveryTools || []).includes("github-actions")}
                  onChange={(e) => {
                    const tools = data.deliveryTools || [];
                    if (e.target.checked) {
                      onChange({ deliveryTools: [...tools, "github-actions"] });
                    } else {
                      onChange({ deliveryTools: tools.filter((tool: string) => tool !== "github-actions") });
                    }
                  }}
                />
              }
              label="GitHub Actions"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={(data.deliveryTools || []).includes("gitlab-ci")}
                  onChange={(e) => {
                    const tools = data.deliveryTools || [];
                    if (e.target.checked) {
                      onChange({ deliveryTools: [...tools, "gitlab-ci"] });
                    } else {
                      onChange({ deliveryTools: tools.filter((tool: string) => tool !== "gitlab-ci") });
                    }
                  }}
                />
              }
              label="GitLab CI"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={(data.deliveryTools || []).includes("jenkins")}
                  onChange={(e) => {
                    const tools = data.deliveryTools || [];
                    if (e.target.checked) {
                      onChange({ deliveryTools: [...tools, "jenkins"] });
                    } else {
                      onChange({ deliveryTools: tools.filter((tool: string) => tool !== "jenkins") });
                    }
                  }}
                />
              }
              label="Jenkins"
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
              <Typography>Outros:</Typography>
              <TextField
                value={data.otherDeliveryTools || ""}
                onChange={(e) => onChange({ otherDeliveryTools: e.target.value })}
                placeholder="Especifique"
              />
            </Box>
          </FormGroup>
        </FormControl>
      </Box>

      {/* Question 6 */}
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
          Quantas liberações (deploys) são realizadas por mês, em média?
        </Typography>
        <TextField
          fullWidth
          type="number"
          value={data.deploysPerMonth || ""}
          onChange={(e) => onChange({ deploysPerMonth: e.target.value })}
          placeholder="Número"
        />
      </Box>

      {/* Question 7 */}
      <Box>
        <FormControl component="fieldset" fullWidth>
          <FormLabel component="legend" sx={{ fontWeight: 600, mb: 2 }}>
            A FATTO seria responsável pela liberação de novas versões?
          </FormLabel>
          <RadioGroup
            value={data.fattoReleaseResponsibility || ""}
            onChange={(e) => onChange({ fattoReleaseResponsibility: e.target.value })}
          >
            <FormControlLabel value="fully" control={<Radio />} label="Sim, integralmente" />
            <FormControlLabel value="partially" control={<Radio />} label="Parcialmente (em conjunto)" />
            <FormControlLabel value="no" control={<Radio />} label="Não, apenas entrega de código" />
          </RadioGroup>
        </FormControl>
      </Box>
    </Box>
  );
}
