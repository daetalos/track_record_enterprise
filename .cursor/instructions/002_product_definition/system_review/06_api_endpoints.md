# API Endpoints & Functionality

## Overview

The TrackRecord system provides a comprehensive set of web endpoints that support both traditional web pages and AJAX-based API functionality. The system follows Django URL routing patterns with clear separation between user-facing pages and API endpoints.

## URL Structure & Routing

### Base URL Pattern

All application URLs are prefixed with the `records` app namespace:

- **Base Pattern**: `/records/`
- **Namespace**: `records:`
- **URL Resolution**: Django's URL resolver handles routing to appropriate view functions

### Authentication Integration

- **Login Endpoint**: `/records/login/` - Custom login view
- **Logout Endpoint**: `/records/logout/` - Standard Django logout with redirect
- **Session Management**: All endpoints respect Django's session-based authentication

## Core Web Endpoints

### Home & Navigation

- **Home Page**: `/records/` → `views.home`
  - **Purpose**: Main dashboard and landing page
  - **Access**: Public (anonymous users can view)
  - **Features**: Club records overview, recent performances, quick navigation

- **Club Selection**: `/records/set-club/` → `views.set_current_club`
  - **Purpose**: Switch between clubs for multi-club users
  - **Method**: POST
  - **Access**: Authenticated users only
  - **Functionality**: Updates session with selected club context

### Record & Performance Views

#### Club Records

- **Club Records Grid**: `/records/club-records/` → `views.club_records`
  - **Purpose**: Main club records display with filtering and sorting
  - **Access**: Public with club-specific data
  - **Features**: Interactive grid, filtering, sorting, export capabilities

#### Performance Management

- **New Performance**: `/records/performances/new/` → `views.new_performance`
  - **Purpose**: Record new athletic performances
  - **Access**: Authenticated users only
  - **Method**: GET (form display), POST (form submission)
  - **Features**: Dynamic form with athlete search, discipline selection, validation

- **View Performance**: `/records/performances/<int:performance_id>/view/` → `views.view_performance`
  - **Purpose**: Display detailed performance information
  - **Access**: Club-specific access control
  - **Features**: Performance details, proof file display, related records

#### Medal Management

- **New Medals**: `/records/medals/new/` → `views.new_medals`
  - **Purpose**: Record competition medals for multiple athletes
  - **Access**: Authenticated users only
  - **Features**: Bulk medal entry, competition event details

- **Medals Overview**: `/records/medals/overview/` → `views.medals_overview`
  - **Purpose**: Display medal statistics and summaries
  - **Access**: Club-specific data
  - **Features**: Medal counts, competition summaries, athlete achievements

### Athlete Management

#### Athlete Views

- **Athlete List**: `/records/athletes/` → `views.athlete_list`
  - **Purpose**: Searchable directory of club athletes
  - **Access**: Club-specific data
  - **Features**: Search, filtering, pagination, athlete profiles

- **Athlete Detail**: `/records/athletes/<int:athlete_id>/` → `views.athlete_detail`
  - **Purpose**: Individual athlete profile and performance history
  - **Access**: Club-specific access control
  - **Features**: Performance grids, records, personal bests, medals

- **Athlete Performances**: `/records/athlete-performances/` → `views.athlete_performances`
  - **Purpose**: Performance grid for all athletes or specific athlete
  - **Access**: Club-specific data
  - **Features**: Filterable performance grid, export capabilities

- **Athlete Performances Detail**: `/records/athlete-performances/<int:athlete_id>/` → `views.athlete_performances`
  - **Purpose**: Performance grid for specific athlete
  - **Access**: Club-specific access control
  - **Features**: Athlete-specific performance history

#### Bulk Athlete Management

- **Athlete Upload Home**: `/records/athlete-upload/` → `views.athlete_upload_home`
  - **Purpose**: CSV upload interface for bulk athlete creation
  - **Access**: Staff users only
  - **Features**: File upload, template download, validation

- **Athlete Upload Template**: `/records/athlete-upload/template/` → `views.athlete_upload_template`
  - **Purpose**: Download CSV template for athlete uploads
  - **Access**: Staff users only
  - **Features**: Pre-formatted CSV template download

- **Athlete Upload Confirm**: `/records/athlete-upload/confirm/` → `views.athlete_upload_confirm`
  - **Purpose**: Confirm and process validated athlete CSV data
  - **Access**: Staff users only
  - **Features**: Data validation, confirmation interface, bulk creation

### Reference Data Views

#### Disciplines

