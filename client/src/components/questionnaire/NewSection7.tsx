import { Box, TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Checkbox, FormGroup, Typography } from "@mui/material";

interface Section7Props {
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

export default function Section7({ data, onChange }: Section7Props) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Question 1 */}
      <Box>
        <FormControl component="fieldset" fullWidth>
          <FormLabel component="legend" sx={{ fontWeight: 600, mb: 2 }}>
            Frequência das reuniões de equipe:
          </FormLabel>
          <RadioGroup
            value={data.meetingFrequency || ""}
            onChange={(e) => onChange({ meetingFrequency: e.target.value })}
          >
            <FormControlLabel value="daily" control={<Radio />} label="Diárias" />
            <FormControlLabel value="weekly" control={<Radio />} label="Semanais" />
            <FormControlLabel value="biweekly" control={<Radio />} label="Quinzenais" />
            <FormControlLabel value="on-demand" control={<Radio />} label="Sob demanda" />
          </RadioGroup>
        </FormControl>
      </Box>

      {/* Question 2 */}
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
          Quantas pessoas participam das reuniões regulares?
        </Typography>
        <TextField
          fullWidth
          type="number"
          value={data.meetingParticipants || ""}
          onChange={(e) => onChange({ meetingParticipants: e.target.value })}
          placeholder="Número"
        />
      </Box>

      {/* Question 3 */}
      <Box>
        <FormControl component="fieldset" fullWidth>
          <FormLabel component="legend" sx={{ fontWeight: 600, mb: 2 }}>
            Há Product Owner definido?
          </FormLabel>
          <RadioGroup
            value={data.hasProductOwner ? "yes" : "no"}
            onChange={(e) => onChange({ hasProductOwner: e.target.value === "yes" })}
          >
            <FormControlLabel value="yes" control={<Radio />} label="Sim" />
            <FormControlLabel value="no" control={<Radio />} label="Não" />
          </RadioGroup>
        </FormControl>
      </Box>

      {/* Question 4 */}
      <Box>
        <FormControl component="fieldset" fullWidth>
          <FormLabel component="legend" sx={{ fontWeight: 600, mb: 2 }}>
            Ferramentas de gestão de backlog:
          </FormLabel>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={(data.backlogTools || []).includes("jira")}
                  onChange={(e) => {
                    const tools = data.backlogTools || [];
                    if (e.target.checked) {
                      onChange({ backlogTools: [...tools, "jira"] });
                    } else {
                      onChange({ backlogTools: tools.filter((tool: string) => tool !== "jira") });
                    }
                  }}
                />
              }
              label="Jira"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={(data.backlogTools || []).includes("trello")}
                  onChange={(e) => {
                    const tools = data.backlogTools || [];
                    if (e.target.checked) {
                      onChange({ backlogTools: [...tools, "trello"] });
                    } else {
                      onChange({ backlogTools: tools.filter((tool: string) => tool !== "trello") });
                    }
                  }}
                />
              }
              label="Trello"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={(data.backlogTools || []).includes("clickup")}
                  onChange={(e) => {
                    const tools = data.backlogTools || [];
                    if (e.target.checked) {
                      onChange({ backlogTools: [...tools, "clickup"] });
                    } else {
                      onChange({ backlogTools: tools.filter((tool: string) => tool !== "clickup") });
                    }
                  }}
                />
              }
              label="ClickUp"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={(data.backlogTools || []).includes("monday")}
                  onChange={(e) => {
                    const tools = data.backlogTools || [];
                    if (e.target.checked) {
                      onChange({ backlogTools: [...tools, "monday"] });
                    } else {
                      onChange({ backlogTools: tools.filter((tool: string) => tool !== "monday") });
                    }
                  }}
                />
              }
              label="Monday"
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
              <Typography>Outra:</Typography>
              <TextField
                value={data.otherBacklogTool || ""}
                onChange={(e) => onChange({ otherBacklogTool: e.target.value })}
                placeholder="Especifique"
              />
            </Box>
          </FormGroup>
        </FormControl>
      </Box>

      {/* Question 5 */}
      <Box>
        <FormControl component="fieldset" fullWidth>
          <FormLabel component="legend" sx={{ fontWeight: 600, mb: 2 }}>
            Nível de formalização das decisões:
          </FormLabel>
          <RadioGroup
            value={data.decisionFormalization || ""}
            onChange={(e) => onChange({ decisionFormalization: e.target.value })}
          >
            <FormControlLabel value="high" control={<Radio />} label="Alto (documentado)" />
            <FormControlLabel value="medium" control={<Radio />} label="Médio (registrado parcialmente)" />
            <FormControlLabel value="low" control={<Radio />} label="Baixo (decisões informais)" />
          </RadioGroup>
        </FormControl>
      </Box>
    </Box>
  );
}
