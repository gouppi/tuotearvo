import React from 'react'
import Navigation from '../components/Navigation';
import {makeStyles, withStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Rating from '@material-ui/lab/Rating';
import Box from '@material-ui/core/Box';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Badge from '@material-ui/core/Badge';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';

import SingleReviewComponent from '../components/SingleReview';
function createData(key, value) {
    return { key,value};
  }
  
  const rows = [
    createData('Valmistaja', 'Apple'),
    createData('Tuotekoodi', 'MRXJ2ZM/A / MRXJ2'),
    createData('EAN', '0190198764829'),
    createData('UNSPSC-koodi', '43191609'),
    createData('PID', '539585')
  ];

  const superLong = `Käytän Airpodeja monipuolisesti podcast-, ääni-, puhelin-, videoneuvottelu- ja musiikkikäytössä. Ne helpottavat etätyötä erinomaisesti ja voin entistä paremmin kommunikoida ja kuunnella missä tilanteissa vain.\n\n
  Entuudestaan minulla on langattomat Bose Soundsport korvanapit ja on ollut myös Airpodit (ver 1).

  Vastamelutoiminto on vakuuttava ja toimii todella hyvin. Vastamelun ja normaalitilan saa helposti vaihdettua korvanapista. Normaalitila vahvistaa lievästi ääniä kuulolaitteen kaltaisesti ja tuntuu, että kaikki ympärillä kahisee. Vahvistusta ei tietääkseni saa pois. Latauskotelo erittäin kätevä, kuten vanhemmissakin malleissa, mutta voi nyt ladata langattomasti. Nämä Airpodit, toisin kuin aiemmat, eivät tunnu jatkuvasti tippuvan korvilta. Toki tippuvat helpommin kuin Boset. Käytän pienintä sovitetta. Käyttömukavuus on hyvä, mutta korvat alkaa kipuilla parin tunnin yhtämittaisen käytön jälkeen toisin kuin Boseissa.
  
  Äänenlaatu on puhekäyttöön hyvä, mutta jos haluan kuunnella lenkillä pääosin musiikkia, valitsen mukaan ehdottomasti Boset. Boseissa äänenlaatu on huomattavasti erottelukykyisempi ja täyteläisempi. Ilmeisesti mikrofonin laatu on huono, koska vastapuoli on todella usein maininnut, että kuuluu erittäin huonosti tai ei saa selvää. Tämä sekä sisällä, että ulkona, vastamelu päällä ja poissa. Ääni on vastapuolien mukaan heti parantunut, jos olen vaihtanut äänet puhelimeen. Puhelimenani on iPhone 11 Pro, joten ei luulisi senkään heikentävän tilannetta.
  
  Ostaisin nämä käytettävyyden vuoksi uudelleen, mutta musiikkinautintoihin mielellään paremmat, kuten Boset.`;
  


const useStyles = makeStyles({
    rootContainer:{
        padding:'10px',
        marginTop:'1rem',
    },
    foobar:{
        display:'flex',
        flexDirection:'row',
    }
});

const AntTabs = withStyles({
    root: {
      borderBottom: '1px solid #e8e8e8',
    },
    indicator: {
      backgroundColor: '#1890ff',
    },
  })(Tabs);
  
  const AntTab = withStyles((theme) => ({
    root: {
      textTransform: 'none',
      minWidth: 72,
      fontWeight: theme.typography.fontWeightRegular,
      marginRight: theme.spacing(4),
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
      '&:hover': {
        color: '#40a9ff',
        opacity: 1,
      },
      '&$selected': {
        color: '#1890ff',
        fontWeight: theme.typography.fontWeightMedium,
      },
      '&:focus': {
        color: '#40a9ff',
      },
    },
    selected: {},
  }))((props) => <Tab disableRipple {...props} />);


export default function SingleReview() {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);
    
    const handleChange = (event, newValue) => {
        setValue(newValue);
      };

    const bestReview = "Vuoden aikana n. 1 000 euroa Bluetooth-kuulokkeisiin sijoittaneena on pakko tunnustaa, että nämä ovat loppujen lopuksi parhaat...";

    return (
        <React.Fragment>
            
            <Container maxWidth="md"  >
            <CardMedia
                        style={{marginTop:'10px', maxWidth:1200, margin: '5px auto'}}
                        component="img"
                        alt="Contemplative Reptile"
                        height="auto"
                        image="https://i.picsum.photos/id/1021/800/160.jpg"
                        title="Contemplative Reptile"
                        />
                <Paper variant='outlined' square className={classes.rootContainer}>
                <Grid container spacing={2} bottomGutters direction="row">
                    <Grid item xs={12}>
                        <Typography style={{fontWeight:100}} variant="h5">Apple AirPods ja langaton latauskotelo -nappikuulokkeet, MRXJ2</Typography>
                        </Grid>
                    <Grid item xs={12} sm={6} lg={6}>
                    <Box className="foobar">
                        <Badge anchorOrigin={{vertical:'bottom', horizontal:'right'}} badgeContent={3.4} color="secondary">
                        <Rating
                            size="large"
                            precision={0.1}
                            name="simple-controlled"
                            value={3.4}
                            label="3.4"
                            readOnly
                            />
                        </Badge>
                        
                        
                    </Box>
                    <CardMedia
                        component="img"
                        alt="Contemplative Reptile"
                        height="auto"
                        image="https://www.data-systems.fi/wp-content/uploads/2019/08/69839999_1496498747.jpeg"
                        title="Contemplative Reptile"
                        />

                    </Grid>
                    <Grid item xs={12} sm={6} lg={6}>
                        <div className={classes.root}>
                            <div className={classes.demo1}>
                                <AntTabs centered value={value} onChange={handleChange} aria-label="ant example">
                                <AntTab label="Tuotetiedot" />
                                <AntTab label="Arvostelut">
                                    </AntTab>
                                <AntTab label="Saatavilla kaupoista" />
                                </AntTabs>
                                <Typography className={classes.padding} />
                            </div>
                        </div>
                        <TableContainer component={Paper}>
                            <Table className={classes.table} aria-label="simple table">
                                <TableBody>
                                {rows.map((row) => (
                                    <TableRow key={row.key}>
                                    <TableCell style={{fontStyle:'italic'}} component="th" scope="row">
                                        {row.key}
                                    </TableCell>
                                    <TableCell align="left">{row.value}</TableCell>
                                    </TableRow>
                                ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <h3>Tykätyin arvostelu</h3>
                        <SingleReviewComponent isReviewed text={bestReview} score={5} date="3. Heinäkuuta 2019"/>
                        <h3>Viimeisin arvostelu</h3>
                        <SingleReviewComponent/>
                    </Grid>
                </Grid>

                <Grid container spacing={2} direction="row">
                    <Grid item xs={12} >
                        <Typography style={{fontWeight:100}} variant="h5">Arvostelut</Typography>
                    </Grid>
                    <Grid item xs={12} >
                        <Paper elevation={3} style={{paddingBottom:'5px'}}>
                            <SingleReviewComponent text={superLong}/>
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                    <Paper elevation={3} style={{paddingBottom:'5px'}}>
                            <SingleReviewComponent/>
                        </Paper>
                    </Grid>
                </Grid>

                </Paper>    
            </Container>

        </React.Fragment>
    );
}