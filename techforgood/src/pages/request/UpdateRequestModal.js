import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { doc, updateDoc, getFirestore } from 'firebase/firestore'; // Import Firestore methods


const UpdateRequestModal = ({ isOpen, onRequestClose, modalContent, onSubmit }) => {
    const { register, handleSubmit, reset } = useForm();
    const [titleValue, setTitleValue] = useState("");

    useEffect(() => {
        if (isOpen && modalContent) { // Ensure modalContent is valid and modal is open
            reset({
                title: modalContent.title || '',
                description: modalContent.description || '',
                keywords: modalContent.keywords?.join(', ') || '', // Convert keywords array to comma-separated string
            });
        }
    }, [modalContent, isOpen, reset]);

    const onSubmitForm = async (data) => {
        try {
            const updatedRequest = {
                ...modalContent,
                ...data,
                keywords: data.keywords.split(',').map((kw) => kw.trim()), // Convert back to array
            };

            // Update the document in the requests collection
            const database = getFirestore(); // Use getFirestore() to initialize Firestore
            const requestDocRef = doc(database, 'requests', modalContent.id); // Reference to the document
            await updateDoc(requestDocRef, updatedRequest); // Update the document in Firestore

            onSubmit(updatedRequest); // Pass the updated request back to the parent
        } catch (error) {
            console.error('Error updating request:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div style={{ ...styles.modalOverlay }}>
            <style>
                {`
                    input, textarea {
                        font-family: 'Roboto', sans-serif;
                    }
                    input::placeholder, textarea::placeholder {
                        font-family: 'Roboto', sans-serif;
                    }

                `}
            </style>
            <div
                style={{
                    ...styles.modalContent,
                    width: 'auto', // Allow the modal to expand based on content
                    maxWidth: '90%', // Prevent it from becoming too wide
                    fontFamily: "Roboto, sans-serif",
                }}
            >
                <h2>Update Request</h2>
                <form onSubmit={handleSubmit(onSubmitForm)}>
                    <div style={styles.formGroup}>
                        <label htmlFor="title" style={{ display: 'block', marginBottom: '5px' }}>Title</label>
                        <input
                            type="text"
                            id="title"
                            defaultValue={modalContent?.title || ''}
                            {...register('title', { 
                                required: true,
                                maxLength: {
                                    value: 75,
                                },
                            })}
                            style={{ width: '500px' }}
                            value={titleValue}
                            onChange={(e) => {
                                setTitleValue(e.target.value);
                            }}
                        />
                    </div>
                    <span style={{ 
                        fontSize: '14px', 
                        color: 'red',
                        position: 'absolute',
                        transform: 'translateY(-200%) translateX(400%)',
                        width: '50px',                        
                        textAlign: 'right',
                        }}>
                        {titleValue.length}/75
                    </span>
                    <div style={styles.formGroup}>
                        <label htmlFor="description" style={{ display: 'block', marginBottom: '5px' }}>Description</label>
                        <textarea
                            id="description"
                            defaultValue={modalContent?.description || ''}
                            {...register('description', { required: true })}
                            style={{ width: '500px', height: '150px'}}
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label htmlFor="keywords" style={{ display: 'block', marginBottom: '5px' }}>Keywords (Separate by Commas)</label>
                        <input
                            id="keywords"
                            defaultValue={modalContent?.keywords?.join(', ') || ''}
                            {...register('keywords', { required: true })}
                            style={{ width: '500px' }}
                        />
                    </div>
                    <div style={styles.buttonGroup}>
                        <button type="submit">Update</button>
                        <button type="button" onClick={onRequestClose}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const styles = {
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '10px',
        width: '400px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    },
    formGroup: {
        marginBottom: '15px',
    },
    buttonGroup: {
        display: 'flex',
        justifyContent: 'space-between',
    },
};

export default UpdateRequestModal;
