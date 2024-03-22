import { useState } from 'react';
import axios from 'axios';

export function ModalAddFile({ setShowModal, folders }) {
    const [folderId, setFolderId] = useState(1);
    const [file, setFile] = useState({ name: 'The file is not selected' });

    const onChangeFile = (event) => {
        setFile(event.target.files[0]);
    };

    const submitHandler = async (event) => {
        event.preventDefault();

        if (!file.size) {
            setFile({name: 'No selected file!'});
            return;
        }

        const fd = new FormData();
        fd.append('file', file);

        await axios.post('http://localhost:5000/upload', fd, {
            headers: {
                "Custom-Header": "value",
            }
        });

        await axios.post('http://localhost:3000/files', {folderId, name: file.name})
        setShowModal(false);
    }

    return (
        <div className='ModalAddFile'>
            <div className='dark_bg' onClick={() => setShowModal(false)}></div>
            <div className='close_modal' onClick={() => setShowModal(false)}>&times;</div>

            <form onSubmit={submitHandler}>
                <h2 className='title'>Add new file</h2>

                <div className="form_item">
                    <p>Choose which folder you want to add the file to</p>

                    <select onChange={(e) => setFolderId(e.target.value)}>
                        {
                            folders.map(folder => (
                                <option key={folder.id} value={folder.id}>
                                    {folder.title}
                                </option>
                            ))
                        }
                    </select>
                </div>

                <label className="file-upload-container" htmlFor="file-upload-2">
                    <span className="file-upload-button">Choose File</span>
                    <input type="file" id="file-upload-2" onChange={onChangeFile} />
                    <span className="file-upload-label">{file.name}</span>
                </label>

                <div className='form_item'>
                    <input type='submit' value='Submit' className='btn' />
                </div>
            </form>
        </div>
    )
}
