import { useNavigate } from "react-router-dom";

export function Folders({ folders, setShowModal }) {
    const navigate = useNavigate();

    return (
        <div className='Folders'>
            {
                folders.map(folder => (
                    <div
                        key={folder.id}
                        className="folder"
                        onClick={() => navigate(`/profile/folder/${folder.id}`)}
                    >
                        <img src="folder.jpg" alt="folder" width={100} />
                        <p>{folder.title}</p>
                    </div>
                ))
            }

            <button className="btn" onClick={() => setShowModal(true)}>add new file</button>
        </div>
    )
}
