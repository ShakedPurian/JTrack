import React, { useReducer, useContext } from 'react';
import axios from 'axios';

import { reducer } from './reducer';
import {
    DISPLAY_ALERT,
    CLEAR_ALERT,
    REGISTER_USER_BEGIN,
    REGISTER_USER_SUCCESS,
    REGISTER_USER_ERROR,
    LOGIN_USER_BEGIN,
    LOGIN_USER_ERROR,
    LOGIN_USER_SUCCESS,
    TOGGLE_SIDEBAR,
    LOGOUT_USER,
    UPDATE_USER_BEGIN,
    UPDATE_USER_ERROR,
    UPDATE_USER_SUCCESS,
    HANDLE_CHANGE,
    CREATE_JOB_BEGIN,
    CREATE_JOB_SUCCESS,
    CREATE_JOB_ERROR,
    GET_JOBS_BEGIN,
    GET_JOBS_SUCCESS,
    CLEAR_VALUES,
    SET_EDIT_JOB,
    DELETE_JOB,
    EDIT_JOB_BEGIN,
    EDIT_JOB_SUCCESS,
    EDIT_JOB_ERROR,
    STATS_BEGIN,
    STATS_SUCCESS,
    CLEAR_FILTERS,
    CHANGE_PAGE
} from "./actions"


const token = localStorage.getItem('token')
const user = localStorage.getItem('user')

const initialState = {
    isLoading: false,
    showAlert: false,
    alertText: '',
    alertType: '',
    user: user ? JSON.parse(user) : null,
    token: token,
    showSidebar: false,
    isEditing: false,
    editJobId: '',
    position: '',
    company: '',
    jobLocation: '',
    jobTypeOptions: ['full-time', 'part-time', 'remote', 'internship'],
    jobType: 'full-time',
    statusOptions: ['pending', 'interview', 'declined'],
    status: 'pending',
    jobs: [],
    totalJobs: 0,
    numOfPages: 1,
    page: 1,
    stats: {},
    search: '',
    searchStatus: 'all',
    searchType: 'all',
    sort: 'latest',
    sortOptions: ['latest', 'oldest', 'a-z', 'z-a']
}

const AppContext = React.createContext()

