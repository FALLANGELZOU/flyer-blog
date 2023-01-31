import classNames from "classnames"
import React, { lazy } from "react"
import { Outlet, Route, Routes } from "react-router-dom"

const Backend = () => {
    const Dashboard = lazy(() => import(/* webpackPrefetch:true */ '@/pages/Backend/Dashboard'))
    const Login = lazy(() => import(/* webpackPrefetch:true */ '@/pages/Backend/Login'))
    return (
        <>
            <div className={classNames("backendLayout")}>
                <Routes>
                    <Route path='/' element={<Login />} />
                    <Route path='dashboard' element={<Dashboard />} />
                </Routes>
            </div>
        </>
    )
}

export default Backend