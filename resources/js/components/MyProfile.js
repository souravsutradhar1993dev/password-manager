import React, {useState, useRef, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux'
import toastr from 'toastr'
import 'toastr/build/toastr.min.css'
import { Modal, Overlay, Tooltip } from "react-bootstrap";
import { CopyToClipboard } from "react-copy-to-clipboard";
import {getuser} from '../actions/action'
import validator from 'validator'

const MyProfile = () => {
    const currentUser = useSelector((state) => {
        return state.user.user;
    })
    const [userName, setUserName] = useState('')
    const [userEmail, setUserEmail] = useState('')
    const [userPassword, setUserPassword] = useState('')
    const [saveButtonText, setSaveButtonText] = useState('Update');
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

    const isShowProfileModal = useSelector((state) => {
        return state.showProfileModal.showProfileModal;
    })

    const dispatch = useDispatch()

    const updateProfile = async () => {
        if(userName !== '' || userEmail !== '') {
            if (!validator.isEmail(userEmail)) { 
                toastr.error('Email is invalid', '')
                return false;
            }
            setSaveButtonText('Updating...');
            setSaveButtonDisabled(true);
            const baseUrl = await localStorage.getItem("baseUrl");
            const apiToken = await localStorage.getItem("authToken");
            const data = {
                name: userName,
                email: userEmail,
                password: userPassword
            }
            const response = await fetch(baseUrl + '/api/profile/update', {
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
                setSaveButtonText('Update');
                setSaveButtonDisabled(false);

                if(res2.success) {
                    dispatch({ type: 'GET_SHOW_PROFILE_MODAL', payload: false})
                    dispatch(getuser())
                    toastr.success(res2.message, '', {displayDuration:3000})
                }else {
                    toastr.error(res2.message, '')
                }
            }else if(resStatus == 401){
                window.location.href = baseUrl + '/login'
            }else {
                setSaveButtonText('Update');
                setSaveButtonDisabled(false);

                toastr.error('Some error occurs.Please try again.', '')
            }
        }else {
            toastr.error('Please fill all fields.', '')
        }
    }
    useEffect(() => {
        if(currentUser.name !== undefined) {
            setUserName(currentUser.name)
        }
        if(currentUser.email !== undefined) {
            setUserEmail(currentUser.email)
        }
        
    }, [currentUser])
    return (
        <Modal show={isShowProfileModal} onHide={() => {
            dispatch({ type: 'GET_SHOW_PROFILE_MODAL', payload: false})
        }} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>My Profile</Modal.Title>
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
            <button type="submit" disabled={userName === '' || userEmail === '' || !validator.isEmail(userEmail) || saveButtonDisabled ? true : false } className="btn btn-primary" onClick={updateProfile}>{saveButtonText}</button>
        </Modal.Footer>
      </Modal>
    )
}

export default MyProfile;