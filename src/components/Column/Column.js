import React, { Component } from 'react';
import styled from 'styled-components';
import Task from '../Task/Task';
import { Droppable } from 'react-beautiful-dnd';
import classes from './Column.css';

const Container = styled.div`
    margin: 8px;
    border 1px solid lightgrey;
    border-radius: 2px;
    width: 220px;

    display: flex;
    flex-direction: column;
    background-color: lightgrey;
    overflow-y: scroll;
    max-height: 650px;
`;

const TaskList = styled.div`
    padding: 8px;
    transition: background-color 0.2s ease;
    background-color:  ${props => (props.isDraggingOver ? 'skyblue' : 'white')};
    flex-grow: 1;
    min-height: 100px;
`;

class Column extends Component {
    render() {
        return (
            <Container>
                <div className={classes.Title}>{this.props.column.title}</div>
                <Droppable droppableId={this.props.column.id}>
                    {(provided, snapshot) => (
                        <TaskList
                            innerRef={provided.innerRef} 
                            {...provided.droppableProps}
                            isDraggingOver={snapshot.isDraggingOver}
                        >
                            {this.props.tasks.map((task, index) => <Task index={index} key={task.id} task={task} />)}
                            {provided.placeholder}
                        </TaskList>
                    )}
                </Droppable>
            </Container>    
        );
    }
}

export default Column;