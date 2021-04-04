import React, {useState, useEffect, useCallback} from 'react';
import {useSelector, useDispatch} from 'react-redux'
import {getmenucategories,getcategorychildren} from '../actions/action'
import toastr from 'toastr'
import 'toastr/build/toastr.min.css'
import { Modal } from "react-bootstrap";
import CategoryTree from './CategoryTree'

const CategoryForm = (props) => {
    const [isShowUserForm, setIsShowUserForm] = useState(false)
    const [catName, setCatName] = useState('');
    const [catId, setCatId] = useState(0);
    const [parentCat, setParentCat] = useState(0)
    const [catSelectedUsers, setCatSelectedUsers] = useState([]);
    const [catSelectedUserIds, setCatSelectedUserIds] = useState([]);
    const [selectUserId, setSelectUserId] = useState('');
    const [selectUserName, setSelectUserName] = useState('');
    const [saveButtonText, setSaveButtonText] = useState('Save');
    const [saveButtonDisabled, setSaveButtonDisabled] = useState(false);
    const [selectPerm, setSelectPerm] = useState("view");
    const [catIcon, setCatIcon] = useState('folder');
    
    const dispatch = useDispatch();
    const userName = useSelector((state) => {
        return state.user.user.name;
    })
    const currentCategoryId = useSelector((state) => {
        return state.category.category_id;
    })

    const isShowCategoryModal = useSelector((state) => {
        return state.showCategoryModal.showCategoryModal;
    })
    const [shouldCatUpdate, setShouldCatUpdate] = useState(isShowCategoryModal)

    const saveCategory = async () => {
        if(catName !== '') {
            setSaveButtonText('Saving...');
            setSaveButtonDisabled(true);
            const baseUrl = await localStorage.getItem("baseUrl");
            const apiToken = await localStorage.getItem("authToken");
            const data = {
                category_name: catName,
                parent_category_id: parentCat,
                category_icon: catIcon,
                category_users: catSelectedUsers
            }
            let url = catId > 0 ? baseUrl + '/api/category/' + catId : baseUrl + '/api/category'
            const response = await fetch(url, {
                method: catId > 0 ? 'PUT' : 'POST', 
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
                    setCatId(0)
                    setCatName('');
                    setParentCat(0);
                    setCatSelectedUsers([]);
                    setCatSelectedUserIds([])
                    setCatIcon('folder');
                    dispatch(getmenucategories())
                    setShouldCatUpdate(!shouldCatUpdate)
                    dispatch({ type: 'GET_SHOW_CATEGORY_MODAL', payload: false})
                    if(currentCategoryId !== '') {
                        dispatch(getcategorychildren(currentCategoryId))
                    }else {
                        dispatch(getcategorychildren(''))
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
            toastr.error('Please fill category name', '')
        }
    }

    const catIcons = ['folder','folder_special','folder_shared','account_balance','attach_money','account_box','assessment','book','build','bug_report','class','dns','explore','event','extension','grade','markunread_mailbox','pets','import_export','receipt','settings','shopping_basket','store','supervisor_account','computer','cast','device_hub','smartphone','security','sim_card','dashboard','filter_drama','panorama','nature','switch_camera','flight','local_activity','local_offer','local_shipping','subway','traffic','terrain','apps','adb','event_note','power','wc','time_to_leave','vpn_lock','beach_access','child_friendly','business_center','spa','group','domain','school','public','people','cake','pages','casino','fitness_center','no_encryption','enhanced_encryption','map','local_convenience_store','local_bar','directions_bike','view_comfy','tag_faces','portrait','looks','grid_on','grain','filter_hdr','toys','cloud','functions','work','shopping_cart','card_travel','email'];

    const catIconHtml = catIcons.map((icon, index) => (
            <div key={index} className={icon === catIcon ? 'Icon Active' : 'Icon' } onClick={() => setCatIcon(icon) }><i className="material-icons">{icon}</i></div>
        )
    )

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

    const allUsers = useSelector((state) => {
        return state.allUser.user;
    })

    const singleCategory = useSelector((state) => {
        return state.editCategory.category_data;
    })

    const memorizeCategoryHandler = useCallback((currentNode, selectedNodes) => {
        setParentCat(currentNode.value)
    }, []);

    useEffect(() => {
        setParentCat(currentCategoryId)
        if(singleCategory.category !== undefined) {
            if(singleCategory.category.id !== undefined) {
                setCatId(singleCategory.category.id)
                setParentCat(singleCategory.category.category_parent_id)
                setCatName(singleCategory.category.title);
                setCatIcon(singleCategory.category.category_icon);
                setCatSelectedUsers(singleCategory.category_permissions);
                if(singleCategory.category_permissions.length > 0) {
                    singleCategory.category_permissions.forEach((item, index) => {
                        setCatSelectedUserIds([...catSelectedUserIds, parseInt(item.id)])
                    });
                }
            }
        }
    }, [singleCategory, currentCategoryId, isShowCategoryModal])

    const allCategories = {
        label: 'Keep as Main Account',
        value: 0,
        isDefaultValue: currentCategoryId == '' || parentCat == 0 ? true : false,
        children: props.categories
    }
 
    return (
        <Modal show={isShowCategoryModal} onHide={() => {
            setCatId(0)
            setCatName('');
            setParentCat(0);
            setCatSelectedUsers([]);
            setCatSelectedUserIds([])
            setCatIcon('folder');
            dispatch({ type: 'GET_SHOW_CATEGORY_MODAL', payload: false})
        }} size="lg" backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Account Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className="row">
                <div className="col-sm-8">
                    <div className="form-group">
                        <label htmlFor="categoryName">Name</label>
                        <input type="text" className="form-control" id="categoryName" placeholder="Enter name" value={catName} onChange={(e) => setCatName(e.target.value) } />
                    </div>
                    <div className="form-group">
                        <label htmlFor="parentCat">Select Parent Category</label>
                        <CategoryTree shouldupdate={shouldCatUpdate} categories={allCategories} categoryHandler={memorizeCategoryHandler} />
                    </div>
                    <div className="form-group">
                        <div className="IconPicker">
                            {catIconHtml}
                        </div>
                    </div>
                </div>
                <div className="col-sm-4">
                    <div className="float-left">
                        <h5>Who has access?</h5>
                    </div>
                    <div className="float-right" id="addUser" onClick={() => setIsShowUserForm(!isShowUserForm)}>
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
                                            setCatSelectedUserIds([])
                                            if(filteredCatSelectedUsers.length > 0) {
                                                filteredCatSelectedUsers.forEach((item, index) => {
                                                    setCatSelectedUserIds([...catSelectedUserIds, parseInt(item.id)])
                                                })
                                            }
                                        }}>
                                            <i className="material-icons button right">close</i>
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
            <button type="submit" disabled={catName === '' || saveButtonDisabled ? true : false } className="btn btn-primary" onClick={saveCategory}>{saveButtonText}</button>
        </Modal.Footer>
      </Modal>

    )
}

export default CategoryForm;