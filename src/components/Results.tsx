import React, { useState } from "react";
import Modal from "./Modal";

const Results = ({ photos }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const closeModal = () => {
    setSelectedImage(null);
    setShowModal(false);
  };

  return (
    <div className="searchResults">
      {!photos.length || !photos[0] ? (
        <h1>No Photos Found</h1>
      ) : (
        photos.map((photo, index) => {
          return (
            <div key={photo.id + index}>
              <img
                src={photo.urls.regular}
                onClick={() => {
                  setSelectedImage(photo);
                  setShowModal(true);
                }}
              />

              {showModal ? (
                <Modal open={showModal}>
                  <button
                    onClick={() => {
                      closeModal();
                    }}
                  >
                    Back
                  </button>
                  <div className="container">
                    <img
                      src={selectedImage.urls.full}
                      onClick={() => {
                        closeModal();
                      }}
                    />
                    <div>Likes: {selectedImage.likes}</div>
                    <div>Downloads: {Math.round(Math.random() * 100)}</div>
                    <div>
                      Views:{" "}
                      {Math.round(Math.random() * 1000 + selectedImage.likes)}
                    </div>
                  </div>
                </Modal>
              ) : null}
            </div>
          );
        })
      )}
    </div>
  );
};

export default Results;
