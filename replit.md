# RFP Analyzer and Response Generator

## Overview

This is an AI-powered RFP (Request for Proposal) analysis and response generation application built for Zenloop. The system uses OpenAI's language models to analyze RFP documents, extract key requirements, and generate professional proposal responses. It features a comprehensive document management system that allows users to upload company documents and integrate them into the response generation process to create more accurate and personalized proposals.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React hooks and context for local state, TanStack Query for server state
- **Routing**: React Router for navigation between different application sections

### Component Structure
- **Dashboard**: Main application layout with tabbed navigation
- **RFPUploader**: Handles file upload with drag-and-drop support
- **RFPAnalyzer**: AI-powered document analysis interface
- **ResponseGenerator**: Automated proposal response creation
- **CompanyDocuments**: Document management system for Zenloop materials
- **ManagementPanel**: RFP tracking and analytics dashboard

### AI Integration
- **OpenAI Service**: Centralized service for AI interactions using GPT-4
- **Document Analyzer**: Expert-level RFP analysis with McKinsey-style insights
- **Response Generation**: Section-by-section proposal creation with company-specific content
- **Content Integration**: Smart matching of relevant company documents to RFP requirements

### Data Management
- **Document Storage**: In-memory document management with support for text files
- **Content Search**: Full-text search across uploaded company documents
- **Metadata Extraction**: Automatic categorization and tagging of documents
- **Context Awareness**: Intelligent content matching based on RFP requirements

### Configuration Management
- **Environment Variables**: Comprehensive configuration through Vite environment variables
- **Feature Flags**: Toggleable features for AI generation, collaboration, and analytics
- **API Configuration**: Configurable endpoints, timeouts, and rate limiting

## External Dependencies

### AI Services
- **OpenAI API**: GPT-4 for document analysis and response generation
- **Model Configuration**: gpt-4-turbo-preview with configurable parameters

### UI Dependencies
- **shadcn/ui**: Complete UI component library built on Radix UI
- **Lucide React**: Icon library for consistent iconography
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Class Variance Authority**: Type-safe component variants

### Development Tools
- **TypeScript**: Type safety and better developer experience
- **ESLint**: Code linting with React-specific rules
- **Vite**: Fast build tool with hot module replacement
- **PostCSS**: CSS processing with Tailwind integration

### Deployment
- **Vercel**: Configured for easy deployment with environment variable management
- **Static Site Generation**: Optimized build for fast loading and SEO

### Future Integrations
- **Supabase**: Database and authentication (configured but not implemented)
- **PDF Processing**: Support for PDF, DOCX, and PowerPoint files
- **Real-time Collaboration**: Multi-user editing capabilities
- **Analytics**: Usage tracking and performance metrics