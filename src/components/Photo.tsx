import { useCallback, useEffect, useRef, useState } from 'react'
import Heart from './Heart'
import './Photo.scss'

interface IPhoto {
  photo: any
  isFav: boolean
  addFav: (id: string) => void
}

const Photo = (props: IPhoto) => {
  const { photo, isFav, addFav } = props

  const [name, setName] = useState(`User ${photo.owner}`)

  const photoRef = useRef<null | HTMLImageElement>(null)

  const fetchData = useCallback(async () => {
    await fetch(`https://www.flickr.com/services/rest/?method=flickr.profile.getProfile&api_key=a3a4c4d1713708b3a7eb447250a9ce2a&user_id=${photo.owner}&format=json&nojsoncallback=1`)
      .then(res => res.json())
      .then(
        result => {
          if (result.profile.first_name || result.profile.last_name) {
            setName(`${result.profile.first_name} ${result.profile.last_name}`)
          }
        }
      )
  }, [photo.owner])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleObserver = useCallback(entries => {
    const target = entries[0]
    if (target.isIntersecting && photoRef.current) {
      photoRef.current.src = `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`
    }
  }, [photo.id, photo.secret, photo.server])

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '20px',
      threshold: 0,
    }

    const observer = new IntersectionObserver(handleObserver, options)

    if (photoRef.current) observer.observe(photoRef.current)

    return () => observer.disconnect()
  }, [handleObserver])

  const onFavourite = () => {
    addFav(photo.id)
  }

  return (
    <div className='photo-outer'>
      <div className='photo'>
        <img
          ref={photoRef}
          src={`https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_s.jpg`}
          alt={photo.title}
        />
        {isFav && <Heart />}
        <div className='photo-inner'>
          <div className='info'>
            <div className='title'>{ photo.title }</div>
            <hr className='divider' />
            <div className='name'>{ name }</div>
          </div>
          <div className='fav-wrapper'>
            <input
              type='button'
              className='favourite'
              onClick={onFavourite}
              value={isFav ? 'Unfavourite' : 'Favourite'}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Photo
