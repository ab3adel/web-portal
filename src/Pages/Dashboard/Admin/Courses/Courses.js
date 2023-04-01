import React, { Component } from 'react'
import { Dropdown } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'

import './Courses.css'

import API from '../../../../Hoc/API/API'
import Loader from '../../../../Hoc/Loader/Loader'
import { WhiteBoxLoader } from '../../../../Hoc/Loader/Loader'
import Course from './Course/Course'
import { formatDate } from '../../../../Hoc/Helpers/Helpers'

class Courses extends Component {

    state = {
        list: [],
        isLoaded: false,
        model: {
            show: false,
            active: false,
            file_name: '',
            file: null,
            load: false,
            update: false
        },
        selected_cat: '',
        selected_child_cat: '',
        filters: {
            year_id: '',
            class_id: '',
            subject_id: ''
        }
    }


    API = new API( { url: 'https://api.ltcmilestone.com/altafawouq/public/api' } )
    COURSES = this.API.courses()

    constructor() {
        super()
        this.fetchData()
    }

    fetchData = () => {
        let accessToken = JSON.parse(localStorage.getItem('USERINFO')).accessToken

        let query = new FormData();
        query.append('page', 1);
        query.append('page_size', 200);
        query.append('Authorization', accessToken);

        this.COURSES.list(query)
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
            this.setState({ model: { ...this.state.model, show: false, update: false, file_name: '', file: null } })
        }, 300);
    }

    store = () => {
        if( !this.state.model.title || !this.state.model.start_date || !this.state.model.end_date )
            return false

        this.setState({ model: { ...this.state.model, load: true } })

        let accessToken = JSON.parse(localStorage.getItem('USERINFO')).accessToken

        let query = new FormData();
        query.append('title', this.state.model.title);
        query.append('cost', this.state.model.cost);
        query.append('description', this.state.model.description);
        query.append('start_at', formatDate(new Date(this.state.model.start_date)));
        query.append('end_at', formatDate(new Date(this.state.model.end_date)));
        query.append('Authorization', accessToken);

        this.COURSES.store(query)
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


    openUpdate = (title, description, cost, start_at, end_at, id) => {
        this.setState({ model: { ...this.state.model, title: title, description: description, cost: cost, start_date: start_at, end_date: end_at, id: id, update: true } })
        setTimeout(() => {
            this.open()
        }, 100)
    }

    update = () => {
        if( !this.state.model.title || !this.state.model.start_date || !this.state.model.end_date )
            return false

        this.setState({ model: { ...this.state.model, load: true } })

        let accessToken = JSON.parse(localStorage.getItem('USERINFO')).accessToken

        let query = new FormData();
        query.append('id', this.state.model.id);
        query.append('title', this.state.model.title);
        query.append('cost', this.state.model.cost);
        query.append('description', this.state.model.description);
        query.append('start_at', formatDate(new Date(this.state.model.start_date)));
        query.append('end_at', formatDate(new Date(this.state.model.end_date)));
        query.append('Authorization', accessToken);

        this.COURSES.update(query)
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

    delete = (id) => {
        if( window.confirm('Are you sure?') ) {
            this.load()
            
            let accessToken = JSON.parse(localStorage.getItem('USERINFO')).accessToken
    
            let query = new FormData()
            query.append('id', id)
            query.append('Authorization', accessToken);
    
            this.COURSES.delete( query )
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
                <ul className="courses-list">
                    {this.state.isLoaded ?
                        <>
                        <div class="continue add text-center"><button onClick={this.open} class="add_media">إضافة</button></div>
                            {
                                this.state.list.map((item, index) => {
                                    return (<Course item={item} update={this.openUpdate} delete={this.delete} />)
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
                                <h2>إضافة دورة امتحانية</h2>
                                <div className="input-box">
                                    
                                    <input id="name" type="text" placeholder="اسم الدورة الامتحانية" value={this.state.model.title} onChange={(e) => { this.setState({ model: { ...this.state.model, title: e.target.value } }) }} />
                                </div>

                                <div className="input-box">
                                    
                                    <input id="name" type="number" placeholder="التكلفة" value={this.state.model.cost} onChange={(e) => { this.setState({ model: { ...this.state.model, cost: e.target.value } }) }} />
                                </div>

                                <div className="input-box">
                                    
                                    <textarea id="name" type="text" placeholder="الوصف" defaultValue={this.state.model.description} onChange={(e) => { this.setState({ model: { ...this.state.model, description: e.target.value } }) }} />
                                </div>

                                <div className="input-box">
                                    <label for="name">تاريخ البدء</label>
                                    <input id="name" type="date" placeholder="تاريخ البدء" value={this.state.model.start_date} onChange={(e) => { this.setState({ model: { ...this.state.model, start_date: e.target.value } }) }} />
                                </div>

                                <div className="input-box">
                                    <label for="name">تاريخ الانتهاء</label>
                                    <input id="name" type="date" placeholder="تاريخ الانتهاء" value={this.state.model.end_date} onChange={(e) => { this.setState({ model: { ...this.state.model, end_date: e.target.value } }) }} />
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

export default Courses