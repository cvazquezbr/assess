import { Box, TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Checkbox, FormGroup, Typography } from "@mui/material";

interface Section1Props {
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

export default function Section1({ data, onChange }: Section1Props) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Question 1 */}
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
          Descreva brevemente o propósito da solução e qual problema de negócio ela resolve.
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          value={data.businessPurpose || ""}
          onChange={(e) => onChange({ businessPurpose: e.target.value })}
          placeholder="Descreva o propósito..."
        />
      </Box>

      {/* Question 2 */}
      <Box>
        <FormControl component="fieldset" fullWidth>
          <FormLabel component="legend" sx={{ fontWeight: 600, mb: 2 }}>
            Em que estágio o produto se encontra hoje?
          </FormLabel>
          <RadioGroup
            value={data.productStage || ""}
            onChange={(e) => onChange({ productStage: e.target.value })}
          >
            <FormControlLabel value="ideation" control={<Radio />} label="Ideação (conceito inicial)" />
            <FormControlLabel value="prototype" control={<Radio />} label="Protótipo / wireframe" />
            <FormControlLabel value="mvp" control={<Radio />} label="MVP (mínimo produto viável)" />
            <FormControlLabel value="operation" control={<Radio />} label="Produto em operação com clientes" />
            <FormControlLabel value="scaling" control={<Radio />} label="Produto em expansão / escala" />
          </RadioGroup>
        </FormControl>
      </Box>

      {/* Question 3 */}
      <Box>
        <FormControl component="fieldset" fullWidth>
          <FormLabel component="legend" sx={{ fontWeight: 600, mb: 2 }}>
            Quantos usuários/clientes ativos o sistema possui atualmente?
          </FormLabel>
          <RadioGroup
            value={data.activeUsers || ""}
            onChange={(e) => onChange({ activeUsers: e.target.value })}
          >
            <FormControlLabel value="none" control={<Radio />} label="Nenhum (em desenvolvimento)" />
            <FormControlLabel value="1-100" control={<Radio />} label="Até 100" />
            <FormControlLabel value="100-1000" control={<Radio />} label="100–1.000" />
            <FormControlLabel value="1000-10000" control={<Radio />} label="1.000–10.000" />
            <FormControlLabel value="above10000" control={<Radio />} label="Acima de 10.000" />
          </RadioGroup>
        </FormControl>
      </Box>

      {/* Question 4 */}
      <Box>
        <FormControl component="fieldset" fullWidth>
          <FormLabel component="legend" sx={{ fontWeight: 600, mb: 2 }}>
            Quais resultados esperam alcançar nos próximos 6–12 meses?
          </FormLabel>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={(data.sixMonthGoals || []).includes("launch-mvp")}
                  onChange={(e) => {
                    const goals = data.sixMonthGoals || [];
                    if (e.target.checked) {
                      onChange({ sixMonthGoals: [...goals, "launch-mvp"] });
                    } else {
                      onChange({ sixMonthGoals: goals.filter((g: string) => g !== "launch-mvp") });
                    }
                  }}
                />
              }
              label="Lançar MVP"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={(data.sixMonthGoals || []).includes("scale-users")}
                  onChange={(e) => {
                    const goals = data.sixMonthGoals || [];
                    if (e.target.checked) {
                      onChange({ sixMonthGoals: [...goals, "scale-users"] });
                    } else {
                      onChange({ sixMonthGoals: goals.filter((g: string) => g !== "scale-users") });
                    }
                  }}
                />
              }
              label="Escalar usuários/clientes"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={(data.sixMonthGoals || []).includes("performance")}
                  onChange={(e) => {
                    const goals = data.sixMonthGoals || [];
                    if (e.target.checked) {
                      onChange({ sixMonthGoals: [...goals, "performance"] });
                    } else {
                      onChange({ sixMonthGoals: goals.filter((g: string) => g !== "performance") });
                    }
                  }}
                />
              }
              label="Aumentar performance/estabilidade"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={(data.sixMonthGoals || []).includes("reduce-costs")}
                  onChange={(e) => {
                    const goals = data.sixMonthGoals || [];
                    if (e.target.checked) {
                      onChange({ sixMonthGoals: [...goals, "reduce-costs"] });
                    } else {
                      onChange({ sixMonthGoals: goals.filter((g: string) => g !== "reduce-costs") });
                    }
                  }}
                />
              }
              label="Reduzir custos de manutenção"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={(data.sixMonthGoals || []).includes("investment")}
                  onChange={(e) => {
                    const goals = data.sixMonthGoals || [];
                    if (e.target.checked) {
                      onChange({ sixMonthGoals: [...goals, "investment"] });
                    } else {
                      onChange({ sixMonthGoals: goals.filter((g: string) => g !== "investment") });
                    }
                  }}
                />
              }
              label="Obter rodadas de investimento"
            />
          </FormGroup>
        </FormControl>
      </Box>

      {/* Question 5 */}
      <Box>
        <FormControl component="fieldset" fullWidth>
          <FormLabel component="legend" sx={{ fontWeight: 600, mb: 2 }}>
            Há metas de prazo ou de investimento associadas a marcos de entrega?
          </FormLabel>
          <RadioGroup
            value={data.hasDeadlineOrInvestment ? "yes" : "no"}
            onChange={(e) => onChange({ hasDeadlineOrInvestment: e.target.value === "yes" })}
          >
            <FormControlLabel value="yes" control={<Radio />} label="Sim" />
            <FormControlLabel value="no" control={<Radio />} label="Não" />
          </RadioGroup>
        </FormControl>
      </Box>

      {/* Question 5 - Details */}
      {data.hasDeadlineOrInvestment && (
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
            Se sim, descreva ou informe datas/valores estimados
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={data.deadlineOrInvestmentDetails || ""}
            onChange={(e) => onChange({ deadlineOrInvestmentDetails: e.target.value })}
            placeholder="Descreva os detalhes..."
          />
        </Box>
      )}
    </Box>
  );
}

