/* eslint-disable no-use-before-define */
import { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { Container } from '../components/Container';
import { useHistory } from 'react-router-dom';
import { Show } from '../components/Show';
import Jimp from 'jimp';
import styled from 'styled-components';
import { Button } from '../components/Button';
import BeatLoader from "react-spinners/BeatLoader";
import PageLoader from '../components/PageLoader';

const DownloadImageContainer = styled.div`
  canvas, img {
    display: none;
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  height: auto;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;

  div.image-holder {
    position: relative;
  }

  canvas {
    box-shadow: 0 0px 8px 4px #0000008a;
  }
`;

const FiltersContainer = styled.div`
  display: flex;
  overflow-x: auto;
  scroll-behavior: smooth;
  -ms-overflow-style: none;
  scrollbar-width: none;

  ::-webkit-scrollbar {
    display: none;
  }
`;

const ImageFilter = styled.img`
  width: ${(props) => (props.width ? props.width : "100")}px;
  height: ${(props) => (props.height ? props.height : "100")}px;
  cursor: pointer;
  border-radius: 4px;
`;

const ImageView = styled.img`
  width: ${props => props.width ? props.width : '400'}px;
  height: ${props => props.height ? props.height : '400'}px;
`;

const FilterContainer = styled.div`
  margin: 0 ${props => props.sideMargin ? props.sideMargin : '10'}px;

  canvas {
    cursor: pointer;
    border: 3px solid transparent;
    border-radius: 10px;
    margin: 10px 0;
  }

  &.selected-filter {
    canvas {
      border-color: white;
      box-shadow: 0 0px 8px 4px #0000008a;
    }
  }
`;

const Filter = styled.div `
  text-align: center;
  font-size: 13px;
  font-family: Roboto-medium;
`;

const Slider = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 0 15px 0;
  color: #000;

  svg {
    color: #000;
    cursor: pointer;
    margin: 0 8px;
    
    @media screen and (max-width: 767px) {
      width: 12px !important;
    }
  }
`;

const HiddenCanvas = styled.canvas`
  display: none;
`;

export default function ApplyFilters () {
  const history = useHistory();
  const selectedImageRef = useRef(null);
  const viewImageContainerRef = useRef(null);
  const downloadImageRef = useRef(null);
  const hiddenCanvasRef = useRef(null);
  const filterSlide = useRef(null);
  const [imageFilters, updateImageFilters] = useState([]);
  const [originalImageSrc, updateOriginalImageSrc] = useState('');
  const [viewImageSrc, updateViewImageSrc] = useState(null);
  const [filterImageSrc, updateFilterImageSrc] = useState('');
  const [viewCanvasContext, updateViewCanvasContext] = useState(null);
  const [selectedFilter, updateSelectedFilter] = useState('');
  const [isSmallScreen, updateIsSmallScreen] = useState(window.innerWidth <= 767);
  const [filterWidth] = useState(isSmallScreen ? 70 : 100);
  const [filterHeight] = useState(isSmallScreen ? 70 : 100);
  const [viewImageWidth] = useState(isSmallScreen ? 300 : 400);
  const [viewImageHeight] = useState(isSmallScreen ? 300 : 400);
  const [showDownload, updateShowDownload] = useState(false);
  const [isDownloading, updateIsDownloading] = useState(false);
  const [initializing, updateInitializing] = useState(true);

  const onWindowResize = () => {
    updateIsSmallScreen(window.innerWidth <= 767);
  };

  useEffect(() => {
    window.addEventListener('resize', onWindowResize);

    return () => {
      window.removeEventListener('resize', onWindowResize);
    };
  });

  const setOriginalImageSrc = () => {
    const originalImageSrc = sessionStorage.getItem("selectedImageSrc");
    if (!originalImageSrc) {
      redirectUserToUploadImage();
    } else {
      updateOriginalImageSrc(originalImageSrc);
      resizeOriginalImage(originalImageSrc);
    }
  }; 

  const getAllFilters = () => {
    const filters = window.pixelsJS.getFilterList();
    updateImageFilters(filters.reverse());
    updateSelectedFilter(filters[0]);
    if (selectedImageRef.current) {
      applyFilterToSelectedImage(filters[0], "image");
    }
  };

  useEffect(() => {
    const scriptFound = document.getElementById("pixelJsScript");
    if (!scriptFound) {
      const script = document.createElement("script");
      script.id = "pixelJsScript";
      script.src =
        "https://cdn.jsdelivr.net/gh/silvia-odwyer/pixels.js@0.8.1/dist/Pixels.js";
      script.async = true;
      script.onload = (e) => {
        getAllFilters();
      };
      document.body.appendChild(script);
    } else {
      getAllFilters();
    }
    setOriginalImageSrc();
    // eslint-disable-next-line

    return () => {
      window.sessionStorage.removeItem("selectedImageSrc");
    };
    // eslint-disable-next-line
  }, []);

  const resizeOriginalImage = (imageSrc) => {
    const originalImageBuffer = Buffer.from(imageSrc.split(",")[1], "base64");
    Jimp.read(originalImageBuffer)
      .then((image) => {
        resizeImageForView(image);
        resizeImageForFilters(image);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const resizeImageForFilters = async (jimpImage) => {
    const resizedImage = await jimpImage.resize(filterWidth, filterHeight);
    resizedImage
      .getBase64Async(Jimp.AUTO)
      .then((imageSrc) => {
        updateFilterImageSrc(imageSrc);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const drawOriginalImageOnCanvas = (imgSrc) => {
    const img = new window.Image();
    img.onload = () => {
      const canvasContext = hiddenCanvasRef.current.getContext('2d');
      hiddenCanvasRef.current.width = img.width;
      hiddenCanvasRef.current.height = img.height;
      canvasContext.drawImage(img, 0, 0, img.width, img.height);
    };
    img.src = imgSrc;    
  };

  const resizeImageForView = (jimpImage) => {
    const resizedImage = jimpImage.resize(viewImageWidth, viewImageHeight);
    resizedImage.getBase64Async(Jimp.AUTO)
    .then((imageSrc) => {
      updateViewImageSrc(imageSrc);
    })
    .catch(err => {
      console.log(err);
    });
  };

  const onHiddenCanvasLoad = () => {
    if (viewImageSrc) drawOriginalImageOnCanvas(viewImageSrc);
  };

  useEffect(() => {
    if (hiddenCanvasRef.current) {
      drawOriginalImageOnCanvas(viewImageSrc);
    }
  }, [viewImageSrc]);

  const redirectUserToUploadImage = () => {
    history.push("/home");
  };

  const applyFilterOnCanvas = (canvasContext, filterName) => {
    if (!canvasContext) return;
    const hiddenCanvasContext = hiddenCanvasRef.current.getContext("2d");
    const imgData = hiddenCanvasContext.getImageData(0, 0, canvasContext.canvas.width, canvasContext.canvas.height);
    const newImageData = window.pixelsJS.filterImgData(imgData, filterName);
    canvasContext.putImageData(newImageData, 0, 0);
  };

  const applyFilterToSelectedImage = (filterName, applyTo) => {
    if (applyTo === "image") {
      if (
        selectedImageRef.current.complete &&
        selectedImageRef.current.naturalHeight !== 0
      ) {
        applyFilter(selectedImageRef.current, filterName);
      } else {
        selectedImageRef.current.onload = () => {
          applyFilter(selectedImageRef.current, filterName);
        };
      }
    } else if (applyTo === "canvas") {
      if (!viewCanvasContext) {
        const childNodes = Array.from(viewImageContainerRef.current.childNodes);
        const viewCanvas = childNodes.find(
          (node) => node.nodeName === "CANVAS"
        );
        if (viewCanvas) {
          const canvasContext = viewCanvas.getContext("2d");
          updateViewCanvasContext(canvasContext);
          applyFilterOnCanvas(canvasContext, filterName);
        }
      } else {
        applyFilterOnCanvas(viewCanvasContext, filterName);
      }
    }
    updateSelectedFilter(filterName);
  };

  const onImageLoad = (filterName) => {
    const imageId = `${filterName}-img`;
    const respectedImage = document.getElementById(imageId);
    if (respectedImage) {
      applyFilter(respectedImage, filterName);
    }
  };

  const applyFilter = (image, filterName) => {
    setTimeout(() => {
      window.pixelsJS.filterImg(image, filterName);
    });
  }

  const scrollForward = () => {
    if (filterSlide.current.scrollWidth - filterSlide.current.scrollLeft) {
      filterSlide.current.scrollLeft += (filterSlide.current.clientWidth - 30); 
    }
  };

  const scrollReverse = () => {
    if (filterSlide.current.scrollLeft) {
      filterSlide.current.scrollLeft -= (filterSlide.current.clientWidth - 30);
    }
  };

  const downloadImage = () => {
    updateIsDownloading(true);
    const imageName = Math.random().toString(36).substr(2,5);
    const image = new window.Image();
    image.onload = () => {
      applyFilter(image, selectedFilter);
    };
    const nodeForMutationObserver = downloadImageRef.current;
    const observer = new MutationObserver((mutations, observer) => {
      mutations.forEach((mutation) => {
        const canvas = Array.from(mutation.addedNodes).find((node) => node.nodeName === 'CANVAS');
        if (canvas) {
          observer.disconnect();
          const imageData = canvas.toDataURL();
          const a = document.createElement("a");
          a.style.display = "none";
          a.href = imageData;
          a.download = `${imageName}.jpg`;
          document.body.appendChild(a);
          a.click();
          downloadImageRef.current.removeChild(canvas);
          updateIsDownloading(false);
        }
      });
    });
    observer.observe(nodeForMutationObserver, {childList: true});
    image.src = originalImageSrc;
    downloadImageRef.current.appendChild(image);
  };

  const onViewImageLoad = () => {
    if (selectedFilter) {
      applyFilterToSelectedImage(selectedFilter, 'image');
    }
    updateShowDownload(true);
    updateInitializing(false);
  };

  return (
    <Container height="100%" direction="column" alignItems="unset">
      {initializing && (
        <PageLoader />
      )}

      <ImageContainer>
        <div className="image-holder" ref={viewImageContainerRef}>
          {viewImageSrc && (
            <ImageView
              width={viewImageWidth}
              height={viewImageHeight}
              crossOrigin="anonymous"
              ref={selectedImageRef}
              src={viewImageSrc}
              alt="#"
              onLoad={(e) => onViewImageLoad()}
            />
          )}
        </div>

        {showDownload && (
          <Button
            disabled={isDownloading}
            width="150px"
            onClick={(e) => downloadImage()}
          >
            {isDownloading ? (
              <BeatLoader color="#fff" loading={isDownloading} size={12} />
            ) : (
              "Download"
            )}
          </Button>
        )}
      </ImageContainer>

      <DownloadImageContainer ref={downloadImageRef}></DownloadImageContainer>
      <HiddenCanvas
        onLoad={(e) => onHiddenCanvasLoad()}
        ref={hiddenCanvasRef}
      />

      <Slider>
        <Show show={!!filterImageSrc && !isSmallScreen}>
          <FontAwesomeIcon
            onClick={(e) => scrollReverse()}
            icon={faAngleLeft}
            size="3x"
          />
        </Show>

        <FiltersContainer ref={filterSlide}>
          {imageFilters.map((filter) => (
            <FilterContainer
              sideMargin={isSmallScreen ? "3" : "10"}
              onClick={(e) => applyFilterToSelectedImage(filter, "canvas")}
              id={`${filter}-container`}
              key={filter}
              className={selectedFilter === filter ? "selected-filter" : ""}
            >
              <Show show={!!filterImageSrc}>
                <ImageFilter
                  width={filterWidth}
                  height={filterHeight}
                  id={`${filter}-img`}
                  src={filterImageSrc}
                  alt={filter}
                  onLoad={(e) => onImageLoad(filter)}
                />
                <Filter>{filter.split("_").join(" ")}</Filter>
              </Show>
            </FilterContainer>
          ))}
        </FiltersContainer>

        <Show show={!!filterImageSrc && !isSmallScreen}>
          <FontAwesomeIcon
            onClick={(e) => scrollForward()}
            icon={faAngleRight}
            size="3x"
          />
        </Show>
      </Slider>
    </Container>
  );
}