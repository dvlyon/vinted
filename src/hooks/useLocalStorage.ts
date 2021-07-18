import { useEffect, useState } from 'react'

interface IuseLocalStorage {
  key: string
  defaultValue: any
}

const useLocalStorage = (props: IuseLocalStorage) => {
  const { key, defaultValue } = props

  const [value, setValue] = useState(defaultValue)

  const setLocalStorageValue = async (newValue: any) => {
    try {
      await localStorage.setItem(key, JSON.stringify(newValue))
    } catch (e) {
      console.error(e)
    }

    setValue(newValue)
  }

  useEffect(() => {
    const getLocalStorageValue = async () => {
      try {
        const jsonValue = await localStorage.getItem(key)

        if (jsonValue) {
          setValue(JSON.parse(jsonValue))
        }
      } catch(e) {
        console.error(e)
      }
    }

    getLocalStorageValue()
  }, [key])

  return [value, setLocalStorageValue]
}

export default useLocalStorage
