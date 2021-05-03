import React, {useState, useEffect} from 'react';
import '../App.css';
import moment from 'moment';
import {Box, TextField, Button, Typography, Card, CardHeader, CardContent, Collapse, IconButton, Checkbox, Snackbar} from '@material-ui/core';
import {Alert, AlertTitle} from '@material-ui/lab';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import {makeStyles} from '@material-ui/core/styles';
import clsx from 'clsx';

import {getAppointmentsHelper} from '../helpers/vaccines';
import PinLookup from '../components/PinLookup';
import {PIN_LOOKUP, PINCODE} from '../config/constants';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
}));

const App = () => {
  const classes = useStyles();
  const [pins, setPins] = useState(localStorage.getItem(PINCODE) ? localStorage.getItem(PINCODE) : '');
  const [days, setDays] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [expanded, setExpanded] = useState([]);
  const [eighteenPlus, setEighteenPlus] = useState(false);
  const [error, setError] = useState(false);
  const [pinLookupModal, setPinLookupModal] = useState(false);

  useEffect(() => {
    const pinLookup = localStorage.getItem(PIN_LOOKUP);
    if (pinLookup === 'true') {
      setPinLookupModal(false);
    } else {
      setPinLookupModal(true);
    }
  }, []);

  const setPinCodes = (val) => {
    localStorage.setItem(PINCODE, val);
    setPins(val);
  };

  const getAppointments = async () => {
    if (pins === '' || days === '') {
      setError(true);
      return;
    }
    if (isNaN(parseInt(days, 10))) {
      setError(true);
      return;
    }
    const results = await getAppointmentsHelper(pins, days);
    setAppointments(results);
  };

  const filteredAppointments = eighteenPlus ? appointments.filter(item => item.min_age_limit === 18) : appointments;

  return (
    <div style={{ padding: 20, backgroundColor: '#fafafa' }}>
      <Snackbar open={error} autoHideDuration={6000} onClose={() => setError(false)} anchorOrigin={{vertical: 'top', horizontal: 'center'}}>
        <Alert severity="warning">
          <AlertTitle>Warning</AlertTitle>
          Make sure pincodes and day numbers are valid.
        </Alert>
      </Snackbar>
      <PinLookup open={pinLookupModal} handleClose={() => setPinLookupModal(false)} setPins={setPinCodes} />
      <Box style={{ maxWidth: 340, marginTop: 10 }}>
        <Typography style={{marginTop: 20}} variant="button">PIN CODES (seperated by commas)</Typography>
        <TextField style={{width: 320}} value={pins} placeholder="eg. 110009, 201014, 390012" onChange={e => setPinCodes(e.target.value)} />
        <Typography style={{marginTop: 20}} variant="button">DAYS</Typography>
        <TextField style={{width: 320}} value={days} placeholder="e.g. 3" onChange={e => setDays(e.target.value)} />
        <Typography/>
        <Box display="flex" alignItems="center" style={{marginTop: 10}}>
          <Checkbox
            checked={eighteenPlus}
            onChange={() => setEighteenPlus(!eighteenPlus)}
            name="18+"
            color="primary"
          />
          <Typography>Do you want to see 18+ minimum age centres only?</Typography>
        </Box>
        <Button style={{marginTop: 20}} variant="contained" color="primary" onClick={getAppointments}>Get Appointments</Button>
      </Box>
      <div style={{ marginTop: 20 }}>
        {filteredAppointments.map((appointment, index) => (
          <Card
            key={index.toString()}
            style={{ marginTop: 32, maxWidth: 400 }}
            onClick={() => {
              const temp =[...expanded];
              temp[index] = !temp[index];
              setExpanded(temp);
            }}
          >
            <CardHeader
              title={`${appointment.name} (${appointment.district_name})`}
              subheader={`${moment(appointment.date, 'DD-MM-YYYY').format('Do MMM, YYYY')} - Min Age: ${appointment.min_age_limit}`}
            />
            <Box display="flex" flexDirection="row" alignItems="flex-end">
              <IconButton
                className={clsx(classes.expand, {
                  [classes.expandOpen]: expanded[index],
                })}
                onClick={() => {
                  const temp =[...expanded];
                  temp[index] = !temp[index];
                  setExpanded(temp);
                }}
                aria-expanded={expanded[index]}
                aria-label="show more"
                style={{marginTop: -24}}
              >
                <KeyboardArrowDown fontSize="large" />
              </IconButton>
            </Box>
            <Collapse in={expanded[index]} timeout="auto" unmountOnExit>
              <CardContent>
                <Typography style={{marginTop: -20}} variant="subtitle2">Doses: {appointment.available_capacity}</Typography>
                <Box display="flex" flexDirection="column">
                  {appointment.slots.map((slot, id) => (
                    <Typography variant="caption" key={`${index}-${id}`}>{slot}</Typography>
                  ))}
                </Box>
              </CardContent>
            </Collapse>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default App;
