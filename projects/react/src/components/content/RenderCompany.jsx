import React from "react"

function RenderCompany(props){

    const company = props.company

    return(
        <option data-co-id={company.id} value={company.id}>{company.name}</option>
    )
}

export default React.memo(RenderCompany)