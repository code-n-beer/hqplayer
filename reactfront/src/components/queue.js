import React, { Component } from 'react';
import axios from 'axios';
import {
  ListGroup, ListGroupItem, Card, CardHeader
} from 'reactstrap';

class Queue extends Component {
  constructor(props) {
    super(props);

    this.state = {
      queue: []
    }
  }
  componentWillMount() {
    axios.get('/queue')
      .then(result => {
        this.setState({queue: result.data})
      })
  }

  renderQueue() {
    return this.state.queue.map((item, i) => {
      return (
        <ListGroupItem key={i}>
          <a href={item.url}>{item.title}</a>
        </ListGroupItem>
      )
    })
  }

  render() {
    return (
      <Card>
        <CardHeader>Queue</CardHeader>
        <ListGroup className="list-group-flush">
          {this.renderQueue()}
        </ListGroup>
      </Card>
    );
  }
}

export default Queue;