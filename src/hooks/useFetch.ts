import { useCallback, useEffect, useState } from 'react'

const useFetch = (page: number) => {
  const [data, setData] = useState<any[]>([])
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(false)
    await fetch(`https://www.flickr.com/services/rest/?method=flickr.photos.getRecent&api_key=a3a4c4d1713708b3a7eb447250a9ce2a&page=${page}&format=json&nojsoncallback=1`)
      .then(res => res.json())
      .then(
        result => {
          setData(prev => [...prev, ...result.photos.photo])
        },
        error => {
          setError(error)
        }
      )
    setLoading(false)
  }, [page])

  useEffect(() => {
    if (page > 0) fetchData()
  }, [fetchData, page])

  return { data, error, loading }
}

export default useFetch
