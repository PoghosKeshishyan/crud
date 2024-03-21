import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ModalAddChild } from '../components/ModalAddChild';
import axios from '../axios';

export function ClientPage() {
    const [months, setMonths] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showSubmitBtnParent, setShowSubmitBtnParent] = useState(false);
    const [showSubmitBtnChild, setShowSubmitBtnChild] = useState(false);
    const { id } = useParams();

    const [parent, setParent] = useState({
        name: '',
        address: '',
        telephone: '',
        email: '',
    });

    const [children, setChildren] = useState([]);

    useEffect(() => {
        loadingData();
    }, [])

    const loadingData = async () => {
        const responseParent = await axios.get(`parents/${id}`);
        setParent(responseParent.data);

        const responseChildren = await axios.get(`children?parentId=${id}`);
        setChildren(responseChildren.data);

        const responseMonths = await axios.get('months');
        setMonths(responseMonths.data);
    }

    const onChangeParentsInput = (event) => {
        setShowSubmitBtnParent(true);

        const { name, value } = event.target;

        setParent((prevClient) => ({
            ...prevClient,
            [name]: value
        }));
    }

    const onChangeChildrenInput = (event, id) => {
        setShowSubmitBtnChild(true);

        const { name, value } = event.target;

        const newChildren = children.map(el => {
            if (el.id === id) {
                el[name] = value;
            }

            return el;
        })

        setChildren(newChildren);
    }

    const parentSubmitHandler = async (event) => {
        event.preventDefault();
        await axios.put(`parents/${id}`, parent);
        setShowSubmitBtnParent(false);
    }

    const childrenSubmitHandler = async (event) => {
        event.preventDefault();

        children.forEach(async child => {
            await axios.put(`children/${child.id}`, child);
        })

        setShowSubmitBtnChild(false);
    }

    return (
        <div className='ClientPage'>
            <Link to='/' className='btn home'>Home</Link>

            <div className="info">
                <form onSubmit={parentSubmitHandler} className='parentsForm'>
                    <table>
                        <tbody>
                            <tr>
                                <td>Parent's name:</td>
                                <td>
                                    <input
                                        type='text'
                                        name='name'
                                        value={parent.name}
                                        onChange={onChangeParentsInput}
                                    />
                                </td>
                            </tr>

                            <tr>
                                <td>Address:</td>
                                <td>
                                    <input
                                        type='text'
                                        name='address'
                                        value={parent.address}
                                        onChange={onChangeParentsInput}
                                    />
                                </td>
                            </tr>

                            <tr>
                                <td>Tel.</td>
                                <td>
                                    <input
                                        type='text'
                                        name='telephone'
                                        value={parent.telephone}
                                        onChange={onChangeParentsInput}
                                    />
                                </td>
                            </tr>

                            <tr>
                                <td>E-mail:</td>
                                <td>
                                    <input
                                        type='text'
                                        name='email'
                                        value={parent.email}
                                        onChange={onChangeParentsInput}
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    {
                        showSubmitBtnParent && <input type='submit' value='Update' className='btn' />
                    }
                </form>

                <form onSubmit={childrenSubmitHandler} className='childrenForm'>
                    {
                        children.map((child, index) => (
                            <table key={index}>
                                <tbody>
                                    <tr>
                                        <td>Child's name:</td>
                                        <td>
                                            <input
                                                type='text'
                                                name='name'
                                                value={child.name}
                                                onChange={e => onChangeChildrenInput(e, child.id)}
                                            />
                                        </td>
                                    </tr>

                                    <tr>
                                        <td>Date of birth:</td>
                                        <td>
                                            <input
                                                type='date'
                                                name='birth'
                                                value={child.birth}
                                                onChange={e => onChangeChildrenInput(e, child.id)}
                                            />
                                        </td>
                                    </tr>

                                    <tr>
                                        <td>Date of enrollment:</td>
                                        <td>
                                            <input
                                                type='date'
                                                name='enrollment'
                                                value={child.enrollment}
                                                onChange={e => onChangeChildrenInput(e, child.id)}
                                            />
                                        </td>
                                    </tr>

                                    <tr>
                                        <td>Date of discharge:</td>
                                        <td>
                                            <input
                                                type='text'
                                                name='discharge'
                                                value={child.discharge}
                                                onChange={e => onChangeChildrenInput(e, child.id)}
                                            />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        ))
                    }

                    {
                        showSubmitBtnChild && <input type='submit' value='Update' className='btn' />
                    }
                </form>

                <button className='btn' onClick={() => setShowModal(true)}>
                    + add child
                </button>
            </div>

            {
                showModal && <ModalAddChild
                    id={id}
                    setShowModal={setShowModal}
                    loadingData={loadingData}
                />
            }

            <div className='months'>
                <div className='title'>
                    <h3>Attendance</h3>
                    <p>2024</p>
                </div>

                <div className='months_container'>
                    {
                        months.map((item, index) => (
                            <Link to={`/client/${id}/${item.month}`} key={index}>
                                {item.month}
                            </Link>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}
