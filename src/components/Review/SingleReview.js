import React from 'react'

import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Rating from '@material-ui/lab/Rating';
import Link from '@material-ui/core/Link';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import Box from '@material-ui/core/Box';
import Badge from '@material-ui/core/Badge';

const imgLink =
"https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260";

export default function SingleReview(props) {
    const review = {...props};
    
    return (
        <Grid style={{padding:'4px 10px'}} container wrap="nowrap" spacing={0}>
          <Grid item xs={1}>
            <Avatar alt="Lorem Ipsum" src={imgLink} />
          </Grid>
          <Grid container item xs={11}>
            <Grid item container xs={6}>
              <Grid item xs={12}>
                <Typography style={{fontStyle:'italic'}} variant="caption" display="block" gutterBottom>
                  {review.date ? review.date : 'lisätty 15 minuuttia sitten'}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Rating
                  size="small"
                  precision={0.1}
                  name="simple-controlled"
                  value={review.score}
                  label={review.score}
                  readOnly
                />
              </Grid>
            </Grid>
            <Grid container justify="flex-end" item xs={6}>
              
              <Typography style={{fontStyle:'italic'}} variant="caption" display="block" gutterBottom>
                Arvostelun lähde: Gigantti.fi
              </Typography>
            </Grid> 
            <Grid item xs={12}>
              <Typography variant="caption">
                Tämä arvostelu on kirjoitettu tuotteesta {review.variation_name}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography>
                {review.text ? review.text : ''}
              </Typography>
            </Grid>
          </Grid>
      </Grid>

    )
}