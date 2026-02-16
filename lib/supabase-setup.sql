-- Create bookmarks table
CREATE TABLE bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- Create policy for SELECT: Users can only read their own bookmarks
CREATE POLICY "Users can view their own bookmarks"
ON bookmarks
FOR SELECT
USING (auth.uid() = user_id);

-- Create policy for INSERT: Users can only insert their own bookmarks
CREATE POLICY "Users can insert their own bookmarks"
ON bookmarks
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create policy for DELETE: Users can only delete their own bookmarks
CREATE POLICY "Users can delete their own bookmarks"
ON bookmarks
FOR DELETE
USING (auth.uid() = user_id);

-- Create index for better query performance
CREATE INDEX bookmarks_user_id_idx ON bookmarks(user_id);
CREATE INDEX bookmarks_created_at_idx ON bookmarks(created_at DESC);