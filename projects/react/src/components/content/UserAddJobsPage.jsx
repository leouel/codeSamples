import React from "react"
import RenderCompany from "./RenderCompany";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup"
import { toast } from "react-toastify"
import * as techCompanies from "../../services/techCompanyService"
import * as jobService from "../../services/jobService"

const formSchema = Yup.object().shape({
    title: Yup.string().min(2).max(50).required("Title is required"),
    description: Yup.string().min(2).max(2048).required("Description is required"),
    summary: Yup.string().min(2).max(255).required("Summary is required"),
    pay: Yup.string().min(2).max(50).required("Pay is required"),
    slug: Yup.string().min(2).max(50).required("Slug is required"),
    statusId: Yup.string().min(2).max(50).required("Status is required. Must be set to: NotSet, Active, Deleted, Flagged"),
    techCompanyId: Yup.number().min(1).required("Must select a Tech Company.")
})

class UserAddJobsPage extends React.Component{

    state = {
        formData: {
            title: "",
            description: "",
            summary: "", 
            pay: "", 
            slug: "", 
            statusId: "",
            techCompanyId: "",
            skills: ""
        },
        techCompanies: [{}],
        jobId: 0
    }

    componentDidMount(){
        console.log("componentDidMount() -> UserAddJobsPage");

        techCompanies.getTechCompanies(0,30)
                .then(this.onGetTechCompaniesSuccess)
                .catch(this.onGetTechCompaniesError)

        if(this.props.match.params.jobId){
            jobService.getJobById(this.props.match.params.jobId)
                .then(this.onGetJobByIdSuccess)
                .catch(this.onGetJobByIdError)
        }
    }

    mapSkills = (skill) => {
        let newSkills = {
            name: skill
        }
        return newSkills;
    }

    mapTechCompanies = (company) => {
        return(
            <React.Fragment key={`tecCo-${company.id}`}>
                <RenderCompany
                    company={company}
                />
            </React.Fragment>
        )
    }

    submitForm = (values) => {
        // eslint-disable-next-line
        if(values.skills == "") values.skills = null;
        // eslint-disable-next-line
        if(this.state.jobId == 0){
            if(values.skills != null)
            {
                let skillArray = values.skills.split(", ")
                let newSkillArray = skillArray.map(this.mapSkills)
                values.skills = newSkillArray   
                values.techCompanyId = parseInt(values.techCompanyId)
            }
            jobService.addJob(values)
                .then(this.onAddJobError)
                .catch(this.onAddJobError)
        }
        else 
        {
            if(values.skills != null)
            {
                let skillArray = values.skills.split(", ")
                let newSkillArray = skillArray.map(this.mapSkills)
                values.skills = newSkillArray
                values.techCompanyId = parseInt(values.techCompanyId)
            }
            jobService.updateJob(this.state.jobId, values)
                .then(this.onUpdateJobSuccess)
                .catch(this.onUpdateJobError)
        }
    }

    //####### SUCCESS HANDLERS #######//
    onGetTechCompaniesSuccess = (response) => {
        console.log(response.data, "onGetTechCompaniesSuccess");
        let companies = response.data.item.pagedItems;

        this.setState(prevState => {
            return{
                ...prevState,
                mappedCompanies: companies.map(this.mapTechCompanies)
            }
        })
    }

    onAddJobSuccess = (response) => {
        console.log(response.data, "onAddJobSuccess");
        toast.success(`Successfully added jobId: ${response.data.item}`)
        this.setState(prevState => {
            return{
                ...prevState,
                jobId: response.data.item
            }
        })
    }

    onUpdateJobSuccess = (response) => {
        console.log(response.data, "onUpdateJobSuccess");
        toast.info(`Successfully updated jobId: ${this.state.jobId}`)
        this.props.history.push("/jobs")
    }

