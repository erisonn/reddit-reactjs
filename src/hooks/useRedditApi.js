import { useEffect, useRef, useState } from "react"

const useRedditApi = url => {

    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [data, setData] = useState([])
    const [after, setAfter] = useState(null)

    const pagination = after ? url + `&after=${after}&count=10` : ''

    const isPaginating = useRef(null)

    const fetchRedditPosts = (url) => {
        setIsLoading(true)
        if(error) {
            setError(null)
        }
        fetch(url)
        .then(response => response.json())
        .then(posts => {
            setAfter(posts.data.after)
            if(!posts.data.before) {
                isPaginating.current = false
                setData(posts.data.children)
            } else {
                isPaginating.current = true
                setData([...data, ...posts.data.children])
            }
        })   
        .catch(error => {
            console.log(error)
            setError('Our CDN was unable to reach our servers.')
        })
        .finally(() => {
            setIsLoading(false)
        })
    }

    const handleLoadMorePosts = () => {
        fetchRedditPosts(pagination)
    }

    useEffect(() => {
        setIsLoading(true)
        fetchRedditPosts(url)
        
        if(isPaginating) return;
        window.scrollTo(0, 0)
    }, [url]) // eslint-disable-line

    return { isLoading, error, data, after, isPaginating , fetchRedditPosts, handleLoadMorePosts }
}

export default useRedditApi;