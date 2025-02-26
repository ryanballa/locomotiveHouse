# Locomotive House

An open-source project designed to simplify and enhance the management of a model railroad club.

## Background

Managing a model railroad club comes with unique challenges, especially as the club grows. One of the most pressing issues is tracking locomotive addresses and consists. This project was created to streamline that process.

## The Problem

Before Locomotive House, locomotive addresses and consists were recorded in a paper binder stored in the clubhouse. This system had several drawbacks:

- Members working on locomotives at home had no way to access or update the binder.
- Updates were infrequent, leading to outdated or missing information.
- The binder was meant to prevent duplicate locomotive addresses, but the electronic system offered no built-in protections against duplicates.

## The Solution

Locomotive House provides a digital solution for tracking locomotive addresses and consists:

- Users can register a locomotive address, even if someone else has already claimed it. However, the system clearly indicates if the number is currently active on the layout and prevents multiple activations of the same address.
- Consists, unlike addresses, must be unique. Once all available consists are claimed, cleanup will be required—this will be addressed in a future milestone.

This project aims to make model railroad club management more efficient, accessible, and reliable.

## Developing

Contributions are welcome! However, the project has primarily focused on feature development rather than optimizing for external contributions. As the project matures, efforts will be made to improve documentation and streamline the contribution process.

Run `npm install` to install dependencies. To start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Other Dependencies

We use Clerk for authentication. A free account can easily be setup. The internal API needs to be running. This could be pointed to production or staging to avoid running a local copy.

TODO: Add details
