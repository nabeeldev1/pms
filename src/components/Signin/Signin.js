import React, { Component } from 'react';
import classes from './Signin.css';
import FormErrors from '../FormErrors/FormErrors';
import { signin } from '../../Server/Server';

class Signin extends Component {
    constructor(props) {
      super(props);
      this.state = {
          email: '',
          password: '',
          formErrors: {email: '', password: ''},
          emailValid: false,
          passwordValid: false,
          formValid: false
      };  
    }
  
    handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({[name]: value}, () => { this.validateField(name, value) });
    }

    validateField(fieldName, value) {
        let fieldValidationErrors = this.state.formErrors;
        let emailValid = this.state.emailValid;
        let passwordValid = this.state.passwordValid;
      
        switch(fieldName) {
          case 'email':
            emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
            fieldValidationErrors.email = emailValid ? '' : ' is invalid';
            break;
          case 'password':
            passwordValid = value.length >= 6;
            fieldValidationErrors.password = passwordValid ? '': ' must be of at least 6 characters long.';
            break;
          default:
            break;
        }
        this.setState({formErrors: fieldValidationErrors,
                        emailValid: emailValid,
                        passwordValid: passwordValid
                      }, this.validateForm);
      }
      
      validateForm() {
        this.setState({formValid: this.state.emailValid && this.state.passwordValid});
      }
  
    handleSubmit = (event) => {
      event.preventDefault();
      if(this.state.emailValid && this.state.passwordValid) {
        const user = {
            email: this.state.email,
            token: '12345678'
        };
        if(signin(user)) {
          this.props.history.push('/dashboard');
        }
      }
    }
  
    render() {
      return (
        <div className={classes.SigninFrom}>
            <h3>Sign in to continue...</h3>
            <hr />
            <div className={classes.FormErrors}>
                <FormErrors formErrors={this.state.formErrors} />
            </div>
            <form className={classes.Form} onSubmit={this.handleSubmit}> 
                <label>Email</label>
                <input type="email" id="email" name="email" placeholder="Your email.." value={this.state.email} onChange={this.handleChange} />

                <label>Password</label>
                <input type="password" id="password" name="password" placeholder="Your password.." value={this.state.password} onChange={this.handleChange} />

                <input type="submit" disabled={!this.state.formValid} value="Login" />
            </form>
        </div>
      );
    }
  }


export default Signin;
