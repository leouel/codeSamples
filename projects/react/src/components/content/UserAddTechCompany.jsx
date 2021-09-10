import React from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup"
import * as techCompanyService from "../../services/techCompanyService";
import { toast } from "react-toastify";

const formDataSchema = Yup.object().shape({
    name: Yup.string().min(2).max(50).required("Company Name is required"),
    profile: Yup.string().min(2).max(2048).required("Company Profile is required"),
    summary: Yup.string().min(2).max(255).required("Company Summary is required"),
    headline: Yup.string().min(2).max(50).required("Company Headline is required"),
    contactInformation: Yup.string().min(2).max(50).required("Company Contact Information is required"),
    slug: Yup.string().min(2).max(50).required("Company Slug is required"),
    statusId: Yup.string().min(2).max(50).required("Company Status is required. Must be set to: NotSet, Active, Deleted, Flagged"),
    images: Yup.array().of(
        Yup.object().shape(
            {
                imageTypeId: Yup.string().min(2, "Minimum 2 characters required.").max(10).required("Image Type Id is required. If not needed, press the \"Delete\" button"),
                imageUrl: Yup.string().min(2, "Minimum 2 characters required.").max(255).required("Image Url is required. If not needed, press the \"Delete\" button")
            }
        )
    )
});

class UserAddTechCompany extends React.Component {
    state = {
        formData: {
            name: "",
            profile: "",
            summary: "",
            headline: "",
            contactInformation: "",
            slug: "",
            statusId: "",
            images: [{
                imageTypeId: "",
                imageUrl: ""
            }]
        },
        techCoId: 0,
    };

    componentDidMount() {
        console.log("componentDidMount() -> UserAddTechCompanyPage");
        if (this.props.match.params.techCoId) {
            techCompanyService
                .getTechCompanyById(this.props.match.params.techCoId)
                .then(this.onGetTechCompanyByIdSuccess)
                .catch(this.onGetTechCompanyByIdError);
        }
    }

    submitForm = (values) => {
        if(values.images.length === 0) values.images = null;
        // eslint-disable-next-line
        if (this.state.techCoId == 0) {
            techCompanyService
                .addTechCompany(values)
                .then(this.onAddTechCompanySuccess)
                .catch(this.onAddTechCompanyError);
        } else {
            techCompanyService
                .updateTechCompany(this.state.techCoId, values)
                .then(this.onUpdateTechCompanySuccess)
                .catch(this.onUpdateTechCompanyError);
        }
    }

    //####### SUCCESS HANDLERS #######//
    onAddTechCompanySuccess = (response) => {
        console.log(response.data, "onAddTechCompanySuccess");
        this.props.history.push("/techCo");
    };

    onGetTechCompanyByIdSuccess = (response) => {
        console.log(response.data, "onGetTechCompanyByIdSuccess");
        let companyByID = response.data.item
        console.log(companyByID);
        this.setState(prevState=>{
            return{
                ...prevState,
                formData: {
                    name: companyByID.name,
                    profile: companyByID.profile,
                    summary: companyByID.summary,
                    headline: companyByID.headline,
                    contactInformation: companyByID.contactInformation,
                    slug: companyByID.slug,
                    statusId: companyByID.statusId,
                    images: companyByID.images
                },
                techCoId: companyByID.id
            }
        })
    };

    onUpdateTechCompanySuccess = (response) => {
        console.log(response.data, "onUpdateTechCompanySuccess");
        toast.info(
            `Successfully updated Tech Company Id: ${this.state.techCoId}`
        );
        this.props.history.push("/techCo");
    };

    //####### ERROR HANDLERS #######//
    onAddTechCompanyError = (errResponse) => {
        console.log({ error: errResponse });
    };

    onGetTechCompanyByIdError = (errResponse) => {
        console.log({ error: errResponse });
    };

    onUpdateTechCompanyError = (errResponse) => {
        console.log({ error: errResponse });
        toast.error(`${errResponse.response.data.errors[0]}`);
    };

