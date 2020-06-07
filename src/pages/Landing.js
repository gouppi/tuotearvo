import React, { useEffect } from "react";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { Query } from "react-apollo";
import { RECENT_REVIEWS_QUERY } from "../components/Apollo/Queries";
import ReviewCard from "../components/Review/ReviewCard";
import ReviewCardAd from "../components/Review/ReviewCardAd";
import Paper from "@material-ui/core/Paper";

export default function Landing() {
  useEffect(() => {
    document.title = "Tuotearvostelut";
  });

  return (
    <Container maxWidth="xl">
      <Paper
        square
        variant="outlined"
        style={{ backgroundColor: "#f3f3f3", padding: "1em" }}
      >
        <Typography style={{ padding: "1em 0", fontWeight: 100 }} variant="h5">
          Uusimmat tuotearvostelut
        </Typography>
        <Grid container spacing={3}>
          <Query query={RECENT_REVIEWS_QUERY}>
            {({ loading, error, data }) => {
              if (loading) return <p>Loading...</p>;
              if (error) {
                console.log(error);
                return <p>Error :(</p>;
              }

              return data.recentReviews.map((review, i) => {
                if (i !== 0 && ++i % 5 === 0) {
                  return (
                    <React.Fragment key={i}>
                      <ReviewCardAd />
                      <ReviewCard  data={review} />
                    </React.Fragment>
                  );
                }
                return <ReviewCard key={i} data={review} />;
              });
            }}
          </Query>
        </Grid>
      </Paper>
    </Container>
  );
}
