import { useEffect, useState } from "react"

const UploaderInterface = () =>{
    const [files,setFiles] = useState([])
    const [UploadedFiles,setUploadedFiles] = useState([])
    const handleFiles = (event) =>{
        setFiles([...event.target.files])
    }

    
    const UploadFile = (event) =>{
        
        const formData = new FormData();
        for(let i=0;i<files.length;i++){
            formData.append('files',files[i])
        }
        for (let pair of formData.entries()) {
            console.log(pair[0] + ': ' + pair[1].name);
        }

        fetch('http://localhost:3000/upload',{
            method:'POST',
            body:formData
        })
        .then(response => response.text())
        .then(response=>{
            uploadedFiles()
        })
        .catch(err=>{
            console.log(err)
        })
        
    }
    useEffect(()=>{
        uploadedFiles();
    },[])
    const uploadedFiles = () =>{
        fetch('http://localhost:3000/uploadedFiles')
        .then(response => response.json())
        .then(response =>{
            console.log(response)
            setUploadedFiles(response)
        })
        .catch(err => console.log(err))
    }
    return (
        <>
            <div className="div-structure-core">
                <div className="mobile-width width-75">
                    <div className="div-structure-core">
                        <h2>File Uploader</h2>
                        <form className="mobile-width form-styles">
                            <label htmlFor="file-input" className="width-75 file-input">{files.length>0 ? files.map(file => file.name).join(' , '):'Choose Files ...'}</label>
                            <input type="file" id="file-input" className="file-input-tag" multiple onChange={handleFiles} />
                            <button type="submit" onClick={UploadFile}>Upload</button>
                        </form>
                    </div>
                    <div className="div-structure-core">
                        {
                            UploadedFiles && UploadedFiles.map((obj,index) =>(

                                
                                <div key={index} className="mobile-width uploaded-files-list">
                                    <span className="ellipsis">{obj.name}</span>
                                    <span><a href="#" download={obj.url}>Download</a></span>
                                </div>

                            ))
                        }

                        {
                            UploadedFiles.length<=0 && <h5 className="danger">Upload the files first into the server</h5>

                            
                        }
                        
                    </div>
                </div>
            </div>
        </>
    )
}

export default UploaderInterface;