import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { AppBar, SelectField, RadioButton, RadioButtonGroup, MenuItem, RaisedButton, TextField } from 'material-ui';
import $ from 'jquery';
var api_url_get = '/api/profile/';
var api_url_post = '/api/profile/';
var api_url_delete = 'api/delete/';


class Profile extends Component {
    constructor(props) {
        super(props);

        var user_info = this.getUserData();

        this.state = {
            username: user_info['user'],
            password: user_info['password'],
            firstName: user_info['firstname'],
            lastName: user_info['lastname'],
            email: user_info['email'],
            province: user_info['province'],
            gender: user_info['gender']
        }
    }

    render() {
        return (
            <div align="center">
              <MuiThemeProvider>
                  <div>
                      <AppBar title = "Profile" style = {style.display} />
                      <TextField
                      defaultValue = {this.state.username}
                      disabled = { true }
                        />
                        <br />
                        <TextField
                        type = "password"
                        hintText = "password"
                        floatingLabelText = "Please enter your password"
                        errorText={this.state.password_error_text}
                        defaultValue = {this.state.password}
                        onChange = {(event,newValue) => this.setState({password: newValue})}
                        />
                        <br />
                        <TextField
                        hintText = "first name"
                        floatingLabelText = "Please enter your first name"
                        errorText={this.state.firstname_error_text}
                        defaultValue = {this.state.firstName}
                        onChange = {(event, newValue) => this.setState({firstName: newValue})}
                        />
                        <br />
                        <TextField
                        hintText = "last name"
                        floatingLabelText = "Please enter your last name"
                        errorText={this.state.lastname_error_text}
                        defaultValue = {this.state.lastName}
                        onChange = {(event, newValue) => this.setState({lastName: newValue})}
                        />
                        <br />
                        <TextField
                        hintText = "email"
                        floatingLabelText = "Please enter your email ID"
                        errorText={this.state.email_error_text}
                        defaultValue = {this.state.email}
                        onChange = {(event, newValue) => this.setState({email: newValue})}
                        />
                        <br />
                        <SelectField
                        autoWidth = { true }
                        hintText = "Please choose your province"
                        defaultValue = {this.state.province}
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
                        label = "Update" 
                        primary = {true} 
                        style = {style} 
                        onClick = {(event) => this.validateUserInput(event)}
                        />
                        <RaisedButton 
                        label = "Delete Account" 
                        primary = {true} 
                        style = {style} 
                        onClick = {(event) => this.deleteUser(event)}
                        />
                    </div>
              </MuiThemeProvider>
            </div>
        )
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
    };
  
    validateGender() {
        if (!this.state.gender) {
          this.setState({gender_error_text: 'This field is required'});
          return false;
        } else {
          this.setState({gender_error_text: ''});
          return true;
        }
    };
  
    validateUserInput(event) {
        event.preventDefault();
        if (!this.validateUsername() || !this.validatePassword() || !this.validateFirstName() || !this.validateLastName() || !this.validateEmail() || !this.validateProvince() || !this.validateGender()) {
          alert("Incomplete form");
        } else {
          this.submit();
        }
    };

    submit() {
        console.log("clicked update");
        var username = this.props.userName;
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
            type: 'POST',
            url: api_url_post + username + "/",
            headers: {"Authorization": this.props.userToken},
            data: payload,
            success: function (data) {
                alert("successfully updated user");
            },
            error: function (xhr, err) {
                alert("failed to update user.");
            }
        });

        xhr.done(data => {
            this.props.updateFunc(data["token"]);
        });

        xhr.fail(err => console.log(err));
    };

    deleteUser(event) {
        event.preventDefault();
        console.log("clicked delete");
        var username = this.props.userName;

        var xhr = $.ajax({
            type: 'DELETE',
            url: api_url_delete + username + "/",
            headers: {"Authorization": this.props.userToken},
            success: function (data) {
                alert("successfully deleted account");
            },
            error: function (xhr, err) {
                alert("failed to delete account.");
            }
        });

        xhr.done(data => {
            this.props.deleteUser();
        });

        xhr.fail(err => console.log(err));
    };

    getUserData() {
        var returnedData;
        var username = this.props.userName;
        $.ajax({
            type: 'GET', 
            url: api_url_get + username,
            headers: {"Authorization": this.props.userToken},
            success: function (data) {
                returnedData = data;
            },
            error: function (xhr, err) {
                returnedData = "error";
            },
            async: false
        });
        return returnedData;
    };
}

const style = {
    margin: 15,
    labelColor: 'white',
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
  
export default Profile;