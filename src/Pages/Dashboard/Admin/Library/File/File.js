import React from 'react'

import './File.css'
import PDF from '../../../../../Assets/images/pdf.svg'
import API from '../../../../../Hoc/API/API'

const deleteFile = (id, load, unLoad, API) => {

    if( window.confirm('Are you sure?') ) {
        load()
        
        let accessToken = JSON.parse(localStorage.getItem('USERINFO')).accessToken

        let query = new FormData()
        query.append('id', id)
        query.append('Authorization', accessToken);

        API.delete( query )
        .then( response => {
            console.log(response)
        })
        .catch( (e) => {
            console.log(e)
        })
        .finally(() => {
            unLoad()
        })
    }

}

const File = (props) => {
    return(
        <li className="file-li course-li">
            <img src={PDF} />
            <span>{props.name}</span>
            <a href={props.link}><i className="icon-download" style={{ left: 10 }}></i></a>
            <i className="icon-delete" style={{ left: 40 }} onClick={() => deleteFile(props.id, props.load, props.unLoad, props.API)}></i>
            <i className="icon-edit" style={{ left: 70 }} onClick={() => { props.update(props.name, props.id) }}></i>
        </li>
    )
}

export default File