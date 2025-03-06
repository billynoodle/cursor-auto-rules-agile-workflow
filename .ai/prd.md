# Product Requirements Document (PRD) for Allied Health Business Assessment Tool

## Status: Draft

## Introduction
The Allied Health Business Assessment Tool is a comprehensive digital solution designed to help allied health practitioners conduct in-depth, quantifiable analyses of their business operations, financial health, and growth opportunities. This tool will enable practitioners to identify strengths, weaknesses, and actionable insights through a weighted scoring system that provides concrete, data-driven metrics for business performance. The platform delivers a simple, intuitive user experience while offering deep analytical capabilities to optimize practice management, improve patient care, and increase profitability.

The initial MVP will focus exclusively on physiotherapists, with a phased approach to expand to other allied health disciplines as the product gains traction. This targeted approach ensures that the assessment is highly relevant and specialized for physiotherapy practices before scaling to other disciplines such as occupational therapy, speech pathology, dietetics, and other allied health fields. The assessment is designed to scale appropriately based on business size and complexity, providing relevant insights regardless of practice scale.

## Goals
- Provide a comprehensive, quantifiable business assessment framework initially tailored to physiotherapy practices, with expansion to other allied health disciplines in later phases
- Enable practitioners to identify at least 5 key business improvement opportunities within 60 minutes of using the tool
- Deliver actionable recommendations with implementation guidance and expected ROI for each identified opportunity
- Generate a concrete business health score with benchmarking against industry standards
- Provide clear market positioning analysis using a blend of quantitative data and qualitative narrative
- Achieve 90% user satisfaction rating based on the usefulness of insights generated
- Reduce business analysis time by 75% compared to traditional consulting methods
- Create a platform that can be used with flexible tracking periods appropriate to each metric
- Maintain a balance between comprehensive assessment and simplicity of use
- Support practices of all sizes with appropriate scaling of metrics and recommendations
- Enable practitioners to generate standardized SOPs and documentation for key practice processes
- Create an extensible architecture that allows new allied health disciplines to be added without significant refactoring

## Features and Requirements

### Functional Requirements
- Interactive questionnaire covering all major business aspects with weighted questions and answers, including:
  - Financial health and profitability
  - Operations and workflow efficiency
  - Marketing and patient acquisition
  - Staff management and productivity
  - Compliance and risk management
  - Patient/client management and satisfaction
  - Facilities and equipment utilization
  - Geographic market analysis
  - Technology integration and digital maturity
  - Automation opportunities
  - Business growth and scalability
- Sophisticated scoring algorithm that calculates quantifiable metrics for each business area
- Score interpreter that provides a clear overview of the practice's position with specific action prompts
- Automated analysis engine to process practitioner inputs and generate data-driven insights
- Customizable assessment modules based on practice type, size, and complexity
- Benchmarking capabilities against industry standards and similar practices with percentile rankings
- Country-specific compliance requirements and benchmarks (default: Australia) with ability to switch countries
- Detailed reporting with visualizations of key metrics and performance indicators
- Action plan generator with prioritized recommendations based on impact potential and implementation difficulty
- Progress tracking system with flexible monitoring periods appropriate to each metric
- Resource library with templates, guides, and best practices
- Business health dashboard with key performance indicators and trend analysis
- Custom variable support allowing users to add and track metrics specific to their practice
- Market positioning analysis combining quantitative metrics with qualitative narrative
- Discipline selection and configuration system to support multiple allied health disciplines
- Discipline-specific content including questions, benchmarks, best practices, and recommendations
- SOP and documentation generator for key practice processes, including:
  - Practitioner onboarding and training
  - Patient/client health screening protocols
  - Compliance procedures and checklists
  - Quality assurance processes
  - Administrative workflows
  - Clinical protocols
  - Emergency procedures
  - Technology usage guidelines
- SOP material finder that automatically identifies and collects relevant resources needed for creating comprehensive SOPs

### Non-functional Requirements
- Intuitive user interface requiring no training to navigate, with progressive disclosure of complexity
- Completion of full assessment in under 60 minutes with ability to save and resume
- Clear, jargon-free language with tooltips for technical terms
- Visual progress indicators and estimated completion time
- Secure data handling compliant with healthcare privacy regulations (including Australian Privacy Principles)
- Responsive design for use on desktop, tablet, and mobile devices
- Offline capability for data collection with later synchronization
- Regular updates to benchmarking data and best practices
- Accessibility compliance for practitioners with disabilities
- Performance optimization for quick loading and response times
- Scalable architecture to support practices of all sizes
- Extensible architecture to support multiple allied health disciplines through a plugin system
- Generated SOPs and documentation must comply with relevant healthcare standards and regulations
- Initial MVP focused exclusively on physiotherapy practices with discipline-specific metrics and benchmarks
- Row-Level Security (RLS) implementation for protecting sensitive practice data
- Secure authentication and authorization through Supabase Auth
- Real-time data synchronization using Supabase Realtime capabilities

