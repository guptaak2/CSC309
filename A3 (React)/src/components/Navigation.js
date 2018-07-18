import React, { Component } from 'react';
import logo from '../logo.svg';
import '../App.css';
import { RaisedButton} from 'material-ui';
import { Toolbar, ToolbarGroup, ToolbarSeparator } from 'material-ui/Toolbar';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

class Navigation extends Component {
		render() {
			var loggedIn = this.props.isLoggedIn;
			return (
				<div className="App">
					<header className="App-header">
						<img src={logo} className="App-logo" alt="logo" />
						<h1 className="App-title">WELCOME TO WAREHOUSE WARS, {this.props.userName}</h1>
					</header>
					<MuiThemeProvider>
						<Toolbar style={{display: 'block'}}>
						<ToolbarGroup >           
							<RaisedButton labelColor='white' primary={true} disabled={loggedIn} label={"Register"} onClick={() => this.props.registerFunc()}/>
							<ToolbarSeparator />  
							<RaisedButton labelColor='white' primary={true} disabled={loggedIn} label={"Login"} onClick={() => this.props.goToLogin()} />
							<ToolbarSeparator />  
							<RaisedButton labelColor='white' primary={true} disabled={!loggedIn} label={"Play Game"} onClick={() => this.props.playFunc()}/> 
							<ToolbarSeparator />  
							<RaisedButton labelColor='white' primary={true} disabled={!loggedIn} label={"Profile"} onClick={() => this.props.goToProfile()}/>
							<ToolbarSeparator />
							<RaisedButton labelColor='white' primary={true} disabled={!loggedIn} label={"Logout"} onClick={() => this.props.logoutFunc()}/> 
							<ToolbarSeparator />  
						</ToolbarGroup>  
						</Toolbar>
					</MuiThemeProvider>
				</div>
			);
		}
	};

export default Navigation;