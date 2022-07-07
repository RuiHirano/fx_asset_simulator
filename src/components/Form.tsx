import React, { useState } from "react";
import { Box, Menu, MenuItem, AppBar, Toolbar, Typography, Button, TextField, Paper, ButtonGroup } from '@mui/material'
import { defaultInputData, InputData } from "../App";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import LoadingButton from '@mui/lab/LoadingButton';

const InputLabel: React.FC<{ label: string, hint: string, children: React.ReactNode }> = ({ label, hint, children }) => {
  return (
    <div>
      <Typography style={{ fontSize: 15, color: 'black', fontWeight: 'bold' }}>
        {label}
      </Typography>
      <div style={{ marginLeft: 30, marginTop: 15, marginBottom: 15 }}>
        {children}
      </div>
    </div>
  );
}

const InputField: React.FC<{ label?: string, error?: string, value: number, unit: string, description: string, hints: any[], onChange: (event: React.ChangeEvent<HTMLInputElement>) => void }> = ({ label, error, value, unit, description, hints, onChange }) => {
  return (
    <div style={{ marginTop: 10, marginBottom: 10 }}>
      <div style={{ display: 'flex' }}>
        {label &&
          <Typography style={{ fontSize: 15, color: 'black', marginRight: 10 }}>
            {label}
          </Typography>
        }
        <TextField type="number" size="small" defaultValue={value} onChange={onChange} />
        <Typography style={{ marginLeft: 10, fontSize: 15, color: 'black' }}>
          {unit}
        </Typography>
      </div>
      <Typography style={{ fontSize: 15, color: error ? 'red' : 'gray' }} color="inherit">
        {description}
      </Typography>
    </div>
  );
}

const SelectField: React.FC<{ label?: string, error?: string, value: string, values: { key: string, label: string }[], description: string, hints: any[], onChange: (value: string) => void }> = ({ label, error, value, values, description, hints, onChange }) => {
  const [val, setVal] = useState(value)
  return (
    <div style={{ marginTop: 10, marginBottom: 10 }}>
      <div style={{ display: 'flex' }}>
        {label &&
          <Typography style={{ fontSize: 15, color: 'black', marginRight: 10 }}>
            {label}
          </Typography>
        }
        <ButtonGroup variant="contained" aria-label="outlined primary button group">
          {values.map((v, i) => {
            return (
              <Button style={{ backgroundColor: val === v.key ? 'gray' : undefined }} key={i} onClick={(e) => { setVal(v.key); onChange(v.key) }}>
                {v.label}
              </Button>
            )
          })}
        </ButtonGroup>
        {values.map((v, i) => {
          if (v.key === val) {
            return (
              <Typography key={i} style={{ marginLeft: 10, fontSize: 15, color: 'black' }}>
                {v.label}
              </Typography>
            )
          }
        })}
      </div>
      <Typography style={{ fontSize: 15, color: error ? 'red' : 'gray' }} color="inherit">
        {description}
      </Typography>
    </div>
  );
}

export interface Props {
  onSubmit: (data: InputData) => void
}

const schema = yup.object({
  balance: yup.number().positive().integer().max(999999999).min(10000).required(),
  type: yup.string().required(),
  risk: yup.number().positive().min(0).max(100).required(),
  reward: yup.number().positive().min(0).max(100).required(),
  winRate: yup.number().positive().min(0).max(100).required(),
  bankruptcyLevel: yup.number().positive().min(0).max(100).required(),
  monthlyTradeNum: yup.number().positive().integer().min(0).max(1000).required(),
  simulationMonthNum: yup.number().positive().integer().min(0).max(60).required(),
  simulationNum: yup.number().positive().integer().min(0).max(100).required(),
}).required();

function delay(n: number) {
  return new Promise(function (resolve) {
    setTimeout(resolve, n * 1000);
  });
}

const Form: React.FC<Props> = ({ onSubmit }) => {
  const [loading, setLoading] = React.useState<boolean>(false);

  const submit = async (data: InputData) => {
    setLoading(true)
    await delay(0.5)
    onSubmit(data)
    setLoading(false)
  }

  const { handleSubmit, setValue, getValues, formState: { errors } } = useForm<InputData>(
    { defaultValues: defaultInputData, resolver: yupResolver(schema) }
  );

  return (
    <Paper style={{ padding: 20 }}>
      <InputLabel label="開始時の口座資産を入力してください" hint="hint">
        <InputField label="" error={errors.balance?.message} value={getValues("balance")} unit="円" description="半角数字のみ、10,000～999,999,999まで" hints={[]} onChange={(e) => { setValue("balance", parseInt(e.target.value)) }} />
      </InputLabel>
      <InputLabel label="1回のトレードで想定しているリスク（想定損失額）を口座資産に対する割合で入力してください。" hint="hint">
        <InputField label="" value={getValues("risk") * 100} unit="％" description="半角数字のみ、0～100まで、かつ小数点以下第2位まで" hints={[]} onChange={(e) => { setValue("risk", parseFloat(e.target.value) / 100) }} />
      </InputLabel>
      <InputLabel label="1回のトレードで想定している利益（想定利益額）を口座資産に対する割合で入力してください。" hint="hint">
        <InputField label="" value={getValues("reward") * 100} unit="％" description="半角数字のみ、0～100まで、かつ小数点以下第2位まで" hints={[]} onChange={(e) => { setValue("reward", parseFloat(e.target.value) / 100) }} />
      </InputLabel>
      <InputLabel label="想定している勝率を入力してください。" hint="hint">
        <InputField label="" value={getValues("winRate") * 100} unit="％" description="半角数字のみ、0～100まで、かつ小数点以下第2位まで" hints={[]} onChange={(e) => { setValue("winRate", parseFloat(e.target.value) / 100) }} />
      </InputLabel>
      <InputLabel label="破産水準を指定してください。" hint="hint">
        <InputField label="" value={getValues("bankruptcyLevel") * 100} unit="％" description="半角数字のみ、0～100まで、かつ小数点以下第2位まで" hints={[]} onChange={(e) => { setValue("bankruptcyLevel", parseFloat(e.target.value) / 100) }} />
      </InputLabel>
      <InputLabel label="シミュレーション内容を指定してください。" hint="hint">
        <InputField label="シミュレーション回数" value={getValues("simulationNum")} unit="回" description="半角数字のみ、0～100まで" hints={[]} onChange={(e) => { setValue("simulationNum", parseInt(e.target.value)) }} />
        <InputField label="月当たりのトレード件数" value={getValues("monthlyTradeNum")} unit="件" description="半角数字のみ、0～1000まで" hints={[]} onChange={(e) => { setValue("monthlyTradeNum", parseInt(e.target.value)) }} />
        <InputField label="シミュレーション期間" error={errors.simulationMonthNum?.message} value={getValues("simulationMonthNum")} unit="ヶ月" description="半角数字のみ、0～60まで" hints={[]} onChange={(e) => { setValue("simulationMonthNum", parseInt(e.target.value)) }} />
        <SelectField label="損益計算方法" error={errors.type?.message} value={getValues("type")} values={[{ key: "fixed", label: "固定損益(単利計算)" }, { key: "variable", label: "変動損益(複利計算)" }]} description="" hints={[]} onChange={(value: string) => { setValue("type", value === "fixed" ? "fixed" : "variable") }} />
      </InputLabel>
      <div style={{ marginTop: 20, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <LoadingButton loading={loading} size="large" style={{ fontWeight: 'bold' }} variant="contained" onClick={handleSubmit(submit)}>計算する</LoadingButton>
      </div>
    </Paper>
  );
};

export default Form;
