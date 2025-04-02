# Personal Portfolio

A Next.js application for showcasing your professional portfolio with admin capabilities.

## Features

- **Modern UI** with Tailwind CSS
- **Authentication** with NextAuth.js
- **Database Integration** with MongoDB
- **Admin Dashboard** to manage portfolio content
- **Responsive Design** for all devices

## Getting Started

### Prerequisites

- Node.js 18.17.0 or later
- MongoDB database (Atlas or local)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd personal-portfolio
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

4. Edit the `.env.local` file with your MongoDB connection string and NextAuth secret:
```
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
ADMIN_SETUP_KEY=your_admin_setup_key
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

7. Visit [http://localhost:3000/admin/setup](http://localhost:3000/admin/setup) to create your admin account.

## Deployment

This application can be deployed to Vercel with minimal configuration:

1. Push your code to a GitHub repository.
2. Import the project to Vercel.
3. Configure the environment variables in the Vercel dashboard.
4. Deploy!

## Project Structure

- `/src/app` - Next.js App Router pages and API routes
- `/src/components` - Reusable React components
- `/src/lib` - Utility functions and database connection
- `/src/models` - MongoDB models
- `/public` - Static assets

## Customization

### Adding New Sections

1. Update the `Profile` model in `/src/models/Profile.ts`
2. Create a new admin page in `/src/app/admin/[section]/page.tsx`
3. Update the main page in `/src/app/page.tsx` to display the new section

### Modifying Styles

This project uses Tailwind CSS. You can modify styles by:

1. Editing the Tailwind configuration in `tailwind.config.js`
2. Adding or modifying classes in the component files

## License

This project is MIT licensed.
