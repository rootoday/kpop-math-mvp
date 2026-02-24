-- Create math_concepts table for managing reusable math concepts
CREATE TABLE IF NOT EXISTS public.math_concepts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT DEFAULT '',
    category TEXT DEFAULT 'general',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.math_concepts ENABLE ROW LEVEL SECURITY;

-- Everyone can read active math concepts
CREATE POLICY "math_concepts_select_all"
    ON public.math_concepts
    FOR SELECT
    USING (true);

-- Only admins can insert/update/delete
CREATE POLICY "math_concepts_insert_admin"
    ON public.math_concepts
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "math_concepts_update_admin"
    ON public.math_concepts
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "math_concepts_delete_admin"
    ON public.math_concepts
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Seed with existing concepts from lessons + hardcoded TOPICS
INSERT INTO public.math_concepts (name, description, category) VALUES
    ('Percentages', 'Calculating percentages, percent increase/decrease', 'arithmetic'),
    ('Fractions', 'Operations with fractions, simplification', 'arithmetic'),
    ('Ratios', 'Understanding and computing ratios and proportions', 'arithmetic'),
    ('Algebra', 'Solving equations, variables, expressions', 'algebra'),
    ('Geometry', 'Shapes, angles, area, perimeter, volume', 'geometry'),
    ('Statistics', 'Mean, median, mode, data interpretation', 'statistics'),
    ('Polynomial Simplification', 'Combining like terms, simplifying polynomials', 'algebra'),
    ('Points, Lines, and Angles', 'Basic geometric concepts and angle relationships', 'geometry'),
    ('Solving for X', 'Isolating variables in equations', 'algebra')
ON CONFLICT (name) DO NOTHING;

-- Also seed any existing unique math_concept values from lessons table
INSERT INTO public.math_concepts (name)
    SELECT DISTINCT math_concept FROM public.lessons
    WHERE math_concept IS NOT NULL AND math_concept != ''
ON CONFLICT (name) DO NOTHING;
