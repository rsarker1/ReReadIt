import { FC, useState } from 'react'
import { Button } from './ui/Button'
import { cn } from '@/lib/utils'

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

const UserAuthForm: FC<UserAuthFormProps> = ({ className, ...props }) => {
    
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const loginWithGoogle = async () => {
        setIsLoading(true)

        try {
            await signIn
        } catch(error) {

        }
    }

    return (
        <div className={cn('flex justify-center', className)} {...props}> 
            <Button size='sm' className='w-full'>Google</Button> 
        </div>
  )
}

export default UserAuthForm