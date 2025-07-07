# Business Rules & Validation Logic

## Overview

The TrackRecord system implements comprehensive business rules to ensure data integrity, accurate record keeping, and proper athletics competition management. These rules are enforced at multiple layers: database constraints, model validation, form validation, and business logic.

## Core Entity Validation Rules

### Club Management Rules

#### Club Creation & Naming

- **Unique Club Names**: Club names must be unique across the entire system
- **Name Length**: Club names limited to 256 characters maximum
- **Name Format**: No specific format restrictions, allows flexibility for different club naming conventions
- **Deletion Protection**: Clubs cannot be deleted if they have associated athletes or performances

#### Club Data Isolation

- **Multi-Club Support**: System supports multiple clubs with complete data isolation
- **Club Context**: All user interactions are scoped to a specific club context
- **Cross-Club Restrictions**: Users cannot access data from clubs they don't belong to
- **Club Switching**: Authenticated users can switch between clubs they have access to

### Athlete Management Rules

#### Athlete Registration

- **Name Requirements**: Both first name and last name are required (64 characters max each)
- **Unique Athlete Rule**: Athletes must be unique within a club based on first name + last name combination
- **Cross-Club Athletes**: Same person can be registered in multiple clubs as separate athlete records
- **Gender Assignment**: Each athlete must be assigned a gender (Male/Female)
- **Club Assignment**: Each athlete must belong to exactly one club

#### Athlete Data Integrity

- **Name Validation**: Names cannot be empty or contain only whitespace
- **Gender Consistency**: Athlete's gender must match available gender options in system
- **Club Relationship**: Athlete's club must exist and be valid
- **Deletion Rules**: Athletes cannot be deleted if they have associated performances

### Age Group Management Rules

#### Age Group Structure

- **Club-Specific**: Age groups are defined per club, allowing customization
- **Unique Names**: Age group names must be unique within each club
- **Ordinal Ordering**: Age groups have ordinal values for proper sorting (U9 < U10 < U11, etc.)
- **Name Format**: Common formats include U9, U10, U11, Junior, Senior, Masters
- **Flexible Naming**: No strict naming conventions enforced, clubs can define their own

#### Age Group Business Logic

- **Ordering System**: Ordinal values determine display order and progression
- **Performance Grouping**: Performances are grouped by age group for record tracking
- **Record Segregation**: Club records are maintained separately for each age group
- **Age Group Assignment**: Each performance must be assigned to an age group

## Performance Recording Rules

### Core Performance Validation

#### Performance Value Requirements

- **Either Medal or Performance**: Each performance must have either a medal position OR a performance value
- **Not Both Required**: A performance can have just a medal (e.g., participation awards) or just a performance value
- **Value Type Matching**: Performance values must match the discipline type:
  - Timed disciplines: `time_seconds` field only
  - Measured disciplines: `distance_meters` field only
- **Null Value Handling**: Performance values can be null if medal is provided

#### Discipline-Specific Validation

- **Timed Disciplines**:
  - Must use `time_seconds` field
  - Cannot have `distance_meters` value
  - Time must be positive value
  - Smaller values are better (faster times)
- **Measured Disciplines**:
  - Must use `distance_meters` field
  - Cannot have `time_seconds` value
  - Distance must be positive value
  - Larger values are better (longer distances)

#### Performance Uniqueness

- **Unique Constraint**: Performances are unique based on:
  - Athlete + Discipline + Age Group + Gender + Date + Event Details
- **Duplicate Prevention**: System prevents identical performance records
- **Event Details**: Used as part of uniqueness to allow multiple performances same day
- **Date Significance**: Same athlete can have multiple performances in same discipline on different dates

## Record Management Rules

### Club Record Calculation

#### Record Determination Logic

- **Automatic Calculation**: Club records are automatically calculated when performances are saved
- **Age Group Specific**: Records are maintained separately for each age group within a club
- **Gender Specific**: Records are maintained separately by gender (Male/Female)
- **Mixed Gender Events**: Team events can be mixed gender (gender = null)
- **Discipline Specific**: Each discipline maintains separate records
- **Season Consideration**: Records are tracked per discipline, which includes season context

#### Record Comparison Rules

- **Timed Events**: Smaller values are better (faster times win)
- **Measured Events**: Larger values are better (longer distances win)
- **Precision**: Times stored as float seconds, distances as float meters
- **Tie Breaking**: In case of identical values, most recent performance becomes the record
- **Historical Tracking**: `was_club_record` flag tracks if performance was ever a record

#### Record Update Process

- **New Record Detection**: System checks if new performance would be a club record
- **Automatic Flagging**: `is_current_club_record` flag set to true for new records
- **Previous Record Reset**: When new record is set, previous record's `is_current_club_record` flag is set to false
- **Batch Updates**: All existing records for same category are updated when new record is established

### Personal Best Tracking

#### Personal Best Rules

