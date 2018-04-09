import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import fetch from 'node-fetch';

console.disableYellowBox = true; // disable yellow warning boxes from showing

const url = 'https://ancient-sands-37432.herokuapp.com/api/text';

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
      messages: [{
        _id: 1,
        text: 'Hi! Talk to me',
        createdAt: new Date(Date.now()),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://scontent.fkul13-1.fna.fbcdn.net/v/t1.0-9/18767565_1552414664777784_4442061474903649127_n.jpg?oh=fa8e3877005b47c8fe2ac755dec0dca2&oe=5B068D22'
        }
      }]
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
            name: 'React Native',
            avatar: 'https://scontent.fkul13-1.fna.fbcdn.net/v/t1.0-9/18767565_1552414664777784_4442061474903649127_n.jpg?oh=fa8e3877005b47c8fe2ac755dec0dca2&oe=5B068D22'
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
          alwaysShowSend={true}
          user={{
            _id: 1
          }}
        />
    );
  }
}