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
        console.log('------2-Did-Mount-------');
        axios.get(config.BASE_URL + 'column-orders')
          .then(colResponse => {
              axios.get(config.BASE_URL + 'tasks')
                .then(taskResponse => {
                    axios.get(config.BASE_URL + 'columns')
                        .then(columnResponse => {
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
          })
          .catch(err => {
            console.log(err);
        });

        console.log('--------3-State--------');
        console.log(this.state);
    }

    onDragEnd = result => {
        const { destination, source, draggableId } = result;

        if(!destination) {
            return;
        }

        if(destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }

        // console.log(source);

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
        // console.log('---Start---');
        // console.log(start);
        // console.log('---Finish---');
        // console.log(finish);

        const data = {
            start: start._id,
            finish: finish._id,
            taskId: draggableId
        };
        axios.post(config.BASE_URL + 'tasks/drag/', data)
            .then(Response => {
                console.log(Response);
                const newState = {
                    ...this.state,
                    columns: Response.data
                };
                console.log('------newState---------');
                console.log(newState);
                console.log('-----------------------');
                this.setState(newState);
            })
            .catch(err => {
                console.log(err);
            });

        // if(start === finish) {
        //     const newTaskIds = Array.from(start.taskIds);
        //     console.log('===newTaskIds===');
        //     console.log(newTaskIds);
        //     newTaskIds.splice(source.index, 1);
        //     newTaskIds.splice(destination.index,0, draggableId);

        //     const newColumn = {
        //         ...start,
        //         taskIds: newTaskIds,
        //     };

        //     const newState = {
        //         ...this.state,
        //         columns: {
        //             ...this.state.columns,
        //             [newColumn.id]: newColumn,
        //         },
        //     };

        //     this.setState(newState);
        //     return;
        // }

        //Move to other Columns
        // const startTaskIds = Array.from(start.taskIds);
        // console.log('---startTaskIds---');
        // console.log(startTaskIds);
        // startTaskIds.splice(source.index,1);
        // const newStart = {
        //     ...start,
        //     taskIds: startTaskIds,
        // };
        // console.log('----new-start----');
        // console.log(newStart);

        // const finishTaskIds = Array.from(finish.taskIds);
        // console.log('---finishTaskIds---');
        // console.log(finishTaskIds);
        // finishTaskIds.splice(destination.index, 0, draggableId);
        // const newFinish = {
        //     ...finish,
        //     taskIds: finishTaskIds,
        // };

        // console.log('----new-finish----');
        // console.log(newFinish);


        // const newState = {
        //     ...this.state,
        //     columns: {
        //         ...this.state.columns,
        //         [newStart._id]: newStart,
        //         [newFinish._id]: newFinish,
        //     },
        // };
        // console.log('--------current-state--------');
        // console.log(newState);

        // this.setState(newState);   
        // return;
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

        axios.post(config.BASE_URL + 'tasks/add', task)
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
                console.log(err);
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
        axios.delete(config.BASE_URL + 'tasks/' + taskId + '/' + columnId)
            .then(Response => {
                let newState = {
                    ...this.state
                };
                newState.columns.map((column, index) => {
                    if(column._id === columnId) {
                        newState.columns[index] = Response.data.columnResponse;
                        newState.tasks = Response.data.taskResponse;
                    }
                });
                this.setState(newState);
            })
            .catch(err => {
                console.log(err);
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
        axios.put(config.BASE_URL + 'tasks/' + id, taskContent)
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
                });
            })
            .catch(err => {
                console.log(err);
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
        let isData = this.state.isDataLoaded;
        let dragDrop;
        // console.log('------1-Render-State------');
        // console.log(this.state);
        // console.log('-------------------------');
        if(isData) {
            dragDrop = <DragDropContext onDragEnd={this.onDragEnd}>
                <div className={classes.Container}>
                    {
                        this.state.columnOrder[0].columnOrder.map((col, index) => {
                            // console.log(col);
                            if(this.state.columns[index]._id === col) {
                                console.log(`Index : ${index}`)
                                const column = this.state.columns[index];
                                console.log(column);
                                const tasks = column.taskIds.map((taskId, taskIndex) => { 
                                    console.log(taskIndex);
                                    console.log(this.state.tasks[taskIndex]);
                                    console.log('==========================');
                                    return this.state.tasks[taskIndex] 
                                });
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
