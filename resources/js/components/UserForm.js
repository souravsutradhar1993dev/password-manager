import React, {useState, useRef, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux'
import toastr from 'toastr'
import 'toastr/build/toastr.min.css'
import { Modal, Overlay, Tooltip } from "react-bootstrap";
import { CopyToClipboard } from "react-copy-to-clipboard";
import {getalluser, getuserlist} from '../actions/action'
import validator from 'validator'

const UserForm = (props) => {
    const [userName, setUserName] = useState('')
    const [userEmail, setUserEmail] = useState('')
    const [userRole, setUserRole] = useState('employee')
    const [userPassword, setUserPassword] = useState('')
    const [saveButtonText, setSaveButtonText] = useState('Save');
    const [saveButtonDisabled, setSaveButtonDisabled] = useState(false);
    const [userPasswordInputType, setUserPasswordInputType] = useState('password')
    const [isCopied, setIsCopied] = useState(false);

    const [useremailtooltipshow, setUserEmailTooltipshow] = useState(false);

    const onCopyUserPassword = () => {
        setIsCopied(true);
        setUserEmailTooltipshow(true)
        setTimeout(() => {
          setIsCopied(false);
          setUserEmailTooltipshow(false)
        }, 1000);
    };

    const generatePassword = () => {
        var length           = 14;
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    const userPasswordInput = useRef(null);

    const changeSelectRoleHandler = (e) => {
        setUserRole(e.target.value)
    }

    const isShowUserModal = useSelector((state) => {
        return state.showUserModal.showUserModal;
    })

    const dispatch = useDispatch()

    const saveUser = async () => {
        if(userName !== '' || userEmail !== '' || userRole !== '' || userPassword !== '') {
            if (!validator.isEmail(userEmail)) { 
                toastr.error('Email is invalid', '')
                return false;
            }
            setSaveButtonText('Saving...');
            setSaveButtonDisabled(true);
            const baseUrl = await localStorage.getItem("baseUrl");
            const apiToken = await localStorage.getItem("authToken");
            const data = {
                name: userName,
                email: userEmail,
                role: userRole,
                password: userPassword
            }
            const response = await fetch(baseUrl + '/api/user', {
                method: 'POST', 
                mode: 'cors', 
                cache: 'no-cache', 
                credentials: 'same-origin', 
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + apiToken,
                },
                redirect: 'follow', 
                referrerPolicy: 'no-referrer',
                body: JSON.stringify(data)
            });
            const res2 = await response.json();
            const resStatus = await response.status

            if(resStatus == 200) {
                setSaveButtonText('Save');
                setSaveButtonDisabled(false);

                if(res2.success) {
                    setUserName('');
                    setUserEmail('');
                    setUserRole('employee');
                    setUserPassword('');
                    dispatch({ type: 'GET_SHOW_USER_MODAL', payload: false})
                    props.changeCatId(0)
                    dispatch(getuserlist())
                    toastr.success(res2.message, '', {displayDuration:3000})
                }else {
                    toastr.error(res2.message, '')
                }
            }else if(resStatus == 401){
                window.location.href = baseUrl + '/login'
            }else {
                setSaveButtonText('Save');
                setSaveButtonDisabled(false);

                toastr.error('Some error occurs.Please try again.', '')
            }
        }else {
            toastr.error('Please fill all fields.', '')
        }
    }

    const updateUser = async () => {
        if(userName !== '' || userEmail !== '' || userRole !== '') {
            if (!validator.isEmail(userEmail)) { 
                toastr.error('Email is invalid', '')
                return false;
            }
            setSaveButtonText('Saving...');
            setSaveButtonDisabled(true);
            const baseUrl = await localStorage.getItem("baseUrl");
            const apiToken = await localStorage.getItem("authToken");
            const data = {
                name: userName,
                email: userEmail,
                role: userRole,
                password: userPassword
            }
            const response = await fetch(baseUrl + '/api/user/' + props.id, {
                method: 'PUT', 
                mode: 'cors', 
                cache: 'no-cache', 
                credentials: 'same-origin', 
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + apiToken,
                },
                redirect: 'follow', 
                referrerPolicy: 'no-referrer',
                body: JSON.stringify(data)
            });
            const res2 = await response.json();
            const resStatus = await response.status

            if(resStatus == 200) {
                setSaveButtonText('Save');
                setSaveButtonDisabled(false);

                if(res2.success) {
                    setUserName('');
                    setUserEmail('');
                    setUserRole('employee');
                    setUserPassword('');
                    dispatch({ type: 'GET_SHOW_USER_MODAL', payload: false})
                    props.changeCatId(0)
                    dispatch(getalluser())
                    toastr.success(res2.message, '', {displayDuration:3000})
                }else {
                    toastr.error(res2.message, '')
                }
            }else if(resStatus == 401){
                window.location.href = baseUrl + '/login'
            }else {
                setSaveButtonText('Save');
                setSaveButtonDisabled(false);

                toastr.error('Some error occurs.Please try again.', '')
            }
        }else {
            toastr.error('Please fill all fields.', '')
        }
    }

    const getSingleUser = async (id) => {
        const apiToken = await localStorage.getItem("authToken");
        const baseUrl = await localStorage.getItem("baseUrl");
        
        const data = await fetch(baseUrl + '/api/user/' + id, {
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
        const res2 = await data.json()
        setUserName(res2.data.name);
        setUserEmail(res2.data.email);
        setUserRole(res2.data.role);
    }
    useEffect(() => {
        if(props.id > 0) {
            getSingleUser(props.id);
        }
    }, [props.id])
    return (
        <Modal show={isShowUserModal} onHide={() => {
            setUserName('');
            setUserEmail('');
            setUserRole('employee');
            setUserPassword('');
            props.changeCatId(0)
            dispatch({ type: 'GET_SHOW_USER_MODAL', payload: false})
        }} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>{props.id > 0 ? "Edit" : "Add"} User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className="row">
                <div className="col-sm-12">
                    <div className="form-group">
                        <label htmlFor="userName">Name</label>
                        <input type="text" className="form-control" id="userName" placeholder="Enter name" value={userName} onChange={(e) => setUserName(e.target.value) } />
                    </div>
                    <div className="form-group">
                        <label htmlFor="userEmail">Email</label>
                        <input type="email" className="form-control" id="userEmail" placeholder="Enter email" value={userEmail} onChange={(e) => setUserEmail(e.target.value) } />
                    </div>
                    <div className="form-group">
                        <label htmlFor="userRole">Role</label>
                        <select className="custom-select form-control-border" id="userRole" onChange={changeSelectRoleHandler} value={userRole}>
                            <option value="employee">Employee</option>
                            <option value="admin">Admin</option>
                            <option value="super-admin">Super Admin</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="userPassword">Password</label>
                        <div className="input-group mb-3">
                            <input type={userPasswordInputType ? 'password' : 'text'} className="form-control" id="userPassword" placeholder="Enter password" value={userPassword} onChange={(e) => setUserPassword(e.target.value) } />
                            <div className="input-group-append input-group-action" onClick={() => {
                                setUserPasswordInputType(!userPasswordInputType)
                            }}>
                                <span className="input-group-text"><i className={userPasswordInputType ? 'fas fa-eye' : 'fa fa-eye-slash'} /></span>
                            </div>
                            <div className="input-group-append input-group-action" onClick={() => {
                                let pwd = generatePassword() 
                                setUserPassword(pwd)
                            }}>
                                <span className="input-group-text"><i className="fas fa-sync" /></span>
                            </div>
                            <div className="input-group-append input-group-action" ref={userPasswordInput}>
                                <CopyToClipboard text={userPassword} onCopy={onCopyUserPassword}>
                                    <span className="input-group-text"><i className="fas fa-copy" /></span>
                                </CopyToClipboard>
                            </div>
                            <Overlay target={userPasswordInput.current} show={useremailtooltipshow} placement="bottom">
                                    {(props) => (
                                    <Tooltip {...props}>
                                        Copied!
                                    </Tooltip>
                                    )}
                            </Overlay>
                        </div> 
                    </div>
                </div>
            </div>
        </Modal.Body>
        <Modal.Footer>
            {
                props.id === 0 ?
                <button type="submit" disabled={userName === '' || userEmail === '' || userRole === '' || userPassword === '' || !validator.isEmail(userEmail) || saveButtonDisabled ? true : false } className="btn btn-primary" onClick={saveUser}>{saveButtonText}</button>
                :
                <button type="submit" disabled={userName === '' || userEmail === '' || userRole === '' || !validator.isEmail(userEmail) || saveButtonDisabled ? true : false } className="btn btn-primary" onClick={updateUser}>{saveButtonText}</button>
            }
            
        </Modal.Footer>
      </Modal>
    )
}

export default UserForm;