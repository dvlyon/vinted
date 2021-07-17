import { useCallback, useEffect, useRef, useState } from 'react'
import useFetch from '../hooks/useFetch'
import Photo from './Photo'
import './Gallery.scss'

const Gallery = () => {
  const [page, setPage] = useState(0)

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

  return (
    <div className='Gallery'>
      <div className='PhotoWrapper'>
        { data.map((photo, i) => <Photo key={i} photo={photo} />) }
      </div>
      { error && <div>Error!!!</div> }
      { loading && <div>Loading...</div> }
      <div ref={infiniteLoader} />
    </div>
  )
}

export default Gallery
