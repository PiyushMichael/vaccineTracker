import React, { useState } from 'react';
import {Alert, AlertTitle} from '@material-ui/lab';
import {Box, TextField, Typography, Button, Snackbar, LinearProgress} from '@material-ui/core';

import {getNearbyPincodesApi} from '../api/pincodesApi';
import {PIN_LOOKUP} from '../config/constants';

const PinLookup = ({open, handleClose, setPins}) => {
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const getpins = () => {
    if (pin === '') {
      return '';
    }
    setLoading(true);
    getNearbyPincodesApi(pin, 10)
    .then(res => {
      const pins = [];
      res.data.search_results.forEach((item) => {
        if (pins.indexOf(item.postal_code) === -1) {
          pins.push(item.postal_code)
        }
      });
      setLoading(false);
      handleClose();
      setPins(pins.slice(0,5).join(', '));
      localStorage.setItem(PIN_LOOKUP, 'true');
    })
    .catch(e => {
      setLoading(false);
    });
  };

  if (open) {
    return (
      <div>
        <Snackbar open={error} autoHideDuration={6000} onClose={() => setError(false)} anchorOrigin={{vertical: 'top', horizontal: 'center'}}>
          <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            Could not fetch pincodes.
          </Alert>
        </Snackbar>
        <Alert severity="info">
          <Box display="flex" flexDirection='column'>
            <AlertTitle>Do you want to Pick nearby Pincodes?</AlertTitle>
            <Typography style={{marginTop: 10}} variant="button">CURRENT PIN</Typography>
            <TextField style={{width: 240}} value={pin} placeholder="eg. 110009" onChange={e => setPin(e.target.value)} />
            <Button style={{marginTop: 20, width: 200}} variant="contained" color="danger" onClick={getpins}>Get Nearby Pincodes</Button>
            {loading && <LinearProgress style={{marginTop: 20}} />}
          </Box>
        </Alert>
      </div>
    );
  }
  return (<div />);
};

export default PinLookup;
