import React, {Component} from 'react'

function Department(props) {
    return (
        <div>
            {"Название: "+props.value.department.name}
            <br/>
            {"Количество сотрудников: "+props.value.department.workersCount}
            <br/>
            {"Максимальная з/п сотрудников: "+props.value.department.maxSalary}
            <br/>
            <button onClick={(evt)=>props.onEditClick(evt, props.value.index)}>
                {'Редактировать'}
            </button>
            <button onClick={(evt)=>props.onDeleteClick(evt, props.value.index)}>
                {'Удалить'}
            </button>
        </div>
    );
}

function Worker(props) {
    return (
        <div>
            {"Имя: "+props.value.worker.name}
            <br/>
            {"Фамилия: "+props.value.worker.family}
            <br/>
            {"Отчество: "+props.value.worker.patronymic}
            <br/>
            {"Пол: "+props.value.worker.sex}
            <br/>
            {"З/п: "+props.value.worker.salary}
            <br/>
            {"Отделы: "+props.value.worker.departments}
            <br/>
            <button onClick={(evt)=>props.onEditClick(evt, props.value.index)}>
                {'Редактировать'}
            </button>
            <button onClick={(evt)=>props.onDeleteClick(evt, props.value.index)}>
                {'Удалить'}
            </button>
        </div>
    );
}


export default class Game extends Component {
    constructor(props) {
        super(props);
        this.state = props.state;
    }

    onAddDepartmentSubmit(evt) {
        if (evt.target.newDep.value!=="") {
            this.setState({
                ...this.state,
                departments: [
                    ...this.state.departments,
                    {
                        name: evt.target.newDep.value,
                        maxSalary: 0,
                        workersCount: 0
                    }
                ]
            });
        }
        evt.preventDefault();
    }

    onEditDepartmentSubmit(evt) {
        if (this.state.departments[this.state.currentEditDepartment]!==undefined)
        {

            //когда нажимаем "изменить отдел" - имя отдела изменяется и для каждого сотрудника
            let newWrksArr = this.state.workers.slice();
            newWrksArr.forEach((worker, index)=>{
                let depIndex = newWrksArr[index].departments.findIndex((item, index)=>{
                    return (item===this.state.departments[this.state.currentEditDepartment].name)
                });
                if (depIndex!==-1)
                {
                    newWrksArr[index].departments[depIndex]=evt.target.editDep.value;
                }
            });
            console.log(newWrksArr);

            let newDeps = this.state.departments;
            newDeps[this.state.currentEditDepartment].name = evt.target.editDep.value;

            if (evt.target.editDep.value!=="") {
                this.setState({
                    ...this.state,
                    departments: newDeps,
                    workers: newWrksArr
                });
            }
        }
        evt.preventDefault();
    }

    editDepClick(evt, index) {
        console.log('edit'+index);
        this.setState({
            ...this.state,
            currentEditDepartment: index
        });
    }

    deleteDepClick(evt, index) {
        let newDepArr = this.state.departments.slice();
        newDepArr.splice(index,1);

        //когда нажимаем "удалить отдел" - удаляется этот отдел если он в нем
        //состоит и в данных для каждого сотрудника
        let newWrksArr = this.state.workers.slice();
        newWrksArr.forEach((worker, index)=>{
            newWrksArr[index].departments=newWrksArr[index].departments.filter((dep)=>{
                return newDepArr.some((newDep)=>{
                    return (newDep.name===dep)
                });
            });
        });

        this.setState({
            ...this.state,
            departments: [
                ...newDepArr
            ],
            workers: [
                ...newWrksArr
            ]
        });
    }

    renderDepartment(department, index) {

        return (
            <Department
                value={{department, index}}
                onEditClick={evt => this.editDepClick(evt, index)}
                onDeleteClick={evt => this.deleteDepClick(evt, index)}
            />
        );

    }

