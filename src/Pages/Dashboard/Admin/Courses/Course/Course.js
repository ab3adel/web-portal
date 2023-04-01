import React, { Component } from 'react'

import './Course.css'

import API from '../../../../../Hoc/API/API'
import Loader from '../../../../../Hoc/Loader/Loader'
import { WhiteBoxLoader } from '../../../../../Hoc/Loader/Loader'
import SlideDown from 'react-slidedown'

class Course extends Component {

    state = {
        isLoaded: false,
        closed: true,
        model: {
            show: false,
            active: false,
            name: '',
            load: false,
        },
        subscriptions_model: {
            show: false,
            active: false,
            load: true,
        },
        subscriptions: [],
        update_id: 0
    }

    API = new API( { url: 'https://altafawouq.milestone-ltc.com/altafawouq/public/api' } )
    TIMES = this.API.times()
    COURSES = this.API.courses()


    openData = (ignore=false) => {
        if(!ignore)
            this.setState({ closed: !this.state.closed })
        if(this.state.isLoaded)
            return
        
        let accessToken = JSON.parse(localStorage.getItem('USERINFO')).accessToken

        let query = new FormData();
        query.append('page', 1);
        query.append('page_size', 200);
        query.append('course_id', this.props.item.id);
        query.append('Authorization', accessToken);

        this.TIMES.list(query)
        .then(response => {
            this.setState({ list: response.data.data.items, isLoaded: true })
            console.log(response)
        })
        .catch((e) => {
            console.log(e)
        })
        .finally(() => {
        })
        
    }