## Assessment Methodology

### Scaling Approach
- Assessment complexity and depth scales based on practice size and type
- Solo practitioner: Streamlined assessment focusing on essential metrics
- Small practice (2-5 practitioners): Standard assessment with core modules
- Medium practice (6-20 practitioners): Comprehensive assessment with additional management metrics
- Large practice (20+ practitioners): Enterprise assessment with multi-location and advanced analytics
- Custom scaling factors based on practice-specific variables

### Scoring System
- Each question is assigned a weight based on its impact on business performance
- Answers are scored on a standardized scale (1-5, 1-10, or percentage-based)
- Category scores are calculated using weighted averages of question scores
- Overall business health score is derived from weighted category scores
- Scores are normalized against benchmarks to provide percentile rankings
- Historical tracking of scores to measure improvement over time
- Country-specific normalization to ensure relevant comparisons
- Discipline-specific normalization to ensure appropriate benchmarking
- Custom variables can be incorporated into scoring with user-defined weights

### Score Interpretation System
- Automated interpretation of assessment scores across all categories
- Business health positioning on a defined scale (Critical, Concerning, Stable, Strong, Exceptional)
- Specific action prompts tied to score ranges in each category
- Prioritized improvement recommendations based on score gaps
- Visual representation of score interpretation with clear next steps
- Comparative analysis against industry benchmarks with percentile rankings
- Projected impact of implementing recommended actions
- Timeline suggestions for addressing identified issues

### Data Visualization
- Color-coded heat maps to highlight strengths and weaknesses
- Radar/spider charts to show performance across multiple dimensions
- Trend lines to track improvements over time
- Benchmark comparison charts
- Priority matrices for recommendation implementation
- Market positioning maps showing competitive landscape
- Geographic heat maps for multi-location practices

### Tracking Periods
- Flexible tracking periods based on metric type:
  - Financial metrics: Monthly/Quarterly
  - Patient compliance: Weekly/Biweekly
  - Staff performance: Monthly
  - Marketing effectiveness: Biweekly/Monthly
  - Operational efficiency: Monthly
  - Technology utilization: Quarterly
  - User-defined custom tracking periods for specific metrics

## Discipline Plugin Architecture

### Core Framework
- Base assessment system with discipline-agnostic functionality
- Pluggable discipline-specific modules that extend the core framework
- Registry system to manage available disciplines and their capabilities
- Adapter patterns to transform discipline-specific data into a common format
- Discipline configuration system for practice profiles

### Plugin Components
- Discipline-specific questions and answer options
- Specialized benchmarks and industry standards
- Custom scoring weights relevant to each discipline
- Discipline-specific SOP templates and requirements
- Regulatory and compliance requirements by discipline
- Best practices and recommendations tailored to each discipline
- Specialized visualizations and reports

### Initial Discipline: Physiotherapy
- Comprehensive assessment tailored to physiotherapy practices
- Physiotherapy-specific benchmarks and industry standards
- Compliance requirements for physiotherapy practices in Australia
- Performance metrics focused on physiotherapy operations
- SOP templates for common physiotherapy processes

### Future Disciplines
- Occupational therapy
- Speech pathology
- Dietetics
- Podiatry
- Chiropractic
- Osteopathy
- Psychology
- Exercise physiology

## SOP and Documentation Generation

### SOP Types
- Clinical SOPs (treatment protocols, assessment procedures)
- Administrative SOPs (billing, scheduling, record-keeping)
- Compliance SOPs (privacy, security, regulatory requirements)
- HR SOPs (recruitment, onboarding, performance management)
- Quality assurance SOPs (auditing, improvement processes)
- Emergency SOPs (crisis management, business continuity)
- Technology SOPs (system usage, data management)

### SOP Generation Approach
- RAG (Retrieval-Augmented Generation) models for creating contextually relevant SOP content
- Template-based generation with practice-specific customization
- Assessment results inform SOP content and recommendations
- Compliance with country-specific regulations and standards
- Discipline-specific content and requirements
- Scalable complexity based on practice size and needs
- Version control and update tracking
- Approval workflows for multi-practitioner practices
- Export options (PDF, Word, HTML) for easy distribution
- Integration with practice management systems where applicable

