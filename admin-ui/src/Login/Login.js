import { Component } from "react"
import './Login.css'
import { Form, FormGroup, FormLabel, FormControl, Button } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.css'
import { BrowserRouter as Router, Link, Switch, Route } from 'react-router-dom'
import axios from 'axios'


export default class Login extends Component {
    constructor(props) {
        super(props)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleUsernameChange = (e) => {
        this.setState({
            username: e.target.value
        })
    }

    handlePasswordChange = (e) => {
        this.setState({
            password: e.target.value
        })
    }

    handleSubmit(e) {
        // e.preventDefault()

        axios.post('/login', {
            username: this.state.username,
            password: this.state.password
        }).then(response => {
            console.log(response)
            console.log("response")
        }, error => console.log("error"))
    
        console.log("submit")
    }
    render() {
        return (
            <div className="login-container">
                <div className="login-text">Login required. Please enter your IBM credentials.</div>
                <div className="form">
                    <Form 
                    action="/login"
                    method = "post"
                    // onSubmit={this.handleSubmit}
                    >
                        <FormGroup controlId="formBasicEmail">
                            <FormLabel>Username</FormLabel>
                            <FormControl name="username" type="text" placeholder="Enter username" onChange={this.handleUsernameChange} />
                        </FormGroup>

                        <FormGroup controlId="formBasicPassword">
                            <FormLabel>Password</FormLabel>
                            <FormControl name="password" type="password" placeholder="Password" onChange={this.handlePasswordChange} />
                        </FormGroup>
                        {/* <Link to="\settings"> */}
                        <Button variant="primary" type="submit">Submit</Button>
                        {/* </Link> */}
                    </Form>
                </div>
            </div>
        )
    }
}
