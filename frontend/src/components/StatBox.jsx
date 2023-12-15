import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import FlexBetween from "./FlexBetween";

const StatBox = ({ title, value, increase, icon, description }) => {
  const theme = useTheme();
  return (
    <Box
      gridColumn="span 1"
      gridRow="span 1"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap="15px"
      p="1.25rem 1rem"
      flex="1 1 100%"
      backgroundColor={theme.palette.background.alt}
      borderRadius="0.55rem"
    >
      {icon}
      <Typography
        variant="h3"
        fontWeight="600"
        align="center"
        sx={{ color: theme.palette.secondary[200] }}
      >
        {value}
      </Typography>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="h6"
          textAlign="center"
          sx={{ color: theme.palette.secondary[100] }}
        >
          {title}
        </Typography>
      </div>
    </Box>
  );
};

export default StatBox;
