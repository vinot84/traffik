-- Initial database schema for Traafik application
-- Enable PostGIS extension for geospatial support
CREATE EXTENSION IF NOT EXISTS postgis;

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('DRIVER', 'OFFICER', 'ADMIN')),
    enabled BOOLEAN DEFAULT true,
    account_non_expired BOOLEAN DEFAULT true,
    account_non_locked BOOLEAN DEFAULT true,
    credentials_non_expired BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User profiles table
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    date_of_birth DATE,
    avatar_url VARCHAR(500),
    kyc_status VARCHAR(20) DEFAULT 'PENDING' CHECK (kyc_status IN ('PENDING', 'APPROVED', 'REJECTED', 'INCOMPLETE')),
    kyc_rejection_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Driver licenses table (for drivers)
CREATE TABLE driver_licenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    license_number VARCHAR(50) NOT NULL UNIQUE,
    state VARCHAR(2) NOT NULL,
    expiration_date DATE NOT NULL,
    license_class VARCHAR(10) NOT NULL,
    restrictions TEXT,
    verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Officer badges table (for officers)
CREATE TABLE officer_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    badge_number VARCHAR(50) NOT NULL UNIQUE,
    department VARCHAR(100) NOT NULL,
    rank VARCHAR(50),
    jurisdiction TEXT,
    verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Traffic stop sessions table
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    driver_id UUID NOT NULL REFERENCES users(id),
    officer_id UUID REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'CREATED' CHECK (status IN ('CREATED', 'ASSIGNED', 'VERIFIED', 'REASONS_SELECTED', 'COMPLETED', 'CANCELLED')),
    location GEOMETRY(POINT, 4326) NOT NULL,
    address TEXT,
    reason TEXT,
    notes TEXT,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    assigned_at TIMESTAMP WITH TIME ZONE,
    verified_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Session state transitions table (for audit trail)
CREATE TABLE session_state_transitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    from_state VARCHAR(20),
    to_state VARCHAR(20) NOT NULL,
    triggered_by UUID REFERENCES users(id),
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Violation types table
CREATE TABLE violation_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(20) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    base_fine DECIMAL(10,2) NOT NULL,
    points INTEGER DEFAULT 0,
    category VARCHAR(50) NOT NULL,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Citations table
CREATE TABLE citations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    citation_number VARCHAR(50) NOT NULL UNIQUE,
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    status VARCHAR(20) DEFAULT 'ISSUED' CHECK (status IN ('ISSUED', 'PAID', 'CONTESTED', 'DISMISSED', 'OVERDUE')),
    due_date DATE NOT NULL,
    issued_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    paid_at TIMESTAMP WITH TIME ZONE,
    contested_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Citation violations table (many-to-many relationship)
CREATE TABLE citation_violations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    citation_id UUID NOT NULL REFERENCES citations(id) ON DELETE CASCADE,
    violation_type_id UUID NOT NULL REFERENCES violation_types(id),
    fine_amount DECIMAL(10,2) NOT NULL,
    points INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments table
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    citation_id UUID NOT NULL REFERENCES citations(id) ON DELETE CASCADE,
    stripe_payment_intent_id VARCHAR(255) UNIQUE,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PROCESSING', 'SUCCEEDED', 'FAILED', 'CANCELLED', 'REFUNDED')),
    payment_method VARCHAR(50),
    transaction_id VARCHAR(255),
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- File attachments table (for evidence, documents, etc.)
CREATE TABLE file_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
    citation_id UUID REFERENCES citations(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    content_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL,
    storage_path VARCHAR(500) NOT NULL,
    uploaded_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Refresh tokens table (for JWT authentication)
CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    revoked BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_sessions_driver_id ON sessions(driver_id);
CREATE INDEX idx_sessions_officer_id ON sessions(officer_id);
CREATE INDEX idx_sessions_status ON sessions(status);
CREATE INDEX idx_sessions_location ON sessions USING GIST(location);
CREATE INDEX idx_sessions_created_at ON sessions(created_at);
CREATE INDEX idx_citations_session_id ON citations(session_id);
CREATE INDEX idx_citations_status ON citations(status);
CREATE INDEX idx_citations_due_date ON citations(due_date);
CREATE INDEX idx_payments_citation_id ON payments(citation_id);
CREATE INDEX idx_payment_stripe_intent ON payments(stripe_payment_intent_id);
CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_token ON refresh_tokens(token);
CREATE INDEX idx_refresh_tokens_expires_at ON refresh_tokens(expires_at);

-- Insert default violation types
INSERT INTO violation_types (code, description, base_fine, points, category) VALUES
('SP001', 'Speeding 1-10 mph over limit', 150.00, 2, 'SPEEDING'),
('SP002', 'Speeding 11-20 mph over limit', 250.00, 4, 'SPEEDING'),
('SP003', 'Speeding 21-30 mph over limit', 350.00, 6, 'SPEEDING'),
('SP004', 'Speeding 31+ mph over limit', 500.00, 8, 'SPEEDING'),
('RUN001', 'Running a red light', 300.00, 4, 'TRAFFIC_SIGNAL'),
('RUN002', 'Running a stop sign', 250.00, 3, 'TRAFFIC_SIGNAL'),
('PARK001', 'Illegal parking', 75.00, 0, 'PARKING'),
('PHONE001', 'Using phone while driving', 200.00, 3, 'DISTRACTED_DRIVING'),
('SEAT001', 'Seatbelt violation', 100.00, 1, 'SAFETY'),
('DUI001', 'Driving under influence', 1000.00, 12, 'DUI');

-- Create a default admin user (password: admin123)
-- Note: In production, this should be removed and admin created through proper channels
INSERT INTO users (id, email, password_hash, role) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'admin@traafik.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeZI6x6GrYKSH3zKK', 'ADMIN');

INSERT INTO user_profiles (user_id, first_name, last_name, kyc_status) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'System', 'Administrator', 'APPROVED');