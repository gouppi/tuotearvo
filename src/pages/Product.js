import React from "react";
import LazyLoad from "react-lazyload";
import { useParams } from "react-router-dom";

import { Query } from "react-apollo";
import BreadcrumbsComponent from "../components/Product/Breadcrumbs";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Rating from "@material-ui/lab/Rating";
import Badge from "@material-ui/core/Badge";
import CardMedia from "@material-ui/core/CardMedia";
import TableContainer from "@material-ui/core/TableContainer";
import TableBody from "@material-ui/core/TableBody";
import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import SingleReviewComponent from "../components/Review/SingleReview";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import ProductPrices from '../components/Product/ProductPrices';
import { PRODUCT_QUERY } from "../components/Apollo/Queries";

const Product = () => {
  const [value, setValue] = React.useState(0);
  const { product } = useParams();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <Box p={3}>{children}</Box>}
      </div>
    );
  }
  return (
    <Query query={PRODUCT_QUERY} variables={{ product: parseInt(product) }}>
      {({ loading, error, data }) => {
        if (loading) return <p>loading...</p>;
        if (error) {
          console.log(error);
          return <p>Error :(</p>;
        }

        // TODO: Tähän kohti redirect jos ollaan esim puhelimet kategoriassa mutta haetaan televisio-ID:llä tuotetta.

        return (
          <Container maxWidth="xl">
            <Grid container spacing={2} direction="row">
              <Grid item xs={12}>
                <BreadcrumbsComponent product={data.product} />
              </Grid>
              <Grid item xs={12}>
                <Typography style={{ fontWeight: 100 }} variant="h5">
                  {data.product.name}
                </Typography>
                <Rating
                    size="large"
                    precision={0.1}
                    name="simple-controlled"
                    value={data.product.rating_avg}
                    label={data.product.rating_avg}
                    readOnly
                  />
                <Badge
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  badgeContent={parseFloat(data.product.rating_avg).toFixed(2)}
                  color="primary"

                >

                </Badge>
              </Grid>
              <Grid item xs={6}>
                <CardMedia
                  component="img"
                  alt="Contemplative Reptile"
                  style={{ maxWidth: "200px" }}
                  width="auto"
                  image={data.product.image}
                  title="Contemplative Reptile"
                />
              </Grid>
              <Grid item xs={6}>
                <TableContainer component={Paper}>
                  <Table className={""} aria-label="simple table" size="small">
                    <TableBody>
                      {/* <TableRow>
                        <TableCell>Valmistaja</TableCell>
                        <TableCell>{data.product.brand.name}</TableCell>
                      </TableRow> */}
                      <TableRow>
                        <TableCell>EAN-koodi(t):</TableCell>
                        <TableCell align="right">
                          <List dense>
                            {data.product.product_eans.map((ean, i) => (
                              <ListItem key={i}>
                                <ListItemText>{ean}</ListItemText>
                              </ListItem>
                            ))}
                          </List>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Valmistajan tuotekoodi(t):</TableCell>
                        <TableCell align="right">
                          <List dense>
                            {data.product.product_mpns.map((mpn,i) => (
                              <ListItem key={i}>
                                <ListItemText>{mpn}</ListItemText>
                              </ListItem>
                            ))}
                          </List>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              <AppBar position="static">
                <Tabs
                  value={value}
                  onChange={handleChange}
                  aria-label="simple tabs example"
                >
                  <Tab label="Arvostelut" {...a11yProps(0)} />
                  <Tab label="Kaupat" {...a11yProps(1)} />
                  <Tab label="Artikkelit" {...a11yProps(2)} />
                </Tabs>
              </AppBar>
              <TabPanel value={value} index={0}>
                {data.product.reviews.map((review,i) => (
                  <Grid key={i} item xs={12}>
                    <LazyLoad height={100} offset={100}>
                      <SingleReviewComponent
                        origin={review.origin}
                        date={review.reviewedAt}
                        score={review.rating}
                        recomends={review.recommends}
                        text={review.text}
                      />
                    </LazyLoad>
                  </Grid>
                ))}
              </TabPanel>
              <TabPanel value={value} index={1}>
              <ProductPrices prices={data.product.prices}/>

              </TabPanel>
              <TabPanel value={value} index={2}>
              <Typography>artikkelit</Typography>
              </TabPanel>
            </Grid>
          </Container>
        );
      }}
    </Query>
  );
};

export default Product;
