import React, { useEffect, useRef, useState } from 'react';
import './UploadImages.css';
import axios from 'axios';
import { useNavigate } from 'react-router';

function UploadImages({ active }) {

    const [imageList, setImageList] = useState([]);

    const fileInputRef = useRef(null);
    const uploadAreaRef = useRef(null);

    const navigate = useNavigate();

    useEffect(() => {
        const uploadArea = uploadAreaRef.current;
        if (!uploadArea) return;
        uploadArea.addEventListener('dragover', handleDragOver);
        uploadArea.addEventListener('dragleave', handleDragLeave);
        uploadArea.addEventListener('drop', handleDrop);
        return () => {
            uploadArea.removeEventListener('dragover', handleDragOver);
            uploadArea.removeEventListener('dragleave', handleDragLeave);
            uploadArea.removeEventListener('drop', handleDrop);
        };
    }, []);

    // UX enhacement listeners
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (uploadAreaRef.current) {
            uploadAreaRef.current.style.backgroundColor = '#f0f0f5';
        }
    };
    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (uploadAreaRef.current) {
            uploadAreaRef.current.style.backgroundColor = 'transparent';
        }
    };
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (uploadAreaRef.current) {
            uploadAreaRef.current.style.backgroundColor = 'transparent';
        }
        handleFiles(e.dataTransfer.files);
    };

    const handleFileInputChange = (e) => {
        Array.from(e.target.files).forEach((file) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                setImageList(prev => [
                    ...prev,
                    {
                        name: file.name,
                        dataUrl: event.target.result,
                        file: file
                    }
                ]);
            };
            reader.readAsDataURL(file);
        });
    };

    const handleImageUpload = async (e) => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            navigate("/login", { replace: true });
        }
        const formData = new FormData();
        imageList.forEach(image => formData.append("images", image.file, image.name));

        const imageUploadApi = axios.create({
            baseURL: import.meta.env.BACKEND_BASE_URL,
            headers: {
                "Authorization": "Bearer " + token
            }
            // withCredentials: true // use for cookie-based refresh
        });

        await imageUploadApi.post(
            import.meta.env.BACKEND_IMAGE_UPLOAD_ENDPOINT,
            formData
        ).then(
            response => {
                alert("Images Uploaded Successfully!");
                console.log("Successful Images Upload:", response.data);
            }
        ).catch(
            error => {
                if (error.response && error.response.status === 401) {
                    navigate("/login", { replace: true });
                }
                throw new Error(`Server error: ${error.message}`);
            }
        ).finally(
            () => {
                setImageList([]);
            }
        );
    };

    const removeImage = (index) => {
        setImageList((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <div id="upload" className={`tab-content ${active ? "active" : ""}`}>
            <div className="upload-section">
                <div className="upload-area" id="uploadArea" ref={uploadAreaRef}>
                    <div className="upload-icon">👔</div>
                    <h3>Upload Your Outfit</h3>
                    <p>Drag and drop your outfit images here or click to browse</p>
                    <button type="button" className="upload-btn" onClick={() => fileInputRef.current.click()}>Choose Files</button>
                    <input type="file" id="fileInput" className="file-input" accept="image/*" multiple ref={fileInputRef} onChange={handleFileInputChange} />
                </div>
                <div className="image-grid" id="imageGrid">
                    {imageList.map((img, idx) => (
                        <div key={idx} className="image-item">
                        <img key={idx} src={img.dataUrl} alt={img.name} />
                        <button type="button" className="remove-btn" onClick={() => removeImage(idx)}>✕</button>
                        </div>
                    ))}
                </div>
                <button className="upload-outfit-btn" id="uploadOutfitBtn" disabled={imageList.length === 0} onClick={handleImageUpload} >Upload Outfits</button>
            </div>
        </div>
    )
}

export default UploadImages
