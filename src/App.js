import React from 'react'
import {BrowserRouter as Router, Route} from 'react-router-dom'
import Landing from './components/pages/Landing'

const App = () => {
    return (
        <Router>
            <Route path="/" exact component={Landing} />
        </Router>
    )
}

export default App
