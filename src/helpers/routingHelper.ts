// @ts-ignore
import {Navigate} from '@tanstack/react-router'

export const navigateToRoute = async (path: string, search?: Record<string, string>) => {
    try {
        Navigate({
            to: path,
            search,
        })
    } catch (error) {
        console.error('Navigation failed:', error)
        throw error
    }
}