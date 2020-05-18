import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Hidden from '@material-ui/core/Hidden';
import Box from '@material-ui/core/Box';
import Rating from '@material-ui/lab/Rating';

import LinkUI from '@material-ui/core/Link';
import {Link} from 'react-router-dom';

const useStyles = makeStyles({
  card: {
    display: 'flex',
  },
  cardDetails: {
    flex: 1,
  },
  cardMedia: {
    width: 160,
  },
});

export default function ReviewCard(props) {
  const classes = useStyles();
  const { post, data } = props;

  return (
    <Grid item xs={12}>
      <Box boxShadow={1} px={2} py={1} mb={1}>
        <LinkUI style={{textDecoration:'none'}} component={Link} to={`/product/${props.data.id}`}>
        <CardActionArea component="a">
          
          <Grid container spacing={3}>
            <Grid item xs={3}>
            <CardMedia
              component="img"
              alt="Contemplative Reptile"
              height="80"
              image={props.data.image}
              title="Contemplative Reptile"
              />
            </Grid>
            <Grid item xs={9}>
              <Typography>{props.data.model}</Typography>
              <Rating
                size="small"
                precision={0.1}
                name="simple-controlled"
                value={props.data.average_score}
                label={props.data.average_score}
                readOnly
              />
              <Typography variant="caption" component="p">{props.data.reviews_count} Arvostelua</Typography>
            </Grid>
          </Grid>
          
        </CardActionArea>
        </LinkUI>
      </Box>
    </Grid>
  );
}

ReviewCard.propTypes = {
  post: PropTypes.object,
};