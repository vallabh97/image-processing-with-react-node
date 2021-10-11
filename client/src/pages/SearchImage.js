import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Container } from "../components/Container";
import styled from "styled-components";
import { FlexRow } from "../components/FlexRow";
import { Button } from "../components/Button";
import { Image } from "../components/Image";
import { api } from "../services/unsplashApi";
import InfiniteScroll from "react-infinite-scroll-component";
import BeatLoader from "react-spinners/BeatLoader";
import Lightbox from "react-image-lightbox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faPen, faSearch } from "@fortawesome/free-solid-svg-icons";
import { IconHolder } from "../components/IconHolder";
import { post } from "../services/http";
import "react-image-lightbox/style.css";

const ImageLoader = styled.div`
  position: absolute;
  right: 0;
  left: 0;
  bottom: 0;
  top: 0;
  background: #00000063;
`;

const NotFound = styled.div`
  display: flex;
  height: 100%;
  align-items: center;
  color: #21212175;
  font-size: 22px;
`;

const ResponsiveHolder = styled(IconHolder)`
  @media screen and (max-width: 1000px) {
    width: 19px;
    height: 19px;
    bottom: 8px;

    svg {
      width: 12px !important;
      height: 12px;
    }
  }
`;

const SearchContainer = styled(Container)`
  margin: 0 20px;
`;

const SearchRow = styled(FlexRow)`
  margin: 30px 0 0 0;
`;

const TextInput = styled.input`
  outline: 0;
  flex-grow: 1;
  border-right: none;
  border-radius: 3px 0 0 3px;
  border: 2px solid #000;
  padding: 10px;
  font-size: 16px;
  max-width: 500px;

  @media screen and (max-width: 360px) {
    padding: 10px 6px;
    font-size: 14px;
  }
`;

const SearchButton = styled(Button)`
  width: auto;
  border-radius: 0 3px 3px 0;
  height: auto;
`;

const UnsplashText = styled(FlexRow)`
  justify-content: center;
  margin: 15px 0;
  color: #212121a3;
  font-size: 17px;
  
  .unsplash {
    color: black;
    text-decoration: underline;
  }
`;

const Photographer = styled.a`
  text-align: center;
  font-size: 13px;
  display: flex;
  justify-content: center;
  margin-top: 3px;
  color: #212121a3;
`;

const SearchResultContainer = styled(FlexRow)`
  height: calc(100vh - 95px);
  overflow: auto;
  flex-direction: column;
  align-items: center;
  padding-right: 10px;

  .infinite-scroll-component {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    overflow: auto;
    scroll-behavior: smooth;
  }

  ::-webkit-scrollbar {
    width: 3px;
    margin-right: 5px;
  }

  ::-webkit-scrollbar-thumb {
    background: #000;
  }

  ::-webkit-scrollbar-track {
    background: #00000017;
  }
`;

const ImageContainer = styled.div`
  padding: 0 0 20px 0;
  flex-basis: calc(25% - 15px);
  &:last-of-type {
    margin-right: auto;
  }

  @media screen and (max-width: 501px) {
    flex-basis: calc(50% - 10px);
  }

  @media screen and (min-width: 501px) and (max-width: 768px) {
    flex-basis: calc(33.33% - 10px);
  }
`;

const ImageHolder = styled.div`
  position: relative;
`;

const Loader = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  padding: 50px 0;
`;

const PenIcon = styled(ResponsiveHolder)`
  right: 38px;

  @media screen and (max-width: 1000px) {
    right: 31px;
  }
`;

const ArrowIcon = styled(ResponsiveHolder)`
  right: 8px;

  @media screen and (max-width: 1000px) {
    right: 6px;
  }
`;

const SearchIcon = styled.div`
  padding: 0 10px;
`;

const imageLoading = `
  position: absolute;
  top: calc(50% - 12px);
  left: calc(50% - 28px);
