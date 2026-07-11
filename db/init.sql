CREATE TYPE application_status AS ENUM ('Applied', 'Interview', 'Offer', 'Rejected', 'Ghosted');
CREATE TYPE application_source AS ENUM ('LinkedIn', 'JobStreet', 'Indeed', 'Referral', 'Other');

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE job_applications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  company_name TEXT NOT NULL,
  job_title TEXT NOT NULL,
  job_url TEXT,
  applied_gmail TEXT,
  date_applied DATE NOT NULL,
  status application_status NOT NULL DEFAULT 'Applied',
  source application_source,
  notes TEXT,
  follow_up_date DATE,
  created_at TIMESTAMP DEFAULT NOW()
);