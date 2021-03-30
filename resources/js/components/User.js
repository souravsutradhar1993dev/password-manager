import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux'
import Breadcumb from './Breadcumb';
import UserForm from './UserForm';
import SweetAlert from 'react-bootstrap-sweetalert';
import {getalluser} from '../actions/action'
import toastr from 'toastr'
import 'toastr/build/toastr.min.css'

const User = (props) => {
    const [catId, setCatId] = useState(0)
    const [deleteAlert, setDeleteAlert] = useState(null)

    const allUsers = useSelector((state) => {
        return state.allUser.user;
    })
    const dispatch = useDispatch(); 

    const changeCatIdHandler = (id) => {
        setCatId(id)
    }

    const showAlert = (id) => (
        <SweetAlert
            warning
            showCancel
            confirmBtnText="Yes, delete it!"
            confirmBtnBsStyle="danger"
            title="Are you sure?"
            onConfirm={() => onConfirmDelete(id)}
            onCancel={onDeleteCancel}
            focusCancelBtn
            >
            You will not be able to recover this user!
        </SweetAlert>
    )

    const deleteUser = (id) => {
        setDeleteAlert(
            showAlert(id)
        )
    }
    const onConfirmDelete = async (id) => {
        const baseUrl = await localStorage.getItem("baseUrl");
        const apiToken = await localStorage.getItem("authToken");
        const response = await fetch(baseUrl + '/api/user/' + id, {
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
                dispatch(getalluser())
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
    
    useEffect(() => {
        dispatch({ type: 'SET_CATEGORY_ID', payload: ''})
    }, [])
    return (
        <div className="content-wrapper">
            <Breadcumb getcat={props.getcat} title="All users" id="" addButton="user" />
            <section className="content">
                <div className="container-fluid">
                  <div className="row">
                        <div className="col-lg-12 col-12">
                            <table className="table">
                                <thead className="thead-dark">
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Role</th>
                                    <th scope="col">Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    allUsers.map((user, index) => (
                                        <tr key={index}>
                                            <th scope="row">{index + 1}</th>
                                            <td>{user.name}</td>
                                            <td>{user.email}</td>
                                            <td>{user.role_title}</td>
                                            <td className="actionUser">
                                            {
                                                user.role === 'super-admin' ?
                                                ''
                                                :
                                                <>
                                                <span className="editUser" onClick={() => {
                                                    setCatId(user.id)
                                                    dispatch({type: "GET_SHOW_USER_MODAL", payload: true})
                                                }}>
                                                    <i className="fas fa-edit"></i>
                                                </span>
                                                <span className="deleteUser" onClick={() => deleteUser(user.id)}>
                                                    <i className="fa fa-trash" aria-hidden="true"></i>
                                                </span>
                                                </>
                                            }
                                            </td>
                                            
                                        </tr>
                                    ))
                                }
                                </tbody>
                            </table>
                        </div>
                  </div>
                </div>
            </section>
            {deleteAlert}
            <UserForm id={catId} changeCatId={(id) => changeCatIdHandler(id)} />
        </div>
    )
}

export default User