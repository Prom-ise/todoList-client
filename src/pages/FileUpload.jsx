import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Greeting from "./Greeting";
import { toast } from "react-toastify";
import { MdDelete } from "react-icons/md";

const FileUpload = () => {
  let navigate = useNavigate();
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user"))
  );
  const uploadUri = "https://todolist-server-api.onrender.com/uploadList/upload";
  const filesUri = "https://todolist-server-api.onrender.com/uploadList/files";
  const [files, setFiles] = useState(null);
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [audioFiles, setAudioFiles] = useState([]);
  const [videoFiles, setVideoFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filePreviews, setFilePreviews] = useState([]);
  const [activeSection, setActiveSection] = useState("images");
  const [uploadProgress, setUploadProgress] = useState(0);

  const onChange = (e) => {
    if (e.target.name === "files") {
      const selectedFiles = e.target.files;
      setFiles(selectedFiles);

      // Generate preview URLs
      const previews = [];
      for (let i = 0; i < selectedFiles.length; i++) {
        previews.push(URL.createObjectURL(selectedFiles[i]));
      }
      setFilePreviews(previews); // Store previews in state
    } else {
      setDescription(e.target.value);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("description", description);

    if (files) {
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }
    }

    try {
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const res = await axios.post(uploadUri, formData, {
        headers,
        onUploadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          let percentCompleted = Math.floor((loaded * 100) / total);
          setUploadProgress(percentCompleted);
        },
      });

      console.log("Files uploaded:", res.data);
      categorizeFiles(res.data);
      window.location.reload();
      toast.success("File Uploaded Successfully");
    } catch (err) {
      console.error(err.response?.data?.msg || err.message);
      toast.error("Error saving file");
      setUploadProgress(0);
    }
  };

  const categorizeFiles = (uploadedFiles) => {
    const imageFiles = [];
    const audioFiles = [];
    const videoFiles = [];

    uploadedFiles.forEach((file) => {
      if (file.fileType.startsWith("image")) {
        imageFiles.push(file);
      } else if (file.fileType.startsWith("audio")) {
        audioFiles.push(file);
      } else if (file.fileType.startsWith("video")) {
        videoFiles.push(file);
      }
    });

    setImages(imageFiles);
    setAudioFiles(audioFiles);
    setVideoFiles(videoFiles);
  };

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const res = await axios.get(filesUri, { headers });
        categorizeFiles(res.data);
      } catch (err) {
        localStorage.removeItem("token");
        navigate("/todoList/login");
        console.error(err.response?.data?.msg || err.message);
        toast.error("Error fetching file try login again");
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  const deleteFile = async (fileId) => {
    const confirmed = window.confirm("Are you sure you want to delete this file?");
    if (confirmed) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`https://todolist-server-api.onrender.com/uploadList/files/${fileId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        setImages(images.filter((file) => file._id !== fileId));
        setAudioFiles(audioFiles.filter((file) => file._id !== fileId));
        setVideoFiles(videoFiles.filter((file) => file._id !== fileId));
        toast.success("File deleted successfully");
      } catch (err) {
        console.error(err.response ? err.response.data : err.message);
        toast.error(err.message);
      }
    } else {
      toast.info("File deletion canceled");
    }
  };
  

  return (
    <div className="file-upload">
      <Greeting user={user} />
      <div className="file-uploads">
        <div className="file-uploadss flex justify-between">
        <div className="upload-form">
          <div>
          <div>
          {uploadProgress > 0 && (
            <div className="progress-bar-container my-3 mb-3">
              <div class="progress-bar" style={{ width: `${uploadProgress}%` }}>
                {uploadProgress}%
              </div>
            </div>
          )}
            <h2>File Previews</h2>
            <div className="file-previews">
              {filePreviews.length > 0 ? (
                filePreviews.map((preview, index) => (
                  <div key={index}>
                    {preview.endsWith(".mp3") || preview.endsWith(".wav") ? (
                      <audio controls>
                        <source className="src" src={preview} />
                        Your browser does not support the audio element.
                      </audio>
                    ) : preview.endsWith(".mp4") ? (
                      <video controls>
                        <source className="src" src={preview} />
                        Your browser does not support the video element.
                      </video>
                    ) : (
                      <img
                        className="src"
                        src={preview}
                        alt={`Preview ${index + 1}`}
                      />
                    )}
                    <p className="text-blue-600">{files[index].name}</p>
                  </div>
                ))
              ) : (
                <p>No files selected for preview.</p>
              )}
            </div>
          </div>
          <form onSubmit={onSubmit}>
            <label htmlFor="file" className="labelFile my-[20px]">
              <span>
                <svg
                  xmlSpace="preserve"
                  viewBox="0 0 184.69 184.69"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  xmlns="http://www.w3.org/2000/svg"
                  id="Capa_1"
                  version="1.1"
                  width="60px"
                  height="60px"
                >
                  <g>
                    <g>
                      <g>
                        <path
                          d="M149.968,50.186c-8.017-14.308-23.796-22.515-40.717-19.813
                        C102.609,16.43,88.713,7.576,73.087,7.576c-22.117,0-40.112,17.994-40.112,40.115c0,0.913,0.036,1.854,0.118,2.834
                        C14.004,54.875,0,72.11,0,91.959c0,23.456,19.082,42.535,42.538,42.535h33.623v-7.025H42.538
                        c-19.583,0-35.509-15.929-35.509-35.509c0-17.526,13.084-32.621,30.442-35.105c0.931-0.132,1.768-0.633,2.326-1.392
                        c0.555-0.755,0.795-1.704,0.644-2.63c-0.297-1.904-0.447-3.582-0.447-5.139c0-18.249,14.852-33.094,33.094-33.094
                        c13.703,0,25.789,8.26,30.803,21.04c0.63,1.621,2.351,2.534,4.058,2.14c15.425-3.568,29.919,3.883,36.604,17.168
                        c0.508,1.027,1.503,1.736,2.641,1.897c17.368,2.473,30.481,17.569,30.481,35.112c0,19.58-15.937,35.509-35.52,35.509H97.391
                        v7.025h44.761c23.459,0,42.538-19.079,42.538-42.535C184.69,71.545,169.884,53.901,149.968,50.186z"
                          style={{ fill: "#fff" }}
                        />
                      </g>
                      <g>
                        <path
                          d="M108.586,90.201c1.406-1.403,1.406-3.672,0-5.075L88.541,65.078
                        c-0.701-0.698-1.614-1.045-2.534-1.045l-0.064,0.011c-0.018,0-0.036-0.011-0.054-0.011c-0.931,0-1.85,0.361-2.534,1.045
                        L63.31,85.127c-1.403,1.403-1.403,3.672,0,5.075c1.403,1.406,3.672,1.406,5.075,0L82.296,76.29v97.227
                        c0,1.99,1.603,3.597,3.593,3.597c1.979,0,3.59-1.607,3.59-3.597V76.165l14.033,14.036
                        C104.91,91.608,107.183,91.608,108.586,90.201z"
                          style={{ fill: "#fff" }}
                        />
                      </g>
                    </g>
                  </g>
                </svg>
              </span>
              <p>Drag and drop your file here or click to select a file!</p>
              <input
                className="input"
                name="files"
                multiple
                onChange={onChange}
                id="file"
                type="file"
              />
              {/* <input type="file" name="files" multiple onChange={onChange} /> */}
            </label>

            <div className="messageBox">
              <input
                placeholder="Description (optional).."
                value={description}
                onChange={onChange}
                type="text"
                id="messageInput"
              />
              <button id="sendButton" type="submit">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 664 663"
                >
                  <path
                    fill="none"
                    d="M646.293 331.888L17.7538 17.6187L155.245 331.888M646.293 331.888L17.753 646.157L155.245 331.888M646.293 331.888L318.735 330.228L155.245 331.888"
                  ></path>
                  <path
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    stroke-width="33.67"
                    stroke="#007bff"
                    d="M646.293 331.888L17.7538 17.6187L155.245 331.888M646.293 331.888L17.753 646.157L155.245 331.888M646.293 331.888L318.735 330.228L155.245 331.888"
                  ></path>
                </svg>
              </button>
            </div>
          </form>
          </div>
        </div>

        <div className="file-uploaded sm:mt-[2.1em]">
          <div className="uploaded-image-container">
            <div className="flex gap-[20px] justify-between">
            <h2
        onClick={() => setActiveSection("images")}
        className={`cursor-pointer text-3xl ${
          activeSection === "images" ? "text-blue-600 text-3xl font-bold" : ""
        }`}
      >
        Images
      </h2>
      <h2
        onClick={() => setActiveSection("audio")}
        className={`cursor-pointer text-3xl ${
          activeSection === "audio" ? "text-blue-600 text-3xl font-bold" : ""
        }`}
      >
        Audios
      </h2>
          <h2
        onClick={() => setActiveSection("videos")}
        className={`cursor-pointer text-3xl ${
          activeSection === "videos" ? "text-blue-600 text-3xl font-bold" : ""
        }`}
      >
        Videos
      </h2>
            </div>
          
            <div>
              {activeSection === "images" && (
                <div className="uploaded-files-container">
                  {loading ? (
                    <p>Loading Image files...</p>
                  ) : (
                    <ul className="uploaded-files-container">
                      {images.length === 0 ? (
                        <p>No Image files added yet.</p>
                      ) : (
                        images.map((file) => (
                          <li key={file._id} className="mb-[40px]">
                            <div className="flex justify-between">
                              <p className="text-blue-600">
                                Added on:{" "}
                                {new Date(file.createdAt).toLocaleString()}
                              </p>
                              <button onClick={() => deleteFile(file._id)}>
                                <MdDelete className="text-3xl text-red-600 hover:text-red-700 transition-all ease duration-200 hover:scale-150" />
                              </button>
                            </div>
                            <img
                              className="uploaded-files"
                              src={`https://todolist-server-api.onrender.com/${file.filePath}`}
                              alt={file.fileName}
                            />
                            <p>{file.description}</p>
                            <hr className="my-6 text-neutral-500" />
                          </li>
                        ))
                      )}
                    </ul>
                  )}
                </div>
              )}
            </div>

            <div>
           
              {activeSection === "audio" && (
                <div className="uploaded-files-container">
                  {loading ? (
                    <p>Loading files...</p>
                  ) : (
                    <div className="uploaded-files-container">
                      {audioFiles.length === 0 ? (
                        <p>No Audio files added yet.</p>
                      ) : (
                        audioFiles.map((file) => (
                          <div key={file._id} className="mb-[40px]">
                            <div className="flex justify-between">
                              <p>
                                Added on:{" "}
                                {new Date(file.createdAt).toLocaleString()}
                              </p>
                              <button onClick={() => deleteFile(file._id)}>
                                <MdDelete className="text-3xl text-red-600 hover:text-red-700 transition-all ease duration-200 hover:scale-150" />
                              </button>
                            </div>
                            <audio controls>
                              <source
                                className="uploaded-files"
                                src={`https://todolist-server-api.onrender.com/${file.filePath}`}
                                type={file.fileType}
                              />
                              Your browser does not support the audio element.
                            </audio>
                            <p>{file.description}</p>
                            <hr className="my-6 text-neutral-500" />
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div>
           
              {activeSection === "videos" && (
                <div className="uploaded-files-container">
                  {loading ? (
                    <p>Loading video files...</p>
                  ) : (
                    <div className="uploaded-files-container">
                      {videoFiles.length === 0 ? (
                        <p>No Video files added yet.</p>
                      ) : (
                        videoFiles.map((file) => (
                          <div key={file._id} className="mb-[40px]">
                            <div className="flex justify-between">
                              <p>
                                Added on:{" "}
                                {new Date(file.createdAt).toLocaleString()}
                              </p>
                              <button onClick={() => deleteFile(file._id)}>
                                <MdDelete className="text-3xl text-red-600 hover:text-red-700 transition-all ease duration-200 hover:scale-150" />
                              </button>
                            </div>
                            <video controls>
                              <source
                                className="uploaded-files"
                                src={`https://todolist-server-api.onrender.com/${file.filePath}`}
                                type={file.fileType}
                              />
                              Your browser does not support the video element.
                            </video>
                            <p>{file.description}</p>
                            <hr className="my-6 text-neutral-500" />
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
