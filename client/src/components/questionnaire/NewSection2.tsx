import { Box, TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Checkbox, FormGroup, Typography } from "@mui/material";

interface Section2Props {
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

export default function Section2({ data, onChange }: Section2Props) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Question 1 */}
      <Box>
        <FormControl component="fieldset" fullWidth>
          <FormLabel component="legend" sx={{ fontWeight: 600, mb: 2 }}>
            Como está organizada a equipe atual?
          </FormLabel>
          <RadioGroup
            value={data.teamOrganization || ""}
            onChange={(e) => onChange({ teamOrganization: e.target.value })}
          >
            <FormControlLabel value="freelancers" control={<Radio />} label="Apenas freelancers" />
            <FormControlLabel value="internal" control={<Radio />} label="Equipe interna fixa" />
            <FormControlLabel value="mixed" control={<Radio />} label="Misto (internos + freelancers)" />
            <FormControlLabel value="no-team" control={<Radio />} label="Sem equipe técnica ativa no momento" />
          </RadioGroup>
        </FormControl>
      </Box>

      {/* Question 2 */}
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
          Quantos profissionais participam atualmente do desenvolvimento?
        </Typography>
        <TextField
          fullWidth
          type="number"
          value={data.numberOfProfessionals || ""}
          onChange={(e) => onChange({ numberOfProfessionals: e.target.value })}
          placeholder="Número"
        />
      </Box>

      {/* Question 3 */}
      <Box>
        <FormControl component="fieldset" fullWidth>
          <FormLabel component="legend" sx={{ fontWeight: 600, mb: 2 }}>
            Perfis existentes:
          </FormLabel>
          <FormGroup>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={(data.existingProfiles || []).includes("frontend")}
                    onChange={(e) => {
                      const profiles = data.existingProfiles || [];
                      if (e.target.checked) {
                        onChange({ existingProfiles: [...profiles, "frontend"] });
                      } else {
                        onChange({ existingProfiles: profiles.filter((p: string) => p !== "frontend") });
                      }
                    }}
                  />
                }
                label="Desenvolvedores Front-end"
              />
              <TextField
                type="number"
                label="Qtde"
                value={data.frontendCount || ""}
                onChange={(e) => onChange({ frontendCount: e.target.value })}
                sx={{ width: '100px' }}
              />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={(data.existingProfiles || []).includes("backend")}
                    onChange={(e) => {
                      const profiles = data.existingProfiles || [];
                      if (e.target.checked) {
                        onChange({ existingProfiles: [...profiles, "backend"] });
                      } else {
                        onChange({ existingProfiles: profiles.filter((p: string) => p !== "backend") });
                      }
                    }}
                  />
                }
                label="Desenvolvedores Back-end"
              />
              <TextField
                type="number"
                label="Qtde"
                value={data.backendCount || ""}
                onChange={(e) => onChange({ backendCount: e.target.value })}
                sx={{ width: '100px' }}
              />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={(data.existingProfiles || []).includes("ux-ui")}
                    onChange={(e) => {
                      const profiles = data.existingProfiles || [];
                      if (e.target.checked) {
                        onChange({ existingProfiles: [...profiles, "ux-ui"] });
                      } else {
                        onChange({ existingProfiles: profiles.filter((p: string) => p !== "ux-ui") });
                      }
                    }}
                  />
                }
                label="UX/UI Designer"
              />
              <TextField
                type="number"
                label="Qtde"
                value={data.uxUiCount || ""}
                onChange={(e) => onChange({ uxUiCount: e.target.value })}
                sx={{ width: '100px' }}
              />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={(data.existingProfiles || []).includes("po-pm")}
                    onChange={(e) => {
                      const profiles = data.existingProfiles || [];
                      if (e.target.checked) {
                        onChange({ existingProfiles: [...profiles, "po-pm"] });
                      } else {
                        onChange({ existingProfiles: profiles.filter((p: string) => p !== "po-pm") });
                      }
                    }}
                  />
                }
                label="Product Owner / PM"
              />
              <TextField
                type="number"
                label="Qtde"
                value={data.poPmCount || ""}
                onChange={(e) => onChange({ poPmCount: e.target.value })}
                sx={{ width: '100px' }}
              />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <FormControlLabel
                    control={
                    <Checkbox
                        checked={(data.existingProfiles || []).includes("architect")}
                        onChange={(e) => {
                        const profiles = data.existingProfiles || [];
                        if (e.target.checked) {
                            onChange({ existingProfiles: [...profiles, "architect"] });
                        } else {
                            onChange({ existingProfiles: profiles.filter((p: string) => p !== "architect") });
                        }
                        }}
                    />
                    }
                    label="Arquiteto de Software"
                />
                <TextField
                    type="number"
                    label="Qtde"
                    value={data.architectCount || ""}
                    onChange={(e) => onChange({ architectCount: e.target.value })}
                    sx={{ width: '100px' }}
                />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <FormControlLabel
                    control={
                    <Checkbox
                        checked={(data.existingProfiles || []).includes("devops")}
                        onChange={(e) => {
                        const profiles = data.existingProfiles || [];
                        if (e.target.checked) {
                            onChange({ existingProfiles: [...profiles, "devops"] });
                        } else {
                            onChange({ existingProfiles: profiles.filter((p: string) => p !== "devops") });
                        }
                        }}
                    />
                    }
                    label="DevOps / Infraestrutura"
                />
                <TextField
                    type="number"
                    label="Qtde"
                    value={data.devopsCount || ""}
                    onChange={(e) => onChange({ devopsCount: e.target.value })}
                    sx={{ width: '100px' }}
                />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <FormControlLabel
                    control={
                    <Checkbox
                        checked={(data.existingProfiles || []).includes("qa")}
                        onChange={(e) => {
                        const profiles = data.existingProfiles || [];
                        if (e.target.checked) {
                            onChange({ existingProfiles: [...profiles, "qa"] });
                        } else {
                            onChange({ existingProfiles: profiles.filter((p: string) => p !== "qa") });
                        }
                        }}
                    />
                    }
                    label="QA / Testes"
                />
                <TextField
                    type="number"
                    label="Qtde"
                    value={data.qaCount || ""}
                    onChange={(e) => onChange({ qaCount: e.target.value })}
                    sx={{ width: '100px' }}
                />
            </Box>
          </FormGroup>
        </FormControl>
      </Box>

      {/* Question 4 */}
      <Box>
        <FormControl component="fieldset" fullWidth>
          <FormLabel component="legend" sx={{ fontWeight: 600, mb: 2 }}>
            O vínculo dos profissionais é:
          </FormLabel>
          <RadioGroup
            value={data.professionalBond || ""}
            onChange={(e) => onChange({ professionalBond: e.target.value })}
          >
            <FormControlLabel value="partial" control={<Radio />} label="Dedicação parcial" />
            <FormControlLabel value="full" control={<Radio />} label="Dedicação integral" />
            <FormControlLabel value="on-demand" control={<Radio />} label="Sob demanda / por entrega" />
          </RadioGroup>
        </FormControl>
      </Box>

      {/* Question 5 */}
      <Box>
        <FormControl component="fieldset" fullWidth>
          <FormLabel component="legend" sx={{ fontWeight: 600, mb: 2 }}>
            A FATTO seria:
          </FormLabel>
          <RadioGroup
            value={data.fattoRole || ""}
            onChange={(e) => onChange({ fattoRole: e.target.value })}
          >
            <FormControlLabel value="substitute" control={<Radio />} label="Substituta da equipe atual" />
            <FormControlLabel value="complementary" control={<Radio />} label="Complementar à equipe existente" />
            <FormControlLabel value="responsible" control={<Radio />} label="Responsável por todo o ciclo de desenvolvimento" />
          </RadioGroup>
        </FormControl>
      </Box>
    </Box>
  );
}
