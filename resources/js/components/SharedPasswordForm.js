import React, {useState, useRef, useCallback, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux'
import toastr from 'toastr'
import 'toastr/build/toastr.min.css'
import { Modal, Overlay, Tooltip } from "react-bootstrap";
import { CopyToClipboard } from "react-copy-to-clipboard";
import validator from 'validator'
import {getshared, getsharedpassword} from '../actions/action'

const SharedPasswordForm = (props) => {
    const customPasswordInput = useRef(null);
    const customUrlInput = useRef(null);
    const customUsernameInput = useRef(null);
    const customEmailInput = useRef(null);
    const webUrlInput = useRef(null);
    const webUsernameInput = useRef(null);
    const webPasswordInput = useRef(null);
    const userEmailInput = useRef(null);
    const userPasswordInput = useRef(null);
    const wifiPasswordInput = useRef(null);
    const cardNumberInput = useRef(null);
    const cardDateInput = useRef(null);
    const cardCvvInput = useRef(null);
    const cryptUsernameInput = useRef(null);
    const cryptPasswordInput = useRef(null);
    const cryptSeedInput = useRef(null);

    const [accountType, setAccountType] = useState("web")
    const [saveButtonText, setSaveButtonText] = useState('Save');
    const [saveButtonDisabled, setSaveButtonDisabled] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    const [customurltooltipshow, setCustomUrlTooltipshow] = useState(false);
    const [custompasswordtooltipshow, setCustomPasswordTooltipshow] = useState(false);
    const [customusernametooltipshow, setCustomUsernameTooltipshow] = useState(false);
    const [customemailtooltipshow, setCustomEmailTooltipshow] = useState(false);

    const [weburltooltipshow, setWebUrlTooltipshow] = useState(false);
    const [webusernametooltipshow, setWebUsernameTooltipshow] = useState(false);
    const [webpasswordtooltipshow, setWebPasswordTooltipshow] = useState(false);

    const [useremailtooltipshow, setUserEmailTooltipshow] = useState(false);
    const [userpasswordtooltipshow, setUserPasswordTooltipshow] = useState(false);

    const [wifipasswordtooltipshow, setWifiPasswordTooltipshow] = useState(false);

    const [cardnumbertooltipshow, setCardNumberTooltipshow] = useState(false);
    const [carddatetooltipshow, setCardDateTooltipshow] = useState(false);
    const [cardcvvtooltipshow, setCardCvvTooltipshow] = useState(false);

    const [cryptusernametooltipshow, setCryptUsernameTooltipshow] = useState(false);
    const [cryptpasswordtooltipshow, setCryptPasswordTooltipshow] = useState(false);
    const [cryptseedtooltipshow, setCryptSeedTooltipshow] = useState(false);

    const [customPasswordInputType, setCustomPasswordInputType] = useState(true);
    const [webPasswordInputType, setWebPasswordInputType] = useState(true);
    const [userPasswordInputType, setUserPasswordInputType] = useState(true);
    const [wifiPasswordInputType, setWifiPasswordInputType] = useState(true);
    const [cryptPasswordInputType, setCryptPasswordInputType] = useState(true);

    const onCopyCryptSeed = () => {
        setIsCopied(true);
        setCryptSeedTooltipshow(true)
        setTimeout(() => {
          setIsCopied(false);
          setCryptSeedTooltipshow(false)
        }, 1000);
    };

    const onCopyCryptPassword = () => {
        setIsCopied(true);
        setCryptPasswordTooltipshow(true)
        setTimeout(() => {
          setIsCopied(false);
          setCryptPasswordTooltipshow(false)
        }, 1000);
    };

    const onCopyCryptUsername = () => {
        setIsCopied(true);
        setCryptUsernameTooltipshow(true)
        setTimeout(() => {
          setIsCopied(false);
          setCryptUsernameTooltipshow(false)
        }, 1000);
    };

    const onCopyCardCvv = () => {
        setIsCopied(true);
        setCardCvvTooltipshow(true)
        setTimeout(() => {
          setIsCopied(false);
          setCardCvvTooltipshow(false)
        }, 1000);
    };

    const onCopyCardDate = () => {
        setIsCopied(true);
        setCardDateTooltipshow(true)
        setTimeout(() => {
          setIsCopied(false);
          setCardDateTooltipshow(false)
        }, 1000);
    };

    const onCopyCardNumber = () => {
        setIsCopied(true);
        setCardNumberTooltipshow(true)
        setTimeout(() => {
          setIsCopied(false);
          setCardNumberTooltipshow(false)
        }, 1000);
    };

    const onCopyWifiPassword = () => {
        setIsCopied(true);
        setWifiPasswordTooltipshow(true)
        setTimeout(() => {
          setIsCopied(false);
          setWifiPasswordTooltipshow(false)
        }, 1000);
    };

    const onCopyUserPassword = () => {
        setIsCopied(true);
        setUserPasswordTooltipshow(true)
        setTimeout(() => {
          setIsCopied(false);
          setUserPasswordTooltipshow(false)
        }, 1000);
    };

    const onCopyUserEmail = () => {
        setIsCopied(true);
        setUserEmailTooltipshow(true)
        setTimeout(() => {
          setIsCopied(false);
          setUserEmailTooltipshow(false)
        }, 1000);
    };

    const onCopyWebPassword = () => {
        setIsCopied(true);
        setWebPasswordTooltipshow(true)
        setTimeout(() => {
          setIsCopied(false);
          setWebPasswordTooltipshow(false)
        }, 1000);
    };

    const onCopyWebUsername = () => {
        setIsCopied(true);
        setWebUsernameTooltipshow(true)
        setTimeout(() => {
          setIsCopied(false);
          setWebUsernameTooltipshow(false)
        }, 1000);
    };

    const onCopyWebUrl = () => {
        setIsCopied(true);
        setWebUrlTooltipshow(true)
        setTimeout(() => {
          setIsCopied(false);
          setWebUrlTooltipshow(false)
        }, 1000);
    };

    const onCopyCustomEmail = () => {
        setIsCopied(true);
        setCustomEmailTooltipshow(true)
        setTimeout(() => {
          setIsCopied(false);
          setCustomEmailTooltipshow(false)
        }, 1000);
    };
    
    const onCopyCustomUrl = () => {
        setIsCopied(true);
        setCustomUrlTooltipshow(true)
        setTimeout(() => {
          setIsCopied(false);
          setCustomUrlTooltipshow(false)
        }, 1000);
    };
    const onCopyCustomPassword = () => {
        setIsCopied(true);
        setCustomPasswordTooltipshow(true)
        setTimeout(() => {
          setIsCopied(false);
          setCustomPasswordTooltipshow(false)
        }, 1000);
    };

    const onCopyCustomUsername = () => {
        setIsCopied(true);
        setCustomUsernameTooltipshow(true)
        setTimeout(() => {
          setIsCopied(false);
          setCustomUsernameTooltipshow(false)
        }, 1000);
    };

    const dispatch = useDispatch();
    const userName = useSelector((state) => {
        return state.user.user.name;
    })

    const [passwordName, setPasswordName] = useState('')
    const [webUrl, setWebUrl] = useState('')
    const [webUsername, setWebUsername] = useState('')
    const [webPassword, setWebPassword] = useState('')
    const [webNotes, setWebNotes] = useState('')
    const [userEmail, setUserEmail] = useState('')
    const [userPwd, setUserPwd] = useState('')
    const [emailNotes, setEmailNotes] = useState('')
    const [wifiPwd, setWifiPwd] = useState('')
    const [wifiNotes, setWifiNotes] = useState('')
    const [cardNumber, setCardNumber] = useState('')
    const [expireDate, setExpireDate] = useState('')
    const [cardCvv, setCardCvv] = useState('')
    const [cardNotes, setCardNotes] = useState('')
    const [cryptUsername, setCryptUsername] = useState('')
    const [cryptPassword, setCryptPassword] = useState('')
    const [cryptSeed, setCryptSeed] = useState('')
    const [cryptNotes, setCryptNotes] = useState('')
    const [customUrl, setCustomUrl] = useState('')
    const [customUsername, setCustomUsername] = useState('')
    const [customPassword, setCustomPassword] = useState('')
    const [customEmail, setCustomEmail] = useState('')
    const [customNotes, setCustomNotes] = useState('')
    const [ownerName, setOwnerName] = useState('')
    const [ownerEmail, setOwnerEmail] = useState('')
    const [passwordId, setPasswordId] = useState(0)

    const resetFields = () => {
        setPasswordName('')
        setWebUrl('')
        setWebUsername('')
        setWebPassword('')
        setWebNotes('')
        setUserEmail('')
        setUserPwd('')
        setEmailNotes('')
        setWifiPwd('')
        setWifiNotes('')
        setCardNumber('')
        setExpireDate('')
        setCardCvv('')
        setCardNotes('')
        setCryptUsername('')
        setCryptPassword('')
        setCryptSeed('')
        setCryptNotes('')
        setCustomUrl('')
        setCustomUsername('')
        setCustomPassword('')
        setCustomEmail('')
        setCustomNotes('')
    }

    const savePassword = async () => {
        if(passwordName !== '') {
            setSaveButtonText('Saving...');
            setSaveButtonDisabled(true);
            const baseUrl = await localStorage.getItem("baseUrl");
            const apiToken = await localStorage.getItem("authToken");
            var data;
            switch(accountType) {
                case 'email' : 
                data = {
                    name: passwordName,
                    email: userEmail,
                    password: userPwd,
                    notes: emailNotes,
                    account_type: accountType
                }
                break;
                case 'wifi' : 
                data = {
                    name: passwordName,
                    password:wifiPwd,
                    notes:wifiNotes,
                    account_type: accountType
                }
                break;
                case 'credit' : 
                data = {
                    name: passwordName,
                    number:cardNumber,
                    date:expireDate,
                    cvv:cardCvv,
                    notes:cardNotes,
                    account_type: accountType
                }
                break;
                case 'crypto' : 
                data = {
                    name: passwordName,
                    username: cryptUsername,
                    password:cryptPassword,
                    seed:cryptSeed,
                    notes:cryptNotes,
                    account_type: accountType
                }
                break;
                case 'custom' : 
                data = {
                    name: passwordName,
                    url: customUrl,
                    username:customUsername,
                    password:customPassword,
                    email:customEmail,
                    notes:customNotes,
                    account_type: accountType
                }
                break;
                default:
                data = {
                    name: passwordName,
                    url: webUrl,
                    username: webUsername,
                    password: webPassword,
                    notes: webNotes,
                    account_type: accountType
                }
                break;

            }
            let url = baseUrl + '/api/share_password/update/' + props.passwordId
            const response = await fetch(url, {
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
                    setAccountType('web')
                    resetFields()
                    props.changePasswordModel(false)
                    dispatch(getshared(props.sharedId))
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
            if(passwordName == '') {
                toastr.error('Name is required.', '')
            }
        }
    }

    const changeAccountTypeHandler = (e) => {
        resetFields()
        setAccountType(e.target.value)
    }

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

    const singlePassword = useSelector((state) => {
        return state.sharedPassword.shared_password_data;
    })

    useEffect(() => {
        if(singlePassword.password == undefined && props.isShowPasswordModal) {
            dispatch(getsharedpassword(props.passwordId))
        }
        if(singlePassword.password !== undefined) {
            setOwnerName(singlePassword.user_data.name)
            setOwnerEmail(singlePassword.user_data.email)
            setAccountType(singlePassword.password.account_type)
            setPasswordId(singlePassword.password.id)
            switch(singlePassword.password.account_type) {
                case 'email' : 
                setPasswordName(singlePassword.password.name)
                setUserEmail(singlePassword.password_data.email)
                setUserPwd(singlePassword.password_data.password)
                setEmailNotes(singlePassword.password_data.notes)
                break;
                case 'wifi' : 
                setPasswordName(singlePassword.password.name)
                setWifiPwd(singlePassword.password_data.password)
                setWifiNotes(singlePassword.password_data.notes)
                break;
                case 'credit' : 
                setPasswordName(singlePassword.password.name)
                setCardNumber(singlePassword.password_data.number)
                setExpireDate(singlePassword.password_data.date)
                setCardCvv(singlePassword.password_data.cvv)
                setCardNotes(singlePassword.password_data.notes)
                break;
                case 'crypto' : 
                setPasswordName(singlePassword.password.name)
                setCryptUsername(singlePassword.password_data.username)
                setCryptPassword(singlePassword.password_data.password)
                setCryptSeed(singlePassword.password_data.seed)
                setCryptNotes(singlePassword.password_data.notes)
                break;
                case 'custom' : 
                setPasswordName(singlePassword.password.name)
                setCustomUrl(singlePassword.password_data.url)
                setCustomUsername(singlePassword.password_data.username)
                setCustomPassword(singlePassword.password_data.password)
                setCustomEmail(singlePassword.password_data.email)
                setCustomNotes(singlePassword.password_data.notes)
                break;
                default:
                setPasswordName(singlePassword.password.name)
                setWebUrl(singlePassword.password_data.url)
                setWebUsername(singlePassword.password_data.username)
                setWebPassword(singlePassword.password_data.password)
                setWebNotes(singlePassword.password_data.notes)
                break;

            }
        }
    }, [singlePassword, props.isShowPasswordModal, props.passwordId])

    return (
      <>
      <Modal show={props.isShowPasswordModal} onHide={() =>{
        setAccountType('web')
        resetFields()
        props.changePasswordModel(false)
       }} size="lg" backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>
            <div className="form-group">
                <select className="custom-select form-control-border" onChange={changeAccountTypeHandler} value={accountType}>
                    <option value="web">Web Account</option>
                    <option value="email">Email Account</option>
                    <option value="wifi">Wifi Account</option>
                    <option value="credit">Card Card Account</option>
                    <option value="crypto">Cryptocurrency</option>
                    <option value="custom">Custom Account</option>
                </select>
            </div>
          </Modal.Title>
          <div className="header-password-trash">
                <p>Owned by </p><strong>{ownerName + " (" + ownerEmail + ")"}</strong>
          </div>
        </Modal.Header>
        <Modal.Body>
            <div className="row">
                <div className="col-sm-12">
                    <div className="form-group">
                        <label htmlFor="passwordName">Name</label>
                        <input type="text" className="form-control" id="passwordName" placeholder="Enter name" value={passwordName} onChange={(e) => setPasswordName(e.target.value) } />
                    </div>
                   
                    <div id="webAccount" style={{display: accountType === 'web' ? 'block' : 'none'}}>
                        <div className="form-group">
                            <label htmlFor="webUrl">URL</label>

                            <div className="input-group mb-3">
                                <input type="text" className="form-control" id="webUrl" placeholder="Enter URL" value={webUrl} onChange={(e) => setWebUrl(e.target.value) } />
                                <div className="input-group-append input-group-action" onClick={() => {
                                    if(validator.isURL(webUrl)) {
                                        window.open(webUrl, '_blank');
                                    }
                                }}>
                                    <span className="input-group-text"><i className="fas fa-external-link-alt"></i></span>
                                </div>
                                <div className="input-group-append input-group-action" ref={webUrlInput}>
                                    <CopyToClipboard text={webUrl} onCopy={onCopyWebUrl}>
                                        <span className="input-group-text"><i className="fas fa-copy" /></span>
                                    </CopyToClipboard>
                                </div>
                                <Overlay target={webUrlInput.current} show={weburltooltipshow} placement="bottom">
                                        {(props) => (
                                        <Tooltip {...props}>
                                            Copied!
                                        </Tooltip>
                                        )}
                                </Overlay>
                            </div>

                        </div>
                        <div className="form-group">
                            <label htmlFor="webUsername">Username</label>
                            <div className="input-group mb-3">
                                <input type="text" className="form-control" id="webUsername" placeholder="Enter username" value={webUsername} onChange={(e) => setWebUsername(e.target.value) } />
                                <div className="input-group-append input-group-action" ref={webUsernameInput}>
                                    <CopyToClipboard text={webUsername} onCopy={onCopyWebUsername}>
                                        <span className="input-group-text"><i className="fas fa-copy" /></span>
                                    </CopyToClipboard>
                                </div>
                                <Overlay target={webUsernameInput.current} show={webusernametooltipshow} placement="bottom">
                                        {(props) => (
                                        <Tooltip {...props}>
                                            Copied!
                                        </Tooltip>
                                        )}
                                </Overlay>
                            </div>
                            
                        </div>
                        <div className="form-group">
                            <label htmlFor="webPassword">Password</label>
                            <div className="input-group mb-3">
                                <input type={webPasswordInputType ? 'password' : 'text'} className="form-control" id="webPassword" placeholder="Enter password" value={webPassword} onChange={(e) => setWebPassword(e.target.value) } />
                                <div className="input-group-append input-group-action" onClick={() => {
                                    setWebPasswordInputType(!webPasswordInputType)
                                }}>
                                    <span className="input-group-text"><i className={webPasswordInputType ? 'fas fa-eye' : 'fa fa-eye-slash'} /></span>
                                </div>
                                <div className="input-group-append input-group-action" onClick={() => {
                                    let pwd = generatePassword() 
                                    setWebPassword(pwd)
                                }}>
                                    <span className="input-group-text"><i className="fas fa-sync" /></span>
                                </div>
                                <div className="input-group-append input-group-action" ref={webPasswordInput}>
                                    <CopyToClipboard text={webPassword} onCopy={onCopyWebPassword}>
                                        <span className="input-group-text"><i className="fas fa-copy" /></span>
                                    </CopyToClipboard>
                                </div>
                                <Overlay target={webPasswordInput.current} show={webpasswordtooltipshow} placement="bottom">
                                        {(props) => (
                                        <Tooltip {...props}>
                                            Copied!
                                        </Tooltip>
                                        )}
                                </Overlay>
                            </div>
                            
                        </div>
                        <div className="form-group">
                            <label htmlFor="webNotes">Notes</label>
                            <textarea className="form-control" id="webNotes" value={webNotes} onChange={(e) => setWebNotes(e.target.value) } ></textarea>
                        </div>
                    </div>
                    <div id="emailAccount" style={{display: accountType === 'email' ? 'block' : 'none'}}>
                        <div className="form-group">
                            <label htmlFor="userEmail">Email</label>

                            <div className="input-group mb-3">
                                <input type="email" className="form-control" id="userEmail" placeholder="Enter email" value={userEmail} onChange={(e) => setUserEmail(e.target.value) } />
                                <div className="input-group-append input-group-action" ref={userEmailInput}>
                                    <CopyToClipboard text={userEmail} onCopy={onCopyUserEmail}>
                                        <span className="input-group-text"><i className="fas fa-copy" /></span>
                                    </CopyToClipboard>
                                </div>
                                <Overlay target={userEmailInput.current} show={useremailtooltipshow} placement="bottom">
                                        {(props) => (
                                        <Tooltip {...props}>
                                            Copied!
                                        </Tooltip>
                                        )}
                                </Overlay>
                            </div>

                        </div>
                        <div className="form-group">
                            <label htmlFor="userPwd">Password</label>

                            <div className="input-group mb-3">
                                <input type={userPasswordInputType ? 'password' : 'text'} className="form-control" id="userPwd" placeholder="Enter password" value={userPwd} onChange={(e) => setUserPwd(e.target.value) } />
                                <div className="input-group-append input-group-action" onClick={() => {
                                    setUserPasswordInputType(!userPasswordInputType)
                                }}>
                                    <span className="input-group-text"><i className={userPasswordInputType ? 'fas fa-eye' : 'fa fa-eye-slash'} /></span>
                                </div>
                                <div className="input-group-append input-group-action" onClick={() => {
                                    let pwd = generatePassword() 
                                    setUserPwd(pwd)
                                }}>
                                    <span className="input-group-text"><i className="fas fa-sync" /></span>
                                </div>
                                <div className="input-group-append input-group-action" ref={userPasswordInput}>
                                    <CopyToClipboard text={userPwd} onCopy={onCopyUserPassword}>
                                        <span className="input-group-text"><i className="fas fa-copy" /></span>
                                    </CopyToClipboard>
                                </div>
                                <Overlay target={userPasswordInput.current} show={userpasswordtooltipshow} placement="bottom">
                                        {(props) => (
                                        <Tooltip {...props}>
                                            Copied!
                                        </Tooltip>
                                        )}
                                </Overlay>
                            </div>
                            
                        </div>
                        <div className="form-group">
                            <label htmlFor="emailNotes">Notes</label>
                            <textarea className="form-control" id="emailNotes" value={emailNotes} onChange={(e) => setEmailNotes(e.target.value) } ></textarea>
                        </div>
                    </div>
                    <div id="wifiAccount" style={{display: accountType === 'wifi' ? 'block' : 'none'}}>
                        <div className="form-group">
                            <label htmlFor="wifiPwd">Password</label>

                            <div className="input-group mb-3">
                                <input type={wifiPasswordInputType ? 'password' : 'text'} className="form-control" id="wifiPwd" placeholder="Enter password" value={wifiPwd} onChange={(e) => setWifiPwd(e.target.value) } />
                                <div className="input-group-append input-group-action" onClick={() => {
                                    setWifiPasswordInputType(!wifiPasswordInputType)
                                }}>
                                    <span className="input-group-text"><i className={wifiPasswordInputType ? 'fas fa-eye' : 'fa fa-eye-slash'} /></span>
                                </div>
                                <div className="input-group-append input-group-action" onClick={() => {
                                    let pwd = generatePassword() 
                                    setWifiPwd(pwd)
                                }}>
                                    <span className="input-group-text"><i className="fas fa-sync" /></span>
                                </div>
                                <div className="input-group-append input-group-action" ref={wifiPasswordInput}>
                                    <CopyToClipboard text={wifiPwd} onCopy={onCopyWifiPassword}>
                                        <span className="input-group-text"><i className="fas fa-copy" /></span>
                                    </CopyToClipboard>
                                </div>
                                <Overlay target={wifiPasswordInput.current} show={wifipasswordtooltipshow} placement="bottom">
                                        {(props) => (
                                        <Tooltip {...props}>
                                            Copied!
                                        </Tooltip>
                                        )}
                                </Overlay>
                            </div>

                            
                        </div>
                        <div className="form-group">
                            <label htmlFor="wifiNotes">Notes</label>
                            <textarea className="form-control" id="wifiNotes" value={wifiNotes} onChange={(e) => setWifiNotes(e.target.value) } ></textarea>
                        </div>
                    </div>
                    <div id="creditAccount" style={{display: accountType === 'credit' ? 'block' : 'none'}}>
                        <div className="form-group">
                            <label htmlFor="cardNumber">Card Number</label>

                            <div className="input-group mb-3">
                                <input type="text" className="form-control" id="cardNumber" placeholder="Enter card number" value={cardNumber} onChange={(e) => setCardNumber(e.target.value) } />
                                <div className="input-group-append input-group-action" ref={cardNumberInput}>
                                    <CopyToClipboard text={cardNumber} onCopy={onCopyCardNumber}>
                                        <span className="input-group-text"><i className="fas fa-copy" /></span>
                                    </CopyToClipboard>
                                </div>
                                <Overlay target={cardNumberInput.current} show={cardnumbertooltipshow} placement="bottom">
                                        {(props) => (
                                        <Tooltip {...props}>
                                            Copied!
                                        </Tooltip>
                                        )}
                                </Overlay>
                            </div>
                            
                        </div>
                        <div className="form-group">
                            <label htmlFor="expireDate">Expiration Date</label>

                            <div className="input-group mb-3">
                                <input type="text" className="form-control" id="expireDate" placeholder="Enter expiration date" value={expireDate} onChange={(e) => setExpireDate(e.target.value) } />
                                <div className="input-group-append input-group-action" ref={cardDateInput}>
                                    <CopyToClipboard text={expireDate} onCopy={onCopyCardDate}>
                                        <span className="input-group-text"><i className="fas fa-copy" /></span>
                                    </CopyToClipboard>
                                </div>
                                <Overlay target={cardDateInput.current} show={carddatetooltipshow} placement="bottom">
                                        {(props) => (
                                        <Tooltip {...props}>
                                            Copied!
                                        </Tooltip>
                                        )}
                                </Overlay>
                            </div>
                            
                        </div>
                        <div className="form-group">
                            <label htmlFor="cardCvv">CVV</label>

                            <div className="input-group mb-3">
                                <input type="text" className="form-control" id="cardCvv" placeholder="Enter CVV" value={cardCvv} onChange={(e) => setCardCvv(e.target.value) } />
                                <div className="input-group-append input-group-action" ref={cardCvvInput}>
                                    <CopyToClipboard text={cardCvv} onCopy={onCopyCardCvv}>
                                        <span className="input-group-text"><i className="fas fa-copy" /></span>
                                    </CopyToClipboard>
                                </div>
                                <Overlay target={cardCvvInput.current} show={cardcvvtooltipshow} placement="bottom">
                                        {(props) => (
                                        <Tooltip {...props}>
                                            Copied!
                                        </Tooltip>
                                        )}
                                </Overlay>
                            </div>
                            
                        </div>
                        <div className="form-group">
                            <label htmlFor="cardNotes">Notes</label>
                            <textarea className="form-control" id="cardNotes" value={cardNotes} onChange={(e) => setCardNotes(e.target.value) } ></textarea>
                        </div>
                    </div>
                    <div id="cryptoAccount" style={{display: accountType === 'crypto' ? 'block' : 'none'}}>
                        <div className="form-group">
                            <label htmlFor="cryptUsername">Username</label>

                            <div className="input-group mb-3">
                                <input type="text" className="form-control" id="cryptUsername" placeholder="Enter username" value={cryptUsername} onChange={(e) => setCryptUsername(e.target.value) } />
                                <div className="input-group-append input-group-action" ref={cryptUsernameInput}>
                                    <CopyToClipboard text={cryptUsername} onCopy={onCopyCryptUsername}>
                                        <span className="input-group-text"><i className="fas fa-copy" /></span>
                                    </CopyToClipboard>
                                </div>
                                <Overlay target={cryptUsernameInput.current} show={cryptusernametooltipshow} placement="bottom">
                                        {(props) => (
                                        <Tooltip {...props}>
                                            Copied!
                                        </Tooltip>
                                        )}
                                </Overlay>
                            </div>

                        </div>
                        <div className="form-group">
                            <label htmlFor="cryptPassword">Password</label>

                            <div className="input-group mb-3">
                                <input type={cryptPasswordInputType ? 'password' : 'text'} className="form-control" id="cryptPassword" placeholder="Enter password" value={cryptPassword} onChange={(e) => setCryptPassword(e.target.value) } />
                                <div className="input-group-append input-group-action" onClick={() => {
                                    setCryptPasswordInputType(!cryptPasswordInputType)
                                }}>
                                    <span className="input-group-text"><i className={cryptPasswordInputType ? 'fas fa-eye' : 'fa fa-eye-slash'} /></span>
                                </div>
                                <div className="input-group-append input-group-action" onClick={() => {
                                    let pwd = generatePassword() 
                                    setCryptPassword(pwd)
                                }}>
                                    <span className="input-group-text"><i className="fas fa-sync" /></span>
                                </div>
                                <div className="input-group-append input-group-action" ref={cryptPasswordInput}>
                                    <CopyToClipboard text={cryptPassword} onCopy={onCopyCryptPassword}>
                                        <span className="input-group-text"><i className="fas fa-copy" /></span>
                                    </CopyToClipboard>
                                </div>
                                <Overlay target={cryptPasswordInput.current} show={cryptpasswordtooltipshow} placement="bottom">
                                        {(props) => (
                                        <Tooltip {...props}>
                                            Copied!
                                        </Tooltip>
                                        )}
                                </Overlay>
                            </div>
                            
                        </div>
                        <div className="form-group">
                            <label htmlFor="cryptSeed">Seed</label>
                            
                            <div className="input-group mb-3">
                                <input type="text" className="form-control" id="cryptSeed" placeholder="Enter seed" value={cryptSeed} onChange={(e) => setCryptSeed(e.target.value) } />
                                <div className="input-group-append input-group-action" ref={cryptSeedInput}>
                                    <CopyToClipboard text={cryptSeed} onCopy={onCopyCryptSeed}>
                                        <span className="input-group-text"><i className="fas fa-copy" /></span>
                                    </CopyToClipboard>
                                </div>
                                <Overlay target={cryptSeedInput.current} show={cryptseedtooltipshow} placement="bottom">
                                        {(props) => (
                                        <Tooltip {...props}>
                                            Copied!
                                        </Tooltip>
                                        )}
                                </Overlay>
                            </div>

                            
                        </div>
                        <div className="form-group">
                            <label htmlFor="cryptNotes">Notes</label>
                            <textarea className="form-control" id="cryptNotes" value={cryptNotes} onChange={(e) => setCryptNotes(e.target.value) } ></textarea>
                        </div>
                    </div>
                    <div id="customAccount" style={{display: accountType === 'custom' ? 'block' : 'none'}}>
                        <div className="form-group">
                            <label htmlFor="customUrl">URL</label>

                            <div className="input-group mb-3">
                                <input type="text" className="form-control" id="customUrl" placeholder="Enter URL" value={customUrl} onChange={(e) => setCustomUrl(e.target.value) } />
                                <div className="input-group-append input-group-action" onClick={() => {
                                    if(validator.isURL(customUrl)) {
                                        window.open(customUrl, '_blank');
                                    }
                                }}>
                                    <span className="input-group-text"><i className="fas fa-external-link-alt"></i></span>
                                </div>
                                <div className="input-group-append input-group-action" ref={customUrlInput}>
                                    <CopyToClipboard text={customUrl} onCopy={onCopyCustomUrl}>
                                        <span className="input-group-text"><i className="fas fa-copy" /></span>
                                    </CopyToClipboard>
                                </div>
                                <Overlay target={customUrlInput.current} show={customurltooltipshow} placement="bottom">
                                        {(props) => (
                                        <Tooltip {...props}>
                                            Copied!
                                        </Tooltip>
                                        )}
                                </Overlay>
                            </div>
 
                        </div>
                        <div className="form-group">
                            <label htmlFor="customUsername">Username</label>

                            <div className="input-group mb-3">
                            <input type="text" className="form-control" id="customUsername" placeholder="Enter username" value={customUsername} onChange={(e) => setCustomUsername(e.target.value) } />
                                <div className="input-group-append input-group-action" ref={customUsernameInput}>
                                    <CopyToClipboard text={customUsername} onCopy={onCopyCustomUsername}>
                                        <span className="input-group-text"><i className="fas fa-copy" /></span>
                                    </CopyToClipboard>
                                </div>
                                <Overlay target={customUsernameInput.current} show={customusernametooltipshow} placement="bottom">
                                        {(props) => (
                                        <Tooltip {...props}>
                                            Copied!
                                        </Tooltip>
                                        )}
                                </Overlay>
                            </div>

                        </div>
                        <div className="form-group">
                            <label htmlFor="customPassword">Password</label>

                            <div className="input-group mb-3">
                                <input type={customPasswordInputType ? 'password' : 'text'} className="form-control" id="customPassword" placeholder="Enter password" value={customPassword} onChange={(e) => setCustomPassword(e.target.value) } />
                                <div className="input-group-append input-group-action" onClick={() => {
                                    setCustomPasswordInputType(!customPasswordInputType)
                                }}>
                                    <span className="input-group-text"><i className={customPasswordInputType ? 'fas fa-eye' : 'fa fa-eye-slash'} /></span>
                                </div>
                                <div className="input-group-append input-group-action" onClick={() => {
                                    let pwd = generatePassword() 
                                    setCustomPassword(pwd)
                                }}>
                                    <span className="input-group-text"><i className="fas fa-sync" /></span>
                                </div>
                                <div className="input-group-append input-group-action" ref={customPasswordInput}>
                                    <CopyToClipboard text={customPassword} onCopy={onCopyCustomPassword}>
                                        <span className="input-group-text"><i className="fas fa-copy" /></span>
                                    </CopyToClipboard>
                                </div>
                                <Overlay target={customPasswordInput.current} show={custompasswordtooltipshow} placement="bottom">
                                        {(props) => (
                                        <Tooltip {...props}>
                                            Copied!
                                        </Tooltip>
                                        )}
                                </Overlay>
                            </div>

                        </div>
                        <div className="form-group">
                            <label htmlFor="customEmail">Email</label>

                            <div className="input-group mb-3">
                            <input type="email" className="form-control" id="customEmail" placeholder="Enter email" value={customEmail} onChange={(e) => setCustomEmail(e.target.value) } />
                                <div className="input-group-append input-group-action" ref={customEmailInput}>
                                    <CopyToClipboard text={customEmail} onCopy={onCopyCustomEmail}>
                                        <span className="input-group-text"><i className="fas fa-copy" /></span>
                                    </CopyToClipboard>
                                </div>
                                <Overlay target={customEmailInput.current} show={customemailtooltipshow} placement="bottom">
                                        {(props) => (
                                        <Tooltip {...props}>
                                            Copied!
                                        </Tooltip>
                                        )}
                                </Overlay>
                            </div>

                        </div>
                        <div className="form-group">
                            <label htmlFor="customNotes">Notes</label>
                            <textarea className="form-control" id="customNotes" value={customNotes} onChange={(e) => setCustomNotes(e.target.value) } ></textarea>
                        </div>
                    </div>
                </div>
            </div>
        </Modal.Body>
        <Modal.Footer>
            {props.passwordType == 'edit' ? 
            <button type="submit" disabled={passwordName === '' || saveButtonDisabled ? true : false } className="btn btn-primary" onClick={savePassword}>{saveButtonText}</button>
            :
            ""
            }
            
        </Modal.Footer>
      </Modal>
      </>
    )
}

export default SharedPasswordForm;