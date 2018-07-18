README.txt

In order to install our application on cslinux lab machines, please follow these steps (on lab machines):

0. SSH into cslinux.utm.utoronto.ca
1. cd to our assignment directory and run "npm install" to install node modules
2. set your UTORID and PASSWORD in constants.js in order to run MongoDB
3. since we created our app using create-react-app
3. open a new Terminal window and run "ssh -D 8123 -f -C -q -N [UTORID]@cslinux.utm.utoronto.ca" and enter your password
4. now we need to set a proxy in FireFox because "http://localhost" points to cslinux.utm.utoronto.ca
5. go to FireFox Preferences, General Tab and scroll down to Network proxy:
    5.1: Choose "Manual proxy configuration"
    5.2: SOCKS Host: "localhost" and Port: 8123
    5.3: Choose SOCKS_v5
    5.4: Clear "localhost" from "No Proxy for"
    5.5: Click OK to save settings
4. run "npm start" which runs api.js and game_server.js
5. open FireFox, type in "localhost:3000" which runs React and continue from there
6. to test our backend api calls: on a separate tab, run "localhost:10880/api/users" etc. (10880 is global.wwPort in constants.js)
    6.1: if you decide to change global.wwPort, please change it in package.json under "proxy": "http://localhost:10880".   
7. in order to end your session, run "ps aux | grep ssh" and kill "ssh -D 8123...."


Our architecture:
api.js is our backend server that performs user and score management as well as connects to MongoDB