import React, {useState, useEffect} from 'react';
import Breadcumb from './Breadcumb';
import {useDispatch, useSelector} from 'react-redux'
import SharedCategoryForm from './SharedCategoryForm'
import SharedPasswordForm from './SharedPasswordForm'
import {getshared} from '../actions/action'
import {
    useHistory
  } from "react-router-dom";

const Shared = (props) => {
    const dispatch = useDispatch()
    const history = useHistory()

    const [isShowPasswordModal, setIsShowPasswordModal] = useState(false)
    const[passwordId, setPasswordId] = useState(0)
    const [passwordType, setPasswordType] = useState('view')

    const changePasswordModel = (flag) => {
        setIsShowPasswordModal(flag)
    }

    const categoryJson = useSelector((state) => {
        console.log(categoryJson)
        return state.shared;
    })

    const passwordIcons = []
    passwordIcons['web'] = 'globe' 
    passwordIcons['email'] = 'envelope'
    passwordIcons['wifi'] = 'wifi'
    passwordIcons['credit'] = 'credit-card'
    passwordIcons['crypto'] = 'btc'
    passwordIcons['custom'] = 'lock'
    const baseRoute = localStorage.getItem("routeBase");
    useEffect(() => {
        dispatch(getshared())
    }, [])
    return (
        <div className="content-wrapper">
            <Breadcumb getcat={props.getcat} title="Shared with me" id="" addButton="password" pageType="shared" />
            <section className="content">
                <div className="container-fluid">
                  <div className="row">
                    {
                      categoryJson.categories.map((category, index) => (
                        <div className="col-md-3 col-sm-6 col-12" key={index} onClick={() => history.push("/"+baseRoute+"shared/" + category.id)}>
                          <div className="info-box">
                            <span className="info-box-icon bg-info"><i className="material-icons">{category.category_icon}</i></span>
                            <div className="info-box-content">
                              <span className="info-box-text">{category.title}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    }
                    {
                      categoryJson.passwords.map((password, index) => (
                        <div className="col-md-3 col-sm-6 col-12" key={index} onClick={() => {
                            setIsShowPasswordModal(true)
                            setPasswordId(password.id)
                            setPasswordType(password.permission_type)
                        }}>
                          <div className="info-box bg-danger">
                            <span className="info-box-icon"><i className={"fa fa-" + passwordIcons[password.account_type]} /></span>
                            <div className="info-box-content">
                              <span className="info-box-number">{password.name}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>
            </section>
            <SharedCategoryForm  />
            <SharedPasswordForm isShowPasswordModal={isShowPasswordModal} changePasswordModel={(flag) => changePasswordModel(flag)} passwordType={passwordType} passwordId={passwordId} sharedId="" />
        </div>
    )
}

export default Shared 