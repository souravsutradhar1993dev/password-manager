import React, {useState, useRef, useCallback, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux'
import toastr from 'toastr'
import 'toastr/build/toastr.min.css'
import CategoryTree from './CategoryTree'
import { Modal, Overlay, Tooltip } from "react-bootstrap";
import { CopyToClipboard } from "react-copy-to-clipboard";
import validator from 'validator'
import {getcategorychildren} from '../actions/action'
import SweetAlert from 'react-bootstrap-sweetalert';

const PasswordForm = (props) => {
    const customPasswordInput = useRef(null);
    const customUrlInput = useRef(null);
    const customUsernameInput = useRef(null);
    const customEmailInput = useRef(null);

    const socialPasswordInput = useRef(null);
    const socialUsernameInput = useRef(null);

    const webUrlInput = useRef(null);
    const webUsernameInput = useRef(null);
    const webPasswordInput = useRef(null);

    const ftpUrlInput = useRef(null);
    const ftpUsernameInput = useRef(null);
    const ftpPasswordInput = useRef(null);

    const cpanelUrlInput = useRef(null);
    const cpanelUsernameInput = useRef(null);
    const cpanelPasswordInput = useRef(null);

    const userEmailInput = useRef(null);
    const userPasswordInput = useRef(null);

    const gsuiteEmailInput = useRef(null);
    const gsuitePasswordInput = useRef(null);

    const wifiPasswordInput = useRef(null);
    const cardNumberInput = useRef(null);
    const cardDateInput = useRef(null);
    const cardCvvInput = useRef(null);
    const cryptUsernameInput = useRef(null);
    const cryptPasswordInput = useRef(null);
    const cryptSeedInput = useRef(null);

    const [isShowUserForm, setIsShowUserForm] = useState(false)
    const [accountType, setAccountType] = useState("ftp")
    const [parentCat, setParentCat] = useState(0)
    const [catSelectedUsers, setCatSelectedUsers] = useState([]);
    const [catSelectedUserIds, setCatSelectedUserIds] = useState([]);
    const [selectUserId, setSelectUserId] = useState('');
    const [selectUserName, setSelectUserName] = useState('');
    const [saveButtonText, setSaveButtonText] = useState('Save');
    const [saveButtonDisabled, setSaveButtonDisabled] = useState(false);
    const [selectPerm, setSelectPerm] = useState("view");
    const [isCopied, setIsCopied] = useState(false);
    const [deleteAlert, setDeleteAlert] = useState(null)

    const [customurltooltipshow, setCustomUrlTooltipshow] = useState(false);
    const [custompasswordtooltipshow, setCustomPasswordTooltipshow] = useState(false);
    const [customusernametooltipshow, setCustomUsernameTooltipshow] = useState(false);
    const [customemailtooltipshow, setCustomEmailTooltipshow] = useState(false);

    const [socialpasswordtooltipshow, setSocialPasswordTooltipshow] = useState(false);
    const [socialusernametooltipshow, setSocialUsernameTooltipshow] = useState(false);

    const [weburltooltipshow, setWebUrlTooltipshow] = useState(false);
    const [webusernametooltipshow, setWebUsernameTooltipshow] = useState(false);
    const [webpasswordtooltipshow, setWebPasswordTooltipshow] = useState(false);

    const [ftpurltooltipshow, setFtpUrlTooltipshow] = useState(false);
    const [ftpusernametooltipshow, setFtpUsernameTooltipshow] = useState(false);
    const [ftppasswordtooltipshow, setFtpPasswordTooltipshow] = useState(false);

    const [cpanelurltooltipshow, setCpanelUrlTooltipshow] = useState(false);
    const [cpanelusernametooltipshow, setCpanelUsernameTooltipshow] = useState(false);
    const [cpanelpasswordtooltipshow, setCpanelPasswordTooltipshow] = useState(false);

    const [gsuiteemailtooltipshow, setGsuiteEmailTooltipshow] = useState(false);
    const [gsuitepasswordtooltipshow, setGsuitePasswordTooltipshow] = useState(false);

    const [useremailtooltipshow, setUserEmailTooltipshow] = useState(false);
    const [userpasswordtooltipshow, setUserPasswordTooltipshow] = useState(false);

    const [wifipasswordtooltipshow, setWifiPasswordTooltipshow] = useState(false);

    const [cardnumbertooltipshow, setCardNumberTooltipshow] = useState(false);
    const [carddatetooltipshow, setCardDateTooltipshow] = useState(false);
    const [cardcvvtooltipshow, setCardCvvTooltipshow] = useState(false);

    const [cryptusernametooltipshow, setCryptUsernameTooltipshow] = useState(false);
    const [cryptpasswordtooltipshow, setCryptPasswordTooltipshow] = useState(false);
    const [cryptseedtooltipshow, setCryptSeedTooltipshow] = useState(false);

    const [ftpPasswordInputType, setFtpPasswordInputType] = useState(true);
    const [cpanelPasswordInputType, setCpanelPasswordInputType] = useState(true);
    const [gsuitePasswordInputType, setGsuitePasswordInputType] = useState(true);
    const [socialPasswordInputType, setSocialPasswordInputType] = useState(true);
    const [customPasswordInputType, setCustomPasswordInputType] = useState(true);
    const [webPasswordInputType, setWebPasswordInputType] = useState(true);
    const [userPasswordInputType, setUserPasswordInputType] = useState(true);
    const [wifiPasswordInputType, setWifiPasswordInputType] = useState(true);
    const [cryptPasswordInputType, setCryptPasswordInputType] = useState(true);

    const [isEditForm, setIsEditForm] = useState(false)

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

    const onCopyGsuitePassword = () => {
        setIsCopied(true);
        setGsuitePasswordTooltipshow(true)
        setTimeout(() => {
          setIsCopied(false);
          setGsuitePasswordTooltipshow(false)
        }, 1000);
    };

    const onCopyGsuiteEmail = () => {
        setIsCopied(true);
        setGsuiteEmailTooltipshow(true)
        setTimeout(() => {
          setIsCopied(false);
          setGsuiteEmailTooltipshow(false)
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

    const onCopyFtpPassword = () => {
        setIsCopied(true);
        setFtpPasswordTooltipshow(true)
        setTimeout(() => {
          setIsCopied(false);
          setFtpPasswordTooltipshow(false)
        }, 1000);
    };

    const onCopyFtpUsername = () => {
        setIsCopied(true);
        setFtpUsernameTooltipshow(true)
        setTimeout(() => {
          setIsCopied(false);
          setFtpUsernameTooltipshow(false)
        }, 1000);
    };

    const onCopyFtpUrl = () => {
        setIsCopied(true);
        setFtpUrlTooltipshow(true)
        setTimeout(() => {
          setIsCopied(false);
          setFtpUrlTooltipshow(false)
        }, 1000);
    };

    const onCopyCpanelPassword = () => {
        setIsCopied(true);
        setCpanelPasswordTooltipshow(true)
        setTimeout(() => {
          setIsCopied(false);
          setCpanelPasswordTooltipshow(false)
        }, 1000);
    };

    const onCopyCpanelUsername = () => {
        setIsCopied(true);
        setCpanelUsernameTooltipshow(true)
        setTimeout(() => {
          setIsCopied(false);
          setCpanelUsernameTooltipshow(false)
        }, 1000);
    };

    const onCopyCpanelUrl = () => {
        setIsCopied(true);
        setCpanelUrlTooltipshow(true)
        setTimeout(() => {
          setIsCopied(false);
          setCpanelUrlTooltipshow(false)
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

    const onCopySocialPassword = () => {
        setIsCopied(true);
        setSocialPasswordTooltipshow(true)
        setTimeout(() => {
          setIsCopied(false);
          setSocialPasswordTooltipshow(false)
        }, 1000);
    };

    const onCopySocialUsername = () => {
        setIsCopied(true);
        setSocialUsernameTooltipshow(true)
        setTimeout(() => {
          setIsCopied(false);
          setSocialUsernameTooltipshow(false)
        }, 1000);
    };

    const dispatch = useDispatch();
    const userName = useSelector((state) => {
        return state.user.user.name;
    })

    const [passwordName, setPasswordName] = useState('')

    const [ftpUrl, setFtpUrl] = useState('')
    const [ftpUsername, setFtpUsername] = useState('')
    const [ftpPassword, setFtpPassword] = useState('')
    const [ftpNotes, setFtpNotes] = useState('')

    const [cpanelUrl, setCpanelUrl] = useState('')
    const [cpanelUsername, setCpanelUsername] = useState('')
    const [cpanelPassword, setCpanelPassword] = useState('')
    const [cpanelNotes, setCpanelNotes] = useState('')

    const [gsuiteEmail, setGsuiteEmail] = useState('')
    const [gsuitePwd, setGsuitePwd] = useState('')
    const [gsuiteNotes, setGsuiteNotes] = useState('')

    const [socialUsername, setSocialUsername] = useState('')
    const [socialPassword, setSocialPassword] = useState('')
    const [socialNotes, setSocialNotes] = useState('')

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
    const [passwordId, setPasswordId] = useState(0)
    const [categoryTitle, setCategoryTitle] = useState('')

    const resetFields = () => {
        setPasswordName('')
        setWebUrl('')
        setWebUsername('')
        setWebPassword('')
        setWebNotes('')
        setFtpUrl('')
        setFtpUsername('')
        setFtpPassword('')
        setFtpNotes('')
        setCpanelUrl('')
        setCpanelUsername('')
        setCpanelPassword('')
        setCpanelNotes('')
        setUserEmail('')
        setUserPwd('')
        setEmailNotes('')
        setGsuiteEmail('')
        setGsuitePwd('')
        setGsuiteNotes('')
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
        setSocialUsername('')
        setSocialPassword('')
        setSocialNotes('')
    }

    const memorizeCategoryHandler = useCallback((currentNode, selectedNodes) => {
        setParentCat(currentNode.value)
    }, []);

    const currentCategoryId = useSelector((state) => {
        return state.category.category_id;
    })

    const allUsers = useSelector((state) => {
        return state.allUser.user;
    })

    const allCategories = {
        label: 'Select Account',
        value: 0,
        isDefaultValue: currentCategoryId == '' ? true : false,
        children: props.categories
    }

    const isShowPasswordModal = useSelector((state) => {
        return state.showPasswordModal.showPasswordModal;
    })
    const [shouldCatUpdate, setShouldCatUpdate] = useState(isShowPasswordModal)

    const savePassword = async () => {
        if(passwordName !== '' && parentCat != '') {
            setSaveButtonText('Saving...');
            setSaveButtonDisabled(true);
            const baseUrl = await localStorage.getItem("baseUrl");
            const apiToken = await localStorage.getItem("authToken");
            var data;
            switch(accountType) {
                case 'cpanel' :
                    data = {
                        name: passwordName,
                        url: cpanelUrl,
                        username: cpanelUsername,
                        password: cpanelPassword,
                        notes: cpanelNotes,
                        category: parentCat,
                        password_users: catSelectedUsers,
                        account_type: accountType
                    }
                break;
                case 'gsuite' : 
                data = {
                    name: passwordName,
                    email: gsuiteEmail,
                    password: gsuitePwd,
                    notes: gsuiteNotes,
                    category: parentCat,
                    password_users: catSelectedUsers,
                    account_type: accountType
                }
                break;
                case 'social' : 
                data = {
                    name: passwordName,
                    username:socialUsername,
                    password:socialPassword,
                    notes:socialNotes,
                    category: parentCat,
                    password_users: catSelectedUsers,
                    account_type: accountType
                }
                break;
                case 'web' :
                    data = {
                        name: passwordName,
                        url: webUrl,
                        username: webUsername,
                        password: webPassword,
                        notes: webNotes,
                        category: parentCat,
                        password_users: catSelectedUsers,
                        account_type: accountType
                    }
                break;
                case 'email' : 
                data = {
                    name: passwordName,
                    email: userEmail,
                    password: userPwd,
                    notes: emailNotes,
                    category: parentCat,
                    password_users: catSelectedUsers,
                    account_type: accountType
                }
                break;
                case 'wifi' : 
                data = {
                    name: passwordName,
                    password:wifiPwd,
                    notes:wifiNotes,
                    category: parentCat,
                    password_users: catSelectedUsers,
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
                    category: parentCat,
                    password_users: catSelectedUsers,
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
                    category: parentCat,
                    password_users: catSelectedUsers,
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
                    category: parentCat,
                    password_users: catSelectedUsers,
                    account_type: accountType
                }
                break;
                default:
                data = {
                    name: passwordName,
                    url: ftpUrl,
                    username: ftpUsername,
                    password: ftpPassword,
                    notes: ftpNotes,
                    category: parentCat,
                    password_users: catSelectedUsers,
                    account_type: accountType
                }
                break;

            }
            let url = passwordId > 0 ? baseUrl + '/api/password/' + passwordId : baseUrl + '/api/password'
            const response = await fetch(url, {
                method: passwordId > 0 ? 'PUT' : 'POST', 
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
                    setParentCat(0);
                    setCatSelectedUsers([]);
                    setCatSelectedUserIds([])
                    resetFields()
                    setPasswordId(0)
                    setAccountType('ftp')
                    setShouldCatUpdate(!shouldCatUpdate)
                    dispatch({ type: 'GET_SHOW_PASSWORD_MODAL', payload: false})
                    if(currentCategoryId !== '') {
                        dispatch(getcategorychildren(currentCategoryId))
                    }
                    
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
            }else if( parentCat == 0){
                toastr.error('Please select category.', '')
            }
        }
    }

    const accountTypes = [];
    accountTypes['ftp'] = 'FTP Account';
    accountTypes['cpanel'] = 'Hosting Control Panel Account';
    accountTypes['gsuite'] = 'Gsuites Account';
    accountTypes['social'] = 'Social Media Account';
    accountTypes['web'] = 'Web Account';
    accountTypes['email'] = 'Email Account';
    accountTypes['wifi'] = 'Wifi Account';
    accountTypes['credit'] = 'Card Card Account';
    accountTypes['crypto'] = 'Cryptocurrency';
    accountTypes['custom'] = 'Custom Account';

    const [accountTypeLists, setAccountTypeLists] = useState(accountTypes)

    const changeAccountTypeHandler = (e) => {
        resetFields()
        setAccountType(e.target.value)
    }
  
    const changeSelectUserHandler = (e) => {
        setSelectUserName(e.target[e.target.selectedIndex].text)
        setSelectUserId(e.target.value)
    }

    const changeSelectPermHandler = (e) => {
        setSelectPerm(e.target.value)
    }

    const addCatUser = () => {
        if(selectUserId) {
            setCatSelectedUsers([...catSelectedUsers, {id: selectUserId, name: selectUserName, permission_type: selectPerm}])
            setCatSelectedUserIds([...catSelectedUserIds, parseInt(selectUserId)])
            setSelectUserId('');
            setSelectPerm('view');
            setSelectUserName('');
            setIsShowUserForm(false)
        }
    
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
        return state.editPassword.password_data;
    })

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
            You will not be able to recover this password!
        </SweetAlert>
    )

  const deletePassword = () => {
      setDeleteAlert(
          showAlert()
      )
  }
  const onConfirmDelete = async () => {
      const baseUrl = await localStorage.getItem("baseUrl");
      const apiToken = await localStorage.getItem("authToken");
      const response = await fetch(baseUrl + '/api/password/' + passwordId, {
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
              dispatch({ type: 'GET_SHOW_PASSWORD_MODAL', payload: false})
              dispatch(getcategorychildren(currentCategoryId))
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
        setParentCat(currentCategoryId)
        setAccountType('ftp')
        if(singlePassword.password !== undefined) {
            if(singlePassword.password.id !== undefined) {
                setIsEditForm(false)
                setCatSelectedUsers(singlePassword.password_permissions);
                if(singlePassword.password_permissions.length > 0) {
                    singlePassword.password_permissions.forEach((item, index) => {
                        setCatSelectedUserIds([...catSelectedUserIds, parseInt(item.id)])
                    });
                }
                
                setAccountType(singlePassword.password.account_type)
                setPasswordId(singlePassword.password.id)
                setCategoryTitle(singlePassword.category_title)
                switch(singlePassword.password.account_type) {
                    case 'cpanel' : 
                    setPasswordName(singlePassword.password.name)
                    setCpanelUrl(singlePassword.password_data.url)
                    setCpanelUsername(singlePassword.password_data.username)
                    setCpanelPassword(singlePassword.password_data.password)
                    setCpanelNotes(singlePassword.password_data.notes)
                    break;
                    case 'gsuite' : 
                    setPasswordName(singlePassword.password.name)
                    setGsuiteEmail(singlePassword.password_data.email)
                    setGsuitePwd(singlePassword.password_data.password)
                    setGsuiteNotes(singlePassword.password_data.notes)
                    break;
                    case 'social' : 
                    setPasswordName(singlePassword.password.name)
                    setSocialUsername(singlePassword.password_data.username)
                    setSocialPassword(singlePassword.password_data.password)
                    setSocialNotes(singlePassword.password_data.notes)
                    break;
                    case 'web' : 
                    setPasswordName(singlePassword.password.name)
                    setWebUrl(singlePassword.password_data.url)
                    setWebUsername(singlePassword.password_data.username)
                    setWebPassword(singlePassword.password_data.password)
                    setWebNotes(singlePassword.password_data.notes)
                    break;
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
                    setFtpUrl(singlePassword.password_data.url)
                    setFtpUsername(singlePassword.password_data.username)
                    setFtpPassword(singlePassword.password_data.password)
                    setFtpNotes(singlePassword.password_data.notes)
                    break;
                }
            }else {
                setCatSelectedUsers([]);
                setCatSelectedUserIds([])
                resetFields()
                setPasswordId(0)
                setAccountType('ftp')
                setIsEditForm(true)
            }
        }else {
            setCatSelectedUsers([]);
            setCatSelectedUserIds([])
            resetFields()
            setPasswordId(0)
            setAccountType('ftp')
            setIsEditForm(true)
        }
    }, [singlePassword, currentCategoryId, isShowPasswordModal, passwordId])
    
    return (
      <>
      <Modal show={isShowPasswordModal} onHide={() =>{
        setParentCat(0);
        setCatSelectedUsers([]);
        setCatSelectedUserIds([])
        resetFields()
        setPasswordId(0)
        setAccountType('ftp')
        dispatch({ type: 'GET_SHOW_PASSWORD_MODAL', payload: false})
       }} size="lg" backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>
            <div className="view" style={{display: isEditForm ? 'none' : 'flex'}}>
                <h4>{accountTypeLists[accountType]}</h4>
            </div>
            <div className="form-group edit" style={{display: isEditForm ? 'flex' : 'none'}}>
                <select className="custom-select form-control-border" onChange={changeAccountTypeHandler} value={accountType}>
                    {
                        Object.keys(accountTypeLists).map((key, ind) => (
                            <option key={ind} value={key}>{accountTypeLists[key]}</option>
                        ))
                    }
                </select>
            </div>
          </Modal.Title>
          {
              passwordId > 0 ?
              <>
              <div className="header-password-edit" onClick={() => setIsEditForm(!isEditForm)}>
                <i className={isEditForm ? "fa fa-times" : "fas fa-edit"} aria-hidden="true"></i>
              </div>
              <div className="header-password-trash" onClick={() => deletePassword()}>
                <i className="fa fa-trash" aria-hidden="true"></i>
              </div>
              </>
              :
              ""
          }
          
        </Modal.Header>
        <Modal.Body>
            <div className="row">
                <div className="col-sm-8">
                    <div className="form-group">
                        <label htmlFor="passwordName">Name</label>
                        <div className="view" style={{display: isEditForm ? 'none' : 'flex'}}>
                            <p>{passwordName}</p>
                        </div>
                        <input type="text" className="form-control edit" style={{display: isEditForm ? 'flex' : 'none'}} id="passwordName" placeholder="Enter name" value={passwordName} onChange={(e) => setPasswordName(e.target.value) } />
                    </div>
                   
                    <div id="ftpAccount" style={{display: accountType === 'ftp' ? 'block' : 'none'}}>
                        <div className="form-group">
                            <label htmlFor="ftpUrl">URL</label>
                            <div className="view" style={{display: isEditForm ? 'none' : 'flex'}}>
                                <p>{ftpUrl}</p>
                            </div>
                            <div className="input-group mb-3 edit" style={{display: isEditForm ? 'flex' : 'none'}}>
                                <input type="text" className="form-control" id="ftpUrl" placeholder="Enter URL" value={ftpUrl} onChange={(e) => setFtpUrl(e.target.value) } />
                                <div className="input-group-append input-group-action" onClick={() => {
                                    if(validator.isURL(ftpUrl)) {
                                        window.open(ftpUrl, '_blank');
                                    }
                                }}>
                                    <span className="input-group-text"><i className="fas fa-external-link-alt"></i></span>
                                </div>
                                <div className="input-group-append input-group-action" ref={ftpUrlInput}>
                                    <CopyToClipboard text={ftpUrl} onCopy={onCopyFtpUrl}>
                                        <span className="input-group-text"><i className="fas fa-copy" /></span>
                                    </CopyToClipboard>
                                </div>
                                <Overlay target={ftpUrlInput.current} show={ftpurltooltipshow} placement="bottom">
                                        {(props) => (
                                        <Tooltip {...props}>
                                            Copied!
                                        </Tooltip>
                                        )}
                                </Overlay>
                            </div>

                        </div>
                        <div className="form-group">
                            <label htmlFor="ftpUsername">Username</label>
                            <div className="view" style={{display: isEditForm ? 'none' : 'flex'}}>
                                <p>{ftpUsername}</p>
                            </div>
                            <div className="input-group mb-3 edit" style={{display: isEditForm ? 'flex' : 'none'}}>
                                <input type="text" className="form-control" id="ftpUsername" placeholder="Enter username" value={ftpUsername} onChange={(e) => setFtpUsername(e.target.value) } />
                                <div className="input-group-append input-group-action" ref={ftpUsernameInput}>
                                    <CopyToClipboard text={ftpUsername} onCopy={onCopyFtpUsername}>
                                        <span className="input-group-text"><i className="fas fa-copy" /></span>
                                    </CopyToClipboard>
                                </div>
                                <Overlay target={ftpUsernameInput.current} show={ftpusernametooltipshow} placement="bottom">
                                        {(props) => (
                                        <Tooltip {...props}>
                                            Copied!
                                        </Tooltip>
                                        )}
                                </Overlay>
                            </div>
                            
                        </div>
                        <div className="form-group">
                            <label htmlFor="ftpPassword">Password</label>
                            <div className="view" style={{display: isEditForm ? 'none' : 'flex'}}>
                                <p>{ftpPassword}</p>
                            </div>
                            <div className="input-group mb-3 edit" style={{display: isEditForm ? 'flex' : 'none'}}>
                                <input type={ftpPasswordInputType ? 'password' : 'text'} className="form-control" id="ftpPassword" placeholder="Enter password" value={ftpPassword} onChange={(e) => setFtpPassword(e.target.value) } />
                                <div className="input-group-append input-group-action" onClick={() => {
                                    setFtpPasswordInputType(!ftpPasswordInputType)
                                }}>
                                    <span className="input-group-text"><i className={ftpPasswordInputType ? 'fas fa-eye' : 'fa fa-eye-slash'} /></span>
                                </div>
                                <div className="input-group-append input-group-action" onClick={() => {
                                    let pwd = generatePassword() 
                                    setFtpPassword(pwd)
                                }}>
                                    <span className="input-group-text"><i className="fas fa-sync" /></span>
                                </div>
                                <div className="input-group-append input-group-action" ref={ftpPasswordInput}>
                                    <CopyToClipboard text={ftpPassword} onCopy={onCopyFtpPassword}>
                                        <span className="input-group-text"><i className="fas fa-copy" /></span>
                                    </CopyToClipboard>
                                </div>
                                <Overlay target={ftpPasswordInput.current} show={ftppasswordtooltipshow} placement="bottom">
                                        {(props) => (
                                        <Tooltip {...props}>
                                            Copied!
                                        </Tooltip>
                                        )}
                                </Overlay>
                            </div>
                            
                        </div>
                        <div className="form-group">
                            <label htmlFor="ftpNotes">Notes</label>
                            <div className="view" style={{display: isEditForm ? 'none' : 'flex'}}>
                                <p>{ftpNotes}</p>
                            </div>
                            <textarea className="form-control edit" style={{display: isEditForm ? 'flex' : 'none'}} id="ftpNotes" value={ftpNotes} onChange={(e) => setFtpNotes(e.target.value) } ></textarea>
                        </div>
                    </div>
                    <div id="cpanelAccount" style={{display: accountType === 'cpanel' ? 'block' : 'none'}}>
                        <div className="form-group">
                            <label htmlFor="cpanelUrl">URL</label>
                            <div className="view" style={{display: isEditForm ? 'none' : 'flex'}}>
                                <p>{cpanelUrl}</p>
                            </div>
                            <div className="input-group mb-3 edit" style={{display: isEditForm ? 'flex' : 'none'}}>
                                <input type="text" className="form-control" id="cpanelUrl" placeholder="Enter URL" value={cpanelUrl} onChange={(e) => setCpanelUrl(e.target.value) } />
                                <div className="input-group-append input-group-action" onClick={() => {
                                    if(validator.isURL(cpanelUrl)) {
                                        window.open(cpanelUrl, '_blank');
                                    }
                                }}>
                                    <span className="input-group-text"><i className="fas fa-external-link-alt"></i></span>
                                </div>
                                <div className="input-group-append input-group-action" ref={cpanelUrlInput}>
                                    <CopyToClipboard text={cpanelUrl} onCopy={onCopyCpanelUrl}>
                                        <span className="input-group-text"><i className="fas fa-copy" /></span>
                                    </CopyToClipboard>
                                </div>
                                <Overlay target={cpanelUrlInput.current} show={cpanelurltooltipshow} placement="bottom">
                                        {(props) => (
                                        <Tooltip {...props}>
                                            Copied!
                                        </Tooltip>
                                        )}
                                </Overlay>
                            </div>

                        </div>
                        <div className="form-group">
                            <label htmlFor="cpanelUsername">Username</label>
                            <div className="view" style={{display: isEditForm ? 'none' : 'flex'}}>
                                <p>{cpanelUsername}</p>
                            </div>
                            <div className="input-group mb-3 edit" style={{display: isEditForm ? 'flex' : 'none'}}>
                                <input type="text" className="form-control" id="cpanelUsername" placeholder="Enter username" value={cpanelUsername} onChange={(e) => setCpanelUsername(e.target.value) } />
                                <div className="input-group-append input-group-action" ref={cpanelUsernameInput}>
                                    <CopyToClipboard text={cpanelUsername} onCopy={onCopyCpanelUsername}>
                                        <span className="input-group-text"><i className="fas fa-copy" /></span>
                                    </CopyToClipboard>
                                </div>
                                <Overlay target={cpanelUsernameInput.current} show={cpanelusernametooltipshow} placement="bottom">
                                        {(props) => (
                                        <Tooltip {...props}>
                                            Copied!
                                        </Tooltip>
                                        )}
                                </Overlay>
                            </div>
                            
                        </div>
                        <div className="form-group">
                            <label htmlFor="cpanelPassword">Password</label>
                            <div className="view" style={{display: isEditForm ? 'none' : 'flex'}}>
                                <p>{cpanelPassword}</p>
                            </div>
                            <div className="input-group mb-3" style={{display: isEditForm ? 'flex' : 'none'}}>
                                <input type={cpanelPasswordInputType ? 'password' : 'text'} className="form-control" id="cpanelPassword" placeholder="Enter password" value={cpanelPassword} onChange={(e) => setCpanelPassword(e.target.value) } />
                                <div className="input-group-append input-group-action" onClick={() => {
                                    setCpanelPasswordInputType(!cpanelPasswordInputType)
                                }}>
                                    <span className="input-group-text"><i className={cpanelPasswordInputType ? 'fas fa-eye' : 'fa fa-eye-slash'} /></span>
                                </div>
                                <div className="input-group-append input-group-action" onClick={() => {
                                    let pwd = generatePassword() 
                                    setCpanelPassword(pwd)
                                }}>
                                    <span className="input-group-text"><i className="fas fa-sync" /></span>
                                </div>
                                <div className="input-group-append input-group-action" ref={cpanelPasswordInput}>
                                    <CopyToClipboard text={cpanelPassword} onCopy={onCopyCpanelPassword}>
                                        <span className="input-group-text"><i className="fas fa-copy" /></span>
                                    </CopyToClipboard>
                                </div>
                                <Overlay target={cpanelPasswordInput.current} show={cpanelpasswordtooltipshow} placement="bottom">
                                        {(props) => (
                                        <Tooltip {...props}>
                                            Copied!
                                        </Tooltip>
                                        )}
                                </Overlay>
                            </div>
                            
                        </div>
                        <div className="form-group">
                            <label htmlFor="cpanelNotes">Notes</label>
                            <div className="view" style={{display: isEditForm ? 'none' : 'flex'}}>
                                <p>{cpanelNotes}</p>
                            </div>
                            <textarea className="form-control" style={{display: isEditForm ? 'flex' : 'none'}} id="cpanelNotes" value={cpanelNotes} onChange={(e) => setCpanelNotes(e.target.value) } ></textarea>
                        </div>
                    </div>
                    <div id="gsuiteAccount" style={{display: accountType === 'gsuite' ? 'block' : 'none'}}>
                        <div className="form-group">
                            <label htmlFor="gsuiteEmail">Email</label>
                            <div className="view" style={{display: isEditForm ? 'none' : 'flex'}}>
                                <p>{gsuiteEmail}</p>
                            </div>
                            <div className="input-group mb-3" style={{display: isEditForm ? 'flex' : 'none'}}>
                                <input type="email" className="form-control" id="gsuiteEmail" placeholder="Enter email" value={gsuiteEmail} onChange={(e) => setGsuiteEmail(e.target.value) } />
                                <div className="input-group-append input-group-action" ref={gsuiteEmailInput}>
                                    <CopyToClipboard text={gsuiteEmail} onCopy={onCopyGsuiteEmail}>
                                        <span className="input-group-text"><i className="fas fa-copy" /></span>
                                    </CopyToClipboard>
                                </div>
                                <Overlay target={gsuiteEmailInput.current} show={gsuiteemailtooltipshow} placement="bottom">
                                        {(props) => (
                                        <Tooltip {...props}>
                                            Copied!
                                        </Tooltip>
                                        )}
                                </Overlay>
                            </div>

                        </div>
                        <div className="form-group">
                            <label htmlFor="gsuitePwd">Password</label>
                            <div className="view" style={{display: isEditForm ? 'none' : 'flex'}}>
                                <p>{gsuitePwd}</p>
                            </div>
                            <div className="input-group mb-3" style={{display: isEditForm ? 'flex' : 'none'}}>
                                <input type={gsuitePasswordInputType ? 'password' : 'text'} className="form-control" id="gsuitePwd" placeholder="Enter password" value={gsuitePwd} onChange={(e) => setGsuitePwd(e.target.value) } />
                                <div className="input-group-append input-group-action" onClick={() => {
                                    setGsuitePasswordInputType(!gsuitePasswordInputType)
                                }}>
                                    <span className="input-group-text"><i className={gsuitePasswordInputType ? 'fas fa-eye' : 'fa fa-eye-slash'} /></span>
                                </div>
                                <div className="input-group-append input-group-action" onClick={() => {
                                    let pwd = generatePassword() 
                                    setGsuitePwd(pwd)
                                }}>
                                    <span className="input-group-text"><i className="fas fa-sync" /></span>
                                </div>
                                <div className="input-group-append input-group-action" ref={gsuitePasswordInput}>
                                    <CopyToClipboard text={gsuitePwd} onCopy={onCopyGsuitePassword}>
                                        <span className="input-group-text"><i className="fas fa-copy" /></span>
                                    </CopyToClipboard>
                                </div>
                                <Overlay target={gsuitePasswordInput.current} show={gsuitepasswordtooltipshow} placement="bottom">
                                        {(props) => (
                                        <Tooltip {...props}>
                                            Copied!
                                        </Tooltip>
                                        )}
                                </Overlay>
                            </div>
                            
                        </div>
                        <div className="form-group">
                            <label htmlFor="gsuiteNotes">Notes</label>
                            <div className="view" style={{display: isEditForm ? 'none' : 'flex'}}>
                                <p>{gsuiteNotes}</p>
                            </div>
                            <textarea className="form-control" style={{display: isEditForm ? 'flex' : 'none'}} id="gsuiteNotes" value={gsuiteNotes} onChange={(e) => setGsuiteNotes(e.target.value) } ></textarea>
                        </div>
                    </div>
                    <div id="socialAccount" style={{display: accountType === 'social' ? 'block' : 'none'}}>
                        <div className="form-group">
                            <label htmlFor="socialUsername">Username</label>
                            <div className="view" style={{display: isEditForm ? 'none' : 'flex'}}>
                                <p>{socialUsername}</p>
                            </div>
                            <div className="input-group mb-3" style={{display: isEditForm ? 'flex' : 'none'}}>
                                <input type="text" className="form-control" id="socialUsername" placeholder="Enter username" value={socialUsername} onChange={(e) => setSocialUsername(e.target.value) } />
                                <div className="input-group-append input-group-action" ref={socialUsernameInput}>
                                    <CopyToClipboard text={socialUsername} onCopy={onCopySocialUsername}>
                                        <span className="input-group-text"><i className="fas fa-copy" /></span>
                                    </CopyToClipboard>
                                </div>
                                <Overlay target={socialUsernameInput.current} show={socialusernametooltipshow} placement="bottom">
                                        {(props) => (
                                        <Tooltip {...props}>
                                            Copied!
                                        </Tooltip>
                                        )}
                                </Overlay>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="socialPassword">Password</label>
                            <div className="view" style={{display: isEditForm ? 'none' : 'flex'}}>
                                <p>{socialPassword}</p>
                            </div>
                            <div className="input-group mb-3" style={{display: isEditForm ? 'flex' : 'none'}}>
                                <input type={socialPasswordInputType ? 'password' : 'text'} className="form-control" id="socialPassword" placeholder="Enter password" value={socialPassword} onChange={(e) => setSocialPassword(e.target.value) } />
                                <div className="input-group-append input-group-action" onClick={() => {
                                    setSocialPasswordInputType(!socialPasswordInputType)
                                }}>
                                    <span className="input-group-text"><i className={socialPasswordInputType ? 'fas fa-eye' : 'fa fa-eye-slash'} /></span>
                                </div>
                                <div className="input-group-append input-group-action" onClick={() => {
                                    let pwd = generatePassword() 
                                    setSocialPassword(pwd)
                                }}>
                                    <span className="input-group-text"><i className="fas fa-sync" /></span>
                                </div>
                                <div className="input-group-append input-group-action" ref={socialPasswordInput}>
                                    <CopyToClipboard text={socialPassword} onCopy={onCopySocialPassword}>
                                        <span className="input-group-text"><i className="fas fa-copy" /></span>
                                    </CopyToClipboard>
                                </div>
                                <Overlay target={socialPasswordInput.current} show={socialpasswordtooltipshow} placement="bottom">
                                        {(props) => (
                                        <Tooltip {...props}>
                                            Copied!
                                        </Tooltip>
                                        )}
                                </Overlay>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="socialNotes">Notes</label>
                            <div className="view" style={{display: isEditForm ? 'none' : 'flex'}}>
                                <p>{socialNotes}</p>
                            </div>
                            <textarea className="form-control" style={{display: isEditForm ? 'flex' : 'none'}} id="socialNotes" value={socialNotes} onChange={(e) => setSocialNotes(e.target.value) } ></textarea>
                        </div>
                    </div>
                    <div id="webAccount" style={{display: accountType === 'web' ? 'block' : 'none'}}>
                        <div className="form-group">
                            <label htmlFor="webUrl">URL</label>
                            <div className="view" style={{display: isEditForm ? 'none' : 'flex'}}>
                                <p>{webUrl}</p>
                            </div>
                            <div className="input-group mb-3" style={{display: isEditForm ? 'flex' : 'none'}}>
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
                            <div className="view" style={{display: isEditForm ? 'none' : 'flex'}}>
                                <p>{webUsername}</p>
                            </div>
                            <div className="input-group mb-3" style={{display: isEditForm ? 'flex' : 'none'}}>
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
                            <div className="view" style={{display: isEditForm ? 'none' : 'flex'}}>
                                <p>{webPassword}</p>
                            </div>
                            <div className="input-group mb-3" style={{display: isEditForm ? 'flex' : 'none'}}>
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
                            <div className="view" style={{display: isEditForm ? 'none' : 'flex'}}>
                                <p>{webNotes}</p>
                            </div>
                            <textarea className="form-control" style={{display: isEditForm ? 'flex' : 'none'}} id="webNotes" value={webNotes} onChange={(e) => setWebNotes(e.target.value) } ></textarea>
                        </div>
                    </div>
                    <div id="emailAccount" style={{display: accountType === 'email' ? 'block' : 'none'}}>
                        <div className="form-group">
                            <label htmlFor="userEmail">Email</label>
                            <div className="view" style={{display: isEditForm ? 'none' : 'flex'}}>
                                <p>{userEmail}</p>
                            </div>
                            <div className="input-group mb-3" style={{display: isEditForm ? 'flex' : 'none'}}>
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
                            <div className="view" style={{display: isEditForm ? 'none' : 'flex'}}>
                                <p>{userPwd}</p>
                            </div>
                            <div className="input-group mb-3" style={{display: isEditForm ? 'flex' : 'none'}}>
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
                            <div className="view" style={{display: isEditForm ? 'none' : 'flex'}}>
                                <p>{emailNotes}</p>
                            </div>
                            <textarea className="form-control" style={{display: isEditForm ? 'flex' : 'none'}} id="emailNotes" value={emailNotes} onChange={(e) => setEmailNotes(e.target.value) } ></textarea>
                        </div>
                    </div>
                    <div id="wifiAccount" style={{display: accountType === 'wifi' ? 'block' : 'none'}}>
                        <div className="form-group">
                            <label htmlFor="wifiPwd">Password</label>
                            <div className="view" style={{display: isEditForm ? 'none' : 'flex'}}>
                                <p>{wifiPwd}</p>
                            </div>
                            <div className="input-group mb-3" style={{display: isEditForm ? 'flex' : 'none'}}>
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
                            <div className="view" style={{display: isEditForm ? 'none' : 'flex'}}>
                                <p>{wifiNotes}</p>
                            </div>
                            <textarea className="form-control" id="wifiNotes" style={{display: isEditForm ? 'flex' : 'none'}} value={wifiNotes} onChange={(e) => setWifiNotes(e.target.value) } ></textarea>
                        </div>
                    </div>
                    <div id="creditAccount" style={{display: accountType === 'credit' ? 'block' : 'none'}}>
                        <div className="form-group">
                            <label htmlFor="cardNumber">Card Number</label>
                            <div className="view" style={{display: isEditForm ? 'none' : 'flex'}}>
                                <p>{cardNumber}</p>
                            </div>
                            <div className="input-group mb-3" style={{display: isEditForm ? 'flex' : 'none'}}>
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
                            <div className="view" style={{display: isEditForm ? 'none' : 'flex'}}>
                                <p>{expireDate}</p>
                            </div>
                            <div className="input-group mb-3" style={{display: isEditForm ? 'flex' : 'none'}}>
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
                            <div className="view" style={{display: isEditForm ? 'none' : 'flex'}}>
                                <p>{cardCvv}</p>
                            </div>
                            <div className="input-group mb-3" style={{display: isEditForm ? 'flex' : 'none'}}>
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
                            <div className="view" style={{display: isEditForm ? 'none' : 'flex'}}>
                                <p>{cardNotes}</p>
                            </div>
                            <textarea className="form-control" style={{display: isEditForm ? 'flex' : 'none'}} id="cardNotes" value={cardNotes} onChange={(e) => setCardNotes(e.target.value) } ></textarea>
                        </div>
                    </div>
                    <div id="cryptoAccount" style={{display: accountType === 'crypto' ? 'block' : 'none'}}>
                        <div className="form-group">
                            <label htmlFor="cryptUsername">Username</label>
                            <div className="view" style={{display: isEditForm ? 'none' : 'flex'}}>
                                <p>{cryptUsername}</p>
                            </div>
                            <div className="input-group mb-3" style={{display: isEditForm ? 'flex' : 'none'}}>
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
                            <div className="view" style={{display: isEditForm ? 'none' : 'flex'}}>
                                <p>{cryptPassword}</p>
                            </div>
                            <div className="input-group mb-3" style={{display: isEditForm ? 'flex' : 'none'}}>
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
                            <div className="view" style={{display: isEditForm ? 'none' : 'flex'}}>
                                <p>{cryptSeed}</p>
                            </div>
                            <div className="input-group mb-3" style={{display: isEditForm ? 'flex' : 'none'}}>
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
                            <div className="view" style={{display: isEditForm ? 'none' : 'flex'}}>
                                <p>{cryptNotes}</p>
                            </div>
                            <textarea className="form-control" style={{display: isEditForm ? 'flex' : 'none'}} id="cryptNotes" value={cryptNotes} onChange={(e) => setCryptNotes(e.target.value) } ></textarea>
                        </div>
                    </div>
                    <div id="customAccount" style={{display: accountType === 'custom' ? 'block' : 'none'}}>
                        <div className="form-group">
                            <label htmlFor="customUrl">URL</label>
                            <div className="view" style={{display: isEditForm ? 'none' : 'flex'}}>
                                <p>{customUrl}</p>
                            </div>
                            <div className="input-group mb-3" style={{display: isEditForm ? 'flex' : 'none'}}>
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
                            <div className="view" style={{display: isEditForm ? 'none' : 'flex'}}>
                                <p>{customUrl}</p>
                            </div>
                            <div className="input-group mb-3" style={{display: isEditForm ? 'flex' : 'none'}}>
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
                            <div className="view" style={{display: isEditForm ? 'none' : 'flex'}}>
                                <p>{customPassword}</p>
                            </div>
                            <div className="input-group mb-3" style={{display: isEditForm ? 'flex' : 'none'}}>
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
                            <div className="view" style={{display: isEditForm ? 'none' : 'flex'}}>
                                <p>{customEmail}</p>
                            </div>
                            <div className="input-group mb-3" style={{display: isEditForm ? 'flex' : 'none'}}>
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
                            <div className="view" style={{display: isEditForm ? 'none' : 'flex'}}>
                                <p>{customNotes}</p>
                            </div>
                            <textarea className="form-control" style={{display: isEditForm ? 'flex' : 'none'}} id="customNotes" value={customNotes} onChange={(e) => setCustomNotes(e.target.value) } ></textarea>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Select Category</label>
                        <div className="view" style={{display: isEditForm ? 'none' : 'flex'}}>
                            <p>{categoryTitle}</p>
                        </div>
                        <div style={{display: isEditForm  ? 'flex' : 'none'}}>
                            <CategoryTree shouldupdate={shouldCatUpdate} categories={allCategories} categoryHandler={memorizeCategoryHandler} />
                        </div>
                    </div>
                </div>
                <div className="col-sm-4">
                    <div className="float-left">
                        <h5>Who has access?</h5>
                    </div>
                    <div style={{display: isEditForm ? 'flex' : 'none'}} className="float-right" id="addUser" onClick={() => setIsShowUserForm(!isShowUserForm)}>
                        <i className="material-icons button right">{isShowUserForm ? 'close' : 'person_add'}</i>
                    </div>
                    <div className="clearfix"></div>
                    <div className="card" style={{display: isShowUserForm ? 'block' : 'none'}}>
                        <div className="card-body">
                            <div className="form-group">
                                <label htmlFor="selectUser">Select User</label>
                                <select className="custom-select form-control-border" id="selectUser" onChange={changeSelectUserHandler} value={selectUserId}>
                                    <option value="">Select User</option>
                                    {
                                        allUsers.map((user, index) => (
                                            catSelectedUserIds.indexOf(user.id) == -1 ?
                                            <option key={index} value={user.id}>{user.name}</option>
                                            :
                                            ''
                                        ))
                                    }
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="userPerm">Permission</label>
                                <select className="custom-select form-control-border" id="userPerm" onChange={changeSelectPermHandler} value={selectPerm}>
                                    <option value="view">View</option>
                                    <option value="edit">Edit</option>
                                </select>
                            </div>
                            <button type="button" className="btn btn-primary" onClick={addCatUser}>Add</button>
                        </div>
                    </div>
                    <div className="clearfix"></div>
                    <div className="card" id="selectedCatUser">
                        <div className="card-body">
                            <div className="card-body-top">
                                <div className="image">
                                    <img src={"https://ui-avatars.com/api/?name=" + userName} className="img-circle elevation-2" alt="User Image" />
                                </div>
                                <h6 className="card-title">{userName}</h6>
                            </div>
                            <p className="card-text text-center">Owner</p>
                        </div>
                    </div>
                    {
                        catSelectedUsers.map((catUser, index) => (
                            <div key={index} className="card" id="selectedCatUser">
                                <div className="card-body">
                                    <div className="card-body-top">
                                        <div className="image">
                                            <img src={"https://ui-avatars.com/api/?name=" + catUser.name} className="img-circle elevation-2" alt={catUser.name} />
                                        </div>
                                        <h6 className="card-title">{catUser.name}</h6>
                                        <span className="float-right" id="deleteUser" onClick={() => {
                                            var filteredCatSelectedUsers = catSelectedUsers.filter((catUserItem) => {
                                                return catUserItem.id != catUser.id 
                                            })
                                            setCatSelectedUsers(filteredCatSelectedUsers)
                                            if(filteredCatSelectedUsers.length > 0) {
                                                filteredCatSelectedUsers.forEach((item, index) => {
                                                    setCatSelectedUserIds([...catSelectedUserIds, parseInt(item.id)])
                                                })
                                            }
                                            
                                        }}>
                                            <i style={{display: isEditForm ? 'flex' : 'none'}} className="material-icons button right">close</i>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </Modal.Body>
        <Modal.Footer>
            <button style={{display: isEditForm ? 'flex' : 'none'}} type="submit" disabled={passwordName === '' || parentCat == '' || saveButtonDisabled ? true : false } className="btn btn-primary" onClick={savePassword}>{saveButtonText}</button>
        </Modal.Footer>
      </Modal>
      {deleteAlert}
      </>
    )
}

export default PasswordForm;