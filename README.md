# Flowspace

Real-time collaborative Kanban board built with Next.js, dnd-kit, PostgreSQL and Socket.io.

🔗 Live: https://flowspace-ewbn.onrender.com/

## Stack

- Next.js (App Router)
- TypeScript
- PostgreSQL + Prisma
- dnd-kit (drag and drop)
- Socket.io (real-time sync)
- Custom Node server (`server.ts`)

## Features

- Multi-workspace support with member roles
- Boards, lists and cards with drag-and-drop reordering
- Card assignees, comments and file attachments
- Activity log per workspace
- Real-time updates across connected clients via Socket.io rooms

## Data Model

- **User** — account, owns created boards/cards, can be assigned to cards
- **Workspace** — top-level container, has members and boards
- **WorkspaceMember** — join table between User and Workspace, with role and position
- **Board** — belongs to a workspace, holds lists
- **List** — belongs to a board, holds cards
- **Card** — belongs to a list, has assignees, comments and attachments
- **CardAssignee** — join table between Card and User
- **Comment** — belongs to a card, written by a user
- **Attachment** — file linked to a card
- **Activity** — tracks actions performed inside a workspace

## Real-time

A custom HTTP server wraps Next.js and attaches a Socket.io instance
