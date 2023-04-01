import React, { Component } from 'react'
import { Dropdown } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'

import './Library.css'

import API from '../../../../Hoc/API/API'
import Loader from '../../../../Hoc/Loader/Loader'
import File from './File/File'
import { WhiteBoxLoader } from '../../../../Hoc/Loader/Loader'

class Library extends Component {

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
    LIBRARY = this.API.library()
    CATEGORIES = this.API.categories()

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
        if( this.state.year_id )
            query.append('year_id', this.state.year_id);
        if( this.state.class_id )
            query.append('class_id', this.state.class_id);
        if( this.state.subject_id )
            query.append('subject_id', this.state.subject_id);

        this.LIBRARY.list(query)
        .then(response => {
            this.setState({ list: response.data.data.items.items, isLoaded: true })
            console.log(response)
        })
        .catch((e) => {
            console.log(e)
        })
        .finally(() => {
        })

        this.CATEGORIES.list(query)
        .then(response => {
            console.log(response)
            let years = []
            let classes = []
            let subject = []
            let years_filter = [{ key: '', value: '', text: 'الكل' }]
            let classes_filter = [{ key: '', value: '', text: 'الكل' }]
            let subjects_filter = [{ key: '', value: '', text: 'الكل' }]
            response.data.data.items.map(item => {
                if(item.type == 'year') {
                    years.push(item)
                    years_filter.push({ key: item.id, value: item.id, text: item.title })
                    if(!this.state.selected_year)
                        this.setState({ selected_year: item.id })
                } else if(item.type == 'subject') {
                    subject.push(item)
                    subjects_filter.push({ key: item.id, value: item.id, text: item.title })
                    if(!this.state.selected_subject)
                        this.setState({ selected_subject: item.id })
                } else {
                    classes.push(item)
                    classes_filter.push({ key: item.id, value: item.id, text: item.title })
                    if(!this.state.selected_class)
                        this.setState({ selected_class: item.id })
                }
            })
            this.setState({
                years: years,
                subjects: subject,
                classes: classes,
                years_filter: years_filter,
                subjects_filter: subjects_filter,
                classes_filter: classes_filter
            })
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

        if( this.state.model.file_name === '' || this.state.model.file === null )
            return false

        this.setState({ model: { ...this.state.model, load: true } })

        let accessToken = JSON.parse(localStorage.getItem('USERINFO')).accessToken

        let query = new FormData();
        query.append('title', this.state.model.file_name);
        query.append('file', this.state.model.file);
        query.append('year_id', this.state.selected_year);
        query.append('class_id', this.state.selected_class);
        query.append('subject_id', this.state.selected_subject);
        query.append('Authorization', accessToken);

        this.LIBRARY.store(query)
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


    openUpdate = (fileName, id) => {
        this.setState({ model: { ...this.state.model, file_name: fileName, id: id, update: true } })
        setTimeout(() => {
            this.open()
        }, 100)
    }

    update = () => {
        if( this.state.model.file_name === '' || this.state.model.file === null )
            return false

        this.setState({ model: { ...this.state.model, load: true } })

        let accessToken = JSON.parse(localStorage.getItem('USERINFO')).accessToken

        let query = new FormData();
        query.append('title', this.state.model.file_name);
        query.append('file', this.state.model.file);
        query.append('year_id', this.state.selected_year);
        query.append('class_id', this.state.selected_class);
        query.append('subject_id', this.state.selected_subject);
        query.append('Authorization', accessToken);

        this.LIBRARY.update(query)
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
                    <div className="filter">
                        <Dropdown
                            placeholder='السنة'
                            search
                            selection
                            className="filter-dropdown"
                            onChange={(e, data) => { this.setState({ year_id: data.value, model: { ...this.state.model, load: false }, isLoaded: false }); setTimeout(() => { this.unLoad() }, 50); }}
                            value={this.state.year_id}
                            options={this.state.years_filter}
                        />
                        <span className="margin-10"></span>
                        <Dropdown
                            placeholder='الصف'
                            search
                            selection
                            className="filter-dropdown"
                            onChange={(e, data) => { this.setState({ class_id: data.value, model: { ...this.state.model, load: false }, isLoaded: false }); setTimeout(() => { this.unLoad() }, 50); }}
                            value={this.state.class_id}
                            options={this.state.classes_filter}
                        />
                        <span className="margin-10"></span>
                        <Dropdown
                            placeholder='المادة'
                            search
                            selection
                            className="filter-dropdown"
                            onChange={(e, data) => { this.setState({ subject_id: data.value, model: { ...this.state.model, load: false }, isLoaded: false }); setTimeout(() => { this.unLoad() }, 50); }}
                            value={this.state.subject_id}
                            options={this.state.subjects_filter}
                        />
                    </div> : '' }
                    {this.state.isLoaded ?
                        <>
                        <div class="continue add text-center"><button onClick={this.open} class="add_media">إضافة</button></div>
                            {
                                this.state.list.map((file, index) => {
                                    return (<File key={index} name={file.title} id={file.id} link={'https://altafawouq.milestone-ltc.com/altafawouq/public/' + file.path} load={this.load} unLoad={this.unLoad} API={this.LIBRARY} update={this.openUpdate}></File>)
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
                                <h2>إضافة ملف</h2>
                                <div className="input-box">
                                    <label for="name">اسم الملف</label>
                                    <input id="name" type="text" placeholder="اسم الملف" value={this.state.model.file_name} onChange={(e) => { this.setState({ model: { ...this.state.model, file_name: e.target.value } }) }} />
                                </div>

                                <div className="input-box">
                                    <label for="parent_cat">السنة</label>
                                    <select id="parent_cat" onChange={(e) => this.setState({ selected_year: e.target.value })}>
                                        {
                                            this.state.years ?
                                            this.state.years.map((year, i) => {
                                                return(
                                                    <option value={year.id}>{year.title}</option>
                                                )
                                            }) : ''
                                        }
                                    </select>
                                </div>

                                <div className="input-box">
                                    <label for="parent_cat">الصف</label>
                                    <select id="parent_cat" onChange={(e) => this.setState({ selected_class: e.target.value })}>
                                        {
                                            this.state.classes ?
                                            this.state.classes.map((item, i) => {
                                                return(
                                                    <option value={item.id}>{item.title}</option>
                                                )
                                            }) : ''
                                        }
                                    </select>
                                </div>

                                <div className="input-box">
                                    <label for="parent_cat">المادة</label>
                                    <select id="parent_cat" onChange={(e) => this.setState({ selected_subject: e.target.value })}>
                                        {
                                            this.state.subjects ?
                                            this.state.subjects.map((subject, i) => {
                                                return(
                                                    <option value={subject.id}>{subject.title}</option>
                                                )
                                            }) : ''
                                        }
                                    </select>
                                </div>
                                
                                <div className="input-box" style={{ margin: 0 }}>
                                    <label>الملف</label>
                                    <label class="secondary-btn" for="file">اختيار</label>
                                    <input id="file" type="file" style={{ display: 'none' }} onChange={(e) => { this.setState({ model: { ...this.state.model, file: e.target.files[0] } }) }} />
                                    <p class="file_name">{this.state.model.file ? this.state.model.file.name : ''}</p>
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

export default Library