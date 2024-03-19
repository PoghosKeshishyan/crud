import { useState } from 'react';
import axios from '../axios';

export function ModalAddClient({ setShowModal, loadingClients }) {
    const [formData, setFormData] = useState({
        parent: '',
        number_of_hours: '',
        child: '',
        birth: '',
        address: '',
        telephone: '',
        email: '',
        discharge: '',
        enrollment: new Date().toISOString().split('T')[0],
    });

    const onChangeInput = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value })
    }

    const submitHandler = async (event) => {
        event.preventDefault();
        await axios.post('clients', formData);
        loadingClients();
        setShowModal();
    }

    return (
        <div className='ModalAddClient'>
            <div className='dark_bg' onClick={() => setShowModal(false)}></div>
            <div className='close_modal' onClick={() => setShowModal(false)}>&times;</div>

            <form onSubmit={submitHandler}>
                <h2 className='title'>Add client</h2>

                <div className='form_item'>
                    <p>Parent's name:</p>

                    <input
                        type='text'
                        name='parent'
                        required
                        value={formData.parent}
                        onChange={onChangeInput}
                    />
                </div>

                <div className='form_item'>
                    <p>Total week hours based on the contract/agreement:</p>

                    <input
                        type='number'
                        name='number_of_hours'
                        required
                        value={formData.number_of_hours}
                        onChange={onChangeInput}
                    />
                </div>

                <div className='form_item'>
                    <p>Child's name:</p>

                    <input
                        type='text'
                        name='child'
                        required
                        value={formData.child}
                        onChange={onChangeInput}
                    />
                </div>

                <div className='form_item'>
                    <p>Date of birth:</p>

                    <input
                        type='date'
                        name='birth'
                        required
                        value={formData.birth}
                        onChange={onChangeInput}
                    />
                </div>

                <div className='form_item'>
                    <p>Address:</p>

                    <input
                        type='text'
                        name='address'
                        required
                        value={formData.address}
                        onChange={onChangeInput}
                    />
                </div>

                <div className='form_item'>
                    <p>Tel.</p>

                    <input
                        type='tel'
                        name='telephone'
                        required
                        value={formData.telephone}
                        onChange={onChangeInput}
                    />
                </div>

                <div className='form_item'>
                    <p>E-mail</p>
                    <input
                        type='email'
                        name='email'
                        required
                        value={formData.email}
                        onChange={onChangeInput}
                    />
                </div>

                <div className='form_item'>
                    <p>Date of enrollment:</p>

                    <input
                        type='date'
                        name='enrollment'
                        required
                        value={formData.enrollment}
                        onChange={onChangeInput}
                    />
                </div>

                <div className='form_item'>
                    <input type='submit' value='Submit' className='btn' />
                </div>
            </form>
        </div>
    )
}
