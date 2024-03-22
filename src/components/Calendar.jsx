export function Calendar({ days, onCheckDay, onChangeInput, calculateTotalTime, handlerEmailBtn }) {
    return (
        <div className='Calendar'>
            {
                days.map((item, index) => (
                    <div className="item" key={index}>
                        <div className='content'>
                            {
                                item[0]?.map(elem => (
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
                            
                            <p>{item[1].title}</p>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}
