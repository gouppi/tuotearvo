import React, {Component} from 'react'
import {DropzoneArea} from 'material-ui-dropzone'
 
class UploadDropZone extends Component{
  constructor(props){
    super(props);
    this.state = {
      files: []
    };
  }
  handleChange(files){
    this.setState({
      files: files
    });
  }
  render(){
    return (
      <DropzoneArea
        dropzoneText="Lataa tuotearvosteluun liittyviä kuvia"
        onChange={this.handleChange.bind(this)}
        />
    )
  }
}
 
export default UploadDropZone;