import React from 'react';
import { Modal } from "react-bootstrap";
import {useSelector, useDispatch} from 'react-redux'
import {getcategorychildren} from '../actions/action'
import toastr from 'toastr'
import 'toastr/build/toastr.min.css'

const ImportModal = (props) => {
    const baseUrl = localStorage.getItem("baseUrl");
    const apiToken = localStorage.getItem("authToken");
    const dispatch = useDispatch()
    const currentCategoryId = useSelector((state) => {
        return state.category.category_id;
    })

    const upload = async (file) => {
        const postData = new FormData();
        postData.append('csv_file', file);
        jQuery('body').waitMe({
            effect : 'rotation',
            text : 'Please wait...',
            bg : 'rgba(255,255,255,0.9)',
            color : '#191970',
            maxSize : '',
            textPos : 'vertical',
            source : ''
          });
        const data = await fetch(baseUrl + '/api/password/upload_csv', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
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
            if(currentCategoryId !== '') {
                dispatch(getcategorychildren(currentCategoryId))
            }
            props.getImportModal()
            toastr.success(res2.message, '', {displayDuration:3000})
        }else {
            toastr.error(res2.message, '')
        }
        
    };
      
    const onSelectFile = (file) => upload(file);

    return (
        <Modal size="lg" show={props.isShowImportModal} onHide={() => {
            props.getImportModal()
        }} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Import</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className="row">
                <div className="col-sm-6">
                    <a href={baseUrl + '/sample_password_CSV.csv'} className="btn btn-primary" download><i className="fa fa-download" aria-hidden="true"></i>&nbsp;&nbsp;Download Sample CSV</a>
                </div>
                <div className="col-sm-6">
                    <div className="form-group">
                        <div className="custom-file">
                            <input type="file" className="custom-file-input" id="uploadCsv" onChange={(e) => onSelectFile(e.target.files[0])} />
                            <label className="custom-file-label" htmlFor="uploadCsv">Upload CSV</label>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row import-instruction">
                <div className="col-sm-12">
                    <p className="h6"><strong>Import Instructions: </strong></p>
                    <ol>
                        <li><p><em>Download the sample csv clicking on the button above.</em></p></li>
                        <li><p><em>Fill the data sheet.</em></p></li>
                        <li><p><em>Remember, fill the required columns for a paricular account type and keep the other columns empty.</em></p></li>
                        <li><p><em>For the user access, You have to fill the column with user email (do not put name).</em></p></li>
                        <li><p><em>If you want to give access to multiple user, then you have to put multiple emails in a comma (,) separated way (e.g. hetvi@b3net.com, Anna@b3net.com).</em></p></li>
                        <li><p><em>User will get accessabilty 'View' by default.</em></p></li>
                        <li><p><em>For Account Name, You have to put exact name of the account (e.g. Arc Levers ).</em></p></li>
                        <li><p><em>For Account Type, You have to put exact type name of the account (e.g.  FTP Account).</em></p></li>
                        <li><p><em>Do not change the column position when uploading csv.</em></p></li>
                        <li><p><em>Do not change the column header name when uploading csv.</em></p></li>
                    </ol>
                </div>
            </div>
        </Modal.Body>
      </Modal>
    )
}

export default ImportModal