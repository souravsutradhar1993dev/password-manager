import React, {Component} from 'react';
import Container from 'react-dropdown-tree-select'
import 'react-dropdown-tree-select/dist/styles.css'

class CategoryTree extends Component {
    shouldComponentUpdate(newProps) {
        return !(this.props.shouldupdate === newProps.shouldupdate)  
    }
    render() {
        return (
            <Container data={this.props.categories} mode="radioSelect" inlineSearchInput={true} onChange={this.props.categoryHandler} />
        )  
    }
}

export default CategoryTree;
