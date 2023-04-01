import React, { Component } from 'react'

import './News.css'

import API from '../../../../Hoc/API/API'
import Loader from '../../../../Hoc/Loader/Loader'
import SingleNews from './SingleNews/SingleNews'
import { WhiteBoxLoader } from '../../../../Hoc/Loader/Loader'

class News extends Component {

    state = {
        list: [],
        isLoaded: false,
        model: {
            show: false,
            active: false,
            title: '',
            description: '',
            load: false,
            update: false
        }
    }


    API = new API( { url: 'https://api.ltcmilestone.com/altafawouq/public/api' } )
    NEWS = this.API.news()

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

        this.NEWS.list(query)
        .then(response => {
            this.setState({ list: response.data.data.items.items, isLoaded: true })
            console.log(response)
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

    open = () => {
        this.setState({ model: { ...this.state.model, show: true } })
        setTimeout(() => {
            this.setState({ model: { ...this.state.model, active: true } })
        }, 1);
    }

    close = () => {
        this.setState({ model: { ...this.state.model, active: false } })
        setTimeout(() => {
            this.setState({ model: { ...this.state.model, show: false, update: false, title: '', description: '' } })
        }, 300);
    }

    store = () => {

        if( this.state.model.title === '' || this.state.model.description === '' )
            return false
        
        this.setState({ model: { ...this.state.model, load: true } })

        let accessToken = JSON.parse(localStorage.getItem('USERINFO')).accessToken

        let query = new FormData();
        query.append('title', this.state.model.title);
        query.append('description', this.state.model.description);
        query.append('Authorization', accessToken);

        this.NEWS.store(query)
        .then(response => {
            this.close()
            console.log(response)
        })
        .catch((e) => {
            console.log(e)
        })
        .finally(() => {
            this.setState({ model: { ...this.state.model, load: false }, isLoaded: false })
            this.unLoad()
        })
    }


    openUpdate = (title, description, id) => {
        this.setState({ model: { ...this.state.model, title: title, description: description, id: id, update: true } })
        setTimeout(() => {
            this.open()
        }, 100)
    }

    update = () => {
        if( this.state.model.title === '' || this.state.model.description === '' )
            return false

        this.setState({ model: { ...this.state.model, load: true } })

        let accessToken = JSON.parse(localStorage.getItem('USERINFO')).accessToken

        let query = new FormData();
        query.append('title', this.state.model.title);
        query.append('id', this.state.model.id);
        query.append('description', this.state.model.description);
        query.append('Authorization', accessToken);

        this.NEWS.update(query)
        .then(response => {
            this.close()
            this.load()
            this.unLoad()
            console.log(response)
        })
        .catch((e) => {
            console.log(e)
        })
        .finally(() => {
            this.setState({ model: { ...this.state.model, load: false }, isLoaded: false })
            this.unLoad()
        })
    }

    render() {
        return (
            <>
                <ul className="courses-list">
                    {this.state.isLoaded ?
                        <>
                        <div class="continue add text-center"><button onClick={this.open} class="add_media">إضافة</button></div>
                            {
                                this.state.list.map((item, index) => {
                                    return (<SingleNews key={index} name={item.title} description={item.description} id={item.id} load={this.load} unLoad={this.unLoad} API={this.NEWS} update={this.openUpdate}></SingleNews>)
                                })
                            }
                        </>
                        :
                        <div style={{ paddingTop: 200 }}><Loader></Loader></div>}
                </ul>
                {
                    this.state.model.show ?
                        <div className={"model model-add" + (this.state.model.active ? ' active' : '')} onClick={this.close}>
                            <div className="model-container" onClick={(e) => { e.stopPropagation(); }}>
                                {this.state.model.load ? <WhiteBoxLoader></WhiteBoxLoader> : ''}
                                <h2>إضافة خبر</h2>
                                <div className="input-box">
                                    <label for="name">عنوان الخبر</label>
                                    <input id="name" type="text" placeholder="عنوان الخبر" value={this.state.model.title} onChange={(e) => { this.setState({ model: { ...this.state.model, title: e.target.value } }) }} />
                                </div>
                                
                                <div className="input-box">
                                    <label for="description">وصف الخبر</label>
                                    <textarea rows="4" id="description" placeholder="وصف الخبر" defaultValue={this.state.model.description} onChange={(e) => { this.setState({ model: { ...this.state.model, description: e.target.value } }) }} />
                                </div>

                                <div className="continue"><button onClick={() => { if(this.state.model.update) this.update(); else this.store() }}>{ this.state.model.update ? 'تعديل' : 'إضافة' }</button></div>

                            </div>
                        </div>
                        :
                        ''
                }
            </>
        )
    }

}

export default News