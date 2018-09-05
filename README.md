# Jarvis File Server

A Node.js server used as an endpoint for the Jarvis Project

Jarvis is a client-server based protocol for connecting my home computer to all of my devices

Current Capabilities
* Stream Files from my documents
* Stream music from my documents

In Progress Capabilities
* Connecting to Spotify Accounts

From this, you can connect to a front end such as the ReactJS one seen [here](https://github.com/djh329/Jarvis_Mark_6)

This front end provides speech recognition, a modified file viewer library for displaying files,
and a single "Bridge Model" audio GUI that can be used to control both file served and Spotify audio.
It is currently unknown whether text parsing, which currently is handled by the front end which then
calls the appropriate end point, will be moved to the back end.
