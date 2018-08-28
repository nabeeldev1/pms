import React, { Component } from 'react';
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';
import classes from './Task.css';

const Container = styled.div`
    margin-bottom: 8px;
    border 1px solid lightgrey;
    border-radius: 2px;
    padding: 8px;
    background-color:  ${props => (props.isDragging ? '#508bad' : 'white')};
    display: flex;
`;

export default class Task extends Component {
    render() {
        // console.log('-----Task-----');
        // console.log(this.props.task.content);
        return (
            <Draggable draggableId={this.props.task._id} index={this.props.index}>
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
                                <i className="fa fa-edit"  onClick={this.props.updateTask}></i>
                                    &nbsp;&nbsp;&nbsp;&nbsp;
                                <i className="fa fa-trash" onClick={this.props.removeTask}></i>
                            </div>
                        </div>
                    </div>
                </Container>
            )}
            </Draggable>
        );
    }
}