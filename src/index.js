import React from 'react'
import ReactDOM from 'react-dom'
import Game from './app'

// ========================================
let errors = document.getElementById("errors") ;
    window.addEventListener('mousedown', function(e) {
    document.body.classList.add('mouse-navigation');
    document.body.classList.remove('kbd-navigation');
});
window.addEventListener('keydown', function(e) {
    if (e.keyCode === 9) {
        document.body.classList.add('kbd-navigation');
        document.body.classList.remove('mouse-navigation');
    }
});
window.addEventListener('click', function(e) {
    if (e.target.tagName === 'A' && e.target.getAttribute('href') === '#') {
        e.preventDefault();
    }
});
window.onerror = function(message, source, line, col, error) {

    var text = error ? error.stack || error : message + ' (at ' + source + ':' + line + ':' + col + ')';
    errors.textContent += text + '\n';
    errors.style.display = '';
};
console.error = (function(old) {
    return function error() {
        errors.textContent += Array.prototype.slice.call(arguments).join(' ') + '\n';
        errors.style.display = '';
        old.apply(this, arguments);
    }
})(console.error);
ReactDOM.render(<Game
    state={
            {
                workers:[
                    {
                        name: 'Иван',
                        family: 'Йода',
                        patronymic: '---',
                        sex: 'M',
                        salary: 1000,
                        departments:['Отдел продаж']
                    },
                    {
                        name: 'Петр',
                        family: 'Вейдер',
                        patronymic: '---',
                        sex: 'M',
                        salary: 1500,
                        departments:['Отдел закупок']
                    },
                    {
                        name: 'Ольга',
                        family: 'Кеноби',
                        patronymic: '---',
                        sex: 'Ж',
                        salary: 9000,
                        departments:['Отдел продаж', 'PR-отдел']
                    }
                ],
                departments:[
                    {
                        name: 'Отдел закупок',
                        maxSalary: 1500,
                        workersCount: 1
                    },
                    {
                        name: 'Отдел продаж',
                        maxSalary: 9000,
                        workersCount: 2
                    },
                    {
                        name: 'PR-отдел',
                        maxSalary: 9000,
                        workersCount: 1
                    }
                ],
                currentEditDepartment: 0,
                //текущий редактируемый отдел
                currentEditWorker: {
                    index: 0,
                    currentSelectDepartmentsOptions:['Отдел продаж']
                }
                //текущий редактируемый сотрудник

            }
    }
/>, document.getElementById("root"));