- **Discipline List**: `/records/disciplines/` → `views.discipline_list`
  - **Purpose**: Display all available athletic disciplines
  - **Access**: Public with club-specific data
  - **Features**: Discipline categories, seasonal grouping, event details

- **Discipline Detail**: `/records/disciplines/<int:discipline_id>/` → `views.discipline_detail`
  - **Purpose**: Detailed view of specific discipline with records
  - **Access**: Club-specific access control
  - **Features**: Discipline-specific records, performance history, statistics

#### Age Groups

- **Age Group List**: `/records/age-groups/` → `views.age_group_list`
  - **Purpose**: Display club's age group categories
  - **Access**: Club-specific data
  - **Features**: Age group definitions, athlete counts, record summaries

- **Age Group Records**: `/records/age-groups/<int:age_group_id>/` → `views.age_group_records`
  - **Purpose**: Records and performances for specific age group
  - **Access**: Club-specific access control
  - **Features**: Age group specific records, performance grids, statistics

#### Seasons & Medals

- **Season List**: `/records/seasons/` → `views.season_list`
  - **Purpose**: Display available competition seasons
  - **Access**: Public data
  - **Features**: Season definitions, discipline groupings

- **Medal List**: `/records/medals/` → `views.medal_list`
  - **Purpose**: Display medal system and positions
  - **Access**: Public data
  - **Features**: Medal definitions, position explanations

## AJAX API Endpoints

### Athlete Management APIs

#### Athlete Search & Creation

- **Search Athletes**: `/records/api/search_athletes/` → `views.search_athletes`
  - **Method**: GET
  - **Purpose**: AJAX search for athletes by name
  - **Parameters**: `q` (search query)
  - **Response**: JSON list of matching athletes
  - **Access**: Authenticated users, club-specific results

- **Create Athlete**: `/records/api/create_athlete/` → `views.create_athlete`
  - **Method**: POST
  - **Purpose**: Create new athlete via AJAX
  - **Parameters**: `first_name`, `last_name`, `gender_id`
  - **Response**: JSON with athlete data or validation errors
  - **Access**: Authenticated users only

- **Get Athlete Last Performance**: `/records/api/get_athlete_last_performance/<int:athlete_id>/` → `views.get_athlete_last_performance`
  - **Method**: GET
  - **Purpose**: Retrieve athlete's most recent performance data
  - **Response**: JSON with performance details for form pre-population
  - **Access**: Club-specific access control

### Form Support APIs

#### Dynamic Form Data

- **Get Disciplines**: `/records/api/get_disciplines/` → `views.get_disciplines`
  - **Method**: GET
  - **Purpose**: Retrieve disciplines for form dropdowns
  - **Parameters**: `season_id` (optional)
  - **Response**: JSON list of disciplines
  - **Access**: Public data

- **Get Medals**: `/records/api/get_medals/` → `views.get_medals`
  - **Method**: GET
  - **Purpose**: Retrieve available medals for form dropdowns
  - **Response**: JSON list of medal positions
  - **Access**: Public data

- **Get Age Groups**: `/records/api/get_age_groups/` → `views.get_age_groups`
  - **Method**: GET
  - **Purpose**: Retrieve age groups for form dropdowns
  - **Response**: JSON list of age groups
  - **Access**: Club-specific data

#### Typeahead & Autocomplete

- **Event Details Typeahead**: `/records/api/event_details_typeahead/` → `views.event_details_typeahead`
  - **Method**: GET
  - **Purpose**: Provide autocomplete suggestions for event details
  - **Parameters**: `q` (search query)
  - **Response**: JSON list of suggested event details
  - **Access**: Club-specific suggestions

### Performance Management APIs

#### Performance Operations

- **Create Performance**: `/records/api/create_performance/` → `views.create_performance`
  - **Method**: POST
  - **Purpose**: Create new performance record via AJAX
  - **Parameters**: Complete performance data (athlete, discipline, values, etc.)
  - **Response**: JSON with success/error status and performance details
  - **Access**: Authenticated users only

- **Check Performance Records**: `/records/api/check_performance_records/` → `views.check_performance_records`
  - **Method**: POST
  - **Purpose**: Check if performance would be a club record or personal best
  - **Parameters**: Performance data for validation
  - **Response**: JSON with record status information
  - **Access**: Authenticated users only

- **Check Duplicate Performance**: `/records/api/check_duplicate_performance/` → `views.check_duplicate_performance`
  - **Method**: POST
  - **Purpose**: Validate if performance already exists
  - **Parameters**: Performance uniqueness data
  - **Response**: JSON with duplicate status
  - **Access**: Authenticated users only

