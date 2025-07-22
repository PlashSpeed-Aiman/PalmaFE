import React from 'react'
import { router } from '@/main'

export const navigateToRoute = (path: string) => {
    return (event: React.MouseEvent) => {
        event.preventDefault()
        try {
            router.navigate({ to: path })
        } catch (error) {
            console.error('Navigation failed:', error)
        }
    }
}
