import React, { Component } from 'react'

import './Dashboard.css'

// Assets
import Logo from '../../../Assets/images/Logo-colored.svg'
import { Link } from 'react-router-dom'
import Library from './Library/Library'
import API from '../../../Hoc/API/API'
import Loader from '../../../Hoc/Loader/Loader'
import Settings from './Settings/Settings'
import Courses from './Courses/Courses'
import News from './News/News'
import DailyNews from './DailyNews/DailyNews'

class Dashboard extends Component {
    
    state = {
        active: 'library',
        activeRight: 150 * 0,
        isLoading: false
    }

    API = new API( { url: 'https://api.ltcmilestone.com/altafawouq/public/api' } )
    AUTH = this.API.auth()

    constructor() {
        super()
        if( !localStorage.getItem('USERINFO') )
            window.location.href = window.location.href.replace( "/admin_area", '/login' )
        if(JSON.parse(localStorage.getItem('USERINFO')).isAdmin != '1')
            window.location.href = window.location.href.replace( "/admin_area", '/student_area' )
    }

    generateSection = () => {
        return(
            <>
            {
                this.state.active === 'library' ? <Library></Library> : this.state.active === 'courses' ? <Courses></Courses> :
                this.state.active === 'news' ? <News></News> :
                this.state.active === 'dailynews' ? <DailyNews></DailyNews> :
                <Settings></Settings>
            }
            </>
        )
    }

    logout = () => {
        this.setState({ isLoading: true })
        let accessToken = JSON.parse(localStorage.getItem('USERINFO')).accessToken
        let query = new FormData();
        query.append('Authorization', accessToken);
        this.AUTH.logout(query)
        .then( response => {
            localStorage.removeItem('USERINFO')
            window.location.href = window.location.href.replace( "/admin_area", '/' )
        })
        .catch( (e) => {
            alert('Invalid data!');
        })
        .finally(() => {
            this.setState({ isLoading: false })
        })
    }

    render() {
        return(
            <>
            { localStorage.getItem('USERINFO') ? JSON.parse(localStorage.getItem('USERINFO')).isAdmin == '1' ? this.state.isLoading ? <div style={{ paddingTop: 200 }}><Loader></Loader></div> :
            <>
            <div className="user-info">
                <span className="name">{JSON.parse(localStorage.getItem('USERINFO')).name}</span>
                <span className="logout" onClick={this.logout}><i className="icon-logout"></i></span>
            </div>
            <div className="container">
                <div className="admin-dashboard student-dashboard">
                    
                    <div className="logo"><Link to="/"><img src={Logo} /></Link></div>
                    
                    <div className="tabs">
                        <ul>
                            <span style={{ right: this.state.activeRight }}></span>
                            <li className={ this.state.active === 'library' ? 'active' : '' } onClick={() => { this.setState({ active: 'library', activeRight: 150 * 0 }) }}>المكتبة</li>
                            <li className={ this.state.active === 'courses' ? 'active' : '' } onClick={() => { this.setState({ active: 'courses', activeRight: 150 * 1 }) }}>الدورات الامتحانية</li>
                            <li className={ this.state.active === 'dailynews' ? 'active' : '' } onClick={() => { this.setState({ active: 'dailynews', activeRight: 150 * 2 }) }}>المجريات اليوميّة</li>
                            <li className={ this.state.active === 'news' ? 'active' : '' } onClick={() => { this.setState({ active: 'news', activeRight: 150 * 3 }) }}>آخر الأخبار</li>
                            <li className={ this.state.active === 'settings' ? 'active' : '' } onClick={() => { this.setState({ active: 'settings', activeRight: 150 * 4 }) }}>الإعدادات</li>
                        </ul>
                    </div>

                    <div className="col-md-8 col-md-push-2">
                        { this.generateSection() }
                    </div>

                </div>
            </div>
            </> : '' : '' }
            </>
        )
    }

}

export { Dashboard }