import { useEffect, useState } from 'react';
import { Calendar } from '../components/Calendar';
import { Link, useParams, useNavigate, createSearchParams } from 'react-router-dom';
import axios from '../axios';

export function DetailPage() {
    const [client, setClient] = useState([]);
    const [child, setChild] = useState([]);
    const [days, setDays] = useState([]);
    const { id, month } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        loadingData();
    }, [])

    const loadingData = async () => {
        const responseClient = await axios.get(`parents/${id}`);
        setClient(responseClient.data);

        const responseChildren = await axios.get(`children?parentId=${id}`);
        setChild(responseChildren.data[0]);

        const responseDates = await axios.get(`dates?parentId=${id}&month=${month}`);
        const dates = responseDates.data;

        const responseDays = await axios.get(`days?parentId=${id}&month=${month}`);

        const newDays = responseDays.data.reduce((acc, curr, index) => {
            const subIndex = Math.floor(index / 7);

            if (!acc[subIndex]) {
                acc[subIndex] = [];
            }

            acc[subIndex].push(curr);
            return acc;
        }, []);

        const result = newDays.map((day, index) => {
            return [day, dates[index]];
        })

        setDays(result);
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

        const newDays = days.map(item => {
            item.map(day => {
                if (day.id === id) {
                    currentId = id;
                    day.completed = !day.completed;
                    currentObj.completed = day.completed;
                }

                return day;
            })

            return item;
        })

        setDays(newDays);

        await axios.patch(`days/${currentId}`, currentObj);
    }

    const onChangeInput = async (event, id) => {
        let currentId;
        let currentWeek = {};

        const newDays = days.map(item => {
            item.map(day => {
                if (day.id === id) {
                    currentId = id;
                    day[event.target.name] = event.target.value;
                    currentWeek[event.target.name] = event.target.value;
                }

                return day;
            })

            return item;
        })

        setDays(newDays);

        await axios.patch(`days/${currentId}`, currentWeek);
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
                {client.name?.split(' ')[0]}
            </button>

            <Link to='/' className='btn home'>Home</Link>

            <h3 className='title'>Attendance</h3>

            <div className='info_client'>
                <p className='month'>{month}-24</p>
                <p>Child’s Name: {child.name}</p>
            </div>

            <Calendar 
              days={days} 
              onCheckDay={onCheckDay} 
              onChangeInput={onChangeInput} 
              calculateTotalTime={calculateTotalTime} 
              handlerEmailBtn={handlerEmailBtn} 
            />
        </div>
    )
}
