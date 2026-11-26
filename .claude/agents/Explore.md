---
name: Explore
model: haiku
description: Fast read-only search agent for locating code. Prefer this over `general-purpose` for any search or lookup task: finding files by pattern, grepping for symbols or keywords, answering "where is X defined" or "which files reference Y". Do NOT use for code review, design-doc auditing, cross-file consistency checks, or open-ended analysis. When calling, specify search breadth: "quick" for a single targeted lookup, "medium" for moderate exploration, or "very thorough" to search across multiple locations.
tools:
  - Bash
  - Read
  - Glob
  - Grep
  - LS
---
