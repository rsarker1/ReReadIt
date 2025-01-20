import { Post, Vote, VoteType } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation'
import PostVoteClient from './PostVoteClient'

interface PostVoteServerProps {
  postId: string
  initialVotesAmt?: number
  initialVote: VoteType | null
  getData: () => Promise<(Post & { votes: Vote[] }) | null>
}

const PostVoteServer = async ({
  postId,
  initialVotesAmt: initialVotesAmt,
  initialVote: initialVote,
  getData,
}: PostVoteServerProps) => {
  const session = await getServerSession()

  let votesAmt: number = 0
  let currVote: VoteType | null | undefined = undefined

  if (getData) {
    const post = await getData()
    if (!post) return notFound()

    votesAmt = post.votes.reduce((acc, vote) => {
      if (vote.type === 'UP') return acc + 1
      if (vote.type === 'DOWN') return acc - 1
      return acc
    }, 0)

    currVote = post.votes.find((vote) => vote.userId === session?.user.id)?.type
  } else {
    votesAmt = initialVotesAmt!
    currVote = initialVote
  }

  return (
    <PostVoteClient
      postId={postId}
      initialVotesAmt={votesAmt}
      initialVote={currVote}
    />
  )
}

export default PostVoteServer
