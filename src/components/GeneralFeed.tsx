import { INF_SCROLL_PAGINATION_RESULTS } from '@/config'
import { db } from '@/lib/db'
import PostFeed from './ui/PostFeed'

const GeneralFeed = async () => {
    const posts = await db.post.findMany({
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            votes: true,
            author: true,
            comments: true,
            subreddit: true
        },
        take: INF_SCROLL_PAGINATION_RESULTS
    })

    return <PostFeed initialPosts={posts}/>
}

export default GeneralFeed