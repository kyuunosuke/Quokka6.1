import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get current date in UTC
    const currentDate = new Date().toISOString().split('T')[0]
    
    // Update competitions where end_date is today or in the past
    // and status is not already 'completed' or 'cancelled'
    const { data, error } = await supabase
      .from('competitions')
      .update({ 
        status: 'completed',
        updated_at: new Date().toISOString()
      })
      .lte('end_date', currentDate)
      .not('status', 'in', '(completed,cancelled)')
      .select('id, title, end_date, status')

    if (error) {
      console.error('Error updating competition statuses:', error)
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: error.message 
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    const updatedCount = data?.length || 0
    
    console.log(`Updated ${updatedCount} competitions to completed status`)
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Successfully updated ${updatedCount} competitions to completed status`,
        updatedCompetitions: data
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'An unexpected error occurred' 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})