import React, { Suspense } from "react"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import Start from "./view/pages/start/Start"
import All from "./view/pages/all/All"
import ErrorPage from "./view/pages/error/ErrorPage"
import Main from "./view/pages/main/Main"
import SetStatement from "./view/pages/statement/components/set/SetStatement"
import Statement from "./view/pages/statement/Statement"
import App from "./view/pages/home/App"
import { AnimatePresence } from "framer-motion"
import { useLocation } from "react-router-dom"

const AppRouter = () => {
    const location = useLocation()

    return (
        <AnimatePresence mode="wait" initial={false}>
            <Routes location={location}>
                <Route path="/" element={<All />} errorElement={<ErrorPage />}>
                    <Route
                        index
                        element={<Start />}
                        errorElement={<ErrorPage />}
                    />
                    <Route
                        path="home"
                        element={<App />}
                        errorElement={<ErrorPage />}
                    >
                        <Route
                            index
                            element={
                                <Suspense fallback={<p>Loading...</p>}>
                                    <Main />
                                </Suspense>
                            }
                            errorElement={<ErrorPage />}
                        />
                        <Route
                            path="addStatment"
                            element={
                                <Suspense fallback={<p>Loading...</p>}>
                                    <SetStatement />
                                </Suspense>
                            }
                            errorElement={<ErrorPage />}
                        />
                        <Route
                            path="updateStatement/:statementId"
                            element={
                                <Suspense fallback={<p>Loading...</p>}>
                                    <SetStatement />
                                </Suspense>
                            }
                            errorElement={<ErrorPage />}
                        />
                        <Route
                            path="statement/:statementId"
                            element={
                                <Suspense fallback={<p>Loading...</p>}>
                                    <Statement />
                                </Suspense>
                            }
                            errorElement={<ErrorPage />}
                        >
                            <Route path=":page" element={<Statement />}>
                                <Route path=":sort" element={<Statement />} />
                            </Route>
                        </Route>
                    </Route>
                </Route>
            </Routes>
        </AnimatePresence>
    )
}

export default AppRouter