### Data Export & Grid APIs

#### Performance Grid

- **Performance Grid API**: `/records/api/performance_grid/` → `views.api_performance_grid`
  - **Method**: GET
  - **Purpose**: Retrieve performance data for interactive grids
  - **Parameters**: Filtering and sorting parameters
  - **Response**: JSON with paginated performance data
  - **Access**: Club-specific data

#### Data Export

- **Export Performances CSV**: `/records/api/export_performances_csv/` → `views.export_performances_csv`
  - **Method**: GET
  - **Purpose**: Export performance data as CSV file
  - **Parameters**: Filtering parameters
  - **Response**: CSV file download
  - **Access**: Club-specific data

### File Management APIs

#### Secure File Access

- **Secure File Download**: `/records/api/secure_file/<int:performance_id>/download/` → `views.secure_file_download`
  - **Method**: GET
  - **Purpose**: Secure download of performance proof files
  - **Parameters**: `performance_id` in URL
  - **Response**: File download with security checks
  - **Access**: Club-specific access control with performance validation

## API Response Formats

### Standard JSON Response Structure

#### Success Response Format

```json
{
  "success": true,
  "data": {
    // Response data specific to endpoint
  },
  "message": "Operation completed successfully"
}
```

#### Error Response Format

```json
{
  "success": false,
  "errors": {
    "field_name": ["Error message 1", "Error message 2"],
    "non_field_errors": ["General error message"]
  },
  "message": "Validation failed"
}
```

### Specific Response Examples

#### Athlete Search Response

```json
{
  "success": true,
  "data": [
    {
      "athlete_id": 123,
      "first_name": "John",
      "last_name": "Smith",
      "gender": "Male",
      "display_name": "Smith, John"
    }
  ]
}
```

#### Performance Grid Response

```json
{
  "success": true,
  "data": {
    "performances": [
      {
        "performance_id": 456,
        "athlete_name": "Smith, John",
        "discipline_name": "100m",
        "time_seconds": 12.45,
        "is_current_club_record": true,
        "is_personal_best": false,
        "date": "2023-06-15"
      }
    ],
    "total_count": 150,
    "page": 1,
    "has_next": true
  }
}
```

## Security & Access Control

### Authentication Requirements

#### Public Endpoints

- Home page and basic record views
- Reference data (seasons, medals, discipline lists)
- Club records (filtered by club context)

#### Authenticated User Endpoints

- Performance creation and management
- Athlete search and creation
- Personal performance data
- File uploads and downloads

#### Staff User Endpoints

- Bulk athlete uploads
- CSV template downloads
- Administrative functions

#### Superuser Endpoints

- Django admin interface
- Cross-club data access
- System administration

### Data Access Patterns

#### Club Context Filtering

- All data queries automatically filtered by current club context
- Session-based club selection maintained across requests
- No cross-club data leakage in API responses

#### Permission Validation

- View-level permission checks for all endpoints
- Model-level access control for data operations
- File access validation for secure downloads

## Error Handling

### HTTP Status Codes

#### Standard Status Codes

- **200 OK**: Successful GET requests
- **201 Created**: Successful POST requests creating new resources
- **400 Bad Request**: Validation errors or malformed requests
- **401 Unauthorized**: Authentication required
- **403 Forbidden**: Permission denied
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server-side errors

#### Custom Error Responses

- Validation errors include field-specific messages
- Business rule violations provide clear explanations
- File upload errors specify acceptable formats and sizes

### Error Logging

- All errors logged with appropriate severity levels
- User actions tracked for audit purposes
- Security events logged for monitoring

## Performance Considerations

### Caching Strategy

- Static reference data cached for performance
- Frequent queries optimized with database indexes
- Session data cached for club context

### Database Optimization

- Efficient queries with select_related and prefetch_related
- Pagination for large datasets
- Strategic indexing for common query patterns

### Response Optimization

- Minimal data transfer for API responses
- Compressed responses for large datasets
- Lazy loading for non-critical data

## Integration Points

### Frontend Integration

- AJAX endpoints support dynamic form behavior
- JSON responses compatible with JavaScript frameworks
- CSRF protection for all POST requests

### External System Integration

- CSV export functionality for data migration
- File upload support for proof documentation
- API endpoints designed for potential mobile app integration

This comprehensive API documentation provides a complete reference for all system endpoints, their functionality, security requirements, and integration patterns within the TrackRecord athletics management system.
