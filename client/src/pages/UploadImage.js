import {useRef, useState} from 'react';
import { GridContainer } from "../components/GridContainer";
import styled from "styled-components";
import { FlexColumn } from '../components/FlexColumn';
import { Button } from '../components/Button';
import { useHistory } from 'react-router-dom';
import PageLoader from '../components/PageLoader';
import { Show } from '../components/Show';

const FileInput = styled.input`
  display: none;
`;

const UploadButton = styled.div`
  background: #000;
  color: #fff;
  border: none;
  border-radius: 3px;
  font-size: 18px;
  padding: 10px;
  cursor: pointer;
  font-family: Roboto-light;
  margin-bottom: 25px;
`;

const SelectedImage = styled.img`
  display: none;
  width: 400px;
  height: 400px;

  @media screen and (max-width: 450px) {
    width: 300px;
    height: 300px;
  }
`;

export default function UploadImage() {
  const selectedImageRef = useRef(null);
  const [uploadedImage, updateUploadedImage] = useState(false);
  const [showPageLoader, updateShowPageLoader] = useState(false);
  const history = useHistory();
  const reader = new FileReader();
  
  const onImageSelect = (event) => {
    const files = [...event.target.files];
    if (files.length && files[0].type.includes('image')) {
      const file = files[0];
      reader.onload = (e) => {
        if (selectedImageRef) {
          selectedImageRef.current.src = e.target.result;
          selectedImageRef.current.alt = file.name;
          selectedImageRef.current.style.display = "inline";
          updateUploadedImage(true);
        }
      };
      updateShowPageLoader(true);
      reader.readAsDataURL(file);
    }
  };

  const applyFilters = () => {
    sessionStorage.setItem('selectedImageSrc', selectedImageRef.current.src);
    history.push('/apply-filters');
  };

  return (
    <>
      {showPageLoader && <PageLoader />}
      <Show show={!showPageLoader}>
        <GridContainer height="100%">
          <SelectedImage
            onLoad={(e) => updateShowPageLoader(false)}
            ref={selectedImageRef}
            src="#"
            alt="Selected"
          />
          <FlexColumn>
            <div>
              <FileInput
                onChange={(e) => onImageSelect(e)}
                type="file"
                accept="image/png, image/jpeg"
                id="file-upload-input"
              />
              <label htmlFor="file-upload-input">
                <UploadButton>
                  {uploadedImage ? "Upload another image" : "Upload Image"}
                </UploadButton>
              </label>
            </div>

            {uploadedImage && (
              <Button onClick={(e) => applyFilters()}>
                Apply image filters
              </Button>
            )}
          </FlexColumn>
        </GridContainer>
      </Show>
    </>
  );
}