    render() {
        return (
            <React.Fragment>
                <div className="container p-2 my-1 bg-success rounded-3">
                    <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start px-3">
                        <h3 className="my-1 text-white">
                            Add or Edit Tech Company
                        </h3>
                    </div>
                </div>
                <div className="col-lg-8 col-md-6 col-sm-12 my-3">
                    <div className="card border-0 shadow">
                        <div className="card-body m-4">
                            <Formik
                                enableReinitialize={true}
                                initialValues={this.state.formData}
                                onSubmit={this.submitForm}
                                validationSchema={formDataSchema}
                            >
                                {({ values })=>(
                                    <Form>
                                        <div mb={3} className="form-group mb-3 row">
                                            <label
                                                htmlFor="name"
                                                className="col-form-label col-sm-2"
                                            >
                                                <strong>Name</strong>
                                            </label>
                                            <div className="col-sm-10">
                                                <Field
                                                    type="text"
                                                    name="name"
                                                    className="form-control"
                                                    placeholder="Name"
                                                />
                                                <ErrorMessage 
                                                    name="name" 
                                                    component="div" className="har-error" 
                                                />
                                            </div>
                                        </div>

                                        <div className="form-group mb-3 row">
                                            <label
                                                htmlFor="profile"
                                                className="col-form-label col-sm-2"
                                            >
                                                <strong>Profile</strong>
                                            </label>
                                            <div className="col-sm-10">
                                                <Field
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Profile"
                                                    name="profile"
                                                />
                                                <ErrorMessage 
                                                    name="profile" 
                                                    component="div" className="har-error" 
                                                />
                                            </div>
                                        </div>

                                        <div className="form-group mb-3 row">
                                            <label
                                                htmlFor="summary"
                                                className="col-sm-2 col-form-label"
                                            >
                                                <strong>Co. Summary</strong>
                                            </label>
                                            <div className="col-sm-10">
                                                <Field
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Summary"
                                                    name="summary"
                                                />
                                                <ErrorMessage 
                                                    name="summary" 
                                                    component="div" className="har-error" 
                                                />
                                            </div>
                                        </div>

                                        <div className="form-group mb-3 row">
                                            <label
                                                htmlFor="headline"
                                                className="col-sm-2 col-form-label"
                                            >
                                                <strong>Co. Headline</strong>
                                            </label>
                                            <div className="col-sm-10">
                                                <Field
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Headline"
                                                    name="headline"
                                                />
                                                <ErrorMessage 
                                                    name="headline" 
                                                    component="div" className="har-error" 
                                                />
                                            </div>
                                        </div>

                                        <div className="form-group mb-3 row">
                                            <label
                                                htmlFor="contactInformation"
                                                className="col-sm-2 col-form-label"
                                            >
                                                <strong>Contact Information</strong>
                                            </label>
                                            <div className="col-sm-10">
                                                <Field
                                                    type="text"
                                                    className="form-control"
                                                    placeholder=""
                                                    name="contactInformation"
                                                />
                                                <ErrorMessage 
                                                    name="contactInformation" 
                                                    component="div" className="har-error" 
                                                />
                                            </div>
                                        </div>

                                        <div className="form-group mb-3 row">
                                            <label
                                                htmlFor="slug"
                                                className="col-sm-2 col-form-label"
                                            >
                                                <strong>Slug</strong>
                                            </label>
                                            <div className="col-sm-10">
                                                <Field
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Slug"
                                                    name="slug"
                                                />
                                                <ErrorMessage 
                                                    name="slug" 
                                                    component="div" className="har-error" 
                                                />
                                            </div>
                                        </div>

                                        <div className="form-group mb-3 row">
                                            <label
                                                htmlFor="statusId"
                                                className="col-sm-2 col-form-label"
                                            >
                                                <strong>Status</strong>
                                            </label>
                                            <div className="col-sm-10">
                                                <Field
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Active"
                                                    name="statusId"
                                                />
                                                <ErrorMessage 
                                                    name="statusId" 
                                                    component="div" className="har-error" 
                                                />
                                            </div>
                                        </div>
                                    <FieldArray 
                                        name="images"
                                    >
                                        {({ push, remove })=>(
                                        <div className="form-group mb-3 row">
                                            <div className="text-center mb-3">
                                                <button
                                                    className="btn btn-primary col-sm-2"
                                                    onClick={()=>push({imageTypeId:"", imageUrl:""})}
                                                >
                                                    Add Images
                                                </button>
                                            </div>
                                            {values.images && values.images.map((image, index) => (
                                                <div 
                                                    className="form-group mb-3 row"
                                                    key={`images_${index}`}
                                                >
                                                    <label
                                                        htmlFor="images"
                                                        className="col-sm-2 col-form-label"
                                                    >
                                                        <strong>Images</strong>
                                                    </label>
                                                    <div className="col-sm-2">
                                                        <Field
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="Image ID"
                                                            name={`images.${index}.imageTypeId`}
                                                        />
                                                        <ErrorMessage 
                                                            name={`images.${index}.imageTypeId`} 
                                                            component="div" className="har-error"
                                                        />
                                                    </div>
        
                                                    <div className="col-sm-6">
                                                        <Field
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="Image Url"
                                                            name={`images.${index}.imageUrl`}
                                                        />
                                                        <ErrorMessage 
                                                            name={`images.${index}.imageUrl`} 
                                                            component="div" className="har-error"
                                                        />
                                                    </div>

                                                    <div className="col-sm-2">
                                                        <button
                                                            className="w-100 btn btn-danger"
                                                            onClick={()=>remove(index)}
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                            </div>
                                            ))}
                                        </div>
                                        )}
                                    </FieldArray>
                                        <div className="form-group mb-3 row">
                                            <label
                                                htmlFor="urls"
                                                className="col-sm-2 col-form-label"
                                            >
                                                <strong>URLs</strong>
                                            </label>
                                            <div className="col-sm-10">
                                                <Field
                                                    disabled
                                                    type="text"
                                                    className="form-control"
                                                    placeholder=""
                                                    name="urls"
                                                />
                                            </div>
                                        </div>

                                        <div className="form-group mb-3 row">
                                            <label
                                                htmlFor="tags"
                                                className="col-sm-2 col-form-label"
                                            >
                                                <strong>Tags</strong>
                                            </label>
                                            <div className="col-sm-10">
                                                <Field
                                                    disabled
                                                    type="text"
                                                    className="form-control"
                                                    placeholder=""
                                                    name="tags"
                                                />
                                            </div>
                                        </div>

                                        <div className="form-group mb-3 row">
                                            <label
                                                htmlFor="friendIds"
                                                className="col-sm-2 col-form-label"
                                            >
                                                <strong>Friend IDs</strong>
                                            </label>
                                            <div className="col-sm-10">
                                                <Field
                                                    disabled
                                                    type="number"
                                                    min="0"
                                                    className="form-control"
                                                    placeholder=""
                                                    name="friendIds"
                                                />
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <button
                                                type="submit"
                                                className="btn btn-primary"
                                            >
                                                Submit
                                            </button>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default UserAddTechCompany;
