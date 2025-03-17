# Questionnaire Navigation Wireframes

## Desktop Layout

```
┌──────────────────────────────────────────────────────────┐
│ Assessment Navigation                                    │
├──────────────────────────────────────────────────────────┤
│ ┌────────────────────┐ ┌───────────────────────────┐    │
│ │ Total Progress: 27%│ │ Time Remaining: 25 min    │    │
│ └────────────────────┘ └───────────────────────────┘    │
├──────────────────────────────────────────────────────────┤
│ ┌────────────────────────────────────────────────────┐   │
│ │ Financial Health                                   │   │
│ │ ├─ Progress: 60% │ 15 min │ 6/10 questions        │   │
│ │ └─ [Active Module]                                 │   │
│ └────────────────────────────────────────────────────┘   │
│                                                          │
│ ┌────────────────────────────────────────────────────┐   │
│ │ 🔒 Operations                                      │   │
│ │ ├─ Progress: 0% │ 20 min │ 0/12 questions         │   │
│ │ └─ Requires: Financial Health                      │   │
│ └────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────┘
```

## Mobile Layout (Collapsed)

```
┌──────────────────────────────────┐
│ ☰ Assessment Navigation         │
├──────────────────────────────────┤
│ Total Progress: 27%             │
│ Time Remaining: 25 min          │
└──────────────────────────────────┘
```

## Mobile Layout (Expanded)

```
┌──────────────────────────────────┐
│ ☰ Assessment Navigation         │
├──────────────────────────────────┤
│ Total Progress: 27%             │
│ Time Remaining: 25 min          │
├──────────────────────────────────┤
│ ┌────────────────────────────┐  │
│ │ Financial Health          │  │
│ │ 60% │ 15 min │ 6/10      │  │
│ └────────────────────────────┘  │
│                                 │
│ ┌────────────────────────────┐  │
│ │ 🔒 Operations             │  │
│ │ 0% │ 20 min │ 0/12       │  │
│ │ Requires: Financial Health │  │
│ └────────────────────────────┘  │
└──────────────────────────────────┘
```

## Component Details

### Module Card
```
┌────────────────────────────────────────────┐
│ Module Title                              │
│ ├─ Progress Bar [===========------] 60%   │
│ ├─ Time: XX min                          │
│ ├─ Questions: X/Y completed              │
│ └─ [Status Indicator]                    │
└────────────────────────────────────────────┘
```

### Progress Overview
```
┌─────────────────────┐
│ Total Progress      │
│ [===============--] │
│ XX% Complete        │
└─────────────────────┘
```

### Time Display
```
┌─────────────────────┐
│ Time Remaining      │
│ XX minutes          │
└─────────────────────┘
```

## Interactive States

### Module States
1. Active:
   - Highlighted border
   - Full opacity
   - All interactions enabled

2. Locked:
   - 🔒 icon displayed
   - Reduced opacity
   - Prerequisites shown
   - Click disabled

3. Completed:
   - ✓ icon displayed
   - Success color
   - Progress bar full

### Hover States
- Module Card:
  - Slight elevation
  - Background color shift
  - Cursor: pointer (if not locked)

### Focus States
- Keyboard focus ring
- High contrast outline
- ARIA-selected state

## Accessibility Features

1. ARIA Labels:
   ```html
   <nav aria-label="Assessment Navigation">
   <button aria-expanded="true/false">
   <div role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100">
   ```

2. Screen Reader Text:
   ```html
   <span class="sr-only">Module completion status: 60%</span>
   <span class="sr-only">Module locked, requires Financial Health completion</span>
   ```

## Color Scheme

- Primary: #4a90e2 (Blue)
- Success: #2ecc71 (Green)
- Warning: #f1c40f (Yellow)
- Locked: #95a5a6 (Gray)
- Text: #2c3e50 (Dark Blue)
- Background: #ffffff (White)
- Dark Mode variants included in CSS

## Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px 