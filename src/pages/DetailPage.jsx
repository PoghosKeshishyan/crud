import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate, createSearchParams } from 'react-router-dom';
import axios from '../axios';

export function DetailPage() {
    const [client, setClient] = useState([]);
    const [weeks, setWeeks] = useState([]);
    const { id, month } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        loadingData();
    }, [])

    const loadingData = async () => {
        const responseClient = await axios.get(`clients/${id}`);
        setClient(responseClient.data);

        const responseWeeks = await axios.get(`weeks?clientId=${id}&month=${month}`);
        console.log(responseWeeks);
        const result = responseWeeks.data.reduce((acc, curr, index) => {
            const subIndex = Math.floor(index / 7);

            if (!acc[subIndex]) {
                acc[subIndex] = [];
            }

            acc[subIndex].push(curr);
            return acc;
        }, []);

        setWeeks(result);
    }

    function calculateTotalTime(week) {
        let sum = 0;

        for (let i = 0; i < week.length; i++) {
            // Проверяем, что в элементах недели есть данные arrived и isGone
            if (week[i].arrived && week[i].isGone) {
                // Создаем объекты Date для времен arrived и isGone
                let dateArrived = new Date(`2024-03-24T${week[i].arrived}`);
                let dateIsGone = new Date(`2024-03-24T${week[i].isGone}`);

                // Получаем время в миллисекундах для каждого времени
                let timeArrived = dateArrived.getTime();
                let timeIsGone = dateIsGone.getTime();

                // Вычисляем разницу между временами в миллисекундах
                let intervalMs = Math.abs(timeIsGone - timeArrived);

                // Конвертируем разницу в часы и добавляем к сумме
                sum += intervalMs / (1000 * 60 * 60);
            }
        }

        return sum.toFixed(1);
    }

    const onCheckDay = async (id) => {
        let currentId;
        let currentObj = { completed: null };

        const newWeeks = weeks.map(week => {
            week.map(day => {
                if (day.id === id) {
                    currentId = id;
                    day.completed = !day.completed;
                    currentObj.completed = day.completed;
                }

                return day;
            })

            return week;
        })

        setWeeks(newWeeks);

        await axios.patch(`weeks/${currentId}`, currentObj);
    }

    const onChangeInput = async (event, id) => {
        let currentId;
        let currentWeek = {};

        const newWeeks = weeks.map(week => {
            week.map(day => {
                if (day.id === id) {
                    currentId = id;
                    day[event.target.name] = event.target.value;
                    currentWeek[event.target.name] = event.target.value;
                }

                return day;
            })

            return week;
        })

        setWeeks(newWeeks);

        await axios.patch(`weeks/${currentId}`, currentWeek);
    }

    const handlerEmailBtn = (week, index) => {
        const daysCount = week.filter(day => day.completed).length;
        const hoursCount = calculateTotalTime(week);

        navigate({
            pathname: `/client/${id}/${month}/${index + 1}/result`,
            search: createSearchParams({ days: daysCount, hours: hoursCount }).toString(),
        })
    }

    return (
        <div className='DetailPage'>
            <button onClick={() => navigate(-1)} className='btn back'>
                {client.parent?.split(' ')[0]}
            </button>

            <Link to='/' className='btn home'>Home</Link>

            <h3 className='title'>Attendance</h3>

            <div className='info_client'>
                <p className='month'>{month}-24</p>
                <p>Child’s Name: {client.child}</p>
            </div>

            <div className='calendar_container'>
                {
                    weeks.map((item, index) => (
                        <div key={index} className='item'>
                            <div className='content'>
                                {
                                    item.map(elem => (
                                        <div key={elem.id} className={elem.disabled ? 'sub_item active' : 'sub_item'}>
                                            <h3>{elem.title} {elem.disabled}</h3>

                                            <form>
                                                <input
                                                    type='checkbox'
                                                    name='completed'
                                                    checked={elem.completed}
                                                    onChange={() => onCheckDay(elem.id)}
                                                />

                                                <input
                                                    type='time'
                                                    name='arrived'
                                                    className='arrived'
                                                    value={elem.arrived}
                                                    onChange={e => onChangeInput(e, elem.id)}
                                                />

                                                <input
                                                    type='time'
                                                    name='isGone'
                                                    className='isGone'
                                                    value={elem.isGone}
                                                    onChange={e => onChangeInput(e, elem.id)}
                                                />
                                            </form>
                                        </div>
                                    ))
                                }
                            </div>

                            <div className='actions'>
                                <span>Total time in week: {calculateTotalTime(item)} Hours</span>

                                <button onClick={() => handlerEmailBtn(item, index)} className='btn'>
                                    Email
                                </button>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}
