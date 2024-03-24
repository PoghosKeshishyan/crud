import { useEffect, useState } from "react";
import { Folders } from "../components/Folders";
import { Link } from "react-router-dom";
import axios from "axios";

export function ProfilePage() {
  const [provider, setProvider] = useState({name: '', address: '', telephone: '', email: ''});
  const [folders, setFolders] = useState([]);
  const [header, setHeader] = useState({ title: '', logo: '' });
  const [showSubmitBtn, setShowSubmitBtn] = useState(false);
  const [showSubmitBtnProvider, setShowSubmitBtnProvider] = useState(false);
  const [keyDownActive, setKeyDownActive] = useState(null);
  const [activeFolder, setActiveFolder] = useState(null);
  const [file, setFile] = useState(null);

  useEffect(() => {
    loadingData();
  }, []);

  const loadingData = async () => {
    const responseHeader = await axios.get('http://localhost:3000/header');
    setHeader(responseHeader.data);

    const responseProvider = await axios.get('http://localhost:3000/provider');
    setProvider(responseProvider.data);

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

  const onChangeProviderInput = (event) => {
    setShowSubmitBtnProvider(true);
    setProvider({ ...provider, [event.target.name]: event.target.value });
  }

  const onChangeFolderName = (event, id) => {
    const newFolders = folders.map(folder => {
      if (folder.id === id) {
        folder.title = event.target.value;
      }

      return folder;
    })

    setFolders(newFolders);
  }

  const onSubmitChangeFolderName = async (event, id) => {
    event.preventDefault();
    const currentFolder = folders.find(folder => folder.id === id);
    await axios.put(`http://localhost:3000/folders/${id}`, currentFolder);
    setKeyDownActive(false);
    setActiveFolder(false);
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    const fd = new FormData();
    fd.append('file', file);

    await axios.post('http://localhost:5000/upload', fd);
    await axios.put('http://localhost:3000/header', header);
    window.location.reload();
  };

  const onSubmitHandlerProvider = async (event) => {
    event.preventDefault();
    await axios.put('http://localhost:3000/provider', provider);
    setShowSubmitBtnProvider(false);
  }

  return (
    <div className='ProfilePage'>
      <Link to='/' className='btn home'>Home</Link>

      <div className="edit_zone">
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

        <div className="editProvider">
          <p>Edit provider's data</p>

          <form onSubmit={onSubmitHandlerProvider} className='providerForm'>
            <table>
              <tbody>
                <tr>
                  <td>Provider's name:</td>
                  <td>
                    <input
                      type='text'
                      name='name'
                      value={provider.name}
                      onChange={onChangeProviderInput}
                    />
                  </td>
                </tr>

                <tr>
                  <td>Address:</td>
                  <td>
                    <input
                      type='text'
                      name='address'
                      value={provider.address}
                      onChange={onChangeProviderInput}
                    />
                  </td>
                </tr>

                <tr>
                  <td>Tel.</td>
                  <td>
                    <input
                      type='text'
                      name='telephone'
                      value={provider.telephone}
                      onChange={onChangeProviderInput}
                    />
                  </td>
                </tr>

                <tr>
                  <td>E-mail:</td>
                  <td>
                    <input
                      type='text'
                      name='email'
                      value={provider.email}
                      onChange={onChangeProviderInput}
                    />
                  </td>
                </tr>
              </tbody>
            </table>

            {
              showSubmitBtnProvider && <input type='submit' value='Update' className='btn' />
            }
          </form>
        </div>
      </div>

      <Folders 
        folders={folders} 
        keyDownActive={keyDownActive}
        activeFolder={activeFolder}
        setKeyDownActive={setKeyDownActive}
        setActiveFolder={setActiveFolder}
        onChangeFolderName={onChangeFolderName} 
        onSubmitChangeFolderName={onSubmitChangeFolderName}
      />
    </div>
  );
}