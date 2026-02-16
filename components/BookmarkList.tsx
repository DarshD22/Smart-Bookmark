'use client'

import { useEffect, useState } from 'react'
import { supabase, type Bookmark } from '@/lib/supabaseClient'

interface BookmarkListProps {
  userId: string
}

export default function BookmarkList({ userId }: BookmarkListProps) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('bookmarks')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })

        if (fetchError) throw fetchError

        setBookmarks(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch bookmarks')
      } finally {
        setLoading(false)
      }
    }

    // Initial fetch
    fetchBookmarks()

    // Poll for changes every 2 seconds
    const pollInterval = setInterval(() => {
      fetchBookmarks()
    }, 2000)

    // Cleanup function - stop polling when component unmounts
    return () => {
      clearInterval(pollInterval)
    }
  }, [userId])

  const handleDelete = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('bookmarks')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError
    } catch (err) {
      console.error('Error deleting bookmark:', err)
      alert('Failed to delete bookmark')
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center text-gray-600">Loading bookmarks...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center text-red-600">{error}</div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Your Bookmarks ({bookmarks.length})
      </h2>

      {bookmarks.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No bookmarks yet. Add your first bookmark above!
        </div>
      ) : (
        <div className="space-y-3">
          {bookmarks.map((bookmark) => (
            <div
              key={bookmark.id}
              className="flex items-start justify-between p-4 border border-gray-200 rounded-md hover:border-gray-300 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 truncate">
                  {bookmark.title}
                </h3>
                <a
                  href={bookmark.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline truncate block mt-1"
                >
                  {bookmark.url}
                </a>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(bookmark.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              
              <button
                onClick={() => handleDelete(bookmark.id)}
                className="ml-4 px-3 py-1 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}