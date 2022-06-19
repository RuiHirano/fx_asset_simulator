import React from "react";
import { Box, Menu, MenuItem, AppBar, Toolbar, Typography } from '@mui/material'

export interface Props {
  title: string
}

const Header: React.FC<Props> = ({ title }) => {

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" style={{ backgroundColor: "white" }} elevation={1}>
        <Toolbar>
          <Typography
            style={{ color: "#333631", fontSize: 20, fontWeight: "bold", textDecoration: 'none' }}
          >
            {title}
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;
