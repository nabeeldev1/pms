import React, { Component } from 'react';
import Column from '../Column/Column';
import { DragDropContext } from 'react-beautiful-dnd';
import classes from './Dashboard.css';
import Modal from 'react-modal';
import  { getData } from '../../Server/Server';

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
    }

    componentDidMount() {
        if(this.getInitialData()) {
            this.setState(this.getInitialData());
            this.setState({isDataLoaded : true});
        }
    }

    getInitialData() {
        return getData();
    }

    onDragEnd = result => {
        const { destination, source, draggableId } = result;

        if(!destination) {
            return;
        }

        if(destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }

        const start = this.state.columns[source.droppableId];
        const finish = this.state.columns[destination.droppableId];

        if(start === finish) {
            const newTaskIds = Array.from(start.taskIds);
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
        event.preventDefault();
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
            tasks: allTasks
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

    render() {
        let isData = this.state.isDataLoaded;
        let dragDrop;
        if(isData) {
            dragDrop = <DragDropContext onDragEnd={this.onDragEnd}>
                <h3 style={{ margin:'0 0 0 5px' }}>Dashboard</h3>
                <div className={classes.Container}>
                    {this.state.columnOrder.map(columnId => {
                        const column = this.state.columns[columnId];
                        const tasks = column.taskIds.map(taskId => this.state.tasks[taskId]);
                        
                        return <Column key={column.id} column={column} tasks={tasks} />;
                    })}
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
                    contentLabel="Example Modal"
                >
                    <h2 ref={subtitle => this.subtitle = subtitle}>Add Task</h2>
                    <form onSubmit={this.addTask}>
                        <label>Description: </label>
                        <input type="text" id="newTask" name="newTask" placeholder="Task description..." />
                        <input type="submit" value="save" />
                        <input type="button" value="close" onClick={this.closeModal} />
                    </form>
                </Modal>               
            </div>
        ); 
    }
}

export default Dashboard;
