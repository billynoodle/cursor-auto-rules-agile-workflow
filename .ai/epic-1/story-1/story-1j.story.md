# Epic-1: Core Assessment Framework Development for Allied Health Practices
# Story-1j: Design Comprehensive Business Assessment - Structure and Diagrams

## Structure

```
/client
  /src
    /components
      /assessment
        QuestionRenderer.tsx
        ModuleNavigation.tsx
        ProgressTracker.tsx
        ScoreDisplay.tsx
        ResultsDashboard.tsx
        PracticeSizeSelector.tsx
        CountrySelector.tsx
        DisciplineSelector.tsx
        CustomVariableCreator.tsx
        SOPRecommendationDisplay.tsx
        ScoreInterpreter.tsx
        ActionPromptDisplay.tsx
        MaterialFinderInterface.tsx
    /types
      assessment.types.ts
      scoring.types.ts
      practice.types.ts
      country.types.ts
      discipline.types.ts
      custom.types.ts
      sop.types.ts
      interpretation.types.ts
      material.types.ts
    /constants
      questionCategories.ts
      moduleDefinitions.ts
      scoringConstants.ts
      countrySpecificData.ts
      disciplineSpecificData.ts
      practiceSizeScaling.ts
      sopTypes.ts
      scorePositions.ts
      actionPrompts.ts
      materialResources.ts
    /utils
      scoringCalculations.ts
      benchmarkComparison.ts
      practiceScaling.ts
      countryNormalization.ts
      disciplineAdapter.ts
      customVariableHandler.ts
      sopRelevanceMapper.ts
      scoreInterpreter.ts
      actionPromptGenerator.ts
      materialFinder.ts
    /plugins
      /disciplines
        physiotherapy.plugin.ts
        disciplineRegistry.ts
        baseDiscipline.interface.ts
/server
  /src
    /models
      Question.ts
      Module.ts
      AssessmentCategory.ts
      Score.ts
      PracticeProfile.ts
      Country.ts
      Discipline.ts
      CustomVariable.ts
      SOPType.ts
      ScorePosition.ts
      MaterialResource.ts
    /services
      QuestionService.ts
      ModuleService.ts
      ScoringService.ts
      BenchmarkService.ts
      PracticeProfileService.ts
      CountrySpecificService.ts
      DisciplineService.ts
      CustomVariableService.ts
      SOPRelevanceService.ts
      ScoreInterpretationService.ts
      ActionPromptService.ts
      MaterialFinderService.ts
      DisciplinePluginService.ts
```

## Diagrams

### Assessment Flow

```mermaid
graph TD
    A[Start Assessment] -->|Create Practice Profile| B1[Select Discipline]
    B1 -->|Initial MVP: Physiotherapy| B2[Select Practice Size]
    B2 -->|Select Country| C[Configure Assessment]
    C -->|Load Modules Based on Discipline| D[Present Modules]
    D -->|Select Module| E[Present Questions]
    E -->|Answer Questions| F{More Questions?}
    F -->|Yes| E
    F -->|No| G[Calculate Module Score]
    G -->|Store Results| H{More Modules?}
    H -->|Yes| D
    H -->|No| I[Add Custom Variables?]
    I -->|Yes| J[Create Custom Variables]
    J -->|Configure| K[Answer Custom Questions]
    I -->|No| L[Calculate Overall Score]
    K -->|Complete| L
    L -->|Generate| M[Results Dashboard]
    M -->|Display| N[Strengths & Weaknesses]
    M -->|Display| O[Benchmarking]
    M -->|Generate| P[Recommendations]
    M -->|Identify| Q[SOP Opportunities]
    M -->|Interpret| R[Score Position]
    R -->|Generate| S[Action Prompts]
    Q -->|Find| T[Relevant Materials]
    
    style B1 fill:#f9f,stroke:#333
    style B2 fill:#f9f,stroke:#333
    style C fill:#f9f,stroke:#333
    style J fill:#bbf,stroke:#333
    style Q fill:#fbb,stroke:#333
    style R fill:#bfb,stroke:#333
    style S fill:#bfb,stroke:#333
    style T fill:#fbb,stroke:#333
```

### Scaling System

