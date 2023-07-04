# Chatter

## Description

Chatter is a web application aimed at providing a user-friendly and interactive platform for real-time communication and social interactions. The application allows users to create accounts, share posts, react to posts, and follow other users. It leverages the power of Next.js, React, and Supabase to deliver a smooth and seamless user experience.

## Features

- **User Authentication**: Chatter uses Supabase's authentication helpers to enable secure user registration and login functionalities.

- **Real-time Post Updates**: Users can create, read, update, and delete posts in real-time, providing a dynamic and engaging environment for social interactions.

- **Reaction Buttons**: The application incorporates a set of reaction buttons, allowing users to express their emotions and engagement with posts.

- **Social Media Profile Links**: Users have the option to input their social media profile links, enabling seamless cross-platform connections.

- **Profile Picture Upload**: Chatter enables users to upload their profile pictures, enhancing personalization and identity on the platform.

## Technologies Used

- **Next.js**: The application is built using Next.js, a powerful framework that enables server-side rendering, static site generation, and more, leading to better performance and SEO.

- **React**: The frontend is built with React, a popular JavaScript library that facilitates the creation of interactive user interfaces.

- **Supabase**: Chatter integrates with Supabase, a robust backend-as-a-service platform that simplifies database management and user authentication.

- **React Redux**: State management is handled using React Redux, allowing efficient handling of application state and data flow.

- **React Hook Form**: For form validation and management, Chatter utilizes React Hook Form, which makes form handling straightforward and efficient.

- **Tailwind CSS**: The application is styled using Tailwind CSS, offering a utility-first approach for flexible and responsive designs.

- **SWR**: Chatter utilizes SWR (stale-while-revalidate) to handle data fetching and caching, resulting in a smoother user experience.

- **Yup**: Yup is used for data schema validation, ensuring data consistency and accuracy in form inputs.

## Installation

1. Clone the repository: `git clone https://github.com/your-username/chatter.git`.
2. Navigate to the project directory: `cd chatter`.
3. Install dependencies: `npm install`.
4. Create a `.env.local` file in the root directory and set environment variables like Supabase URL and API key.

## Usage

1. Start the development server: `npm run dev`.
2. Open your web browser and visit `http://localhost:3000` to access the Chatter application.
