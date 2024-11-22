import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'

export async function GET(req: Request) {
  const url = new URL(req.url)

  const session = await getAuthSession()

  let followedCommIds: string[] = []

  if (session) {
    const followedComms = await db.subscription.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        subreddit: true,
      },
    })

    followedCommIds = followedComms.map(({ subreddit }) => subreddit.id)
  }

  try {
    const { limit, page, subredditName } = z
      .object({
        limit: z.string(),
        page: z.string(),
        subredditName: z.string().nullish().optional(),
      })
      .parse({
        limit: url.searchParams.get('limit'),
        page: url.searchParams.get('page'),
        subredditName: url.searchParams.get('subredditName'),
      })

    let whereClause = {}

    if (subredditName) {
      whereClause = {
        subreddit: {
          name: subredditName,
        },
      }
    } else if (session) {
      whereClause = {
        subreddit: {
          id: {
            in: followedCommIds,
          },
        },
      }
    }

    const posts = await db.post.findMany({
      take: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(page),
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        author: true,
        comments: true,
        votes: true,
        subreddit: true,
      },
      where: whereClause,
    })

    return new Response(JSON.stringify(posts))
  } catch (error) {
    if (error instanceof z.ZodError)
      return new Response('Invalid request data passed', { status: 422 })

    return new Response('Could not fetch more posts', { status: 500 })
  }
}
