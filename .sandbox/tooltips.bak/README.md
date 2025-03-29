# Tooltip Components (Sandboxed)

This directory contains tooltip-related code that was moved to a sandbox for later implementation. According to the project story (story-1d.story.md), tooltip development is tasks 37-44 in the UI implementation plan.

## Structure

- `components/`: Tooltip React components and styles
- `tests/`: Tooltip component tests
- `services/`: Tooltip-related services

## Components

- `Tooltip.tsx`: Base tooltip component
- `EnhancedTooltip.tsx`: Advanced tooltip with additional features
- `QuestionTooltip.tsx`: Question-specific tooltip
- `TooltipDemonstration.tsx`: Demo component
- `TooltipTestingDemo.tsx`: Testing demo component
- `TooltipUserTesting.tsx`: User testing component

## Services

- `TooltipUserTestingService.ts`: Service for tooltip testing and feedback

## Implementation Status

This code was sandboxed because:
1. It was started before core UI components were implemented
2. Tooltips are tasks 37-44 in the UI implementation plan
3. Core components need to be completed first

## Future Implementation

This code should be reintegrated after:
1. Core UI components are implemented (tasks 1-36)
2. Basic question and navigation components are tested
3. Proper test environment is established

## Original Location

- Components: `client/src/components/tooltips/`
- Tests: `tests/unit/client/components/tooltips/`
- Services: `client/src/services/TooltipUserTestingService.ts` 