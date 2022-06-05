import { useState, useEffect } from 'react';
import { Searchbar } from './Searchbar';
import { ApiService } from './services/api';
import { ImageGallery } from './ImageGallery';
import { Modal } from './Modal';
import { Button } from './Button';
import { Loader } from './Loader';

const apiService = new ApiService();

export const App = () => {
  const [imageArr, setImageArr] = useState([]);
  const [query, setQuery] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [largeImageURL, setLargeImageURL] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!query) {
      return;
    }
    if (error) {
      alert('Something went wrong :(');
      return;
    }
    apiService.query = query;
    setImageArr([]);
    onFetchImage();
  }, [query, error]);

  useEffect(() => {
    if (page === 1) {
      return;
    }
    if (error) {
      alert('Something went wrong :(');
      return;
    }
    onLoadImage();
  }, [page, error]);

  const onSearch = newQuery => {
    apiService.resetPage();
    setQuery(newQuery);
  };

  const onToggleModal = () => {
    setShowModal(!showModal);
  };

  const onClickImg = event => {
    setLargeImageURL(
      imageArr.find(img => img.webformatURL === event.target.src).largeImageURL
    );
  };

  const onFetchImage = async () => {
    setIsLoading(true);

    try {
      const imageArr = await apiService.fetchImage();
      setImageArr(
        imageArr.map(({ id, webformatURL, largeImageURL }) => ({
          id,
          webformatURL,
          largeImageURL,
        }))
      );
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onLoadImage = async () => {
    setIsLoading(true);

    try {
      const imageArr = await apiService.fetchImage();
      setImageArr(
        imageArr.map(({ id, webformatURL, largeImageURL }) => ({
          id,
          webformatURL,
          largeImageURL,
        }))
      );
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
  };

  return (
    <>
      <Searchbar onSubmit={onSearch} />
      {isLoading && imageArr.length < 12 && <Loader />}
      {imageArr.length >= 12 && (
        <ImageGallery
          onClickImg={onClickImg}
          images={imageArr}
          onToggleModal={onToggleModal}
        />
      )}
      {showModal && <Modal onToggleModal={onToggleModal} img={largeImageURL} />}

      {isLoading && imageArr.length > 0 && <Loader />}

      {imageArr.length >= 12 && !isLoading && (
        <Button onLoadMore={onLoadMore} />
      )}
    </>
  );
};
