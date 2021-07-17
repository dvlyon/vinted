import { useCallback, useEffect, useRef, useState } from 'react'
import useFetch from '../hooks/useFetch'
import useLocalStorage from '../hooks/useLocalStorage'
import Photo from './Photo'
import Loader from './Loader'
import './Gallery.scss'

const Gallery = () => {
  const [page, setPage] = useState(0)

  const [favourites, setFavourites] = useLocalStorage({
    key: 'dvlyon-vinted-favs',
    defaultValue: [],
  })

  const { data, error, loading } = useFetch(page)

  const infiniteLoader = useRef<null | HTMLDivElement>(null)

  const handleObserver = useCallback(entries => {
    const target = entries[0]
    if (target.isIntersecting) {
      setPage(prev => prev + 1)
    }
  }, [])

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '20px',
      threshold: 0,
    }

    const observer = new IntersectionObserver(handleObserver, options)

    if (infiniteLoader.current) observer.observe(infiniteLoader.current)

    return () => observer.disconnect()
  }, [handleObserver])

  const addFav = (id: string) => {
    const index = favourites.indexOf(id)
    const newFavourites = [...favourites]
    if (index >= 0) {
      newFavourites.splice(index, 1)
    } else {
      newFavourites.push(id)
    }
    setFavourites(newFavourites)
  }

  return (
    <div className='Gallery'>
      <div className='PhotoWrapper'>
        { data.map((photo, i) => {
          const isFav = favourites.indexOf(photo.id) >= 0

          return (
            <Photo
              key={i} 
              photo={photo}
              isFav={isFav}
              addFav={addFav}
            />
          )
        }) }
      </div>
      { error && <div>Error!!!</div> }
      { loading && <div>Loading...</div> }
      <div ref={infiniteLoader} />
      <Loader />
    </div>
  )
}

export default Gallery
