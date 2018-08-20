import React, { Component } from 'react';
import Column from '../Column/Column';
import { DragDropContext } from 'react-beautiful-dnd';
import classes from './Dashboard.css';
import Modal from 'react-modal';
// import  { getData } from '../../Server/Server';
import axios from 'axios';
import config from '../../config';

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

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.state.modalIsOpen = false;
        this.state.isDataLoaded = false;
        this.state.taskContent = '';
        this.state.taskId = '';
    }

    componentDidMount() {
        axios.get(config.BASE_URL + 'column-orders')
          .then(colResponse => {
            //   this.setState({ columnOrder: Response.data });
              axios.get(config.BASE_URL + 'tasks')
                .then(taskResponse => {
                    axios.get(config.BASE_URL + 'columns')
                        .then(columnResponse => {
                            // console.log(Response);
                            this.setState({ 
                                columnOrder: colResponse.data,
                                tasks: taskResponse.data,
                                columns: columnResponse.data,
                                isDataLoaded: true 
                            });
                        })
                        .catch(err => {
                            console.log(err);
                        });
                })
                .catch(err => {
                    console.log(err);
                });
            // console.log(Response);
          })
          .catch(err => {
            console.log(err);
        });
        
    }

    // getInitialData() {
    //     return getData();
    // }

    onDragEnd = result => {
        const { destination, source, draggableId } = result;
        // console.log(destination);
        // console.log(source);
        // console.log(draggableId);
        // console.log(this.state.columns);
        

        if(!destination) {
            return;
        }

        if(destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }

        let start, finish;
        for(let i=0; i < this.state.columns.length; i++) {
            if( this.state.columns[i]._id === source.droppableId ) {
                start = this.state.columns[i];
            }
            if( this.state.columns[i]._id === destination.droppableId ) {
                finish = this.state.columns[i];
            }
        }
        // const finish = this.state.columns[destination.droppableId];
        // console.log(finish);
        console.log('---Start---');
        console.log(start);
        console.log('---Finish---');
        console.log(finish);

        if(start === finish) {
            const newTaskIds = Array.from(start.taskIds);
            console.log('===newTaskIds===');
            console.log(newTaskIds);
            newTaskIds.splice(source.index, 1);
            newTaskIds.splice(destination.index,0, draggableId);

            const newColumn = {
                ...start,
                taskIds: newTaskIds,
            };

            const newState = {
                ...this.state,
                columns: {
                    ...this.state.columns,
                    [newColumn.id]: newColumn,
                },
            };

            this.setState(newState);
            return;
        }

        //Move to other Columns
        const startTaskIds = Array.from(start.taskIds);
        startTaskIds.splice(source.index,1);
        const newStart = {
            ...start,
            taskIds: startTaskIds,
        };

        const finishTaskIds = Array.from(finish.taskIds);
        finishTaskIds.splice(destination.index, 0, draggableId);
        const newFinish = {
            ...finish,
            taskIds: finishTaskIds,
        };

        const newState = {
            ...this.state,
            columns: {
                ...this.state.columns,
                [newStart.id]: newStart,
                [newFinish.id]: newFinish,
            },
        };

        this.setState(newState);   
        return;
    };

    //Generate Id for new task
    generateTaskId(columns) {
        let numberOfTasks = 0;
        let totalColumns = Object.keys( columns )
        .map( key => {
            return [...Array( columns[key].taskIds.length )];
        } );
        for(let i=0; i < totalColumns.length; i++) {
            numberOfTasks = totalColumns[i].length + numberOfTasks;
        }
        return numberOfTasks + 1;
    }

    //Add new task to "To do" column
    addTask = (event) => {
        // event.preventDefault();
        const taskContent = event.target.newTask.value;
        let columns = {...this.state.columns};
        let allTasks = {...this.state.tasks};
        
        let generatedTaskId = this.generateTaskId(columns);
        generatedTaskId = 'task-' + generatedTaskId; 
        //New task object to be added
        var key = generatedTaskId;
        let taskObj = {
            [key]: 
                {
                    id: generatedTaskId,
                    content: taskContent,
                    createdBy: "Nabeel"
                }
        };
        allTasks = Object.assign(allTasks, taskObj);
        columns["column-1"].taskIds.push(generatedTaskId);

        const newState = {
            ...this.state,
            columns: columns,
            tasks: allTasks,
            taskContent: ''
        };
        this.setState(newState);
        this.closeModal();
    }

    openModal = () => {
        this.setState({ modalIsOpen: true });
    }
     
    afterOpenModal = () => {
        this.subtitle.style.color = '#0079bf';
    }
     
    closeModal = () => {
        this.setState({ modalIsOpen: false });
    }

    componentWillMount() {
        Modal.setAppElement('body');
    }

    //Remove a particular task from column
    removeTaskHandler = (taskId, columnId) => {
        const selectedColumn = this.state.columns[columnId];
        const index = selectedColumn.taskIds.indexOf(taskId);
        if(index > -1) {
            selectedColumn.taskIds.splice(index, 1);
        }
        //Delete the task from Tasks array too
        delete this.state.tasks[taskId];

        const newState = {
            ...this.state,
        }
        this.setState(newState);
    }
    
    //update the state with the selected task's id and content
    updateTask = (taskId, content) => {
        this.setState({ taskId: taskId, taskContent: content });
        this.openModal();
    }

    updateTaskHandler = (event) => {
        const id = this.state.taskId;
        const newState = {
            ...this.state
        }
        newState.tasks[id].content = this.state.taskContent;
        this.setState({
            newState,
            taskId: '',
            taskContent: ''
        });
        this.closeModal();
    }

    handleChange = (event) => {
        this.setState({ taskContent: event.target.value });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        if(event.target.taskId.value) {
            this.updateTaskHandler(event);
        }
        else {
            this.addTask(event);
        }
    }

    render() {
        // console.log(this.state);
        let isData = this.state.isDataLoaded;
        let dragDrop;
        if(isData) {
            dragDrop = <DragDropContext onDragEnd={this.onDragEnd}>
                <div className={classes.Container}>
                    {
                        this.state.columnOrder[0].columnOrder.map((col, index) => {
                            if(this.state.columns[index]._id === col) {
                                const column = this.state.columns[index];
                                const tasks = column.taskIds.map((taskId, index) => { return this.state.tasks[index] });
                                return <Column 
                                            key={column._id} 
                                            column={column} 
                                            tasks={tasks} 
                                            updated={this.updateTask} 
                                            removed={this.removeTaskHandler}
                                        />;
                            }
                        })
                    }


                    {/* {this.state.columnOrder.map(columnId => {
                        const column = this.state.columns[columnId];
                        console.log('----Column----');
                        console.log(column);
                        const tasks = column.taskIds.map(taskId => this.state.tasks[taskId]);
                        
                        return <Column key={column.id} column={column} tasks={tasks} updated={this.updateTask} removed={this.removeTaskHandler} />;
                    })} */}
                </div>
                <div>
                    <button className={classes.AddButton} onClick={this.openModal}> Add Task </button>        
                </div>
            </DragDropContext>
        }
        else {
            dragDrop = <div>Loading...</div>
        }
        return (
            <div>
                {dragDrop}
                <Modal 
                    isOpen={this.state.modalIsOpen}
                    onAfterOpen={this.afterOpenModal}
                    onRequestClose={this.closeModal}
                    style={customStyles}
                    contentLabel="Add Task"
                >
                    <h2 ref={subtitle => this.subtitle = subtitle}>{this.state.taskId ? 'Edit Task' : 'Add Task'}</h2>
                    <form onSubmit={this.handleSubmit}>
                        <input type="hidden" id="taskId" name="taskId" value={this.state.taskId} />
                        <label>Description: </label>
                        <input className={classes.ModalInput} type="text" id="newTask" name="newTask" onChange={this.handleChange} value={this.state.taskContent} placeholder="Task description..." />
                        <input className={classes.ModalCancel} type="button" value="Cancel" onClick={this.closeModal} />
                        <input className={classes.ModalSubmit} type="submit" value="save" />
                    </form>
                </Modal>               
            </div>
        ); 
    }
}

export default Dashboard;
