import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { AppBar, SelectField, RadioButton, RadioButtonGroup, MenuItem, RaisedButton, TextField } from 'material-ui';
import $ from 'jquery';
var api_url = '/api/register/';

class Register extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            firstName: '',
            lastName: '',
            email: '',
            gender: '',
            province: '',
            username_error_text: '',
            password_error_text: '',
            firstname_error_text: '',
            lastname_error_text: '',
            email_error_text: '',
            province_error_text: '',
            gender_error_text: ''
        }

        this.clear = this.clear.bind(this);
    }

    render() {
        return (
            <div align="center">
              <MuiThemeProvider>
                <div>
                  <AppBar title = "Register" style = {style.display} />
                  <TextField 
                  hintText = "username" 
                  floatingLabelText = "Please enter your username"
                  errorText={this.state.username_error_text}
                  value = {this.state.username}
                  onChange = {(event, newValue) => this.setState({username: newValue})}
                  />
                  <br />
                  <TextField
                  type = "password"
                  hintText = "password"
                  floatingLabelText = "Please enter your password"
                  errorText={this.state.password_error_text}
                  value = {this.state.password}
                  onChange = {(event,newValue) => this.setState({password: newValue})}
                  />
                  <br />
                  <TextField
                  hintText = "first name"
                  floatingLabelText = "Please enter your first name"
                  errorText={this.state.firstname_error_text}
                  value = {this.state.firstName}
                  onChange = {(event, newValue) => this.setState({firstName: newValue})}
                  />
                  <br />
                  <TextField
                  hintText = "last name"
                  floatingLabelText = "Please enter your last name"
                  errorText={this.state.lastname_error_text}
                  value = {this.state.lastName}
                  onChange = {(event, newValue) => this.setState({lastName: newValue})}
                  />
                  <br />
                  <TextField
                  hintText = "email"
                  floatingLabelText = "Please enter your email ID"
                  errorText={this.state.email_error_text}
                  value = {this.state.email}
                  onChange = {(event, newValue) => this.setState({email: newValue})}
                  />
                  <br />
                  <SelectField
                  autoWidth = { true }
                  hintText = "Please choose your province"
                  value = {this.state.province}
                  floatingLabelFixed = { true } 
                  floatingLabelText = "Province"
                  onChange = {(event, index, newValue) => this.setState({province: newValue})}
                  >
                    <MenuItem key={1} value = "ON" primaryText = "ON"  />
                    <MenuItem key={2} value = "QC" primaryText = "QC" />
                    <MenuItem key={3} value = "NS" primaryText = "NS" />
                    <MenuItem key={4} value = "NB" primaryText = "NB" />
                    <MenuItem key={5} value = "MB" primaryText = "MB" />
                    <MenuItem key={7} value = "BC" primaryText = "BC" />
                    <MenuItem key={6} value = "PE" primaryText = "PE" />
                    <MenuItem key={8} value = "SK" primaryText = "SK" />
                    <MenuItem key={9} value = "AB" primaryText = "AB" />
                    <MenuItem key={10} value = "NL" primaryText = "NL" />
                  </SelectField>
                  <div style={style.div} className='error-text'>{this.state.province_error_text}</div>
                  <br />
                  Please choose your gender: <br />
                  <RadioButtonGroup labelPosition = 'left' name = "gender" onChange = {(event, newValue) => this.setState({gender: newValue})}>
                    <RadioButton
                      value = "male"
                      label = "male"
                      style = {style.radioButton}
                    />
                    <RadioButton
                      value = "female"
                      label = "female"
                      style = {style.radioButton}
                    />
                    <RadioButton
                      value = "no"
                      label = "prefer not to answer"
                      style = {style.radioButton}
                    />
                  </RadioButtonGroup>
                  <div style={style.div} className='error-text'>{this.state.gender_error_text}</div>
                  <br />
                  <RaisedButton 
                  label = "Submit" 
                  primary = {true} 
                  style = {style} 
                  onClick = {(event) => this.validateUserInput(event)}
                  />
                  <RaisedButton 
                  label = "Clear" 
                  primary = {true} 
                  style = {style} 
                  onClick = {this.clear}
                  />
                </div>
              </MuiThemeProvider>
            </div>
        )
    }

    clear = () => {
      this.setState({
        username: '',
        password: '',
        firstName: '',
        lastName: '',
        email: '',
        gender: '',
        province: ''
      });
    }

    validateUsername() {
      if (!this.state.username) {
        this.setState({username_error_text: 'This field is required'});
        return false;
      } else {
        this.setState({username_error_text: ''});
        return true;
      }
    };

    validatePassword() {
      if (!this.state.password) {
        this.setState({password_error_text: 'This field is required'});
        return false;
      } else if (this.state.password.length < 6) {
        this.setState({password_error_text: 'Password is too short. Minimum 6 characters'})
        return false;
      } else {
        this.setState({password_error_text: ''});
        return true;
      }
    };

    validateFirstName() {
      if (!this.state.firstName) {
        this.setState({firstname_error_text: 'This field is required'});
        return false;
      } else {
        this.setState({firstname_error_text: ''});
        return true;
      }
    };

    validateLastName() {
      if (!this.state.lastName) {
        this.setState({lastname_error_text: 'This field is required'});
        return false;
      } else {
        this.setState({lastname_error_text: ''});
        return true;
      }
    };

    validateEmail() {
      if (!this.state.email) {
        this.setState({email_error_text: 'This field is required'});
        return false;
      } else if (!this.state.email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
        this.setState({email_error_text: 'Incorrect email format'});
        return false;
      } else {
        this.setState({email_error_text: ''});
        return true;
      }
    };

    validateProvince() {
      if (!this.state.province) {
        this.setState({province_error_text: 'This field is required'});
        return false;
      } else {
        this.setState({province_error_text: ''});
        return true;
      }
    }

    validateGender() {
      if (!this.state.gender) {
        this.setState({gender_error_text: 'This field is required'});
        return false;
      } else {
        this.setState({gender_error_text: ''});
        return true;
      }
    }

    validateUserInput(event) {
      event.preventDefault();
      if (!this.validateUsername() || !this.validatePassword() || !this.validateFirstName() || !this.validateLastName() || !this.validateEmail() || !this.validateProvince() || !this.validateGender()) {
        alert("Incomplete form");
      } else {
        this.submit();
      }
    };

    submit() {
      console.log("clicked submit");
      var payload = {
        "username": this.state.username,
        "first_name": this.state.firstName,
        "last_name": this.state.lastName,
        "password": this.state.password,
        "email": this.state.email,
        "gender": this.state.gender,
        "province": this.state.province
      }

      var xhr = $.ajax({
        type: 'PUT',
        url: api_url,
        data: payload,
        success: function (data) {
          alert("successfully registered user");
        },
        error: function (xhr, err) {
          alert("username already exists. please try again.");
        }
      });

      xhr.done(data => {
        debugger;
        this.props.completeRegistration(data["token"], data["username"]);
      });
      
      xhr.fail(err => console.log(err));
    }
    };

const style = {
  margin: 15,
  radioButton: {
    width: 'auto',
    textAlign: 'center',
    display: 'inline-block'
  },
  div: {
    color: 'red',
    textAlign: 'center',
    fontSize: 12
  }
};

export default Register;