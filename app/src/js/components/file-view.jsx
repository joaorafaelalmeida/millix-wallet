import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {Button, Col, Row} from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {MDBDataTable as DataTable} from 'mdbreact';
import {useDropzone} from 'react-dropzone';

const styles = {
    centered: {
        display       : 'flex',
        justifyContent: 'center'
    },
    left    : {
        display       : 'flex',
        justifyContent: 'left'
    }
};


function Dropzone(props) {
    const {
              acceptedFiles,
              getRootProps,
              getInputProps
          } = useDropzone();

    const files = acceptedFiles.map(file => (
        <li key={file.path}>
            {file.path} - {file.size} bytes
        </li>
    ));

    return (
        <div>
            <div className={'panel panel-filled'}>
                <div className={'panel-heading'}>upload files</div>
                <hr className={'hrPanel'}/>
                <div className={'panel-body'}>
                    <Row>
                        <div {...getRootProps({className: 'dropzone panel panel-filled panel-body'})}>
                            <input {...getInputProps()} />
                            <div style={styles.centered}>
                                <FontAwesomeIcon icon="upload" size="2x"/>
                            </div>
                            <div style={styles.centered}>
                                <p>Drag 'n' drop some files here, or click to
                                    select files</p>
                            </div>
                        </div>
                    </Row>
                    <Row>
                        <h4>Files</h4>
                        <ul>{files}</ul>
                    </Row>
                    <Row className="mb-3 mt-3">
                        <Col className="pr-0" style={{
                            display       : 'flex',
                            justifyContent: 'flex-end'
                        }}>
                            <Button variant="light"
                                    style={{width: 150}}
                                    className={'btn btn-w-md btn-accent'}
                                    onClick={() => {
                                    }}>
                                upload
                            </Button>
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    );
}


class FileView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            peer_list: {
                node_online_list : new Set(),
                node_offline_list: new Set(),
                columns          : [
                    {
                        label: '#',
                        field: 'node_idx',
                        width: 150
                    },
                    {
                        label: [
                            <FontAwesomeIcon icon="microchip" size="1x"/>,
                            ' node'
                        ],
                        field: 'node_url',
                        width: 270
                    },
                    {
                        label: [
                            <FontAwesomeIcon icon="power-off" size="1x"/>,
                            ' status'
                        ],
                        field: 'node_status',
                        width: 270
                    }
                ],
                rows             : []
            }
        };
    }

    componentWillReceiveProps(nextProps, nextContext) {
        let shouldUpdate    = false;
        let onlineNodeList  = new Set();
        let offlineNodeList = new Set();
        let peerList        = [];
        this.props.network.node_online_list.forEach((item, idx) => {
            if (!this.state.peer_list.node_online_list.has(item.nodeID)) {
                shouldUpdate = true;
            }
            onlineNodeList.add(item.nodeID);
            peerList.push({
                clickEvent : () => this.props.history.push('/peer/' + item.nodeID, {peer: item.nodeID}),
                node_idx   : idx,
                node_url   : item.node,
                node_status: 'up'
            });
        });
        this.props.network.node_offline_list.map((item, idx) => {
            if (!this.state.peer_list.node_offline_list.has(item.nodeID)) {
                shouldUpdate = true;
            }
            offlineNodeList.add(item.nodeID);
            peerList.push({
                clickEvent : () => this.props.history.push('/peer/' + item.nodeID, {peer: item.nodeID}),
                node_idx   : this.props.network.node_list.length + idx,
                node_url   : item.node,
                node_status: 'down'
            });
        });
        if (shouldUpdate) {
            this.setState({
                peer_list: {
                    columns          : [...this.state.peer_list.columns],
                    node_online_list : onlineNodeList,
                    node_offline_list: offlineNodeList,
                    rows             : peerList
                }
            });
        }
    }

    componentDidMount() {
    }

    render() {

        return (
            <div>
                <Dropzone/>
                <div className={'panel panel-filled'}>
                    <div className={'panel-heading'}>my files</div>
                    <hr className={'hrPanel'}/>
                    <div className={'panel-body'}>
                        <Row>
                            <DataTable striped bordered small hover
                                       info={false}
                                       entries={10}
                                       entriesOptions={[
                                           10,
                                           30,
                                           50
                                       ]}
                                       data={this.state.peer_list}/>
                        </Row>
                    </div>
                </div>
            </div>
        );
    }
}


export default connect(
    state => ({
        network: state.network
    })
)(withRouter(FileView));