### SOP Material Finder
- Automated discovery of relevant resources for SOP creation
- Intelligent search across regulatory databases, industry standards, and best practices
- Collection and organization of discipline-specific requirements (initially focused on physiotherapy)
- Identification of mandatory vs. recommended elements for each SOP type
- Contextual suggestions based on practice profile and assessment results
- Curated library of templates, forms, and checklists relevant to identified needs
- Integration with professional association resources and guidelines
- Tracking of resource currency and updates to regulations

### Documentation Features
- Standardized formatting with practice branding
- Interactive checklists and forms
- Visual aids and process diagrams
- Role-specific instructions and responsibilities
- Training materials linked to SOPs
- Implementation guidelines and timelines
- Review schedules and compliance tracking
- Digital signature support for acknowledgment

## Integration Capabilities
- API connections to leading allied health practice management systems
- Integration with accounting software (Xero, MYOB, QuickBooks)
- Connection to patient management systems
- Integration with marketing platforms and analytics
- Compatibility with HR and staff management tools
- Data import/export capabilities for custom systems
- Webhook support for custom integrations
- Document management system integration for SOP storage and distribution

### Supabase Integration
- Authentication and user management through Supabase Auth with JWT validation
- Row-Level Security (RLS) policies for fine-grained data access control
- Realtime subscriptions for live assessment data and collaborative editing
- Storage capabilities for SOP documents, templates, and practice resources
- Edge Functions for serverless processing of complex assessment calculations
- PostgreSQL functions and triggers for data validation and business logic
- Secure API access with built-in rate limiting and security features
- Webhook triggers for integration with external systems
- Database change tracking for audit logs and version control

## Phased Rollout Approach
### Phase 1: Physiotherapy MVP (Current)
- Complete assessment framework tailored specifically to physiotherapy practices
- Physiotherapy-specific benchmarks and industry standards
- Core modules focused on physiotherapy business operations
- Initial SOP templates for common physiotherapy practice needs
- Extensible architecture designed to support future disciplines

### Phase 2: Expansion to Related Disciplines
- Occupational therapy plugin addition
- Speech pathology plugin addition
- Discipline-specific benchmarking for new fields
- Expanded SOP library for additional disciplines
- Enhanced discipline configuration and selection system

### Phase 3: Full Allied Health Coverage
- Complete coverage of all major allied health disciplines through plugin system
- Cross-discipline benchmarking and comparison
- Specialized modules for multidisciplinary practices
- Comprehensive SOP library covering all disciplines
- Advanced multi-discipline practice assessment capabilities

## Epic Structure
Epic-1: Core Assessment Framework Development for Allied Health Practices (Current)
Epic-2: Analysis Engine and Reporting System (Future)
Epic-3: Score Interpretation and Action Prompting System (Future)
Epic-4: Benchmarking and Progress Tracking (Future)
Epic-5: Resource Library and Knowledge Base (Future)
Epic-6: Integration and Data Exchange Capabilities (Future)
Epic-7: Advanced Analytics and Market Positioning (Future)
Epic-8: SOP and Documentation Generation System with RAG Models (Future)
Epic-9: SOP Material Finder Implementation (Future)
Epic-10: Discipline Plugin Architecture and Extension System (Future)
Epic-11: Multi-Discipline Practice Assessment Capabilities (Future)

## Story List
### Epic-1: Core Assessment Framework Development for Allied Health Practices
Story-1: Design comprehensive business assessment questionnaire structure with weighted scoring system for allied health practices (initial focus: physiotherapy)
Story-2: Develop practice profile setup and configuration with business size scaling and discipline selection
Story-3: Create financial health assessment module with quantifiable metrics
Story-4: Implement operations and workflow assessment module with efficiency scoring
Story-5: Build marketing and patient acquisition assessment module with conversion metrics
Story-6: Develop staff management and productivity assessment module with performance indicators
Story-7: Create compliance and risk management module with country-specific requirements
Story-8: Implement patient/client management assessment module
Story-9: Develop facilities and geographic market analysis module
Story-10: Create technology integration and automation assessment module
Story-11: Implement custom variable support for practice-specific metrics
Story-12: Develop discipline plugin interface and physiotherapy implementation
Story-13: Develop user experience testing and refinement for simplicity and engagement