    onAddWorkerSubmit(evt){
        if (evt.target.newWrkName.value!=="") {


            let options = evt.target.newWrkDepartments.options;
            let departments = [];

            for (var i = 0, l = options.length; i < l; i++) {
                if (options[i].selected) {
                    departments.push(options[i].value);
                }
            }

            this.setState({
                ...this.state,
                workers: [
                    ...this.state.workers,
                    {
                        name: evt.target.newWrkName.value,
                        family: evt.target.newWrkFamily.value,
                        patronymic: evt.target.newWrkPatronymic.value,
                        sex: (evt.target.newWrkSex.value===0)?'М':'Ж',
                        salary: evt.target.newWrkSalary.value,
                        departments: departments
                    }
                ]
            });
        }
        evt.preventDefault();
    }

    onEditWorkerSubmit(evt) {
        if (this.state.workers[this.state.currentEditWorker.index]!==undefined) {
            if (evt.target.editWrkName.value !== "") {
                let options = evt.target.editWrkDepartments.options;
                let departments = [];

                for (var i = 0, l = options.length; i < l; i++) {
                    if (options[i].selected) {
                        departments.push(options[i].value);
                    }
                }

                let newWorkers = this.state.workers;
                newWorkers[this.state.currentEditWorker.index] = {
                    name: evt.target.editWrkName.value,
                    family: evt.target.editWrkFamily.value,
                    patronymic: evt.target.editWrkPatronymic.value,
                    sex: (evt.target.editWrkSex.value === 0) ? 'М' : 'Ж',
                    salary: evt.target.editWrkSalary.value,
                    departments: departments
                };
                //Залили обновленные данные в переменную которая пойдет в сетстейт


                this.setState({
                    ...this.state,
                    workers: newWorkers
                });

            }
        }
        evt.preventDefault();
    }

    onDepartmentsChanged(evt) {
        let options = evt.target.options;
        let deps = [];

        for (let i = 0, l = options.length; i < l; i++) {
            if (options[i].selected) {
                deps.push(options[i].value);
            }
        }
        this.setState({
                ...this.state,
                currentEditWorker:{
                    ...this.state.currentEditWorker,
                    currentSelectDepartmentsOptions: deps
                }
            });
    }

    editWrkClick(evt, index) {
        console.log('edit'+index);
        //Устанавливаем стор дл ятекущего мультиселекта с отделами
        //в те значения, которые есть у данного сотрудника
        this.setState({
            ...this.state,
            currentEditWorker: {
                currentSelectDepartmentsOptions: this.state.workers[this.state.currentEditWorker.index].departments,
                index: index
            }
        });
    }

    deleteWrkClick(evt, index) {
        let newWrksArr = this.state.workers.slice();
        newWrksArr.splice(index,1);
        this.setState({
            ...this.state,
            workers: [
                ...newWrksArr
            ]
        });
    }

    renderWorker(worker, index) {
        return (
            <Worker
                value={{worker, index}}
                onEditClick={evt => this.editWrkClick(evt, index)}
                onDeleteClick={evt => this.deleteWrkClick(evt, index)}
            />
        );

    }

