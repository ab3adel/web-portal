import React, { Component } from 'react'

import './Login.css'

// Assets
import Logo from '../../Assets/images/Logo-colored.svg'
import API from '../../Hoc/API/API'
import {WhiteBoxLoader} from '../../Hoc/Loader/Loader'
import { toFormBody } from '../../Hoc/Helpers/Helpers'
import { Link } from 'react-router-dom'

class Login extends Component {
    
    state = {
        position: 0,
        isLoading: false
    }

    API = new API( { url: 'https://api.ltcmilestone.com/altafawouq/public/api' } )
    AUTH = this.API.auth()

    constructor() {
        super()
        setInterval(() => {
            this.setState({ position: this.state.position + 0.1 })
        }, 12);
        if( localStorage.getItem('USERINFO') )
            window.location.href = window.location.href + 'admin_area'
    }

    login = (e) => {
        e.preventDefault()

        this.setState({ isLoading: true })

        let query = new FormData();
        query.append('username', this.state.username);
        query.append('password', this.state.password);

        this.AUTH.login( query )
        .then( response => {
            console.log(response)
            if(response.data.data.isAdmin != 1)
                alert('Invalid data!');
            else {
                localStorage.setItem('USERINFO', JSON.stringify(response.data.data))
                window.location.href = window.location.href + 'admin_area'
            }
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
            {
            localStorage.getItem('USERINFO') ? '' :
            <div className="login-page" style={{ backgroundPosition: this.state.position + 'px ' + this.state.position + 'px' }}>
                <div className="login-box">
                    { this.state.isLoading ? <WhiteBoxLoader></WhiteBoxLoader> : '' }
                    <div className="logo"><Link to="/"><img src={Logo} /></Link></div>
                    <form onSubmit={this.login}>
                        <input type="text" placeholder="اسم المستخدم" onChange={(e) => {this.setState({ username: e.target.value })}} />
                        <input type="password" placeholder="كلمة المرور" onChange={(e) => {this.setState({ password: e.target.value })}} />
                        <div className="button-holder">
                            <button>تسجيل الدخول</button>
                        </div>
                    </form>
                </div>
            </div>
            }
            </>
        )
    }

}

export default Login