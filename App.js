import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import fetch from 'node-fetch';

console.disableYellowBox = true; // disable yellow warning boxes from showing

const url = 'https://ancient-sands-37432.herokuapp.com/api/text';
const img = 'https://i.imgur.com/mlWaZmm.png';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {message: []};
    this.onSend = this.onSend.bind(this);
    this.onReceive = this.onReceive.bind(this);
    this.fetchMessage = this.fetchMessage.bind(this);
  }

  componentWillMount() {
    this.setState({
      messages: [
      {
        _id: 2,
        text: 'Hi! Talk to me',
        createdAt: new Date(Date.now()),
        user: {
          _id: 2,
          name: 'Wooffers',
          avatar: img
        }
      },
      {
        _id: 1,
        text: 'Welcome to Wooffers',
        createdAt: new Date(Date.now()),
        system:true
      },]
    });
  }

  onSend(messages=[]) {
    this.setState((previousState) => {
      return {
        messages: GiftedChat.append(previousState.messages, messages)
      }
    });
    this.fetchMessage(messages[0].text);
  }
  
  fetchMessage(messages) {
    // make POST request to api
    const data = { query: messages };
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 
        'Content-Type': 'application/json'
      }
    })
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      this.onReceive(json);
    })
    .catch((error) => {
      console.log(error);
    });
  }

  onReceive(text) {
    this.setState((previousState) => {
      return {
        messages: GiftedChat.append(previousState.messages, {
          _id: Math.round(Math.random() * 1000000),
          text: text,
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'Wooffers',
            avatar: img
          }
        })
      };
    });
  }

  render() {
    return (
        <GiftedChat
          messages={this.state.messages}
          onSend={this.onSend}
          alwaysShowSend={false}
          loadEarlier={true}
          minInputToolbarHeight={55}
          user={{
            _id: 1
          }}
        />
    );
  }
}