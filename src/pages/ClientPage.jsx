import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from '../axios';

export function ClientPage() {
    const [months, setMonths] = useState([]);
    const [showSubmitBtn, setShowSubmitBtn] = useState(false);
    const { id } = useParams();

    const [client, setClient] = useState({
        parent: '',
        child: '',
        birth: '',
        address: '',
        telephone: '',
        email: '',
        enrollment: '',
        discharge: ''
    });

    useEffect(() => {
        loadingData();
    }, [])

    const loadingData = async () => {
        const responseClient = await axios.get(`clients/${id}`);
        setClient(responseClient.data);

        const responseMonths = await axios.get('months');
        setMonths(responseMonths.data);
    }

    const onChangeInput = (event) => {
        setShowSubmitBtn(true);

        const { name, value } = event.target;

        setClient((prevClient) => ({
            ...prevClient,
            [name]: value
        }));
    }

    const submitHandler = async (event) => {
        event.preventDefault();
        await axios.put(`clients/${id}`, client);
        setShowSubmitBtn(false);
    }

    return (
        <div className='ClientPage'>
            <Link to='/' className='btn home'>Home</Link>

            <form onSubmit={submitHandler}>
                <table>
                    <tbody>
                        <tr>
                            <td>Parent's name:</td>
                            <td>
                                <input 
                                  type='text'
                                  name='parent'
                                  value={client.parent}
                                  onChange={onChangeInput}
                                />
                            </td>
                        </tr>

                        <tr>
                            <td>Child's name:</td>
                            <td>
                                <input 
                                  type='text'
                                  name='child'
                                  value={client.child}
                                  onChange={onChangeInput}
                                />
                            </td>
                        </tr>

                        <tr>
                            <td>Date of birth:</td>
                            <td>
                                <input 
                                  type='date'
                                  name='birth'
                                  value={client.birth}
                                  onChange={onChangeInput}
                                />
                            </td>
                        </tr>

                        <tr>
                            <td>Address:</td>
                            <td>
                                <input 
                                  type='text'
                                  name='address'
                                  value={client.address}
                                  onChange={onChangeInput}
                                />
                            </td>
                        </tr>

                        <tr>
                            <td>Tel.</td>
                            <td>
                                <input 
                                  type='text'
                                  name='telephone'
                                  value={client.telephone}
                                  onChange={onChangeInput}
                                />
                            </td>
                        </tr>

                        <tr>
                            <td>E-mail:</td>
                            <td>
                                <input 
                                  type='text'
                                  name='email'
                                  value={client.email}
                                  onChange={onChangeInput}
                                />
                            </td>
                        </tr>

                        <tr>
                            <td>Date of enrollment:</td>
                            <td>
                                <input 
                                  type='date'
                                  name='enrollment'
                                  value={client.enrollment}
                                  onChange={onChangeInput}
                                />
                            </td>
                        </tr>

                        <tr>
                            <td>Date of discharge:</td>
                            <td>
                                <input 
                                  type='text'
                                  name='discharge'
                                  value={client.discharge}
                                  onChange={onChangeInput}
                                />
                            </td>
                        </tr>
                    </tbody>
                </table> 

                {
                    showSubmitBtn && <input type='submit' value='Update' className='btn' />
                }
            </form>

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
