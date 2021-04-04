import React, {useState, useEffect} from 'react';
import Breadcumb from './Breadcumb';
import {useSelector, useDispatch} from 'react-redux'
import {getcategorychildren} from '../actions/action'
import {
    useParams,
    useHistory
  } from "react-router-dom";
function Dashboard(props) { 
    const history = useHistory();
    const dispatch = useDispatch()
    const [categoryData, setCategoryData] = useState([])
    const getCategoryData = async () => {
        const apiToken = await localStorage.getItem("authToken");
        const baseUrl = await localStorage.getItem("baseUrl");

        const data = await fetch(baseUrl + '/api/recent_category' , {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Authorization': 'Bearer ' + apiToken,
            },
        })
        const resStatus = await data.status
        if(resStatus == 401) {
            window.location.href = baseUrl + '/login'
        }
        const categoryJson = await data.json() 
        setCategoryData(categoryJson)
    }
    const baseRoute = localStorage.getItem("routeBase");
    useEffect(() => {
        getCategoryData()
        dispatch({ type: 'SET_CATEGORY_ID', payload: ''})
    }, [])
    return (
        <div className="content-wrapper">
            <Breadcumb getcat={props.getcat} title="Recently opened" id="" addButton="password" pageType="dashboard" />
            <section className="content">
                <div className="container-fluid">
                  <div className="row">
                    {
                      categoryData.data !== undefined ?
                      categoryData.data.map((category, index) => (
                        <div className="col-md-3 col-sm-6 col-12" key={index} onClick={() => history.push(category.type == "owned" ? "/" + baseRoute + "category/" + category.id : "/" + baseRoute + "shared/" + category.id)}>
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

export default Dashboard;
