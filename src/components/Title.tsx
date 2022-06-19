import React from "react";
import { Box, Menu, MenuItem, AppBar, Toolbar, Typography } from '@mui/material'

export interface Props {
  title: string
  description: string
}

const Title: React.FC<Props> = ({ title, description }) => {

  return (
    <div>
      <Typography
        style={{ color: "#333631", fontSize: 30, fontWeight: "bold", textDecoration: 'none' }}
      >
        {title}
      </Typography>
      <Typography style={{ marginTop: 10 }}>
        {description}
      </Typography>
    </div>
  );
};

export default Title;
