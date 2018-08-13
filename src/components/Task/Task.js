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
                    {this.props.task.content}
                </Container>
            )}
            </Draggable>
        );
    }
}