import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux'
import SharedCategoryForm from './SharedCategoryForm'
import SharedPasswordForm from './SharedPasswordForm'
import {getsharedchildren} from '../actions/action'
import {
    useParams,
    useHistory
  } from "react-router-dom";

const SharedChildren = (props) => {
    const {id} = useParams()
    const dispatch = useDispatch()
    const history = useHistory()

    const [isShowPasswordModal, setIsShowPasswordModal] = useState(false)
    const [passwordId, setPasswordId] = useState(0)
    const [passwordType, setPasswordType] = useState('view')

    const [isShowCategoryModal, setIsShowCategoryModal] = useState(false)
    const [categoryId, setCategoryId] = useState(0)
    const [categoryType, setCategoryType] = useState('view')

    const changePasswordModel = (flag) => {
        setIsShowPasswordModal(flag)
    }

    const changeCategoryModel = (flag) => {
        setIsShowCategoryModal(flag)
    }

    const categoryJson = useSelector((state) => {
        return state.sharedChildren;
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
        dispatch(getsharedchildren(id))
    }, [id])
    return (
        <div className="content-wrapper">
            <div className="content-header">
                <div className="container-fluid">
                    <div className="row mb-2">
                    <div className="col-sm-6 breadCumbHeaderSection">
                        <h1 className="m-0">{categoryJson.name}</h1>
                        {categoryJson.permission_type == 'edit' ? 
                        <div className="actionBtn">
                            <span className="editCat" onClick={() => {
                                setIsShowCategoryModal(true)
                                setCategoryId(categoryJson.id)
                                setCategoryType(categoryJson.permission_type)
                            }}>
                                <i className="fas fa-edit"></i>
                            </span>
                        </div>
                        :
                        ""
                        }
                    </div>
                    <div className="col-sm-6">
                        <ol className="breadcrumb float-sm-right">
                            <li className="breadcrumb-item">
                              <input type="search" className="form-control search_cat" onChange={(e) => dispatch(getsharedchildren(id, e.target.value))} placeholder="Search here..." />
                                <button type="button" className="btn btn-primary" onClick={() => props.getcat('', 'password')}><i className="fa fa-plus" aria-hidden="true"></i>&nbsp;&nbsp;Add New</button>
                            </li>
                        </ol>
                    </div>
                    </div>
                </div>
            </div>
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
                            <span className="info-box-icon"><i className={password.account_type === 'cpanel' || password.account_type === 'gsuite' ? "fab fa-" + passwordIcons[password.account_type] : "fa fa-" + passwordIcons[password.account_type]} /></span>
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
            <SharedCategoryForm isShowCategoryModal={isShowCategoryModal} changeCategoryModel={(flag) => changeCategoryModel(flag)} categoryType={categoryType} categoryId={categoryId}  />
            <SharedPasswordForm isShowPasswordModal={isShowPasswordModal} changePasswordModel={(flag) => changePasswordModel(flag)} passwordType={passwordType} passwordId={passwordId} sharedId={id} />
        </div>
    )
}

export default SharedChildren