import React from "react";
import { Box, Menu, MenuItem, AppBar, Toolbar, Typography, Paper } from '@mui/material'
import { Result } from "../App";
import Growth from "./Growth";

export interface Props {
  result: Result
}

const ResultBoard: React.FC<Props> = ({ result }) => {

  return (
    <div>
      <div style={{ display: "flex", justifyContent: 'center', alignItems: 'center', margin: 5 }}>
        <Typography style={{ fontSize: 20, fontWeight: 'bold' }}>損益シミュレーション結果</Typography>
      </div>
      <Paper style={{ padding: 20, marginTop: 20 }}>
        <Growth result={result} />
      </Paper>
    </div>
  );
};

export default ResultBoard;
