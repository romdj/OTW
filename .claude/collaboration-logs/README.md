# Collaboration Logs

This directory contains session documentation for significant implementation work on OTW.sport.

## Purpose

Track progress, decisions, and knowledge transfer across development sessions to:
- Resume work efficiently after breaks
- Document architectural decisions and trade-offs
- Maintain continuity across sessions
- Share knowledge for future maintenance
- **Enable new Claude Code conversations to quickly understand context**

## Log Format

Logs are stored in **JSONL format** (one JSON object per line) for easy parsing by Claude Code.

### Record Types

```jsonl
{"type":"session","date":"YYYY-MM-DD","title":"Brief Description","branch":"main","previous_session":"filename.jsonl"}
{"type":"context","description":"What we're working on and why"}
{"type":"task","status":"completed|pending|blocked","category":"category-name","description":"Task description","files":["file1.ts","file2.ts"]}
{"type":"commit","hash":"abc123","message":"Commit message"}
{"type":"status","category":"working|blocked|pending","items":["Item 1","Item 2"]}
{"type":"technical_note","topic":"topic-name","content":"Technical details"}
{"type":"decision","topic":"topic-name","items":["Decision 1","Decision 2"]}
{"type":"next_steps","items":["Step 1","Step 2"]}
```

### Markdown Companion (Optional)

Each `.jsonl` file may have a `.md` companion for human readability.

## Naming Convention

- `YYYY-MM-DD-topic.jsonl` - Single topic sessions
- `YYYY-MM-DD-session.jsonl` - General development sessions

## Quick Reference

| Date | Topic | Status | Format |
|------|-------|--------|--------|
| 2026-02-08 | Frontend sports UI & build fixes | Active | JSONL + MD |
| 2026-01-30 | Project orientation & planning setup | Complete | JSONL + MD |

## Usage in New Conversations

To quickly load context in a new Claude Code session:

1. Read the most recent `.jsonl` file
2. Parse each line as JSON
3. Use `type` field to understand record purpose
4. Focus on `status.blocked`, `status.pending`, and `next_steps` for continuation

Example prompt: "Read the latest collaboration log in .claude/collaboration-logs/ and continue where we left off"
