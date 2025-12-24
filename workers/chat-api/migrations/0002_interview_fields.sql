-- Add structured interview fields to leads table
ALTER TABLE leads ADD COLUMN intent TEXT;
ALTER TABLE leads ADD COLUMN role TEXT;
ALTER TABLE leads ADD COLUMN ai_maturity TEXT;
ALTER TABLE leads ADD COLUMN working_style TEXT;
ALTER TABLE leads ADD COLUMN timeline TEXT;
ALTER TABLE leads ADD COLUMN company_size TEXT;
ALTER TABLE leads ADD COLUMN industry TEXT;
ALTER TABLE leads ADD COLUMN budget_range TEXT;
ALTER TABLE leads ADD COLUMN lead_score INTEGER;
ALTER TABLE leads ADD COLUMN lead_tier TEXT;

-- Add interview_answers JSON column for raw storage
ALTER TABLE leads ADD COLUMN interview_answers TEXT;

-- Add index on lead_tier for filtering
CREATE INDEX IF NOT EXISTS idx_leads_lead_tier ON leads(lead_tier);
CREATE INDEX IF NOT EXISTS idx_leads_lead_score ON leads(lead_score);