- **Career Best**: Personal bests are tracked across all age groups (career best, not age group best)
- **Discipline Specific**: Each discipline maintains separate personal bests for each athlete
- **Individual Only**: Team disciplines do not have personal bests
- **Gender Neutral**: Personal bests are not gender-specific (athlete's performances across all contexts)
- **Automatic Tracking**: `is_personal_best` flag automatically maintained

#### Personal Best Calculation

- **Comparison Logic**: Same comparison rules as club records (smaller for timed, larger for measured)
- **Team Event Exclusion**: If `discipline.team_size > 1`, no personal best is calculated
- **Update Process**: When new PB is established, previous PB's `is_personal_best` flag is reset
- **Historical Tracking**: `was_personal_best` flag tracks if performance was ever a PB

## Discipline Management Rules

### Discipline Definition Rules

#### Discipline Properties

- **Season Association**: Each discipline must belong to a season (Track & Field, Indoors, etc.)
- **Unique Naming**: Discipline names must be unique within each season
- **Type Classification**: Each discipline must be either timed OR measured (mutually exclusive)
- **Comparison Direction**: `is_smaller_better` flag determines if smaller or larger values are better
- **Team Size**: Optional team size field for relay/team events

#### Discipline Validation

- **Exclusive Types**: Cannot be both timed and measured
- **Required Type**: Must be either timed or measured
- **Team Size Rules**: If specified, team size must be at least 1
- **Season Consistency**: Discipline must reference valid season

### Medal System Rules

#### Medal Positions

- **Position Range**: Medals cover positions 1-12
- **Standard Medals**: 1st = Gold, 2nd = Silver, 3rd = Bronze
- **Extended Bronze**: Positions 4-12 are Bronze medals (for cross-country events)
- **Unique Positions**: Each medal position must be unique in the system
- **Ordered Display**: Medals are displayed in position order (1st, 2nd, 3rd, etc.)

#### Medal Assignment Rules

- **Optional Assignment**: Medals are optional for performances
- **Competition Context**: Medals represent competition placement
- **No Performance Required**: Medals can be assigned without performance values
- **Mixed Assignment**: Performances can have both medal and performance value

## Data Integrity Rules

### Performance Modification Rules

#### Edit Restrictions

- **No In-Place Editing**: Performances cannot be edited after creation
- **Delete and Recreate**: To modify a performance, it must be deleted and recreated
- **Record Flag Complexity**: Editing would require complex recalculation of all related record flags
- **Audit Trail**: Deletion and recreation maintains clear audit trail

#### Deletion Rules

- **Cascade Considerations**: Deleting performances may affect club records and personal bests
- **Recalculation Required**: System must recalculate records when performances are deleted
- **Permission Checks**: Only authorized users can delete performances
- **Confirmation Required**: Deletion requires explicit user confirmation

### File Upload Rules

#### File Type Restrictions

- **Image Files Only**: Only image files accepted for performance proof
- **Supported Formats**: Common image formats (JPEG, PNG, GIF, etc.)
- **File Size Limits**: Maximum file size restrictions to prevent abuse
- **Security Scanning**: Files scanned for malicious content

#### File Storage Rules

- **Secure Storage**: Files stored in secure, organized directory structure
- **Unique Naming**: Files given unique names to prevent conflicts
- **Access Control**: File access restricted to authorized users only
- **Optional Requirement**: Performance proof files are optional, not required

### Data Validation Layers

#### Model Level Validation

- **Field Constraints**: Database field constraints enforced at model level
- **Business Logic**: Complex business rules implemented in model methods
- **Cross-Field Validation**: Validation that depends on multiple fields
- **Custom Validators**: Specialized validation for athletics-specific rules

#### Form Level Validation

- **User Input Validation**: Client-side and server-side form validation
- **Error Messages**: Clear, user-friendly error messages
- **Field Dependencies**: Dynamic form behavior based on user selections
- **File Upload Validation**: Specific validation for file uploads

#### Database Level Constraints

- **Primary Keys**: Unique identifiers for all entities
- **Foreign Keys**: Referential integrity between related entities
- **Unique Constraints**: Prevent duplicate data where required
- **Check Constraints**: Database-level validation rules

## Security & Access Rules

### Authentication Requirements

#### User Access Levels

- **Anonymous Users**: Read-only access to public club records
- **Authenticated Users**: Full access to club-specific data and performance recording
- **Staff Users**: Administrative capabilities and bulk operations
- **Superusers**: Complete system administration access

#### Session Management

- **Club Context**: User sessions maintain current club context
- **Session Security**: Secure session handling with appropriate timeouts
- **Multi-Club Access**: Users can switch between clubs they have access to
- **Permission Inheritance**: Permissions inherited from user roles and club associations

### Data Access Rules

#### Club Data Isolation

- **Strict Boundaries**: Users can only access data from their associated clubs
- **No Cross-Club Access**: Accidental data leakage prevented through strict filtering
- **Context Enforcement**: All queries automatically filtered by club context
- **Administrative Override**: Superusers can access data across all clubs

#### Permission-Based Access

- **Role-Based Permissions**: Different access levels based on user roles
- **Feature-Specific Permissions**: Granular permissions for different system features
- **Administrative Functions**: Restricted access to administrative functions
- **Audit Logging**: All access attempts logged for security monitoring

## Business Logic Implementation

### Validation Enforcement Points

#### Multiple Validation Layers

1. **Client-Side Validation**: JavaScript validation for immediate user feedback
2. **Form Validation**: Django form validation for user input
3. **Model Validation**: Model-level validation for business rules
4. **Database Constraints**: Database-level constraints for data integrity

#### Error Handling Strategy

- **Graceful Degradation**: System continues to function even with validation errors
- **Clear Error Messages**: Users receive clear, actionable error messages
- **Error Recovery**: Users can easily correct validation errors
- **Logging**: All validation errors logged for system monitoring

### Performance Optimization Rules

#### Efficient Record Calculation

- **Cached Flags**: Record status cached in performance records for fast queries
- **Batch Updates**: Multiple record updates performed in single database transactions
- **Query Optimization**: Efficient database queries for record determination
- **Index Strategy**: Database indexes optimized for common query patterns

#### Data Loading Strategies

- **Lazy Loading**: Non-critical data loaded on demand
- **Pagination**: Large datasets paginated for performance
- **Caching**: Frequently accessed data cached for speed
- **Selective Loading**: Only required fields loaded in queries

This comprehensive set of business rules ensures the TrackRecord system maintains data integrity, provides accurate athletics record keeping, and supports the complex requirements of multi-club athletics management while maintaining security and performance standards.
