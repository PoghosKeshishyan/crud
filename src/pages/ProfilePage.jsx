import { useEffect, useState } from "react";
import { Folders } from "../components/Folders";
import axios from "axios";
import { ModalAddFile } from "../components/ModalAddFile";

export function ProfilePage() {
  const [folders, setFolders] = useState([]);
  const [header, setHeader] = useState({ title: '', logo: '' });
  const [showModal, setShowModal] = useState(false);
  const [showSubmitBtn, setShowSubmitBtn] = useState(false);
  const [file, setFile] = useState(null);

  useEffect(() => {
    loadingData();
  }, []);

  const loadingData = async () => {
    const responseHeader = await axios.get('http://localhost:3000/header');
    setHeader(responseHeader.data);

    const responseFolders = await axios.get('http://localhost:3000/folders');
    setFolders(responseFolders.data);
  };

  const onChangeInput = (event) => {
    setShowSubmitBtn(true);
    setHeader({ ...header, title: event.target.value });
  };

  const onChangeLogo = (event) => {
    setShowSubmitBtn(true);
    setFile(event.target.files[0]);
    setHeader({ ...header, logo: `http://localhost:5000/uploads/${event.target.files[0].name}` })
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    const fd = new FormData();
    fd.append('file', file);

    await axios.post('http://localhost:5000/upload', fd);
    await axios.put('http://localhost:3000/header', header);
    window.location.reload();
  };

  return (
    <div className='ProfilePage'>
      <div className="editProfile">
        <form onSubmit={onSubmitHandler}>
          <div className="inputBox">
            <p>Edit header title</p>
            <input type="text" value={header.title} name="title" onChange={onChangeInput} />
          </div>

          <div className="inputBox">
            <p>Edit header logo</p>

            <label className="file-upload-container" htmlFor="file-upload">
              <span className="file-upload-button">Choose File</span>

              <input type="file" accept="image/*" id="file-upload" onChange={onChangeLogo} />

              <span className="file-upload-label">{header.logo.slice(29)}</span>
            </label>
          </div>

          {showSubmitBtn && <input type="submit" value="Submit" className="btn" />}
        </form>
      </div>

      <Folders folders={folders} setShowModal={setShowModal} />

      {
        showModal && <ModalAddFile setShowModal={setShowModal} folders={folders} />
      }
    </div>
  );
}
