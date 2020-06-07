import React from 'react'
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { Query } from "react-apollo";
import { RECENT_REVIEWS_QUERY } from "../Apollo/Queries";
import ReviewCard from "../Review/ReviewCard";
import ReviewCardAd from "../Review/ReviewCardAd";
import Paper from "@material-ui/core/Paper";
import "./styles.css";

const RecentReviewsComponent = () => {
    return (
        <Paper
        className="PaperComponent"
        square
        variant="outlined"

      >
        <Typography style={{paddingBottom:"1em", fontWeight: 100 }} variant="h5">
          Uusimmat tuotearvostelut
        </Typography>
        <Grid container spacing={3}>
          <Query query={RECENT_REVIEWS_QUERY}>
            {({ loading, error, data }) => {
              if (loading) return (
                  <Typography>Lataa!!</Typography>
              );
              if (error) {
                console.log(error);
                return <p>Error :(</p>;
              }

              return data.recentReviews.map((review, i) => {
                if (i !== 0 && ++i % 5 === 0) {
                  return (
                    <React.Fragment key={i}>
                      <ReviewCardAd />
                      <ReviewCard data={review} />
                    </React.Fragment>
                  );
                }
                return <ReviewCard key={i} data={review} />;
              });
            }}
          </Query>
        </Grid>
      </Paper>
    )
};

export default RecentReviewsComponent;