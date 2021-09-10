import React from "react"
// import * as userService from "../services/userService"

class Content extends React.Component{
    componentDidMount(){
        // console.log("componentDidMount()");

        // var payload = {
        //     email: "leouel@leouel.com",
        //     password: "1234567Af!",
        //     tenantId: "bootcamp1"
        //   }

        // userService.logIn(payload)
        // .then(this.onLogInSuccess)
        // .catch(this.onLogInError)
    }
    
    //  onLogInSuccess(response){
    //   console.log(response.data, "onLogInSuccess");
    // }
    
    //  onLogInError(errResponse){
    //   console.log({error: errResponse});
    // }

render(){
    return(
        <React.Fragment>
            <div className="row">
                <div className="col-md-4">
                    <h2>Heading</h2>
                    <p>
                    Donec id elit non mi porta gravida at eget metus. Fusce
                    dapibus, tellus ac cursus commodo, tortor mauris condimentum
                    nibh, ut fermentum massa justo sit amet risus. Etiam porta sem
                    malesuada magna mollis euismod. Donec sed odio dui.
                    </p>
                    <p>
                    <button className="btn btn-secondary">
                        View details &raquo;
                    </button>
                    </p>
                </div>
                <div className="col-md-4">
                    <h2>Heading</h2>
                    <p>
                    Donec id elit non mi porta gravida at eget metus. Fusce
                    dapibus, tellus ac cursus commodo, tortor mauris condimentum
                    nibh, ut fermentum massa justo sit amet risus. Etiam porta sem
                    malesuada magna mollis euismod. Donec sed odio dui.
                    </p>
                    <p>
                    <button className="btn btn-secondary">
                        View details &raquo;
                    </button>
                    </p>
                </div>
                <div className="col-md-4">
                    <h2>Heading</h2>
                    <p>
                    Donec sed odio dui. Cras justo odio, dapibus ac facilisis in,
                    egestas eget quam. Vestibulum id ligula porta felis euismod
                    semper. Fusce dapibus, tellus ac cursus commodo, tortor mauris
                    condimentum nibh, ut fermentum massa justo sit amet risus.
                    </p>
                    <p>
                    <button className="btn btn-secondary">
                        View details &raquo;
                    </button>
                    </p>
                </div>
            </div>

            <div className="row">
                <div className="col-md-4 p-5 mx-auto text-center">
                    <button 
                        type="submit" 
                        className="btn btn-outline-primary"
                        onClick={this.props.buttonEvent}>Click Me
                    </button>
                </div>
            </div>
        </React.Fragment>
    );
    }
}

export default Content