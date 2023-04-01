import React from 'react'

import './SingleNews.css'

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

const SingleNews = (props) => {
    return(
        <li className="file-li course-li">
            <span>{props.name}</span>
            <i className="icon-delete" style={{ left: 10 }} onClick={() => deleteFile(props.id, props.load, props.unLoad, props.API)}></i>
            <i className="icon-edit" style={{ left: 40 }} onClick={() => { props.update(props.name, props.description, props.id) }}></i>
        </li>
    )
}

export default SingleNews