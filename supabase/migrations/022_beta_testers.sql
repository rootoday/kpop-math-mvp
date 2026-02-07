-- Add is_beta_tester column to users table
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS is_beta_tester BOOLEAN DEFAULT false;

-- Create index for faster beta tester queries
CREATE INDEX IF NOT EXISTS idx_users_is_beta_tester ON public.users(is_beta_tester);

-- Comment for documentation
COMMENT ON COLUMN public.users.is_beta_tester IS 'Indicates if the user is part of the beta testing program';
