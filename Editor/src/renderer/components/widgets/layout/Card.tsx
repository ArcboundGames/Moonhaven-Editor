import MuiCard from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import type { Theme } from '@mui/material/styles';
import type { SxProps } from '@mui/system';

export interface FormBoxProps {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  sx?: SxProps<Theme> | undefined;
}

const Card = ({ header, footer, children, sx = {} }: FormBoxProps) => {
  return (
    <MuiCard sx={{ m: 1, ...sx }}>
      <CardContent>
        {header ? (
          <Typography gutterBottom variant="h6" component="div">
            {header}
          </Typography>
        ) : null}
        {children}
      </CardContent>
      {footer}
    </MuiCard>
  );
};

export default Card;
