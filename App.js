import React from 'react';
import { ListView, StyleSheet, View } from 'react-native';
import { Body, Title, Right, Container, Header, Content, Button, Icon, List, ListItem, Text } from 'native-base';

export default class App extends React.Component {
  constructor() {
    super();
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      locations: []
    }
  }

  // Retrieve the list of locations from Airtable
  getLocations() {
    // Airtable API endpoint, replace with your own
    let airtableUrl = "https://api.airtable.com/v0/appDMkeB0lsPmt29d/locations?&view=Grid%20view";

    // Needed for Airtable authorization, replace with your own API key
    let requestOptions = {
      headers: new Headers({
        'Authorization': 'Bearer keyx2MkhJ4cgV6ixs'
      })
    };

    // Form the request
    let request = new Request(airtableUrl, requestOptions);

    // Make the request
    fetch(request).then(response => response.json()).then(json => {
      this.setState({
        locations: json.records
      });
    });
  }

  // Runs when the application loads (i.e. the "App" component "mounts")
  componentDidMount() {
    this.getLocations(); // refresh the list when we're done
  }

  // Upvote an location
  upvoteLocation(data, secId, rowId, rowMap) {
    // Slide the row back into place
    rowMap[`${secId}${rowId}`].props.closeRow();

    // Airtable API endpoint
    let airtableUrl = "https://api.airtable.com/v0/appDMkeB0lsPmt29d/locations/" + data.id;

    // Needed for Airtable authorization
    let requestOptions = {
      method: 'PATCH',
      headers: new Headers({
        'Authorization': 'Bearer keyx2MkhJ4cgV6ixs', // replace with your own API key
        'Content-type': 'application/json'
      }),
      body: JSON.stringify({
        fields: {
          votes: data.fields.votes + 1
        }
      })
    };

    // Form the request
    let request = new Request(airtableUrl, requestOptions);

    // Make the request
    fetch(request).then(response => response.json()).then(json => {
      this.getLocations(); // refresh the list when we're done
    });
  }

  // Downvote a location
  downvoteLocation(data, secId, rowId, rowMap) {
    // Slide the row back into place
    rowMap[`${secId}${rowId}`].props.closeRow();

    // Airtable API endpoint
    let airtableUrl = "https://api.airtable.com/v0/appDMkeB0lsPmt29d/locations/" + data.id;

    // Needed for Airtable authorization
    let requestOptions = {
      method: 'PATCH',
      headers: new Headers({
        'Authorization': 'Bearer keyx2MkhJ4cgV6ixs', // replace with your own API key
        'Content-type': 'application/json'
      }),
      body: JSON.stringify({
        fields: {
          votes: data.fields.votes - 1
        }
      })
    };

    // Form the request
    let request = new Request(airtableUrl, requestOptions);

    // Make the request
    fetch(request).then(response => response.json()).then(json => {
      this.getLocations(); // refresh the list when we're done
    });
  }

  // Ignore an location
  ignoreLocation(data, secId, rowId, rowMap) {
    // Slide the row back into place
    rowMap[`${secId}${rowId}`].props.closeRow();

    // Create a new array that has the location removed
    let newLocationsData = this.state.locations.slice();
    newLocationsData.splice(rowId, 1);

    // Set state
    this.setState({
      locations: newLocationsData
    });
  }

  // Delete an location
  deleteLocation(data, secId, rowId, rowMap) {
    // Slide the row back into place
    rowMap[`${secId}${rowId}`].props.closeRow();

    // Create a new array that has the location removed
    let newLocationsData = this.state.locations.slice();
    newLocationsData.splice(rowId, 1);

    // Airtable API endpoint
    let airtableUrl = "https://api.airtable.com/v0/appDMkeB0lsPmt29d/locations/" + data.id;

    // Needed for Airtable authorization
    let requestOptions = {
      method: 'DELETE',
      headers: new Headers({
        'Authorization': 'Bearer keyx2MkhJ4cgV6ixs', // replace with your own API key
        'Content-type': 'application/json'
      })
    };

    // Form the request
    let request = new Request(airtableUrl, requestOptions);

    // Make the request
    fetch(request).then(response => response.json()).then(json => {
      this.getLocations(); // refresh the list when we're done
    });
  }

  // The UI for each row of data
  renderRow(data) {
    return (
      <ListItem style={{ paddingLeft: 20, paddingRight: 20 }}>
        <Body>
          <Text>{data.fields.description}</Text>
        </Body>
        <Right>
          <Text note>{data.fields.votes} votes</Text>
        </Right>
      </ListItem>
    )
  }

  // The UI for what appears when you swipe right
  renderSwipeRight(data, secId, rowId, rowMap) {
    return (
      <Button full success onPress={() => this.upvoteLocation(data, secId, rowId, rowMap)}>
        <Icon active name="thumbs-up" />
      </Button>
    )
  }

  // The UI for what appears when you swipe left
  renderSwipeLeft(data, secId, rowId, rowMap) {
    return (
      <Button full danger onPress={() => this.downvoteLocation(data, secId, rowId, rowMap)}>
        <Icon active name="thumbs-down" />
      </Button>
    )
  }

  render() {
    let rows = this.ds.cloneWithRows(this.state.locations);
    return (
      <Container>
        <Header>
          <Body>
            <Title>North America Ski Resorts</Title>
          </Body>
        </Header>
        <Content>
          <List
            dataSource={rows}
            renderRow={(data) => this.renderRow(data)}
            renderLeftHiddenRow={(data, secId, rowId, rowMap) => this.renderSwipeRight(data, secId, rowId, rowMap)}
            renderRightHiddenRow={(data, secId, rowId, rowMap) => this.renderSwipeLeft(data, secId, rowId, rowMap)}
            leftOpenValue={75}
            rightOpenValue={-75}
          />
        </Content>
      </Container>
    );
  }
}
