import './Photo.scss'

const Photo = (data: any) => {
  const { photo } = data

  return (
    <div className='Photo'>
      <img
        src={`https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_w.jpg`}
        alt={JSON.stringify(photo)}
      />
    </div>
  )
}

export default Photo