```mermaid
graph TD
    A[Practice Profile] -->|Determine| B[Practice Size]
    B -->|Solo| C[Essential Modules Only]
    B -->|Small| D[Core Modules]
    B -->|Medium| E[Comprehensive Modules]
    B -->|Large| F[Enterprise Modules]
    C -->|Simplified| G[Basic Questions]
    D -->|Standard| H[Standard Questions]
    E -->|Detailed| I[Advanced Questions]
    F -->|Complex| J[Enterprise Questions]
    A -->|Filter By| K[Discipline Type]
    K -->|Apply| L[Discipline-Specific Content]
    L -->|Modify| G
    L -->|Modify| H
    L -->|Modify| I
    L -->|Modify| J
    G -->|Generate| M[Basic Scoring]
    H -->|Generate| N[Standard Scoring]
    I -->|Generate| O[Advanced Scoring]
    J -->|Generate| P[Enterprise Scoring]
    
    style B fill:#f9f,stroke:#333
    style C fill:#bbf,stroke:#333
    style D fill:#bbf,stroke:#333
    style E fill:#bbf,stroke:#333
    style F fill:#bbf,stroke:#333
    style K fill:#bfb,stroke:#333
    style L fill:#bfb,stroke:#333
```

### Scoring System

```mermaid
graph TD
    A[Question Responses] -->|Apply Weights| B[Weighted Question Scores]
    B -->|Aggregate| C[Module Scores]
    C -->|Apply Module Weights| D[Weighted Module Scores]
    D -->|Aggregate| E[Category Scores]
    E -->|Apply Category Weights| F[Weighted Category Scores]
    F -->|Aggregate| G[Overall Business Health Score]
    G -->|Compare to| H[Industry Benchmarks]
    H -->|Apply| I[Country Normalization]
    I -->|Apply| J[Practice Size Normalization]
    I -->|Apply| J1[Discipline Normalization]
    J -->|Calculate| K[Percentile Rankings]
    J1 -->|Adjust| K
    K -->|Include| L[Custom Variable Scores]
    L -->|Determine| M[Score Position]
    M -->|Generate| N[Action Prompts]
    L -->|Display| O[Business Health Dashboard]
    L -->|Analyze| P[SOP Recommendations]
    P -->|Find| Q[Relevant Materials]
    
    style A fill:#f9f,stroke:#333
    style G fill:#bbf,stroke:#333
    style I fill:#bfb,stroke:#333
    style J fill:#bfb,stroke:#333
    style J1 fill:#bfb,stroke:#333
    style L fill:#fbb,stroke:#333
    style M fill:#bfb,stroke:#333
    style N fill:#bfb,stroke:#333
    style P fill:#fbb,stroke:#333
    style Q fill:#fbb,stroke:#333
```

### Module Relationship

```mermaid
graph TD
    A[Assessment] -->|Contains| B[Financial Module]
    A -->|Contains| C[Operations Module]
    A -->|Contains| D[Marketing Module]
    A -->|Contains| E[Staffing Module]
    A -->|Contains| F[Compliance Module]
    A -->|Contains| G[Patients Module]
    A -->|Contains| H[Facilities Module]
    A -->|Contains| I[Geography Module]
    A -->|Contains| J[Technology Module]
    A -->|Contains| K[Automation Module]
    A -->|Contains| L[Custom Variables]
    
    A -->|Filtered By| M1[Selected Discipline]
    M1 -->|Loads| M2[Discipline-Specific Content]
    
    B -->|Has| N[Questions]
    C -->|Has| N
    D -->|Has| N
    E -->|Has| N
    F -->|Has| N
    G -->|Has| N
    H -->|Has| N
    I -->|Has| N
    J -->|Has| N
    K -->|Has| N
    L -->|Has| N
    
    M2 -->|Customizes| N
    
    N -->|Produces| O[Responses]
    O -->|Generates| P[Scores]
    P -->|Identifies| Q[Strengths/Weaknesses]
    P -->|Compared to| R[Benchmarks]
    R -->|Discipline-Specific| R1[Discipline Benchmarks]
    Q -->|Creates| S[Recommendations]
    P -->|Maps to| T[SOP Requirements]
    P -->|Determines| U[Score Position]
    U -->|Generates| V[Action Prompts]
    T -->|Finds| W[Relevant Materials]
    
    style M1 fill:#bfb,stroke:#333
    style M2 fill:#bfb,stroke:#333
    style R1 fill:#bfb,stroke:#333
```