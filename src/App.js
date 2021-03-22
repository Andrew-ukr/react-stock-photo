import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import Photo from "./Photo";
const clientID = `?client_id=${process.env.REACT_APP_ACCESS_KEY}`;
const mainUrl = `https://api.unsplash.com/photos/`;
const searchUrl = `https://api.unsplash.com/search/photos/`;

function App() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");

  const getData = async () => {
    setLoading(true);
    const curentPage = `&page=${page}`;
    const queryPage = `&query=${query}`;
    let defaultUrl = `${mainUrl}${clientID}${curentPage}`;
    let searchingUrl = `${searchUrl}${clientID}${curentPage}${queryPage}`;

    try {
      const res = await fetch(query ? searchingUrl : defaultUrl); // якщо запит порожній то беремо один шлях , якщо ні
      const data = await res.json();
      setPhotos((photosOld) => {
        if (query && page === 1) {
          return data.results;
        } else if (!query && page === 1) {
          return data;
        } else if (query) {
          return [...photosOld, ...data.results]; // для офекту доповнення при скролі до попередніх фото додаємо нові
        } else {
          return [...photosOld, ...data]; // для офекту доповнення при скролі до попередніх фото додаємо нові
        }
      });
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, [page]);

  useEffect(() => {
    const event = window.addEventListener("scroll", () => {
      if (
        !loading &&
        window.innerHeight + window.scrollY >= document.body.scrollHeight - 2
      ) {
        setPage((pageOld) => {
          return pageOld + 1;
        });
      }
    });

    return () => window.removeEventListener("scroll", event);
  }, []); // ставими пусті скобки event спрацював лише один раз

  const handleClick = (e) => {
    e.preventDefault();
    setPage(1);
    if (page === 1) {
      getData();
    }
  };

  return (
    <main>
      <section className="search">
        <form className="search-form">
          <input
            className="form-input"
            type="text"
            placeholder="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="submit-btn" onClick={handleClick}>
            <FaSearch></FaSearch>
          </button>
        </form>
      </section>
      <section className="photos">
        <div className="photos-center">
          {photos.map((item, i) => (
            <Photo key={`${item.id}${i}`} {...item}></Photo>
          ))}
        </div>
        {loading && <h2 className="loading">Loading...</h2>}
      </section>
    </main>
  );
}

export default App;
