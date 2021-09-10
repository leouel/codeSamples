import React from "react"

class Jumbo extends React.Component{

    render(){
        return(
            <React.Fragment>
                <div className="p-5 mb-4 bg-light rounded-3">
                <div className="container-fluid py-5">
                    <h1 className="display-5 fw-bold">Hello, world!</h1>
                    <p className="col-md-8 fs-4">
                    This is a template for a simple marketing or informational
                    website. It includes a large callout called a jumbotron and
                    three supporting pieces of content. Use it as a starting point
                    to create something more unique.
                    </p>
                    <p>
                    <button className="btn btn-primary btn-lg">
                        Learn more &raquo;
                    </button>
                    </p>
                </div>
                </div>
            </React.Fragment>
        );
    }
}

export default Jumbo