    onGetJobByIdSuccess = (response) => {
        console.log(response.data, "onGetJobByIdSuccess");
        let jobData = response.data.item
        if(jobData.skills != null){
            var skillArray = jobData.skills.map((element)=>{
                return element.name
            })
            skillArray = skillArray.join(", ")
        } else {
            jobData.skills = ""
        }
        this.setState(prevState=>{
            return{
                ...prevState,
                formData:{
                    title: jobData.title,
                    description: jobData.description,
                    summary: jobData.summary, 
                    pay: jobData.pay, 
                    slug: jobData.slug, 
                    statusId: jobData.statusId,
                    techCompanyId: jobData.techCompany.id,
                    skills: skillArray
                },
                jobId: jobData.id
            }
        })
        // this.setState((prevState)=>{
        //     let formData = {...prevState.formData}
        //     let jobId = prevState.jobId
        //     jobId = jobData.id
        //     formData.title = jobData.title
        //     formData.description = jobData.description
        //     formData.summary = jobData.summary
        //     formData.pay = jobData.pay
        //     formData.slug = jobData.slug
        //     formData.statusId = jobData.statusId
        //     formData.techCompanyId = jobData.techCompany.id
        //     formData.skills = skillArray
        //     return {formData, jobId}
        // })
    }

    //####### ERROR HANDLERS #######//
    onGetTechCompaniesError = (errResponse) => {
        console.log({error:errResponse});
    }

    onAddJobError = (errResponse) => {
        console.log({error:errResponse});
    }

    onUpdateJobError = (errResponse) => {
        console.log({error:errResponse});
    }

    onGetJobByIdError = (errResponse) => {
        console.log({ error:errResponse });
    }

    render(){
        return(
            <React.Fragment>
                <div className="container p-2 my-1 bg-primary rounded-3">
                    <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start px-3">
                        <h3 className="my-1 text-white">Add or Edit Job</h3>
                    </div>
                </div>
                <div className="col-lg-8 col-md-6 col-sm-12 my-3">
                    <div className="card border-0 shadow">
                        <div className="card-body m-4">
                            <Formik
                                enableReinitialize={true}
                                initialValues={this.state.formData}
                                onSubmit={this.submitForm}
                                validationSchema={formSchema}
                            >
                                {({ values })=>(
                                <Form>
                                    <div className="form-group mb-3 row">
                                        <label
                                            htmlFor="title"
                                            className="col-form-label col-sm-2"
                                            ><strong>Role</strong></label
                                        >
                                        <div className="col-sm-10">
                                            <Field
                                                type="text"
                                                className="form-control"
                                                placeholder="Title"
                                                name="title"
                                            />
                                            <ErrorMessage 
                                                name="title" 
                                                component="div" className="har-error" 
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group mb-3 row">
                                        <label
                                            htmlFor="techCompanyId"
                                            className="
                                                col-sm-2 col-form-label
                                                forTechId
                                            "
                                            ><strong> Tech Company </strong></label
                                        >
                                        <div className="col-sm-10">
                                            <Field
                                                component="select"
                                                className="form-select"
                                                name="techCompanyId"
                                            >
                                                <option>Select</option>
                                                {this.state.mappedCompanies}
                                            </Field>
                                            <ErrorMessage 
                                                name="techCompanyId" 
                                                component="div" className="har-error" 
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group mb-3 row">
                                        <label
                                            htmlFor="description"
                                            className="col-sm-2 col-form-label"
                                            ><strong>Job Description</strong></label
                                        >
                                        <div className="col-sm-10">
                                            <Field
                                                type="text"
                                                className="form-control"
                                                placeholder="Description"
                                                name="description"
                                            />
                                            <ErrorMessage 
                                                name="description" 
                                                component="div" className="har-error" 
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group mb-3 row">
                                        <label
                                            htmlFor="summary"
                                            className="col-sm-2 col-form-label"
                                            ><strong>Job Summary</strong></label
                                        >
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
                                            htmlFor="pay"
                                            className="col-sm-2 col-form-label"
                                            ><strong>Pay</strong></label
                                        >
                                        <div className="col-sm-10">
                                            <Field
                                                type="text"
                                                className="form-control"
                                                placeholder=""
                                                name="pay"
                                            />
                                            <ErrorMessage 
                                                name="pay" 
                                                component="div" className="har-error" 
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group mb-3 row">
                                        <label
                                            htmlFor="skills"
                                            className="col-sm-2 col-form-label"
                                            ><strong>Skills</strong></label
                                        >
                                        <div className="col-sm-10">
                                            <Field
                                                type="text"
                                                className="form-control"
                                                placeholder="Skills"
                                                name="skills"
                                            />
                                            <ErrorMessage 
                                                name="skills" 
                                                component="div" className="har-error" 
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group mb-3 row">
                                        <label
                                            htmlFor="slug"
                                            className="col-sm-2 col-form-label"
                                            ><strong>Slug</strong></label
                                        >
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
                                            ><strong>Status</strong></label
                                        >
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

export default UserAddJobsPage