# Product Feedback Web App Tool

A web-based tool for submitting and managing product feedback, built with Laravel and React.

Access the application at [https://feedback-web-app-production.up.railway.app]

## Features

- User authentication (register, login, logout)
- Feedback submission with title, description, and category
- Paginated feedback listing
- Commenting system with basic Markdown support
- Responsive design for desktop and mobile

## Requirements

- LARAVEL v12.22.1
- VITE v7.0.6
- PHP 8.0+
- Composer
- Node.js 14+
- npm or yarn
- PostgreSQL

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/abdelkadergelany/feedback-web-app.git
   cd product-feedback-tool
   ```

2. Install PHP dependencies:
   ```bash
   composer install
   ```

3. Install JavaScript dependencies:
   ```bash
   npm install
   ```

4. Create a copy of the .env file:
   ```bash
   cp .env.example .env
   ```

5. Generate application key:
   ```bash
   php artisan key:generate
   ```

6. Configure your PostgreSQL database in the `.env` file:
   ```ini
   DB_CONNECTION=pgsql
   DB_HOST=127.0.0.1
   DB_PORT=5432
   DB_DATABASE=feedback_tool
   DB_USERNAME=postgres
   DB_PASSWORD=your_password
   ```

7. Run database migrations and seeders:
   ```bash
   php artisan migrate --seed
   ```

8. Compile frontend assets:
   ```bash
   npm run dev
   ```

9. Start the development server:
   ```bash
   php artisan serve
   ```

## Usage

Access the application at [https://feedback-web-app-production.up.railway.app]

Register a new account or login with:

- **Email**: admin@example.com  
- **Password**: password  

Navigate to the feedback section to submit or view feedback.
