import React, { Component } from 'react';
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';
import classes from './Task.css';
import Modal from 'react-modal';

const customStyles = {
    content : {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
  };

const Container = styled.div`
    margin-bottom: 8px;
    border 1px solid lightgrey;
    border-radius: 2px;
    padding: 8px;
    background-color:  ${props => (props.isDragging ? '#508bad' : 'white')};
    display: flex;
`;

export default class Task extends Component {
    openModal = () => {
        // this.setState({ modalIsOpen: true });
    }
     
    afterOpenModal = () => {
        this.subtitle.style.color = '#0079bf';
    }
     
    closeModal = () => {
        // this.setState({ modalIsOpen: false });
    }

    componentWillMount() {
        Modal.setAppElement('body');
    }

    render() {
        return (
            <Draggable draggableId={this.props.task.id} index={this.props.index}>
                {(provided, snapshot) => (
                <Container
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    innerRef={provided.innerRef}
                    isDragging={snapshot.isDragging}
                >
                <div className={classes.Handle} {...provided.dragHandleProps} />
                    <div>
                        <div>
                            {this.props.task.content}
                        </div>
                        <hr />
                        <div className={classes.Description}>
                            Performer: {this.props.task.createdBy}
                            <div className={classes.Icons}>
                                <i className="fa fa-edit"  onClick={this.openModal(this.props.task.content, this.props.task.id)}></i>
                                    &nbsp;&nbsp;&nbsp;&nbsp;
                                <i className="fa fa-trash" onClick={this.props.removeTask}></i>
                            </div>
                        </div>
                    </div>
                    <Modal 
                        isOpen={this.state.modalIsOpen}
                        onAfterOpen={this.afterOpenModal}
                        onRequestClose={this.closeModal}
                        style={customStyles}
                        contentLabel="Add Task"
                    >
                        <h2 ref={subtitle => this.subtitle = subtitle}>Add Task</h2>
                        <form onSubmit={this.addTask}>
                            <label>Description: </label>
                            <input type="text" id="newTask" name="newTask" placeholder="Task description..." />
                            <input type="submit" value="save" />
                            <input type="button" value="close" onClick={this.closeModal} />
                        </form>
                    </Modal>  
                </Container>
            )}
            </Draggable>
        );
    }
}