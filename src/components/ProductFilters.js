import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";

import TreeItem from "@material-ui/lab/TreeItem";
import TreeView from "@material-ui/lab/TreeView";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";

const FILTERS_QUERY = gql`
  query ProductFilters($category_id: [Int], $brand_id: [Int]) {
    productFilters(category_id: $category_id, brand_id: $brand_id) {
      categories {
        id
        name
        parentId
        children {
          id
          name
          parentId
          children {
            id
            name
            parentId
          }
        }
      } 
      brands {
        id
        name
      }
    }
  }
`;

const ProductFilters = () => {
  const [checked, setChecked] = React.useState(true);
  let nodeId = 1;
  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  const treeStructure = (category) => {
    let returnable = [];
    category.forEach((cat) => {
        console.log(cat.name);
        returnable.push(
            <TreeItem nodeId={nodeId++} label={cat.name}>
                {Array.isArray(cat.children) && treeStructure(cat.children)}
            </TreeItem>
        )
    });
    return returnable;

  }

  return (
    <Query query={FILTERS_QUERY}>
      {({ loading, error, data, fetchMore }) => {
        if (loading) return <p>Loading...</p>;
        if (error) {
          console.log(error);
          return <p>Error :(</p>;
        }
        console.log(data);
        return (
          <TreeView
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
          >
              {treeStructure(data.productFilters.categories)}
          </TreeView>
        );
      }}
    </Query>
  );
};

export default ProductFilters;
