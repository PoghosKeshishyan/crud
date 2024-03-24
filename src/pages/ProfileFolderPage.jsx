import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export function ProfileFolderPage() {
  const [files, setFiles] = useState([]);
  const { folderId } = useParams();

  useEffect(() => {
    loadingData();
  }, [])

  const loadingData = async () => {
    const response = await axios.get(`http://localhost:3000/files?folderId=${folderId}`);
    setFiles(response.data);
  }

  const addFolderHandler = async (event) => {
    event.preventDefault();

    const file = event.target.files[0];

    if (!file.size) {
      return;
    }

    const fd = new FormData();
    fd.append('file', file);

    await axios.post('http://localhost:5000/upload', fd);
    await axios.post('http://localhost:3000/files', { folderId, name: file.name });
    loadingData();
  }

  const deleteFileHandler = async (id) => {
    const confirm = window.confirm('Are you sure that you want to delete this file ?');

    if (confirm) {
      const fileName = files.filter(file => file.id === id)[0].name;
      await axios.delete(`http://localhost:5000/upload/${fileName}`);
      await axios.delete(`http://localhost:3000/files/${id}`);
      loadingData();
    }
  }

  return (
    <div className="ProfileFolderPage">
      <Link to='/profile' className='btn home'>Profile</Link>

      {
        !files.length && (
          <div className="empty_folder">
            <img src="/empty-folder.png" alt="empty-folder" />
            <p>Folder is empty</p>
          </div>
        )
      }

      <div className="files_container">
        {
          files.map(item => (
            <div className="file" key={item.id}>
              <p className="delete_file" onClick={() => deleteFileHandler(item.id)}>
                &times;
              </p>

              <img src="/file.png" alt="file" />
              {
                item.name.length > 15
                  ?
                  <p>{item.name.slice(0, 15)}...</p>
                  :
                  <p>{item.name}</p>
              }
            </div>
          ))
        }
      </div>

      <label className="file-upload-container" htmlFor="file-upload">
        <span className='btn file'>add new file</span>
        <input type="file" id="file-upload" onChange={addFolderHandler} />
      </label>
    </div>
  )
}
