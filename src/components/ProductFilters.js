import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";

import TreeItem from "@material-ui/lab/TreeItem";
import TreeView from "@material-ui/lab/TreeView";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
const FILTERS_QRY = gql`
  query categories {
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
  }`

const ProductFilters = () => {
  const [checked, setChecked] = React.useState(true);
  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  const treeStructure = (category) => {
    let returnable = [];
    category.forEach((cat) => {
      returnable.push(
        <TreeItem nodeId={cat.id} label={cat.name}>
          {Array.isArray(cat.children) && treeStructure(cat.children)}
        </TreeItem>
      )
    });
    return returnable;

  }

  return (
    <Query query={FILTERS_QRY}>
      {({ loading, error, data, fetchMore }) => {
        if (loading) return <p>Loading...</p>;
        if (error) {
          console.log(error);
          return <p>Error :(</p>;
        }

        return (
          <Card>
            <Typography variant="p">Tuotekategoriat</Typography>
            <Divider/>
            <TreeView
              onNodeSelect={(e, v) => { console.log("On Node Select triggers", v); }}
              defaultCollapseIcon={<ExpandMoreIcon />}
              defaultExpandIcon={<ChevronRightIcon />}
            >
              {treeStructure(data.categories)}
            </TreeView>
          </Card>
        );
      }}
    </Query>
  );
};

export default ProductFilters;
