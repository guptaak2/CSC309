import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { AppBar, RaisedButton, TextField } from 'material-ui';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import $ from 'jquery';
var api_url = '/api/login/';
var api_url_scores = '/api/scores';

class Login extends Component {
    constructor(props) {
        super(props);

        var scores = this.getScores();

        this.state = {
            username: '',
            password: '',
            username_error_text: '',
            password_error_text: '',
            zero: scores[0] ? scores[0] : 0,
            one: scores[1] ? scores[1] : 0,
            two: scores[2] ? scores[2] : 0,
            three: scores[3] ? scores[3] : 0,
            four: scores[4] ? scores[4] : 0,
            five: scores[5] ? scores[5] : 0,
            six: scores[6] ? scores[6] : 0,
            seven: scores[7] ? scores[7] : 0,
            eight: scores[8] ? scores[8] : 0,
            nine: scores[9] ? scores[9] : 0
        }

        this.clear = this.clear.bind(this);
    }

    render() {
        return (
            <div align="center">
              <MuiThemeProvider>
                <div>
                  <AppBar title = "Login" />
                  <TextField 
                  hintText = "Please enter your username" 
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
                  <RaisedButton 
                  label = "Login" 
                  secondary = {true} 
                  style = {style} 
                  onClick = {(event) => this.validateUserInput(event)}
                  />
                  <RaisedButton 
                  label = "Clear" 
                  secondary = {true} 
                  style = {style} 
                  onClick = {this.clear}
                  />
                  <Table style={{ width: 200}}>
                    <TableHeader displaySelectAll={false}>
                      <TableRow>
                        <TableHeaderColumn>#</TableHeaderColumn>
                        <TableHeaderColumn>Score</TableHeaderColumn>
                      </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false} >
                      <TableRow>
                        <TableRowColumn>1</TableRowColumn>
                        <TableRowColumn>{this.state.zero}</TableRowColumn>
                      </TableRow>
                      <TableRow>
                        <TableRowColumn>2</TableRowColumn>
                        <TableRowColumn>{this.state.one}</TableRowColumn>
                      </TableRow>
                      <TableRow>
                        <TableRowColumn>3</TableRowColumn>
                        <TableRowColumn>{this.state.two}</TableRowColumn>
                      </TableRow>
                      <TableRow>
                        <TableRowColumn>4</TableRowColumn>
                        <TableRowColumn>{this.state.three}</TableRowColumn>
                      </TableRow>
                      <TableRow>
                        <TableRowColumn>5</TableRowColumn>
                        <TableRowColumn>{this.state.four}</TableRowColumn>
                      </TableRow>
                      <TableRow>
                        <TableRowColumn>6</TableRowColumn>
                        <TableRowColumn>{this.state.five}</TableRowColumn>
                      </TableRow>
                      <TableRow>
                        <TableRowColumn>7</TableRowColumn>
                        <TableRowColumn>{this.state.six}</TableRowColumn>
                      </TableRow>
                      <TableRow>
                        <TableRowColumn>8</TableRowColumn>
                        <TableRowColumn>{this.state.seven}</TableRowColumn>
                      </TableRow>
                      <TableRow>
                        <TableRowColumn>9</TableRowColumn>
                        <TableRowColumn>{this.state.eight}</TableRowColumn>
                      </TableRow>
                      <TableRow>
                        <TableRowColumn>10</TableRowColumn>
                        <TableRowColumn>{this.state.nine}</TableRowColumn>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </MuiThemeProvider>
            </div>
        )
    }

    clear = () => {
      this.setState({
        username: '',
        password: ''
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

    validateUserInput(event) {
      event.preventDefault();
      if (!this.validateUsername() || !this.validatePassword()) {
        alert("Invalid Login");
      } else {
        this.submit();
      }
    };

    getScores() {
      var returnedData;
      $.ajax({
        type: 'GET',
        url: api_url_scores,
        success: function (data) {
          console.log(data);
          returnedData = data;
        },
        error: function (xhr, err) {
          returnedData = "error";
        },
        async: false
      });
      return returnedData;
    };

    submit() {
        console.log("clicked login");
        var payload = {
            "username": this.state.username,
            "password": this.state.password
        }

        var xhr = $.ajax({
            type: 'POST',
            url: api_url,
            data: payload,
            success: function (data) {
                alert("Logged in!");
            },
            error: function (xhr, err) {
                alert("invalid username or password. please try again.");
            }
        });

        xhr.done(data => {
            console.log("Login successful!");
            this.props.loginFunc(data["token"], data["username"]);
        });

        xhr.fail(err => console.log(err));
    }
    };

const style = {
  margin: 15
};

export default Login;