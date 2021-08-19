import useApiRequest from "../hooks/useRedditApi";
import { formattedPosts, sortBy } from "../utils/helpers";
import PostList from "../components/PostList/PostList";
import Loading from "../components/Loading/Loading";
import Error from "../components/Error/Error";
import { useParams } from "react-router-dom";
import Nav from "../components/Nav/Nav";

const Feed = () => {
    
    const { sub } = useParams()
    const { sort } = useParams()
    const subReddit = sub ? `r/${sub}` : ''

    const url = `https://www.reddit.com/${subReddit}/${sort ? sort : ''}.json?limit=50`
    const { isLoading, error, data, after, pagination , fetchRedditPosts } = useApiRequest(url)


    if(error) {
        return <Error errorMessage={error} handleError={() => fetchRedditPosts(url)}/>
    }

    return (
        <div>
            {isLoading && <Loading />}
            {sub && <h1 className='current-sub'>r/{sub}</h1>}
            <Nav links={sortBy(sub)}/>
            <PostList posts={formattedPosts(data)}/>
            {after && 
            <div className='ver-mais'>
                <button onClick={()=> fetchRedditPosts(pagination)}>Load More.</button>
            </div>
            }
        </div>
    );
}
 
export default Feed;