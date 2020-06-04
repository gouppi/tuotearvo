import React from "react";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import LinkUI from "@material-ui/core/Link";
import { Link } from "react-router-dom";

const BreadcrumbsComponent = ({product}) => {
  return (
    <Breadcrumbs aria-label="breadcrumb">
      <LinkUI component={Link} color="inherit" to="/">
        Etusivu
      </LinkUI>
      {product.parent_categories.map((category, i) => {
        return (
          <LinkUI
            component={Link}
            color={"inherit"}
            aria-current={"page"}
            to={"/tuotteet/" + category.seo_name}
          >
            {category.name}
          </LinkUI>
        );
      })}
      <LinkUI
        component={Link}
        color={"textPrimary"}
        aria-current={"page"}
        to={
          "/tuotteet/" + product.category.seo_name + "/" + product.id
        }
      >
        {product.name}
      </LinkUI>
    </Breadcrumbs>
  );
};

export default BreadcrumbsComponent;
