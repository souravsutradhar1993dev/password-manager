import React, {useState, useEffect, useCallback} from 'react';
import {useSelector, useDispatch} from 'react-redux'
import {getsharedchildren, getsharedcategory} from '../actions/action'
import toastr from 'toastr'
import 'toastr/build/toastr.min.css'
import { Modal } from "react-bootstrap";

const SharedCategoryForm = (props) => {
    const [catName, setCatName] = useState('');
    const [catId, setCatId] = useState(0);
    const [saveButtonText, setSaveButtonText] = useState('Save');
    const [saveButtonDisabled, setSaveButtonDisabled] = useState(false);
    const [catIcon, setCatIcon] = useState('folder');
    const [ownerName, setOwnerName] = useState('')
    const [ownerEmail, setOwnerEmail] = useState('')
    
    const dispatch = useDispatch();

    const saveCategory = async () => {
        if(catName !== '') {
            setSaveButtonText('Saving...');
            setSaveButtonDisabled(true);
            const baseUrl = await localStorage.getItem("baseUrl");
            const apiToken = await localStorage.getItem("authToken");
            const data = {
                category_name: catName,
                category_icon: catIcon,
            }

            const response = await fetch(baseUrl + '/api/share_category/update/' + props.categoryId , {
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
                    setCatId(0)
                    setCatName('');
                    setCatIcon('folder');
                    props.changeCategoryModel(false)
                    dispatch(getsharedchildren(props.categoryId))
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

    const catIcons = ['folder','folder_special','folder_shared','account_balance','attach_money','account_box','assessment','book','build','bug_report','class','dns','explore','event','extension','grade','markunread_mailbox','pets','import_export','receipt','settings','shopping_basket','store','supervisor_account','computer','cast','device_hub','smartphone','security','sim_card','dashboard','filter_drama','panorama','nature','switch_camera','flight','local_activity','local_offer','local_shipping','subway','traffic','terrain','apps','adb','event_note','power','wc','time_to_leave','vpn_lock','beach_access','child_friendly','business_center','spa','group','domain','school','public','people','cake','pages','casino','child_friendly','fitness_center','no_encryption','enhanced_encryption','map','local_convenience_store','local_bar','directions_bike','view_comfy','tag_faces','portrait','looks','grid_on','grain','filter_hdr','toys','cloud','functions','work','shopping_cart','card_travel','email'];

    const catIconHtml = catIcons.map((icon, index) => (
            <div key={index} className={icon === catIcon ? 'Icon Active' : 'Icon' } onClick={() => setCatIcon(icon) }><i className="material-icons">{icon}</i></div>
        )
    )

    const singleCategory = useSelector((state) => {
        return state.sharedCategory.shared_category_data;
    })

    useEffect(() => {
        if(singleCategory.category == undefined && props.isShowCategoryModal) {
            dispatch(getsharedcategory(props.categoryId))
        }
        if(singleCategory.category !== undefined) {
            setOwnerName(singleCategory.user_data.name)
            setOwnerEmail(singleCategory.user_data.email)
            setCatId(singleCategory.category.id)
            setCatName(singleCategory.category.title);
            setCatIcon(singleCategory.category.category_icon);
        }
    }, [singleCategory, props.isShowCategoryModal, props.categoryId])
 
    return (
        <Modal show={props.isShowCategoryModal} onHide={() => {
            setCatId(0)
            setCatName('');
            setCatIcon('folder');
            props.changeCategoryModel(false)
        }} size="lg" backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Category Details</Modal.Title>
        </Modal.Header>
        <div className="header-password-trash">
                <p>Owned by </p><strong>{ownerName + " (" + ownerEmail + ")"}</strong>
        </div>
        <Modal.Body>
            <div className="row">
                <div className="col-sm-12">
                    <div className="form-group">
                        <label htmlFor="categoryName">Name</label>
                        <input type="text" className="form-control" id="categoryName" placeholder="Enter name" value={catName} onChange={(e) => setCatName(e.target.value) } />
                    </div>
                    <div className="form-group">
                        <div className="IconPicker">
                            {catIconHtml}
                        </div>
                    </div>
                </div>
            </div>
        </Modal.Body>
        <Modal.Footer>
            {
                props.categoryType === 'edit' ?
                <button type="submit" disabled={catName === '' || saveButtonDisabled ? true : false } className="btn btn-primary" onClick={saveCategory}>{saveButtonText}</button>
                :
                ""
            }
            
        </Modal.Footer>
      </Modal>

    )
}

export default SharedCategoryForm;