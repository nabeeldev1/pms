import React, { Component } from 'react';
import Column from '../Column/Column';
import { DragDropContext } from 'react-beautiful-dnd';
import classes from './Dashboard.css';
import Modal from 'react-modal';
// import  { getData } from '../../Server/Server';
import axios from 'axios';
import config from '../../config';
import { getHeaders } from '../../Utils/Auth/Auth'; 
import Snackbar from '../../UI/Snackbar/Snackbar';

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
        this.state.message = '';
        this.state.snackbarShow = false;
    }

    componentDidMount() {
        const headers = getHeaders();
        axios.get(config.BASE_URL + 'column-orders', {headers})
          .then(colResponse => {
              axios.get(config.BASE_URL + 'tasks', {headers})
                .then(taskResponse => {
                    axios.get(config.BASE_URL + 'columns', {headers})
                        .then(columnResponse => {
                            this.setState({ 
                                columnOrder: colResponse.data,
                                tasks: taskResponse.data,
                                columns: columnResponse.data,
                                isDataLoaded: true 
                            });
                        })
                        .catch(err => {
                            this.myFunction(err.response.data.message);
                        });
                })
                .catch(err => {
                    this.myFunction(err.response.data.message);
                });
          })
          .catch(err => {
            this.myFunction(err.response.data.message);
        });
    }

    onDragEnd = result => {
        const { destination, source, draggableId } = result;
        const headers = getHeaders();
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
        const data = {
            start: start._id,
            finish: finish._id,
            taskId: draggableId
        };
        axios.post(config.BASE_URL + 'tasks/drag/', data, {headers})
            .then(Response => {
                const newState = {
                    ...this.state,
                    columns: Response.data
                };
                this.setState(newState);
            })
            .catch(err => {
                this.myFunction(err.response.data.message);
            });
    };

    //Add new task to "To do" column
    addTask = (event) => {
        let newState = {};
        let taskArray = [...this.state.tasks];
        let columnsArray = [...this.state.columns];
        const task = {
            "content": event.target.newTask.value,
            "createdBy": "Nabeel" 
        };

        const headers = getHeaders();
        axios.post(config.BASE_URL + 'tasks/add', task, {headers})
            .then(Response => {
                taskArray.push(Response.data.taskResponse);
                columnsArray[0].taskIds = Response.data.columnResponse.taskIds;

                newState = {
                    ...this.state,
                    columns: columnsArray,
                    tasks: taskArray,
                    taskId: '',
                    taskContent: ''
                };
                this.setState(newState);
            })
            .catch(err => {
                this.setState({ taskContent: '', taskId: '' });
                this.myFunction(err.response.data.message);
            });
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
        const headers = getHeaders();
        axios.delete(config.BASE_URL + 'tasks/' + taskId + '/' + columnId, {headers})
            .then(Response => {
                let newState = {
                    ...this.state
                };
                newState.columns.map((column, index) => {
                    if(column._id === columnId) {
                        newState.columns[index] = Response.data.columnResponse;
                        newState.tasks = Response.data.taskResponse;
                    }
                    return 1;
                });
                this.setState(newState);
            })
            .catch(err => {
                this.myFunction(err.response.data.message);
            });
    }
    
    //update the state with the selected task's id and content
    updateTask = (taskId, content) => {
        this.setState({ taskId: taskId, taskContent: content });
        this.openModal();
    }

    updateTaskHandler = (event) => {
        const id = this.state.taskId;
        const taskContent = { content : this.state.taskContent };
        let taskArray = this.state.tasks;
        const headers = getHeaders();
        axios.put(config.BASE_URL + 'tasks/' + id, taskContent, {headers})
            .then(Response => {
                this.state.tasks.map((task, index) => {
                    if(task._id === id) {                
                        taskArray[index].content = Response.data.content;
                        let newState = {
                            ...this.state,
                            tasks: taskArray,
                            taskContent: '',
                            taskId: ''
                        };
                        this.setState(newState);        
                    }
                    return 1;
                });
            })
            .catch(err => {
                this.setState({ taskContent: '', taskId: '' });
                this.myFunction(err.response.data.message);
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

    myFunction = (message) => {
        this.setState({
            message: message,
            snackbarShow: true
        });
        this.delayState();
    }

    delayState = () => {
        setTimeout(() => {
            this.setState({
                message: '',
                snackbarShow: false
            })
        }, 3000);
    }

    render() {
        let isData = this.state.isDataLoaded;
        let dragDrop;
        if(isData) {
            dragDrop = <DragDropContext onDragEnd={this.onDragEnd}>
                <div className={classes.Container}>
                    {
                        this.state.columnOrder[0].columnOrder.map((col, index) => {
                            if(this.state.columns[index]._id === col) {
                                const column = this.state.columns[index];
                                let tasks = [];
                                column.taskIds.map(taskId => {
                                    this.state.tasks.map(task => {
                                        if(task._id === taskId) {
                                            tasks.push(task);
                                        }
                                        return 1;
                                    });  
                                    return 1;         
                                });
                                return <Column 
                                            key={column._id} 
                                            column={column} 
                                            tasks={tasks} 
                                            updated={this.updateTask} 
                                            removed={this.removeTaskHandler}
                                        />;
                            }
                            return 1;
                        })
                    }
                </div>
                <Snackbar snackbarShow={this.state.snackbarShow} message={this.state.message} />
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
