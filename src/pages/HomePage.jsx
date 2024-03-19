import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ModalAddClient } from '../components/ModalAddClient';
import axios from '../axios';

export function HomePage() {
    const [clients, setClients] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        loadingClients();
    }, [])

    const loadingClients = async () => {
        const response = await axios.get('clients');
        setClients(response.data);
    }

    return (
        <div className='HomePage'>
            <div className='client'>
                <h2>Clients</h2>

                <table>
                    <thead>
                        <tr>
                            <th>N</th>
                            <th>Parent</th>
                            <th>Child</th>
                            <th>Date of enrollment</th>
                            <th>Date of discharge</th>
                        </tr>
                    </thead>

                    <tbody>
                        {
                            clients.map((client, index) => (
                                <tr key={index} onClick={() => navigate(`/client/${client.id}`)}>
                                    <td>{index + 1}</td>
                                    <td>{client.parent}</td>
                                    <td>{client.child}</td>
                                    <td>{client.enrollment}</td>
                                    <td>{client.discharge}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>

                <button className='btn client' onClick={() => setShowModal(true)}>
                    + add client
                </button>
            </div>

            {
                showModal && <ModalAddClient 
                  setShowModal={setShowModal} 
                  loadingClients={loadingClients} 
                />
            }

            <Link to='profile' className='btn'>
                Profile page
            </Link>
        </div>
    )
}
