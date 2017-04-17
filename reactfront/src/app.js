import React, { Component } from 'react';
import { Col, Row } from 'reactstrap';
import Player from './components/player';
import SearchBar from './components/searchbar';
import Queue from './components/queue';

class App extends Component {
  render() {
    return (
      <Row className="justify-content-md-center">
        <Col lg="6">
          <h2 className="my-3">hqplayer</h2>
          <Player />
          <SearchBar />
          <Queue />
        </Col>
      </Row>
    );
  }
}

export default App;
