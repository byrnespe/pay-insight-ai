-- Create a private bucket for PDF salary reports
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'salary-reports',
  'salary-reports',
  false,
  5242880,
  ARRAY['text/html', 'application/pdf']
);

-- RLS Policy: Users can view their own reports
CREATE POLICY "Users can view own reports"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'salary-reports' AND (storage.foldername(name))[1] = auth.uid()::text);

-- RLS Policy: Users can upload to their own folder
CREATE POLICY "Users can upload own reports"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'salary-reports' AND (storage.foldername(name))[1] = auth.uid()::text);

-- RLS Policy: Users can delete their own reports
CREATE POLICY "Users can delete own reports"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'salary-reports' AND (storage.foldername(name))[1] = auth.uid()::text);