import useSWR from 'swr'

const fetcher = (url: string) =>
  fetch(url)
    .then((res) => res.json())
    .then((json) => {
      return json
    })

const useSwrFetcher = (url: string) => {
  return useSWR(url, fetcher)
}
export default fetcher
