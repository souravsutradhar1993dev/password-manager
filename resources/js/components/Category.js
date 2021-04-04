import React, {useState, useEffect} from 'react';
import Breadcumb from './Breadcumb';
import {useSelector, useDispatch} from 'react-redux'
import {getcategorychildren} from '../actions/action'
import {
    useParams,
    useHistory
  } from "react-router-dom";
function Category(props) { 
    const { id } = useParams();
    const history = useHistory();
    const dispatch = useDispatch()

    const categoryData = useSelector((state) => {
      return state.categoryChildren.data;
    })

    const currentCategoryId = useSelector((state) => {
        return state.category.category_id;
    })

    const passwordIcons = []
    passwordIcons['ftp'] = 'upload' 
    passwordIcons['cpanel'] = 'cpanel' 
    passwordIcons['gsuite'] = 'google-plus-g' 
    passwordIcons['social'] = 'globe' 
    passwordIcons['web'] = 'globe' 
    passwordIcons['email'] = 'envelope'
    passwordIcons['wifi'] = 'wifi'
    passwordIcons['credit'] = 'credit-card'
    passwordIcons['crypto'] = 'btc'
    passwordIcons['custom'] = 'lock'
    const baseRoute = localStorage.getItem("routeBase");
    useEffect(() => {
        dispatch(getcategorychildren(id))
        dispatch({ type: 'SET_CATEGORY_ID', payload: id})
    }, [id])
    return (
        <div className="content-wrapper">
            <Breadcumb getcat={props.getcat} title={categoryData.current_category_name !== undefined ? categoryData.current_category_name : ""} id={categoryData.current_category_name !== undefined ?  categoryData.current_category_id : ""} addButton="password" pageType="category" />
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
                    {
                      categoryData.data !== undefined ?
                      categoryData.data.passwords.map((password, index) => (
                        <div className="col-md-3 col-sm-6 col-12" key={index} onClick={() => props.getcat(currentCategoryId, 'password', password.id)}>
                          <div className="info-box bg-danger">
                            <span className="info-box-icon"><i className={password.account_type === 'cpanel' || password.account_type === 'gsuite' ? "fab fa-" + passwordIcons[password.account_type] : "fa fa-" + passwordIcons[password.account_type]} /></span>
                            <div className="info-box-content">
                              <span className="info-box-number">{password.name}</span>
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

export default Category;
