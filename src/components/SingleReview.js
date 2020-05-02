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
    const defaultText = "Pettymys oli melkoinen, kun 3 viikon käytön jälkeen toinen meni tukkoon. Putsattiin applella...";
    
    return (
        <Grid style={{padding:'8px 10px'}} container wrap="nowrap" spacing={2}>
        <Grid item>
          <Avatar alt="Lorem Ipsum" src={imgLink} />
        </Grid>
        <Grid justifyContent="left" item xs zeroMinWidth>
        <Typography style={{fontStyle:'italic'}} variant="caption" display="block" gutterBottom>
              {review.date ? review.date : 'lisätty 15 minuuttia sitten'}
           </Typography>
        
        <Box style={{display:'flex', alignItems:'center'}}>
          <Rating
              style={{paddingRight:'10px'}}
              size="large"
              precision={0.1}
              name="simple-controlled"
              value={review.score ? review.score : 2.5}
              label={review.score ? review.score : 2.5}
              readOnly
          />
          {review.isReviewed && (
          <Badge style={{color:"#06af06"}} badgeContent={123} max={999}>
            <ThumbUpIcon style={{ fontSize: 18, color:"#06af06",paddingRight:'10px'}}></ThumbUpIcon>
            </Badge>
          )}
          </Box>    
            
          <p style={{fontStyle:'italic'}}>{review.text ? review.text : defaultText}</p>
          <Typography style={{fontStyle:'italic'}} variant="caption" display="block" gutterBottom>
              Lue koko arvostelu <Link>täällä</Link>
           </Typography>
          
        </Grid>
      </Grid>

    )
}