    render() {

        //Это для сетки
        let deps = this.state.departments.map((dep, index)=>{
            return (
                <td key={index}>
                    {dep.name}
                    <br/>
                </td>
            );
        });

        //Это для сетки
        let workersGridPluses = (workerIndex)=>{
            return (this.state.departments.map((dep, index)=>{
                return (
                    <td key={index}>
                        {this.state.workers[workerIndex].departments.includes(dep.name)?"+":"-"}
                    </td>
                );
            }));
        }

        //Это для сетки сотрудников
        let workersGrid = this.state.workers.map((worker, index)=>{
            return (
                <tr key={index}>
                    <td>
                        {worker.name}
                        {worker.family}
                    </td>
                    {workersGridPluses(index)}
                </tr>
            );
        });

        //это для списка отделов
        const departments = this.state.departments.map((dep, index) => {
            return (
                <div key={index}>
                    {this.renderDepartment(dep, index)}
                    <br/>
                </div>
            );
        });

        //это особая уличная магия для мультиселекта
        const departmentsLikeOptions = this.state.departments.map((dep, index) => {
            return (
                <option key={index}
                        value={dep.name}>
                    {dep.name}
                </option>
            );
        });

        //Это вывод текущего редактируемого отдела
        let currentDepEditName = (this.state.departments.length!==0)?
            this.state.departments[this.state.currentEditDepartment].name:"Нет ни одного отдела";

        //Это для рендера списка сотрудников
        const workers = this.state.workers.map((worker, index) => {
            return (
                <div key={index}>
                    {this.renderWorker(worker, index)}
                    <br/>
                </div>
            );
        });

        //Это для вывода текущего редактируемого сотрудника
        let currentWrkEditName = (this.state.workers.length!==0)?
            this.state.workers[this.state.currentEditWorker.index].name:"Нет ни одного сотрудника";

        return (
            <div>
                <div className="game-board">

                    <table border="1">
                        <tbody>
                        <tr>
                            <td></td>
                            {deps}
                        </tr>
                        {workersGrid}
                        </tbody>
                    </table>

                </div>
                <br/>

                <div className="game-departments">Отделы:
                    <br/>
                    <div className="game-departments-view">
                        <div>{departments}</div>
                    </div>

                    <div className="game-departments-add">
                        <form onSubmit={(evt)=>this.onAddDepartmentSubmit(evt)}>
                            <input type="text" name="newDep" placeholder={"Название отдела"}/>
                            <input type={"submit"} value={'Добавить'} />
                        </form>
                    </div>

                    <div className="game-departments-edit">
                        <div>
                            {currentDepEditName}
                        </div>
                        <br/>
                        <form onSubmit={(evt)=>this.onEditDepartmentSubmit(evt)}>
                            Название:<br/>
                            <input type="text" name="editDep" placeholder={"Отдел"}/>
                            <input type={"submit"} value={'Изменить'} />
                        </form>
                    </div>
                </div>
                <br/>

                <div className="game-workers">Сотрудники:
                    <br/>
                    <div className="game-workers-view">
                        <div>{workers}</div>
                    </div>

                    <div className="game-workers-add">

                        <form onSubmit={(evt)=>this.onAddWorkerSubmit(evt)}>
                            <input type="text" name="newWrkName" placeholder={"Имя"}/>
                            <input type="text" name="newWrkFamily" placeholder={"Фамилия"}/>
                            <input type="text" name="newWrkPatronymic" placeholder={"Отчество"}/>
                            <div>
                                <input type="radio" id={"radioM"}
                                       name="newWrkSex" value={0}
                                />
                                <label htmlFor="radioM">Мужской</label>

                                <input type="radio" id={"radioF"}
                                       name="newWrkSex" value={1}
                                />
                                <label htmlFor="radioF">Женский</label>

                            </div>

                            <input type="text" name="newWrkSalary" placeholder={"З/п"}/>
                            <select multiple={true} name={"newWrkDepartments"}>
                                {departmentsLikeOptions}
                            </select>

                            <input type={"submit"} value={'Добавить'} />
                        </form>
                    </div>


                    <div className="game-workers-edit">
                        <div>
                            {currentWrkEditName}
                        </div>
                        <br/>
                        <form onSubmit={(evt)=>this.onEditWorkerSubmit(evt)}>
                            <input type="text" name="editWrkName" placeholder={"Имя"}/>
                            <input type="text" name="editWrkFamily" placeholder={"Фамилия"}/>
                            <input type="text" name="editWrkPatronymic" placeholder={"Отчество"}/>
                            <div>
                                <input type="radio" id={"radioM"}
                                       name="editWrkSex" value={0}
                                />
                                <label htmlFor="radioM">Мужской</label>

                                <input type="radio" id={"radioF"}
                                       name="editWrkSex" value={1}
                                />
                                <label htmlFor="radioF">Женский</label>

                            </div>

                            <input type="text"
                                   name="editWrkSalary"
                                   placeholder={"З/п"}
                            />
                            <select multiple={true}
                                    name={"editWrkDepartments"}
                                    value={this.state.currentEditWorker.currentSelectDepartmentsOptions}
                                    onChange={evi=>this.onDepartmentsChanged(evi)}
                            >
                                {departmentsLikeOptions}
                            </select>

                            <input type={"submit"} value={'Изменить'} />
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}
