import React from "react"
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup"
import * as friendService from "../../services/friendService"

const formSchema = Yup.object().shape({
    title: Yup.string().min(2).max(50).required("Title is required"),
    bio: Yup.string().min(2).max(50).required("Bio is required"),
    summary: Yup.string().min(2).max(50).required("Summary is required"),
    headline: Yup.string().min(2).max(50).required("Headline is required"),
    slug: Yup.string().min(2).max(50).required("Slug is required"),
    statusId: Yup.string().min(2).max(50).required("Status is required. Must be set to: NotSet, Active, Deleted, Flagged"),
    imageUrl: Yup.string().min(2).max(255).required("ImageUrl is required"),
})

class UserAddFriendPage extends React.Component{

    state = {
        friendData: {
            title: "",
            bio: "",
            summary: "",
            headline: "",
            slug: "",
            statusId: "",
            imageTypeId: "Main",
            imageUrl: "",
            userId: "defaultUserId",
            skills: ""
        },
        friendId:0
    }

    componentDidMount(){
        console.log("componentDidMount() -> UserAddFriendPage");
        if(this.props.match.params.friendId){
            friendService.getFriendById(this.props.match.params.friendId)
                .then(this.onGetFriendByIdSuccess)
                .catch(this.onGetFriendByIdError)
        }

    }

    mapSkills = (skill) => {
        let newSkills = {
            name: skill
        }
        return newSkills
    }

    submitForm = (values) => {
        // eslint-disable-next-line eqeqeq
        if(values.skills == "") values.skills = null;
        // eslint-disable-next-line eqeqeq
        if(this.state.friendId == 0){
            if(values.skills != null) 
            {
                let skillString = values.skills.split(", ")
                let newSkillArray = skillString.map(this.mapSkills)
                values.skills = newSkillArray
            }
            friendService.addFriends(values)
                .then(this.onAddFriendSuccess)
                .catch(this.onAddFriendError)
        }else{
            if(values.skills != null)
            {
                let skillString = values.skills.split(", ")
                // let newSkillArray = skillString.map((element)=>{
                //     let newSkill = { name: element }
                //     return newSkill
                // })
                let newSkillArray = skillString.map(this.mapSkills)
                values.skills = newSkillArray
            }
            friendService.updateFriend(this.state.friendId, values)
                .then(this.onUpdateFriendSuccess)
                .catch(this.onUpdateFriendError)
        }
    }

    //####### SUCCESS HANDLERS #######//
    onAddFriendSuccess = (response) => {
        console.log(response.data, "onAddFriendSuccess");
        this.props.history.push("/friends")
    }

    onGetFriendByIdSuccess = (response) => {
        console.log(response.data, "onGetFriendByIdSuccess");
        let friendInfo = response.data.item;
        if(friendInfo.skills != null ) 
        {
            var skillArray = friendInfo.skills.map((element)=>{
                return element.name;
            })
            skillArray = skillArray.join(", ")
        } else {
            friendInfo.skills = ""
        }
        this.setState(prevState=>{
            return{
                ...prevState,
                friendData:{
                    title: friendInfo.title,
                    bio: friendInfo.bio,
                    summary: friendInfo.summary,
                    headline: friendInfo.headline,
                    slug: friendInfo.slug,
                    statusId: friendInfo.statusId,
                    imageTypeId: friendInfo.primaryImage.imageTypeId,
                    imageUrl: friendInfo.primaryImage.imageUrl,
                    userId: friendInfo.userId,
                    skills: skillArray,
                },
                friendId: friendInfo.id
            }
        })
    }

    onUpdateFriendSuccess = (response) => {
        console.log(response.data, "onUpdateFriendSuccess");
        this.props.history.push("/friends")
    }

    //####### ERROR HANDLERS #######//
    onAddFriendError = (errResponse) => {
        console.log({ error:errResponse });
    }

    onGetFriendByIdError = (errResponse) => {
        console.log({error: errResponse});
    }

    onUpdateFriendError = (errResponse) => {
        console.log({error:errResponse});
    }

    render(){

        return(
            <div>
                <div className="container p-2 my-1 bg-secondary rounded-3">
                    <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start px-3">
                        <h3 className="my-1 text-white">Add or Edit Friend</h3>
                    </div>
                </div>
                <div className="col-lg-8 col-md-6 col-sm-12 my-3">
                    <div className="card border-0 shadow">
                        <div className="card-body m-4">
                            <Formik
                                enableReinitialize={true}
                                initialValues={this.state.friendData}
                                onSubmit={this.submitForm}
                                validationSchema={formSchema}
                            >
                                {({ values })=>(
                                <Form>
                                    <div className="form-group mb-3 row">
                                        <label
                                            htmlFor="title"
                                            className="col-form-label col-sm-2"
                                            ><strong>Title</strong></label
                                        >
                                        <div className="col-sm-10">
                                            <Field
                                                type="text"
                                                className="form-control"
                                                placeholder="Full Name"
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
                                            htmlFor="bio"
                                            className="col-sm-2 col-form-label"
                                            ><strong>Bio</strong></label
                                        >
                                        <div className="col-sm-10">
                                            <Field
                                                type="text"
                                                className="form-control"
                                                placeholder="About yourself..."
                                                name="bio"
                                            />
                                            <ErrorMessage 
                                                name="bio" 
                                                component="div" className="har-error" 
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group mb-3 row">
                                        <label
                                            htmlFor="summary"
                                            className="col-sm-2 col-form-label"
                                            ><strong>Summary</strong></label
                                        >
                                        <div className="col-sm-10">
                                            <Field
                                                type="text"
                                                className="form-control"
                                                placeholder="Short description..."
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
                                            ><strong>Headline</strong></label
                                        >
                                        <div className="col-sm-10">
                                            <Field
                                                type="text"
                                                className="form-control"
                                                placeholder="Catch phrase"
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
                                                name="skills"
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group mb-3 row">
                                        <label
                                            htmlFor="primaryImage"
                                            className="col-sm-2 col-form-label"
                                            ><strong>Primary Image</strong></label
                                        >
                                        <div className="col-sm-10">
                                            <Field
                                                type="text"
                                                className="form-control"
                                                placeholder="Image Url"
                                                name="imageUrl"
                                            />
                                            <ErrorMessage 
                                                name="imageUrl" 
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
            </div>
        )
    }
}

export default UserAddFriendPage