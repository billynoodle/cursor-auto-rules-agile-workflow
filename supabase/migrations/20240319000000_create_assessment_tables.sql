-- Enable required extensions
create extension if not exists "uuid-ossp";

-- Create enum types
create type assessment_status as enum ('draft', 'in_progress', 'completed', 'archived');

-- Create assessments table with soft deletes and timestamps
create table assessments (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users not null,
    current_module_id text not null,
    current_question_id text not null,
    progress integer not null default 0,
    completed_modules text[] not null default '{}',
    is_complete boolean not null default false,
    status assessment_status not null default 'draft',
    metadata jsonb,
    deleted_at timestamp with time zone,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create assessment answers table with soft deletes
create table assessment_answers (
    id uuid default uuid_generate_v4() primary key,
    assessment_id uuid references assessments on delete cascade not null,
    question_id text not null,
    answer jsonb not null,
    metadata jsonb,
    deleted_at timestamp with time zone,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create unique index for non-deleted answers
create unique index idx_unique_active_answers 
    on assessment_answers(assessment_id, question_id) 
    where deleted_at is null;

-- Create indexes for better query performance
create index idx_assessments_user_id on assessments(user_id) where deleted_at is null;
create index idx_assessments_status on assessments(status) where deleted_at is null;
create index idx_assessments_created_at on assessments(created_at) where deleted_at is null;
create index idx_assessment_answers_assessment_id on assessment_answers(assessment_id) where deleted_at is null;
create index idx_assessment_answers_question_id on assessment_answers(question_id) where deleted_at is null;

-- Create updated_at trigger function
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at
create trigger set_updated_at
    before update on assessments
    for each row
    execute function update_updated_at_column();

create trigger set_updated_at
    before update on assessment_answers
    for each row
    execute function update_updated_at_column();

-- Enable Row Level Security
alter table assessments enable row level security;
alter table assessment_answers enable row level security;

-- Create policies for assessments
create policy "Users can view their own assessments"
    on assessments for select
    using (auth.uid() = user_id);

create policy "Users can create their own assessments"
    on assessments for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own assessments"
    on assessments for update
    using (auth.uid() = user_id);

create policy "Users can delete their own assessments"
    on assessments for delete
    using (auth.uid() = user_id);

-- Create policies for assessment answers
create policy "Users can view their own assessment answers"
    on assessment_answers for select
    using (
        exists (
            select 1 from assessments
            where assessments.id = assessment_answers.assessment_id
            and assessments.user_id = auth.uid()
        )
    );

create policy "Users can create answers for their own assessments"
    on assessment_answers for insert
    with check (
        exists (
            select 1 from assessments
            where assessments.id = assessment_answers.assessment_id
            and assessments.user_id = auth.uid()
        )
    );

create policy "Users can update their own assessment answers"
    on assessment_answers for update
    using (
        exists (
            select 1 from assessments
            where assessments.id = assessment_answers.assessment_id
            and assessments.user_id = auth.uid()
        )
    );

create policy "Users can delete their own assessment answers"
    on assessment_answers for delete
    using (
        exists (
            select 1 from assessments
            where assessments.id = assessment_answers.assessment_id
            and assessments.user_id = auth.uid()
        )
    );

-- Create functions for soft delete
create or replace function soft_delete_assessment(assessment_id uuid)
returns void as $$
begin
    update assessments
    set deleted_at = timezone('utc'::text, now())
    where id = assessment_id
    and auth.uid() = user_id;
    
    update assessment_answers
    set deleted_at = timezone('utc'::text, now())
    where assessment_id = assessment_id;
end;
$$ language plpgsql security definer;

-- Create function to restore soft-deleted assessment
create or replace function restore_assessment(assessment_id uuid)
returns void as $$
begin
    update assessments
    set deleted_at = null
    where id = assessment_id
    and auth.uid() = user_id;
    
    update assessment_answers
    set deleted_at = null
    where assessment_id = assessment_id;
end;
$$ language plpgsql security definer; 