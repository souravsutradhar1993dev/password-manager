import history from '../history' 

export const getuser = () => {
    return async (dispatch) => {
        const apiToken = await localStorage.getItem("authToken");
        const baseUrl = await localStorage.getItem("baseUrl");
        
        const data = await fetch(baseUrl + '/api/auth_user', {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Authorization': 'Bearer ' + apiToken,
            },
        })
        const resStatus = await data.status
        if(resStatus == 401) {
            window.location.href = baseUrl + '/login'
        }
        const res2 = await data.json() 
      
        dispatch({ type: 'GET_USER', payload: res2})
      
    }
}

export const getalluser = (type = 'form', search = '') => {
    return async (dispatch) => {
        const apiToken = await localStorage.getItem("authToken");
        const baseUrl = await localStorage.getItem("baseUrl");
        let url = baseUrl + '/api/user?type=' + type
        if(search !== '') {
            url = url + '&s=' + search
        }

        const data = await fetch(url, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Authorization': 'Bearer ' + apiToken,
            },
        })
        const resStatus = await data.status
        if(resStatus == 401) {
            window.location.href = baseUrl + '/login'
        }
        const res2 = await data.json() 
      
        dispatch({ type: 'GET_ALL_USER', payload: res2})
      
    }
}

export const getmenucategories = () => {
    return async (dispatch) => {
        const apiToken = await localStorage.getItem("authToken");
        const baseUrl = await localStorage.getItem("baseUrl");
        
        const data = await fetch(baseUrl + '/api/category?type=menu', {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Authorization': 'Bearer ' + apiToken,
            },
        })
        const resStatus = await data.status
        if(resStatus == 401) {
            window.location.href = baseUrl + '/login'
        }
        const res2 = await data.json() 
      
        dispatch({ type: 'GET_MENU_CATEGORIES', payload: res2.data})
      
    }
}

export const editcategory = (editId) => {
    return async (dispatch) => {
        const apiToken = await localStorage.getItem("authToken");
        const baseUrl = await localStorage.getItem("baseUrl");
        
        const data = await fetch(baseUrl + '/api/category/' + editId + '/edit', {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Authorization': 'Bearer ' + apiToken,
            },
        })
        const resStatus = await data.status
        if(resStatus == 401) {
            window.location.href = baseUrl + '/login'
        }
        const res2 = await data.json()
      
        dispatch({ type: 'SET_CATEGORY_DATA', payload: res2})
      
    }
}

export const editpassword = (editId) => {
    return async (dispatch) => {
        const apiToken = await localStorage.getItem("authToken");
        const baseUrl = await localStorage.getItem("baseUrl");
        
        const data = await fetch(baseUrl + '/api/password/' + editId + '/edit', {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Authorization': 'Bearer ' + apiToken,
            },
        })
        const resStatus = await data.status
        if(resStatus == 401) {
            window.location.href = baseUrl + '/login'
        }
        const res2 = await data.json()
        
        dispatch({ type: 'SET_PASSWORD_DATA', payload: res2})
    }
}

export const getcategorychildren = (id, search = '') => {
        
    return async (dispatch) => {
        const apiToken = await localStorage.getItem("authToken");
        const baseUrl = await localStorage.getItem("baseUrl");
        const baseRoute = localStorage.getItem("routeBase");
        let url = id !== '' ? baseUrl + '/api/category/' + id : baseUrl + '/api/all_category'
        if(search !== '') {
            url = url + '?s=' + search;
        }
        
        const data = await fetch(url, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Authorization': 'Bearer ' + apiToken,
            },
        })
        const resStatus = await data.status
        if(resStatus == 401) {
            window.location.href = baseUrl + '/login'
        }
        const categoryJson = await data.json() 
        if(categoryJson.current_category_id == '') {
            console.log("/" + baseRoute)
            //return <Redirect to={"/" + baseRoute} />
            history.push("/" + baseRoute)
        }
        dispatch({ type: 'SET_CATEGORY_CHILDREN', payload: categoryJson})
    }
}



export const getshared = (search = '') => {
    return async (dispatch) => {
        const apiToken = await localStorage.getItem("authToken");
        const baseUrl = await localStorage.getItem("baseUrl");
        let url = baseUrl + '/api/share';
        if(search !== '') {
            url = url + '?s=' + search
        }
        const data = await fetch(url, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Authorization': 'Bearer ' + apiToken,
            },
        })
        const resStatus = await data.status
        if(resStatus == 401) {
            window.location.href = baseUrl + '/login'
        }
        const categoryJson = await data.json() 
        
        dispatch({ type: 'SHARED_DATA', payload: categoryJson.data })
    }
}

export const getsharedchildren = (id, search = '') => {
    return async (dispatch) => {
        const apiToken = await localStorage.getItem("authToken");
        const baseUrl = await localStorage.getItem("baseUrl");
        let url = baseUrl + '/api/share?id=' + id;
        if(search !== '') {
            url = url + '&s=' + search
        }
        const data = await fetch(url, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Authorization': 'Bearer ' + apiToken,
            },
        })
        const resStatus = await data.status
        if(resStatus == 401) {
            window.location.href = baseUrl + '/login'
        }
        const categoryJson = await data.json() 
        
        dispatch({ type: 'SHARED_CHILDREN_DATA', payload: categoryJson.data})
    }
}

export const getsharedcategory = (id) => {
    return async (dispatch) => {
        const apiToken = await localStorage.getItem("authToken");
        const baseUrl = await localStorage.getItem("baseUrl");
        let url = baseUrl + '/api/share_category/' + id
        const data = await fetch(url, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Authorization': 'Bearer ' + apiToken,
            },
        })
        const resStatus = await data.status
        if(resStatus == 401) {
            window.location.href = baseUrl + '/login'
        }
        const categoryJson = await data.json() 
        
        dispatch({ type: 'SHARED_CATEGORY_DATA', payload: categoryJson})
    }
}

export const getsharedpassword = (id) => {
    return async (dispatch) => {
        const apiToken = await localStorage.getItem("authToken");
        const baseUrl = await localStorage.getItem("baseUrl");
        let url = baseUrl + '/api/share_password/' + id
        const data = await fetch(url, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Authorization': 'Bearer ' + apiToken,
            },
        })
        const resStatus = await data.status
        if(resStatus == 401) {
            window.location.href = baseUrl + '/login'
        }
        const categoryJson = await data.json() 
        
        dispatch({ type: 'SHARED_PASSWORD_DATA', payload: categoryJson})
    }
}
