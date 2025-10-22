import { Box, TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Checkbox, FormGroup, Typography } from "@mui/material";

interface Section10Props {
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

export default function Section10({ data, onChange }: Section10Props) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Question 1 */}
      <Box>
        <FormControl component="fieldset" fullWidth>
          <FormLabel component="legend" sx={{ fontWeight: 600, mb: 2 }}>
            Papel esperado da FATTO:
          </FormLabel>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={(data.fattoExpectedRole || []).includes("consulting")}
                  onChange={(e) => {
                    const roles = data.fattoExpectedRole || [];
                    if (e.target.checked) {
                      onChange({ fattoExpectedRole: [...roles, "consulting"] });
                    } else {
                      onChange({ fattoExpectedRole: roles.filter((r: string) => r !== "consulting") });
                    }
                  }}
                />
              }
              label="Consultoria técnica e arquitetura"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={(data.fattoExpectedRole || []).includes("development")}
                  onChange={(e) => {
                    const roles = data.fattoExpectedRole || [];
                    if (e.target.checked) {
                      onChange({ fattoExpectedRole: [...roles, "development"] });
                    } else {
                      onChange({ fattoExpectedRole: roles.filter((r: string) => r !== "development") });
                    }
                  }}
                />
              }
              label="Desenvolvimento completo"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={(data.fattoExpectedRole || []).includes("support")}
                  onChange={(e) => {
                    const roles = data.fattoExpectedRole || [];
                    if (e.target.checked) {
                      onChange({ fattoExpectedRole: [...roles, "support"] });
                    } else {
                      onChange({ fattoExpectedRole: roles.filter((r: string) => r !== "support") });
                    }
                  }}
                />
              }
              label="Sustentação e suporte"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={(data.fattoExpectedRole || []).includes("devops")}
                  onChange={(e) => {
                    const roles = data.fattoExpectedRole || [];
                    if (e.target.checked) {
                      onChange({ fattoExpectedRole: [...roles, "devops"] });
                    } else {
                      onChange({ fattoExpectedRole: roles.filter((r: string) => r !== "devops") });
                    }
                  }}
                />
              }
              label="DevOps / pipeline"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={(data.fattoExpectedRole || []).includes("qa")}
                  onChange={(e) => {
                    const roles = data.fattoExpectedRole || [];
                    if (e.target.checked) {
                      onChange({ fattoExpectedRole: [...roles, "qa"] });
                    } else {
                      onChange({ fattoExpectedRole: roles.filter((r: string) => r !== "qa") });
                    }
                  }}
                />
              }
              label="QA e automação"
            />
          </FormGroup>
        </FormControl>
      </Box>

      {/* Question 2 */}
      <Box>
        <FormControl component="fieldset" fullWidth>
          <FormLabel component="legend" sx={{ fontWeight: 600, mb: 2 }}>
            Entregas prioritárias:
          </FormLabel>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={(data.priorityDeliveries || []).includes("prototype")}
                  onChange={(e) => {
                    const deliveries = data.priorityDeliveries || [];
                    if (e.target.checked) {
                      onChange({ priorityDeliveries: [...deliveries, "prototype"] });
                    } else {
                      onChange({ priorityDeliveries: deliveries.filter((d: string) => d !== "prototype") });
                    }
                  }}
                />
              }
              label="Protótipo"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={(data.priorityDeliveries || []).includes("mvp")}
                  onChange={(e) => {
                    const deliveries = data.priorityDeliveries || [];
                    if (e.target.checked) {
                      onChange({ priorityDeliveries: [...deliveries, "mvp"] });
                    } else {
                      onChange({ priorityDeliveries: deliveries.filter((d: string) => d !== "mvp") });
                    }
                  }}
                />
              }
              label="MVP"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={(data.priorityDeliveries || []).includes("refactoring")}
                  onChange={(e) => {
                    const deliveries = data.priorityDeliveries || [];
                    if (e.target.checked) {
                      onChange({ priorityDeliveries: [...deliveries, "refactoring"] });
                    } else {
                      onChange({ priorityDeliveries: deliveries.filter((d: string) => d !== "refactoring") });
                    }
                  }}
                />
              }
              label="Refatoração"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={(data.priorityDeliveries || []).includes("migration")}
                  onChange={(e) => {
                    const deliveries = data.priorityDeliveries || [];
                    if (e.target.checked) {
                      onChange({ priorityDeliveries: [...deliveries, "migration"] });
                    } else {
                      onChange({ priorityDeliveries: deliveries.filter((d: string) => d !== "migration") });
                    }
                  }}
                />
              }
              label="Migração de ambiente"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={(data.priorityDeliveries || []).includes("performance")}
                  onChange={(e) => {
                    const deliveries = data.priorityDeliveries || [];
                    if (e.target.checked) {
                      onChange({ priorityDeliveries: [...deliveries, "performance"] });
                    } else {
                      onChange({ priorityDeliveries: deliveries.filter((d: string) => d !== "performance") });
                    }
                  }}
                />
              }
              label="Melhoria de performance"
            />
          </FormGroup>
        </FormControl>
      </Box>

      {/* Question 3 */}
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
          Quantas entregas principais estão previstas no curto prazo (até 3 meses)?
        </Typography>
        <TextField
          fullWidth
          type="number"
          value={data.shortTermDeliveries || ""}
          onChange={(e) => onChange({ shortTermDeliveries: e.target.value })}
          placeholder="Número"
        />
      </Box>

      {/* Question 4 */}
      <Box>
        <FormControl component="fieldset" fullWidth>
          <FormLabel component="legend" sx={{ fontWeight: 600, mb: 2 }}>
            Grau de autonomia esperado da FATTO:
          </FormLabel>
          <RadioGroup
            value={data.fattoAutonomy || ""}
            onChange={(e) => onChange({ fattoAutonomy: e.target.value })}
          >
            <FormControlLabel value="total" control={<Radio />} label="Total (gestão técnica e entrega)" />
            <FormControlLabel value="partial" control={<Radio />} label="Parcial (decisões compartilhadas)" />
            <FormControlLabel value="support" control={<Radio />} label="Apoio técnico sob direção do cliente" />
          </RadioGroup>
        </FormControl>
      </Box>
    </Box>
  );
}