### Epic-3: Score Interpretation and Action Prompting System
Story-1: Design score interpretation framework with positioning scale
Story-2: Develop category-specific action prompt generation system
Story-3: Create visual representation of score interpretation
Story-4: Implement prioritization algorithm for improvement recommendations
Story-5: Build projected impact calculator for recommended actions
Story-6: Develop timeline suggestion system for addressing issues
Story-7: Create benchmark comparison visualization for score context
Story-8: Implement user feedback system for action prompt relevance
Story-9: Develop discipline-specific action prompt customization

### Epic-8: SOP and Documentation Generation System with RAG Models
Story-1: Design SOP template framework and document structure
Story-2: Implement RAG model integration for contextual SOP content generation
Story-3: Develop practitioner onboarding and training SOP generator
Story-4: Create patient/client health screening protocol generator
Story-5: Implement compliance procedure documentation system
Story-6: Build administrative workflow SOP generator
Story-7: Develop clinical protocol documentation system
Story-8: Create emergency procedure SOP generator
Story-9: Implement technology usage guideline documentation system
Story-10: Develop SOP approval and distribution workflow
Story-11: Build SOP version control and update tracking system
Story-12: Implement discipline-specific SOP template system

### Epic-9: SOP Material Finder Implementation
Story-1: Design SOP material finder architecture and search capabilities
Story-2: Develop regulatory database integration for compliance requirements
Story-3: Create industry standards and best practices repository
Story-4: Implement intelligent search and relevance ranking system
Story-5: Build resource organization and categorization system
Story-6: Develop contextual suggestion engine based on practice profile
Story-7: Create template and form library with tagging system
Story-8: Implement resource currency tracking and update notifications
Story-9: Build integration with professional association resources
Story-10: Develop user interface for browsing and selecting SOP materials
Story-11: Build discipline-specific resource filtering and prioritization

### Epic-10: Discipline Plugin Architecture and Extension System
Story-1: Design core discipline plugin architecture and interfaces
Story-2: Develop discipline registry and configuration system
Story-3: Implement discipline-specific question framework
Story-4: Create benchmark normalization system for cross-discipline comparison
Story-5: Build discipline-specific content management system
Story-6: Develop discipline selection and configuration interface
Story-7: Create discipline adapter patterns for core assessment components
Story-8: Implement physiotherapy plugin as reference implementation
Story-9: Develop testing framework for discipline plugin validation
Story-10: Create documentation and guidelines for developing new discipline plugins

## Tech Stack
- Languages: JavaScript/TypeScript, Python
- Frameworks: React, Node.js, Flask
- Database: Supabase (PostgreSQL-based with built-in Auth, Storage, and Realtime features)
- Cloud Infrastructure: AWS/Azure
- Analytics: TensorFlow, Pandas
- Visualization: D3.js, Chart.js
- Integration: RESTful APIs, GraphQL, Webhooks
- Document Generation: PDFKit, DocxTemplater
- AI/ML: RAG models for SOP generation, NLP for material finding and categorization
- Plugin System: Module federation, dynamic loading, dependency injection

## Future Enhancements
- AI-powered predictive analytics for business forecasting
- Integration with practice management software for automated data collection and real-time metrics
- Peer community features for sharing best practices and anonymous benchmarking
- Virtual consultant chatbot for real-time guidance
- Custom industry benchmarking based on geographic location, practice size, and specialty
- Mobile app with offline assessment capabilities
- Integration with financial planning tools
- Continuing education modules tied to identified improvement areas
- Advanced scenario modeling to test potential business changes
- Expanded country-specific compliance and benchmarking data
- Machine learning algorithms to refine recommendations based on outcome data
- Integration with telehealth platforms and patient engagement tools
- Advanced competitive analysis tools
- AI-assisted SOP customization based on practice patterns and outcomes
- Collaborative SOP editing and annotation features
- Regulatory update monitoring with automatic SOP revision suggestions
- Multi-discipline practice assessment with cross-discipline optimization
- Specialized modules for unique allied health niches
- Expansion to other healthcare disciplines beyond allied health
- Cross-discipline referral optimization for multi-discipline practices
- Leverage Supabase Edge Functions for distributed processing of assessment data
- Implement Supabase Realtime for collaborative SOP editing and annotations
- Utilize Supabase Storage for secure, structured document management
- Implement advanced Row-Level Security (RLS) policies for multi-tenant data access
- Create custom PostgreSQL functions for complex business logic and reporting 