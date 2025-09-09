import { createClient } from '@/lib/supabase'

export async function updateCompetitionStatuses() {
  const supabase = createClient()
  
  try {
    // Call the edge function to update competition statuses
    const { data, error } = await supabase.functions.invoke('supabase-functions-update-competition-status')
    
    if (error) {
      console.error('Error calling update function:', error)
      return { success: false, error: error.message }
    }
    
    return data
  } catch (error) {
    console.error('Unexpected error:', error)
    return { success: false, error: 'Failed to update competition statuses' }
  }
}

export async function getExpiredCompetitions() {
  const supabase = createClient()
  
  try {
    const currentDate = new Date().toISOString().split('T')[0]
    
    // Get competitions that should be completed but aren't
    const { data, error } = await supabase
      .from('competitions')
      .select('id, title, end_date, status, organizer_name')
      .lte('end_date', currentDate)
      .not('status', 'in', '(completed,cancelled)')
      .order('end_date', { ascending: false })
    
    if (error) {
      console.error('Error fetching expired competitions:', error)
      return { success: false, error: error.message }
    }
    
    return { success: true, data }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { success: false, error: 'Failed to fetch expired competitions' }
  }
}

export async function manuallyCompleteCompetition(competitionId: string) {
  const supabase = createClient()
  
  try {
    const { data, error } = await supabase
      .from('competitions')
      .update({ 
        status: 'completed',
        updated_at: new Date().toISOString()
      })
      .eq('id', competitionId)
      .select('id, title, status')
      .single()
    
    if (error) {
      console.error('Error updating competition:', error)
      return { success: false, error: error.message }
    }
    
    return { success: true, data }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { success: false, error: 'Failed to update competition status' }
  }
}