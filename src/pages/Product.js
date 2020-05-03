import React from 'react'
import {makeStyles, withStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Rating from '@material-ui/lab/Rating';
import Box from '@material-ui/core/Box';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Badge from '@material-ui/core/Badge';
import Button from '@material-ui/core/Button';
import Skeleton from '@material-ui/lab/Skeleton';

import {BrowserRouter, Link, useRouteMatch, useParams, Switch, Route,Redirect} from 'react-router-dom';

import SingleReviewComponent from '../components/Review/SingleReview';
import ProductInfo from '../components/SingleProduct/ProductInfo';
import ProductStores from '../components/SingleProduct/ProductStores';

  
 

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


export default function Product() {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);
    let { path, url } = useRouteMatch();
    let {productId} = useParams();

    console.log("path: " + path, "url:" + url);
    


    const handleChange = (event, newValue) => {
        console.log("Change event");
        setValue(newValue);
      };

    return (
        <React.Fragment>
                <Paper variant='outlined' square className={classes.rootContainer}>
                <Grid container spacing={2} direction="row">
                    <Grid item xs={12}>
                        <Typography style={{fontWeight:100}} variant="h5">Apple AirPods ja langaton latauskotelo -nappikuulokkeet {productId}</Typography>
                        </Grid>
                    <Grid item xs={12} sm={5} lg={5}>
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
                        style={{maxWidth:'200px'}}
                        width="auto"
                        image="https://www.data-systems.fi/wp-content/uploads/2019/08/69839999_1496498747.jpeg"
                        title="Contemplative Reptile"
                        />

                    </Grid>
                    <Grid item xs={12} sm={7} lg={7}>
                        <div className={classes.root}>
                            <div className={classes.demo1}>
                                <BrowserRouter>
                                  <AntTabs variant="fullWidth" centered value={value} onChange={handleChange} aria-label="ant example">
                                    <AntTab component={Link} to={`${url}/stores`} label="Saatavilla kaupoista" />
                                    <AntTab component={Link} to={`${url}/info`}  label="Tuotetiedot" />
                                  </AntTabs>

                                  <Switch>
                                    <Route exact path={`${url}`}>
                                      <Redirect to={`${url}/stores`}></Redirect>
                                    </Route>
                                    <Route strict path={`${url}/:subPage`}>
                                      <SubPage baseUrl={url} setState={setValue} />
                                    </Route>
                                    <Route strict path={`${url}`}>
                                      <Redirect from={`${url}/*`} to={`${url}/stores`} />
                                    </Route>
                                  </Switch>
                                </BrowserRouter>
                                  
                                <Typography className={classes.padding} />
                            </div>
                        </div>
                        
                    </Grid>
                </Grid>

                <Grid container spacing={2} direction="row">
                    <Grid item xs={8} >
                        <Typography style={{fontWeight:100}} variant="h5">123 Tuotearvostelua </Typography>
                    </Grid>
                    <Grid style={{display:'flex'}} item xs={4}>
                      <Button size="small" variant="contained" color="secondary">Kirjoita oma arvostelusi</Button>
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
                    <Grid item xs={12}>
                      <Paper elevation={3} style={{paddingBottom:'5px'}}>
                        <Grid style={{padding:'8px 10px'}} container wrap="nowrap" spacing={2}>
                          <Grid item>
                            <Skeleton variant="circle" width={40} height={40} animation="wave" />
                          </Grid>
                          <Grid item xs zeroMinWidth>
                            <Skeleton variant="text" width={150} animation="wave" />
                            <Box style={{display:'flex', alignItems:'center'}}>
                              <Skeleton variant="rect" width={150} animation="wave" />
                            </Box>
                            <Box style={{marginTop:'5px'}}>
                              <Skeleton variant="rect" style={{marginBotton:'6px'}} width={'100%'} animation="wave" />
                              <Skeleton variant="rect" style={{marginBotton:'6px'}} width={'100%'} animation="wave" />
                              </Box>
                          </Grid>
                        </Grid>
                      </Paper>
                    </Grid>
                    
                </Grid>

                </Paper>    

        </React.Fragment>
    );
}

function SubPage(props) {
  let { subPage } = useParams();
  // TODO: this works, but e.g. /products/PRODUCT_ID/stores/foo/bar/asdfasdf <- still works. Would be nice to fix.
  let {baseUrl, setState} = props;
  console.log("Ollaan SubPage - funkkarissa, baseUrl on: " + baseUrl);

  let routes = {
  'info': {
    'page': <ProductInfo/>, 
    'index':1
  },
    'stores': {
      'page': <ProductStores />,
      'index': 0
    }
  };

  let returnable = null;
  if (routes.hasOwnProperty(subPage)) {
    //Staten muuttaminen täällä antaa error-messagen :(
    //setState(routes[subPage].index);
    returnable = routes[subPage].page;
  }

  return returnable ? returnable : <Redirect from={`/${baseUrl}/*`} to={`reviews`} />


}