const AppProvider = ({ children }) => {  /* wrap App in index.js with it */
    const [state, dispatch] = useReducer(reducer, initialState)

    const authFetch = axios.create({
        baseURL: '/api/v1/'
    })
    authFetch.interceptors.request.use((config) => {
        config.headers.common['Authorization'] = `Bearer ${state.token}`
        return config
    }, (e) => {
        return Promise.reject(e)
    })
    authFetch.interceptors.response.use((response) => {
        return response
    }, (e) => {
        if (e.response.status === 401) {
            logoutUser()
        }
        return Promise.reject(e)
    })

    const clearAlert = () => {
        setTimeout(() => {
            dispatch({ type: CLEAR_ALERT })
        }, 3000)
    }
    const displayAlert = () => {
        dispatch({ type: DISPLAY_ALERT })
        clearAlert()
    }

    const addUserToLocalStorage = ({ user, token }) => {
        localStorage.setItem('user', JSON.stringify(user))
        localStorage.setItem('token', token)
    }
    const removeFromLocalStorage = () => {
        localStorage.removeItem('user')
        localStorage.removeItem('token')
    }

    const registerUser = async (currentUser) => {
        dispatch({ type: REGISTER_USER_BEGIN })
        try {
            const response = await axios.post('/api/v1/auth/register', currentUser)
            const { user, token } = response.data;
            dispatch({
                type: REGISTER_USER_SUCCESS,
                payload: { user, token }
            })
            addUserToLocalStorage({ user, token })
        } catch (e) {
            dispatch({ type: REGISTER_USER_ERROR, payload: { msg: e.response.data.msg } })
        }
        clearAlert()
    }
    const loginUser = async (currentUser) => {
        dispatch({ type: LOGIN_USER_BEGIN })
        try {
            const { data } = await axios.post('/api/v1/auth/login', currentUser)
            const { user, token } = data;
            dispatch({
                type: LOGIN_USER_SUCCESS,
                payload: { user, token }
            })
            addUserToLocalStorage({ user, token })
        } catch (e) {
            dispatch({ type: LOGIN_USER_ERROR, payload: { msg: e.response.data.msg } })
        }
        clearAlert()
    }

    const toggleSidebar = () => {
        dispatch({ type: TOGGLE_SIDEBAR })
    }

    const logoutUser = () => {
        dispatch({ type: LOGOUT_USER })
        removeFromLocalStorage()
    }

    const updateUser = async (currentUser) => {
        dispatch({ type: UPDATE_USER_BEGIN })
        try {
            const { data } = await authFetch.patch('/auth/updateUser', currentUser)
            const { user, token } = data
            dispatch({ type: UPDATE_USER_SUCCESS, payload: { user, token } })
            addUserToLocalStorage({ user, token })
        } catch (e) {
            if (e.response.status !== 401) {
                dispatch({ type: UPDATE_USER_ERROR, payload: { msg: e.response.data.msg } })
            }
        }
        clearAlert()
    }

    const handleChange = ({ name, value }) => {
        dispatch({ type: HANDLE_CHANGE, payload: { name, value } })
    }

    const clearFilters = () => {
        dispatch({ type: CLEAR_FILTERS })
    }

    const createJob = async () => {
        dispatch({ type: CREATE_JOB_BEGIN })
        try {
            const { position, company, jobLocation, jobType, status } = state
            await authFetch.post('/jobs', { position, company, jobLocation, jobType, status })
            dispatch({ type: CREATE_JOB_SUCCESS })
        } catch (e) {
            if (e.response.status === 401) return
            dispatch({ type: CREATE_JOB_ERROR, payload: { msg: e.response.data.msg } })
        }
        clearAlert()
    }

    const getJobs = async () => {
        const { search, searchStatus, searchType, sort,page } = state
        let url = `/jobs?page=${page}&status=${searchStatus}&jobType=${searchType}&sort=${sort}`
        if (search) {
            url = url + `&search=${search}`
        }
        dispatch({ type: GET_JOBS_BEGIN })
        try {
            const { data } = await authFetch.get(url)
            const { jobs, totalJobs, numOfPages } = data
            dispatch({ type: GET_JOBS_SUCCESS, payload: { jobs, totalJobs, numOfPages,page } })

        } catch (e) {
            logoutUser()
        }
        clearAlert()
    }

    const setEditJob = (id) => {
        dispatch({ type: SET_EDIT_JOB, payload: { id } })
    }
    const editJob = async () => {
        dispatch({ type: EDIT_JOB_BEGIN })
        try {
            const { position, company, jobLocation, jobType, status } = state
            await authFetch.patch(`/jobs/${state.editJobId}`, { position, company, jobLocation, jobType, status })
            dispatch({ type: EDIT_JOB_SUCCESS })
            dispatch({ type: CLEAR_VALUES })
        } catch (e) {
            if (e.respose.status === 401) return
            dispatch({ type: EDIT_JOB_ERROR, payload: { msg: e.response.data.msg } })
        }
    }
    const deleteJob = async (jobId) => {
        dispatch({ type: DELETE_JOB })
        try {
            await authFetch.delete(`/jobs/${jobId}`)
            getJobs()
        } catch (e) {
            logoutUser()
        }
        clearAlert()
    }

    const clearValues = () => {
        dispatch({ type: CLEAR_VALUES })
    }

    const showStats = async () => {
        dispatch({ type: STATS_BEGIN })
        try {
            const { data } = await authFetch.get('/jobs/stats')
            dispatch({
                type: STATS_SUCCESS, payload: {
                    stats: data.defaultStats
                }
            })
        } catch (e) {
            logoutUser()
        }
    }

    const changePage= (page)=>{
        dispatch({type: CHANGE_PAGE, payload: { page }})
    }

    return <AppContext.Provider
        value={{
            ...state,
            displayAlert,
            registerUser,
            loginUser,
            toggleSidebar,
            logoutUser,
            updateUser,
            handleChange,
            createJob,
            getJobs,
            setEditJob,
            deleteJob,
            clearValues,
            editJob,
            showStats,
            clearFilters,
            changePage
        }}>
        {children}
    </AppContext.Provider>
};

const useAppContext = () => {  /* custume hook to use appcontext */
    return useContext(AppContext)
}

export { AppProvider, initialState, useAppContext }