import React, { Component } from 'react';
import './App.css';
import Navigation from './components/Navigation';
import Profile from './components/Profile';
import Login from './components/Login';
import Play from './components/Play';
import Register from './components/Register';
import {PAGES} from './common/constants';

class App extends Component {
	constructor(){
		super()
		this.state = {
			currentPage: PAGES.LOGIN,
			token: null,
			name: null
		}
	}
	
	goToProfile(token, name){
		this.setState({
			currentPage: PAGES.PROFILE,
			token: token,
			name: name
		});
	}

	updateProfile(token){
		this.setState({
			token: token
		});
	}

	goToPlay() {
		this.setState({
			currentPage: PAGES.PROFILE
		})
	}

	logout() {
		this.setState({
			currentPage: PAGES.LOGIN,
			token: null,
			name: null
		})
	}

	renderPage(){
		switch (this.state.currentPage){
			case PAGES.LOGIN:
				return <Login
					loginFunc = {(token, name) => this.goToProfile(token, name)}
				/>
			case PAGES.PROFILE:
				return <Profile 
					userToken = {this.state.token} 
					userName = {this.state.name} 
					deleteUser = {() => this.logout()} 
					updateFunc = {(token) => this.updateProfile(token)}
				/>
			case PAGES.REGISTER:
				return <Register 
					completeRegistration = {(token, name) => this.goToProfile(token, name)}
				/>
			case PAGES.PLAY:
				return <Play
					userName = {this.state.name}
					userToken = {this.state.token}
					submitScoreFunc = {() => this.goToPlay()} 
				/>
			default: 
				return <Login loginFunc = {() => this.goToProfile()} />
		}
	}

	render() {
		return (
		<div>
			<Navigation 
				userName = {this.state.name}
				logoutFunc = {() => this.logout()} 
				isLoggedIn = {this.state.token != null} 
				playFunc = {() => this.setState({currentPage:PAGES.PLAY})}
				registerFunc = {() => this.setState({currentPage:PAGES.REGISTER})}
				goToProfile = {() => this.setState({currentPage:PAGES.PROFILE})}
				goToLogin = {() => this.setState({currentPage:PAGES.LOGIN})}
			/>
			{this.renderPage()}
		</div>)
	};
}

export default App;