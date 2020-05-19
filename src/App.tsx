import React, {Component} from 'react';
import { w3cwebsocket as W3CWebSocket, IMessageEvent } from "websocket";
import { Image, List, Transition } from 'semantic-ui-react';
import _ from 'lodash';

const client = new W3CWebSocket('ws://127.0.0.1:8000');

class State {
  messages: Array<IMessage> = [];
}

interface IMessage {
  timeStamp: number;
  data: string;
}

class App extends Component<{}, State> {
  constructor(props: any) {
    super(props);
    this.state = { messages: [] };
  }

  componentWillMount() {
    client.onopen = () => {
      console.log('WebSocket Client Connected');
    };
    client.onmessage = (message: IMessageEvent) => {
      console.log(message);
      const recdDate = new Date().valueOf();
      this.setState((prevState) => ({
        messages: prevState.messages.concat([{ data: message.data.toString(), timeStamp: recdDate }]).sort((a: any, b: any) => b.timeStamp - a.timeStamp)
      }))
    };
  }
  
  render() {
    return (
      <div>
        <Transition.Group
          as={List}
          duration={200}
          divided
          size='huge'
          verticalAlign='middle'
          animation='slide down'
        >
          {this.state.messages.map((m) => (
            <List.Item key={(m as any).timeStamp}>
              <List.Content header={_.startCase(`${(m as any).timeStamp} - ${m.data.toString()}`)} />
            </List.Item>
          ))}
        </Transition.Group>
      </div>
    );
  }
}

export default App;