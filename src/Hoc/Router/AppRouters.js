// React Core
import React, { Component } from "react"
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom'
import Login from "../../Pages/Login/Login"
import { Dashboard as AdminDashbaord } from "../../Pages/Dashboard/Admin/Dashboard"

// API

// Components


class AppRouters extends Component {
    
    state = {
        authenticated: localStorage.getItem('USERINFO') !== null
    }

    authenticate = () => {
        window.location.reload()
    }

    unauthenticate = () => {
        localStorage.removeItem('USERINFO')
        setTimeout( function() {
            window.location.href = window.location.href.replace( "/settings", '' )
        }, 1)
    }

    render() {
        return (
            <>
            <Router basename={'/'}>
                <Switch>
                    <Route path="/" exact component={Login} />
                    <Route path="/admin_area" exact component={AdminDashbaord} />
                </Switch>
            </Router>
            </>
        )
    }
}

export default AppRouters;