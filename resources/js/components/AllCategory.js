import React, {useState, useEffect} from 'react';
import Breadcumb from './Breadcumb';
import {useSelector, useDispatch} from 'react-redux'
import {getcategorychildren} from '../actions/action'
import {
    useParams,
    useHistory
  } from "react-router-dom";
function AllCategry(props) { 
    const history = useHistory();
    const dispatch = useDispatch()

    const categoryData = useSelector((state) => {
      return state.categoryChildren.data;
    })

    const baseRoute = localStorage.getItem("routeBase");

    useEffect(() => {
        dispatch(getcategorychildren(''))
        dispatch({ type: 'SET_CATEGORY_ID', payload: ''})
    }, [])
    return (
        <div className="content-wrapper">
            <Breadcumb getcat={props.getcat} title="All Accounts" id="" addButton="password" pageType="all_category" />
            <section className="content">
                <div className="container-fluid">
                  <div className="row">
                    {
                      categoryData.data !== undefined ?
                      categoryData.data.categories.map((category, index) => (
                        <div className="col-md-3 col-sm-6 col-12" key={index} onClick={() => history.push("/" + baseRoute + "category/" + category.id)}>
                          <div className="info-box">
                            <span className="info-box-icon bg-info"><i className="material-icons">{category.category_icon}</i></span>
                            <div className="info-box-content">
                              <span className="info-box-text">{category.title}</span>
                            </div>
                          </div>
                        </div>
                      ))
                      :
                      ""
                    }
                  </div>
                </div>
            </section>
        </div>
    );
}

export default AllCategry;
