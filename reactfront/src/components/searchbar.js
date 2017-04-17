import React, { Component } from 'react';
import axios from 'axios';
import {
  Button, Form, Input, InputGroup, InputGroupButton
} from 'reactstrap';
import { Icon } from 'react-fa'

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      loading: false
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value})
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({loading: true})
    axios.post('/queue', {
      url: this.state.value
    }).then(response => {
      this.setState({value: '', loading: false})
    }).catch(err => {
      this.setState({value: err, loading: false})
    })
  }

  spinner() {
    return (
      <Icon name='spinner' pulse />
    );
  }

  render() {
    return (
      <div className="mb-3">
        <Form onSubmit={this.handleSubmit}>
          <InputGroup>
            <Input type="text" value={this.state.value} onChange={this.handleChange} />
            <InputGroupButton>
              <Button type="submit" color="secondary">{this.state.loading ? this.spinner() : 'Add'}</Button>
            </InputGroupButton>
          </InputGroup>
        </Form>
      </div>
    )
  }
}

export default SearchBar;