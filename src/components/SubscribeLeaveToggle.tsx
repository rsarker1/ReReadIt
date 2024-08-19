'use client'

import { FC } from 'react'
import { Button } from './ui/Button'
import { useMutation } from '@tanstack/react-query'
import { SubscribeToSubredditPayload } from '@/lib/validators/subreddit'
import axios, { AxiosError } from 'axios'
import { useCustomToast } from '@/hooks/use-custom-toast'

interface SubscribeLeaveToggleProps {
  subredditId: string
}

const SubscribeLeaveToggle: FC<SubscribeLeaveToggleProps> = ({
  subredditId,
}) => {
  const isSubscribed = false
  const { loginToast } = useCustomToast()

  const {} = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSubredditPayload = {
        subredditId,
      }

      const { data } = await axios.post('/api/subreddit/subscribe', payload)
      return data as string
    },
    onError: (err) => {
      if (err instanceof AxiosError)
        if (err.response?.status === 401) return loginToast()
    },
  })

  return isSubscribed ? (
    <Button className='w-full mt-1 mb-4'>Leave Community</Button>
  ) : (
    <Button className='w-full mt-1 mb-4'>Join to post</Button>
  )
}

export default SubscribeLeaveToggle
