import React from "react"
import { withRouter } from "react-router-dom"
import debug from "sabio-debug"

const _logger = debug.extend("UserHomePage")

class UserHomePage extends React.Component{

    componentDidMount(){
        _logger("componentDidMount() -> UserHomePage");
    }

    render(){
        return(
            <div className="container">
                <h1 className="m-3">Hello {this.props.currentUser.currentUser.firstName} {this.props.currentUser.currentUser.lastName}!</h1>
            </div>
        );
    };
};

export default withRouter(UserHomePage)