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
    background-color: white;
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
        // console.log('----props-tasks-----');
        // console.log(this.props.tasks);
        return (
            <Container>
                <div className={classes.Title}><b>{this.props.column.title}</b></div>
                <Droppable droppableId={this.props.column._id}>
                    {(provided, snapshot) => (
                        <TaskList
                            innerRef={provided.innerRef} 
                            {...provided.droppableProps}
                            isDraggingOver={snapshot.isDraggingOver}
                        >
                            {this.props.tasks.map((task, index) =>  <Task index={index} key={task._id} task={task} updateTask={() => this.props.updated(task._id, task.content)} removeTask={() => this.props.removed(task._id, this.props.column._id)} />)}
                            {provided.placeholder}
                        </TaskList>
                    )}
                </Droppable>
            </Container>    
        );
    }
}

export default Column;