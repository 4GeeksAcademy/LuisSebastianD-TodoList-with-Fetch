import { useEffect, useState } from "react";

const URL_BASE = 'https://playground.4geeks.com/todo';

const TodoList = () => {

    const [entrada, setEntrada] = useState('');
    const [tareas, setTareas] = useState([]);
    const [botonEliminar, setBotonEliminar] = useState([]);

    const handleMostrarBotonEliminar = (event) => {
        setBotonEliminar(tareas.map((valor, index) => (index === parseInt(event.currentTarget.id) ? true : false)));
    }

    const handleQuitarBotonEliminar = () => {
        setBotonEliminar(botonEliminar.map(() => false));
    }

    const obtenerTareas = async () => {
        try {
            const response = await fetch(`${URL_BASE}/users/Luis`);
            const data = await response.json();

            setTareas(data.todos);

        } catch (error) {
            console.log(error);
        }
    }

    const agregarTarea = async () => {
        try {
            const response = await fetch(`${URL_BASE}/todos/Luis`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/JSON'
                },
                body: JSON.stringify({
                    'label': entrada,
                    'is_done': false
                })
            });
            const data = await response.json();
            obtenerTareas();

        } catch (error) {
            console.log(error);
        }
    }

    const borrarTarea = async (event, id) => {
        if (event.target.className === "fa-solid fa-xmark text-danger") {
            try {
                const response = await fetch(`${URL_BASE}/todos/${id}`, {
                    method: 'DELETE',
                });
                obtenerTareas();
            } catch (error) {
                console.log(error);
            }
        }
    }

    const limpiarTodo = async () => {
        try {
            const response = await tareas.map((tarea, index) => {
                fetch(`${URL_BASE}/todos/${tarea.id}`, {
                    method: 'DELETE',
                });
                obtenerTareas();
            });
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        obtenerTareas();
    }, []
    )

    return (
        <div className="w-50">
            <h1 className="text-center display-1">todos</h1>
            <div className="card rounded-0">
                <ul className="list-group rounded-0">
                    <input
                        className="list-group-item rounded-0 ps-5 fs-5"
                        type="text"
                        placeholder="Tarea por hacer"
                        onChange={(event) => setEntrada(event.target.value)}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter' && event.target.value !== '') {
                                agregarTarea();
                                event.target.value = '';
                            }
                        }
                        } />
                    {tareas.length === 0 ? <li className="list-group-item rounded-0 d-flex justify-content-between ps-5 fs-5">
                        No hay tareas, añadir tareas</li> :
                        tareas.map((tarea, index) => {
                            return <li
                                key={crypto.randomUUID()}
                                id={index}
                                className="list-group-item rounded-0 d-flex justify-content-between ps-5 fs-5"
                                onMouseEnter={(event) => handleMostrarBotonEliminar(event)}
                                onMouseLeave={handleQuitarBotonEliminar}
                                onClick={(event) => borrarTarea(event, tarea.id)}>
                                {tarea.label}{botonEliminar[index] === true ? <i className="fa-solid fa-xmark text-danger"></i> : ''}
                            </li>;
                        })}
                </ul>
                <div className="card-footer">
                    <h6 className="m-0 fs-6 fw-light text-body-tertiary">{tareas.length} item left</h6>
                </div>
            </div>
            <div className="d-flex justify-content-center">
                <button type="button" className="btn btn-primary w-25 mt-5" onClick={limpiarTodo}>Limpiar todo</button>
            </div>
        </div>
    )
}

export default TodoList;