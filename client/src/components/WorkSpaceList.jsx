import React, { Component } from 'react';
import { Alert, Row, Col } from 'reactstrap';
import WorkSpaceEntry from './WorkSpaceEntry.jsx';
import CreateWorkSpace from './CreateWorkSpace.jsx';
import PropTypes from 'prop-types';

//Container for all workspaces
export default class WorkSpaceList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      workSpaceQuery: '',
      //createFail usually happens if a workspace already exists
      createFail: false,
    };
    this.handleFail = this.handleFail.bind(this);
    this.getWorkSpaceQuery = this.getWorkSpaceQuery.bind(this);
    this.createWorkSpace = this.createWorkSpace.bind(this);
  }

  //grabs the value from the input field
  getWorkSpaceQuery(query) {
    this.setState({ workSpaceQuery: query });
  }

  //posts the query to the server that results in a success or failed creation
  createWorkSpace() {
    let { loadWorkSpaces } = this.props;
    let { workSpaceQuery, createFail } = this.state;
    this.setState({ createFail: false });
    if (workSpaceQuery.length > 0) {
      fetch('/workspaces', {
        method: 'POST',
        body: JSON.stringify({ name: workSpaceQuery }),
        headers: { 'content-type': 'application/json' },
      })
        .then(resp => (resp.status === 201 ? loadWorkSpaces() : this.setState({ createFail: true })))
        .catch(console.error);
    }
  }

  //helper for createWorkSpace
  handleFail() {
    this.setState({ createFail: false });
  }
  //renders everything to do with workspaces, including creation
  render() {
    let { changeCurrentWorkSpace, currentWorkSpaceId, workSpaces, username, currentWorkSpaceName } = this.props;
    let { createFail, createStatus, workSpaceQuery } = this.state;
    return (
      <div className="workSpaces">
        <Row>
          <Col>
            <h4 className="workSpace-header"> Workspaces </h4>{' '}
          </Col>
          <CreateWorkSpace
            getWorkSpaceQuery={this.getWorkSpaceQuery}
            createWorkSpace={this.createWorkSpace}
          />
        </Row>
        {workSpaces.map((workSpace) => {
          if (workSpace.name.includes('-')) {
            let users = workSpace.name.split('-');
            if (username === users[0] || username === users[1]) {
              return (<WorkSpaceEntry
                workSpace={workSpace}
                handleFail={() => this.handleFail}
                key={workSpace.id}
                changeCurrentWorkSpace={changeCurrentWorkSpace}
                currentWorkSpaceId={currentWorkSpaceId}
              />);
            }
          } else {
            return (<WorkSpaceEntry
              workSpace={workSpace}
              handleFail={() => this.handleFail}
              key={workSpace.id}
              changeCurrentWorkSpace={changeCurrentWorkSpace}
              currentWorkSpaceId={currentWorkSpaceId}
            />
            );
          }
        })}
        <br />
        {createFail ? <Alert color="danger"> Failed to create workspace </Alert> : undefined}
      </div>
    );
  }
}
//required prop types
WorkSpaceList.propTypes = {
  workSpaces: PropTypes.array,
  currentWorkSpaceId: PropTypes.number,
}