import React, { Component } from 'react'

import './DailyNews.css'

import API from '../../../../Hoc/API/API'
import Loader from '../../../../Hoc/Loader/Loader'
import SingleNews from './SingleDailyNews/SingleDailyNews'
import { WhiteBoxLoader } from '../../../../Hoc/Loader/Loader'
import { formatDate } from '../../../../Hoc/Helpers/Helpers'

class DailyNews extends Component {

    state = {
        list: [],
        isLoaded: false,
        model: {
            show: false,
            active: false,
            description: '',
            load: false,
            update: false
        }
    }


    API = new API( { url: 'https://api.ltcmilestone.com/altafawouq/public/api' } )
    NEWS = this.API.daily_news()

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


    openUpdate = (message, id) => {
        this.setState({ model: { ...this.state.model, description: message, id: id, update: true } })
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
        query.append('id', this.state.model.id);
        query.append('message', this.state.model.description);
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

    upload_csv = (event) => {
        let accessToken = JSON.parse(localStorage.getItem('USERINFO')).accessToken

        let query = new FormData();
        query.append('excel_file', event.target.files[0]);
        query.append('Authorization', accessToken);
        
        this.load()

        this.NEWS.upload(query)
        .then(response => {
            this.unLoad()
            console.log(response)
        })
        .catch((e) => {
            console.log(e)
        })
        .finally(() => {
            this.unLoad()
        })
    }

    render() {
        return (
            <>
                <ul className="courses-list">
                    {this.state.isLoaded ?
                        <>
                        <div class="continue add text-center">
                            <button onClick={() => this.csv_input.click()} class="add_media">استيراد من ملف CSV</button>
                            <input ref={component => this.csv_input = component} onChange={(e) => this.upload_csv(e)} style={{ display: 'none' }} type="file" accept=".csv,.xlsx" />
                        </div>
                            {
                                this.state.list.map((item, index) => {
                                    return (<SingleNews key={index} name={<>{ item.message } <br/><span style={{ color: "#666" }}> معرف الطالب: {item.user_id} - معرف الرسالة: {item.id} - التاريخ: {formatDate(item.created_at)}</span></>} id={item.id} load={this.load} unLoad={this.unLoad} API={this.NEWS} update={this.openUpdate}></SingleNews>)
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
                                    <label for="description">الرسالة</label>
                                    <textarea rows="4" id="description" placeholder="الرسالة" defaultValue={this.state.model.description} onChange={(e) => { this.setState({ model: { ...this.state.model, description: e.target.value } }) }} />
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

export default DailyNews