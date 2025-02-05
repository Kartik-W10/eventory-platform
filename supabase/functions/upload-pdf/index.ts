import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file')
    const title = formData.get('title')
    const description = formData.get('description')
    const author = formData.get('author')

    if (!file || !title) {
      return new Response(
        JSON.stringify({ error: 'File and title are required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const sanitizedFileName = file.name.replace(/[^\x00-\x7F]/g, '')
    const fileExt = sanitizedFileName.split('.').pop()
    const filePath = `${crypto.randomUUID()}.${fileExt}`

    // Upload file to storage
    const { data: storageData, error: uploadError } = await supabase.storage
      .from('pdf-storage')
      .upload(filePath, file, {
        contentType: 'application/pdf',
        upsert: false
      })

    if (uploadError) {
      throw uploadError
    }

    // Insert record into pdfs table
    const { error: dbError } = await supabase
      .from('pdfs')
      .insert({
        title: title,
        description: description || null,
        file_path: filePath,
        thumbnail_path: null,
        author: author || null,
        views: 0,
        user_id: req.headers.get('x-user-id')
      })

    if (dbError) {
      throw dbError
    }

    return new Response(
      JSON.stringify({ message: 'PDF uploaded successfully', filePath }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Upload failed', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})