import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { withStyles } from '@mui/styles';
import { Button } from '@mui/material';
const CssTextField = withStyles({
    root: {
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: 'rgba(255, 255, 255, 0.3);',
          borderWidth: '2px'
        }
      },
    },
  })(TextField);


export default function Trade() {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
                <Grid item xs={4}>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        marginTop:2,
                        p: 2,
                        backgroundColor: 'rgba(20, 17, 25, 1)',
                        borderRadius: 2
                    }}>
                        <Box
                            sx={{
                                display: 'flex',
                                paddingTop: 1,
                                fontSize: '1rem',
                                fontWeight: '700',
                            }}
                        >
                            {"Buy $AZUKI with ETH"}
                        </Box>
                        <CssTextField 
                            sx={{
                                marginTop:2,
                                display: 'flex',
                                fontSize: '1rem',
                                fontWeight: '700',
                                input:{color:'white'}
                            }}
                            id="outlined-basic" 
                            fullWidth
                            variant="outlined" />
                         <Box sx={{height:60,marginTop:1}}></Box>    
                        <Box
                            sx={{
                                display: 'flex',
                                marginTop:1,
                                color:'rgba(255, 255, 255, 0.4)',
                                fontFamily: 'Poppins',
                                fontSize: '0.7rem',
                                fontWeight: '700',
                            }}
                        >
                            {"0.44"}
                        </Box>
                        <Button sx={{marginTop:2, height:60}} variant="contained" size="large" fullWidth>Buy</Button>
                    </Box>
                </Grid>
                <Grid item xs={4}>
                <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        marginTop:2,
                        p: 2,
                        backgroundColor: 'rgba(20, 17, 25, 1)',
                        borderRadius: 2
                    }}>
                        <Box
                            sx={{
                                display: 'flex',
                                paddingTop: 1,
                                fontSize: '1rem',
                                fontWeight: '700',
                            }}
                        >
                            {"Sell $AZUKI with ETH"}
                        </Box>
                        <CssTextField 
                            sx={{
                                marginTop:2,
                                display: 'flex',
                                fontSize: '1rem',
                                fontWeight: '700',
                                height:60,
                                input:{color:'white'}
                            }}
                            id="outlined-basic" 
                            fullWidth
                            variant="outlined" />
                        <Box sx={{height:60,marginTop:1}}></Box>                        
                        <Box
                            sx={{
                                display: 'flex',
                                marginTop:1,
                                color:'rgba(255, 255, 255, 0.4)',
                                fontFamily: 'Poppins',
                                fontSize: '0.7rem',
                                fontWeight: '700',
                            }}
                        >
                            {"$0.44"}
                        </Box>
                        <Button sx={{marginTop:2, height:60}} variant="contained" size="large" fullWidth>Sell</Button>
                    </Box>
                </Grid>
                <Grid item xs={4}>
                <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        marginTop:2,
                        p: 2,
                        backgroundColor: 'rgba(20, 17, 25, 1)',
                        borderRadius: 2
                    }}>
                        <Box
                            sx={{
                                display: 'flex',
                                paddingTop: 1,
                                fontSize: '1rem',
                                fontWeight: '700',
                            }}
                        >
                            {"Stake $AZUKI with ETH"}
                        </Box>
                        <CssTextField 
                            sx={{
                                marginTop:2,
                                display: 'flex',
                                fontSize: '1rem',
                                fontWeight: '700',
                                input:{color:'white'}
                            }}
                            id="outlined-basic" 
                            fullWidth
                            variant="outlined" />
                        <CssTextField 
                            sx={{
                                marginTop:2,
                                display: 'flex',
                                fontSize: '1rem',
                                fontWeight: '700',
                                input:{color:'white'}
                            }}
                            id="outlined-basic" 
                            fullWidth
                            variant="outlined" />
                        <Box
                            sx={{
                                display: 'flex',
                                marginTop:1,
                                color:'rgba(255, 255, 255, 0.4)',
                                fontFamily: 'Poppins',
                                fontSize: '0.7rem',
                                fontWeight: '700',
                            }}
                        >
                            {"33% Interest Rate"}
                        </Box>
                        <Button sx={{marginTop:2, height:60}} variant="contained" size="large" fullWidth>Stake</Button>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}