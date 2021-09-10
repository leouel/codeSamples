import React from "react"
import { Modal, ModalBody } from "reactstrap";

const ModalViewMore = (props) => {

    const isJobOrCompany = function(props){
        if(props.description){
            return(
                <>
                    <h5>Job Description:</h5>
                    <p>{props.description}</p>
                    <h5>Job Summary:</h5>
                    <p>{props.summary}</p>
                    <h5>Skills:</h5>
                    <p>{props.skills}</p>
                    <p><strong>Pay: {props.pay}</strong></p>
                </>
            )
        } else {
            return (
                <>
                    <h5>{props.profile}</h5>
                    <h5>{props.summary}</h5>
                </>
            )
        }
    }

    return(
        <React.Fragment>
            <Modal isOpen={props.isModalOpen} toggle={props.toggleModal}>
                <ModalBody>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{props.title}</h5>
                                <button type="button" className="btn-close" onClick={props.toggleModal}></button>
                            </div>
                            <div className="modal-body">
                                <h4 className="text-center">{props.company}</h4>
                                {isJobOrCompany(props)}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={props.toggleModal}>Close</button>
                            </div>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
        </React.Fragment>
    )
}

export default ModalViewMore