`;


export default function SearchImage() {
  const [searchText, updateSearchText] = useState('');
  const [searchResults, updateSearchResult] = useState([]);
  const [currentPage, updateCurrentPage] = useState(1);
  const [hasMorePages, updateHasMorePages] = useState(false);
  const [fetchingImages, updateFetchingImages] = useState(false);
  const [photoIndex, updatePhotoIndex] = useState(null);
  const [isLightboxOpen, updateIsLightboxOpen] = useState(false);
  const [showSearchIcon, updateShowSearchIcon] = useState(window.innerWidth <= 450);
  const [noImageFound, updateNoImageFound] = useState(false);

  const history = useHistory();

  const onWindowResize = () => {
    updateShowSearchIcon(window.innerWidth <= 450);
  };

  useEffect(() => {
    window.addEventListener('resize', onWindowResize);

    return () => {
      window.removeEventListener('resize', onWindowResize);
    };
  });

  const openImageInLightbox = (photoIndex) => {
    updatePhotoIndex(photoIndex);
    updateIsLightboxOpen(true);
  };

  const searchImages = () => {
    if (fetchingImages) {
      return;
    }
    updateCurrentPage(1);
    updateSearchResult([]);
    if (!searchText) {
      updateNoImageFound(false);
      return;
    }
    fetchImages(true);
  };

  const fetchImages = (newSearch) => {
    updateFetchingImages(true);
    updateCurrentPage((currentPage) => currentPage + 1);
    api.search
      .getPhotos({
        query: searchText,
        orientation: "landscape",
        page: currentPage,
        perPage: 20,
      })
      .then((res) => {
        if (newSearch) {
          updateNoImageFound(!!!res.response.results.length && !!searchText);
        } else {
          updateNoImageFound(!!!searchResults.length && !!!res.response.results.length && !!searchText);
        }
        updateSearchResult((old) => [...old, ...res.response.results]);
        updateHasMorePages((old) => res.response.total_pages > currentPage);
        updateFetchingImages(false);
      })
      .catch(() => {
        updateCurrentPage((currentPage) => --currentPage);
        updateFetchingImages(false);
        console.log("Something went wrong!");
      });
  };

  const downloadImage = (image, index) => {
    updateSearchItem(index, 'isDownloading', true);
    const imageName = (image.alt_description || searchText).split(' ').join('_') + '.jpg';
    const imageUrl = image.urls.regular;
    const trackDownload = {
      downloadLocation: image.links.download_location,
    };
    post('unsplash-proxy/track-downloads', trackDownload)
    .then((res) => {
      fetch(imageUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const a = document.createElement("a");
        a.style.display = "none";
        a.download = imageName;
        const reader = new FileReader();
        reader.onload = () => {
          a.href = reader.result;
          document.body.appendChild(a);
          setTimeout(() => {
            a.click();
          });
          updateSearchItem(index, 'isDownloading', false);
        };
        reader.readAsDataURL(blob);
      })
      .catch((err) => console.log(err));
    })
    .catch((err) => {
      console.log('Something went wrong!');
    });
  };

  const onImageLoad = (item, index) => {
    updateSearchItem(index, 'isLoaded', true);
  };

  const updateSearchItem = (itemIndex, itemProperty, propertyValue) => {
    const updatedResults = [...searchResults];
    updatedResults[itemIndex][itemProperty] = propertyValue;
    updateSearchResult(updatedResults);
  };

  const applyFilters = (image, index) => {
    updateSearchItem(index, 'isEditing', true);
    const trackDownload = {
      downloadLocation: image.links.download_location,
    };
    post("unsplash-proxy/track-downloads", trackDownload)
    .then((res) => {
      fetch(image.urls.regular)
      .then(res => res.blob())
      .then((blob) => {
        const reader = new FileReader();
        reader.onload = (result) => {
          sessionStorage.setItem("selectedImageSrc", reader.result);
          history.push("/apply-filters");
        };
        reader.readAsDataURL(blob);
      }).catch(err => {
        console.log(err);
      })
    })
    .catch(err => {
      console.log(err);
    });
  };

  return (
    <>
      <SearchContainer direction="column" alignItems="center" height="100%">
        <SearchRow justifyContent="center" width="100%">
          <TextInput
            placeholder="Enter keyword to search images..."
            onChange={(e) => updateSearchText(e.target.value)}
            onKeyUp={(e) => e.key === "Enter" && searchImages()}
          />
          <SearchButton onClick={(e) => searchImages()}>
            {showSearchIcon ? (
              <SearchIcon>
                <FontAwesomeIcon icon={faSearch} />
              </SearchIcon>
            ) : (
              "Search Images"
            )}
          </SearchButton>
        </SearchRow>
        {!!searchResults.length && (
          <UnsplashText>
            <div>
              Images have been fetched from{" "}
              <a
                href="https://unsplash.com/?utm_source=Image-Filter-with-react&utm_medium=referral"
                className="unsplash"
              >
                Unsplash
              </a>
            </div>
          </UnsplashText>
        )}
        <SearchResultContainer id="search-results-container">
          <InfiniteScroll
            dataLength={searchResults.length}
            next={() => fetchImages(false)}
            hasMore={hasMorePages}
            scrollableTarget="search-results-container"
          >
            {searchResults.map((item, index) => (
              <ImageContainer key={index}>
                <ImageHolder>
                  {(item.isDownloading || item.isEditing) && (
                    <ImageLoader>
                      <BeatLoader css={imageLoading} size={15} />
                    </ImageLoader>
                  )}
                  <Image
                    crossOrigin="anonymous"
                    cursor="pointer"
                    onClick={(e) => openImageInLightbox(index)}
                    onLoad={() => onImageLoad(item, index)}
                    alt="Image"
                    src={item.urls.regular}
                  />
                  {item.isLoaded && (
                    <PenIcon
                      title="Apply Filters"
                      onClick={(e) => applyFilters(item, index)}
                    >
                      <FontAwesomeIcon icon={faPen} size="1x" />
                    </PenIcon>
                  )}
                  {item.isLoaded && (
                    <ArrowIcon
                      title="Download Image"
                      onClick={(e) => downloadImage(item, index)}
                    >
                      <FontAwesomeIcon icon={faArrowDown} />
                    </ArrowIcon>
                  )}
                </ImageHolder>
                <Photographer
                  href={
                    "https://unsplash.com/" +
                    item.user.username +
                    "?utm_source=Image-Filter-with-react&utm_medium=referral"
                  }
                >
                  {item.user.name}
                </Photographer>
              </ImageContainer>
            ))}
          </InfiniteScroll>
          {fetchingImages && (
            <Loader>
              <BeatLoader loading={fetchingImages} size={20} />
            </Loader>
          )}

          { noImageFound && !fetchingImages && (<NotFound>No Image found!</NotFound>)}

          {isLightboxOpen && (
            <Lightbox
              mainSrc={searchResults[photoIndex].urls.regular}
              nextSrc={
                searchResults[(photoIndex + 1) % searchResults.length].urls
                  .regular
              }
              prevSrc={
                searchResults[
                  (photoIndex + searchResults.length - 1) % searchResults.length
                ].urls.regular
              }
              onCloseRequest={() => updateIsLightboxOpen(false)}
              onMovePrevRequest={() =>
                updatePhotoIndex(
                  (oldIndex) =>
                    (oldIndex + searchResults.length - 1) % searchResults.length
                )
              }
              onMoveNextRequest={() =>
                updatePhotoIndex(
                  (oldPhotoIndex) => (oldPhotoIndex + 1) % searchResults.length
                )
              }
            />
          )}
        </SearchResultContainer>
      </SearchContainer>
    </>
  );
}