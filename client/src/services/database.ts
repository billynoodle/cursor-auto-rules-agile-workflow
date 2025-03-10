import { supabase } from './supabase';
import { Database } from '../types/supabase';

/**
 * Service for practice-related database operations
 */
export const practiceService = {
  /**
   * Create a new practice
   * @param practice Practice data to insert
   * @returns Inserted practice data
   */
  createPractice: async (practice: Database['public']['Tables']['practices']['Insert']) => {
    const { data, error } = await supabase
      .from('practices')
      .insert(practice)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  /**
   * Get a practice by ID
   * @param id Practice ID
   * @returns Practice data
   */
  getPractice: async (id: string) => {
    const { data, error } = await supabase
      .from('practices')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  /**
   * Get practices for the current user
   * @returns Array of practices
   */
  getUserPractices: async () => {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('practices')
      .select('*')
      .eq('userId', user.user.id);
    
    if (error) throw error;
    return data;
  },

  /**
   * Update a practice
   * @param id Practice ID
   * @param practice Practice data to update
   * @returns Updated practice data
   */
  updatePractice: async (id: string, practice: Database['public']['Tables']['practices']['Update']) => {
    const { data, error } = await supabase
      .from('practices')
      .update({ ...practice, updatedAt: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  /**
   * Delete a practice
   * @param id Practice ID
   * @returns Success status
   */
  deletePractice: async (id: string) => {
    const { error } = await supabase
      .from('practices')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
};

/**
 * Service for assessment module-related database operations
 */
export const assessmentModuleService = {
  /**
   * Get all assessment modules
   * @returns Array of assessment modules
   */
  getModules: async () => {
    const { data, error } = await supabase
      .from('assessment_modules')
      .select('*');
    
    if (error) throw error;
    return data;
  },

  /**
   * Get a module by ID
   * @param id Module ID
   * @returns Module data
   */
  getModule: async (id: string) => {
    const { data, error } = await supabase
      .from('assessment_modules')
      .select('*, questions(*)')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }
};

/**
 * Service for assessment response-related database operations
 */
export const assessmentResponseService = {
  /**
   * Create a new assessment response
   * @param assessmentResponse Assessment response data
   * @param questionResponses Array of question responses
   * @returns Created assessment response
   */
  createAssessmentResponse: async (
    assessmentResponse: Database['public']['Tables']['assessment_responses']['Insert'],
    questionResponses: Database['public']['Tables']['question_responses']['Insert'][]
  ) => {
    // Start a transaction for creating an assessment response and its question responses
    const { data, error } = await supabase
      .from('assessment_responses')
      .insert(assessmentResponse)
      .select()
      .single();
    
    if (error) throw error;

    // Add the assessment ID to each question response
    const responsesWithAssessmentId = questionResponses.map(qr => ({
      ...qr,
      assessmentId: data.id
    }));

    // Insert all question responses
    const { error: qrError } = await supabase
      .from('question_responses')
      .insert(responsesWithAssessmentId);
    
    if (qrError) throw qrError;
    
    return data;
  },

  /**
   * Get assessment responses for a practice
   * @param practiceId Practice ID
   * @returns Array of assessment responses
   */
  getPracticeAssessments: async (practiceId: string) => {
    const { data, error } = await supabase
      .from('assessment_responses')
      .select('*, assessment_modules(*)')
      .eq('practiceId', practiceId);
    
    if (error) throw error;
    return data;
  },

  /**
   * Get a specific assessment response with question responses
   * @param assessmentId Assessment ID
   * @returns Assessment with question responses
   */
  getAssessmentWithResponses: async (assessmentId: string) => {
    const { data: assessment, error } = await supabase
      .from('assessment_responses')
      .select('*, assessment_modules(*)')
      .eq('id', assessmentId)
      .single();
    
    if (error) throw error;

    const { data: questionResponses, error: qrError } = await supabase
      .from('question_responses')
      .select('*, questions(*)')
      .eq('assessmentId', assessmentId);
    
    if (qrError) throw qrError;

    return {
      ...assessment,
      questionResponses
    };
  }
};

/**
 * Service for recommendation-related database operations
 */
export const recommendationService = {
  /**
   * Get recommendations for a practice
   * @param practiceId Practice ID
   * @returns Array of recommendations
   */
  getPracticeRecommendations: async (practiceId: string) => {
    const { data, error } = await supabase
      .from('recommendations')
      .select('*')
      .eq('practiceId', practiceId);
    
    if (error) throw error;
    return data;
  },

  /**
   * Update recommendation implementation status
   * @param id Recommendation ID
   * @param status New implementation status
   * @returns Updated recommendation
   */
  updateImplementationStatus: async (
    id: string, 
    status: Database['public']['Tables']['recommendations']['Row']['implementationStatus']
  ) => {
    const { data, error } = await supabase
      .from('recommendations')
      .update({ 
        implementationStatus: status,
        updatedAt: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
}; 