import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux'
import SweetAlert from 'react-bootstrap-sweetalert';
import {getmenucategories,getcategorychildren} from '../actions/action'
import toastr from 'toastr'
import 'toastr/build/toastr.min.css'
import {
    useHistory
  } from "react-router-dom";

const Breadcumb = (props) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const [deleteAlert, setDeleteAlert] = useState(null)

    const currentCategoryId = useSelector((state) => {
        return state.category.category_id;
    })

    const baseRoute = localStorage.getItem("routeBase");

    const showAlert = () => (
        <SweetAlert
            warning
            showCancel
            confirmBtnText="Yes, delete it!"
            confirmBtnBsStyle="danger"
            title="Are you sure?"
            onConfirm={() => onConfirmDelete()}
            onCancel={onDeleteCancel}
            focusCancelBtn
            >
            You will not be able to recover this category!
        </SweetAlert>
    )

  const deleteCat = () => {
      setDeleteAlert(
          showAlert()
      )
  }
  const onConfirmDelete = async () => {
      const baseUrl = await localStorage.getItem("baseUrl");
      const apiToken = await localStorage.getItem("authToken");
      const response = await fetch(baseUrl + '/api/category/' + currentCategoryId, {
          method: 'DELETE', 
          mode: 'cors', 
          cache: 'no-cache', 
          credentials: 'same-origin', 
          headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + apiToken,
          },
          redirect: 'follow', 
          referrerPolicy: 'no-referrer',
      });
      const res2 = await response.json();
      const resStatus = await response.status
      setDeleteAlert(null)
      if(resStatus == 200) {
          if(res2.success) {
              dispatch(getmenucategories())
              history.push("/" + baseRoute)
              toastr.success(res2.message, '', {displayDuration:3000})
          }else {
              toastr.error(res2.message, '')
          }
      }else if(resStatus == 401){
          window.location.href = baseUrl + '/login'
      }else {
          toastr.error('Some error occurs.Please try again.', '')
      }
  }
  const onDeleteCancel = () => {
      setDeleteAlert(null)
  }

    return (
        <div className="content-header">
        <div className="container-fluid">
            <div className="row mb-2">
            <div className="col-sm-6 breadCumbHeaderSection">
                <h1 className="m-0">{props.title}</h1>
                {
                    props.id !== '' ?
                    <div className="actionBtn">
                        <span className="editCat" onClick={() => props.getcat(currentCategoryId, 'category', currentCategoryId, 'parent')}>
                            <i className="fas fa-edit"></i>
                        </span>
                        <span className="deleteCat" onClick={() => deleteCat()}>
                            <i className="fa fa-trash" aria-hidden="true"></i>
                        </span>
                    </div>
                    : ""
                }
                
            </div>{/* /.col */}
            <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                    {
                        props.addButton === 'password' ? 
                        <button type="button" className="btn btn-primary" onClick={() => props.getcat(currentCategoryId, 'password')}><i className="fa fa-plus" aria-hidden="true"></i>&nbsp;&nbsp;Add New</button>
                        :
                        <button type="button" className="btn btn-primary" onClick={() => dispatch({type: "GET_SHOW_USER_MODAL", payload: true})}><i className="fa fa-plus" aria-hidden="true"></i>&nbsp;&nbsp;Add New</button>
                    }
                    
                </li>
                </ol>
            </div>{/* /.col */}
            </div>{/* /.row */}
        </div>{/* /.container-fluid */}
        {deleteAlert}
        </div>
    )
}

export default Breadcumb;