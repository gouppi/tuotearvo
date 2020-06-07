import React, { useEffect } from "react";
import Container from "@material-ui/core/Container";

import SearchComponent from '../components/Landing/Search';
import RecentReviewsComponent from '../components/Landing/RecentReviews';

export default function Landing() {
  useEffect(() => {
    document.title = "Tuotearvostelut";
  });

  return (
    <Container maxWidth="xl">
      <SearchComponent/>
      <RecentReviewsComponent/>
    </Container>
  );
}
