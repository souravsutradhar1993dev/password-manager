import React, {useState, useCallback, useEffect} from 'react';
import { Modal } from "react-bootstrap";
import {useSelector, useDispatch} from 'react-redux'
import CategoryTree from './CategoryTree'
import toastr from 'toastr'
import 'toastr/build/toastr.min.css'

const ExportModal = (props) => {
    const baseUrl = localStorage.getItem("baseUrl");
    const apiToken = localStorage.getItem("authToken");
    const [parentCat, setParentCat] = useState(0)
    const dispatch = useDispatch()
    const currentCategoryId = useSelector((state) => {
        return state.category.category_id;
    })

    const download = async () => {
        const postData = new FormData();
        postData.append('category_id', parentCat);
        jQuery('body').waitMe({
            effect : 'rotation',
            text : 'Please wait...',
            bg : 'rgba(255,255,255,0.9)',
            color : '#191970',
            maxSize : '',
            textPos : 'vertical',
            source : ''
          });
        const data = await fetch(baseUrl + '/api/password/export_csv', {
            method: 'POST',
            headers: {
              'Authorization': 'Bearer ' + apiToken,
            },
            body: postData 
        })
        const resStatus = await data.status
        jQuery('body').waitMe('hide');
        if(resStatus == 401) {
            window.location.href = baseUrl + '/login'
        }
        const res2 = await data.json()
        if(res2.success) {
            window.open(res2.url)
        }else {
            toastr.error(res2.message, '')
        }
    };

    const memorizeCategoryHandler = useCallback((currentNode, selectedNodes) => {
        setParentCat(currentNode.value)
    }, []);

    const allCategories = {
        label: 'All Account',
        value: 0,
        isDefaultValue: currentCategoryId == '' ? true : false,
        children: props.categories
    }
    console.log(allCategories)
    const isShowExportModal = useSelector((state) => {
        return state.showExportModal.showExportModal;
    })
    useEffect(() => {
        setParentCat(currentCategoryId)
    }, [currentCategoryId, isShowExportModal])
    return (
        <Modal show={isShowExportModal} onHide={() => {
            dispatch({ type: 'GET_SHOW_EXPORT_MODAL', payload: false})
        }} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Export</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className="row">
                <div className="col-sm-6">
                    <div className="form-group">
                        <CategoryTree categories={allCategories} categoryHandler={memorizeCategoryHandler} />
                    </div>
                </div>
                <div className="col-sm-6">
                    <button type="button" className="btn btn-primary" onClick={download}><i className="fa fa-download" aria-hidden="true"></i>&nbsp;&nbsp;Download CSV</button>
                </div>
            </div>
        </Modal.Body>
      </Modal>
    )
}

export default ExportModal