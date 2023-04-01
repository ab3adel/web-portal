import React, { Component } from 'react'

import './HeaderImages.css'

import API from '../../../../Hoc/API/API'
import Loader from '../../../../Hoc/Loader/Loader'
import { WhiteBoxLoader } from '../../../../Hoc/Loader/Loader'

class HeaderImages extends Component {

    state = {
        list: [],
        isLoaded: false
    }


    API = new API({ url: 'https://api.ltcmilestone.com/altafawouq/public/api' })
    HEADER_IMAGES = this.API.header_images()

    constructor() {
        super()
        this.fetchData()
    }

    fetchData = () => {
        let accessToken = JSON.parse(localStorage.getItem('USERINFO')).accessToken

        let query = new FormData();
        query.append('page', 1);
        query.append('page_size', 100);
        query.append('Authorization', accessToken);

        this.HEADER_IMAGES.list(query)
        .then(response => {
            console.log(response)
            this.setState({ list: response.data.data.items, isLoaded: true })
        })
        .catch((e) => {
            console.log(e)
        })
        .finally(() => {
        })
    }

    load = () => {
        this.setState({ isLoaded: false })
    }

    unLoad = () => {
        this.fetchData()
    }

    store = (file) => {

        this.load()

        let accessToken = JSON.parse(localStorage.getItem('USERINFO')).accessToken

        let query = new FormData();
        query.append('media[]', file);
        query.append('Authorization', accessToken);

        this.HEADER_IMAGES.store(query)
        .then(response => {
            console.log(response)
        })
        .catch((e) => {
            console.log(e)
        })
        .finally(() => {
            this.unLoad()
        })
    }

    deleteMedia = (id) => {
        if( window.confirm('Are you sure?') ) {
            this.load()
            
            let accessToken = JSON.parse(localStorage.getItem('USERINFO')).accessToken
    
            let query = new FormData()
            query.append('id', id)
            query.append('Authorization', accessToken);
    
            this.HEADER_IMAGES.delete( query )
            .then( response => {
                console.log(response)
            })
            .catch( (e) => {
                console.log(e)
            })
            .finally(() => {
                this.unLoad()
            })
        }
    }

    render() {
        return (
            <>
                { this.state.isLoaded ?
                <div className="row">
                    {
                        this.state.list.map((item, index) => {
                            return(<div className="col-md-4 pull-right"><div className="gallery-image" onClick={() => this.deleteMedia(item.id)} style={{ background: '#F7F7F7 url(https://api.milestone-ltc.com/milestone/public/' + item.path + ')' }}><i className="icon-delete"></i></div></div>)
                        })
                    }
                    <div className="col-md-4 pull-right">
                        <div className="add-gallery">
                            <span>+</span>
                            <label for="add_gallery"></label>
                            <input type="file" id="add_gallery" onChange={(e) => this.store(e.target.files[0])} style={{ display: 'none' }} /></div>
                        </div>
                </div>
                : <div style={{ paddingTop: 200 }}><Loader></Loader></div> }
            </>
        )
    }

}

export default HeaderImages