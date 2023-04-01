import axios from 'axios';


class API {
    constructor({ url }){
        this.url = url
        this.endpoints = {}
    }

    // API Config
    config = {
    }

    /**
     * Authentication APIs
     * @param {}
     */
    auth() {

        var endpoints = {}

        console.log(this.config)
        
        endpoints.login = ( query, name='admin/auth/login' ) => axios.post( `${this.url}/${name}`, query )

        endpoints.logout = ( query, name='admin/auth/logout' ) => axios.post( `${this.url}/${name}`, query )

        return endpoints
    }

    /**
     * Library
     * @param {}
     */
    library() {
        var endpoints = {}
        
        endpoints.list = ( query, name='admin/library/index' ) => axios.post( `${this.url}/${name}`, query )
        
        endpoints.store = ( query, name='admin/library/store' ) => axios.post( `${this.url}/${name}`, query )

        endpoints.update = ( query, name='admin/library/update' ) => axios.post( `${this.url}/${name}`, query )

        endpoints.delete = ( query, name='admin/library/delete' ) => axios.post( `${this.url}/${name}`, query )

        return endpoints
    }

    /**
     * Categories
     * @param {}
     */
    categories() {
        var endpoints = {}
        
        endpoints.list = ( query, name='admin/categories/index' ) => axios.post( `${this.url}/${name}`, query )
        
        endpoints.store = ( query, name='admin/categories/store' ) => axios.post( `${this.url}/${name}`, query )

        endpoints.update = ( query, name='admin/categories/update' ) => axios.post( `${this.url}/${name}`, query )

        endpoints.delete = ( query, name='admin/categories/delete' ) => axios.post( `${this.url}/${name}`, query )

        return endpoints
    }
    
    /**
     * Courses
     * @param {}
     */
    courses() {
        var endpoints = {}
        
        endpoints.list = ( query, name='admin/courses/index' ) => axios.post( `${this.url}/${name}`, query )
        
        endpoints.store = ( query, name='admin/courses/store' ) => axios.post( `${this.url}/${name}`, query )

        endpoints.update = ( query, name='admin/courses/update' ) => axios.post( `${this.url}/${name}`, query )

        endpoints.delete = ( query, name='admin/courses/delete' ) => axios.post( `${this.url}/${name}`, query )

        endpoints.subscriptions = ( query, name='admin/courses/registerations' ) => axios.post( `${this.url}/${name}`, query )

        return endpoints
    }
    
    /**
     * Courses Times
     * @param {}
     */
    times() {
        var endpoints = {}
        
        endpoints.list = ( query, name='admin/times/index' ) => axios.post( `${this.url}/${name}`, query )
        
        endpoints.store = ( query, name='admin/times/store' ) => axios.post( `${this.url}/${name}`, query )

        endpoints.update = ( query, name='admin/times/update' ) => axios.post( `${this.url}/${name}`, query )

        endpoints.delete = ( query, name='admin/times/delete' ) => axios.post( `${this.url}/${name}`, query )

        return endpoints
    }

    /**
     * Courses
     * @param {}
     */
    news() {
        var endpoints = {}
        
        endpoints.list = ( query, name='admin/news/index' ) => axios.post( `${this.url}/${name}`, query )
        
        endpoints.store = ( query, name='admin/news/store' ) => axios.post( `${this.url}/${name}`, query )

        endpoints.update = ( query, name='admin/news/update' ) => axios.post( `${this.url}/${name}`, query )

        endpoints.delete = ( query, name='admin/news/delete' ) => axios.post( `${this.url}/${name}`, query )

        return endpoints
    }

    /**
     * Courses
     * @param {}
     */
    daily_news() {
        var endpoints = {}
        
        endpoints.list = ( query, name='admin/events/index' ) => axios.post( `${this.url}/${name}`, query )
        
        endpoints.upload = ( query, name='admin/upload_events' ) => axios.post( `${this.url}/${name}`, query )

        endpoints.update = ( query, name='admin/events/update' ) => axios.post( `${this.url}/${name}`, query )

        endpoints.delete = ( query, name='admin/events/delete' ) => axios.post( `${this.url}/${name}`, query )

        return endpoints
    }

    
    /**
     * Others
     * @param {}
     */
    others() {
        var endpoints = {}
        
        endpoints.push = ( query, name='admin/push_data' ) => axios.post( `${this.url}/${name}`, query )

        endpoints.upload_users = ( query, name='admin/upload_users' ) => axios.post( `${this.url}/${name}`, query )

        endpoints.get_info = ( query, name='info/index' ) => axios.post( `${this.url}/${name}`, query )

        endpoints.update_info = ( query, name='admin/info/update' ) => axios.post( `${this.url}/${name}`, query )

        return endpoints
    }

    

}

export default API