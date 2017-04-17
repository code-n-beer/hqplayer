import React, { Component } from 'react';
import {
  Button, ButtonGroup, Row, Col, Card, CardHeader, CardTitle, CardBlock
} from 'reactstrap';
import {Icon} from 'react-fa';
import axios from 'axios';

class Player extends Component {
  constructor(props) {
    super(props);

    this.state = {
      nowPlaying: {
        title: 'Nothing',
        url: ''
      }
    }
  }
  componentWillMount() {
    axios.get('/now-playing')
      .then(result => {
        if(result.data){
          this.setState({nowPlaying: result.data})
        }
      })
  }

  play() {
    axios.post('/play');
  }
  pause() {
    axios.post('/pause');
  }
  next() {
    axios.post('/next');
  }

  render() {
    return (
      <Row className="mb-3">
        <Col>
        <Card>
          <CardHeader>Now Playing</CardHeader>
          <CardBlock>
          <CardTitle>
            {this.state.nowPlaying.title}
          </CardTitle>
            <div className="btn-group btn-group-justified" role="group">
            <ButtonGroup size="lg">
              <Button role="button" onClick={this.play.bind(this)}><Icon name='play' /></Button>
              </ButtonGroup>
              <ButtonGroup size="lg">
              <Button role="button" onClick={this.pause.bind(this)}><Icon name='pause' /></Button>
              </ButtonGroup>
              <ButtonGroup size="lg">
              <Button role="button" onClick={this.next.bind(this)}><Icon name='forward' /></Button>
              </ButtonGroup>
            </div>
          </CardBlock>
        </Card>
        </Col>
      </Row>
    );
  }
}

export default Player;