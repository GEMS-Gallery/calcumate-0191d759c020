import React, { useState } from 'react';
import { Button, TextField, Grid, Paper, CircularProgress } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { backend } from 'declarations/backend';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196F3',
    },
    secondary: {
      main: '#FFC107',
    },
  },
});

const App: React.FC = () => {
  const [display, setDisplay] = useState('');
  const [operation, setOperation] = useState('');
  const [firstNumber, setFirstNumber] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handleNumberClick = (num: string) => {
    setDisplay(prev => prev + num);
  };

  const handleOperationClick = (op: string) => {
    if (display !== '') {
      setFirstNumber(parseFloat(display));
      setOperation(op);
      setDisplay('');
    }
  };

  const handleClear = () => {
    setDisplay('');
    setOperation('');
    setFirstNumber(null);
  };

  const handleCalculate = async () => {
    if (firstNumber !== null && display !== '') {
      setLoading(true);
      try {
        const result = await backend.calculate(operation, firstNumber, parseFloat(display));
        setDisplay(result.toString());
        setFirstNumber(null);
        setOperation('');
      } catch (error) {
        setDisplay('Error');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Paper elevation={3} style={{ padding: '20px' }}>
        <TextField
          fullWidth
          variant="outlined"
          value={display}
          disabled
          margin="normal"
        />
        <Grid container spacing={1}>
          {['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '=', '+'].map((btn) => (
            <Grid item xs={3} key={btn}>
              <Button
                fullWidth
                variant="contained"
                color={['+', '-', '*', '/'].includes(btn) ? 'secondary' : 'primary'}
                onClick={() => {
                  if (btn === '=') {
                    handleCalculate();
                  } else if (['+', '-', '*', '/'].includes(btn)) {
                    handleOperationClick(btn);
                  } else {
                    handleNumberClick(btn);
                  }
                }}
              >
                {btn}
              </Button>
            </Grid>
          ))}
          <Grid item xs={12}>
            <Button fullWidth variant="contained" color="secondary" onClick={handleClear}>
              Clear
            </Button>
          </Grid>
        </Grid>
        {loading && <CircularProgress style={{ marginTop: '20px' }} />}
      </Paper>
    </ThemeProvider>
  );
};

export default App;