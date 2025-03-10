# Supabase Integration Guide

This document describes how to work with Supabase in the Allied Health Business Assessment application.

## Setup and Configuration

1. **Environment Variables**
   - Create a `.env` file in the client directory (already done)
   - Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` with your Supabase project values
   - These can be found in your Supabase dashboard under Settings > API

2. **Getting Started with Supabase**
   - Create an account at [supabase.com](https://supabase.com)
   - Create a new project
   - Use the SQL editor to create tables based on the schema in `/client/src/types/supabase.ts`
   - Set up Row Level Security (RLS) policies for each table (see Security section below)

## Authentication Flow

The application uses Supabase Auth with email/password authentication:

1. **Sign Up**: `useSupabaseContext().signUp(email, password)`
2. **Sign In**: `useSupabaseContext().signIn(email, password)`
3. **Sign Out**: `useSupabaseContext().signOut()`
4. **Current User**: `useSupabaseContext().user`

Authentication state is managed through the Supabase context:

```tsx
import { useSupabaseContext } from '../contexts/SupabaseContext';

const MyComponent = () => {
  const { user, loading, signIn, signOut } = useSupabaseContext();
  
  // Use these values and functions to manage authentication
};
```

## Database Operations

Use the services in `/client/src/services/database.ts` for common operations:

```tsx
import { practiceService } from '../services/database';

// Example: Get practices for the current user
try {
  const practices = await practiceService.getUserPractices();
  // Do something with the practices
} catch (error) {
  console.error('Failed to get practices:', error);
}
```

## Security Best Practices

### Row Level Security (RLS)

All tables should have RLS policies to ensure that users can only access their own data.

Example SQL for practices table:

```sql
-- Enable RLS
ALTER TABLE practices ENABLE ROW LEVEL SECURITY;

-- Create policy for users to select their own practices
CREATE POLICY "Users can view their own practices"
ON practices FOR SELECT
USING (auth.uid() = "userId");

-- Create policy for users to insert their own practices
CREATE POLICY "Users can insert their own practices"
ON practices FOR INSERT
WITH CHECK (auth.uid() = "userId");

-- Create policy for users to update their own practices
CREATE POLICY "Users can update their own practices"
ON practices FOR UPDATE
USING (auth.uid() = "userId");

-- Create policy for users to delete their own practices
CREATE POLICY "Users can delete their own practices"
ON practices FOR DELETE
USING (auth.uid() = "userId");
```

## Data Model and Table Creation

Below are SQL scripts for creating tables based on our schema:

```sql
-- Create practices table
CREATE TABLE practices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  "ownerName" TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  "practiceType" TEXT NOT NULL,
  "numberOfPractitioners" INTEGER NOT NULL,
  "yearsInOperation" INTEGER NOT NULL,
  location JSONB NOT NULL,
  "annualRevenue" DECIMAL NOT NULL,
  "patientVolume" INTEGER NOT NULL,
  "userId" UUID NOT NULL REFERENCES auth.users(id),
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create assessment_modules table
CREATE TABLE assessment_modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create questions table
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "moduleId" UUID NOT NULL REFERENCES assessment_modules(id),
  text TEXT NOT NULL,
  type TEXT NOT NULL,
  options TEXT[] NULL,
  weight FLOAT NOT NULL,
  "benchmarkReference" TEXT NULL,
  "interconnectednessScore" FLOAT NOT NULL,
  "relatedBusinessAreas" TEXT[] NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create assessment_responses table
CREATE TABLE assessment_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "practiceId" UUID NOT NULL REFERENCES practices(id),
  "moduleId" UUID NOT NULL REFERENCES assessment_modules(id),
  "completedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  score FLOAT NOT NULL,
  "userId" UUID NOT NULL REFERENCES auth.users(id),
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create question_responses table
CREATE TABLE question_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "assessmentId" UUID NOT NULL REFERENCES assessment_responses(id),
  "questionId" UUID NOT NULL REFERENCES questions(id),
  response JSONB NOT NULL,
  notes TEXT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create recommendations table
CREATE TABLE recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "practiceId" UUID NOT NULL REFERENCES practices(id),
  "assessmentId" UUID NOT NULL REFERENCES assessment_responses(id),
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  impact TEXT NOT NULL,
  effort TEXT NOT NULL,
  timeframe TEXT NOT NULL,
  "implementationStatus" TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

## Troubleshooting

- **Authentication Issues**: Check browser console for errors. Ensure your Supabase URL and anon key are correct.
- **Database Errors**: Verify that tables are created correctly and RLS policies are applied.
- **Type Errors**: Ensure your Database type definition in `supabase.ts` matches the actual database schema.
- **Forbidden Errors**: Check RLS policies to ensure they allow the intended operations. 