    store = (e, type) => {
        if(e.target.value != '') {
            
            let accessToken = JSON.parse(localStorage.getItem('USERINFO')).accessToken
            
            let query = new FormData();
            query.append('time', e.target.value)
            query.append('course_id', this.props.item.id)
            query.append('Authorization', accessToken);

            this.setState({ isLoaded: false })

            e.target.value = ''

            this.TIMES.store( query )
            .then(response => {
                console.log(response)
            })
            .catch((e) => {
                console.log(e)
            })
            .finally(() => {
                this.openData(true)
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
        query.append('time', name)
        query.append('Authorization', accessToken);

        this.setState({ isLoaded: false })

        this.TIMES.update( query )
        .then( response => {
            console.log(response)
        })
        .catch( (e) => {
            console.log(e)
        })
        .finally(() => {
            this.openData(true)
        })
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
            this.setState({ model: { ...this.state.model, show: false } })
        }, 300);
    }

    openSubscriptions = () => {
        this.setState({ subscriptions_model: { ...this.state.subscriptions_model, show: true } })
        setTimeout(() => {
            this.setState({ subscriptions_model: { ...this.state.subscriptions_model, active: true } })
        }, 1);
        if(this.state.subscriptions_model.load)
            this.loadSubscriptions()
    }

    closeSubscriptions = () => {
        this.setState({ subscriptions_model: { ...this.state.subscriptions_model, active: false } })
        setTimeout(() => {
            this.setState({ subscriptions_model: { ...this.state.subscriptions_model, show: false } })
        }, 300);
    }

    delete = (id) => {
        if( window.confirm('Are you sure?') ) {
            let accessToken = JSON.parse(localStorage.getItem('USERINFO')).accessToken

            let query = new FormData()
            query.append('id', id)
            query.append('Authorization', accessToken);

            this.setState({ isLoaded: false })

            this.TIMES.delete( query )
            .then( response => {
                console.log(response)
            })
            .catch( (e) => {
                console.log(e)
            })
            .finally(() => {
                this.openData(true)
            })
        }
    }

    loadSubscriptions = () => {
        let accessToken = JSON.parse(localStorage.getItem('USERINFO')).accessToken

        let query = new FormData()
        query.append('course_id', this.props.item.id)
        query.append('page', 1)
        query.append('page_size', 1000)
        query.append('Authorization', accessToken);

        this.COURSES.subscriptions( query )
        .then( response => {
            console.log(response)
            this.setState({ subscriptions: response.data.data.students.students, subscriptions_model: { ...this.state.subscriptions_model, load: false } })
        })
        .catch( (e) => {
            console.log(e)
        })
        .finally(() => {
            this.openData(true)
        })
    }

    render() {
        return(
            <>
            <li className="file-li course-li" onClick={() => this.openData()}>
                <span>{this.props.item.title}</span>
                <i className="icon-users" style={{ left: 10, fontSize: '20px' }} onClick={ (e) => { e.stopPropagation(); this.openSubscriptions(); } }></i>
                <i className="icon-time" style={{ left: 42 }}></i>
                <i className="icon-delete" style={{ left: 72 }} onClick={(e) => { e.stopPropagation(); this.props.delete(this.props.item.id) } }></i>
                <i className="icon-edit" style={{ left: 102 }} onClick={(e) => { e.stopPropagation(); this.props.update(this.props.item.title, this.props.item.description, this.props.item.cost, this.props.item.start_at, this.props.item.end_at, this.props.item.id) }}></i>
                <SlideDown className={"pure-menu pure-menu-scrollable"} closed={this.state.closed}>
                    <div className="details" onClick={(e) => e.stopPropagation()}>
                        { this.state.isLoading ? <WhiteBoxLoader></WhiteBoxLoader> : '' }
                        <div className="settings">
                        {
                        this.state.isLoaded ?
                        <ul>
                            {
                                this.state.list.map((item, i) => {
                                    return(
                                        <li>
                                            <span>{item.time}</span><span className="actions"><i className="icon-delete" onClick={() => {this.delete(item.id)}}></i><i className="icon-edit" onClick={(e) => { setTimeout(() => {this.open()}, 10); this.setState({ model: { ...this.state.model, name: item.time }, update_id: item.id }) }}></i></span>
                                        </li>
                                    )
                                })
                            }
                            <li className="add"><input type="text" placeholder="توقيت جديد (اضغط Enter للادخال)" onKeyPress={(e) => { if(e.keyCode || e.which == '13') this.store(e) }} /></li>
                        </ul> : <Loader></Loader> }
                        </div>
                    </div>
                </SlideDown>
            </li>
            {
                this.state.model.show ?
                    <div className={"model model-add" + (this.state.model.active ? ' active' : '')} onClick={this.close}>
                        <div className="model-container" onClick={(e) => { e.stopPropagation(); }}>
                            {this.state.model.load ? <WhiteBoxLoader></WhiteBoxLoader> : ''}
                            <h2>تعديل التصنيف</h2>
                            <div className="input-box">
                                <label for="name">التوقيت الجديد</label>
                                <input id="name" type="text" placeholder="التوقيت الجديد" value={this.state.model.name} onChange={(e) => { this.setState({ model: { ...this.state.model, name: e.target.value } }) }} />
                            </div>

                            <div className="continue"><button onClick={() => this.update(this.state.update_id, this.state.model.name)}>نعديل</button></div>

                        </div>
                    </div>
                    :
                    ''
            }
                        {
                this.state.subscriptions_model.show ?
                    <div className={"model model-subscriptions" + (this.state.subscriptions_model.active ? ' active' : '')} onClick={this.closeSubscriptions}>
                        <div className="model-container" onClick={(e) => { e.stopPropagation(); }}>
                            {this.state.subscriptions_model.load ? <div style={{ padding: '20px 0' }}><Loader></Loader></div> :
                            <>
                                <h2>الاشتراكات</h2>
                                <ul>
                                    {
                                        this.state.subscriptions.map(item => {
                                            return(
                                                <li>
                                                    <span>
                                                        الاسم: <strong>{item.student_name}</strong> <br />
                                                        اسم المستخدم: <strong>{item.student_username}</strong> <br />
                                                        التوقيت: <strong>{item.time}</strong><br />
                                                    </span>
                                                </li>
                                            )
                                        })
                                    }
                                </ul>
                            </> }
                        </div>
                    </div>
                    :
                    ''
            }
            </>
        )
    }

}

export default Course;