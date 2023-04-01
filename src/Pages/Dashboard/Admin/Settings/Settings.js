import React, { Component } from 'react'

import './Settings.css'

import API from '../../../../Hoc/API/API'
import Loader from '../../../../Hoc/Loader/Loader'
import { WhiteBoxLoader } from '../../../../Hoc/Loader/Loader'
import { checkMediaType } from '../../../../Hoc/Helpers/Helpers'

class Settings extends Component {

    state = {
        isLoading: false,
        isLoaded: 0,
        model: {
            show: false,
            active: false,
            name: '',
            load: false,
        },
        update_id: 0,
        typing: false,
        typingTimeout: 0
    }


    API = new API( { url: 'https://api.ltcmilestone.com/altafawouq/public/api' } )
    CATEGORIES = this.API.categories()
    OTHERS = this.API.others()

    constructor() {
        super()
        this.fetchData()
        this.timeout =  0;
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
            this.setState({ model: { ...this.state.model, show: false, update: false, file_name: '', description: '' } })
        }, 300);
    }

    fetchData = () => {
        let accessToken = JSON.parse(localStorage.getItem('USERINFO')).accessToken

        let query = new FormData();
        query.append('page', 1);
        query.append('page_size', 100);
        query.append('Authorization', accessToken);

        this.CATEGORIES.list(query)
        .then(response => {
            console.log(response)
            let years = []
            let classes = []
            let subject = []
            response.data.data.items.map(item => {
                if(item.type == 'year') {
                    years.push(item)
                    if(!this.state.selected_year)
                        this.setState({ selected_year: item.id })
                } else if(item.type == 'subject') {
                    subject.push(item)
                    if(!this.state.selected_subject)
                        this.setState({ selected_subject: item.id })
                } else {
                    classes.push(item)
                    if(!this.state.selected_class)
                        this.setState({ selected_class: item.id })
                }
            })
            this.setState({
                years: years,
                subjects: subject,
                classes: classes,
                isLoaded: this.state.isLoaded + 1,
                isLoading: false
            })
        })
        .catch((e) => {
            console.log(e)
        })
        .finally(() => {
        })

        this.OTHERS.get_info()
        .then(response => {
            console.log(response)
            this.setState({
                info: response.data.data.data,
                isLoaded: this.state.isLoaded + 1,
                isLoading: false
            })
        })

    }


    store = (e, type) => {
        if(e.target.value != '') {
            
            let accessToken = JSON.parse(localStorage.getItem('USERINFO')).accessToken
            
            let query = new FormData();

            query.append('title', e.target.value)
            query.append('type', type)
            query.append('Authorization', accessToken)


            this.setState({ isLoading: true })

            e.target.value = ''

            this.CATEGORIES.store( query )
            .then(response => {
                this.fetchData()
                console.log(response)
            })
            .catch((e) => {
                console.log(e)
            })
            .finally(() => {
            })
        }
    }

    update = (id, name) => {
        if( name == '' )
            return
        this.close()
        let accessToken = JSON.parse(localStorage.getItem('USERINFO')).accessToken

        let query = new FormData()
        query.append('id', id)
        query.append('title', name)
        query.append('Authorization', accessToken);

        this.setState({ isLoading: true })

        this.CATEGORIES.update( query )
        .then( response => {
            console.log(response)
        })
        .catch( (e) => {
            console.log(e)
        })
        .finally(() => {
            this.fetchData()
        })
    }

    delete = (id) => {
        if( window.confirm('Are you sure?') ) {
            let accessToken = JSON.parse(localStorage.getItem('USERINFO')).accessToken

            let query = new FormData()
            query.append('id', id)
            query.append('Authorization', accessToken);

            this.setState({ isLoading: true })

            this.CATEGORIES.delete( query )
            .then( response => {
                console.log(response)
            })
            .catch( (e) => {
                console.log(e)
            })
            .finally(() => {
                this.fetchData()
            })
        }
    }

    push_data = () => {
        let accessToken = JSON.parse(localStorage.getItem('USERINFO')).accessToken

        let query = new FormData()
        query.append('Authorization', accessToken)

        this.setState({ isLoading: true })

        this.OTHERS.push( query )
        .then( response => {
            console.log(response)
        })
        .catch( (e) => {
            console.log(e)
        })
        .finally(() => {
            this.fetchData()
        })
    }

    upload_csv = (event) => {
        let accessToken = JSON.parse(localStorage.getItem('USERINFO')).accessToken

        let query = new FormData();
        query.append('excel_file', event.target.files[0]);
        query.append('Authorization', accessToken);
        
        this.setState({ isLoading: true })

        this.OTHERS.upload_users(query)
        .then(response => {
            console.log(response)
        })
        .catch((e) => {
            console.log(e)
        })
        .finally(() => {
            this.fetchData()
        })
    }

    changeInfo = (key, value) => {
        const self = this;
    
        if (self.state.typingTimeout) {
           clearTimeout(self.state.typingTimeout);
        }
    
        self.setState({
            typing: false,
            typingTimeout: setTimeout(function () {
                self.setState({ isLoading: true })

                let info = self.state.info
                info.map((item, index) => {
                    if(item.key == key) {
                        info[index].value = value
                    }
                })

                let accessToken = JSON.parse(localStorage.getItem('USERINFO')).accessToken
                
                let query = new FormData();
                info.map((item, index) => {
                    query.append(item.key, item.value);
                })
                query.append('Authorization', accessToken);

                self.OTHERS.update_info( query )
                .then(response => {
                    console.log(response)
                })
                .catch((e) => {
                    console.log(e)
                })
                .finally(() => {
                    self.setState({
                        info: info,
                        isLoading: false
                    })
                })

            }, 1000)
        });
    }

    render() {
        return (
            <>
            {
            this.state.isLoaded >= 2 ?
            <div className="settings">
                { this.state.isLoading ? <WhiteBoxLoader></WhiteBoxLoader> : '' }
                <div class="continue add text-center">
                    <button onClick={this.push_data} class="add_media" style={{ marginLeft: 5 }}>إرسال الاشعارات للطلاب</button>
                    <button onClick={() => this.csv_input.click()} class="add_media" style={{ marginRight: 5 }}>استيراد طلاب من ملف اكسل</button>
                    <input ref={component => this.csv_input = component} onChange={(e) => this.upload_csv(e)} style={{ display: 'none' }} type="file" accept=".csv,.xlsx" />
                </div>

                {
                    this.state.info ? this.state.info.map(item => {

                        return(
                            <div className="input-box">
                                <label>{item.name}</label>
                                <textarea defaultValue={item.value} onChange={(event) => this.changeInfo(item.key, event.target.value)}></textarea>
                            </div>
                        )

                    }) : ''
                }

                <label>السنوات</label>
                <ul>
                    {
                        this.state.years.map((item, i) => {
                            return(
                                <li>
                                    <span>{item.title}</span><span className="actions"><i className="icon-delete" onClick={() => {this.delete(item.id)}}></i><i className="icon-edit" onClick={(e) => { setTimeout(() => {this.open()}, 10); this.setState({ model: { ...this.state.model, name: item.title }, update_id: item.id }) }}></i></span>
                                </li>
                            )
                        })
                    }
                    <li className="add"><input type="text" placeholder="سنة جديدة (اضغط Enter للادخال)" onKeyPress={(e) => { if(e.keyCode || e.which == '13') this.store(e, 'year') }} /></li>
                </ul>
                <label>الصفوف</label>
                <ul>
                    {
                        this.state.classes.map((item, i) => {
                            return(
                                <li>
                                    <span>{item.title}</span><span className="actions"><i className="icon-delete" onClick={() => {this.delete(item.id)}}></i><i className="icon-edit" onClick={(e) => { setTimeout(() => {this.open()}, 10); this.setState({ model: { ...this.state.model, name: item.title }, update_id: item.id }) }}></i></span>
                                </li>
                            )
                        })
                    }
                    <li className="add"><input type="text" placeholder="صف جديد (اضغط Enter للادخال)" onKeyPress={(e) => { if(e.keyCode || e.which == '13') this.store(e, 'class') }} /></li>
                </ul>
                <label>المواد</label>
                <ul>
                    {
                        this.state.subjects.map((item, i) => {
                            return(
                                <li>
                                    <span>{item.title}</span><span className="actions"><i className="icon-delete" onClick={() => {this.delete(item.id)}}></i><i className="icon-edit" onClick={(e) => { setTimeout(() => {this.open()}, 10); this.setState({ model: { ...this.state.model, name: item.title }, update_id: item.id }) }}></i></span>
                                </li>
                            )
                        })
                    }
                    <li className="add"><input type="text" placeholder="مادة جديدة (اضغط Enter للادخال)" onKeyPress={(e) => { if(e.keyCode || e.which == '13') this.store(e, 'subject') }} /></li>
                </ul>
            </div>
            : <div style={{ paddingTop: 200 }}><Loader></Loader></div>
            }
            {
                this.state.model.show ?
                    <div className={"model model-add" + (this.state.model.active ? ' active' : '')} onClick={this.close}>
                        <div className="model-container" onClick={(e) => { e.stopPropagation(); }}>
                            {this.state.model.load ? <WhiteBoxLoader></WhiteBoxLoader> : ''}
                            <h2>تعديل التصنيف</h2>
                            <div className="input-box">
                                <label for="name">الاسم الجديد</label>
                                <input id="name" type="text" placeholder="الاسم الجديد" value={this.state.model.name} onChange={(e) => { this.setState({ model: { ...this.state.model, name: e.target.value } }) }} />
                            </div>

                            <div className="continue"><button onClick={() => this.update(this.state.update_id, this.state.model.name)}>نعديل</button></div>

                        </div>
                    </div>
                    :
                    ''
            }
            </>
        )
    }

}

export default Settings